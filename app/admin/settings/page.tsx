"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { IoArrowBack, IoMailOutline, IoPhonePortraitOutline, IoLocationOutline, IoBriefcaseOutline } from "react-icons/io5"
import { HiOutlineUser, HiOutlinePhone, HiOutlineMail } from "react-icons/hi"
import { getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface UserAccount {
  name: string
  email: string
  phone: string
  role: string
  department: string
  location: string
  joinDate: string
  profileImage: string
  bio: string
}

export default function SettingsPage() {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getSession()
        const userName = session?.user?.name || "Administrator"

        // Dummy data - replace with actual API call when backend is ready
        const dummyData: UserAccount = {
          name: userName,
          email: session?.user?.email || "admin@tailoringmanagement.com",
          phone: "+1 (555) 123-4567",
          role: "Administrator",
          department: "Management",
          location: "New York, USA",
          joinDate: "January 15, 2024",
          profileImage: "/no-profile.jpg",
          bio: "Experienced administrator with expertise in inventory and order management.",
        }

        setUserAccount(dummyData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-orange-50 to-white"
    >
      <div className="mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6 transition-colors"
            >
              <IoArrowBack size={20} />
              Back to Dashboard
            </motion.button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile and account information</p>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-200 mx-auto mb-4">
                  <Image
                    src={userAccount?.profileImage || "/no-profile.jpg"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userAccount?.name}</h2>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
                  {userAccount?.role}
                </span>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600 font-medium mb-1">Member Since</p>
                  <p className="text-gray-900">{userAccount?.joinDate}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                  {isEditing ? "Save" : "Edit"}
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    defaultValue={userAccount?.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoMailOutline size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    defaultValue={userAccount?.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoPhonePortraitOutline size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    defaultValue={userAccount?.phone}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoBriefcaseOutline size={16} />
                    Role
                  </label>
                  <input
                    type="text"
                    disabled
                    defaultValue={userAccount?.role}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    disabled
                    defaultValue={userAccount?.department}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoLocationOutline size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    defaultValue={userAccount?.location}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  disabled={!isEditing}
                  defaultValue={userAccount?.bio}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors resize-none"
                />
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h3>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-600">Update your password regularly</p>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Secure your account with 2FA</p>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Active Sessions</p>
                    <p className="text-sm text-gray-600">View and manage your active sessions</p>
                  </div>
                  <span className="text-gray-400">→</span>
                </motion.button>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive email updates about your account</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-orange-600" />
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Step Verification for Sensitive Actions</p>
                    <p className="text-sm text-gray-600">Require verification for critical changes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-orange-600" />
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Activity Alerts</p>
                    <p className="text-sm text-gray-600">Get notified of unusual account activity</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-orange-600" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
