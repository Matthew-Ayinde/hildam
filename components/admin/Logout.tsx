"use client"

import { MdLogout } from "react-icons/md"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"

const LogoutButton = () => {
  const router = useRouter() // Move useRouter inside the component

  const handleLogout = async () => {
    console.log("Logging out...")
    await signOut({ redirect: false })
    router.push(ApplicationRoutes.Login)
  }

  return (
    <button
      onClick={handleLogout} // Remove the arrow function wrapper
      className="px-4 py-1 flex flex-row items-center text-red-500 border border-red-500 text-sm space-x-2 rounded hover:bg-red-500 hover:text-white"
    >
      <div>Log Out</div>
      <MdLogout />
    </button>
  )
}

export default LogoutButton
