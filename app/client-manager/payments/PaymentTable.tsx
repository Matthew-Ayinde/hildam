"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowRight, FaArrowLeft, FaMoneyBill, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa"
import { IoEyeOutline } from "react-icons/io5"
import { MdOutlineDeleteForever } from "react-icons/md"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSession } from "next-auth/react"
import { fetchAllPayments } from "@/app/api/apiClient"
import PaymentChart from "@/app/client-manager/payments/PaymentChart"

export default function ModernPaymentTable() {
  interface Order {
    payment_status: string
    id: any
    order_id: string
    created_at: string
    customer_name: string
    priority: string
    total_amount_due: string
  }

  const [data, setData] = useState<Order[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<"success" | "error" | null>(null)

  const rowsPerPage = 10
  const router = useRouter()
  const totalPages = Math.ceil(data.length / rowsPerPage)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchAllPayments()
        setData(response)
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

  const handleDelete = async (id: any) => {
    try {
      const session = await getSession()
      const token = session?.user?.token

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/deleteorder/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete order")
      }

      setData((prevData) => prevData.filter((order) => order.id !== selectedUserId))
      setIsPopupOpen(false)
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
      month: "long",
      year: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return <FaCheckCircle className="text-green-500" />
      case "pending":
      case "processing":
        return <FaClock className="text-orange-500" />
      case "failed":
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />
      default:
        return <FaClock className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
      case "processing":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "failed":
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full"
    />
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full relative min-h-screen"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-6 right-6 px-6 py-4 rounded-xl text-white shadow-lg z-50 ${
              toastType === "success"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-red-500 to-red-600"
            }`}
          >
            <div className="flex items-center space-x-2">
              {toastType === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
              <span className="font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <PaymentChart /> */}

      {/* Main Table Container */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
      >
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">Payment Management</h2>
          <p className="text-gray-600 mt-1">Manage and track all payment transactions</p>
        </div>

        {/* Table Content */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <LoadingSpinner />
            <p className="text-gray-600 mt-4 font-medium">Loading payments...</p>
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : data.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="text-center">
              <FaMoneyBill className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No payments found</h3>
              <p className="text-gray-500">There are no payment records to display at the moment.</p>
            </div>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Order ID", "Customer Name", "Total Amount", "Payment Status", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {paginatedData.map((row, index) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "#fef7f0" }}
                      className="hover:bg-orange-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                          {row.order_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-orange-600">{row.customer_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          {formatCurrency(Number.parseFloat(row.total_amount_due))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(row.payment_status)}
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              row.payment_status,
                            )}`}
                          >
                            {row.payment_status || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Link href={`/client-manager/payments/${row.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                            >
                              <IoEyeOutline size={16} />
                              <span>View</span>
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            onClick={() => {
                              setSelectedUserId(row.id)
                              setIsPopupOpen(true)
                            }}
                          >
                            <MdOutlineDeleteForever size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - Only show when there's data */}
        {!loading && !error && data.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between"
          >
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{currentPage * rowsPerPage - rowsPerPage + 1}</span> -{" "}
              <span className="font-medium text-gray-900">{Math.min(currentPage * rowsPerPage, data.length)}</span> of{" "}
              <span className="font-medium text-gray-900">{data.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-orange-500 text-white shadow-lg"
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
                className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <FaArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <MdOutlineDeleteForever className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this payment record? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                    onClick={handleDelete}
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setIsPopupOpen(false)}
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
