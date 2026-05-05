"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { HiOutlineCollection, HiOutlinePhotograph } from "react-icons/hi"
import { IoArrowBack, IoCalendarOutline, IoClose } from "react-icons/io5"
import Spinner from "@/components/Spinner"
import { editFabric, fetchFabric } from "@/app/api/apiClient"

interface Fabric {
  id: number
  customer_name: string
  description: string
  staff_name: string
  dropped_off_at: string
  status: string | null
  fabric_images: string[]
  created_at: string
  updated_at: string
}

export default function AdminFabricViewPage() {
  const params = useParams()
  const id = params?.id as string

  const [fabric, setFabric] = useState<Fabric | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<"success" | "error">("success")
  const [formData, setFormData] = useState({
    customer_name: "",
    description: "",
    staff_name: "",
    dropped_off_at: "",
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const formatForInputDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getFabric = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchFabric(id)
      setFabric(response)
      setFormData({
        customer_name: response.customer_name || "",
        description: response.description || "",
        staff_name: response.staff_name || "",
        dropped_off_at: response.dropped_off_at ? formatForInputDate(response.dropped_off_at) : "",
      })
    } catch (fetchError) {
      console.error("Error fetching fabric:", fetchError)
      setError("Unable to load fabric details")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      getFabric()
    }
  }, [id, getFabric])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return
    setSelectedFiles(Array.from(files))
  }

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const payload = new FormData()
      payload.append("customer_name", formData.customer_name)
      payload.append("description", formData.description)
      payload.append("staff_name", formData.staff_name)
      payload.append("dropped_off_at", formData.dropped_off_at)

      selectedFiles.forEach((file) => {
        payload.append("fabric_images[]", file)
      })

      const response = await editFabric(id, payload)

      if (!response) {
        throw new Error("Failed to update fabric")
      }

      setStatusMessage("Fabric updated successfully")
      setStatusType("success")
      setIsEditMode(false)
      setSelectedFiles([])
      await getFabric()
    } catch (submitError) {
      console.error("Error updating fabric:", submitError)
      setStatusMessage("Unable to update fabric")
      setStatusType("error")
    } finally {
      setIsSaving(false)
      setTimeout(() => setStatusMessage(null), 2500)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error || !fabric) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Link
          href="/client-manager/fabrics"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <IoArrowBack size={16} />
          Back to Fabrics
        </Link>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-rose-700">
          {error || "Fabric not found"}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-white shadow-lg ${
              statusType === "success"
                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                : "bg-gradient-to-r from-rose-500 to-red-600"
            }`}
          >
            <p className="font-medium">{statusMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 p-4">
            <HiOutlineCollection className="text-orange-600" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Fabric Details</h1>
            <p className="text-sm text-gray-600">View full details of this fabric entry</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsEditMode((prev) => !prev)
              setSelectedFiles([])
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100"
          >
            {isEditMode ? "Cancel Edit" : "Edit Fabric"}
          </button>
          <Link
            href="/client-manager/fabrics"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <IoArrowBack size={16} />
            Back to Fabrics
          </Link>
        </div>
      </div>

      {isEditMode ? (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleEditSubmit}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Customer Name</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Staff Name</label>
              <input
                type="text"
                name="staff_name"
                value={formData.staff_name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Dropped Off At</label>
              <input
                type="date"
                name="dropped_off_at"
                value={formData.dropped_off_at}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Fabric Images</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-orange-700"
              />
              {selectedFiles.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">{selectedFiles.length} image(s) selected</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
              required
            />
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditMode(false)
                setSelectedFiles([])
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.form>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Fabric ID</p>
              <p className="mt-1 text-lg font-semibold text-gray-800">#{fabric.id}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Customer</p>
              <p className="mt-1 font-semibold text-gray-800">{fabric.customer_name}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Staff</p>
              <p className="mt-1 font-semibold text-gray-800">{fabric.staff_name}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Dropped Off</p>
              <p className="mt-1 inline-flex items-center gap-2 font-semibold text-gray-800">
                <IoCalendarOutline className="text-orange-500" size={15} />
                {formatDate(fabric.dropped_off_at)}
              </p>
            </div>
            {fabric.status && (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Status</p>
                <p className="mt-1 font-semibold text-gray-800">{fabric.status}</p>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Description</p>
            <p className="mt-1 text-sm text-gray-700">{fabric.description}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs text-blue-600">Created At</p>
              <p className="mt-1 font-medium text-blue-800">{formatDate(fabric.created_at)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs text-emerald-600">Updated At</p>
              <p className="mt-1 font-medium text-emerald-800">{formatDate(fabric.updated_at)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Fabric Images</h2>

        <AnimatePresence mode="wait">
          {fabric.fabric_images.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center"
            >
              
              <HiOutlinePhotograph className="mb-3 text-gray-400" size={34} />
              <p className="text-base font-medium text-gray-700">No fabric images</p>
              <p className="text-sm text-gray-500">This fabric entry does not have uploaded images yet.</p>
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {fabric.fabric_images.map((image, index) => (
                <button
                  key={`${fabric.id}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="overflow-hidden rounded-xl border border-gray-100"
                >
                  <img
                    src={image}
                    alt={`Fabric ${fabric.id} image ${index + 1}`}
                    className="h-72 w-full object-cover transition duration-200 hover:scale-105"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-5 top-5 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            >
              <IoClose size={22} />
            </button>

            <motion.img
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              src={selectedImage}
              alt="Fabric full view"
              className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
