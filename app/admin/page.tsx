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
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="flex items-center space-x-4 p-4"
      >
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse flex-1" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-24" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-20" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-16" />
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-20" />
      </motion.div>
    ))}
  </div>
)

const StatCardSkeleton = () => (
  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-24 mb-2" />
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-16 mb-2" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-20" />
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
      </div>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
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
      color: "text-blue-600",
      loading: true,
    },
    {
      title: "Total Customers",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
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

  const parseInventoryQuantity = (quantity: string): number => {
    const parsed = Number.parseInt(quantity)
    return isNaN(parsed) ? 0 : parsed
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        setStatsLoading(true)

        // Fetch all data concurrently using the defined functions
        const [ordersResult, customersResult, inventoryResult] = await Promise.allSettled([
          fetchOrdersData(),
          fetchCustomersData(),
          fetchInventoryData(),
        ])

        // Process orders data - THIS IS THE FIX
        if (ordersResult.status === "fulfilled") {
          const recentOrders = ordersResult.value.orders

          // Map the API response to match your Order interface
          const mappedOrders = recentOrders.map((order: any) => ({
            id: order.id,
            order_id: order.order_id,
            date_created: order.date_created,
            cloth_name: order.cloth_name,
            priority: order.priority,
            order_status: order.order_status || "pending", // Default status if not provided
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

          // Set the orders state - THIS WAS MISSING
          setOrders(mappedOrders)
        }

        // Process customers data
        if (customersResult.status === "fulfilled") {
          // Map the API response to match our Customer interface
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
        }

        // Process inventory data
        if (inventoryResult.status === "fulfilled") {
          setInventory(inventoryResult.value)
        }

        // Update stats data
        const newStatsData = [...statsData]

        // Update orders stats
        if (ordersResult.status === "fulfilled") {
          const totalOrders = ordersResult.value.orders.length
          newStatsData[0] = {
            ...newStatsData[0],
            value: totalOrders.toString(),
            change: calculatePercentageChange(totalOrders, Math.floor(totalOrders * 0.9)),
            loading: false,
          }
        }

        // Update customers stats
        if (customersResult.status === "fulfilled") {
          const totalCustomers = customersResult.value.length
          newStatsData[1] = {
            ...newStatsData[1],
            value: totalCustomers.toString(),
            change: calculatePercentageChange(totalCustomers, Math.floor(totalCustomers * 0.95)),
            loading: false,
          }
        }

        // Update inventory stats
        if (inventoryResult.status === "fulfilled") {
          const totalInventoryItems = inventoryResult.value.length
          const totalInventoryQuantity = inventoryResult.value.reduce((sum: number, item: InventoryItem) => {
            return sum + (Number.parseInt(item.item_quantity) || 0)
          }, 0)
          newStatsData[2] = {
            ...newStatsData[2],
            value: `${totalInventoryItems}`,
            change: calculatePercentageChange(totalInventoryItems, Math.floor(totalInventoryItems * 0.85)),
            loading: false,
          }
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
    const total = Math.max(quantity + Math.floor(Math.random() * 50), Math.floor(quantity * 1.5))
    return {
      name: item.item_name,
      stock: quantity,
      total: total,
      color: ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500"][index % 4],
    }
  })

  return (
    <div className="bg-white rounded-2xl">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your tailoring business.</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statsData.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <div className="flex items-center mt-1">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className="flex items-center mt-2">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ml-1 ${
                            stat.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-orange-600" />
                    Recent Orders
                  </CardTitle>
                  <Link href={ApplicationRoutes.AdminOrders}>
                    <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders available</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-100 hover:bg-transparent">
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
                            className="border-gray-50 hover:bg-orange-50/30 transition-all duration-200 group"
                          >
                            <TableCell className="font-mono text-sm font-medium text-orange-600 bg-orange-50/50 rounded-l-lg group-hover:bg-orange-100/50">
                              {order.order_id}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
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
                              <Link href={`${ApplicationRoutes.AdminOrders}/${order.id}`}>
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

          {/* Inventory Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-orange-600" />
                  Inventory Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                        <span className="text-sm font-medium text-gray-700 capitalize">{item.name}</span>
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
                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No inventory data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-3">
                <Link href={ApplicationRoutes.AdminCustomersCreate}>
                  <Button
                    variant="secondary"
                    className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Add New Customer
                  </Button>
                </Link>
                <Link href={ApplicationRoutes.AdminOrdersCreate}>
                  <Button
                    variant="secondary"
                    className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
