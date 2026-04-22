"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChartIcon,
  Package,
  TrendingUp,
  User,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { DateRange } from "react-day-picker"
import { getSession } from "next-auth/react"
import { ApiRoutes } from "@/app/api/apiRoutes"

interface OrderAnalyticsResponse {
  success: boolean
  order_summary: {
    total: number
    pending: number
    processing: number
    completed: number
    closed: number
  }
  priority_summary: {
    high: number
    medium: number
    low: number
  }
  avg_completion_days: number | null
}

interface TailorAnalyticsResponse {
  success: boolean
  tailors: {
    id: number
    name: string
    total_assigned: number
    completed: number
    completion_rate: number
    avg_completion_days: number | null
  }[]
}

interface CustomerAnalyticsResponse {
  success: boolean
  total_customers: number
  active_customers: number
  inactive_count: number
}

interface AnalyticsData {
  orderSummary: OrderAnalyticsResponse["order_summary"]
  prioritySummary: OrderAnalyticsResponse["priority_summary"]
  avgCompletionDays: number | null
  tailors: TailorAnalyticsResponse["tailors"]
  customer: {
    totalCustomers: number
    activeCustomers: number
    inactiveCustomers: number
  }
}

const OrdersAnalyticsChart = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [apiData, setApiData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      const fromDate = dateRange?.from
      const toDate = dateRange?.to

      if (!fromDate || !toDate) {
        throw new Error("Please select a valid date range")
      }

      const startDate = format(fromDate, "yyyy-MM-dd")
      const endDate = format(toDate, "yyyy-MM-dd")
      const query = `from_date=${startDate}&to_date=${endDate}`

      const [orderRes, tailorRes, customerRes] = await Promise.all([
        fetch(`${ApiRoutes.BASE_URL_API_TEST}${ApiRoutes.FetchOrderAnalytics}?${query}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${ApiRoutes.BASE_URL_API_TEST}${ApiRoutes.FetchTailorAnalytics}?${query}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${ApiRoutes.BASE_URL_API_TEST}${ApiRoutes.FetchCustomerAnalytics}?${query}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }),
      ])

      if (!orderRes.ok || !tailorRes.ok || !customerRes.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const [orderResult, tailorResult, customerResult]: [
        OrderAnalyticsResponse,
        TailorAnalyticsResponse,
        CustomerAnalyticsResponse,
      ] = await Promise.all([orderRes.json(), tailorRes.json(), customerRes.json()])

      if (!orderResult.success || !tailorResult.success || !customerResult.success) {
        throw new Error("One or more analytics endpoints returned an unsuccessful response")
      }

      setApiData({
        orderSummary: orderResult.order_summary,
        prioritySummary: orderResult.priority_summary,
        avgCompletionDays: orderResult.avg_completion_days,
        tailors: Array.isArray(tailorResult.tailors) ? tailorResult.tailors : [],
        customer: {
          totalCustomers: customerResult.total_customers || 0,
          activeCustomers: customerResult.active_customers || 0,
          inactiveCustomers: customerResult.inactive_count || 0,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [dateRange])

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const orderStatusData = useMemo(
    () =>
      apiData
        ? [
            { name: "Completed", value: apiData.orderSummary.completed, color: "#10b981" },
            { name: "Processing", value: apiData.orderSummary.processing, color: "#f59e0b" },
            { name: "Pending", value: apiData.orderSummary.pending, color: "#ef4444" },
            { name: "Closed", value: apiData.orderSummary.closed, color: "#64748b" },
          ]
        : [],
    [apiData]
  )

  const priorityData = useMemo(
    () =>
      apiData
        ? [
            { name: "High", value: apiData.prioritySummary.high, color: "#ef4444" },
            { name: "Medium", value: apiData.prioritySummary.medium, color: "#f59e0b" },
            { name: "Low", value: apiData.prioritySummary.low, color: "#10b981" },
          ]
        : [],
    [apiData]
  )

  const tailorPerformanceData = useMemo(
    () =>
      (apiData?.tailors || [])
        .slice()
        .sort((a, b) => b.total_assigned - a.total_assigned)
        .slice(0, 8)
        .map((tailor) => ({
          name: tailor.name,
          assigned: tailor.total_assigned,
          completed: tailor.completed,
          completionRate: tailor.completion_rate,
          avgDays: tailor.avg_completion_days || 0,
        })),
    [apiData]
  )

  const completionRate =
    apiData && apiData.orderSummary.total > 0
      ? (apiData.orderSummary.completed / apiData.orderSummary.total) * 100
      : 0

  const activeCustomerRate =
    apiData && apiData.customer.totalCustomers > 0
      ? (apiData.customer.activeCustomers / apiData.customer.totalCustomers) * 100
      : 0

  const topTailor = useMemo(() => {
    if (!apiData?.tailors?.length) return null
    return apiData.tailors.reduce((best, current) => {
      if (current.completion_rate > best.completion_rate) return current
      return best
    })
  }, [apiData])

  return (
    <div className="min-h-screen rounded-2xl bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <h1 className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-2xl font-bold text-transparent sm:text-4xl">
              Orders Analytics
            </h1>
            <p className="text-sm text-slate-600 sm:text-lg">
              Full overview of order health, tailor performance, and customer activity.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start border-orange-200 text-left font-normal hover:bg-orange-50 sm:w-[320px]",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a custom date range</span>
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="border-b bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                  <h4 className="mb-2 font-semibold text-slate-800">Select Custom Date Range</h4>
                </div>
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
                <div className="flex justify-end border-t p-3">
                  <Button size="sm" onClick={() => setDatePickerOpen(false)} className="bg-orange-500 hover:bg-orange-600">
                    Apply Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center space-y-6 py-16">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
              <div className="animate-reverse absolute left-2 top-2 h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
              <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-gradient-to-r from-orange-500 to-amber-500" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold text-slate-800">Loading Analytics Data</h3>
              <p className="text-slate-600">Fetching order, tailor, and customer insights...</p>
            </div>
          </div>
        )}

        {apiData && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:gap-6">
              <Card className="border-0 bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">Total Orders</CardTitle>
                  <Package className="h-5 w-5 text-orange-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold sm:text-3xl">{apiData.orderSummary.total.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs text-orange-200">
                    <TrendingUp className="h-3 w-3" />
                    <span>
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                        : "Custom range"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Completed</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 sm:text-3xl">{apiData.orderSummary.completed.toLocaleString()}</div>
                  <p className="text-xs text-slate-500">{completionRate.toFixed(1)}% completion rate</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Avg Completion</CardTitle>
                  <Clock className="h-5 w-5 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600 sm:text-3xl">
                    {apiData.avgCompletionDays !== null ? `${apiData.avgCompletionDays.toFixed(1)}d` : "N/A"}
                  </div>
                  <p className="text-xs text-slate-500">Average days to complete</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Active Customers</CardTitle>
                  <Users className="h-5 w-5 text-cyan-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-700 sm:text-3xl">{apiData.customer.activeCustomers.toLocaleString()}</div>
                  <p className="text-xs text-slate-500">{activeCustomerRate.toFixed(1)}% engagement</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Top Tailor</CardTitle>
                  <User className="h-5 w-5 text-violet-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-bold text-violet-700 sm:text-base">{topTailor?.name || "N/A"}</div>
                  <p className="text-xs text-slate-500">
                    {topTailor ? `${topTailor.completion_rate.toFixed(1)}% completion` : "No tailor data"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
                <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
                  <PieChartIcon className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="tailors" className="gap-2 text-xs sm:text-sm">
                  <Activity className="h-4 w-4" />
                  <span>Tailors</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="gap-2 text-xs sm:text-sm">
                  <Users className="h-4 w-4" />
                  <span>Customers</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-800 sm:text-xl">
                        <PieChartIcon className="h-5 w-5 text-orange-500" />
                        Order Status Distribution
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Breakdown by order lifecycle state</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={Object.fromEntries(
                          orderStatusData.map((item) => [item.name.toLowerCase(), { label: item.name, color: item.color }])
                        )}
                        className="h-[260px] w-full sm:h-[320px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={100} dataKey="value">
                              {orderStatusData.map((entry, index) => (
                                <Cell key={`status-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="rounded-lg border bg-white p-3 shadow-lg">
                                      <p className="font-medium text-slate-800">{data.name}</p>
                                      <p className="font-semibold text-orange-600">{data.value.toLocaleString()} orders</p>
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

                  <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-800 sm:text-xl">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Priority Distribution
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Orders grouped by urgency</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {priorityData.map((priority) => (
                          <div key={priority.name} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                            <div className="flex items-center gap-3">
                              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: priority.color }} />
                              <p className="text-sm font-medium text-slate-800 sm:text-base">{priority.name} Priority</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-slate-800 sm:text-base">{priority.value.toLocaleString()}</p>
                              <p className="text-xs text-slate-500">orders</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tailors" className="space-y-6">
                <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-slate-800 sm:text-xl">
                      <Activity className="h-5 w-5 text-violet-600" />
                      Tailor Assignment vs Completion
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Top tailors by assigned volume in selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tailorPerformanceData.length === 0 ? (
                      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">
                        No tailor analytics available for this date range.
                      </div>
                    ) : (
                      <ChartContainer
                        config={{
                          assigned: { label: "Assigned", color: "#8b5cf6" },
                          completed: { label: "Completed", color: "#22c55e" },
                        }}
                        className="h-[320px] w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={tailorPerformanceData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const entry = payload[0].payload
                                  return (
                                    <div className="rounded-lg border bg-white p-3 shadow-lg">
                                      <p className="font-semibold text-slate-800">{entry.name}</p>
                                      <p className="text-sm text-violet-700">Assigned: {entry.assigned}</p>
                                      <p className="text-sm text-green-700">Completed: {entry.completed}</p>
                                      <p className="text-sm text-slate-600">Completion: {entry.completionRate.toFixed(1)}%</p>
                                      <p className="text-sm text-slate-600">
                                        Avg Days: {entry.avgDays > 0 ? entry.avgDays.toFixed(1) : "N/A"}
                                      </p>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Bar dataKey="assigned" fill="#8b5cf6" radius={6} />
                            <Bar dataKey="completed" fill="#22c55e" radius={6} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customers" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-800 sm:text-xl">
                        <Users className="h-5 w-5 text-cyan-600" />
                        Customer Activity Split
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Active vs inactive customer count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{
                          active: { label: "Active", color: "#06b6d4" },
                          inactive: { label: "Inactive", color: "#94a3b8" },
                        }}
                        className="h-[260px] w-full sm:h-[320px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Active", value: apiData.customer.activeCustomers, color: "#06b6d4" },
                                { name: "Inactive", value: apiData.customer.inactiveCustomers, color: "#94a3b8" },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={100}
                              dataKey="value"
                            >
                              <Cell fill="#06b6d4" />
                              <Cell fill="#94a3b8" />
                            </Pie>
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="rounded-lg border bg-white p-3 shadow-lg">
                                      <p className="font-medium text-slate-800">{data.name}</p>
                                      <p className="font-semibold text-cyan-700">{data.value.toLocaleString()} customers</p>
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

                  <Card className="border-0 bg-white/70 shadow-lg backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-800 sm:text-xl">
                        <Users className="h-5 w-5 text-slate-600" />
                        Customer Health Summary
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Snapshot for selected period</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">Total Customers</p>
                        <p className="text-3xl font-bold text-slate-800">{apiData.customer.totalCustomers.toLocaleString()}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Active Engagement</span>
                          <span className="font-semibold text-cyan-700">{activeCustomerRate.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, activeCustomerRate)}%` }} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-cyan-50 p-3">
                          <p className="text-xs text-cyan-700">Active</p>
                          <p className="text-xl font-bold text-cyan-800">{apiData.customer.activeCustomers.toLocaleString()}</p>
                        </div>
                        <div className="rounded-lg bg-slate-100 p-3">
                          <p className="text-xs text-slate-600">Inactive</p>
                          <p className="text-xl font-bold text-slate-700">{apiData.customer.inactiveCustomers.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

export default OrdersAnalyticsChart
