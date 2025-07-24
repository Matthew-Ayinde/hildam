"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowRight, FaArrowLeft, FaSearch, FaFilter, FaDownload } from "react-icons/fa"
import { IoEyeOutline, IoCalendarOutline, IoPersonOutline, IoShirtOutline } from "react-icons/io5"
import { HiOutlineClipboardList } from "react-icons/hi"
import { BiRefresh } from "react-icons/bi"
import Link from "next/link"
import { getSession } from "next-auth/react"
import { Briefcase, Calendar } from "lucide-react"
import { fetchAllTailorJobs } from "@/app/api/apiClient"

export default function ModernTable() {
  interface ProjectItem {
    items: string
    status: string
    id: number
    order_id: string
    amount: string
    assigned_at: string
    clothing_name: string
    clothing_description: string
    itemData: string
    itemQuantity: number
    date: string
    customer_name: string
    order_created_at: string
    order_status: string
  }

  const [data, setData] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const rowsPerPage = 10

  // Filter data based on search term
  const filteredData = data.filter(
    (item) =>
      item.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clothing_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setIsRefreshing(true)

    try {
      const result = await fetchAllTailorJobs()
      console.log('resldhf', result)

      const formattedData = result.map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        itemData: item.item_name,
        clothing_name: item.clothing_name,
        clothing_description: item.clothing_description,
        itemQuantity: item.item_quantity,
        customer_name: item.customer_name,
        order_status: item.order_status,
        date: new Date(item.assigned_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      }))
      setData(formattedData)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  }

  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      backgroundColor: "#fff7ed",
      transition: { duration: 0.2 },
    },
  }

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">Loading tailor jobs...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] px-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="relative mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <Briefcase className="w-12 h-12 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="text-center space-y-4 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">No Jobs Assigned</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          No jobs have been assigned to you at the moment. Check back later or contact your manager for new assignments.
        </p>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-indigo-400/25 rounded-full animate-pulse delay-500" />
      </motion.div>
    </motion.div>
  )
  }

  return (
    <div>
    <div className="flex flex-col gap-y-1 mb-6 px-3 py-2">
      <h1 className="text-3xl font-semibold text-gray-800">Tailor Jobs</h1>
      <div className="text-gray-800">View all jobs assigned to you</div>
      </div>
      <motion.div
      className="w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
  >
  
      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {[
                { label: "Order ID", icon: HiOutlineClipboardList },
                { label: "Customer", icon: IoPersonOutline },
                { label: "Clothing Item", icon: IoShirtOutline },
                { label: "Description", icon: null },
                { label: "Date Assigned", icon: IoCalendarOutline },
                { label: "Actions", icon: null },
              ].map((header, index) => (
                <th
                  key={header.label}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                >
                  <div className="flex items-center space-x-2">
                    {header.icon && <header.icon className="text-gray-500" />}
                    <span>{header.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            <AnimatePresence>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={`${row.id}-${currentPage}`}
                  className="hover:bg-orange-50 transition-colors cursor-pointer"
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  custom={index}
                  whileHover="hover"
                >
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="font-medium text-gray-900">{row.order_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <IoPersonOutline className="text-orange-600" />
                      </div>
                      <span className="text-gray-900 font-medium">{row.customer_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <IoShirtOutline className="text-orange-500" />
                      <span className="text-gray-900">{row.clothing_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{row.clothing_description}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <IoCalendarOutline className="text-orange-500" />
                      <span>{row.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/head-of-tailoring/jobs/${row.id}`}>
                      <motion.div
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IoEyeOutline />
                        <span className="font-medium">View</span>
                      </motion.div>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <motion.div className="px-8 py-6 bg-gray-50 border-t border-gray-200" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{currentPage * rowsPerPage - rowsPerPage + 1}</span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * rowsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{filteredData.length}</span> orders
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              className="p-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
            >
              <FaArrowLeft />
            </motion.button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i
                return page
              })
                .filter((page) => page > 0 && page <= totalPages)
                .map((page) => (
                  <motion.button
                    key={page}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                      page === currentPage ? "bg-orange-500 text-white shadow-lg" : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => handlePageChange(page)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                ))}
            </div>

            <motion.button
              className="p-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
            >
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
    </div>
  )
}
