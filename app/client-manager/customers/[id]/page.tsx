"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { IoPersonOutline } from "react-icons/io5"
import { MdOutlineDeleteForever, MdOutlineRule, MdOutlineCheckCircle } from "react-icons/md"
import { HiOutlineUser, HiOutlineDocumentText } from "react-icons/hi"
import { BiMale, BiFemale } from "react-icons/bi"
import { FiUser, FiCalendar, FiMail, FiPhone, FiMapPin, FiEdit3 } from "react-icons/fi"
import { getSession } from "next-auth/react"
import SkeletonLoader from "@/components/SkeletonLoader"
import DataPageError from "@/components/client-manager/DataNotFound"
import { deleteCustomer, fetchAllCustomers, fetchCustomer } from "@/app/api/apiClient"

export default function ShowCustomer() {
  const router = useRouter()
  const { id } = useParams()
  const customerId = id as string
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  interface Customer {
    [x: string]: string | number | readonly string[] | undefined
    fullName: string
    age: number
    gender: string
    email: string
    address: string
    bust: number
    waist: number
    hip: number
    shoulder: number
    bustpoint: number
    shoulder_to_underbust: number
    round_under_bust: number
    sleeve_length: number
    half_length: number
    blouse_length: number
    trousers_length: number
    trouser_waist: number
    round_sleeve: number
    round_thigh: number
    round_knee: number
    round_feet: number
    skirt_length: number
    round_shoulder: number
    chest: number
    dress_length: number
    create_date: string
    customer_description: string
    phone_number: string
  }

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!selectedCustomerId) return

    try {
      const payload = selectedCustomerId

      const response = await deleteCustomer(payload)

      setPopupMessage("Customer successfully deleted")
      setMessageType("success")
      setTimeout(() => setPopupMessage(null), 3000)
    } catch (error) {
      console.error("Error deleting customer:", error)
      setPopupMessage("Error deleting customer")
      setMessageType("error")
      setTimeout(() => setPopupMessage(null), 3000)
    } finally {
      setIsPopupOpen(false)
      setTimeout(() => router.push("/client-manager/customers"), 1000)
    }
  }

  const fetchCustomerById = async () => {
    setLoading(true)
    setError(null)

    try {
      
      const result = await fetchCustomer(customerId)


      if (result) {
        const mappedCustomer: Customer = {
          fullName: result.name,
          age: result.age,
          gender: result.gender,
          phone_number: result.phone_number || "N/A",
          email: result.email || "N/A",
          bust: result.bust || 0,
          waist: result.waist || 0,
          hip: result.hip || 0,
          shoulder: result.shoulder || 0,
          bustpoint: result.bustpoint || 0,
          shoulder_to_underbust: result.shoulder_to_underbust || 0,
          round_under_bust: result.round_under_bust || 0,
          sleeve_length: result.sleeve_length || 0,
          half_length: result.half_length || 0,
          blouse_length: result.blouse_length || 0,
          trousers_length: result.trousers_length || 0,
          trouser_waist: result.trouser_waist || 0,
          round_sleeve: result.round_sleeve || 0,
          round_thigh: result.round_thigh || 0,
          round_knee: result.round_knee || 0,
          round_feet: result.round_feet || 0,
          skirt_length: result.skirt_length || 0,
          round_shoulder: result.round_shoulder || 0,
          chest: result.chest || 0,
          dress_length: result.dress_length || 0,
          create_date: result.created_at,
          address: result.address || "N/A",
          customer_description: result.customer_description || "N/A",
        }
        setCustomer(mappedCustomer)
      } else {
        setCustomer(null)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomerById()
  }, [id])

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <SkeletonLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <DataPageError />
      </div>
    )
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>
  }

  const measurements = [
    { label: "Shoulder", key: "shoulder" },
    { label: "Bust", key: "bust" },
    { label: "Bust Point", key: "bustpoint" },
    { label: "Shoulder to Under Bust", key: "shoulder_to_underbust" },
    { label: "Round Under Bust", key: "round_under_bust" },
    { label: "Waist", key: "waist" },
    { label: "Half Length", key: "half_length" },
    { label: "Blouse Length", key: "blouse_length" },
    { label: "Sleeve Length", key: "sleeve_length" },
    { label: "Round Sleeve", key: "round_sleeve" },
    { label: "Dress Length", key: "dress_length" },
    { label: "Hip", key: "hip" },
    { label: "Chest", key: "chest" },
    { label: "Round Shoulder", key: "round_shoulder" },
    { label: "Skirt Length", key: "skirt_length" },
      ]

  const getGenderIcon = (gender: string) => {
    if (gender?.toLowerCase() === "male") {
      return <BiMale className="text-blue-500" size={20} />
    } else if (gender?.toLowerCase() === "female") {
      return <BiFemale className="text-pink-500" size={20} />
    }
    return <IoPersonOutline className="text-gray-500" size={20} />
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
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
                <MdOutlineCheckCircle size={20} />
                <span className="font-medium">{popupMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 bg-white rounded-2xl p-6 shadow-lg border border-orange-100"
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Link
              href="/client-manager/customers"
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-all duration-200 group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors"
              >
                <IoIosArrowBack size={20} />
              </motion.div>
              <span className="font-semibold">Back</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">{customer.fullName.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{customer.fullName}</h1>
                <p className="text-sm text-gray-600">Customer Details</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href={`/client-manager/customers/${id}/edit`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl shadow-sm transition-all duration-200"
              >
                <FiEdit3 size={18} />
                <span className="font-medium">Edit</span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (typeof id === "string") {
                  setSelectedCustomerId(id)
                }
                setIsPopupOpen(true)
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl shadow-sm transition-all duration-200"
            >
              <MdOutlineDeleteForever size={18} />
              <span className="font-medium">Delete</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Customer Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <HiOutlineUser className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Customer Information</h2>
                <p className="text-orange-100">Personal details and contact information</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Full Name", value: customer.fullName, icon: FiUser },
                { label: "Age", value: `${customer.age} years`, icon: FiCalendar },
                {
                  label: "Gender",
                  value: customer.gender,
                  icon: IoPersonOutline,
                  customIcon: getGenderIcon(customer.gender),
                },
                { label: "Phone", value: customer.phone_number, icon: FiPhone },
                { label: "Email", value: customer.email, icon: FiMail },
                { label: "Date Created", value: formatDate(customer.create_date), icon: FiCalendar },
              ].map((field, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    {field.customIcon || <field.icon className="text-orange-500" size={16} />}
                    <span>{field.label}</span>
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    readOnly
                    className="w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200"
                  />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FiMapPin className="text-orange-500" size={16} />
                  <span>Address</span>
                </label>
                <textarea
                  rows={3}
                  value={customer.address}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 resize-none"
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <HiOutlineDocumentText className="text-orange-500" size={16} />
                  <span>Customer Description</span>
                </label>
                <textarea
                  rows={3}
                  value={customer.customer_description}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Measurements Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <MdOutlineRule className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Body Measurements</h2>
                <p className="text-blue-100">Detailed measurements for tailoring</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {measurements.map((measurement, index) => (
                <motion.div
                  key={measurement.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">{measurement.label}</label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={customer[measurement.key] || 0}
                      className="w-full rounded-xl border border-gray-200 shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">cm</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

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
