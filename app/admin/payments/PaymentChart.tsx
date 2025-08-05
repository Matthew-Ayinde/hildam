"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FaChartBar, FaChartLine, FaMoneyBillWave, FaPercent, FaBriefcase } from "react-icons/fa" // Added FaBriefcase for job expenses
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

// Assuming this function exists in your project
// For demonstration, I'll provide a mock implementation.
// In a real application, this would fetch data from your backend.
import { fetchPaymentChartInformation } from "@/app/api/apiClient"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const LoadingSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full"
  />
)

interface BreakdownItem {
  period: string
  total_income: number
  total_job_expenses: number
  total_daily_expenses: number
  total_profit: number
  profit_margin: number
}

interface PaymentChartData {
  status: string
  type: string
  period: string
  total_income: number
  total_job_expenses: number
  total_daily_expenses: number
  total_profit: number
  profit_margin: number
  breakdown: BreakdownItem[]
}

export default function PaymentChart() {
  const [chartData, setChartData] = useState<PaymentChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<"year" | "month">("year")
  const [selectedValue, setSelectedValue] = useState<string>(String(new Date().getFullYear()))

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i)) // Last 5 years
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1
    return {
      value: `${currentYear}-${monthNum < 10 ? "0" : ""}${monthNum}`,
      label: new Date(currentYear, i, 1).toLocaleString("en-US", { month: "long" }),
    }
  })

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchPaymentChartInformation(selectedType, selectedValue)
        console.log("Fetched chart data:", data)
        setChartData(data)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unknown error occurred while fetching data.")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchChartData()
  }, [selectedType, selectedValue])

  const chartConfig = {
    income: {
      label: "Income",
      color: "hsl(var(--chart-1))",
    },
    dailyExpenses: {
      label: "Daily Expenses",
      color: "hsl(var(--chart-2))",
    },
    jobExpenses: {
      label: "Job Expenses",
      color: "hsl(var(--chart-3))", // Using chart-3 for the new bar
    },
  }

  const totalExpenses = chartData ? chartData.total_job_expenses + chartData.total_daily_expenses : 0

  return (
    <main className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-6xl mb-8 rounded-2xl shadow-xl border border-orange-100">
        <CardHeader className="flex flex-col items-start gap-2 space-y-0 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white px-6 py-4">
          <CardTitle className="text-2xl font-bold text-gray-800">Financial Overview</CardTitle>
          <CardDescription className="text-gray-600">Visualize your income and expenses over time.</CardDescription>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4">
            <Select value={selectedType} onValueChange={(value: "year" | "month") => setSelectedType(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Yearly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {selectedType === "year" && (
              <Select value={selectedValue} onValueChange={setSelectedValue}>
                <SelectTrigger className="w-[120px]">
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
            )}
            {selectedType === "month" && (
              <Select value={selectedValue} onValueChange={setSelectedValue}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label} {currentYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <LoadingSpinner />
              <p className="text-gray-600 mt-4 font-medium">Loading financial data...</p>
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <p className="text-gray-500 mt-2">Please try selecting a different period or refresh the page.</p>
            </motion.div>
          ) : !chartData || chartData.breakdown.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <div className="text-center">
                <FaChartBar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No financial data available</h3>
                <p className="text-gray-500">Please select a different period or check back later.</p>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 flex items-center justify-between bg-blue-50 border-blue-200 rounded-lg">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Total Income</p>
                    <h4 className="text-2xl font-bold text-blue-800">{formatCurrency(chartData.total_income)}</h4>
                  </div>
                  <FaMoneyBillWave className="text-blue-500 text-3xl" />
                </Card>
                <Card className="p-4 flex items-center justify-between bg-red-50 border-red-200 rounded-lg">
                  <div>
                    <p className="text-sm text-red-700 font-medium">Total Expenses</p>
                    <h4 className="text-2xl font-bold text-red-800">{formatCurrency(totalExpenses)}</h4>
                  </div>
                  <FaMoneyBillWave className="text-red-500 text-3xl" />
                </Card>
                <Card className="p-4 flex items-center justify-between bg-orange-50 border-orange-200 rounded-lg">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Total Job Expenses</p>
                    <h4 className="text-2xl font-bold text-orange-800">
                      {formatCurrency(chartData.total_job_expenses)}
                    </h4>
                  </div>
                  <FaBriefcase className="text-orange-500 text-3xl" />
                </Card>
                <Card className="p-4 flex items-center justify-between bg-green-50 border-green-200 rounded-lg">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Total Profit</p>
                    <h4 className="text-2xl font-bold text-green-800">{formatCurrency(chartData.total_profit)}</h4>
                  </div>
                  <FaChartLine className="text-green-500 text-3xl" />
                </Card>
                <Card className="p-4 flex items-center justify-between bg-purple-50 border-purple-200 rounded-lg">
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Profit Margin</p>
                    <h4 className="text-2xl font-bold text-purple-800">{chartData.profit_margin.toFixed(2)}%</h4>
                  </div>
                  <FaPercent className="text-purple-500 text-3xl" />
                </Card>
              </div>
              <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={chartData.breakdown}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)} // Shorten month names for X-axis
                  />
                  <YAxis
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dashed"
                        formatter={(value) => formatCurrency(typeof value === "number" ? value : Number(value))}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="total_income" fill="var(--color-income)" radius={4} />
                  <Bar dataKey="total_daily_expenses" fill="var(--color-dailyExpenses)" radius={4} />
                  <Bar dataKey="total_job_expenses" fill="var(--color-jobExpenses)" radius={4} />
                </BarChart>
              </ChartContainer>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
