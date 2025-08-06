"use client"

import { type SetStateAction, useEffect, useState } from "react"
import { FaArrowRight, FaArrowLeft, FaUsers, FaPlus } from "react-icons/fa"
import { IoEyeOutline, IoPersonOutline, IoCalendarOutline } from "react-icons/io5"
import { MdOutlineDeleteForever, MdOutlinePhone } from "react-icons/md"
import { HiOutlineSparkles, HiOutlineUserGroup } from "react-icons/hi"
import { BiMale, BiFemale } from "react-icons/bi"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getSession } from "next-auth/react"
import Spinner from "@/components/Spinner"
import CustomerAnalyticsChart from "./customerChart"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"
import { deleteCustomer, fetchAllCustomers } from "@/app/api/apiClient"

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

export default function Table() {
  interface Customer {
    fullName: string
    age: number
    gender: string
    phone: string
    id: string
    date: string
  }

  const [data, setData] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const rowsPerPage = 10

  const handleDelete = async () => {
    if (!selectedCustomerId) return

    try {

      const payload = selectedCustomerId;


      const response = await deleteCustomer(payload)

      setData((prevData) => prevData.filter((customer) => customer.id !== selectedCustomerId))
      setPopupMessage("Customer successfully deleted")
      setMessageType("success")
      setTimeout(() => window.location.reload(), 2000)
      // setTimeout(() => setPopupMessage(null), 3000)
    } catch (error) {
      console.error("Error deleting customer:", error)
      setPopupMessage("Error deleting customer")
      setMessageType("error")
      setTimeout(() => setPopupMessage(null), 3000)
    } finally {
      setIsPopupOpen(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {

        const result = await fetchAllCustomers()
        
        if (result) {
          const filteredData = result.map((item: any) => ({
            fullName: item.name,
            age: item.age,
            gender: item.gender,
            phone: item.phone_number || "N/A",
            id: item.id,
            date: new Date().toLocaleDateString(),
          }))
          setData(filteredData)
        } else {
          setData([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        // setPopupMessage("Error fetching data")
        setMessageType("error")
        setTimeout(() => setPopupMessage(null), 3000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalPages = Math.ceil(data.length / rowsPerPage)

  const handlePageChange = (newPage: SetStateAction<number>) => {
    if (typeof newPage === "number" && newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const getGenderIcon = (gender: string) => {
    if (gender?.toLowerCase() === "male") {
      return <BiMale className="text-blue-500" size={16} />
    } else if (gender?.toLowerCase() === "female") {
      return <BiFemale className="text-pink-500" size={16} />
    }
    return <IoPersonOutline className="text-gray-500" size={16} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-6 md:px-0"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl text-white shadow-lg z-50 ${
              messageType === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-rose-600"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-medium">{popupMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
              <HiOutlineUserGroup className="text-orange-600" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Total Customers</h2>
              <p className="text-gray-600">Manage all customers information</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* <CustomerAnalyticsChart /> */}

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                <FaUsers className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Customers List</h3>
                <p className="text-sm text-gray-600">View and manage all customers</p>
              </div>
            </div>

          <Link href={ApplicationRoutes.ClientManagerCustomersCreate}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium shadow-sm transition-all duration-200"
              >
                <FaPlus size={16} />
                <span>Add New Customer</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[
                  { label: "Customer", icon: IoPersonOutline },
                  { label: "Age", icon: IoCalendarOutline },
                  { label: "Gender", icon: IoPersonOutline },
                  { label: "Phone", icon: MdOutlinePhone },
                  { label: "Created", icon: IoCalendarOutline },
                  { label: "Actions", icon: HiOutlineSparkles },
                ].map((header) => (
                  <th
                    key={header.label}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                  >
                    <div className="flex items-center space-x-2">
                      <header.icon className="text-gray-500" size={16} />
                      <span>{header.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaUsers className="text-gray-400" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                        <p className="text-gray-500 mb-6">Get started by adding your first customer</p>
                        <Link href={ApplicationRoutes.ClientManagerCustomersCreate}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors duration-200"
                          >
                            Add Customer
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
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">
                            {row.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{row.fullName}</div>
                          <div className="text-sm text-gray-500">Customer ID: {row.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.age} years</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getGenderIcon(row.gender)}
                        <span className="text-sm text-gray-600 capitalize">{row.gender}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`${ApplicationRoutes.ClientManagerCustomers}/${row.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          >
                            <IoEyeOutline size={18} />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedCustomerId(row.id)
                            setIsPopupOpen(true)
                          }}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
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
        </div>

        {/* Pagination */}
        {!isLoading && data.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{currentPage * rowsPerPage - rowsPerPage + 1}</span>{" "}
                - <span className="font-medium text-gray-900">{Math.min(currentPage * rowsPerPage, data.length)}</span>{" "}
                of <span className="font-medium text-gray-900">{data.length}</span> customers
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
                          ? "bg-orange-500 text-white shadow-sm"
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
                  <MdOutlineDeleteForever className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Customer</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this customer? This action cannot be undone.
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
