"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HiOutlineClipboardList,
  HiOutlineSparkles,
  HiOutlineColorSwatch,
} from "react-icons/hi"
import { MdOutlineInventory, MdOutlineCheckCircle, MdOutlineError, MdOutlineAdd } from "react-icons/md"
import { FiPackage, FiHash, FiFileText } from "react-icons/fi"
import { IoArrowBack } from "react-icons/io5"
import Link from "next/link"
import { TbCurrencyNaira } from "react-icons/tb";
import { createInventory } from "@/app/api/apiClient"

const Form = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    item_name: "",
    item_quantity: "",
    price_purchased: "",
    unit: "",
    color: "",
  })

  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage(null)

    try {

      const response = await createInventory(formData)
      console.log('response', response)

      setResponseMessage("Inventory item created successfully!")
      setMessageType("success")

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          item_name: "",
          item_quantity: "",
          price_purchased: "",
          unit: "",
          color: "",
        })
      }, 1000)

      setTimeout(() => {
        setResponseMessage(null)
        router.push("/client-manager/inventory")
      }, 2000)
    } catch (error: any) {
      setResponseMessage(`Error: ${error.message}`)
      setMessageType("error")
      setTimeout(() => setResponseMessage(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-4 md:p-0"
    >
      <div className="">
        {/* Toast Notification */}
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
                {messageType === "success" ? <MdOutlineCheckCircle size={20} /> : <MdOutlineError size={20} />}
                <span className="font-medium">{responseMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white rounded-2xl p-6 shadow-lg border border-orange-100"
        >
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Link
              href="/client-manager/inventory"
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-all duration-200 group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors"
              >
                <IoArrowBack size={20} />
              </motion.div>
              <span className="font-semibold">Back to Inventory</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
                <MdOutlineInventory className="text-orange-600" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Add Inventory Item</h1>
                <p className="text-sm text-gray-600">Create a new inventory entry</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <HiOutlineClipboardList className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Inventory Details</h2>
                <p className="text-orange-100 mt-1">Fill in the item information below</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Form Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Item Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="group"
                >
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <FiPackage className="text-orange-500" size={16} />
                    <span>Item Name</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="name"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleChange}
                    placeholder="Enter item name"
                    className="w-full rounded-xl border border-gray-300 shadow-sm p-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 bg-white"
                    required
                  />
                </motion.div>

                {/* Quantity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="group"
                >
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <FiHash className="text-blue-500" size={16} />
                    <span>Quantity</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="number"
                    id="quantity"
                    name="item_quantity"
                    value={formData.item_quantity}
                    onChange={handleChange}
                    placeholder="Enter quantity"
                    className="w-full rounded-xl border border-gray-300 shadow-sm p-4 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 bg-white"
                    required
                  />
                </motion.div>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="group"
                >
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <TbCurrencyNaira className="text-green-500" size={16} />
                    <span>Price Purchased</span>
                  </label>
                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      step="0.01"
                      id="price"
                      name="price_purchased"
                      value={formData.price_purchased}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-gray-300 shadow-sm p-4 pl-8 focus:ring-2 focus:ring-green-200 focus:border-green-400 transition-all duration-200 bg-white"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</div>
                  </div>
                </motion.div>

                {/* Color */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="group"
                >
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <HiOutlineColorSwatch className="text-purple-500" size={16} />
                    <span>Color</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Enter color"
                    className="w-full rounded-xl border border-gray-300 shadow-sm p-4 focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 bg-white"
                    required
                  />
                </motion.div>
              </div>

              {/* Description - Full Width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="group"
              >
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <FiFileText className="text-indigo-500" size={16} />
                  <span>Description</span>
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  id="unit"
                  name="unit"
                  rows={4}
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="Enter item description, specifications, or additional details..."
                  className="w-full rounded-xl border border-gray-300 shadow-sm p-4 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 bg-white resize-none"
                  required
                />
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center mt-8 pt-6 border-t border-gray-100"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                }`}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <MdOutlineAdd size={20} />
                    <span>Create Inventory Item</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          {[
            {
              icon: HiOutlineSparkles,
              title: "Quality Control",
              description: "Ensure all items meet quality standards",
              color: "from-blue-100 to-cyan-100",
              iconColor: "text-blue-600",
            },
            {
              icon: TbCurrencyNaira,
              title: "Cost Tracking",
              description: "Monitor purchase costs and inventory value",
              color: "from-green-100 to-emerald-100",
              iconColor: "text-green-600",
            },
            {
              icon: HiOutlineColorSwatch,
              title: "Organization",
              description: "Keep inventory organized by color and type",
              color: "from-purple-100 to-pink-100",
              iconColor: "text-purple-600",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className={`p-3 bg-gradient-to-r ${card.color} rounded-xl w-fit mb-4`}>
                <card.icon className={card.iconColor} size={24} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Form
