"use client"

import SkeletonLoader from "@/components/SkeletonLoader"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { FiPackage, FiCalendar, FiDollarSign, FiHash, FiEdit3, FiEye, FiBox } from "react-icons/fi"
import { HiOutlineColorSwatch } from "react-icons/hi"
import { getSession } from "next-auth/react"
import { motion } from "framer-motion"

export default function ShowCustomer() {
  const router = useRouter()
  const { id } = useParams()

  interface Customer {
    item_name: string
    item_quantity: number
    created_at: string
    price_purchased: number
    unit: string
    color: string
  }

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomer = async () => {
    setLoading(true)
    setError(null)

    try {
      const session = await getSession()
      const token = session?.user?.token

      if (!token) {
        throw new Error("Unauthorized")
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch customer data")
      }

      const result = await response.json()
      setCustomer(result.data)
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

  const getStockStatus = (quantity: number) => {
    if (quantity <= 20) return { status: "Low Stock", color: "text-red-600 bg-red-50 border-red-200" }
    if (quantity <= 50) return { status: "Medium Stock", color: "text-amber-600 bg-amber-50 border-amber-200" }
    return { status: "In Stock", color: "text-green-600 bg-green-50 border-green-200" }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full"
        >
          <SkeletonLoader />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiEye className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Item</h3>
          <p className="text-gray-600 mb-6">Error: {error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchCustomer}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors duration-200"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Item Found</h3>
          <p className="text-gray-600">The requested inventory item could not be found.</p>
        </motion.div>
      </div>
    )
  }

  const stockInfo = getStockStatus(customer.item_quantity)

  return (
    <div className="min-h-screen p-6">
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className=" mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="bg-red-800 flex items-center justify-between">
          <Link
            href="/admin/inventory"
            className="flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-200"
            >
              <IoIosArrowBack size={20} />
            </motion.div>
            <span className="ml-3 font-semibold">Back to Inventory</span>
          </Link>

          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={`/admin/inventory/${id}/edit`}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
              >
                <FiEdit3 size={18} />
                Edit Item
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
                  <FiPackage className="text-orange-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{customer.item_name}</h1>
                  <p className="text-gray-600 mt-1">Inventory Item Details</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${stockInfo.color}`}
                >
                  {stockInfo.status}
                </span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Item Information */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FiBox className="text-orange-500" />
                  Item Information
                </h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                      <FiPackage size={16} />
                      Item Name
                    </label>
                    <div className="text-lg font-semibold text-gray-800">{customer.item_name}</div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                      <FiHash size={16} />
                      Quantity
                    </label>
                    <div className="text-lg font-semibold text-gray-800">
                      {customer.item_quantity.toLocaleString()} {customer.unit}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                      <HiOutlineColorSwatch size={16} />
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: customer.color.toLowerCase() }}
                      ></div>
                      <span className="text-lg font-semibold text-gray-800 capitalize">{customer.color}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
          

              {/* Financial & Timeline */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  Financial & Timeline
                </h2>

                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-green-600 mb-2">
                      Purchase Price
                    </label>
                    <div className="text-lg font-semibold text-green-700">
                      ₦{customer.price_purchased.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
                      <FiCalendar size={16} />
                      Date Added
                    </label>
                    <div className="text-lg font-semibold text-blue-700">
                      {new Date(customer.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <label className="flex items-center gap-2 text-sm font-medium text-purple-600 mb-2">
                      <FiBox size={16} />
                      Unit Type
                    </label>
                    <div className="text-lg font-semibold text-purple-700 capitalize">{customer.unit}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Summary Stats */}
            <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-orange-700">
                        ₦{(customer.price_purchased * customer.item_quantity).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <FiDollarSign className="text-orange-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Days in Stock</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {Math.floor((Date.now() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <FiCalendar className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Unit Price</p>
                      <p className="text-2xl font-bold text-green-700">
                        ₦{(customer.price_purchased / customer.item_quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <FiHash className="text-green-600 text-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}









// "use client"

// import SkeletonLoader from "@/components/SkeletonLoader"
// import Link from "next/link"
// import { useRouter, useParams } from "next/navigation"
// import { useEffect, useState } from "react"
// import { IoIosArrowBack } from "react-icons/io"
// import { FiPackage, FiCalendar, FiDollarSign, FiHash, FiEdit3, FiEye, FiBox } from "react-icons/fi"
// import { HiOutlineColorSwatch } from "react-icons/hi"
// import { getSession } from "next-auth/react"
// import { motion } from "framer-motion"

// export default function ShowCustomer() {
//   const router = useRouter()
//   const { id } = useParams()

//   interface Customer {
//     item_name: string
//     item_quantity: number
//     created_at: string
//     price_purchased: number
//     unit: string
//     color: string
//   }

//   const [customer, setCustomer] = useState<Customer | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const fetchCustomer = async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const session = await getSession()
//       const token = session?.user?.token

//       if (!token) {
//         throw new Error("Unauthorized")
//       }
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/inventory/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (!response.ok) {
//         throw new Error("Failed to fetch customer data")
//       }

//       const result = await response.json()
//       setCustomer(result.data)
//     } catch (err) {
//       if (err instanceof Error) {
//         setError(err.message)
//       } else {
//         setError("An unknown error occurred")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchCustomer()
//   }, [id])

//   const getStockStatus = (quantity: number) => {
//     if (quantity <= 20) return { status: "Low Stock", color: "text-red-600 bg-red-50 border-red-200" }
//     if (quantity <= 50) return { status: "Medium Stock", color: "text-amber-600 bg-amber-50 border-amber-200" }
//     return { status: "In Stock", color: "text-green-600 bg-green-50 border-green-200" }
//   }

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         staggerChildren: 0.1,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl"
//         >
//           <SkeletonLoader />
//         </motion.div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
//         >
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FiEye className="text-red-500 text-2xl" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Item</h3>
//           <p className="text-gray-600 mb-6">Error: {error}</p>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={fetchCustomer}
//             className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors duration-200"
//           >
//             Try Again
//           </motion.button>
//         </motion.div>
//       </div>
//     )
//   }

//   if (!customer) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
//         >
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FiPackage className="text-gray-400 text-2xl" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">No Item Found</h3>
//           <p className="text-gray-600">The requested inventory item could not be found.</p>
//         </motion.div>
//       </div>
//     )
//   }

//   const stockInfo = getStockStatus(customer.item_quantity)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-6xl mx-auto space-y-8"
//       >
//         {/* Header */}
//         <motion.div variants={itemVariants} className="flex items-center justify-between">
//           <Link
//             href="/admin/inventory"
//             className="flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 group"
//           >
//             <motion.div
//               whileHover={{ x: -4 }}
//               className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors duration-200"
//             >
//               <IoIosArrowBack size={20} />
//             </motion.div>
//             <span className="ml-3 font-semibold">Back to Inventory</span>
//           </Link>

//           <div className="flex items-center gap-3">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Link
//                 href={`/admin/inventory/${id}/edit`}
//                 className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium shadow-lg transition-all duration-200"
//               >
//                 <FiEdit3 size={18} />
//                 Edit Item
//               </Link>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Main Content */}
//         <motion.div
//           variants={itemVariants}
//           className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden"
//         >
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b border-orange-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl">
//                   <FiPackage className="text-orange-600 text-2xl" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-800">{customer.item_name}</h1>
//                   <p className="text-gray-600 mt-1">Inventory Item Details</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <span
//                   className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${stockInfo.color}`}
//                 >
//                   {stockInfo.status}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Content Grid */}
//           <div className="p-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Item Information */}
//               <motion.div variants={itemVariants} className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//                   <FiBox className="text-orange-500" />
//                   Item Information
//                 </h2>

//                 <div className="space-y-4">
//                   <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
//                       <FiPackage size={16} />
//                       Item Name
//                     </label>
//                     <div className="text-lg font-semibold text-gray-800">{customer.item_name}</div>
//                   </div>

//                   <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
//                       <FiHash size={16} />
//                       Quantity
//                     </label>
//                     <div className="text-lg font-semibold text-gray-800">
//                       {customer.item_quantity.toLocaleString()} {customer.unit}
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                     <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
//                       <HiOutlineColorSwatch size={16} />
//                       Color
//                     </label>
//                     <div className="flex items-center gap-3">
//                       <div
//                         className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
//                         style={{ backgroundColor: customer.color.toLowerCase() }}
//                       ></div>
//                       <span className="text-lg font-semibold text-gray-800 capitalize">{customer.color}</span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Financial & Timeline */}
//               <motion.div variants={itemVariants} className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
//                   <FiDollarSign className="text-green-500" />
//                   Financial & Timeline
//                 </h2>

//                 <div className="space-y-4">
//                   <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//                     <label className="flex items-center gap-2 text-sm font-medium text-green-600 mb-2">
//                       <FiDollarSign size={16} />
//                       Purchase Price
//                     </label>
//                     <div className="text-lg font-semibold text-green-700">
//                       ₦{customer.price_purchased.toLocaleString()}
//                     </div>
//                   </div>

//                   <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//                     <label className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-2">
//                       <FiCalendar size={16} />
//                       Date Added
//                     </label>
//                     <div className="text-lg font-semibold text-blue-700">
//                       {new Date(customer.created_at).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })}
//                     </div>
//                   </div>

//                   <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
//                     <label className="flex items-center gap-2 text-sm font-medium text-purple-600 mb-2">
//                       <FiBox size={16} />
//                       Unit Type
//                     </label>
//                     <div className="text-lg font-semibold text-purple-700 capitalize">{customer.unit}</div>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Summary Stats */}
//             <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Stats</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-orange-600 mb-1">Total Value</p>
//                       <p className="text-2xl font-bold text-orange-700">
//                         ₦{(customer.price_purchased * customer.item_quantity).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="p-3 bg-orange-100 rounded-full">
//                       <FiDollarSign className="text-orange-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-blue-600 mb-1">Days in Stock</p>
//                       <p className="text-2xl font-bold text-blue-700">
//                         {Math.floor((Date.now() - new Date(customer.created_at).getTime()) / (1000 * 60 * 60 * 24))}
//                       </p>
//                     </div>
//                     <div className="p-3 bg-blue-100 rounded-full">
//                       <FiCalendar className="text-blue-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-green-600 mb-1">Unit Price</p>
//                       <p className="text-2xl font-bold text-green-700">
//                         ₦{(customer.price_purchased / customer.item_quantity).toFixed(2)}
//                       </p>
//                     </div>
//                     <div className="p-3 bg-green-100 rounded-full">
//                       <FiHash className="text-green-600 text-xl" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </div>
//   )
// }

