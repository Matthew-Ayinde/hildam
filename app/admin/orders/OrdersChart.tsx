"use client"

import { useState, useEffect } from "react"
import { Package, TrendingUp, Clock, CheckCircle, AlertTriangle, PieChartIcon, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, startOfWeek, endOfWeek, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { DateRange } from "react-day-picker"
import { getSession } from "next-auth/react"
import { fetchOrderslist } from "@/app/api/apiClient"

// API Response Types
interface ApiResponse {
  success: boolean
  data: {
    prioritySummary: {
      highPriority: number
      mediumPriority: number
      lowPriority: number
    }
    orderStatusSummary: {
      totalOrders: number
      pendingOrders: number
      processingOrders: number
      completedOrders: number
    }
    "Completed orders duration": {
      "1 - 3 days": {
        count: number
        percentage: string
      }
      "4 - 7 days": {
        count: number
        percentage: string
      }
      "8 - 14 days": {
        count: number
        percentage: string
      }
      "15+ days": {
        count: number
        percentage: string
      }
    }
  }
}

interface ChartData {
  prioritySummary: {
    highPriority: number
    mediumPriority: number
    lowPriority: number
  }
  orderStatusSummary: {
    totalOrders: number
    pendingOrders: number
    processingOrders: number
    completedOrders: number
  }
  completionTimes: {
    timeRange: string
    count: number
    percentage: string
  }[]
}

const OrdersAnalyticsChart = () => {
  const [timeRange, setTimeRange] = useState("weekly")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  })
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [apiData, setApiData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from API
  const fetchData = async () => {
    const session = await getSession()
    const accessToken = session?.user?.token

          
    if (!accessToken) {
      setError("Authentication required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      let url = ""
      if (timeRange === "weekly" && dateRange?.from && dateRange?.to) {
        const startDate = format(dateRange.from, "yyyy-MM-dd")
        const endDate = format(dateRange.to, "yyyy-MM-dd")
        url = `https://api.hildamcouture.com/api/v1/orders/chart-information?type=weekly&start_date=${startDate}&end_date=${endDate}`
      } else if (timeRange === "monthly") {
        const month = format(selectedMonth, "yyyy-MM")
        url = `https://api.hildamcouture.com/api/v1/orders/chart-information?type=monthly&month=${month}`
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }


      const result: ApiResponse = await response.json()

      if (result.success) {
        // Transform API data to match our component structure
        const transformedData: ChartData = {
          prioritySummary: result.data.prioritySummary,
          orderStatusSummary: result.data.orderStatusSummary,
          completionTimes: [
            {
              timeRange: "1-3 days",
              count: result.data["Completed orders duration"]["1 - 3 days"].count,
              percentage: result.data["Completed orders duration"]["1 - 3 days"].percentage,
            },
            {
              timeRange: "4-7 days",
              count: result.data["Completed orders duration"]["4 - 7 days"].count,
              percentage: result.data["Completed orders duration"]["4 - 7 days"].percentage,
            },
            {
              timeRange: "8-14 days",
              count: result.data["Completed orders duration"]["8 - 14 days"].count,
              percentage: result.data["Completed orders duration"]["8 - 14 days"].percentage,
            },
            {
              timeRange: "15+ days",
              count: result.data["Completed orders duration"]["15+ days"].count,
              percentage: result.data["Completed orders duration"]["15+ days"].percentage,
            },
          ],
        }
        setApiData(transformedData)
      } else {
        throw new Error("API request failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when timeRange, dateRange, or selectedMonth changes
  useEffect(() => {
    fetchData()
  }, [timeRange, dateRange, selectedMonth])

  // Handle time range change
  const handleTimeRangeChange = (newTimeRange: string) => {
    setTimeRange(newTimeRange)
    if (newTimeRange === "weekly") {
      setDateRange({
        from: startOfWeek(new Date()),
        to: endOfWeek(new Date()),
      })
    } else if (newTimeRange === "monthly") {
      setSelectedMonth(new Date())
    }
  }

  // Handle date range selection for weekly
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (timeRange === "weekly") {
      setDateRange(range)
    }
  }

  // Handle month selection for monthly
  const handleMonthSelect = (date: Date | undefined) => {
    if (date && timeRange === "monthly") {
      setSelectedMonth(date)
    }
  }

  // Quick date range presets
  const setThisWeek = () => {
    const start = startOfWeek(new Date())
    const end = endOfWeek(new Date())
    setDateRange({ from: start, to: end })
    setTimeRange("weekly")
  }

  const setLastWeek = () => {
    const thisWeekStart = startOfWeek(new Date())
    const start = subDays(thisWeekStart, 7)
    const end = subDays(thisWeekStart, 1)
    setDateRange({ from: start, to: end })
    setTimeRange("weekly")
  }

  const setThisMonth = () => {
    setSelectedMonth(new Date())
    setTimeRange("monthly")
  }

  // Prepare data for charts
  const orderStatusData = apiData
    ? [
        { name: "Completed", value: apiData.orderStatusSummary.completedOrders, color: "#10b981" },
        { name: "Processing", value: apiData.orderStatusSummary.processingOrders, color: "#f59e0b" },
        { name: "Pending", value: apiData.orderStatusSummary.pendingOrders, color: "#ef4444" },
      ]
    : []

  const priorityData = apiData
    ? [
        { name: "High", value: apiData.prioritySummary.highPriority, color: "#ef4444" },
        { name: "Medium", value: apiData.prioritySummary.mediumPriority, color: "#f59e0b" },
        { name: "Low", value: apiData.prioritySummary.lowPriority, color: "#10b981" },
      ]
    : []

  const completionRate =
    apiData && apiData.orderStatusSummary.totalOrders > 0
      ? (apiData.orderStatusSummary.completedOrders / apiData.orderStatusSummary.totalOrders) * 100
      : 0

  return (
    <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Orders Analytics
            </h1>
            <p className="text-slate-600 text-sm sm:text-lg">Track order performance, trends, and completion metrics</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-full sm:w-40 border-orange-200 focus:border-orange-400">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[280px] justify-start text-left font-normal border-orange-200 hover:bg-orange-50",
                    !dateRange && !selectedMonth && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {timeRange === "weekly" && dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : timeRange === "monthly" ? (
                      format(selectedMonth, "MMMM yyyy")
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
                  <h4 className="font-semibold text-slate-800 mb-2">
                    Select {timeRange === "weekly" ? "Week Range" : "Month"}
                  </h4>
                </div>
                {timeRange === "weekly" ? (
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={1}
                    className="rounded-md"
                    required
                  />
                ) : (
                  <Calendar
                    initialFocus
                    mode="single"
                    defaultMonth={selectedMonth}
                    selected={selectedMonth}
                    onSelect={handleMonthSelect}
                    numberOfMonths={1}
                    className="rounded-md"
                  />
                )}
                <div className="border-t p-3 flex flex-col sm:flex-row gap-2 justify-between">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={setThisWeek} className="text-xs bg-transparent">
                      This Week
                    </Button>
                    <Button size="sm" variant="outline" onClick={setLastWeek} className="text-xs bg-transparent">
                      Last Week
                    </Button>
                    <Button size="sm" variant="outline" onClick={setThisMonth} className="text-xs bg-transparent">
                      This Month
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setDatePickerOpen(false)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Apply Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Enhanced Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            {/* Main Spinner */}
            <div className="relative">
              {/* Outer ring */}
              <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
              {/* Inner ring */}
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 animate-reverse"></div>
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse"></div>
            </div>

            {/* Loading text */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-slate-800">Loading Analytics Data</h3>
              <p className="text-slate-600">Fetching your order insights...</p>
            </div>

            {/* Progress dots */}
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {apiData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-100">Total Orders</CardTitle>
                <Package className="h-5 w-5 text-orange-200" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold">
                  {apiData.orderStatusSummary.totalOrders.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-orange-200" />
                  <span className="text-orange-200">Current {timeRange}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Completed</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {apiData.orderStatusSummary.completedOrders.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">{completionRate.toFixed(1)}% completion rate</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Processing</CardTitle>
                <Clock className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600">
                  {apiData.orderStatusSummary.processingOrders.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">Currently in progress</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Pending</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-red-600">
                  {apiData.orderStatusSummary.pendingOrders.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">Awaiting action</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        {apiData && (
          <Tabs defaultValue="status" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
              <TabsTrigger value="status" className="gap-2 text-xs sm:text-sm">
                <PieChartIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Status</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2 text-xs sm:text-sm">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Pie Chart */}
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl text-slate-800 flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5 text-orange-500" />
                      Order Status Distribution
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Breakdown by order status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={Object.fromEntries(
                        orderStatusData.map((item) => [
                          item.name.toLowerCase(),
                          { label: item.name, color: item.color },
                        ]),
                      )}
                      className="h-[250px] sm:h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={80}
                            dataKey="value"
                          >
                            {orderStatusData.map((entry, index) => (
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
                                    <p className="text-orange-600 font-semibold">
                                      {data.value.toLocaleString()} orders
                                    </p>
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
                    <CardTitle className="text-lg sm:text-xl text-slate-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Priority Distribution
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Orders by priority level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {priorityData.map((priority) => (
                        <div
                          key={priority.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: priority.color }} />
                            <div>
                              <p className="font-medium text-slate-800 text-sm sm:text-base">
                                {priority.name} Priority
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">
                              {priority.value.toLocaleString()}
                            </p>
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
                    <CardTitle className="text-lg sm:text-xl text-slate-800 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-500" />
                      Order Completion Times
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Distribution of completion timeframes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {apiData.completionTimes.map((timeRange, index) => (
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
                              <p className="font-medium text-slate-800 text-sm sm:text-base">{timeRange.timeRange}</p>
                              <p className="text-xs text-slate-500">{timeRange.percentage} of orders</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800 text-sm sm:text-base">
                              {timeRange.count.toLocaleString()}
                            </p>
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
        )}
      </div>
    </div>
  )
}

export default OrdersAnalyticsChart
