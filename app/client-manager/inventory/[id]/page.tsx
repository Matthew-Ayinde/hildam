"use client"

import SkeletonLoader from "@/components/SkeletonLoader"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Package, Calendar, Palette, Hash, FileText, Edit3 } from "lucide-react"
import { getSession } from "next-auth/react"
import { motion } from "framer-motion"
import { TbCurrencyNaira } from "react-icons/tb";
import { fetchInventory } from "@/app/api/apiClient"

export default function ShowCustomer() {
  const router = useRouter()
  const { id } = useParams()
  const inventoryId = id as string

  interface Customer {
    item_name: string
    item_quantity: number
    created_at: string
    price_purchased: number
    item_description: string
    color: string
  }

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomer = async () => {
    setLoading(true)
    setError(null)
    try {
     
   
      const result = await fetchInventory(inventoryId)
      console.log("Fetched customer data:", result)
 
      setCustomer(result)
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
      <div className="min-h-screen">
        <div className="mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <SkeletonLoader />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-red-200 p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchCustomer}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Found</h3>
            <p className="text-gray-600">The requested inventory item could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const fields = [
    {
      label: "Item Name",
      value: customer.item_name,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Quantity",
      value: customer.item_quantity.toString(),
      icon: Hash,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Price Purchased",
      value: formatCurrency(customer.price_purchased),
      icon: TbCurrencyNaira,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Description",
      value: customer.item_description || "Not available",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Color",
      value: customer.color,
      icon: Palette,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      label: "Created On",
      value: formatDate(customer.created_at),
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-orange-500 p-8 text-white">
            <div className="flex items-center justify-between">
              <Link
                href="/client-manager/inventory"
                className="group flex items-center text-white/90 hover:text-white transition-colors duration-200"
              >
                <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors duration-200 mr-3">
                  <ArrowLeft size={20} />
                </div>
                <span className="font-medium">Back to Inventory</span>
              </Link>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={`/client-manager/inventory/${id}/edit`}
                  className="flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors duration-200"
                >
                  <Edit3 size={18} className="mr-2" />
                  Edit Item
                </Link>
              </motion.div>
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-bold mb-2">Inventory Details</h1>
              <p className="text-blue-100">View and manage inventory item information</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fields.map((field, index) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${field.bgColor} ${field.color} flex-shrink-0`}>
                        <field.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                        <div className="text-lg font-medium text-gray-900 break-words">{field.value}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}
