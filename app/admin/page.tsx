"use client"

import { motion } from "framer-motion"
import {
  Users,
  ShoppingBag,
  Package,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TbCurrencyNaira } from "react-icons/tb";

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

const statsData = [
  {
    title: "Total Revenue",
    value: "12,450",
    change: "+12.5%",
    trend: "up",
    icon: TbCurrencyNaira,
    color: "text-orange-600",
  },
  {
    title: "Active Orders",
    value: "24",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-blue-600",
  },
  {
    title: "Total Customers",
    value: "156",
    change: "+5.1%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    item: "Custom Suit",
    status: "In Progress",
    amount: "$450",
    dueDate: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    item: "Wedding Dress",
    status: "Completed",
    amount: "$850",
    dueDate: "2024-01-12",
  },
  {
    id: "ORD-003",
    customer: "Mike Davis",
    item: "Blazer Alteration",
    status: "Pending",
    amount: "$120",
    dueDate: "2024-01-18",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    item: "Dress Hemming",
    status: "In Progress",
    amount: "$80",
    dueDate: "2024-01-16",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    item: "Dress Hemming",
    status: "In Progress",
    amount: "$80",
    dueDate: "2024-01-16",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    item: "Dress Hemming",
    status: "In Progress",
    amount: "$80",
    dueDate: "2024-01-16",
  },
  {
    id: "ORD-004",
    customer: "Emily Brown",
    item: "Dress Hemming",
    status: "In Progress",
    amount: "$80",
    dueDate: "2024-01-16",
  },
]

const inventoryItems = [
  { name: "Cotton Fabric", stock: 45, total: 100, color: "bg-orange-500" },
  { name: "Silk Fabric", stock: 23, total: 50, color: "bg-blue-500" },
  { name: "Wool Fabric", stock: 67, total: 80, color: "bg-green-500" },
  { name: "Buttons", stock: 234, total: 500, color: "bg-purple-500" },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
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
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
                  <CardTitle className="text-xl font-semibold text-gray-900">Recent Orders</CardTitle>
                  <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-100">
                      <TableHead className="text-gray-600">Order ID</TableHead>
                      <TableHead className="text-gray-600">Customer</TableHead>
                      <TableHead className="text-gray-600">Item</TableHead>
                      <TableHead className="text-gray-600">Status</TableHead>
                      <TableHead className="text-gray-600">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="border-gray-50 hover:bg-orange-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">{order.id}</TableCell>
                        <TableCell className="text-gray-700">{order.customer}</TableCell>
                        <TableCell className="text-gray-700">{order.item}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "Completed"
                                ? "default"
                                : order.status === "In Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              order.status === "Completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : order.status === "In Progress"
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{order.amount}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
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
                {inventoryItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm text-gray-500">
                        {item.stock}/{item.total}
                      </span>
                    </div>
                    <Progress value={(item.stock / item.total) * 100} className="h-2" />
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add New Customer
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
