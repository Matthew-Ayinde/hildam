"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, UserPlus, Activity, BarChart3, PieChartIcon, Filter, Download, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { fetchCustomerChart, exportCustomerData } from "@/app/api/apiClient" // Import exportCustomerData
import ImportCustomerDataModal from "./ImportModal" // Import the new modal component

// Define types for API response
export interface MonthlyCustomerData {
  month: string
  count: number
}

export interface AgeBreakdown {
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

// Define the schema for the CSV headers based on your provided schema
const csvSchema = [
  { name: "name", type: "string" },
  { name: "email", type: "string" },
  { name: "phone_number", type: "string" },
  { name: "gender", type: "string" },
  { name: "address", type: "string" },
  { name: "age", type: "number" },
  { name: "customer_description", type: "string" },
  { name: "bust", type: "string" },
  { name: "waist", type: "string" },
  { name: "hip", type: "string" },
  { name: "shoulder", type: "string" },
  { name: "bustpoint", type: "string" },
  { name: "shoulder_to_underbust", type: "string" },
  { name: "round_under_bust", type: "string" },
  { name: "half_length", type: "string" },
  { name: "blouse_length", type: "string" },
  { name: "sleeve_length", type: "string" },
  { name: "round_sleeve", type: "string" },
  { name: "dress_length", type: "string" },
  { name: "chest", type: "string" },
  { name: "round_shoulder", type: "string" },
  { name: "skirt_length", type: "string" },
  { name: "trousers_length", type: "string" },
  { name: "round_thigh", type: "string" },
  { name: "round_knee", type: "string" },
  { name: "round_feet", type: "string" },
]

// Extract headers from the schema
const headers = csvSchema.map((field) => field.name)

// Based on your sample data, each full record has 29 fields (ID + 26 data fields + 2 timestamps)
const FIELDS_PER_RECORD = 29
// The data fields we want start at index 1 (skipping the ID)
const START_INDEX = 1
// The data fields we want end at index 26 (inclusive), which is START_INDEX + headers.length
const END_INDEX = START_INDEX + headers.length

/**
 * Escapes a field for CSV format.
 * Encloses the field in double quotes if it contains commas, double quotes, or newlines.
 * Doubles any existing double quotes within the field.
 */
function escapeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) {
    return ""
  }
  let stringField = String(field)
  // Check if the field contains a comma, double quote, or newline
  if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
    // Escape double quotes by doubling them
    stringField = stringField.replace(/"/g, '""')
    // Enclose the field in double quotes
    return `"${stringField}"`
  }
  return stringField
}

export default function CustomerAnalyticsChart() {
  const [selectedYear, setSelectedYear] = useState("2025")
  const [chartData, setChartData] = useState<MonthlyCustomerData[]>([]) // For total customer base chart
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<MonthlyCustomerData[]>([]) // For new customers calculation
  const [customerDemographics, setCustomerDemographics] = useState<AgeBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false) // State for modal visibility

  const years = ["2023", "2024", "2025"] // Example years for the dropdown

  const fetchCustomerData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result: ApiResponse = await fetchCustomerChart(selectedYear)
      setChartData(result.data)
      setTotalCustomers(result.total_customers)
      setMonthlyBreakdown(result.monthly_breakdown)
      setCustomerDemographics(result.age_breakdown)
    } catch (err) {
      console.error("Failed to fetch customer data:", err)
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [selectedYear])

  useEffect(() => {
    fetchCustomerData()
  }, [fetchCustomerData])

  const handleImportButtonClick = () => {
    setIsImportModalOpen(true)
  }

  const handleImportSuccess = () => {
    setIsImportModalOpen(false) // Close the modal
    fetchCustomerData() // Re-fetch data to update charts
  }

  const handleExportData = async () => {
    try {
      // Fetch the raw CSV string from the API
      const apiResponse = await exportCustomerData()

      // Regex to extract all double-quoted fields
      const regex = /"((?:[^"\\]|\\.)*)"/g
      let match
      const allFields: string[] = []
      while ((match = regex.exec(apiResponse)) !== null) {
        allFields.push(match[1])
      }

      if (allFields.length === 0) {
        alert("No data found in the provided API response for CSV conversion.")
        return
      }

      // Validate that the total number of fields is a multiple of FIELDS_PER_RECORD
      if (allFields.length % FIELDS_PER_RECORD !== 0) {
        alert(
          `The number of fields (${allFields.length}) is not a multiple of ${FIELDS_PER_RECORD} per record. Please check your API response format.`,
        )
        return
      }

      const records: (string | number)[][] = []
      // Iterate through all extracted fields, stepping by FIELDS_PER_RECORD to get each record
      for (let i = 0; i < allFields.length; i += FIELDS_PER_RECORD) {
        // Extract only the relevant data fields (skipping ID and timestamps)
        const recordFields = allFields.slice(i + START_INDEX, i + END_INDEX)
        records.push(recordFields)
      }

      // Format data into CSV rows
      const csvRows = [
        headers
          .map(escapeCsvField)
          .join(","), // Header row
        ...records.map((row) => row.map(escapeCsvField).join(",")), // Data rows
      ]
      const csvContent = csvRows.join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      // Create a temporary link element to trigger download
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "customer_data.csv") // Set the desired file name
      document.body.appendChild(link) // Append to body to make it clickable
      link.click() // Programmatically click the link to trigger download
      document.body.removeChild(link) // Clean up the temporary link
      URL.revokeObjectURL(url) // Release the object URL
    } catch (err) {
      console.error("Failed to export customer data:", err)
      alert("Failed to export data. Please try again.")
    }
  }

  // Calculate average new customers from monthly breakdown
  const averageNewCustomers =
    monthlyBreakdown.length > 0
      ? (monthlyBreakdown.reduce((sum, d) => sum + d.count, 0) / monthlyBreakdown.length).toFixed(0)
      : "N/A"

  // Generate dynamic colors for age demographics for ChartContainer config
  const ageDemographicsConfig = customerDemographics.reduce<Record<string, { label: string; color: string }>>(
    (acc, item, index) => {
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"] // Example palette
      const sanitizedKey = item.group.replace(/[^a-zA-Z0-9]/g, "_") // Sanitize group name for config key
      acc[sanitizedKey] = {
        label: item.group,
        color: colors[index % colors.length],
      }
      return acc
    },
    {},
  )

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
            <Button
              variant="outline"
              className="gap-2 hover:bg-blue-50 border-blue-200 bg-transparent"
              onClick={handleImportButtonClick}
            >
              <Filter className="h-4 w-4" />
              Import Data
            </Button>
            <Button
              variant="outline"
              className="gap-2 hover:bg-blue-50 border-blue-200 bg-transparent"
              onClick={handleExportData}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            {/* New Refresh Button */}
            <Button
              variant="outline"
              className="gap-2 hover:bg-blue-50 border-blue-200 bg-transparent"
              onClick={() => window.location.reload()} // Call fetchCustomerData directly
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
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
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-500" />
                Churn Rate (Est.)
              </CardTitle>
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
      <ImportCustomerDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  )
}
