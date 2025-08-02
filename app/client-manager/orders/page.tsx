"use client"

import { useEffect, useState } from "react"
import { FaArrowRight, FaArrowLeft, FaClipboardList, FaFilter, FaSearch } from "react-icons/fa"
import { IoEyeOutline, IoCalendarOutline } from "react-icons/io5"
import { MdOutlineDeleteForever, MdFilterList } from "react-icons/md"
import { HiOutlineRefresh } from "react-icons/hi"
import { useRouter } from "next/navigation"
import Spinner from "@/components/Spinner"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getSession } from "next-auth/react"
import OrdersAnalyticsChart from "./OrdersChart"
import { deleteOrder, fetchOrderslist } from "@/app/api/apiClient"


export default function Table() {
  interface Order {
    head_of_tailoring: string
    id: any
    order_id: string
    date_created: string
    cloth_name: string
    customer_name: string
    priority: string
    order_status: string
  }

  const [data, setData] = useState<Order[]>([])
  const [filteredData, setFilteredData] = useState<Order[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<"success" | "error" | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [filterValue, setFilterValue] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)
  const rowsPerPage = 10
  const router = useRouter()

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  useEffect(() => {
    const fetchOrders = async () => {


     try {
        setLoading(true)
        setError(null)

        const response = await fetchOrderslist()

        const result = response.orders
        console.log('order list', result)       
        setData(result)
        setFilteredData(result)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "An unexpected error occurred")
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleFilter = () => {
    let filtered = data

    if (filterCategory === "Customer" && filterValue) {
      filtered = filtered.filter((order) => order.customer_name.toLowerCase().includes(filterValue.toLowerCase()))
    } else if (filterCategory === "Cloth Name" && filterValue) {
      filtered = filtered.filter((order) => order.cloth_name.toLowerCase().includes(filterValue.toLowerCase()))
    } else if (filterCategory === "Priority" && filterValue) {
      filtered = filtered.filter((order) => order.priority === filterValue)
    } else if (filterCategory === "Order Status" && filterValue) {
      filtered = filtered.filter((order) => order.order_status === filterValue)
    } else if (filterCategory === "Date" && startDate && !endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date_created)
        return orderDate >= new Date(startDate)
      })
    } else if (filterCategory === "Date" && !startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date_created)
        return orderDate <= new Date(endDate)
      })
    } else if (filterCategory === "Date" && startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date_created)
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
      })
    }

    setFilteredData(filtered)
    if (filtered.length === 0) {
      setToastMessage("No results found")
      setToastType("error")
    }
  }

  const handleReset = () => {
    setFilterCategory("")
    setFilterValue("")
    setStartDate("")
    setEndDate("")
    setFilteredData(data)
  }

  const handleDelete = async (id: any) => {
    setIsPopupOpen(false)

    const orderId = selectedUserId

    try {
      const result = await deleteOrder(orderId)
      if (result.status !== 200) {
        throw new Error("Failed to delete order")
      }

      setData((prevData) => prevData.filter((order) => order.id !== selectedUserId))
      setFilteredData((prevData) => prevData.filter((order) => order.id !== selectedUserId))

      setToastMessage("Order deleted successfully")
      setToastType("success")
    } catch (error) {
      if (error instanceof Error) {
        setToastMessage(error.message || "An unexpected error occurred")
      } else {
        setToastMessage("An unexpected error occurred")
      }
      setToastType("error")
    } finally {
      setTimeout(() => {
        setToastMessage(null)
        setToastType(null)
      }, 3000)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "closed":
        return "text-green-700 bg-green-50 border-green-200"
      case "processing":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "pending":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full relative space-y-6"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl text-white shadow-lg z-50 ${
              toastType === "success"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      

      {/* <OrdersAnalyticsChart /> */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and track all your orders</p>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200"
              >
                <MdFilterList className="text-lg" />
                <span className="font-medium">Filters</span>
              </motion.button>

              <Link href="/client-manager/orders/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-[#ff6c2f] to-[#ff8c5f] hover:from-[#ff5722] hover:to-[#ff7043] text-white rounded-xl font-medium shadow-sm transition-all duration-200"
                >
                  <span>Create Order</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-4 bg-gray-50 border-b border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value)
                      setFilterValue("")
                      setStartDate("")
                      setEndDate("")
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    <option value="Customer">Customer</option>
                    <option value="Cloth Name">Cloth Name</option>
                    <option value="Priority">Priority</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Date">Date</option>
                  </select>
                </div>

                {filterCategory === "Priority" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                ) : filterCategory === "Order Status" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Status</option>
                      <option value="completed">Completed</option>
                      <option value="processing">Processing</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                ) : filterCategory === "Date" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </>
                ) : filterCategory ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        placeholder="Type to filter..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6c2f] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFilter}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#ff6c2f] hover:bg-[#ff5722] text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <FaFilter />
                  <span>Apply Filter</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <HiOutlineRefresh />
                  <span>Reset</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                className="text-[#ff6c2f] hover:text-[#ff5722] underline font-medium"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["Order ID", "Date", "Customer", "Cloth Name", "Priority", "Status", "Manager", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FaClipboardList className="text-gray-400 text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                          <p className="text-gray-500 mb-6">Get started by creating your first order</p>
                          <Link href="/client-manager/orders/create">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 bg-[#ff6c2f] hover:bg-[#ff5722] text-white rounded-xl font-medium transition-colors duration-200"
                            >
                              Create Order
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.order_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <IoCalendarOutline className="text-gray-400" />
                          <span>{formatDate(row.date_created)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#da6d35]">{row.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{row.cloth_name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(row.priority || "medium")}`}
                        >
                          {row.priority || "medium"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(row.order_status || "pending")}`}
                        >
                          {row.order_status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{row.head_of_tailoring || "Not Assigned"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/client-manager/orders/${row.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-[#ff6c2f] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                            >
                              <IoEyeOutline size={18} />
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedUserId(row.id)
                              setIsPopupOpen(true)
                            }}
                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <MdOutlineDeleteForever size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{currentPage * rowsPerPage - rowsPerPage + 1}</span>{" "}
                -{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(currentPage * rowsPerPage, filteredData.length)}
                </span>{" "}
                of <span className="font-medium text-gray-900">{filteredData.length}</span> orders
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <FaArrowLeft size={14} />
                </motion.button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage - 2 + i
                  return page > 0 && page <= totalPages ? page : null
                })
                  .filter(Boolean)
                  .map((page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        page === currentPage
                          ? "bg-[#ff6c2f] text-white shadow-sm"
                          : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handlePageChange(page!)}
                    >
                      {page}
                    </motion.button>
                  ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <FaArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsPopupOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdOutlineDeleteForever className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Order</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this order? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200"
                    onClick={handleDelete}
                  >
                    Delete
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
