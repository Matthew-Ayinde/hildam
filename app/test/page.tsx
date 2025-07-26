"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"

export default function TestLoginPage() {
  const { data: session, status } = useSession()
  const [testCredentials, setTestCredentials] = useState({
    email: "admin@gmail.com",
    password: "Password123!",
  })

  const handleTestLogin = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      email: testCredentials.email,
      password: testCredentials.password,
    })

    if (result?.error) {
      alert("Login failed: " + result.error)
    } else {
      alert("Login successful!")
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    alert("Logged out successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login Test Page</h1>

        {/* Session Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <p className="text-sm">
            <strong>Status:</strong> {status}
          </p>
          {session && (
            <div className="mt-2 text-sm">
              <p>
                <strong>Name:</strong> {session.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {session.user?.email}
              </p>
              <p>
                <strong>Role:</strong> {(session.user as any)?.role}
              </p>
            </div>
          )}
        </div>

        {/* Test Credentials */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Test Credentials</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={testCredentials.email}
                onChange={(e) => setTestCredentials({ ...testCredentials, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={testCredentials.password}
                onChange={(e) => setTestCredentials({ ...testCredentials, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!session ? (
            <>
              <button
                onClick={handleTestLogin}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Test Login with Credentials Above
              </button>
              <Link
                href="/login"
                className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md text-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Login Page
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          )}
        </div>

        {/* API Documentation Reference */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">API Documentation Notes:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Endpoint: POST /api/v1/auth/login</li>
            <li>• Token expires after 8 hours</li>
            <li>• Password must be 8+ chars with letters, numbers, and special chars</li>
            <li>• Returns: token, name, email, role</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
