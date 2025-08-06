"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaArrowRight,
  FaArrowLeft,
  FaBoxes,
  FaPlus,
  FaSearch,
  FaFilter,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa"
import { IoEyeOutline, IoTrashOutline } from "react-icons/io5"
import { HiOutlineSparkles, HiOutlineCube } from "react-icons/hi"
import { BiPackage } from "react-icons/bi"
import { getSession } from "next-auth/react"
import { deleteInventory, fetchAllInventories } from "@/app/api/apiClient"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"
import Link from "next/link"

// Spinner component
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
)

export default function ModernInventoryTable() {
  interface InventoryItem {
    id: string
    item_name: string
    item_quantity: string
    color: string
    created_at: string
  }

  const [data, setData] = useState<InventoryItem[]>([])

  const [filteredData, setFilteredData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")
  const [showToast, setShowToast] = useState(false)

  const rowsPerPage = 8
  const router = useRouter()
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)


  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true)
        setError(null)


       const result = await fetchAllInventories()
       setData(result)
       setFilteredData(result)

      } catch (error) {
        console.error("Error fetching inventory:", error)
        setError("Failed to load inventory data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryData()
  }, [])

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredData(filtered)
    setCurrentPage(1)
  }, [searchTerm, data])

  const handleDelete = async () => {
    try {
      if (!selectedUserId) {
        setToastMessage("No item selected for deletion.")
        setToastType("error")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
        return
      }

      const inventoryId = selectedUserId
      const response = await deleteInventory(inventoryId)


      setData((prevData) => prevData.filter((item) => item.id !== selectedUserId))
      setIsPopupOpen(false)
      setToastMessage("Inventory item deleted successfully.")
      setToastType("success")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error("Error deleting inventory item:", error)
      setToastMessage("An error occurred. Please try again.")
      setToastType("error")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const getStockStatus = (quantity: string) => {
    const qty = Number.parseInt(quantity)
    if (qty <= 10) return { status: "Low Stock", color: "text-red-600 bg-red-50 border-red-200" }
    if (qty <= 50) return { status: "Medium Stock", color: "text-amber-600 bg-amber-50 border-amber-200" }
    return { status: "In Stock", color: "text-green-600 bg-green-50 border-green-200" }
  }

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
    visible: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="py-20">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Spinner />
          <p className="mt-4 text-orange-600 font-medium">Loading inventory...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-lg"
        >
          
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Get Started by adding a new inventory item</h3>
          <Link href={`/client-manager/inventory/create`}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors duration-200 mt-3"
          >
            Add Inventory Item
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white rounded-2xl p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl text-white shadow-lg z-50 ${
                toastType === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="font-medium">{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Inventory Management
            </h1>
            <p className="text-slate-600 text-lg">Track and manage your tailoring supplies and materials</p>
          </div>
          <div className="flex gap-3">
            <motion.button
            onClick={() => router.push(ApplicationRoutes.ClientManagerInventoryCreate)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
            >
              <FaPlus className="text-sm" />
              Add Item
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Items</p>
                <p className="text-3xl font-bold text-orange-600">{data.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100">
                <FaBoxes className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">In Stock</p>
                <p className="text-3xl font-bold text-green-600">
                  {data.filter((item) => Number.parseInt(item.item_quantity) > 50).length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
                <HiOutlineCube className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-amber-600">
                  {data.filter((item) => Number.parseInt(item.item_quantity) <= 20).length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100">
                <BiPackage className="text-amber-600 text-2xl" />
              </div>
            </div>
          </div>

       
        </motion.div>

        {/* Main Table Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
        >
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
                  <FaBoxes className="text-orange-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Inventory Items</h3>
                  <p className="text-sm text-slate-600">Manage your stock and supplies</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 w-64"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["ID", "Item Name", "Quantity", "Stock Status", "Date Added", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                          <FaBoxes className="text-orange-400 text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 mb-2">No items found</h3>
                          <p className="text-slate-500 mb-6">
                            {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first item"}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors duration-200"
                          >
                            Add Item
                          </motion.button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const stockInfo = getStockStatus(row.item_quantity)
                    return (
                      <motion.tr
                        key={row.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-orange-50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                              <span className="text-orange-600 font-semibold text-sm">{row.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                              <BiPackage className="text-slate-600" size={20} />
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{row.item_name}</div>
                              <div className="text-sm text-slate-500">Color: {row.color}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-slate-800">{row.item_quantity}</span>
                            <span className="text-sm text-slate-500">units</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockInfo.color}`}
                          >
                            {stockInfo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-slate-600">
                            <FaCalendarAlt className="text-slate-400" size={14} />
                            <span className="text-sm">{new Date(row.created_at).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => router.push(`/client-manager/inventory/${row.id}`)}
                              className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                            >
                              <IoEyeOutline size={18} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedUserId(row.id)
                                setIsPopupOpen(true)
                              }}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            >
                              <IoTrashOutline size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-medium text-slate-900">{currentPage * rowsPerPage - rowsPerPage + 1}</span> -{" "}
                  <span className="font-medium text-slate-900">
                    {Math.min(currentPage * rowsPerPage, filteredData.length)}
                  </span>{" "}
                  of <span className="font-medium text-slate-900">{filteredData.length}</span> items
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                            ? "bg-orange-500 text-white shadow-sm"
                            : "text-slate-600 bg-white border border-slate-300 hover:bg-slate-50"
                        }`}
                        onClick={() => handlePageChange(page!)}
                      >
                        {page}
                      </motion.button>
                    ))}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                    <IoTrashOutline className="text-red-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Delete Inventory Item</h3>
                  <p className="text-slate-600 mb-6">
                    Are you sure you want to delete this item? This action cannot be undone and will permanently remove
                    the item from your inventory.
                  </p>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors duration-200"
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
                      Delete Item
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
