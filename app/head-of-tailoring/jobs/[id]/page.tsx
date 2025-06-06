"use client"

import type React from "react"
import Spinner from "@/components/Spinner"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { IoIosArrowBack, IoMdCloudOutline, IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import {
  FaCheckCircle,
  FaRegCircle,
  FaUserTie,
  FaSearch,
  FaImages,
  FaUpload,
  FaPaperPlane,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { TbRulerMeasure2 } from "react-icons/tb";

export default function ShowCustomer() {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [selectedModalImage, setSelectedModalImage] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [isAssignSectionVisible, setIsAssignSectionVisible] = useState(false)

  const [tailorOptions, setTailorOptions] = useState<
    {
      user_id: any
      id: number
      name: string
      email: string
    }[]
  >([])

  const [tailorsLoading, setTailorsLoading] = useState(false)
  const [tailorsError, setTailorsError] = useState<string | null>(null)

  const fetchTailors = async () => {
    setTailorsLoading(true)
    setTailorsError(null)
    try {
      const session = await getSession()
      const token = session?.user?.token
      if (!token) throw new Error("Not authenticated")

      const res = await fetch("https://hildam.insightpublicis.com/api/listoftailors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      const json = await res.json()
      const list = (json.data as any[]).map((t) => ({
        id: Number(t.id),
        name: t.name,
        email: t.email,
        user_id: t.user_id,
      }))

      setTailorOptions(list)
    } catch (err) {
      setTailorsError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setTailorsLoading(false)
    }
  }

  useEffect(() => {
    fetchTailors()
  }, [])

  const [assignedTailors, setAssignedTailors] = useState<{ name: string; email: string }[]>([])

  const fetchAssignedTailors = async () => {
    try {
      const session = await getSession()
      const accessToken = session?.user?.token
      const response = await fetch(`https://hildam.insightpublicis.com/api/tailorjoblists/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch assigned tailors")
      }

      const result = await response.json()
      const { tailor_names, tailor_emails } = result.data

      const tailors = tailor_names.map((name: any, index: string | number) => ({
        name,
        email: tailor_emails[index],
      }))

      setAssignedTailors(tailors)
    } catch (error) {
      console.error("Error fetching assigned tailors:", error)
    }
  }

  const [selectedTailors, setSelectedTailors] = useState<number[]>([1, 2])
  const [isAssigning, setIsAssigning] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTailors = tailorOptions.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleTailor = (tailorId: number) => {
    setSelectedTailors((prev) => (prev.includes(tailorId) ? prev.filter((id) => id !== tailorId) : [...prev, tailorId]))
  }

  const handleAssignTailors = async () => {
    if (selectedTailors.length === 0) return
    setIsAssigning(true)
    try {
      const session = await getSession()
      const accessToken = session?.user?.token

      const tailorIds = selectedTailors
        .map((tid) => {
          const t = tailorOptions.find((o) => o.id === tid)
          return t ? t.user_id : null
        })
        .filter((u): u is number => u !== null)

      const res = await fetch(`https://hildam.insightpublicis.com/api/edittailorjob/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ tailor_id: tailorIds }),
      })
      if (!res.ok) throw new Error("Failed to assign tailors")

      const newlyAssigned = selectedTailors.map((tid) => {
        const t = tailorOptions.find((o) => o.id === tid)!
        return { id: t.id, name: t.name, email: t.email }
      })
      setAssignedTailors(newlyAssigned)

      setUploadMessage("Tailors assigned successfully")
      setIsAssignSectionVisible(false)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsAssigning(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const handleCustomerImageClick = (imageUrl: string) => {
    setSelectedModalImage(imageUrl)
    setIsCustomerModalOpen(true)
  }

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false)
    setSelectedModalImage("")
  }

  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    if (uploadMessage) {
      setTimeout(() => setUploadMessage(null), 5000)
    }
  }, [uploadMessage])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleUploadImage = async () => {
    if (!selectedImage) return

    const formData = new FormData()
    formData.append("design_image", selectedImage)

    setIsUploading(true)
    setUploadMessage(null)
    setUploadError(null)

    try {
      const session = await getSession()
      const accessToken = session?.user?.token
      const response = await fetch(`https://hildam.insightpublicis.com/api/edittailorjob/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const result = await response.json()
      setImagePath(result.data.image_path)
      setUploadMessage("Image uploaded successfully")
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendToProjectManager = async () => {
    if (!imagePath) return

    setIsSending(true)
    setUploadMessage(null)
    setUploadError(null)

    try {
      const session = await getSession()
      const accessToken = session?.user?.token
      const response = await fetch(`https://hildam.insightpublicis.com/api/sendtoorder/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_path: imagePath }),
      })

      if (!response.ok) {
        throw new Error("Failed to send image to project manager")
      }

      setUploadMessage("Image sent to project manager successfully")
      setSentSuccess(true)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSending(false)
    }

    router.push("/head-of-tailoring/jobs")
  }

  interface Customer {
    fullName: string
    age: number
    gender: string
    date: string
    address: string
    order_id: string
    bust: number
    waist: number
    hips: number
    shoulder_width: number
    neck: number
    arm_length: number
    back_length: number
    front_length: number
    customer_description: string
    clothing_name: string
    clothing_description: string
    high_bust: number
    tailor_image?: string
    project_manager_approval?: string
    style_reference_images?: string[]
    client_manager_approval: string
    hip: number
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
    assigned_tailors?: { id: number; name: string; email: string }[]
    client_manager_feedback?: string
  }

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomer = async () => {
    setLoading(true)
    setError(null)

    try {
      const session = await getSession()
      const accessToken = session?.user?.token
      const response = await fetch(`https://hildam.insightpublicis.com/api/tailorjoblists/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch customer data")
      }

      const result = await response.json()
      console.log("customer details: ", result)

      if (result.data) {
        const mappedCustomer: Customer = {
          fullName: result.data.customer_name,
          age: result.data.age,
          gender: result.data.gender,
          date: new Date().toLocaleDateString(),
          order_id: result.data.order_id,
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hips: result.data.hips || 0,
          shoulder_width: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          arm_length: result.data.arm_length || 0,
          back_length: result.data.back_length || 0,
          front_length: result.data.front_length || 0,
          customer_description: result.data.customer_description || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          clothing_description: result.data.clothing_description || "N/A",
          high_bust: result.data.high_bust || 0,
          tailor_image: result.data.tailor_image || null,
          project_manager_approval: result.data.project_manager_approval || null,
          client_manager_feedback: result.data.client_manager_feedback || null,
          style_reference_images: result.data.style_reference_images || [],
          client_manager_approval: result.data.client_manager_approval,
          hip: result.data.hip || 0,
          shoulder: result.data.shoulder || 0,
          bustpoint: result.data.bustpoint || 0,
          shoulder_to_underbust: result.data.shoulder_to_underbust || 0,
          round_under_bust: result.data.round_under_bust || 0,
          half_length: result.data.half_length || 0,
          blouse_length: result.data.blouse_length || 0,
          sleeve_length: result.data.sleeve_length || 0,
          round_sleeve: result.data.round_sleeve || 0,
          dress_length: result.data.dress_length || 0,
          chest: result.data.chest || 0,
          round_shoulder: result.data.round_shoulder || 0,
          skirt_length: result.data.skirt_length || 0,
          trousers_length: result.data.trousers_length || 0,
          round_thigh: result.data.round_thigh || 0,
          round_knee: result.data.round_knee || 0,
          round_feet: result.data.round_feet || 0,
          assigned_tailors: result.data.assigned_tailors || [],
        }
        setCustomer(mappedCustomer)

        fetchAssignedTailors()
        setSelectedTailors((mappedCustomer.assigned_tailors ?? []).map((t) => t.id))
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
    fetchCustomer()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600 font-medium">Loading customer details...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg"
        >
          <IoMdCloseCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchCustomer}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-gray-500 text-xl">No customer data found</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {(uploadMessage || uploadError) && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                uploadMessage
                  ? "bg-green-500/90 text-white border-green-400"
                  : "bg-red-500/90 text-white border-red-400"
              }`}
            >
              <div className="flex items-center gap-3">
                {uploadMessage ? <IoMdCheckmarkCircle className="text-2xl" /> : <IoMdCloseCircle className="text-2xl" />}
                <span className="font-medium">{uploadMessage || uploadError}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/head-of-tailoring/jobs"
            className="flex items-center gap-3 text-orange-600 hover:text-orange-700 transition-colors group"
          >
            <div className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
              <IoIosArrowBack size={24} />
            </div>
            <span className="font-semibold text-lg">Back to Jobs</span>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header Section */}
          <motion.div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white" variants={fadeInUp}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FaUserTie className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Tailor Job Information</h1>
                <p className="text-orange-100">Order #{customer.order_id}</p>
              </div>
            </div>
          </motion.div>

          <div className="p-8">
            {/* Basic Information */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <FaUserTie className="text-blue-600" />
                </div>
                Order Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Order ID", value: customer.order_id, icon: "📋" },
                  { label: "Order Date", value: customer.date, icon: "📅" },
                  { label: "Customer Name", value: customer.fullName, icon: "👤" },
                  { label: "Gender", value: customer.gender, icon: "⚧" },
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all"
                    whileHover={{ y: -2 }}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{field.icon}</div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">{field.label}</label>
                    <p className="text-gray-800 font-medium">{field.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Clothing Details */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <FaImages className="text-purple-600" />
                </div>
                Clothing Details
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                  variants={fadeInUp}
                >
                  <label className="block text-sm font-semibold text-purple-700 mb-2">Cloth Name</label>
                  <p className="text-gray-800 font-medium">{customer.clothing_name}</p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                  variants={fadeInUp}
                >
                  <label className="block text-sm font-semibold text-purple-700 mb-2">Clothing Description</label>
                  <p className="text-gray-800 font-medium">{customer.clothing_description}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Style Reference Images */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <FaImages className="text-green-600" />
                </div>
                Style Reference Images
              </h2>

              {!customer.style_reference_images || customer.style_reference_images.length === 0 ? (
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center"
                  variants={fadeInUp}
                >
                  <FaImages className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No style reference images available</p>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                >
                  {customer.style_reference_images.map((imageUrl, index) => (
                    <motion.div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleCustomerImageClick(imageUrl)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Style reference ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=300&width=300"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full">
                            <FaSearch className="text-gray-800" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white font-medium">Reference {index + 1}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Measurements */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                Measurements
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                  { label: "Shoulder", value: customer.shoulder, unit: "inches" },
                  { label: "Bust", value: customer.bust, unit: "inches" },
                  { label: "Bust Point", value: customer.bustpoint, unit: "inches" },
                  { label: "Shoulder To Underbust", value: customer.shoulder_to_underbust, unit: "inches" },
                  { label: "Round Under Bust", value: customer.round_under_bust, unit: "inches" },
                  { label: "Waist", value: customer.waist, unit: "inches" },
                  { label: "Half Length", value: customer.half_length, unit: "inches" },
                  { label: "Blouse Length", value: customer.blouse_length, unit: "inches" },
                  { label: "Sleeve Length", value: customer.sleeve_length, unit: "inches" },
                  { label: "Round Sleeve", value: customer.round_sleeve, unit: "inches" },
                  { label: "Dress Length", value: customer.dress_length, unit: "inches" },
                  { label: "Hip", value: customer.hip, unit: "inches" },
                  { label: "Chest", value: customer.chest, unit: "inches" },
                  { label: "Round Shoulder", value: customer.round_shoulder, unit: "inches" },
                  { label: "Skirt Length", value: customer.skirt_length, unit: "inches" },
                ].map((measurement, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 hover:shadow-md transition-all"
                    variants={fadeInUp}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <label className="block text-xs font-semibold text-yellow-700 mb-1">{measurement.label}</label>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-800">{measurement.value}</span>
                      <span className="text-xs text-gray-500">{measurement.unit}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Assigned Tailors */}
            <motion.div variants={fadeInUp} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <FaUserTie className="text-green-600" />
                  </div>
                  Assigned Tailors
                </h2>
                <motion.button
                  onClick={() => setIsAssignSectionVisible((prev) => !prev)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUserTie />
                  {isAssignSectionVisible ? "Hide Assign" : "Assign Tailors"}
                </motion.button>
              </div>

              {assignedTailors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignedTailors.map((tailor, index) => (
                    <motion.div
                      key={index}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 hover:shadow-md transition-all"
                      variants={fadeInUp}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <FaUserTie className="text-green-600 text-xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{tailor.name}</h3>
                          <p className="text-green-600 text-sm">{tailor.email}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center"
                  variants={fadeInUp}
                >
                  <FaUserTie className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-xl">No tailors assigned yet</p>
                  <p className="text-gray-400 text-sm mt-2">Click "Assign Tailors" to get started</p>
                </motion.div>
              )}
            </motion.div>

            {/* Assign Tailors Section */}
            <AnimatePresence>
              {isAssignSectionVisible && (
                <motion.div
                  className="mb-12 bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-3xl border border-orange-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <FaUserTie className="text-orange-500 text-2xl" />
                    </div>
                    <h2 className="ml-4 text-2xl font-bold text-gray-700">Assign Tailors to Order</h2>
                  </div>

                  {tailorsLoading && (
                    <div className="text-center py-8">
                      <Spinner />
                      <p className="mt-4 text-gray-600">Loading tailors...</p>
                    </div>
                  )}

                  {tailorsError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                      <IoMdCloseCircle className="text-red-500 text-4xl mx-auto mb-2" />
                      <p className="text-red-600 font-medium">Error loading tailors: {tailorsError}</p>
                      <button
                        onClick={fetchTailors}
                        className="mt-3 text-red-600 hover:text-red-700 underline font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {!tailorsLoading && !tailorsError && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {filteredTailors.map((tailor) => {
                          const isSelected = selectedTailors.includes(tailor.id)
                          return (
                            <motion.button
                              key={tailor.id}
                              onClick={() => toggleTailor(tailor.id)}
                              className={`flex items-center justify-between p-6 border-2 rounded-2xl transition-all focus:outline-none ${
                                isSelected
                                  ? "bg-orange-100 border-orange-300 shadow-md"
                                  : "bg-white hover:shadow-md border-gray-200 hover:border-orange-200"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="text-left">
                                <h3 className="text-gray-800 font-bold">{tailor.name}</h3>
                                <p className="text-gray-500 text-sm">{tailor.email}</p>
                              </div>
                              {isSelected ? (
                                <FaCheckCircle className="text-orange-500 text-2xl" />
                              ) : (
                                <FaRegCircle className="text-gray-300 text-2xl" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>

                      <motion.button
                        onClick={handleAssignTailors}
                        disabled={isAssigning || selectedTailors.length === 0}
                        className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                          isAssigning || selectedTailors.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl"
                        }`}
                        whileHover={!isAssigning && selectedTailors.length > 0 ? { scale: 1.02 } : {}}
                        whileTap={!isAssigning && selectedTailors.length > 0 ? { scale: 0.98 } : {}}
                      >
                        {isAssigning ? (
                          <>
                            <Spinner />
                            Assigning Tailors...
                          </>
                        ) : (
                          <>
                            <FaUserTie />
                            Assign Selected Tailors ({selectedTailors.length})
                          </>
                        )}
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image Upload Section */}
            {customer.tailor_image === null && (
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaUpload className="text-blue-600 text-2xl" />
                  </div>
                  <h2 className="ml-4 text-2xl font-bold text-gray-700">Design Upload</h2>
                </div>

                {customer.client_manager_approval !== "accepted" && (
                  <motion.div className="mb-6" variants={fadeInUp}>
                    <label className="block text-gray-700 font-medium mb-4">
                      {customer.tailor_image === null ? (
                        <span className="flex items-center gap-2">
                          <IoMdCloudOutline className="text-xl" />
                          Please upload a design image
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaUpload className="text-xl" />
                          Edit Design Image
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl bg-white hover:bg-blue-50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:font-medium hover:file:bg-blue-600"
                      />
                    </div>
                  </motion.div>
                )}

                {imagePreview && (
                  <motion.div
                    className="mb-6 flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative group">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Selected design"
                        className="w-64 h-64 object-cover rounded-2xl border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <IoMdCloseCircle className="text-xl" />
                      </button>
                    </div>
                    <p className="mt-3 text-gray-600 font-medium">Design Preview</p>
                  </motion.div>
                )}

                {selectedImage && !imagePath && (
                  <motion.button
                    onClick={handleUploadImage}
                    disabled={isUploading}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      isUploading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isUploading ? { scale: 1.02 } : {}}
                    whileTap={!isUploading ? { scale: 0.98 } : {}}
                  >
                    {isUploading ? (
                      <>
                        <Spinner />
                        Uploading Design...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload Design
                      </>
                    )}
                  </motion.button>
                )}

                {imagePath && !sentSuccess && (
                  <motion.button
                    onClick={handleSendToProjectManager}
                    disabled={isSending}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 mt-4 ${
                      isSending
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isSending ? { scale: 1.02 } : {}}
                    whileTap={!isSending ? { scale: 0.98 } : {}}
                  >
                    {isSending ? (
                      <>
                        <Spinner />
                        Sending to Client Manager...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send to Client Manager
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Existing Image Status */}
            {customer.tailor_image !== null && (
              <motion.div
                className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <FaImages className="text-gray-600 text-2xl" />
                  </div>
                  <h2 className="ml-4 text-2xl font-bold text-gray-700">Design Status</h2>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="relative group">
                    <Image
                      src={customer.tailor_image || "/placeholder.svg"}
                      alt="Submitted design"
                      width={120}
                      height={120}
                      className="rounded-2xl border-4 border-white shadow-lg"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    {customer.client_manager_approval === "pending" && (
                      <>
                        <div className="p-3 bg-yellow-100 rounded-full">
                          <IoMdCloseCircle className="text-yellow-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-yellow-600 text-lg">Under Review</h3>
                          <p className="text-gray-600">Your design is being reviewed by the client manager</p>
                        </div>
                      </>
                    )}
                    {customer.client_manager_approval === "accepted" && (
                      <>
                        <div className="p-3 bg-green-100 rounded-full">
                          <IoMdCheckmarkCircle className="text-green-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-600 text-lg">Design Approved</h3>
                          <p className="text-gray-600">Great! Your design has been approved</p>
                        </div>
                      </>
                    )}
                    {customer.client_manager_approval === "rejected" && (
                      <>
                        <div className="p-3 bg-red-100 rounded-full">
                          <IoMdCloseCircle className="text-red-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-red-600 text-lg">Design Rejected</h3>
                          <p className="text-gray-600">Please review the feedback and submit a new design</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {customer.client_manager_approval === "rejected" && customer.client_manager_feedback && (
                  <motion.div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6" variants={fadeInUp}>
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                      <IoMdCloseCircle />
                      Feedback from Client Manager
                    </h4>
                    <p className="text-red-600">{customer.client_manager_feedback}</p>
                  </motion.div>
                )}

                {customer.client_manager_approval === "accepted" && (
                  <motion.div
                    className="text-center bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-2xl text-white"
                    variants={fadeInUp}
                  >
                    <IoMdCheckmarkCircle className="text-6xl mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Ready for Inventory Request</h3>
                    <p className="mb-6 text-green-100">
                      Your design has been approved! You can now request the necessary inventory items.
                    </p>
                    <Link href={`/head-of-tailoring/jobs/${id}/request-inventory`}>
                      <motion.button
                        className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors flex items-center gap-3 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaUpload />
                        Request Inventory
                      </motion.button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Rejected Design Re-upload */}
            {customer.client_manager_approval === "rejected" && (
              <motion.div
                className="mt-8 bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-3xl border border-red-200"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-red-100 rounded-full">
                    <FaUpload className="text-red-600 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-700">Submit New Design</h2>
                    <p className="text-gray-600">Please upload a new design that addresses the feedback</p>
                  </div>
                </div>

                <motion.div className="mb-6" variants={fadeInUp}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-4 border-2 border-dashed border-red-300 rounded-xl bg-white hover:bg-red-50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500 file:text-white file:font-medium hover:file:bg-red-600"
                  />
                </motion.div>

                {imagePreview && (
                  <motion.div
                    className="mb-6 flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="New design"
                        className="w-64 h-64 object-cover rounded-2xl border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <IoMdCloseCircle className="text-xl" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {selectedImage && !imagePath && (
                  <motion.button
                    onClick={handleUploadImage}
                    disabled={isUploading}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      isUploading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isUploading ? { scale: 1.02 } : {}}
                    whileTap={!isUploading ? { scale: 0.98 } : {}}
                  >
                    {isUploading ? (
                      <>
                        <Spinner />
                        Uploading New Design...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload New Design
                      </>
                    )}
                  </motion.button>
                )}

                {imagePath && !sentSuccess && (
                  <motion.button
                    onClick={handleSendToProjectManager}
                    disabled={isSending}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 mt-4 ${
                      isSending
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isSending ? { scale: 1.02 } : {}}
                    whileTap={!isSending ? { scale: 0.98 } : {}}
                  >
                    {isSending ? (
                      <>
                        <Spinner />
                        Sending to Client Manager...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send to Client Manager
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCustomerCloseModal}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCustomerCloseModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              >
                <IoMdCloseCircle className="text-2xl" />
              </button>
              <Image
                src={selectedModalImage || "/placeholder.svg"}
                alt="Style Reference"
                width={800}
                height={600}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=600&width=800"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
