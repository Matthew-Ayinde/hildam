"use client"

import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoCheckmarkDone, IoTime, IoClose } from "react-icons/io5"
import { HiBell, HiOutlineBell } from "react-icons/hi"
import LogoutButton from "./Logout"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"

type Notification = {
  id: string
  message: string
  link: string
  read: string
  created_at: string
}

const Topbar = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [userName, setUserName] = useState("USER")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchNotifications = async () => {
      const session = await getSession() // Get session from NextAuth
      const token = session?.user?.token // Access token from session
      if (!token) {
        throw new Error("No token found, please log in.")
      }
      if (token) {
        try {
          const base64Url = token.split(".")[1]
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
          const payload = JSON.parse(atob(base64))
          if (payload?.name) {
            setUserName(payload.name)
          }
        } catch (error) {
          console.error("Error decoding token:", error)
        }
      }
    }

    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setError(null)
      const session = await getSession() // Get session from NextAuth
      const token = session?.user?.token // Access token from session
      if (!token) {
        throw new Error("No token found, please log in.")
      }

      const response = await fetch(`${baseUrl}/allnotifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      if (data.status === "success") {
        setNotifications(data.data)
        setUnreadCount(data.data.filter((notif: any) => notif.read === "0").length)
      } else {
        throw new Error("Cannot fetch notifications")
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
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const markAsRead = async (id: string, message: string, link: string) => {
    try {
      const session = await getSession() // Get session from NextAuth
      const token = session?.user?.token // Access token from session
      if (!token) {
        throw new Error("No token found, please log in.")
      }
      if (!token) throw new Error("No access token found")

      await fetch(`${baseUrl}/readnotification/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, link }),
      })

      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: "1" } : notif)))
      setUnreadCount((prev) => prev - 1)
      setDropdownOpen(false)

      const linking_id = link.split("/").pop()
      if (link.includes("tailorjoblist")) {
        router.push("/head-of-tailoring/jobs/" + linking_id)
      }
      // if (link.includes("projectlist")) {
      //   router.push("/admin/joblists/projects/" + linking_id);
      // }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const session = await getSession() // Get session from NextAuth
      const token = session?.user?.token // Access token from session
      if (!token) {
        throw new Error("No token found, please log in.")
      }
      if (!token) throw new Error("No access token found")

      await fetch(`${baseUrl}/readallnotification`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }

    setDropdownOpen(false)
  }

  return (
    <div className="mt-5">
      <div className="shadow-xl rounded-2xl lg:flex justify-between items-center py-4 px-6 text-gray-700 bg-white border border-gray-100">
        <div className="text-xl font-bold">
          <div className="uppercase">Welcome, {userName}</div>
          <div className="text-sm mt-1">Role: Head of Tailoring</div>
        </div>
        <div className="lg:flex hidden items-center gap-4 relative" ref={dropdownRef}>
          <LogoutButton />
          <div
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer group"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-full bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300"
            >
              {unreadCount > 0 ? (
                <HiBell size={24} className="text-orange-600" />
              ) : (
                <HiOutlineBell size={24} className="text-gray-600" />
              )}
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-semibold shadow-lg"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 overflow-hidden mt-2"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                  <div className="flex items-center gap-2">
                    <HiBell className="text-orange-600 w-5 h-5" />
                    <span className="font-semibold text-gray-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1 text-white bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 rounded-lg hover:from-orange-600 hover:to-orange-700 text-xs font-medium shadow-md transition-all duration-200"
                        onClick={() => markAllAsRead()}
                      >
                        <IoCheckmarkDone className="w-3 h-3" />
                        Mark All Read
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDropdownOpen(false)}
                      className="p-1 rounded-full hover:bg-orange-200 transition-colors duration-200"
                    >
                      <IoClose className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-80 overflow-y-auto">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 text-center text-red-500 bg-red-50 border-l-4 border-red-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <IoClose className="w-4 h-4" />
                        {error}
                      </div>
                    </motion.div>
                  )}

                  {!error && notifications.filter((notif) => notif.read === "0").length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <HiOutlineBell className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">All caught up!</p>
                      <p className="text-gray-400 text-sm mt-1">No new notifications</p>
                    </motion.div>
                  )}

                  {!error &&
                    notifications
                      .filter((notif) => notif.read === "0")
                      .map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                          className="p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200"
                          onClick={() => markAsRead(notification.id, notification.message, notification.link)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <IoTime className="w-3 h-3" />
                                <span>{new Date(notification.created_at).toLocaleString()}</span>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="p-1 rounded-full hover:bg-orange-100 transition-colors duration-200"
                            >
                              <IoCheckmarkDone className="w-4 h-4 text-gray-400" />
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}

                  {notifications.filter((notif) => notif.read === "0").length > 4 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 border-t border-gray-200"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/head-of-tailoring")}
                        className="w-full text-white px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-md"
                      >
                        View All Notifications
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-10 h-10">
            <Image
              src="/no-profile.jpg"
              alt="Profile"
              width={500}
              height={500}
              className="rounded-full border-2 border-orange-200 shadow-lg hover:border-orange-300 transition-all duration-300"
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
