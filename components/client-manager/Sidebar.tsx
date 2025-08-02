"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { FaUsers, FaShoppingCart, FaUser, FaMoneyBillWave } from "react-icons/fa"
import { IoIosArrowDown, IoMdNotificationsOutline } from "react-icons/io"
import { IoCheckmarkDoneOutline, IoNotificationsOutline } from "react-icons/io5"
import Image from "next/image"
import { MdDashboard, MdOutlinePayment, MdOutlineInventory2 } from "react-icons/md"
import { usePathname } from "next/navigation"
import { HiMenuAlt3, HiX, HiOutlineBell, HiOutlineClock } from "react-icons/hi"
import LogoutButton from "../LogoutMobile"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FiMessageSquare } from "react-icons/fi"
import { HiOutlineInboxIn } from "react-icons/hi"
import { IoMailOutline } from "react-icons/io5"

type Notification = {
  id: string
  message: string
  link: string
  is_read: boolean
  created_at: string
}

interface SidebarProps {
  notifications?: Notification[]
  unreadCount?: number
  onMarkAsRead?: (id: string, message: string, link: string) => void
  onMarkAllAsRead?: () => void
}

const sidebarItems = [
  {
    id: 1,
    text: "Customers",
    icon: <FaUsers />,
    prefix: "/client-manager/customers",
    links: [
      { name: "All Customers", href: "/client-manager/customers" },
      { name: "Add Customer", href: "/client-manager/customers/create" },
    ],
  },
  {
    id: 2,
    text: "Orders",
    icon: <FaShoppingCart />,
    prefix: "/client-manager/orders",
    links: [
      { name: "All Orders", href: "/client-manager/orders" },
      { name: "Create Order", href: "/client-manager/orders/create" },
    ],
  },
  {
    id: 4,
    text: "Payments",
    icon: <MdOutlinePayment />,
    prefix: "/client-manager/payments",
    links: [
      { name: "All Payments", href: "/client-manager/payments" }
    ],
  },
  {
    id: 5,
    text: "Inventory",
    icon: <MdOutlineInventory2 />,
    prefix: "/client-manager/inventory",
    links: [
      { name: "All Items", href: "/client-manager/inventory" },
      { name: "Add Item", href: "/client-manager/inventory/create" },
      { name: "Requests", href: "/client-manager/inventory/requests" }
    ],
  },
  {
    id: 9,
    text: "Calendar",
    icon: <Calendar className="w-4 h-4" />,
    prefix: "/client-manager/calendar",
    links: [
      { name: "Schedule", href: "/client-manager/calendar" },
    ],
  },
  {
    id: 6,
    text: "Expenses",
    icon: <FaMoneyBillWave />,
    prefix: "/client-manager/expense",
    links: [
      { name: "Job Expenses", href: "/client-manager/expenses" },
      { name: "Daily Expenses", href: "/client-manager/expenses/daily-expenses" },
    ],
  },
]

const Sidebar = ({ notifications = [], unreadCount = 0, onMarkAsRead, onMarkAllAsRead }: SidebarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({})
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const isActive = (prefix: string) => pathname.startsWith(prefix)

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleMarkAsRead = (id: string, message: string, link: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id, message, link)
    }
    setDropdownOpen(false)
    closeSidebar()
  }

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead()
    }
    setDropdownOpen(false)
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

  const getNotificationIcon = (message: string) => {
    if (message.toLowerCase().includes("order")) {
      return <HiOutlineInboxIn className="text-blue-400" size={16} />
    } else if (message.toLowerCase().includes("payment")) {
      return <IoMailOutline className="text-green-400" size={16} />
    } else if (message.toLowerCase().includes("inventory")) {
      return <HiOutlineClock className="text-purple-400" size={16} />
    } else {
      return <FiMessageSquare className="text-orange-400" size={16} />
    }
  }

  // Auto-expand active menu on large screens
  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (isActive(item.prefix)) {
        setOpenMenus((prev) => ({ ...prev, [item.id]: true }))
      }
    })
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownRef])

  return (
    <>
      {/* Mobile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden fixed top-0 w-full bg-gradient-to-r from-[#262d34] to-[#1a1f24] text-white flex justify-between items-center px-4 py-4 z-50 shadow-lg backdrop-blur-sm"
      >
        <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-orange-500 p-1">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" />
          </div>
          <div className="ml-3">
            <div className="text-white font-bold text-lg">HildaM Couture</div>
            <div className="text-orange-300 text-xs font-medium">Client Manager Panel</div>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          {/* Mobile Notifications */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="relative p-2.5 text-white hover:text-orange-300 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <IoNotificationsOutline size={22} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Notifications Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 mt-3 z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-4 text-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <HiOutlineBell size={20} />
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      {unreadCount > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleMarkAllAsRead}
                          className="text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-full font-medium transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            <IoCheckmarkDoneOutline size={12} />
                            Mark all
                          </span>
                        </motion.button>
                      )}
                    </div>
                    <p className="text-sm text-orange-50 mt-1">
                      {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                    </p>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <div className="bg-orange-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <HiOutlineBell className="text-orange-400" size={24} />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">No notifications</p>
                        <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <motion.div
                          key={notification.id}
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          onClick={() => handleMarkAsRead(notification.id, notification.message, notification.link)}
                          className={`flex items-start gap-3 p-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                            notification.is_read === false ? "bg-orange-50" : ""
                          }`}
                        >
                          <div
                            className={`mt-1 p-2 rounded-full ${notification.is_read === false ? "bg-orange-100" : "bg-gray-100"}`}
                          >
                            {getNotificationIcon(notification.message)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm leading-relaxed ${notification.is_read === false ? "font-medium text-gray-900" : "text-gray-700"}`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <HiOutlineClock size={10} />
                                {formatTimeAgo(notification.created_at)}
                              </span>
                            </div>
                          </div>
                          {notification.is_read === false && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          )}
                        </motion.div>
                      ))
                    )}

                    {notifications.length > 5 && (
                      <div className="p-3 border-t border-gray-100 bg-gray-50">
                        <Link href="/client-manager/notifications">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-orange-600 hover:text-orange-700 font-semibold shadow-sm hover:shadow-md transition-all"
                            onClick={() => setDropdownOpen(false)}
                          >
                            See all notifications
                          </motion.button>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2.5 text-white hover:text-orange-300 hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            {isSidebarOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
          </motion.button>
        </div>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#262d34] to-[#1a1f24] text-[#A5A8AB] shadow-2xl overflow-y-auto z-50 transition-all duration-300 w-80 lg:w-[280px] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo Section */}
        <motion.div
          className="mx-6 mt-8 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 p-2 shadow-lg">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <div className="ml-3">
              <div className="text-white font-bold text-xl">HildaM Couture</div>
              <div className="text-orange-300 text-sm font-medium">Client Manager Panel</div>
            </div>
          </div>
        </motion.div>

        {/* General Section */}
        <div className="mb-6 px-6">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">General</div>

          {/* Dashboard Link */}
          <motion.div
            className="relative mb-2"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-r-full transition-opacity duration-300 ${
                pathname === "/client-manager" ? "opacity-100" : "opacity-0"
              }`}
            ></div>
            <Link
              href="/client-manager"
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                pathname === "/client-manager"
                  ? "text-orange-400 bg-gradient-to-r from-orange-500/10 to-orange-600/5 shadow-lg"
                  : "text-[#A5A8AB] hover:text-orange-400 hover:bg-white/5"
              }`}
              onClick={closeSidebar}
            >
              <MdDashboard className={`text-lg ${pathname === "/client-manager" ? "text-orange-400" : ""}`} />
              <span>Dashboard</span>
            </Link>
          </motion.div>
        </div>

        {/* Navigation Items */}
        <div className="px-4 pb-10">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Management</div>

          <ul className="space-y-2">
            {sidebarItems.map((item, index) => {
              const isMenuOpen = openMenus[item.id] || isActive(item.prefix)
              return (
                <motion.li
                  key={item.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <div className="relative">
                    <div
                      className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-r-full transition-opacity duration-300 ${
                        isActive(item.prefix) ? "opacity-100" : "opacity-0"
                      }`}
                    ></div>
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMenu(item.id)}
                      className={`flex w-full items-center justify-between py-3 px-4 text-left text-base font-medium rounded-xl transition-all duration-300 ${
                        isActive(item.prefix)
                          ? "text-orange-400 bg-gradient-to-r from-orange-500/10 to-orange-600/5 shadow-lg"
                          : "text-[#A5A8AB] hover:text-orange-400 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`text-lg ${isActive(item.prefix) ? "text-orange-400" : ""}`}>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                      <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <IoIosArrowDown className="text-sm" />
                      </motion.div>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-6 mt-2 space-y-1 overflow-hidden border-l border-gray-600/30 pl-4"
                      >
                        {item.links.map((subItem) => (
                          <motion.li
                            key={subItem.name}
                            whileHover={{ x: 4 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Link
                              href={subItem.href}
                              className={`block px-3 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                                pathname === subItem.href
                                  ? "text-orange-400 bg-gradient-to-r from-orange-500/10 to-orange-600/5 font-medium shadow-md"
                                  : "text-[#A5A8AB] hover:text-orange-400 hover:bg-white/5"
                              }`}
                              onClick={closeSidebar}
                            >
                              <span className="flex items-center">
                                <span
                                  className={`w-2 h-2 rounded-full mr-3 ${pathname === subItem.href ? "bg-orange-400" : "bg-gray-500"}`}
                                ></span>
                                {subItem.name}
                              </span>
                            </Link>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </ul>

        </div>

                <div className="mb-6 px-6 pb-10">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Roles</div>

          {/* Dashboard Link */}
          <motion.div
            className="relative mb-2"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-r-full transition-opacity duration-300 ${
                pathname === "/client-manager/h-o-t" ? "opacity-100" : "opacity-0"
              }`}
            ></div>
            <Link
              href="/client-manager/h-o-t"
              className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                pathname === "/client-manager/h-o-t"
                  ? "text-orange-400 bg-gradient-to-r from-orange-500/10 to-orange-600/5 shadow-lg"
                  : "text-[#A5A8AB] hover:text-orange-400 hover:bg-white/5"
              }`}
              onClick={closeSidebar}
            >
              <MdDashboard className={`text-lg ${pathname === "/client-manager/h-o-t" ? "text-orange-400" : ""}`} />
              <span>Head of Tailoring</span>
            </Link>
          </motion.div>

                    {/* Mobile Logout */}
          <motion.div
            className="lg:hidden mt-8 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="border-t border-gray-600 pt-6">
              <LogoutButton />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
