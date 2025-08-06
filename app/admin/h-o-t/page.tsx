"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiUser,
  FiPackage,
  FiFilter,
  FiSearch,
} from "react-icons/fi"
import { HiOutlineSparkles } from "react-icons/hi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getSession } from "next-auth/react"
import { fetchAllTailorJobs } from "@/app/api/apiClient"

interface JobItem {
  id: string
  order_id: string
  assigned_at: string
  clothing_name: string
  clothing_description: string
  priority: "high" | "medium" | "low"
  customer_name: string
  gender: "male" | "female"
  age: string
  customer_description: string
}

export default function TailorDashboard() {
  const [data, setData] = useState<JobItem[]>([])
  const [filteredData, setFilteredData] = useState<JobItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  const rowsPerPage = 6
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const cardVariants: any = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  useEffect(() => {
    let filtered = data

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.clothing_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((item) => item.priority === priorityFilter)
    }

    setFilteredData(filtered)

    // Ensure current page is valid based on new filtered data
    const newTotalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages)
    } else if (currentPage < 1) {
      setCurrentPage(1)
    }
  }, [searchTerm, priorityFilter, data])

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const result = await fetchAllTailorJobs()


        const validJobs = result
          .filter((job: any) => job.order_id && job.customer_name && job.clothing_name)
          .sort((a: any, b: any) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime())
        // Remove the slice limit to fetch all jobs

        setData(validJobs)
      
    } catch (error) {
      console.error("Error fetching jobs:", error)
      // You might want to show a toast notification or error message here
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-white shadow-xl rounded-2xl p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-orange-500 rounded-lg">
              <HiOutlineSparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Tailor Jobs Dashboard</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600"
          >
            Manage and track all your tailoring assignments
          </motion.p>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "Total Jobs", value: data.length, icon: FiPackage, color: "orange" },
            {
              label: "High Priority",
              value: data.filter((item) => item.priority === "high").length,
              icon: FiClock,
              color: "red",
            },
            {
              label: "Medium Priority",
              value: data.filter((item) => item.priority === "medium").length,
              icon: FiCalendar,
              color: "orange",
            },
            {
              label: "Low Priority",
              value: data.filter((item) => item.priority === "low").length,
              icon: FiUser,
              color: "green",
            },
          ].map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by order ID, customer name, or clothing..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400 w-4 h-4" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-md focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="animate-spin p-4 bg-orange-100 rounded-full mb-4">
                  <FiClock className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Jobs...</h3>
                <p className="text-gray-600">Please wait while we fetch your assignments</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          filteredData.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-full">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-orange-100 rounded-full mb-4">
                    <FiPackage className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Jobs Found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || priorityFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "There are no jobs assigned to you at the moment"}
                  </p>
                  {(searchTerm || priorityFilter !== "all") && (
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setPriorityFilter("all")
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button
                    onClick={fetchJobs}
                    variant="outline"
                    className="mt-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    Refresh Jobs
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {paginatedData.map((job, index) => (
              <motion.div key={job.id} variants={cardVariants} whileHover="hover" layout>
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-800">{job.order_id}</CardTitle>
                      <Badge className={`${getPriorityColor(job.priority)} border`}>{job.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiUser className="w-4 h-4" />
                        <span className="font-medium">{job.customer_name}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {job.gender}, {job.age}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPackage className="w-4 h-4" />
                        <span>
                          {job.clothing_name} - {job.clothing_description}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(job.assigned_at)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/admin/h-o-t/jobs/${job.id}`}>
                        <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                          <FiEye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    {filteredData.length > 0 ? (
                      <>
                        Showing{" "}
                        <span className="font-semibold text-orange-600">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
                        <span className="font-semibold text-orange-600">
                          {Math.min(currentPage * rowsPerPage, filteredData.length)}
                        </span>{" "}
                        of <span className="font-semibold text-orange-600">{filteredData.length}</span> jobs
                      </>
                    ) : (
                      <span>No jobs to display</span>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </Button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page
                        if (totalPages <= 5) {
                          page = i + 1
                        } else if (currentPage <= 3) {
                          page = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i
                        } else {
                          page = currentPage - 2 + i
                        }

                        if (page < 1 || page > totalPages) return null

                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={
                              page === currentPage
                                ? "bg-orange-500 hover:bg-orange-600 text-white"
                                : "border-orange-200 text-orange-600 hover:bg-orange-50"
                            }
                          >
                            {page}
                          </Button>
                        )
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
