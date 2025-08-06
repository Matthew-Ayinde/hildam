"use client"

import { useState, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getSession } from "next-auth/react"
import { HiOutlineQuestionMarkCircle, HiOutlineSparkles, HiOutlineCube } from "react-icons/hi"
import { MdOutlineInventory, MdAdd, MdRemove, MdOutlineCheckCircle, MdOutlineError, MdClose } from "react-icons/md"
import { FiPackage, FiHash, FiSend } from "react-icons/fi"
import { IoSparklesOutline } from "react-icons/io5"
import Spinner from "@/components/Spinner"
import { useParams } from "next/navigation"
import { fetchAllInventories, requestInventory } from "@/app/api/apiClient"
import {useRouter} from 'next/navigation'

interface InventoryItem {
  id: string
  item_name: string
  item_quantity: number
  created_at: string
  color: string
}

interface InventoryResponse {
  message: string
  data: Array<{
    id: string
    item_name: string
    item_quantity: string
    created_at: string
    color: string
  }>
}

type Requests = {
  [key: string]: number
}

type Errors = {
  [key: string]: string
}

export default function InventoryPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const tailorJobId = id || ""

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [dataLoading, setDataLoading] = useState<boolean>(true)
  const [requests, setRequests] = useState<Requests>({})
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [successMsg, setSuccessMsg] = useState<string>("")
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false)

  useEffect(() => {
    async function fetchInventory() {
      try {

        const data: any = await fetchAllInventories()


        const items: InventoryItem[] = data.map((item: any) => ({
          ...item,
          item_quantity: Number.parseInt(item.item_quantity, 10),
        }))

        setInventoryData(items)
        const initialRequests: Requests = items.reduce((acc: Requests, item) => {
          acc[item.id] = 0
          return acc
        }, {})
        setRequests(initialRequests)
      } catch (error) {
        console.error("Error fetching inventory data:", error)
      } finally {
        setDataLoading(false)
      }
    }
    fetchInventory()
  }, [])

  const handleIncrement = (id: string, available: number) => {
    setErrors((prev) => ({ ...prev, [id]: "" }))
    setRequests((prev) => {
      const newValue = prev[id] + 1
      if (newValue > available) {
        setErrors((prevErr) => ({
          ...prevErr,
          [id]: `Cannot request more than ${available}`,
        }))
        return { ...prev }
      }
      return { ...prev, [id]: newValue }
    })
  }

  const handleDecrement = (id: string) => {
    setErrors((prev) => ({ ...prev, [id]: "" }))
    setRequests((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 0),
    }))
  }

  const handleChange = (id: string, available: number, value: string) => {
    const numericValue = Number(value)
    setErrors((prev) => ({ ...prev, [id]: "" }))
    if (numericValue > available) {
      setErrors((prev) => ({
        ...prev,
        [id]: `Cannot request more than ${available}`,
      }))
      return
    }
    setRequests((prev) => ({ ...prev, [id]: numericValue }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let hasError = false

    inventoryData.forEach((item) => {
      if (requests[item.id] > item.item_quantity) {
        setErrors((prev) => ({
          ...prev,
          [item.id]: `Cannot request more than ${item.item_quantity}`,
        }))
        hasError = true
      }
    })

    if (hasError) return

    setIsLoading(true)
    setSuccessMsg("")

    try {
      const session = await getSession()
      const accessToken = session?.user?.token
      if (!accessToken) {
        setErrors((prev) => ({ ...prev, general: "Authentication failed. Please sign in again." }))
        setIsLoading(false)
        return
      }

      const itemsToRequest = inventoryData
        .filter((item) => requests[item.id] > 0)
        .map((item) => ({ name: item.item_name, quantity: requests[item.id], color: item.color }))

      if (itemsToRequest.length === 0) {
        setErrors((prev) => ({ ...prev, general: "You must request at least one item." }))
        setIsLoading(false)
        return
      }

      const payload = { items: itemsToRequest }

      const response = await requestInventory(tailorJobId, payload)

      setSuccessMsg("Inventory request submitted successfully!")
      setTimeout(() => {
        router.push(`/client-manager/h-o-t/jobs/${tailorJobId}`)
      }, 2000)
      setRequests(Object.keys(requests).reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Requests))
      setErrors({})
    } catch (err) {
      console.error(err)
      setErrors((prev) => ({
        ...prev,
        general: "Something went wrong during submission. Please try again.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const [showToast, setShowToast] = useState(false)
  useEffect(() => {
    if (successMsg) {
      setShowToast(true)
      const timer = setTimeout(() => setShowToast(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  const getColorDisplay = (color: string) => {
    // Handle common color names and hex values
    const colorMap: { [key: string]: string } = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#10b981",
      yellow: "#f59e0b",
      purple: "#8b5cf6",
      pink: "#ec4899",
      orange: "#f97316",
      black: "#000000",
      white: "#ffffff",
      gray: "#6b7280",
      grey: "#6b7280",
    }

    const displayColor = colorMap[color.toLowerCase()] || color
    return displayColor
  }

  if (dataLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdOutlineInventory className="text-orange-600" size={32} />
          </div>
          <p className="text-xl font-semibold text-orange-600 mb-4">Loading inventory...</p>
          <Spinner />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-4 md:p-0"
    >
      <div className="max-w-7xl mx-auto">
        {/* Success Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 z-50"
            >
              <MdOutlineCheckCircle size={24} />
              <span className="font-medium">{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Modal */}
        <AnimatePresence>
          {showHelpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowHelpModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
                      <HiOutlineQuestionMarkCircle className="text-orange-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">How It Works</h2>
                  </div>
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MdClose size={24} className="text-gray-500" />
                  </button>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Welcome to our streamlined inventory management portal! Below you can view real-time stock levels and
                  easily submit requests to adjust quantities.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      icon: HiOutlineCube,
                      title: "Review Stock",
                      description: "See the current availability for each item to make informed decisions.",
                    },
                    {
                      icon: FiHash,
                      title: "Adjust Quantity",
                      description:
                        "Use the plus/minus buttons or type directly to specify the number you wish to request.",
                    },
                    {
                      icon: FiSend,
                      title: "Submit Request",
                      description:
                        "Click 'Submit Request' to send your updated quantities to our inventory team instantly.",
                    },
                    {
                      icon: MdOutlineCheckCircle,
                      title: "Confirmation",
                      description:
                        "Receive immediate feedback and a confirmation message once your request is processed.",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <step.icon className="text-orange-500" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Help Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowHelpModal(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        >
          <HiOutlineQuestionMarkCircle size={24} />
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
              <MdOutlineInventory className="text-orange-600" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Inventory Request
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Select items and quantities for your inventory request</p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                <HiOutlineCube className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Available Items</h3>
                <p className="text-gray-600">Total inventory items ready for request</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{inventoryData.length}</div>
              <p className="text-sm text-gray-500">Items</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FiPackage className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Available Inventory</h2>
                <p className="text-orange-100">Select quantities for your request</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3"
              >
                <MdOutlineError className="text-red-500" size={20} />
                <span className="text-red-700">{errors.general}</span>
              </motion.div>
            )}

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {inventoryData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Item Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                          {item.item_name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <FiHash size={14} />
                          <span>Available: {item.item_quantity}</span>
                        </div>
                      </div>
                      <div className="p-2 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg">
                        <FiPackage className="text-orange-600" size={16} />
                      </div>
                    </div>

                    {/* Color Display */}
                    <div className="flex items-center space-x-3">
                      <FiPackage className="text-gray-400" size={14} />
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-gray-200 shadow-sm"
                          style={{ backgroundColor: getColorDisplay(item.color) }}
                        />
                        <span className="text-sm text-gray-600 capitalize">{item.color}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="p-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleDecrement(item.id)}
                        className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200"
                      >
                        <MdRemove size={18} />
                      </motion.button>

                      <motion.input
                        whileFocus={{ scale: 1.05 }}
                        type="number"
                        value={requests[item.id]}
                        onChange={(e) => handleChange(item.id, item.item_quantity, e.target.value)}
                        className="w-20 h-12 text-center text-lg font-semibold border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                        min={0}
                      />

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleIncrement(item.id, item.item_quantity)}
                        className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200"
                      >
                        <MdAdd size={18} />
                      </motion.button>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {errors[item.id] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-center"
                        >
                          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errors[item.id]}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Request Indicator */}
                    {requests[item.id] > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 text-center"
                      >
                        <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          <IoSparklesOutline size={14} />
                          <span>Requesting {requests[item.id]}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                }`}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FiSend size={20} />
                    <span>Submit Request</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <HiOutlineSparkles className="text-orange-500" size={20} />
              <span className="font-medium text-gray-800">Need Help?</span>
            </div>
            <p className="text-sm text-gray-600">
              If you have any questions about inventory requests, please contact your client manager.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
