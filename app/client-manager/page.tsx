"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, ShoppingBag, Package, CreditCard, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { ApplicationRoutes } from "@/constants/ApplicationRoutes"
import { fetchAllInventories, fetchOrderslist, fetchAllCustomers } from "../api/apiClient"

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

// Updated interface to match your API response
interface Order {
  id: number
  order_id: string
  date_created: string
  cloth_name: string
  priority: string
  order_status: string
  customer_name: string
  customer_email: string
  cloth_description?: string
  gender?: string
  age?: string
  customer_description?: string
  address?: string
  phone_number?: string
  manager_exists?: boolean
  manager_name_exists?: boolean
  manager_name?: string
  manager_id?: string
}

interface Customer {
  id: string
  name: string
  email: string
  age: string
  gender: string
  phone_number: string
  created_at: string
}

interface InventoryItem {
  id: string
  item_name: string
  item_quantity: string
  color: string
  created_at: string
}

interface Payment {
  id: string
  amount: number
  status: string
  created_at: string
  order_id: string
}

interface StatsData {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: any
  color: string
  loading: boolean
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="flex items-center space-x-4"
      >
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
      </motion.div>
    ))}
  </div>
)

const StatCardSkeleton = () => (
  <Card className="border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      </div>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [payments, setPayments] = useState<Payment[]>([]) // Not used in current render, but kept for potential future use
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsData, setStatsData] = useState<StatsData[]>([
    {
      title: "Total Orders",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-orange-600",
      loading: true,
    },
    {
      title: "Total Customers",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      loading: true,
    },
    {
      title: "Total Inventory Items",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Package,
      color: "text-purple-600",
      loading: true,
    },
  ])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return "+100%"
    const change = ((current - previous) / previous) * 100
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`
  }

  // Define individual API functions for easier editing
  const fetchOrdersData = async () => {
    try {
      const ordersData = await fetchOrderslist()
      return ordersData
    } catch (error) {
      console.log("Error fetching orders:", error)
      throw error
    }
  }

  const fetchCustomersData = async () => {
    try {
      const customersData = await fetchAllCustomers()
      return customersData
    } catch (error) {
      console.error("Error fetching customers:", error)
      throw error
    }
  }

  const fetchInventoryData = async () => {
    try {
      const inventoryData = await fetchAllInventories()
      return inventoryData
    } catch (error) {
      console.error("Error fetching inventory:", error)
      throw error
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setStatsLoading(true)

        const [ordersResult, customersResult, inventoryResult] = await Promise.allSettled([
          fetchOrdersData(),
          fetchCustomersData(),
          fetchInventoryData(),
        ])

        const newStatsData = [...statsData]

        // Process orders data
        if (ordersResult.status === "fulfilled") {
          const recentOrders = ordersResult.value.orders
          const mappedOrders = recentOrders.map((order: any) => ({
            id: order.id,
            order_id: order.order_id,
            date_created: order.date_created,
            cloth_name: order.cloth_name,
            priority: order.priority,
            order_status: order.order_status || "pending",
            customer_name: order.customer_name || "Unknown Customer",
            customer_email: order.customer_email || "",
            cloth_description: order.cloth_description || order.cloth_name,
            gender: order.gender,
            age: order.age,
            customer_description: order.customer_description,
            address: order.address,
            phone_number: order.phone_number,
            manager_exists: order.manager_exists,
            manager_name_exists: order.manager_name_exists,
            manager_name: order.manager_name,
            manager_id: order.manager_id,
          }))
          setOrders(mappedOrders)

          const totalOrders = mappedOrders.length
          newStatsData[0] = {
            ...newStatsData[0],
            value: totalOrders.toString(),
            change: calculatePercentageChange(totalOrders, Math.floor(totalOrders * 0.9)),
            loading: false,
          }
          
        } else {
          setError("Failed to load orders data.")
        }

        // Process customers data
        if (customersResult.status === "fulfilled") {
          const mappedCustomers = customersResult.value.map((customer: any) => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            age: customer.age,
            gender: customer.gender,
            phone_number: customer.phone_number,
            created_at: customer.created_at,
          }))
          setCustomers(mappedCustomers)

          const totalCustomers = mappedCustomers.length
          newStatsData[1] = {
            ...newStatsData[1],
            value: totalCustomers.toString(),
            change: calculatePercentageChange(totalCustomers, Math.floor(totalCustomers * 0.95)),
            loading: false,
          }
        } else {
          setError("Failed to load customers data.")
        }

        // Process inventory data
        if (inventoryResult.status === "fulfilled") {
          setInventory(inventoryResult.value)
          const totalInventoryItems = inventoryResult.value.length
          newStatsData[2] = {
            ...newStatsData[2],
            value: `${totalInventoryItems}`,
            change: calculatePercentageChange(totalInventoryItems, Math.floor(totalInventoryItems * 0.85)),
            loading: false,
          }
        } else {
          setError("Failed to load inventory data.")
        }

        setStatsData(newStatsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
        setStatsLoading(false)
      }
    }
    fetchAllData()
  }, [])

  // Create inventory items for display from real data
  const inventoryItems = inventory.slice(0, 4).map((item, index) => {
    const quantity = Number.parseInt(item.item_quantity) || 0
    const total = Math.max(quantity + Math.floor(Math.random() * 50), Math.floor(quantity * 1.5)) // Simulate a 'total capacity'
    return {
      name: item.item_name,
      stock: quantity,
      total: total,
      color: ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500"][index % 4],
    }
  })

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Welcome back! Check out your dashboard for relevant information.
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsData.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              {statsLoading ? (
                <StatCardSkeleton />
              ) : (
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <div className="flex items-center mt-2">
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className="flex items-center mt-3">
                          {stat.trend === "up" ? (
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-semibold ml-1 ${
                              stat.trend === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`p-4 rounded-full bg-gray-100 ${stat.color}`}>
                        <stat.icon className="w-7 h-7" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <ShoppingBag className="w-6 h-6 mr-3 text-orange-600" />
                    Recent Orders
                  </CardTitle>
                  <Link href={ApplicationRoutes.ClientManagerOrders}>
                    <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                      View All <ArrowUpRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">{error}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No orders available</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-100 hover:bg-transparent">
                          <TableHead className="text-gray-600 font-semibold whitespace-nowrap">Order ID</TableHead>
                          <TableHead className="text-gray-600 font-semibold">Customer</TableHead>
                          <TableHead className="text-gray-600 font-semibold">Item</TableHead>
                          <TableHead className="text-gray-600 font-semibold">Priority</TableHead>
                          <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-600 font-semibold">Date</TableHead>
                          <TableHead className="text-gray-600 font-semibold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="border-b border-gray-50 hover:bg-orange-50/30 transition-all duration-200 group last:border-b-0"
                          >
                            <TableCell className="font-mono text-sm font-medium text-orange-600 bg-orange-50/50 rounded-l-lg group-hover:bg-orange-100/50">
                              {order.order_id}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-base">
                                  {order.customer_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{order.customer_name}</div>
                                  <div className="text-xs text-gray-500">{order.customer_email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-700">
                              <div>
                                <div className="font-medium">{order.cloth_name}</div>
                                <div className="text-xs text-gray-500 whitespace-nowrap">{order.cloth_description}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${getPriorityColor(order.priority)} capitalize`}>
                                {order.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${getStatusColor(order.order_status)} capitalize`}>
                                {order.order_status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm whitespace-nowrap">
                              {formatDate(order.date_created)}
                            </TableCell>
                            <TableCell className="rounded-r-lg">
                              <Link href={`${ApplicationRoutes.ClientManagerOrders}/${order.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-2"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Sidebar: Inventory Status & Quick Actions */}
          <div className="space-y-6">
            {/* Inventory Status */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <Package className="w-6 h-6 mr-3 text-orange-600" />
                    Inventory Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {inventoryItems.length > 0 ? (
                    inventoryItems.map((item, index) => (
                      <motion.div
                        key={`${item.name}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-base font-medium text-gray-700 capitalize">{item.name}</span>
                          <span className="text-sm text-gray-500">{item.stock} units</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={(item.stock / item.total) * 100} className="h-2 flex-1" />
                          <span className="text-xs text-gray-400">{Math.round((item.stock / item.total) * 100)}%</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-base">No inventory data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <CreditCard className="w-6 h-6 mr-3" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                  <Link href={ApplicationRoutes.ClientManagerCustomersCreate}>
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0 py-6 text-base"
                    >
                      <Users className="w-5 h-5 mr-3" />
                      Add New Customer
                    </Button>
                  </Link>
                  <Link href={ApplicationRoutes.ClientManagerOrdersCreate}>
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0 py-6 text-base"
                    >
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      Create Order
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
