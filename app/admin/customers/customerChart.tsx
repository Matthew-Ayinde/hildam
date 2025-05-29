"use client"

import { useState } from "react"
import { Users, TrendingUp, UserPlus, Activity, BarChart3, PieChartIcon, Filter } from "lucide-react"
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
} from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Dummy data for customer analytics
const monthlyCustomerData = [
  { month: "Jan", newCustomers: 45, totalCustomers: 245, returning: 32, churn: 8 },
  { month: "Feb", newCustomers: 52, totalCustomers: 289, returning: 41, churn: 6 },
  { month: "Mar", newCustomers: 38, totalCustomers: 321, returning: 38, churn: 12 },
  { month: "Apr", newCustomers: 61, totalCustomers: 370, returning: 45, churn: 9 },
  { month: "May", newCustomers: 55, totalCustomers: 416, returning: 52, churn: 7 },
  { month: "Jun", newCustomers: 67, totalCustomers: 476, returning: 58, churn: 11 },
  { month: "Jul", newCustomers: 72, totalCustomers: 537, returning: 63, churn: 8 },
  { month: "Aug", newCustomers: 58, totalCustomers: 587, returning: 67, churn: 10 },
  { month: "Sep", newCustomers: 64, totalCustomers: 641, returning: 71, churn: 9 },
  { month: "Oct", newCustomers: 69, totalCustomers: 701, returning: 78, churn: 6 },
  { month: "Nov", newCustomers: 75, totalCustomers: 770, returning: 82, churn: 8 },
  { month: "Dec", newCustomers: 81, totalCustomers: 843, returning: 89, churn: 7 },
]

const weeklyCustomerData = [
  { week: "Week 1", newCustomers: 18, totalCustomers: 843, returning: 22 },
  { week: "Week 2", newCustomers: 22, totalCustomers: 865, returning: 25 },
  { week: "Week 3", newCustomers: 19, totalCustomers: 884, returning: 28 },
  { week: "Week 4", newCustomers: 25, totalCustomers: 909, returning: 31 },
]

const customerDemographics = [
  { name: "18-25", value: 156, color: "#3b82f6", percentage: 18.5 },
  { name: "26-35", value: 289, color: "#10b981", percentage: 34.3 },
  { name: "36-45", value: 234, color: "#f59e0b", percentage: 27.8 },
  { name: "46-55", value: 123, color: "#ef4444", percentage: 14.6 },
  { name: "55+", value: 41, color: "#8b5cf6", percentage: 4.8 },
]

const customerRetentionData = [
  { month: "Jan", retention: 85, satisfaction: 4.2 },
  { month: "Feb", retention: 87, satisfaction: 4.3 },
  { month: "Mar", retention: 82, satisfaction: 4.1 },
  { month: "Apr", retention: 89, satisfaction: 4.4 },
  { month: "May", retention: 91, satisfaction: 4.5 },
  { month: "Jun", retention: 88, satisfaction: 4.3 },
  { month: "Jul", retention: 92, satisfaction: 4.6 },
  { month: "Aug", retention: 90, satisfaction: 4.4 },
  { month: "Sep", retention: 93, satisfaction: 4.7 },
  { month: "Oct", retention: 94, satisfaction: 4.8 },
  { month: "Nov", retention: 92, satisfaction: 4.6 },
  { month: "Dec", retention: 95, satisfaction: 4.9 },
]

export default function CustomerAnalyticsChart() {
  const [timeRange, setTimeRange] = useState("monthly")
  const [selectedMetric, setSelectedMetric] = useState("growth")

  const currentData = timeRange === "monthly" ? monthlyCustomerData : weeklyCustomerData
  const latestData = currentData[currentData.length - 1]
  const previousData = currentData[currentData.length - 2]

  const growthRate = previousData
    ? ((latestData.newCustomers - previousData.newCustomers) / previousData.newCustomers) * 100
    : 0

  const totalCustomers = latestData.totalCustomers
  const newCustomersThisPeriod = latestData.newCustomers
  const returningCustomers = latestData.returning

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Customer Analytics
            </h1>
            <p className="text-slate-600 text-lg">Track customer growth, retention, and engagement metrics</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 hover:bg-blue-50 border-blue-200">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Customers</CardTitle>
              <Users className="h-5 w-5 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCustomers.toLocaleString()}</div>
              <p className="text-xs text-blue-200">Active customer base</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">New Customers</CardTitle>
              <UserPlus className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{newCustomersThisPeriod}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-600 font-medium">+{growthRate.toFixed(1)}%</span>
                <span className="text-slate-500">vs last {timeRange.slice(0, -2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Returning Customers</CardTitle>
              <Activity className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{returningCustomers}</div>
              <p className="text-xs text-slate-500">Repeat customers this {timeRange.slice(0, -2)}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Retention Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {customerRetentionData[customerRetentionData.length - 1].retention}%
              </div>
              <p className="text-xs text-slate-500">Customer retention rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="growth" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="growth" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="retention" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Retention
            </TabsTrigger>
            <TabsTrigger value="demographics" className="gap-2">
              <PieChartIcon className="h-4 w-4" />
              Demographics
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Growth Line Chart */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Customer Growth Trend
                  </CardTitle>
                  <CardDescription>New customers acquired over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      newCustomers: { label: "New Customers", color: "#3b82f6" },
                      totalCustomers: { label: "Total Customers", color: "#10b981" },
                    }}
                    className="h-[300px]"
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
                          dataKey="newCustomers"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Total Customers Area Chart */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    Total Customer Base
                  </CardTitle>
                  <CardDescription>Cumulative customer growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      totalCustomers: { label: "Total Customers", color: "#10b981" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={currentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey={timeRange === "monthly" ? "month" : "week"} stroke="#64748b" fontSize={12} />
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
                          dataKey="totalCustomers"
                          stroke="#10b981"
                          strokeWidth={2}
                          fill="url(#totalCustomersGradient)"
                        />
                        <defs>
                          <linearGradient id="totalCustomersGradient" x1="0" y1="0" x2="0" y2="1">
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

          <TabsContent value="retention" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Customer Retention & Satisfaction
                </CardTitle>
                <CardDescription>Monthly retention rates and satisfaction scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    retention: { label: "Retention Rate (%)", color: "#8b5cf6" },
                    satisfaction: { label: "Satisfaction Score", color: "#f59e0b" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customerRetentionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
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
                                    <span className="font-semibold text-slate-800">
                                      {entry.dataKey === "retention" ? `${entry.value}%` : entry.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="retention"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                        name="Retention Rate (%)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        name="Satisfaction Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
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
                  <CardDescription>Customer distribution by age groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={Object.fromEntries(
                      customerDemographics.map((item) => [
                        item.name.replace("-", "_").replace("+", "_plus"),
                        { label: item.name, color: item.color },
                      ]),
                    )}
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
                          dataKey="value"
                        >
                          {customerDemographics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-white p-3 border rounded-lg shadow-lg">
                                  <p className="font-medium text-slate-800">{data.name} years</p>
                                  <p className="text-indigo-600 font-semibold">{data.value} customers</p>
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

              {/* Demographics Breakdown */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">Demographics Breakdown</CardTitle>
                  <CardDescription>Detailed age group statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerDemographics.map((group) => (
                      <div key={group.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: group.color }} />
                          <div>
                            <p className="font-medium text-slate-800">{group.name} years</p>
                            <p className="text-xs text-slate-500">{group.percentage}% of customers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">{group.value}</p>
                          <p className="text-xs text-slate-500">customers</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Customer Activity Overview
                </CardTitle>
                <CardDescription>New vs returning customers comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    newCustomers: { label: "New Customers", color: "#3b82f6" },
                    returning: { label: "Returning Customers", color: "#10b981" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData}>
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
                      <Bar dataKey="newCustomers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="returning" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
