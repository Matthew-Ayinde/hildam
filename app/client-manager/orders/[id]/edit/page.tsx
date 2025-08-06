"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import Spinner from "@/components/Spinner"
import SkeletonLoader from "@/components/SkeletonLoader"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { IoIosArrowBack, IoMdClose, IoMdAdd, IoMdTrash } from "react-icons/io"
import { FiCalendar, FiUser } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { fetchOrderById, editOrder, fetchHeadOfTailoringList } from "@/app/api/apiClient"
import { Button } from "@/components/ui/button" // Import shadcn Button

interface ProjectManager {
  id: string
  name: string
}

interface Customer {
  name: string // Maps to customer_name from API
  age: string
  order_id: string
  clothing_name: string
  clothing_description: string
  order_status: string
  priority: string
  email: string // Maps to customer_email from API
  address: string
  style_reference_images: string[]
  created_at: string
  manager_id: string
  phone_number: string // Added based on usage
  tailoring?: { manager?: { name: string } } // Added for manager_name access
  first_fitting_date: string | null
  second_fitting_date: string | null
  collection_date: string // Added for collection date
  duration: string
}

export default function EditCustomer() {
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([])
  const [loadingManagers, setLoadingManagers] = useState(true)
  const [errorManagers, setErrorManagers] = useState("")
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [loadingImage, setLoadingImage] = useState(false) // This state is not currently used, but kept for consistency
  const router = useRouter()
  const { id } = useParams()
  const orderId = id as string
  const [customer, setCustomer] = useState<Customer | null>(null) // Store original customer data for reference
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [firstFittingDate, setFirstFittingDate] = useState<Date | null>(null)
  const [secondFittingDate, setSecondFittingDate] = useState<Date | null>(null)
  const [collectionDate, setCollectionDate] = useState<Date | null>(null)
  const [showManagerDropdown, setShowManagerDropdown] = useState(false) // New state for dropdown visibility
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone_number: "",
    email: "",
    address: "",
    style_reference_images: [] as string[], // This will hold URLs of existing images to keep
    created_at: "",
    manager_id: "",
    manager_name: "",
    order_status: "",
    clothing_name: "",
    clothing_description: "",
    priority: "",
    order_id: "",
    duration: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // This will hold new image files
  const [previewUrls, setPreviewUrls] = useState<string[]>([]) // This holds all URLs for display (existing + new blob URLs)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Update manager_name when manager_id changes
    if (name === "manager_id") {
      const selectedManager = projectManagers.find((manager) => manager.id === value)
      setFormData((prev) => ({
        ...prev,
        manager_id: value,
        manager_name: selectedManager ? selectedManager.name : "",
      }))
    }
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

  const removeImage = (indexToRemove: number) => {
    const initialExistingImagesCount = customer?.style_reference_images?.length || 0
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove))

    if (indexToRemove < initialExistingImagesCount) {
      // This is an existing image that was fetched from the backend
      setFormData((prev) => ({
        ...prev,
        style_reference_images: prev.style_reference_images.filter((_, i) => i !== indexToRemove),
      }))
    } else {
      // This is a newly added image (from selectedFiles)
      // Adjust the index for selectedFiles array
      const selectedFilesIndex = indexToRemove - initialExistingImagesCount
      setSelectedFiles((prev) => prev.filter((_, i) => i !== selectedFilesIndex))
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
      setCustomer(data) // Store the original customer data
      const customerFormData = {
        name: data.customer_name,
        age: data.age,
        phone_number: data.phone_number,
        email: data.customer_email,
        address: data.address,
        style_reference_images: data.style_reference_images || [], // Initial existing images
        created_at: data.created_at,
        order_status: data.order_status,
        manager_id: data.manager_id,
        manager_name: data.tailoring?.manager?.name || "",
        clothing_name: data.clothing_name,
        clothing_description: data.clothing_description,
        priority: data.priority,
        order_id: data.order_id,
        duration: data.duration || "",
      }
      setFormData(customerFormData)
      setPreviewUrls(data.style_reference_images || []) // Set initial preview URLs from existing images
      setFirstFittingDate(data.first_fitting_date ? new Date(data.first_fitting_date) : null)
      setSecondFittingDate(data.second_fitting_date ? new Date(data.second_fitting_date) : null)
      setCollectionDate(data.collection_date ? new Date(data.collection_date) : null)

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [orderId])

  const fetchProjectManagers = useCallback(async () => {
    setLoadingManagers(true)
    setErrorManagers("")
    try {
      const response = await fetchHeadOfTailoringList()
      setProjectManagers(response.head_of_tailoring)
    } catch (err) {
      setErrorManagers(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoadingManagers(false)
    }
  }, [])

  // Update manager_name when projectManagers are loaded and we have a manager_id
  useEffect(() => {
    if (projectManagers.length > 0 && formData.manager_id && !formData.manager_name) {
      const selectedManager = projectManagers.find((manager) => manager.id === formData.manager_id)
      if (selectedManager) {
        setFormData((prev) => ({
          ...prev,
          manager_name: selectedManager.name,
        }))
      }
    }
  }, [projectManagers, formData.manager_id, formData.manager_name]) // [^1]

  useEffect(() => {
    fetchCustomer()
    fetchProjectManagers()
  }, [fetchCustomer, fetchProjectManagers])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    if (!customer) {
      setError("Original customer data not loaded. Cannot save changes.")
      return
    }

    try {
      const formDataToSend = new FormData()
      let hasChanges = false

      // 1. Compare and append only changed basic fields
      const fieldMappings = {
        name: "name", // formData.name vs customer.name
        age: "age",
        phone_number: "phone_number",
        email: "email", // formData.email vs customer.email
        address: "address",
        order_status: "order_status",
        clothing_name: "clothing_name",
        clothing_description: "clothing_description",
        priority: "priority",
        manager_id: "manager_id",
        duration: "duration",
      }

      for (const key in fieldMappings) {
        const formKey = key as keyof typeof formData
        const customerKey = fieldMappings[key as keyof typeof fieldMappings] as keyof Customer

        let formValue = formData[formKey]
        let customerValue = customer[customerKey]

        // Special handling for duration: ensure string for comparison and FormData append
        if (formKey === "duration") {
          formValue = String(formValue)
          customerValue = String(customerValue)
        }

        if (formValue !== customerValue) {
          formDataToSend.append(formKey, formValue + "") // Ensure string
          hasChanges = true
        }
      }

      // 2. Handle fitting dates
      const originalFirstFittingDateStr = customer.first_fitting_date
        ? new Date(customer.first_fitting_date).toISOString().split("T")[0]
        : ""
      const currentFirstFittingDateStr = firstFittingDate ? firstFittingDate.toISOString().split("T")[0] : ""

      if (currentFirstFittingDateStr !== originalFirstFittingDateStr) {
        formDataToSend.append("first_fitting_date", currentFirstFittingDateStr)
        hasChanges = true
      }

      const originalSecondFittingDateStr = customer.second_fitting_date
        ? new Date(customer.second_fitting_date).toISOString().split("T")[0]
        : ""
      const currentSecondFittingDateStr = secondFittingDate ? secondFittingDate.toISOString().split("T")[0] : ""

      if (currentSecondFittingDateStr !== originalSecondFittingDateStr) {
        formDataToSend.append("second_fitting_date", currentSecondFittingDateStr)
        hasChanges = true
      }

      // Handle collection date
      const originalCollectionDateStr = customer.collection_date
        ? new Date(customer.collection_date).toISOString().split("T")[0]
        : ""
      const currentCollectionDateStr = collectionDate ? collectionDate.toISOString().split("T")[0] : ""

      if (currentCollectionDateStr !== originalCollectionDateStr) {
        formDataToSend.append("collection_date", currentCollectionDateStr)
        hasChanges = true
      }

      // 3. Handle image changes
      const originalImages = customer.style_reference_images || []
      const currentKeptImages = formData.style_reference_images // These are the existing images that were NOT removed

      // Check if the set of existing images has changed (removed or reordered)
      const existingImagesChanged =
        originalImages.length !== currentKeptImages.length ||
        !originalImages.every((url) => currentKeptImages.includes(url))

      // Check if new images were added
      const newImagesAdded = selectedFiles.length > 0

      if (existingImagesChanged || newImagesAdded) {
        // If any image changes, send the full updated list of existing images to keep
        // and any new files. The backend should handle replacing the old list.
        currentKeptImages.forEach((url, index) => {
          formDataToSend.append(`existing_style_reference_images[${index}]`, url)
        })
        selectedFiles.forEach((file, index) => {
          formDataToSend.append(`style_reference_images[${index}]`, file)
        })
        hasChanges = true
      }

      if (!hasChanges) {
        setSuccessMessage("No changes detected.")
        setTimeout(() => setSuccessMessage(""), 2000) // Clear message after 2 seconds
        return // Exit if no changes
      }

      const response = await editOrder(orderId, formDataToSend)
      setSuccessMessage("Order updated successfully!")
      setTimeout(() => router.push("/client-manager/orders"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <SkeletonLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-xl"
        >
          <div className="mb-4 text-lg text-red-500">Error: {error}</div>
          <button
            onClick={fetchCustomer}
            className="rounded-lg bg-orange-500 px-6 py-2 text-white transition-colors hover:bg-orange-600"
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
              className="fixed left-0 right-0 top-5 z-50 flex justify-center"
            >
              <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white shadow-lg">
                {successMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href="/client-manager/orders"
            className="group inline-flex items-center text-orange-600 transition-colors hover:text-orange-700"
          >
            <IoIosArrowBack className="mr-2 transition-transform group-hover:-translate-x-1" size={24} />
            <span className="font-medium">Back to Orders</span>
          </Link>
          <h1 className="mb-2 mt-4 text-3xl font-bold text-gray-800">Edit Order</h1>
          <p className="text-gray-600">Update order details and measurements</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h2 className="flex items-center text-xl font-bold text-white">
                <FiUser className="mr-3" /> Basic Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Order ID</label>
                  <input
                    type="text"
                    name="order_id"
                    value={formData.order_id}
                    disabled
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Clothing Name</label>
                  <input
                    type="text"
                    name="clothing_name"
                    value={formData.clothing_name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
                    className="w-full resize-none rounded-xl border border-gray-200 p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Order Status</label>
                  <select
                    name="order_status"
                    value={formData.order_status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-gray-200 bg-white p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="pending">⏳ Pending</option>
                    <option value="processing">⚙️ Processing</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
                {/* Display selected manager name and Change button */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Head of Tailoring</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.manager_name || "Not assigned"}
                      disabled
                      className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-600 focus:outline-none"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowManagerDropdown(!showManagerDropdown)}
                      className="rounded-xl bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
                    >
                      {showManagerDropdown ? "Cancel" : "Change"}
                    </Button>
                  </div>
                </div>
                {/* Conditionally render Change Head of Tailoring dropdown */}
                {showManagerDropdown && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-semibold text-gray-700">Change Head of Tailoring</label>
                    <select
                      name="manager_id"
                      value={formData.manager_id || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 bg-white p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Style Reference Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h2 className="text-xl font-bold text-white">Style Reference Images</h2>
            </div>
            <div className="p-6">
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {previewUrls.map((url, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="aspect-square cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 transition-colors hover:border-orange-300">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Style reference ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => openImageModal(index)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    >
                      <IoMdTrash size={16} />
                    </button>
                  </motion.div>
                ))}
                {/* Add Image Button */}
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-300 transition-all hover:border-orange-500 hover:bg-orange-50"
                >
                  <IoMdAdd className="mb-2 text-orange-400 group-hover:text-orange-600" size={32} />
                  <span className="font-medium text-orange-600">Add Image</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </motion.label>
              </div>
            </div>
          </motion.div>

          {/* Fitting Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <h2 className="flex items-center text-xl font-bold text-white">
                <FiCalendar className="mr-3" /> Fitting Schedule
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    className="w-full rounded-xl border border-gray-200 p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
                    className="w-full rounded-xl border border-gray-200 p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
                    className="w-full rounded-xl border border-gray-200 p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Collection Date</label>
                  <DatePicker
                    selected={collectionDate}
                    onChange={(date) => setCollectionDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    className="w-full rounded-xl border border-gray-200 p-3 transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    minDate={secondFittingDate || firstFittingDate || new Date()}
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
              className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:from-orange-600 hover:to-orange-700"
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
              onClick={closeImageModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="max-h-[90vh] max-w-4xl overflow-auto rounded-2xl bg-white p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Style Reference {selectedImageIndex + 1}</h3>
                  <button onClick={closeImageModal} className="text-gray-500 transition-colors hover:text-gray-700">
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
                      className="max-h-[70vh] max-w-full rounded-xl object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg" // Fallback to a generic placeholder
                        e.currentTarget.alt = "Image failed to load"
                      }}
                    />
                  </div>
                )}
                {previewUrls.length > 1 && (
                  <div className="mt-4 flex justify-center space-x-2">
                    {previewUrls.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`h-3 w-3 rounded-full transition-colors ${
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
