"use client"

import { type SetStateAction, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaFilter,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa"
import { TiDelete } from "react-icons/ti"
import { HiOutlineExclamationTriangle } from "react-icons/hi2"
import { getSession } from "next-auth/react"

// Extend the NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      token?: string
    }
  }
}

// Spinner component
const Spinner = () => (
  <motion.div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#ff6c2f] border-r-transparent"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
  />
)

export default function ModernInventoryTable() {
  interface Customer {
    id: string
    itemName: string
    requestedQty: number
    headOfTailoring: string
    status: string
    orderId: string
    date: string
    color: string
  }

  const [data, setData] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending")
  const [searchTerm, setSearchTerm] = useState("")

  const rowsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const session = await getSession()
        const accessToken = session?.user?.token
        if (!accessToken) {
          throw new Error("No token found, please log in.")
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/allstorerequests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const result = await response.json()
        if (result.data && Array.isArray(result.data)) {
          const filteredData: Customer[] = result.data.map((item: any) => ({
            id: item.id,
            itemName: item.items_name,
            color: item.requested_color || "N/A",
            requestedQty: Number(item.requested_quantities),
            headOfTailoring: item.requested_by_name,
            status: item.status,
            orderId: item.order_id_for_the_job,
            date: new Date(item.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
          }))
          setData(filteredData)
        } else {
          setData([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setPopupMessage("Error fetching data")
        setTimeout(() => setPopupMessage(null), 5000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleReject = async (id: string) => {
    if (!selectedCustomerId) return

    try {
      const session = await getSession()
      const accessToken = session?.user?.token
      if (!accessToken) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/rejectrequestfororderid/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

          body: JSON.stringify({
            "feedback": "Request cannot be granted",
          }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject request")
      }

      setData((prevData) => prevData.filter((customer) => customer.id !== selectedCustomerId))

      setPopupMessage("Request successfully rejected")
      setTimeout(() => setPopupMessage(null), 5000)
    } catch (error) {
      console.error("Error rejecting request:", error)
      setPopupMessage("Error rejecting request")
      setTimeout(() => setPopupMessage(null), 5000)
    } finally {
      setIsPopupOpen(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const session = await getSession()
      const accessToken = session?.user?.token
      if (!accessToken) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/acceptrequestfororderid/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to approve request")
      }

      setData((prevData) =>
        prevData.map((customer) => (customer.id === id ? { ...customer, status: "approved" } : customer)),
      )

      setPopupMessage("Request successfully approved")
      setTimeout(() => setPopupMessage(null), 5000)
    } catch (error) {
      console.error("Error approving request:", error)
      setPopupMessage("Error approving request")
      setTimeout(() => setPopupMessage(null), 5000)
    }
  }

  // Filter data based on selected status and search term
  const filteredData = data.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesSearch =
      searchTerm === "" ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.headOfTailoring.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handlePageChange = (newPage: SetStateAction<number>) => {
    if (typeof newPage === "number" && newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock className="w-4 h-4" />
      case "approved":
        return <FaCheckCircle className="w-4 h-4" />
      case "rejected":
        return <FaTimesCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filterOptions = [
    {
      value: "pending",
      label: "Pending",
      icon: FaClock,
      count: data.filter((item) => item.status === "pending").length,
    },
    {
      value: "approved",
      label: "Approved",
      icon: FaCheckCircle,
      count: data.filter((item) => item.status === "approved").length,
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: FaTimesCircle,
      count: data.filter((item) => item.status === "rejected").length,
    },
    { value: "all", label: "All", icon: FaFilter, count: data.length },
  ]

  return (
    <motion.div
      className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheck className="w-4 h-4" />
            {popupMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Header Section */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Inventory Requests</h1>
          <p className="text-gray-600 text-lg">Review and manage inventory requests awaiting your approval</p>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by item, order ID, or requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value as any)
                      setCurrentPage(1)
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      statusFilter === option.value
                        ? "bg-[#ff6c2f] text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-4 h-4" />
                    {option.label}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        statusFilter === option.value ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {option.count}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  {[
                    "Order ID",
                    "Request ID",
                    "Item Name",
                    "Quantity",
                    "Color",
                    "Requester",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((header, index) => (
                    <motion.th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    >
                      {header}
                    </motion.th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <Spinner />
                        <p className="text-gray-500">Loading requests...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16">
                      <motion.div
                        className="flex flex-col items-center gap-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaSearch className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">No requests found</h3>
                          <p className="text-gray-500">Try adjusting your filters or search terms</p>
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="wait">
                    {paginatedData.map((row, index) => (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "#f8fafc" }}
                        className="border-b border-gray-100 hover:shadow-sm transition-all duration-200"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.orderId}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.itemName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {row.requestedQty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <div
                              className={`w-3 h-3 rounded-full border ${
                                row.color === "N/A"
                                  ? "bg-gray-200"
                                  : row.color === "blue"
                                    ? "bg-blue-500"
                                    : row.color === "black"
                                      ? "bg-gray-800"
                                      : row.color === "red"
                                        ? "bg-red-500"
                                        : row.color === "Gold"
                                          ? "bg-yellow-400"
                                          : "bg-gray-300"
                              }`}
                            />
                            {row.color}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.headOfTailoring}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.status)}`}
                          >
                            {getStatusIcon(row.status)}
                            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            {row.status === "pending" && (
                              <motion.button
                                onClick={() => handleApprove(row.id)}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Approve request"
                              >
                                <FaCheck className="w-4 h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              onClick={() => {
                                setSelectedCustomerId(row.id)
                                setIsPopupOpen(true)
                              }}
                              className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Reject request"
                            >
                              <TiDelete className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <motion.div
              className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">{currentPage * rowsPerPage - rowsPerPage + 1}</span> to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(currentPage * rowsPerPage, filteredData.length)}
                </span>{" "}
                of <span className="font-semibold text-gray-900">{filteredData.length}</span> entries
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  className="p-3 text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                >
                  <FaArrowLeft className="w-4 h-4" />
                </motion.button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage + i - 2
                  return page > 0 && page <= totalPages ? page : null
                })
                  .filter(Boolean)
                  .map((page) => (
                    <motion.button
                      key={page}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        page === currentPage
                          ? "bg-[#ff6c2f] text-white shadow-lg"
                          : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePageChange(page!)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  ))}

                <motion.button
                  className="p-3 text-gray-600 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                  whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                >
                  <FaArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Confirmation Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsPopupOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <HiOutlineExclamationTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Reject Request</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to reject this inventory request? 
                </p>
                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors duration-200"
                    onClick={() => handleReject(selectedCustomerId)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reject Request
                  </motion.button>
                  <motion.button
                    className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => setIsPopupOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
