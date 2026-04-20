"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { IoArrowBack, IoMailOutline, IoBriefcaseOutline, IoLockClosedOutline } from "react-icons/io5"
import { HiOutlineUser } from "react-icons/hi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchUserProfile, updateUserProfile } from "@/app/api/apiClient"
import { toast } from "@/hooks/use-toast"

interface UserAccount {
  name: string
  email: string
  role: string
}

interface EditFormData {
  name: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function SettingsPage() {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileData = await fetchUserProfile()
        const userData = {
          name: profileData.name || "",
          email: profileData.email || "",
          role: profileData.role || "",
        }
        setUserAccount(userData)
        setFormData((prev) => ({ ...prev, name: userData.name, currentPassword: "", newPassword: "", confirmPassword: "" }))
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // At least one field must be provided
    if (!formData.name.trim() && !formData.newPassword) {
      newErrors.form = "Please update at least your name or password"
      setErrors(newErrors)
      return false
    }

    // Name validation
    if (formData.name.trim() && formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password"
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters"
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsSaving(true)
    try {
      const payload: Record<string, string> = {}

      // Only include fields that have changed or are being updated
      if (formData.name.trim() !== userAccount?.name) {
        payload.name = formData.name.trim()
      }
      if (formData.newPassword) {
        payload.new_password = formData.newPassword
        payload.new_password_confirmation = formData.confirmPassword
        payload.current_password = formData.currentPassword
      }

      // Only send if at least one field is present
      if (Object.keys(payload).length === 0) {
        toast({
          title: "No changes",
          description: "Please make changes before saving",
        })
        setIsSaving(false)
        return
      }

      await updateUserProfile(payload)

      // Update local state
      if (payload.name) {
        setUserAccount((prev) => prev ? { ...prev, name: payload.name } : prev)
      }

      // Reset form
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
      setIsEditing(false)
      setErrors({})

      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
        duration: 5000,
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData((prev) => ({
      ...prev,
      name: userAccount?.name || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
    setErrors({})
    setIsEditing(false)
  }

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
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-4 flex items-center justify-center">
                  <HiOutlineUser size={48} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{userAccount?.name}</h2>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full capitalize">
                  {userAccount?.role?.replace(/_/g, " ")}
                </span>
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
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </motion.button>
                )}
              </div>

              {errors.form && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {errors.form}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                    }}
                    className="w-full"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoMailOutline size={16} />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    disabled
                    value={userAccount?.email || ""}
                    className="w-full"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <IoBriefcaseOutline size={16} />
                    Role
                  </label>
                  <Input
                    type="text"
                    disabled
                    value={userAccount?.role?.replace(/_/g, " ") || ""}
                    className="w-full capitalize"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>
                <p className="text-sm text-gray-600 mb-4">Leave blank to keep your current password</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Password */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <IoLockClosedOutline size={16} />
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))
                        if (errors.currentPassword) setErrors((prev) => ({ ...prev, currentPassword: "" }))
                      }}
                      placeholder="Enter current password"
                      aria-invalid={Boolean(errors.currentPassword)}
                    />
                    {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <IoLockClosedOutline size={16} />
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
                        if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: "" }))
                      }}
                      placeholder="Enter new password"
                      aria-invalid={Boolean(errors.newPassword)}
                    />
                    {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <IoLockClosedOutline size={16} />
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                      }}
                      placeholder="Confirm new password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 justify-end"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
