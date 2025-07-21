"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosArrowBack } from "react-icons/io"
import { motion } from "framer-motion"
import { getSession } from "next-auth/react"
import { FaPerson } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoTime } from "react-icons/io5";
import { FaShieldAlt } from "react-icons/fa";
import {fetchUser} from "@/app/api/apiClient"; // Adjust the import path as necessary
import Link from "next/link"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"


// Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
)

export default function ShowCustomer() {
  const router = useRouter()
  const { id } = useParams()

  const userId = id as string
  interface Customer {
    item_name: string | number | readonly string[] | undefined
    item_quantity: string | number | readonly string[] | undefined
    id: string
    name: string
    email: string
    created_at: string
    role: string
  }

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomer = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchUser(userId)
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRandomGradient = (name: string) => {
    const gradients = [
      "from-orange-400 to-orange-600",
      "from-orange-500 to-red-500",
      "from-yellow-400 to-orange-500",
      "from-orange-400 to-pink-500",
      "from-red-400 to-orange-500",
    ]
    const index = name.length % gradients.length
    return gradients[index]
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-80 flex items-center justify-center"
      >
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-orange-600 font-medium">Loading user profile...</p>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-80 flex items-center justify-center"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Profile</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCustomer}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    )
  }

  if (!customer) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-500 text-lg">No user data found</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto lg:p-6 p-0">
        {/* Header with Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <button
            onClick={() => router.push("/admin/users")}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors group"
          >
            <IoIosArrowBack className="text-2xl group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Users</span>
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              {/* Profile Picture */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getRandomGradient(customer.name)} flex items-center justify-center shadow-2xl border-4 border-white/30`}
              >
                <span className="text-4xl font-bold text-white">{getInitials(customer.name)}</span>
              </motion.div>

              {/* Name */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-white mt-6 mb-2"
              >
                {customer.name}
              </motion.h1>

              {/* Role Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium"
              >
                <FaShieldAlt className="mr-2" />
                {customer.role}
              </motion.div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="group"
              >
                <label className="flex items-center text-gray-600 font-semibold mb-3">
                  <IoMdMail className="mr-2 text-orange-500" />
                  Email Address
                </label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 group-hover:border-orange-200 transition-colors">
                  <p className="text-gray-800 font-medium">{customer.email}</p>
                </div>
              </motion.div>

              {/* Role */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="group"
              >
                <label className="flex items-center text-gray-600 font-semibold mb-3">
                  <FaPerson className="mr-2 text-orange-500" />
                  User Role
                </label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 group-hover:border-orange-200 transition-colors">
                  <p className="text-gray-800 font-medium capitalize">{customer.role}</p>
                </div>
              </motion.div>

              {/* Date Created */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="group md:col-span-2"
              >
                <label className="flex items-center text-gray-600 font-semibold mb-3">
                  <IoTime className="mr-2 text-orange-500" />
                  Member Since
                </label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 group-hover:border-orange-200 transition-colors">
                  <p className="text-gray-800 font-medium">
                    {new Date(customer.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200"
            >

              <Link href={`${ApplicationRoutes.AdminUsers}/${customer.id}/edit`} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Edit User
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
