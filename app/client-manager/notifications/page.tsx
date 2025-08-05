"use client"

import React, { useState, useEffect, useCallback } from "react"
import { getSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  HiOutlineBell,
  HiOutlineInboxIn,
  HiOutlineClock,
  HiOutlineSearch,
  HiOutlineCheck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi"
import { IoMailOutline, IoCheckmarkDoneOutline } from "react-icons/io5"
import { FiMessageSquare } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchAllNotifications, readAllNotification, readNotification } from "@/app/api/apiClient"

type Notification = {
  id: string
  message: string
  link: string | null // Updated to allow null
  is_read: boolean // API sends boolean
  created_at: string
  type?: string // Derived from message content
  read?: string // Added for robustness if 'is_read' is not always present or boolean
}

export default function NotificationsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL // Kept as it was in original code
  const [notifications, setNotifications] = useState<Notification[]>([]) // Holds current page's data from API
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]) // Holds filtered data of current page
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNotificationsCount, setTotalNotificationsCount] = useState(0) // New state for total count
  const itemsPerPage = 10 // Changed to 10 as per API response example

  // Filters
  const [filterType, setFilterType] = useState<string>("all")
  const [filterRead, setFilterRead] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const getNotificationType = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("order")) return "order"
    if (lowerMessage.includes("payment")) return "payment"
    if (lowerMessage.includes("inventory")) return "inventory"
    return "other"
  }

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const session = await getSession()
      const token = session?.user?.token
      if (!token) {
        throw new Error("No token found, please log in.")
      }
      const resp = await fetchAllNotifications(itemsPerPage, currentPage)
      console.log("Fetched notifications response:", resp)

      const data = resp.data // Access the 'data' array within the 'data' object
      const processedNotifications = data.map((notif: Notification) => ({
        ...notif,
        // Prioritize 'is_read' if it's a boolean, otherwise use 'read' string
        is_read: typeof notif.is_read === "boolean" ? notif.is_read : notif.read === "1",
        type: getNotificationType(notif.message),
      }))
      setNotifications(processedNotifications)
      setCurrentPage(resp.current_page)
      setTotalPages(resp.last_page)
      setTotalNotificationsCount(resp.total)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage]) // Dependencies for useCallback

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications]) // Trigger fetch when fetchNotifications changes (due to currentPage/itemsPerPage)

  useEffect(() => {
    // Apply filters to the notifications fetched for the current page
    let filtered = [...notifications]

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((notif) => notif.type === filterType)
    }
    // Apply read/unread filter
    if (filterRead === "read") {
      filtered = filtered.filter((notif) => notif.is_read === true)
    } else if (filterRead === "unread") {
      filtered = filtered.filter((notif) => notif.is_read === false)
    }
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((notif) => notif.message.toLowerCase().includes(query))
    }
    setFilteredNotifications(filtered)
  }, [notifications, filterType, filterRead, searchQuery]) // Dependencies for filtering

  const markAsRead = async (id: string) => {
    try {
      const session = await getSession()
      const token = session?.user?.token
      if (!token) {
        throw new Error("No token found, please log in.")
      }
      await readNotification(id)
      // Update local state to reflect the change immediately
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const session = await getSession()
      const token = session?.user?.token
      if (!token) {
        throw new Error("No token found, please log in.")
      }
      await readAllNotification()
      // After marking all as read on the backend, refetch the current page to update UI
      fetchNotifications()
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <HiOutlineInboxIn className="text-blue-500" size={20} />
      case "payment":
        return <IoMailOutline className="text-green-500" size={20} />
      case "inventory":
        return <HiOutlineClock className="text-purple-500" size={20} />
      default:
        return <FiMessageSquare className="text-orange-500" size={20} />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order":
        return "Order"
      case "payment":
        return "Payment"
      case "inventory":
        return "Inventory"
      default:
        return "Message"
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "inventory":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-orange-100 text-orange-800"
    }
  }

  // paginatedNotifications is now just filteredNotifications, as pagination is handled by API
  const paginatedNotifications = filteredNotifications

  const unreadCount = notifications.filter((notif) => notif.is_read === false).length

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors self-start"
            >
              <IoCheckmarkDoneOutline size={18} />
              <span>Mark all as read</span>
            </motion.button>
          )}
        </div>
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <HiOutlineSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-48">
                <Select value={filterRead} onValueChange={setFilterRead}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All notifications</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterType("all")
                  setFilterRead("all")
                  setSearchQuery("")
                }}
                className="w-full sm:w-auto"
              >
                Reset filters
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-6 text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-1">Error loading notifications</h3>
          <p className="text-gray-500">{error}</p>
        </motion.div>
      ) : totalNotificationsCount === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
        >
          <div className="bg-orange-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <HiOutlineBell className="text-orange-400" size={36} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery || filterType !== "all" || filterRead !== "all"
              ? "Try changing your filters to see more results."
              : "You're all caught up! No notifications to display."}
          </p>
          {(searchQuery || filterType !== "all" || filterRead !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setFilterType("all")
                setFilterRead("all")
                setSearchQuery("")
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {paginatedNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              variants={itemVariants}
              className={`bg-white rounded-xl shadow-sm border ${
                notification.is_read === false ? "border-orange-200 ring-1 ring-orange-100" : "border-gray-100"
              } p-5 transition-all hover:shadow-md`}
            >
              <div className="flex gap-4">
                <div className={`p-3 rounded-full ${notification.is_read === false ? "bg-orange-100" : "bg-gray-100"}`}>
                  {getNotificationIcon(notification.type || "other")}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(notification.type || "other")}`}
                      >
                        {getTypeLabel(notification.type || "other")}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{formatTimeAgo(notification.created_at)}</span>
                      {notification.is_read === false && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm sm:text-base ${
                      notification.is_read === false ? "font-medium text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        // Handle navigation logic here
                        const linking_id = notification.link?.split("/").pop() // Use optional chaining for link
                        // You can add your navigation logic here, e.g., router.push(notification.link)
                      }}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      View details
                    </Button>
                    {notification.is_read === false && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <HiOutlineCheck className="mr-1" size={16} />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalNotificationsCount)} of {totalNotificationsCount}{" "}
                notifications
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <HiOutlineChevronLeft size={16} />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first page, last page, current page, and pages around current page
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <HiOutlineChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
