"use client"

import { useState, useEffect } from "react"
import { Users, TrendingUp, UserPlus, Activity, BarChart3, PieChartIcon, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { fetchCustomerChart } from "@/app/api/apiClient"

// Define types for API response
interface MonthlyCustomerData {
  month: string
  count: number
}

interface AgeBreakdown {
  group: string
  count: number
  percentage: string // API returns string, convert to number for calculations if needed
}

interface ApiResponse {
  status: string
  year: string
  data: MonthlyCustomerData[] // This seems to be the total customer growth over months
  total_customers: number
  monthly_breakdown: MonthlyCustomerData[] // This is likely new customers per month
  age_breakdown: AgeBreakdown[]
}

export default function CustomerAnalyticsChart() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [chartData, setChartData] = useState<MonthlyCustomerData[]>([]) // For total customer base chart
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyCustomerData[]>([]) // For new customers calculation
  const [customerDemographics, setCustomerDemographics] = useState<AgeBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const years = ["2023", "2024", "2025"] // Example years for the dropdown

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Simulate API response based on the provided format
        // In a real application, replace this with an actual fetch call:
        // const response = await fetch(`/api/customers/customer-chart?year=${selectedYear}`);
        // if (!response.ok) throw new Error('Failed to fetch data');
        // const result: ApiResponse = await response.json();

        // Simulated data for demonstration purposes
        const result: any = await fetchCustomerChart(selectedYear)
        console.log("Fetched customer chart data:", result)
        

        setChartData(result.data)
        setTotalCustomers(result.total_customers)
        setMonthlyBreakdown(result.monthly_breakdown)
        setCustomerDemographics(result.age_breakdown)

        // Simulated data for demonstration purposes
        // const simulatedApiResponse: ApiResponse = {
        //   status: "success",
        //   year: selectedYear,
        //   data: [
        //     { month: "January", count: 100 },
        //     { month: "February", count: 120 },
        //     { month: "March", count: 150 },
        //     { month: "April", count: 180 },
        //     { month: "May", count: 210 },
        //     { month: "June", count: 240 },
        //     { month: "July", count: 270 },
        //     { month: "August", count: 300 },
        //     { month: "September", count: 330 },
        //     { month: "October", count: 360 },
        //     { month: "November", count: 390 },
        //     { month: "December", count: 420 },
        //   ],
        //   total_customers: 420,
        //   monthly_breakdown: [
        //     { month: "January", count: 100 }, // Assuming this is initial base or new customers
        //     { month: "February", count: 20 },
        //     { month: "March", count: 30 },
        //     { month: "April", count: 30 },
        //     { month: "May", count: 30 },
        //     { month: "June", count: 30 },
        //     { month: "July", count: 30 },
        //     { month: "August", count: 30 },
        //     { month: "September", count: 30 },
        //     { month: "October", count: 30 },
        //     { month: "November", count: 30 },
        //     { month: "December", count: 30 },
        //   ],
        //   age_breakdown: [
        //     { group: "18-25", count: 80, percentage: "19.05%" },
        //     { group: "26-35", count: 150, percentage: "35.71%" },
        //     { group: "36-45", count: 100, percentage: "23.81%" },
        //     { group: "46-55", count: 60, percentage: "14.29%" },
        //     { group: "56-65", count: 20, percentage: "4.76%" },
        //     { group: "66+", count: 10, percentage: "2.38%" },
        //   ],
        // }

        // Adjust simulated data based on selectedYear for a more realistic feel
        // if (selectedYear === "2024") {
        //   simulatedApiResponse.total_customers = 350
        //   simulatedApiResponse.data = simulatedApiResponse.data.map((d) => ({ ...d, count: d.count - 70 }))
        //   simulatedApiResponse.monthly_breakdown = simulatedApiResponse.monthly_breakdown.map((d) => ({
        //     ...d,
        //     count: Math.max(10, d.count - 5),
        //   }))
        //   simulatedApiResponse.age_breakdown = [
        //     { group: "18-25", count: 70, percentage: "20.00%" },
        //     { group: "26-35", count: 120, percentage: "34.29%" },
        //     { group: "36-45", count: 90, percentage: "25.71%" },
        //     { group: "46-55", count: 50, percentage: "14.29%" },
        //     { group: "56-65", count: 15, percentage: "4.29%" },
        //     { group: "66+", count: 5, percentage: "1.43%" },
        //   ]
        // } else if (selectedYear === "2023") {
        //   simulatedApiResponse.total_customers = 280
        //   simulatedApiResponse.data = simulatedApiResponse.data.map((d) => ({ ...d, count: d.count - 140 }))
        //   simulatedApiResponse.monthly_breakdown = simulatedApiResponse.monthly_breakdown.map((d) => ({
        //     ...d,
        //     count: Math.max(5, d.count - 10),
        //   }))
        //   simulatedApiResponse.age_breakdown = [
        //     { group: "18-25", count: 60, percentage: "21.43%" },
        //     { group: "26-35", count: 100, percentage: "35.71%" },
        //     { group: "36-45", count: 70, percentage: "25.00%" },
        //     { group: "46-55", count: 40, percentage: "14.29%" },
        //     { group: "56-65", count: 8, percentage: "2.86%" },
        //     { group: "66+", count: 2, percentage: "0.71%" },
        //   ]
        // }

        // setChartData(simulatedApiResponse.data)
        // setTotalCustomers(simulatedApiResponse.total_customers)
        // setMonthlyBreakdown(simulatedApiResponse.monthly_breakdown)
        // setCustomerDemographics(simulatedApiResponse.age_breakdown)
      } catch (err) {
        console.error("Failed to fetch customer data:", err)
        setError("---")
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [selectedYear])

  // Calculate average new customers from monthly breakdown
  const averageNewCustomers =
    monthlyBreakdown.length > 0
      ? (monthlyBreakdown.reduce((sum, d) => sum + d.count, 0) / monthlyBreakdown.length).toFixed(0)
      : "N/A"

  // Calculate overall growth from the cumulative chart data
  const overallGrowth =
    chartData.length > 1
      ? `${(((chartData[chartData.length - 1].count - chartData[0].count) / chartData[0].count) * 100).toFixed(1)}%`
      : "N/A"

  // Generate dynamic colors for age demographics for ChartContainer config
  const ageDemographicsConfig = customerDemographics.reduce<Record<string, { label: string; color: string }>>((acc, item, index) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"] // Example palette
    const sanitizedKey = item.group.replace(/[^a-zA-Z0-9]/g, "_") // Sanitize group name for config key
    acc[sanitizedKey] = {
      label: item.group,
      color: colors[index % colors.length],
    }
    return acc
  }, {})

  return (
    <div className="min-h-screen rounded-2xl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Customer Analytics
            </h1>
            <p className="text-slate-600 text-lg">Manage and view customers statistics</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 hover:bg-blue-50 border-blue-200 bg-transparent">
              <Filter className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Customers</CardTitle>
              <Users className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-3xl font-bold animate-pulse">Loading...</div>
              ) : error ? (
                <div className="text-xl text-red-300">{error}</div>
              ) : (
                <div className="text-3xl font-bold">{totalCustomers.toLocaleString()}</div>
              )}
              <p className="text-xs text-blue-200">Active customer base</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-teal-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">New Customers (Monthly Avg)</CardTitle>
              <UserPlus className="h-5 w-5 text-green-200" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-3xl font-bold animate-pulse">Loading...</div>
              ) : error ? (
                <div className="text-xl text-red-300">{error}</div>
              ) : (
                <div className="text-3xl font-bold">{averageNewCustomers}</div>
              )}
              <p className="text-xs text-green-200">Average new customers per month</p>
            </CardContent>
          </Card>


          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Churn Rate (Est.)</CardTitle>
              <Activity className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-3xl font-bold animate-pulse">Loading...</div>
              ) : error ? (
                <div className="text-xl text-red-300">{error}</div>
              ) : (
                <div className="text-3xl font-bold">{"~2.5%"}</div> // Placeholder as API doesn't provide
              )}
              <p className="text-xs text-orange-200">Estimated monthly churn</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="growth" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="demographics" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Demographics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Total Customer Base
                  </CardTitle>
                  <CardDescription>Cumulative customer growth over the year {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center text-slate-500">Loading chart...</div>
                  ) : error ? (
                    <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
                  ) : (
                    <ChartContainer
                      config={{
                        count: { label: "Total Customers", color: "hsl(var(--chart-1))" }, // Using chart-1 color
                      }}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <ChartTooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-4 border rounded-lg shadow-lg">
                                    <p className="font-medium text-slate-800 mb-2">{label}</p>
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full bg-green-500" />
                                      <span className="text-sm text-slate-600">Total Customers:</span>
                                      <span className="font-semibold text-slate-800">{payload[0].value}</span>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="hsl(var(--chart-1))" // Using chart-1 color
                            strokeWidth={2}
                            fill="url(#totalCustomersGradient)"
                          />
                          <defs>
                            <linearGradient id="totalCustomersGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Demographics Pie Chart */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-indigo-500" />
                    Age Demographics
                  </CardTitle>
                  <CardDescription>Customer distribution by age groups for {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center text-slate-500">Loading chart...</div>
                  ) : error ? (
                    <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
                  ) : (
                    <ChartContainer
                      config={ageDemographicsConfig} // Dynamic config based on fetched data
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={customerDemographics}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={100}
                            dataKey="count"
                          >
                            {customerDemographics.map((entry) => (
                              <Cell
                                key={`cell-${entry.group}`}
                                fill={ageDemographicsConfig[entry.group.replace(/[^a-zA-Z0-9]/g, "_")]?.color || "#ccc"}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="bg-white p-3 border rounded-lg shadow-lg">
                                    <p className="font-medium text-slate-800">{data.group} years</p>
                                    <p className="text-indigo-600 font-semibold">{data.count} customers</p>
                                    <p className="text-xs text-slate-500">{data.percentage} of total</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              {/* Demographics Breakdown */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">Demographics Breakdown</CardTitle>
                  <CardDescription>Detailed age group statistics for {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] flex items-center justify-center text-slate-500">Loading data...</div>
                  ) : error ? (
                    <div className="h-[300px] flex items-center justify-center text-red-500">{error}</div>
                  ) : (
                    <div className="space-y-4">
                      {customerDemographics.map((group) => (
                        <div key={group.group} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor:
                                  ageDemographicsConfig[group.group.replace(/[^a-zA-Z0-9]/g, "_")]?.color || "#ccc",
                              }}
                            />
                            <div>
                              <p className="font-medium text-slate-800">{group.group} years</p>
                              <p className="text-xs text-slate-500">{group.percentage} of customers</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-800">{group.count}</p>
                            <p className="text-xs text-slate-500">customers</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
