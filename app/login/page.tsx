"use client"

import type React from "react"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiEye, HiEyeOff, HiMail } from "react-icons/hi"
import Image from "next/image"
import Logo from "@/public/logo.png"
import Spinner from "@/components/WhiteSpinner"
import { TbLockPassword } from "react-icons/tb"
import Link from "next/link"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Redirect upon session change
  useEffect(() => {
    if (status === "authenticated" && session) {
      const role = (session.user as any).role as string
      redirectToRole(role)
    }
  }, [status, session, router])

  // Auto-dismiss error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const redirectToRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin")
        break
      case "client manager":
        router.push("/client-manager/orders")
        break
      case "head of tailoring":
        router.push("/head-of-tailoring")
        break
      default:
        setError("Invalid role detected. Please contact support.")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })


    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
    } else if (result?.ok) {
      setSuccess(true)

      // Use window.location.href for immediate redirect
      // This will trigger a full page reload and ensure session is properly loaded
      setTimeout(() => {
        window.location.href = "/dashboard" // or create a dashboard route that handles role-based redirect
      }, 500)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex space-x-2 items-center justify-center w-full h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black w-full px-5 lg:px-40">
      {/* Success Notification */}
      {success && (
        <div className="fixed top-5 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-center animate-fade-in">
          Login successful!
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed top-5 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-center animate-fade-in">
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto space-y-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-8 h-8">
            <Image src={Logo || "/placeholder.svg"} width={300} height={300} alt="Logo" className="w-full h-full" />
          </div>
          <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Hildam Couture</span>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sign In</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access your account</p>
        </div>

        {/* Email Input */}
        <div className="relative">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <HiMail className="text-gray-400 dark:text-gray-500" size={20} />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <TbLockPassword className="text-gray-400 dark:text-gray-500" size={20} />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full pl-10 pr-12 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </button>
        </div>

        <div className="w-full text-right mb-4">
          <Link href={ApplicationRoutes.ForgotPassword} className="text-sm text-orange-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-3 font-semibold rounded-lg shadow-md gap-2 ${
            loading
              ? "bg-orange-300 text-white cursor-not-allowed opacity-60"
              : "bg-orange-500 text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition"
          }`}
        >
          {loading ? (
            <>
              <Spinner />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
