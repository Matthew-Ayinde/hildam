"use client"

import { type SetStateAction, useEffect, useState } from "react"
import { ChevronRight, ChevronLeft, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { getSession } from "next-auth/react"
import { deleteJobExpense, fetchAllJobExpenses } from "@/app/api/apiClient"

export default function ExpenseTable() {
  interface Expense {
    id: string
    total_amount: string
    utilities: string
    services: string
    purchase_costs: string
    labour: string
    rent: string
    created_at: string
    order_id: string
  }

  const [data, setData] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null)

  const rowsPerPage = 10

  const formatDate = (iso: string) => {
    const date = new Date(iso)
    const day = date.getUTCDate()
    const month = date.toLocaleString("en-GB", { month: "long" })
    const year = date.getUTCFullYear()
    return `${day} ${month}, ${year}`
  }

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Number.parseFloat(amount))
  }

  const fetchData = async () => {
    setIsLoading(true)


    try {

      const res = await fetchAllJobExpenses()
      console.log('rress', res)

      setData(res)
      
    } catch (err) {
      console.error(err)
      setPopupMessage("Error fetching expenses")
      setTimeout(() => setPopupMessage(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalPages = Math.ceil(data.length / rowsPerPage)

  const handlePageChange = (page: SetStateAction<number>) => {
    if (typeof page === "number" && page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const handleDelete = async () => {
    if (!selectedExpenseId) return
    try {
        const jobExpenseId = selectedExpenseId

      const res = await deleteJobExpense(jobExpenseId)

      setData((prev) => prev.filter((e) => e.id !== selectedExpenseId))
      setPopupMessage("Expense successfully deleted")
      setTimeout(() => setPopupMessage(null), 5000)
    } catch (err) {
      console.error(err)
      setPopupMessage("Error deleting expense")
      setTimeout(() => setPopupMessage(null), 5000)
    } finally {
      setIsPopupOpen(false)
      setTimeout(() => setPopupMessage(null), 5000)
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-orange-50 to-white min-h-screen p-6">
      {popupMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-medium"
        >
          {popupMessage}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Expenses Summary</h2>
          <p className="text-orange-100 text-sm mt-1">Manage and track your business expenses</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                {["Order ID", "Total Amount", "Utilities", "Labour", "Date Created", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-orange-800 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <span className="ml-3 text-orange-600 font-medium">Loading expenses...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="text-orange-400">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-lg font-medium text-orange-600">No expenses found</p>
                      <p className="text-sm text-orange-400">Start by adding your first expense</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="hover:bg-orange-25 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {row.order_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(row.total_amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium">{formatCurrency(row.utilities)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium">{formatCurrency(row.labour)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{formatDate(row.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/admin/expenses/${row.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedExpenseId(row.id)
                            setIsPopupOpen(true)
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-orange-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-orange-600">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-orange-600">{Math.min(currentPage * rowsPerPage, data.length)}</span>{" "}
              of <span className="font-semibold text-orange-600">{data.length}</span> entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i))
                return pageNum
              })
                .filter((p, i, arr) => arr.indexOf(p) === i && p > 0 && p <= totalPages)
                .map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      pageNum === currentPage
                        ? "bg-orange-500 text-white shadow-md"
                        : "border border-orange-200 text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

              <button
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isPopupOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={() => setIsPopupOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Expense</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this expense? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  className="flex-1 px-4 py-3 text-sm font-semibold text-orange-600 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                  onClick={() => setIsPopupOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
