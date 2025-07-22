"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import Spinner from "@/components/Spinner"
import SkeletonLoader from "@/components/SkeletonLoader"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { IoIosArrowBack, IoMdClose, IoMdAdd, IoMdTrash } from "react-icons/io"
import { FiCalendar, FiUser, FiPhone, FiMail, FiMapPin } from "react-icons/fi"
import { getSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { fetchOrderById, editOrder, fetchHeadOfTailoringList } from "@/app/api/apiClient"

interface ProjectManager {
  id: string
  name: string
}

interface Customer {
  name: string
  age: string
  order_id: string
  clothing_name: string
  clothing_description: string
  order_status: string
  priority: string
  shoulder_width: number
  phone_number: string
  email: string
  bust: number
  address: string
  waist: number
  hip: number
  neck: number
  shoulder: number
  bustpoint: number
  shoulder_to_underbust: number
  round_under_bust: number
  half_length: number
  blouse_length: number
  sleeve_length: number
  round_sleeve: number
  dress_length: number
  chest: number
  round_shoulder: number
  skirt_length: number
  trousers_length: number
  round_thigh: number
  round_knee: number
  round_feet: number
  style_reference_images: string[]
  created_at: string
  manager_id: string
  manager_name: string
  first_fitting_date: string | null
  second_fitting_date: string | null
  duration: string
}

export default function EditCustomer() {
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([])
  const [loadingManagers, setLoadingManagers] = useState(true)
  const [errorManagers, setErrorManagers] = useState("")

  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [loadingImage, setLoadingImage] = useState(false)

  const router = useRouter()
  const { id } = useParams()
  const orderId = id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const [firstFittingDate, setFirstFittingDate] = useState<Date | null>(null)
  const [secondFittingDate, setSecondFittingDate] = useState<Date | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone_number: "",
    email: "",
    bust: 0,
    address: "",
    waist: 0,
    hip: 0,
    neck: 0,
    shoulder: 0,
    bustpoint: 0,
    shoulder_to_underbust: 0,
    round_under_bust: 0,
    half_length: 0,
    blouse_length: 0,
    sleeve_length: 0,
    round_sleeve: 0,
    dress_length: 0,
    chest: 0,
    round_shoulder: 0,
    skirt_length: 0,
    trousers_length: 0,
    round_thigh: 0,
    round_knee: 0,
    round_feet: 0,
    style_reference_images: [],
    created_at: "",
    manager_id: "",
    manager_name: "",
    order_status: "",
    shoulder_width: 0,
    clothing_name: "",
    clothing_description: "",
    priority: "",
    order_id: "",
    first_fitting_date: "",
    second_fitting_date: "",
    duration: "",
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // Helper Functions
  const parseInputValue = (name: string, value: string) => {
    const numericFields = [
      "bust",
      "waist",
      "hip",
      "neck",
      "shoulder",
      "bustpoint",
      "shoulder_to_underbust",
      "round_under_bust",
      "half_length",
      "blouse_length",
      "sleeve_length",
      "round_sleeve",
      "dress_length",
      "chest",
      "round_shoulder",
      "skirt_length",
      "trousers_length",
      "round_thigh",
      "round_knee",
      "round_feet",
      "shoulder_width",
    ]
    return numericFields.includes(name) ? Number.parseFloat(value) || 0 : value
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const parsedValue = parseInputValue(name, value)
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))

      setSelectedFiles((prev) => [...prev, ...newFiles])
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))

    // Also remove from formData if it's an existing image
    if (index < formData.style_reference_images.length) {
      setFormData((prev) => ({
        ...prev,
        style_reference_images: prev.style_reference_images.filter((_, i) => i !== index),
      }))
    }
  }

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  // Data Fetching Functions
  const fetchCustomer = useCallback(async () => {
    setLoading(true)
    setError("")
    try {

      const data = await fetchOrderById(orderId)

      console.log("Fetched order data:", data)

      setCustomer(data)
      setFormData({
        name: data.customer_name,
        age: data.age,
        phone_number: data.phone_number,
        email: data.customer_email,
        bust: data.bust,
        address: data.address,
        waist: data.waist,
        hip: data.hip,
        neck: data.neck,
        shoulder: data.shoulder,
        bustpoint: data.bustpoint,
        shoulder_to_underbust: data.shoulder_to_underbust,
        round_under_bust: data.round_under_bust,
        half_length: data.half_length,
        blouse_length: data.blouse_length,
        sleeve_length: data.sleeve_length,
        round_sleeve: data.round_sleeve,
        dress_length: data.dress_length,
        chest: data.chest,
        round_shoulder: data.round_shoulder,
        skirt_length: data.skirt_length,
        trousers_length: data.trousers_length,
        round_thigh: data.round_thigh,
        round_knee: data.round_knee,
        round_feet: data.round_feet,
        style_reference_images: data.style_reference_images || [],
        created_at: data.created_at,
        order_status: data.order_status,
        shoulder_width: data.shoulder_width,
        manager_id: data.manager_id,
        manager_name: data.tailoring.manager.name,
        clothing_name: data.clothing_name,
        clothing_description: data.clothing_description,
        priority: data.priority,
        order_id: data.order_id,
        first_fitting_date: data.first_fitting_date || "Not available",
        second_fitting_date: data.second_fitting_date || "Not available",
        duration: data.duration || "",
      })

      setPreviewUrls(data.style_reference_images || [])

      setFirstFittingDate(data.first_fitting_date ? new Date(data.first_fitting_date) : null)
      setSecondFittingDate(data.second_fitting_date ? new Date(data.second_fitting_date) : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchProjectManagers = useCallback(async () => {
    setLoadingManagers(true)
    setErrorManagers("")
    try {
     
      const response = await fetchHeadOfTailoringList()
      console.log("Fetched project managers:", response)

      setProjectManagers(response.head_of_tailoring)
    } catch (err) {
      setErrorManagers(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoadingManagers(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomer()
    fetchProjectManagers()
  }, [fetchCustomer, fetchProjectManagers])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    try {
      

      const formDataToSend = new FormData()

      if (firstFittingDate) {
        formDataToSend.append("first_fitting_date", firstFittingDate.toISOString().split("T")[0])
      }
      if (secondFittingDate) {
        formDataToSend.append("second_fitting_date", secondFittingDate.toISOString().split("T")[0])
      }
      formDataToSend.append("duration", formData.duration + "")

      // Append new files
      selectedFiles.forEach((file, index) => {
        formDataToSend.append(`style_reference_images[${index}]`, file)
      })

      Object.keys(formData).forEach((key) => {
        if (key === "style_reference_images") {
          // Skip - handled above
        } else if (!["first_fitting_date", "second_fitting_date", "duration"].includes(key)) {
          formDataToSend.append(key, formData[key as keyof typeof formData] + "")
        }
      })

      console.log("Form data to send:", formDataToSend)

      const response = await editOrder(orderId, formDataToSend)
      console.log("Edit order response:", response)


      setSuccessMessage("Order updated successfully!")
      setTimeout(() => router.push("/admin/orders"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <SkeletonLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-100"
        >
          <div className="text-red-500 text-lg mb-4">Error: {error}</div>
          <button
            onClick={fetchCustomer}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-5 left-0 right-0 flex justify-center z-50"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors group"
          >
            <IoIosArrowBack className="mr-2 group-hover:-translate-x-1 transition-transform" size={24} />
            <span className="font-medium">Back to Orders</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Edit Order</h1>
          <p className="text-gray-600">Update order details and measurements</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FiUser className="mr-3" />
                Basic Information
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Order ID</label>
                  <input
                    type="text"
                    name="order_id"
                    value={formData.order_id}
                    disabled
                    className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-gray-600 focus:outline-none"
                  />
                </div>
        
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Clothing Name</label>
                  <input
                    type="text"
                    name="clothing_name"
                    value={formData.clothing_name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700">Clothing Description</label>
                  <textarea
                    name="clothing_description"
                    rows={3}
                    value={formData.clothing_description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Order Status</label>
                  <select
                    name="order_status"
                    value={formData.order_status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="pending">⏳ Pending</option>
                    <option value="processing">⚙️ Processing</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Head of Tailoring</label>
                  <select
                    name="manager_id"
                    value={formData.manager_id || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white"
                    disabled={loadingManagers}
                    required
                  >
                    <option value="" disabled>
                      {loadingManagers ? "Loading..." : errorManagers ? "Error loading" : "Select Manager"}
                    </option>
                    {projectManagers.map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Style Reference Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h2 className="text-xl font-bold text-white">Style Reference Images</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {previewUrls.map((url, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-colors cursor-pointer">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Style reference ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => openImageModal(index)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoMdTrash size={16} />
                    </button>
                  </motion.div>
                ))}

                {/* Add Image Button */}
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="aspect-square border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group"
                >
                  <IoMdAdd className="text-orange-400 group-hover:text-orange-600 mb-2" size={32} />
                  <span className="text-sm text-orange-600 font-medium">Add Image</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </motion.label>
              </div>
            </div>
          </motion.div>

          {/* Measurements Card */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h2 className="text-xl font-bold text-white">Measurements</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Blouse Length", name: "blouse_length" },
                  { label: "Bust", name: "bust" },
                  { label: "Bust Point", name: "bustpoint" },
                  { label: "Chest", name: "chest" },
                  { label: "Dress Length", name: "dress_length" },
                  { label: "Half Length", name: "half_length" },
                  { label: "Hip", name: "hip" },
                  { label: "Round Shoulder", name: "round_shoulder" },
                  { label: "Round Sleeve", name: "round_sleeve" },
                  { label: "Round Under Bust", name: "round_under_bust" },
                  { label: "Shoulder", name: "shoulder" },
                  { label: "Shoulder to Underbust", name: "shoulder_to_underbust" },
                  { label: "Skirt Length", name: "skirt_length" },
                  { label: "Sleeve Length", name: "sleeve_length" },
                  { label: "Waist", name: "waist" },
                ].map((measurement, index) => (
                  <motion.div
                    key={measurement.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-semibold text-gray-700">{measurement.label}</label>
                    <input
                      type="text"
                      name={measurement.name}
                      value={formData[measurement.name as keyof typeof formData] || ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div> */}

          {/* Fitting Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FiCalendar className="mr-3" />
                Fitting Schedule
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">First Fitting Date</label>
                  <DatePicker
                    selected={firstFittingDate}
                    onChange={(date) => {
                      setFirstFittingDate(date)
                      if (date && secondFittingDate && secondFittingDate < date) {
                        setSecondFittingDate(null)
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    minDate={new Date()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Second Fitting Date</label>
                  <DatePicker
                    selected={secondFittingDate}
                    onChange={(date) => setSecondFittingDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                    minDate={firstFittingDate || new Date()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Duration (days)</label>
                  <input
                    type="number"
                    name="duration"
                    placeholder="Enter number of days"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
            >
              Save Changes
            </motion.button>
          </motion.div>
        </form>

        {/* Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={closeImageModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Style Reference {selectedImageIndex + 1}</h3>
                  <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <IoMdClose size={24} />
                  </button>
                </div>

                {loadingImage ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <img
                      src={previewUrls[selectedImageIndex] || "/placeholder.svg"}
                      alt={`Style reference ${selectedImageIndex + 1}`}
                      className="max-w-full max-h-[70vh] object-contain rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = ""
                        e.currentTarget.alt = "Image failed to load"
                      }}
                    />
                  </div>
                )}

                {previewUrls.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {previewUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === selectedImageIndex ? "bg-orange-500" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
