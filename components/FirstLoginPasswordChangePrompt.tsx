"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { HiEye, HiEyeOff } from "react-icons/hi"
import { MdLockOutline, MdOutlineCheckCircle, MdOutlineErrorOutline } from "react-icons/md"
import { firstLoginChangePassword } from "@/app/api/apiClient"

export default function FirstLoginPasswordChangePrompt() {
  const { data: session, status } = useSession()

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("error")

  const user = session?.user as any
  const userEmail = user?.email || ""
  const mustChangePassword = Boolean(user?.must_change_password)

  const completionKey = useMemo(() => {
    if (!userEmail) return ""
    return `first_login_password_changed_${userEmail}`
  }, [userEmail])

  useEffect(() => {
    if (status !== "authenticated") {
      setIsOpen(false)
      return
    }

    if (!mustChangePassword || !completionKey) {
      setIsOpen(false)
      return
    }

    const alreadyChanged = sessionStorage.getItem(completionKey) === "true"
    setIsOpen(!alreadyChanged)
  }, [status, mustChangePassword, completionKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!password || !confirmPassword) {
      setMessageType("error")
      setMessage("Please fill all password fields.")
      return
    }

    if (password.length < 8) {
      setMessageType("error")
      setMessage("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setMessageType("error")
      setMessage("Password confirmation does not match.")
      return
    }

    setLoading(true)

    try {
      const result = await firstLoginChangePassword({
        password,
        password_confirmation: confirmPassword,
      })

      setMessageType("success")
      setMessage(result?.message || "Password changed successfully.")

      if (completionKey) {
        sessionStorage.setItem(completionKey, "true")
      }
      sessionStorage.setItem("must_change_password", "false")
      setPassword("")
      setConfirmPassword("")

      setTimeout(() => {
        setIsOpen(false)
      }, 800)
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message
      let parsedMessage = "Unable to change password. Please try again."

      if (typeof apiMessage === "string") {
        parsedMessage = apiMessage
      } else if (apiMessage && typeof apiMessage === "object") {
        const firstKey = Object.keys(apiMessage)[0]
        const firstValue = firstKey ? apiMessage[firstKey] : null
        if (Array.isArray(firstValue) && firstValue[0]) {
          parsedMessage = String(firstValue[0])
        }
      }

      const backendMessage =
        parsedMessage ||
        error?.message ||
        "Unable to change password. Please try again."
      setMessageType("error")
      setMessage(String(backendMessage))
    } finally {
      setLoading(false)
    }
  }

  if (status !== "authenticated") {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MdLockOutline size={26} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Change Your Password</h2>
                  <p className="text-sm text-orange-100">
                    First-time login requires a password update to continue.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                    messageType === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {messageType === "success" ? <MdOutlineCheckCircle size={18} /> : <MdOutlineErrorOutline size={18} />}
                  <span>{message}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Sign out
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-white transition ${
                    loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
