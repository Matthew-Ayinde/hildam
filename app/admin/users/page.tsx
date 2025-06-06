"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi"
import { IoMailOutline, IoShieldCheckmarkOutline } from "react-icons/io5"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface ToastProps {
  message: string
  type: "success" | "error"
  isVisible: boolean
}

const Toast = ({ message, type, isVisible }: ToastProps) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
          type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {type === "success" ? <HiOutlineCheckCircle size={20} /> : <HiOutlineXCircle size={20} />}
        <span className="font-medium">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
)

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg w-2/3 animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl animate-pulse" />
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineExclamationCircle className="text-red-500" size={32} />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete User</h3>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{userName}</span>?
          </p>
          <p className="text-sm text-gray-500 mb-8">This action cannot be undone.</p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 border-gray-200 hover:bg-gray-50">
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              Delete User
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

export default function ModernUsersTable() {
  const [data, setData] = useState<User[]>([])
  const [filteredData, setFilteredData] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: "success",
    isVisible: false,
  })

  const rowsPerPage = 10
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const router = useRouter()

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const session = await getSession()
        const accessToken = session?.user?.token

        if (!accessToken) {
          showToast("No access token found. Please log in.", "error")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const result = await response.json()
        const users = result.data || []
        setData(users)
        setFilteredData(users)
      } catch (error) {
        console.error("Error fetching data:", error)
        showToast("Failed to load users. Please try again.", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const filtered = data.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [searchQuery, data])

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      const session = await getSession()
      const accessToken = session?.user?.token

      if (!accessToken) {
        showToast("No access token found. Please log in.", "error")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      setData((prevData) => prevData.filter((user) => user.id !== selectedUser.id))
      setIsPopupOpen(false)
      setSelectedUser(null)
      showToast(`${selectedUser.name} has been deleted successfully.`, "success")
    } catch (error) {
      console.error("Error deleting user:", error)
      showToast("Failed to delete user. Please try again.", "error")
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "user":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="w-full bg-gradient-to-br from-orange-50 to-white rounded-3xl p-6 shadow-sm border border-orange-100">
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
            <HiOutlineUsers className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-500">Manage and monitor user accounts</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
            />
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1">
            {filteredData.length} users
          </Badge>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineUsers className="text-orange-400" size={36} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? "No users found" : "No users yet"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search terms to find what you're looking for."
              : "Users will appear here once they're added to the system."}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-4 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Clear search
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
          {paginatedData.map((user, index) => (
            <motion.div
              key={user.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                      <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                        <IoShieldCheckmarkOutline className="mr-1" size={14} />
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <IoMailOutline size={16} />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    className="p-3 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-xl transition-colors"
                    title="View user details"
                  >
                    <HiOutlineEye size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedUser(user)
                      setIsPopupOpen(true)
                    }}
                    className="p-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
                    title="Delete user"
                  >
                    <HiOutlineTrash size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        >
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * rowsPerPage - rowsPerPage + 1, filteredData.length)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * rowsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{filteredData.length}</span> users
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              <HiOutlineChevronLeft size={16} />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={
                        currentPage === page
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : "border-gray-200 hover:bg-gray-50"
                      }
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              <HiOutlineChevronRight size={16} />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleDelete}
        userName={selectedUser?.name || ""}
      />
    </div>
  )
}
