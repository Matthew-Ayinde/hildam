"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, UserCheck, CheckCircle, Loader2 } from "lucide-react"
import { getSession } from "next-auth/react"

const ModernUserForm = () => {
  const baseUrl = "https://hildam.insightpublicis.com/api"

  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    role: string
    email: string
    password: string
  }>({
    name: "",
    role: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const session = await getSession()
    const accessToken = session?.user?.token
    if (!accessToken) {
      alert("No access token found! Please login first.")
      setIsSubmitting(false)
      return
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: Number.parseInt(formData.role, 10),
    }

    try {
      const response = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setPopupMessage("User created successfully")
        setFormData({
          name: "",
          role: "",
          email: "",
          password: "",
        })

        setTimeout(() => {
          setPopupMessage("")
        }, 5000)
      } else {
        const error = await response.json()
        alert(`Failed to create user: ${error.message || "Unknown error"}`)
      }
    } catch (err) {
      alert("Network error. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
    router.push("/admin/users")
  }

  const roleOptions = [
    { value: "1", label: "Admin", icon: "👑" },
    { value: "2", label: "Client Manager", icon: "👥" },
    { value: "3", label: "Head of Tailoring", icon: "✂️" },
    { value: "5", label: "Tailor", icon: "🧵" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br rounded-2xl py-12 px-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4 shadow-lg">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New User</h1>
          <p className="text-gray-600">Add a new team member to your organization</p>
        </div>

        {/* Success Message */}
        {popupMessage && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
            <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-800 font-medium">{popupMessage}</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              User Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name and Role Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
                  Role
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white appearance-none"
                    required
                  >
                    <option value="">Select a role</option>
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.icon} {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Email and Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                  isSubmitting
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:scale-105 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating User...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Create User
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">Need help? Contact your system administrator</p>
        </div>
      </div>
    </div>
  )
}

export default ModernUserForm
