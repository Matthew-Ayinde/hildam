"use client"

import { useState } from "react"
import {
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChartIcon,
  Activity,
  Calendar,
  Filter,
  Download,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Dummy data for orders analytics
const monthlyOrdersData = [
  { month: "Jan", totalOrders: 145, completed: 132, processing: 8, pending: 5, revenue: 285000 },
  { month: "Feb", totalOrders: 162, completed: 148, processing: 10, pending: 4, revenue: 324000 },
  { month: "Mar", totalOrders: 138, completed: 125, processing: 9, pending: 4, revenue: 276000 },
  { month: "Apr", totalOrders: 189, completed: 171, processing: 12, pending: 6, revenue: 378000 },
  { month: "May", totalOrders: 205, completed: 186, processing: 14, pending: 5, revenue: 410000 },
  { month: "Jun", totalOrders: 178, completed: 162, processing: 11, pending: 5, revenue: 356000 },
  { month: "Jul", totalOrders: 221, completed: 201, processing: 15, pending: 5, revenue: 442000 },
  { month: "Aug", totalOrders: 198, completed: 180, processing: 13, pending: 5, revenue: 396000 },
  { month: "Sep", totalOrders: 234, completed: 214, processing: 16, pending: 4, revenue: 468000 },
  { month: "Oct", totalOrders: 256, completed: 235, processing: 17, pending: 4, revenue: 512000 },
  { month: "Nov", totalOrders: 289, completed: 267, processing: 18, pending: 4, revenue: 578000 },
  { month: "Dec", totalOrders: 312, completed: 289, processing: 19, pending: 4, revenue: 624000 },
]

const weeklyOrdersData = [
  { week: "Week 1", totalOrders: 78, completed: 72, processing: 4, pending: 2 },
  { week: "Week 2", totalOrders: 85, completed: 79, processing: 4, pending: 2 },
  { week: "Week 3", totalOrders: 92, completed: 85, processing: 5, pending: 2 },
  { week: "Week 4", totalOrders: 89, completed: 82, processing: 5, pending: 2 },
]

const orderStatusDistribution = [
  { name: "Completed", value: 2567, color: "#10b981", percentage: 82.3 },
  { name: "Processing", value: 387, color: "#f59e0b", percentage: 12.4 },
  { name: "Pending", value: 98, color: "#ef4444", percentage: 3.1 },
  { name: "Cancelled", value: 68, color: "#6b7280", percentage: 2.2 },
]

const orderPriorityData = [
  { name: "High", value: 456, color: "#ef4444", percentage: 14.6 },
  { name: "Medium", value: 1789, color: "#f59e0b", percentage: 57.3 },
  { name: "Low", value: 875, color: "#10b981", percentage: 28.1 },
]

const clothingTypeOrders = [
  { type: "Wedding Dresses", orders: 145, revenue: 725000, avgPrice: 5000 },
  { type: "Business Suits", orders: 289, revenue: 867000, avgPrice: 3000 },
  { type: "Casual Wear", orders: 456, revenue: 684000, avgPrice: 1500 },
  { type: "Evening Gowns", orders: 123, revenue: 492000, avgPrice: 4000 },
  { type: "Traditional Wear", orders: 234, revenue: 702000, avgPrice: 3000 },
  { type: "School Uniforms", orders: 567, revenue: 567000, avgPrice: 1000 },
]

const orderCompletionTimes = [
  { timeRange: "1-3 days", orders: 234, percentage: 25.1 },
  { timeRange: "4-7 days", orders: 456, percentage: 48.9 },
  { timeRange: "8-14 days", orders: 189, percentage: 20.3 },
  { timeRange: "15+ days", orders: 53, percentage: 5.7 },
]

const dailyOrderTrends = [
  { day: "Mon", orders: 45, avgValue: 2100 },
  { day: "Tue", orders: 52, avgValue: 2300 },
  { day: "Wed", orders: 48, avgValue: 2000 },
  { day: "Thu", orders: 61, avgValue: 2500 },
  { day: "Fri", orders: 58, avgValue: 2400 },
  { day: "Sat", orders: 39, avgValue: 1800 },
  { day: "Sun", orders: 28, avgValue: 1600 },
]

export default function OrdersAnalyticsChart() {
  const [timeRange, setTimeRange] = useState("monthly")
  const [selectedMetric, setSelectedMetric] = useState("orders")

  const currentData = timeRange === "monthly" ? monthlyOrdersData : weeklyOrdersData
  const latestData = currentData[currentData.length - 1]
  const previousData = currentData[currentData.length - 2]

  const growthRate = previousData
    ? ((latestData.totalOrders - previousData.totalOrders) / previousData.totalOrders) * 100
    : 0

  const totalOrders = latestData.totalOrders
  const completedOrders = latestData.completed
  const processingOrders = latestData.processing
  const pendingOrders = latestData.pending
  const completionRate = (completedOrders / totalOrders) * 100

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  return (
    <div className="min-h-screen bg-white rounded-2xl p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Orders Analytics
            </h1>
            <p className="text-slate-600 text-lg">Track order performance, trends, and completion metrics</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 hover:bg-orange-50 border-orange-200">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2 hover:bg-orange-50 border-orange-200">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Total Orders</CardTitle>
              <Package className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrders}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-orange-200" />
                <span className="text-orange-200 font-medium">+{growthRate.toFixed(1)}%</span>
                <span className="text-orange-200">vs last {timeRange.slice(0, -2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedOrders}</div>
              <p className="text-xs text-slate-500">{completionRate.toFixed(1)}% completion rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Processing</CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{processingOrders}</div>
              <p className="text-xs text-slate-500">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Pending</CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{pendingOrders}</div>
              <p className="text-xs text-slate-500">Awaiting action</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="trends" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="status" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Status
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Activity className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orders Growth Line Chart */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    Orders Growth Trend
                  </CardTitle>
                  <CardDescription>Total orders over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      totalOrders: { label: "Total Orders", color: "#f97316" },
                      completed: { label: "Completed", color: "#10b981" },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={currentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey={timeRange === "monthly" ? "month" : "week"} stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-4 border rounded-lg shadow-lg">
                                  <p className="font-medium text-slate-800 mb-2">{label}</p>
                                  {payload.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                      <span className="text-sm text-slate-600">{entry.name}:</span>
                                      <span className="font-semibold text-slate-800">{entry.value}</span>
                                    </div>
                                  ))}
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="totalOrders"
                          stroke="#f97316"
                          strokeWidth={3}
                          dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="completed"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Revenue Area Chart */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-500" />
                    Revenue Trend
                  </CardTitle>
                  <CardDescription>Monthly revenue from orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      revenue: { label: "Revenue", color: "#10b981" },
                    }}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyOrdersData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                        />
                        <ChartTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-4 border rounded-lg shadow-lg">
                                  <p className="font-medium text-slate-800 mb-2">{label}</p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-sm text-slate-600">Revenue:</span>
                                    <span className="font-semibold text-slate-800">
                                      {formatCurrency(payload[0].value as number)}
                                    </span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#revenueGradient)"
                        />
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Status Pie Chart */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-orange-500" />
                    Order Status Distribution
                  </CardTitle>
                  <CardDescription>Breakdown by order status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={Object.fromEntries(
                      orderStatusDistribution.map((item) => [
                        item.name.toLowerCase(),
                        { label: item.name, color: item.color },
                      ]),
                    )}
                    className="h-[300px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {orderStatusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium text-slate-800">{data.name}</p>
                                  <p className="text-orange-600 font-semibold">{data.value} orders</p>
                                  <p className="text-xs text-slate-500">{data.percentage}% of total</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Priority Distribution
                  </CardTitle>
                  <CardDescription>Orders by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderPriorityData.map((priority) => (
                      <div key={priority.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: priority.color }} />
                          <div>
                            <p className="font-medium text-slate-800">{priority.name} Priority</p>
                            <p className="text-xs text-slate-500">{priority.percentage}% of orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">{priority.value}</p>
                          <p className="text-xs text-slate-500">orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Completion Time Analysis */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    Order Completion Times
                  </CardTitle>
                  <CardDescription>Distribution of completion timeframes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderCompletionTimes.map((timeRange, index) => (
                      <div
                        key={timeRange.timeRange}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              index === 0
                                ? "bg-green-500"
                                : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-slate-800">{timeRange.timeRange}</p>
                            <p className="text-xs text-slate-500">{timeRange.percentage}% of orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">{timeRange.orders}</p>
                          <p className="text-xs text-slate-500">orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
