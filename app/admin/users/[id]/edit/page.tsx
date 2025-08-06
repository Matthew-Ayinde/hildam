"use client"

import { editUser, fetchUser } from "@/app/api/apiClient"
import Spinner from "@/components/Spinner"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Eye, EyeOff, User, Mail, Shield, Lock, Save, X } from "lucide-react"

export default function EditCustomer() {
  const router = useRouter()
  const { id } = useParams()
  const userId = id as string

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Original form data to track changes
  const [originalFormData, setOriginalFormData] = useState({
    name: "",
    email: "",
    role: "",
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  })

  const fetchCustomer = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchUser(userId)
      setCustomer(result)

      const initialData = {
        name: result.name,
        email: result.email,
        role: result.role || "",
      }

      // Set both original and current form data
      setOriginalFormData(initialData)
      setFormData({
        ...initialData,
        password: "",
        password_confirmation: "",
      })
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

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Function to get only modified fields
  const getModifiedFields = () => {
    const modifiedFields: any = {}

    // Check basic fields for changes
    Object.keys(originalFormData).forEach((key) => {
      if (formData[key as keyof typeof formData] !== originalFormData[key as keyof typeof originalFormData]) {
        modifiedFields[key] = formData[key as keyof typeof formData]
      }
    })

    // Handle password fields - only include if password is provided
    if (formData.password && formData.password.trim() !== "") {
      modifiedFields.password = formData.password
      modifiedFields.password_confirmation = formData.password_confirmation
    }

    return modifiedFields
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError(null)

    // Validate password confirmation if password is being changed
    if (formData.password && formData.password !== formData.password_confirmation) {
      setError("Passwords do not match")
      return
    }

    // Get only modified fields
    const modifiedFields = getModifiedFields()

    // Check if there are any changes to submit
    if (Object.keys(modifiedFields).length === 0) {
      setError("No changes detected to save")
      return
    }


    try {
      const response = await editUser(userId, modifiedFields)
      router.push(`${ApplicationRoutes.AdminUsers}/${userId}`)
    } catch (err: any) {
      const messages = err.response.data.message
      const firstKey = Object.keys(messages)[0]
      const firstMessage = messages[firstKey][0]
      setError(firstMessage)
    }
  }

  // Check if form has changes
  const hasChanges = () => {
    const modifiedFields = getModifiedFields()
    return Object.keys(modifiedFields).length > 0
  }

  useEffect(() => {
    fetchCustomer()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">Loading customer details...</p>
        </div>
      </div>
    )
  }

  if (error && !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Customer</h3>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchCustomer}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
          <p className="mt-2 text-sm text-gray-600">Update customer information and account settings</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Changes Indicator */}
        {hasChanges() && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Save className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">You have unsaved changes</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-400" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                      {formData.name !== originalFormData.name && (
                        <span className="ml-1 text-xs text-blue-600">(modified)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                        formData.name !== originalFormData.name ? "border-blue-300 bg-blue-50" : "border-gray-300"
                      }`}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                      {formData.email !== originalFormData.email && (
                        <span className="ml-1 text-xs text-blue-600">(modified)</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                          formData.email !== originalFormData.email ? "border-blue-300 bg-blue-50" : "border-gray-300"
                        }`}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gray-400" />
                  Role & Permissions
                </h3>
                <div className="max-w-md">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    User Role
                    {formData.role !== originalFormData.role && (
                      <span className="ml-1 text-xs text-blue-600">(modified)</span>
                    )}
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                      formData.role !== originalFormData.role ? "border-blue-300 bg-blue-50" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="client manager">Client Manager</option>
                    <option value="head of tailoring">Head of Tailoring</option>
                  </select>
                </div>
              </div>

              {/* Password Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-gray-400" />
                  Change Password
                  {formData.password && <span className="ml-1 text-xs text-blue-600">(will be updated)</span>}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Leave password fields empty if you don't want to change the password
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                          formData.password ? "border-blue-300 bg-blue-50" : "border-gray-300"
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
                          formData.password_confirmation ? "border-blue-300 bg-blue-50" : "border-gray-300"
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push(`${ApplicationRoutes.AdminUsers}/${userId}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges()}
                  className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                    hasChanges()
                      ? "text-white bg-orange-600 hover:bg-orange-700"
                      : "text-gray-400 bg-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
