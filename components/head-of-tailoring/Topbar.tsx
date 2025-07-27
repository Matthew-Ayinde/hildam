"use client"

import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import LogoutButton from "./Logout"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { IoNotificationsOutline, IoChevronDownOutline, IoCheckmarkDoneOutline, IoMailOutline } from "react-icons/io5"
import { HiOutlineBell, HiOutlineInboxIn, HiOutlineUserCircle, HiOutlineClock } from "react-icons/hi"
import { FiMessageSquare } from "react-icons/fi"
import { fetchAllNotifications, readAllNotification, readNotification } from "@/app/api/apiClient"

type Notification = {
  id: string
  message: string
  link: string
  read: string
  created_at: string
  action_type: string
}

interface TopbarProps {
  onNotificationUpdate?: (notifications: Notification[], unreadCount: number) => void
}

const Topbar = ({ onNotificationUpdate }: TopbarProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [userName, setUserName] = useState("Head Of Tailoring")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession()
      const token = session?.user?.token
      const name = session?.user?.name || "Head of Tailoring"


      if (!token) {
        throw new Error("No token found, please log in.")
      }
      
      setUserName(name.charAt(0).toUpperCase() + name.slice(1))
      
    }
    fetchUserData()
  }, [])

  const fetchNotifications = async () => {
    try {
      setError(null)
      const session = await getSession()
      const token = session?.user?.token

      if (!token) {
        throw new Error("No token found, please log in.")
      }

      const response = await fetchAllNotifications()

      // Limit to latest 30 notifications
      const latestNotifications = response.slice(0, 30)
      setNotifications(latestNotifications)
      const unread = latestNotifications.filter((notif: any) => notif.read === "0").length
      setUnreadCount(unread)

      // Notify parent component (sidebar) about notification updates
      if (onNotificationUpdate) {
        onNotificationUpdate(latestNotifications, unread)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("Cannot fetch notifications")
    }
  }

  useEffect(() => {
    fetchNotifications()
    const intervalId = setInterval(() => {
      fetchNotifications()
    }, 2000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const markAsRead = async (id: string, message: string, link: string) => {
    setDropdownOpen(false)
    try {
      const resp = await readNotification(id)
      console.log("Notification marked as read:", resp)

      const updatedNotifications = notifications.map((notif) => (notif.id === id ? { ...notif, read: "1" } : notif))
      setNotifications(updatedNotifications)
      const newUnreadCount = unreadCount - 1
      setUnreadCount(newUnreadCount)

      // Update parent component
      if (onNotificationUpdate) {
        onNotificationUpdate(updatedNotifications, newUnreadCount)
      }

      const linking_id = link.split("/").pop()
      if (link.includes("tailoring")) {
        router.push("/head-of-tailoring/jobs/" + linking_id)
      }
      if (link.includes("payments")) {
        router.push("/admin/payments/" + linking_id)
      }
      if (link.includes("job-expenses")) {
        router.push("/admin/job-expenses/" + linking_id)
      }
      if (link.includes("storerequest")) {
        router.push("/admin/inventory/requests/")
      }
      if (link.includes("expenses")) {
        router.push("/admin/expenses/" + linking_id)
      }
    } catch (error) {
      console.log("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setDropdownOpen(false)
      const resp = await readAllNotification()
      console.log("All notifications marked as read", resp)

      const updatedNotifications = notifications.map((notif) => ({ ...notif, read: "1" }))
      setNotifications(updatedNotifications)
      setUnreadCount(0)

      // Update parent component
      if (onNotificationUpdate) {
        onNotificationUpdate(updatedNotifications, 0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Group notifications by date
  const getNotificationDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const groupedNotifications = notifications.reduce((groups: Record<string, Notification[]>, notification) => {
    const date = getNotificationDate(notification.created_at)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
    return groups
  }, {})

  // Get notification icon based on content
  const getNotificationIcon = (message: string) => {
    if (message.toLowerCase().includes("order")) {
      return <HiOutlineInboxIn className="text-blue-500" size={18} />
    } else if (message.toLowerCase().includes("payment")) {
      return <IoMailOutline className="text-green-500" size={18} />
    } else if (message.toLowerCase().includes("inventory")) {
      return <HiOutlineClock className="text-purple-500" size={18} />
    } else {
      return <FiMessageSquare className="text-orange-500" size={18} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 rounded-2xl mt-5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side - User Info */}
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome back, {userName}</h1>
              <p className="text-sm text-orange-600 font-medium">Head of Tailoring</p>
            </div>
          </div>

          {/* Right Side - Notifications & Profile - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative p-3 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <IoNotificationsOutline size={24} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-medium"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 mt-3 z-50 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-5 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={markAllAsRead}
                            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-medium transition-colors"
                          >
                            <span className="flex items-center gap-1">
                              <IoCheckmarkDoneOutline size={14} />
                              Mark all read
                            </span>
                          </motion.button>
                        )}
                      </div>
                      <p className="text-sm text-orange-50 mt-1">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
                      </p>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[450px] overflow-y-auto">
                      {error && (
                        <div className="p-6 text-center">
                          <p className="text-red-500 text-sm">{error}</p>
                        </div>
                      )}

                      {!error && notifications.length === 0 && (
                        <div className="p-8 text-center">
                          <div className="bg-orange-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                            <HiOutlineBell className="text-orange-400" size={28} />
                          </div>
                          <p className="text-gray-600 font-medium">No notifications</p>
                          <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
                        </div>
                      )}

                      {Object.entries(groupedNotifications).map(([date, notifs]) => (
                        <div key={date}>
                          <div className="bg-gray-50 px-6 py-3 sticky top-0 z-10">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{date}</p>
                          </div>
                          {notifs.map((notif) => (
                            <motion.div
                              key={notif.id}
                              whileHover={{ backgroundColor: "#f9fafb" }}
                              onClick={() => markAsRead(notif.id, notif.message, notif.link)}
                              className={`flex items-start gap-4 px-6 py-4 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors ${
                                notif.read === "0" ? "bg-orange-50" : ""
                              }`}
                            >
                              <div
                                className={`mt-1 p-2.5 rounded-full ${
                                  notif.read === "0" ? "bg-orange-100" : "bg-gray-100"
                                }`}
                              >
                                {getNotificationIcon(notif.message)}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm leading-relaxed ${
                                    notif.read === "0" ? "font-medium text-gray-900" : "text-gray-700"
                                  }`}
                                >
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <HiOutlineClock size={12} />
                                    {formatTimeAgo(notif.created_at)}
                                  </span>
                                </div>
                              </div>
                              {notif.read === "0" && (
                                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ))}

                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <Link href="/head-of-tailoring/notifications" passHref>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm text-orange-600 hover:text-orange-700 font-semibold shadow-sm hover:shadow-md transition-all"
                            onClick={() => setDropdownOpen(false)}
                          >
                            See more notifications
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative" ref={profileDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200">
                  <Image
                    src="/no-profile.jpg"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <IoChevronDownOutline size={16} className="text-gray-400" />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 mt-3 z-50 overflow-hidden"
                  >
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                          <Image
                            src="/no-profile.jpg"
                            alt="Profile"
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{userName}</p>
                          <p className="text-sm text-orange-600">Head of Tailoring</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 border-t border-gray-100">
                      <div className="px-5 py-3">
                        <LogoutButton />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Topbar
