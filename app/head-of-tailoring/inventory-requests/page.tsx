"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiPackage, FiUser, FiCalendar, FiCheck, FiX, FiClock, FiSearch } from "react-icons/fi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSession } from "next-auth/react"
import { fetchAllInventoryRequests } from "@/app/api/apiClient"

interface StoreRequest {
  id: string
  items_name: string
  items_quantities: string // Corrected from requested_quantities
  requested_color: string | null
  requested_by_user_id: string
  requested_by_name: string
  status: "approved" | "rejected" | "pending"
  order_id: string // Corrected from order_id_for_the_job
  created_at: string
  updated_at: string
  accepted_at: string | null
  rejected_at: string | null
}

interface ApiResponse {
  message: string
  data: Record<string, StoreRequest[]>
}

export default function StoreRequestsDashboard() {
  const [data, setData] = useState<Record<string, StoreRequest[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "rejected">("all")

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await fetchAllInventoryRequests()

      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-orange-100 text-orange-800 "
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <FiCheck className="w-3 h-3" />
      case "rejected":
        return <FiX className="w-3 h-3" />
      default:
        return <FiClock className="w-3 h-3" />
    }
  }

  const filteredData = Object.entries(data).reduce(
    (acc, [orderId, requests]) => {
      const filteredRequests = requests.filter((request) => {
        const matchesSearch =
          request.items_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.requested_by_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          orderId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || request.status === statusFilter
        return matchesSearch && matchesStatus
      })
      if (filteredRequests.length > 0) {
        acc[orderId] = filteredRequests
      }
      return acc
    },
    {} as Record<string, StoreRequest[]>,
  )

  const totalRequests = Object.values(data).flat().length
  const approvedRequests = Object.values(data)
    .flat()
    .filter((r) => r.status === "approved").length
  const rejectedRequests = Object.values(data)
    .flat()
    .filter((r) => r.status === "rejected").length

  if (loading) {
    return (
      <div className="">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
            />
            <span className="ml-3 text-orange-600 font-medium">Loading store requests...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center h-[300px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-700">You haven&apos;t made any requests</h2>
          <p className="mt-2 text-gray-500">Once you do, they&apos;ll show up here.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Store Requests Dashboard</h1>
          <p className="text-gray-600">Manage and track all store requests across orders</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className=" bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-900">{totalRequests}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedRequests}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{rejectedRequests}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FiX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className=" bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by item name, requester, or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10  focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    className={
                      statusFilter === "all"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : " text-orange-600 hover:bg-orange-50"
                    }
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "approved" ? "default" : "outline"}
                    onClick={() => setStatusFilter("approved")}
                    className={
                      statusFilter === "approved"
                        ? "bg-green-500 hover:bg-green-600"
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }
                  >
                    Approved
                  </Button>
                  <Button
                    variant={statusFilter === "rejected" ? "default" : "outline"}
                    onClick={() => setStatusFilter("rejected")}
                    className={
                      statusFilter === "rejected"
                        ? "bg-red-500 hover:bg-red-600"
                        : "border-red-200 text-red-600 hover:bg-red-50"
                    }
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders */}
        <AnimatePresence>
          {Object.entries(filteredData).map(([orderId, requests], orderIndex) => (
            <motion.div
              key={orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: orderIndex * 0.1 }}
              className="mb-8"
            >
              <Card className=" bg-white shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <FiPackage className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Order {orderId}</h3>
                        <p className="text-orange-100 text-sm">{requests.length} items requested</p>
                      </div>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">{requests.length} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid gap-0">
                    {requests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: orderIndex * 0.1 + index * 0.05 }}
                        className={`p-6 border-b border-gray-100 last:border-b-0 hover:bg-orange-25 transition-colors ${
                          index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FiPackage className="w-6 h-6 text-orange-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">{request.items_name}</h4>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">Qty:</span>
                                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                      {request.items_quantities}
                                    </span>
                                  </div>
                                  {request.requested_color && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">Color:</span>
                                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {request.requested_color}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <FiUser className="w-3 h-3" />
                                    <span>{request.requested_by_name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center gap-1 mb-1">
                                <FiCalendar className="w-3 h-3" />
                                <span>Created: {formatDate(request.created_at)}</span>
                              </div>
                              {request.accepted_at && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <FiCheck className="w-3 h-3" />
                                  <span>Accepted: {formatDate(request.accepted_at)}</span>
                                </div>
                              )}
                              {request.rejected_at && (
                                <div className="flex items-center gap-1 text-red-600">
                                  <FiX className="w-3 h-3" />
                                  <span>Rejected: {formatDate(request.rejected_at)}</span>
                                </div>
                              )}
                            </div>
                            <Badge className={`${getStatusColor(request.status)} flex items-center gap-1 px-3 py-1`}>
                              {getStatusIcon(request.status)}
                              <span className="capitalize font-medium">{request.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {Object.keys(filteredData).length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
