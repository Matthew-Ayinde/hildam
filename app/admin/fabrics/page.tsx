"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HiOutlineCollection, HiOutlinePhotograph, HiOutlineTrash, HiPlus } from "react-icons/hi"
import { IoEyeOutline, IoCalendarOutline } from "react-icons/io5"
import Link from "next/link"
import Spinner from "@/components/Spinner"
import { deleteFabric, fetchAllFabricsOriginal } from "../../api/apiClient"

interface Fabric {
  id: number
  customer_name: string
  description: string
  staff_name: string
  dropped_off_at: string
  fabric_images: string[]
}

export default function FabricsPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingFabricId, setDeletingFabricId] = useState<number | null>(null)

  useEffect(() => {
    const getFabrics = async () => {
      setIsLoading(true)
      try {
        const response = await fetchAllFabricsOriginal()
        setFabrics(response || [])
      } catch (error) {
        console.error("Error fetching fabrics:", error)
        setMessage("Unable to fetch fabrics")
        setMessageType("error")
      } finally {
        setIsLoading(false)
      }
    }

    getFabrics()
  }, [])

  const totalImages = useMemo(() => {
    return fabrics.reduce((sum, item) => sum + item.fabric_images.length, 0)
  }, [fabrics])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const openDeleteModal = (fabricId: number) => {
    setDeletingFabricId(fabricId)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteFabric = async () => {
    if (!deletingFabricId) return

    try {
      const result = await deleteFabric(String(deletingFabricId))
      if (result.status !== 200) {
        throw new Error("Failed to delete fabric")
      }

      setFabrics((prev) => prev.filter((item) => item.id !== deletingFabricId))
      setMessage("Fabric deleted successfully")
      setMessageType("success")
    } catch (error) {
      console.error("Error deleting fabric:", error)
      setMessage("Failed to delete fabric")
      setMessageType("error")
    } finally {
      setIsDeleteModalOpen(false)
      setDeletingFabricId(null)
      setTimeout(() => setMessage(null), 2500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-white shadow-lg ${
              messageType === "success"
                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                : "bg-gradient-to-r from-rose-500 to-red-600"
            }`}
          >
            <p className="font-medium">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 p-4">
              <HiOutlineCollection className="text-orange-600" size={30} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Fabrics</h1>
              <p className="text-sm text-gray-600">Manage dropped-off fabrics and quick previews</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-auto">
            <div className="rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-orange-600">Total Fabrics</p>
              <p className="text-lg font-bold text-orange-700">{fabrics.length}</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-wide text-blue-600">Total Images</p>
              <p className="text-lg font-bold text-blue-700">{totalImages}</p>
            </div>
          </div>

          <Link
            href="/admin/fabrics/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <HiPlus size={16} />
            Add Fabric
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
      >
        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Spinner />
          </div>
        ) : fabrics.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
            <HiOutlinePhotograph className="mb-3 text-gray-400" size={34} />
            <p className="text-base font-medium text-gray-700">No fabrics found</p>
            <p className="text-sm text-gray-500">New fabrics will appear here once they are dropped off.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fabrics.map((fabric) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:shadow-md"
              >
                <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <h2 className="text-lg font-semibold text-gray-800">{fabric.customer_name}</h2>
                    </div>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      ID #{fabric.id}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 px-4 py-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Description</p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium text-gray-700">{fabric.description}</p>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                    <div>
                      <p className="text-xs text-gray-500">Received by</p>
                      <p className="text-sm font-semibold text-gray-700">{fabric.staff_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Images</p>
                      <p className="text-sm font-semibold text-blue-700">{fabric.fabric_images.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <IoCalendarOutline className="text-orange-500" size={16} />
                    <span>Dropped off on {formatDate(fabric.dropped_off_at)}</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/admin/fabrics/${fabric.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      <IoEyeOutline size={16} />
                      View
                    </Link>
                    <button
                      onClick={() => openDeleteModal(fabric.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      <HiOutlineTrash size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold text-gray-800">Delete fabric?</h3>
              <p className="mt-2 text-sm text-gray-600">This action cannot be undone.</p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false)
                    setDeletingFabricId(null)
                  }}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteFabric}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}