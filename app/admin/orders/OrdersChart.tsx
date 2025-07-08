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
  Filter,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from "date-fns"
import { cn } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { DateRange } from "react-day-picker"

// Enhanced data generation based on date ranges
const generateDataForDateRange = (startDate: Date, endDate: Date, timeRange: string) => {
  const data = []

  if (timeRange === "daily") {
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    days.forEach((day, index) => {
      const baseOrders = 45 + Math.floor(Math.random() * 30)
      data.push({
        period: format(day, "MMM dd"),
        date: format(day, "yyyy-MM-dd"),
        totalOrders: baseOrders,
        completed: Math.floor(baseOrders * 0.85),
        processing: Math.floor(baseOrders * 0.1),
        pending: Math.floor(baseOrders * 0.05),
        revenue: baseOrders * (1800 + Math.random() * 400),
      })
    })
  } else if (timeRange === "weekly") {
    const weeks = eachWeekOfInterval({ start: startDate, end: endDate })
    weeks.forEach((week, index) => {
      const baseOrders = 280 + Math.floor(Math.random() * 100)
      data.push({
        period: `Week ${format(week, "MMM dd")}`,
        date: format(week, "yyyy-MM-dd"),
        totalOrders: baseOrders,
        completed: Math.floor(baseOrders * 0.85),
        processing: Math.floor(baseOrders * 0.1),
        pending: Math.floor(baseOrders * 0.05),
        revenue: baseOrders * (2000 + Math.random() * 500),
      })
    })
  } else {
    const months = eachMonthOfInterval({ start: startDate, end: endDate })
    months.forEach((month, index) => {
      const baseOrders = 180 + Math.floor(Math.random() * 80)
      data.push({
        period: format(month, "MMM yyyy"),
        date: format(month, "yyyy-MM-dd"),
        totalOrders: baseOrders,
        completed: Math.floor(baseOrders * 0.85),
        processing: Math.floor(baseOrders * 0.1),
        pending: Math.floor(baseOrders * 0.05),
        revenue: baseOrders * (2200 + Math.random() * 600),
      })
    })
  }

  return data
}

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

const orderCompletionTimes = [
  { timeRange: "1-3 days", orders: 234, percentage: 25.1 },
  { timeRange: "4-7 days", orders: 456, percentage: 48.9 },
  { timeRange: "8-14 days", orders: 189, percentage: 20.3 },
  { timeRange: "15+ days", orders: 53, percentage: 5.7 },
]

export default function OrdersAnalyticsChart() {
  const [timeRange, setTimeRange] = useState("monthly")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  // Quick date range presets
  const setQuickRange = (days: number) => {
    const end = new Date()
    const start = subDays(end, days)
    setDateRange({ from: start, to: end })
  }

  const setThisWeek = () => {
    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())
    setDateRange({ from: start, to: end })
    setTimeRange("daily")
  }

  const setThisMonth = () => {
    const start = startOfMonth(new Date())
    const end = endOfMonth(new Date())
    setDateRange({ from: start, to: end })
    setTimeRange("daily")
  }

  const setThisYear = () => {
    const start = startOfYear(new Date())
    const end = endOfYear(new Date())
    setDateRange({ from: start, to: end })
    setTimeRange("monthly")
  }

  // Get current data based on date range
  const getCurrentData = () => {
    if (!dateRange?.from || !dateRange?.to) {
      return []
    }
    return generateDataForDateRange(dateRange.from, dateRange.to, timeRange)
  }

  const currentData = getCurrentData()
  const latestData = currentData[currentData.length - 1] || { totalOrders: 0, completed: 0, processing: 0, pending: 0 }
  const previousData = currentData[currentData.length - 2]

  const growthRate =
    previousData && latestData
      ? ((latestData.totalOrders - previousData.totalOrders) / previousData.totalOrders) * 100
      : 0

  const totalOrders = latestData.totalOrders
  const completedOrders = latestData.completed
  const processingOrders = latestData.processing
  const pendingOrders = latestData.pending
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0

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

          <div className="flex flex-wrap gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal border-orange-200 hover:bg-orange-50",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                  <div className="border-r p-3 space-y-2">
                    <div className="text-sm font-medium text-slate-700 mb-3">Quick Ranges</div>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setQuickRange(7)
                          setTimeRange("daily")
                        }}
                      >
                        Last 7 days
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setQuickRange(30)
                          setTimeRange("daily")
                        }}
                      >
                        Last 30 days
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setQuickRange(90)
                          setTimeRange("weekly")
                        }}
                      >
                        Last 3 months
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={setThisWeek}>
                        This week
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={setThisMonth}>
                        This month
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={setThisYear}>
                        This year
                      </Button>
                    </div>
                  </div>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </div>
                <div className="border-t p-3 flex justify-end">
                  <Button size="sm" onClick={() => setDatePickerOpen(false)}>
                    Apply Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" className="gap-2 hover:bg-orange-50 border-orange-200 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
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
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="trends" className="gap-2">
              <BarChart3 className="h-4 w-4" />
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
            <div className="grid grid-cols-1 gap-6">
              {/* Orders Growth Bar Chart */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Orders Growth Trend
                  </CardTitle>
                  <CardDescription>
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                      : "Select a date range to view data"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      totalOrders: { label: "Total Orders", color: "#f97316" },
                      completed: { label: "Completed", color: "#10b981" },
                      processing: { label: "Processing", color: "#f59e0b" },
                      pending: { label: "Pending", color: "#ef4444" },
                    }}
                    className="h-[400px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
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
                        <Bar dataKey="totalOrders" fill="#f97316" radius={[4, 4, 0, 0]} name="Total Orders" />
                        <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                        <Bar dataKey="processing" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Processing" />
                        <Bar dataKey="pending" fill="#ef4444" radius={[4, 4, 0, 0]} name="Pending" />
                      </BarChart>
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
            <div className="grid grid-cols-1 gap-6">
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
