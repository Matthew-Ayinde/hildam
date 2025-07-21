"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getSession } from "next-auth/react"
import { FaUser, FaEnvelope, FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa"
import {
  HiOutlineSparkles,
  HiOutlinePhotograph,
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineStar,
} from "react-icons/hi"
import { MdOutlineRule, MdOutlineCloudUpload, MdOutlineCheckCircle } from "react-icons/md"
import { BsPerson } from "react-icons/bs"
import { useRouter } from "next/navigation"
import Spinner from "@/components/Spinner"
import { createOrder, fetchAllCustomers, fetchCustomer, fetchHeadOfTailoringList } from "@/app/api/apiClient"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"

const dummyCustomers = [
  {
    id: 1,
    name: "Chioma Ante",
    email: "chioma@gmail.com",
    age: "21",
    blouse_length: 42.1,
    bust: 36.5,
    bust_point: 37.0,
    chest: 38.2,
    dress_length: 50.0,
    half_length: 25.5,
    hip: 40.3,
    round_shoulder: 12.5,
    round_sleeve: 16.0,
    round_under_bust: 34.2,
    shoulder: 14.1,
    shoulder_to_underbust: 9.8,
    sleeve_length: 24.3,
    skirt_length: 45.7,
    waist: 32.0,
  },
]

type FormDataType = {
  blouse_length: string
  bust: string
  bustpoint: string
  chest: string
  clothing_description: string
  clothing_name: string
  customer_description: string
  customer_email: string
  customer_name: string
  dress_length: string
  gender: string
  half_length: string
  hip: string
  manager_id: string
  neck: string
  order_status: string
  phone_number: string
  priority: string
  round_shoulder: string
  round_sleeve: string
  round_under_bust: string
  shoulder: string
  shoulder_to_underbust: string
  skirt_length: string
  sleeve_length: string
  style_reference_images: File[]
  waist: string
  customer_id: string
}

const initialFormData: FormDataType = {
  blouse_length: "",
  bust: "",
  bustpoint: "",
  chest: "",
  clothing_description: "",
  clothing_name: "",
  customer_description: "",
  customer_email: "",
  customer_name: "",
  dress_length: "",
  gender: "",
  half_length: "",
  hip: "",
  manager_id: "",
  neck: "",
  order_status: "",
  phone_number: "",
  priority: "",
  round_shoulder: "",
  round_sleeve: "",
  round_under_bust: "",
  shoulder: "",
  shoulder_to_underbust: "",
  skirt_length: "",
  sleeve_length: "",
  style_reference_images: [],
  waist: "",
  customer_id: "",
}

const Form = () => {
  const [formData, setFormData] = useState<FormDataType & { style_reference_images: File[] }>({
    ...initialFormData,
    style_reference_images: [] as File[],
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState<typeof dummyCustomers>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [basicCustomers, setBasicCustomers] = useState<typeof dummyCustomers>([])
  const [managers, setManagers] = useState<
    {
      id: string
      name: string
    }[]
  >([])
  const [loadingManagers, setLoadingManagers] = useState(true)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [popupMessage, setPopupMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchAllCustomers()
        console.log('customersss', res)
        
        setBasicCustomers(res)
      } catch (err) {
        console.error("Failed to load customer list", err)
      }
    })()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    const getHeadOfTailoringList = async () => {
      try {
        setLoadingManagers(true)
       

        const response = await fetchHeadOfTailoringList()

        const result = response.head_of_tailoring
        setManagers(result)
      } catch (error) {
        console.error(error)
      } finally {
        setLoadingManagers(false)
      }
    }

    getHeadOfTailoringList()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (name === "style_reference_images" && e.target instanceof HTMLInputElement) {
      const files = Array.from(e.target.files || [])
      const newFiles = [...formData.style_reference_images, ...files].slice(0, 5)
      setFormData((f) => ({ ...f, style_reference_images: newFiles }))
      const newPreviews = newFiles.map((f) => URL.createObjectURL(f))
      setImagePreviews(newPreviews)
      return
    }

    if (type === "file" && e.target instanceof HTMLInputElement) {
      const file = e.target.files ? e.target.files[0] : null
      setFormData((prev) => ({ ...prev, [name]: file }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "customer_name") {
      setFormData((f) => ({ ...f, customer_name: value }))
      if (value.trim()) {
        const matches = basicCustomers.filter((c) => c.name.toLowerCase().includes(value.trim().toLowerCase()))
        setFilteredCustomers(matches)
        setShowSuggestions(matches.length > 0)
      } else {
        setFilteredCustomers([])
        setShowSuggestions(false)
      }
      return
    }
  }

  const removeImage = (index: number) => {
    setFormData((f) => {
      const imgs = [...f.style_reference_images]
      imgs.splice(index, 1)
      return { ...f, style_reference_images: imgs }
    })
    setImagePreviews((prev) => {
      const p = [...prev]
      p.splice(index, 1)
      return p
    })
  }

  const handleSelect = async (customer: { id: string; name: string; email: string; age: string }) => {
    try {
      setShowSuggestions(false)
      const customerId = customer.id

      const data = await fetchCustomer(customerId)

      setFormData((f) => ({
        ...f,
        customer_name: data.name,
        customer_email: data.email,
        blouse_length: data.blouse_length,
        bust: data.bust,
        bustpoint: data.bustpoint,
        chest: data.chest,
        dress_length: data.dress_length,
        half_length: data.half_length,
        hip: data.hip,
        round_shoulder: data.round_shoulder,
        round_sleeve: data.round_sleeve,
        round_under_bust: data.round_under_bust,
        shoulder: data.shoulder,
        shoulder_to_underbust: data.shoulder_to_underbust,
        sleeve_length: data.sleeve_length,
        skirt_length: data.skirt_length,
        waist: data.waist,
        customer_description: data.customer_description,
        customer_id: data.id
      }))
    } catch (err) {
      console.error("Failed to load customer details", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResponseMessage(null)

    
    try {
      
      const payload = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "style_reference_images") return
        if (value !== "" && value != null) {
          payload.append(key, value as string)
        }
      })

      formData.style_reference_images.forEach((file) => {
        payload.append("style_reference_images[]", file)
      })

      const response = await createOrder(formData)
      console.log('create order', response)

  

      setResponseMessage("Order created successfully!")
      setMessageType("success")
      router.push(ApplicationRoutes.AdminOrders)

      // // Reset form after successful submission
      // setTimeout(() => {
      //   setFormData({ ...initialFormData, style_reference_images: [] })
      //   setImagePreviews([])
      // }, 2000)
    } catch (error: any) {

      const messages = error.response.data.message;
      const firstKey = Object.keys(messages)[0];   
      const firstMessage = messages[firstKey][0]

      setResponseMessage(firstMessage || "An unexpected error occurred.")
      setMessageType("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setResponseMessage(null), 5000)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-red-50 text-red-700"
      case "medium":
        return "border-yellow-300 bg-yellow-50 text-yellow-700"
      case "low":
        return "border-green-300 bg-green-50 text-green-700"
      default:
        return "border-gray-300 bg-white text-gray-700"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 md:p-0"
    >
      <div className="max-w-6xl mx-auto">
        {/* Toast Notifications */}
        <AnimatePresence>
          {responseMessage && (
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
                {messageType === "success" ? <MdOutlineCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
                <span className="font-medium">{responseMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <HiOutlineClipboardList className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Create New Order</h1>
                <p className="text-orange-100 mt-1">Fill in the details to create a new tailoring order</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Customer Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                  <BsPerson className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Customer Information</h2>
                  <p className="text-gray-600">Enter customer details and order preferences</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Name with Autocomplete */}
                <div className="relative" ref={inputRef}>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaUser className="text-blue-500" size={14} />
                    <span>Customer Name</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="customer_name"
                    name="customer_name"
                    type="text"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="Start typing customer name..."
                    autoComplete="off"
                    className="w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                  />
                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto"
                      >
                        {filteredCustomers.map((c) => (
                          <motion.li
                            key={c.id}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            onClick={() =>
                              handleSelect({
                                id: String(c.id),
                                name: c.name,
                                email: c.email,
                                age: c.age,
                              })
                            }
                            className="px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-800">{c.name}</div>
                            <div className="text-sm text-gray-500">{c.email}</div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* Customer Email */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FaEnvelope className="text-blue-500" size={14} />
                    <span>Email Address</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    id="customer_email"
                    name="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="Enter customer email"
                    required
                    className="w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiOutlineStar className="text-yellow-500" size={16} />
                    <span>Priority Level</span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-xl border shadow-sm p-3 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400 transition-all duration-200 ${getPriorityColor(formData.priority)}`}
                  >
                    <option value="" disabled>
                      Select Priority Level
                    </option>
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">🟢 Low Priority</option>
                  </select>
                </div>

                {/* Manager Selection */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiOutlineUserGroup className="text-purple-500" size={16} />
                    <span>Head of Tailoring</span>
                  </label>
                  {loadingManagers ? (
                    <div className="flex items-center justify-center p-3 border border-gray-300 rounded-xl bg-gray-50">
                      <Spinner />
                      <span className="ml-2 text-sm text-gray-500">Loading managers...</span>
                    </div>
                  ) : (
                    <select
                      id="manager_id"
                      name="manager_id"
                      value={formData.manager_id}
                      onChange={handleChange}
                      // required
                      className="w-full rounded-xl border border-gray-300 shadow-sm p-3 bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200"
                    >
                      <option value="">Select Head of Tailoring</option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Clothing Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                  <HiOutlineSparkles className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Clothing Details</h2>
                  <p className="text-gray-600">Specify the clothing requirements and descriptions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiOutlineSparkles className="text-purple-500" size={14} />
                    <span>Clothing Name</span>
                  </label>
                  <textarea
                    id="clothing_name"
                    name="clothing_name"
                    rows={3}
                    value={formData.clothing_name}
                    onChange={handleChange}
                    placeholder="Enter the name of the clothing item"
                    className="w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiOutlineSparkles className="text-purple-500" size={14} />
                    <span>Clothing Description</span>
                  </label>
                  <textarea
                    id="clothing_description"
                    name="clothing_description"
                    rows={3}
                    value={formData.clothing_description}
                    onChange={handleChange}
                    placeholder="Describe the clothing details, style, and requirements"
                    className="w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <BsPerson className="text-purple-500" size={14} />
                  <span>Customer Description</span>
                </label>
                <textarea
                  id="customer_description"
                  name="customer_description"
                  rows={4}
                  value={formData.customer_description}
                  onChange={handleChange}
                  placeholder="Enter any specific customer requirements or notes"
                  required
                  className="w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 resize-none"
                />
              </div>
            </motion.div>

            {/* Style Reference Images Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                  <HiOutlinePhotograph className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Style Reference Images</h2>
                  <p className="text-gray-600">Upload up to 5 reference images for the design</p>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <MdOutlineCloudUpload className="text-emerald-500" size={16} />
                  <span>Upload Images (Max 5)</span>
                </label>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-emerald-400 transition-all duration-200"
                >
                  <input
                    id="style_reference_images"
                    name="style_reference_images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <MdOutlineCloudUpload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </motion.div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {imagePreviews.map((src, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative group"
                      >
                        <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-emerald-300 transition-all duration-200">
                          <img
                            src={src || "/placeholder.svg"}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
                        >
                          <FaTimes size={12} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Measurements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl">
                    <MdOutlineRule className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Measurements</h2>
                    <p className="text-gray-600">Enter detailed body measurements</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">For multiple values,</p>
                  <p className="text-sm text-gray-500">use hyphen (e.g., 2-3-4)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
              { id: "shoulder", label: "Shoulder" },
              { id: "bust", label: "Bust" },
              { id: "bustpoint", label: "Bust Point" },
              { id: "shoulder_to_underbust", label: "Shoulder to Under Bust" },
              { id: "round_under_bust", label: "Round Under Bust" },
              { id: "waist", label: "Waist" },
              { id: "half_length", label: "Half Length" },
                  { id: "blouse_length", label: "Blouse Length" },
                  { id: "sleeve_length", label: "Sleeve Length" },
                  { id: "round_sleeve", label: "Round Sleeve" },
                  { id: "dress_length", label: "Dress Length" },
                  { id: "hip", label: "Hip" },
                  { id: "chest", label: "Chest" },
                  { id: "round_shoulder", label: "Round Shoulder" },
                  { id: "skirt_length", label: "Skirt Length" },
                ].map(({ id, label }, index) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        id={id}
                        name={id}
                        type="text"
                        value={formData[id as keyof FormDataType] as string}
                        onChange={handleChange}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="w-full rounded-xl border border-gray-300 shadow-sm p-3 pr-10 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        cm
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex justify-center pt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    <span>Creating Order...</span>
                  </>
                ) : (
                  <>
                    <FaCheck size={18} />
                    <span>Create Order</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Form
