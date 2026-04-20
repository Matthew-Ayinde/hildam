"use client"

import { useEffect, useMemo, useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { IoArrowBack, IoCalendarOutline, IoCloudUploadOutline, IoDocumentTextOutline, IoPeopleOutline } from "react-icons/io5"
import Spinner from "@/components/Spinner"
import { createFabric, fetchAllCustomers, fetchAllUsers } from "@/app/api/apiClient"

interface CustomerOption {
  id: string
  name: string
}

interface StaffOption {
  id: string
  name: string
  role?: string
}

export default function AdminCreateFabricPage() {
  const router = useRouter()

  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffOption[]>([])
  const [isLoadingLookups, setIsLoadingLookups] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    customer_id: "",
    description: "",
    received_by_staff_id: "",
    dropped_off_at: "",
    fabric_images: [] as File[],
  })

  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<"success" | "error">("success")

  useEffect(() => {
    const loadLookups = async () => {
      setIsLoadingLookups(true)
      try {
        const [customerResult, userResult] = await Promise.all([fetchAllCustomers(), fetchAllUsers()])

        const customerOptions: CustomerOption[] = (customerResult || []).map((item: any) => ({
          id: String(item.id),
          name: item.name || item.customer_name || `Customer #${item.id}`,
        }))

        const users: any[] = userResult?.data || []
        const staffOptions: StaffOption[] = users.map((item: any) => ({
          id: String(item.id),
          name: item.name || item.full_name || `Staff #${item.id}`,
          role: item.role,
        }))

        setCustomers(customerOptions)
        setStaffMembers(staffOptions)
      } catch (error) {
        console.error("Failed to load lookup data:", error)
        setStatusMessage("Unable to load customers/staff. Please refresh and try again.")
        setStatusType("error")
      } finally {
        setIsLoadingLookups(false)
      }
    }

    loadLookups()
  }, [])

  const selectedFilesText = useMemo(() => {
    if (formData.fabric_images.length === 0) return "No files selected"
    if (formData.fabric_images.length === 1) return formData.fabric_images[0].name
    return `${formData.fabric_images.length} files selected`
  }, [formData.fabric_images])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      fabric_images: files,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const payload = new FormData()
      payload.append("customer_id", formData.customer_id)
      payload.append("description", formData.description)
      payload.append("received_by_staff_id", formData.received_by_staff_id)
      payload.append("dropped_off_at", formData.dropped_off_at)

      formData.fabric_images.forEach((file) => {
        payload.append("fabric_images[]", file)
      })

      await createFabric(payload)

      setStatusMessage("Fabric added successfully")
      setStatusType("success")
      router.push("/admin/fabrics")
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to create fabric right now. Please check your fields and try again."
      setStatusMessage(serverMessage)
      setStatusType("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
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

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Fabric</h1>
            <p className="mt-1 text-sm text-gray-600">
              Register dropped-off fabric details, upload photos, and track receiving staff.
            </p>
          </div>

          <Link
            href="/admin/fabrics"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <IoArrowBack size={16} />
            Back to Fabrics
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {isLoadingLookups ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="customer_id" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoPeopleOutline size={16} className="text-orange-500" />
                    Customer
                  </span>
                </label>
                <select
                  id="customer_id"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="received_by_staff_id" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoPeopleOutline size={16} className="text-blue-500" />
                    Received By Staff
                  </span>
                </label>
                <select
                  id="received_by_staff_id"
                  name="received_by_staff_id"
                  value={formData.received_by_staff_id}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                  required
                >
                  <option value="">Select staff member</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}{staff.role ? ` (${staff.role})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
                <span className="inline-flex items-center gap-2">
                  <IoDocumentTextOutline size={16} className="text-emerald-500" />
                  Fabric Description
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe fabric pattern, color, quality, and any important notes"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="dropped_off_at" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoCalendarOutline size={16} className="text-orange-500" />
                    Dropped Off Date
                  </span>
                </label>
                <input
                  id="dropped_off_at"
                  name="dropped_off_at"
                  type="date"
                  value={formData.dropped_off_at}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="fabric_images" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoCloudUploadOutline size={16} className="text-indigo-500" />
                    Fabric Images
                  </span>
                </label>
                <input
                  id="fabric_images"
                  name="fabric_images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-orange-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-200"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">{selectedFilesText}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                href="/admin/fabrics"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Fabric"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  )
}
