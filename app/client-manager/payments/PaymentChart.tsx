"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { FaBriefcase, FaChartBar, FaChartLine, FaMoneyBillWave, FaPercent } from "react-icons/fa"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { fetchPaymentChartInformation } from "@/app/api/apiClient"

type ChartType = "year" | "month"

interface PaymentSummary {
  tailoring_revenue: number
  sales_revenue: number
  total_revenue: number
  job_expenses: number
  sales_cogs: number
  operational_expenses: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  is_profitable: boolean
  financial_status: string
}

interface BreakdownItem {
  period: string
  tailoring_revenue: number
  sales_revenue: number
  total_revenue: number
  job_expenses: number
  sales_cogs: number
  operational_expenses: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  is_profitable: boolean
}

interface PaymentChartData {
  status: string
  type: ChartType
  period: string
  summary: PaymentSummary
  breakdown: BreakdownItem[]
}

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
    className="h-8 w-8 rounded-full border-4 border-orange-200 border-t-orange-500"
  />
)

const formatXAxisPeriod = (value: string, type: ChartType) => {
  if (type === "month") {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const [, month] = value.split("-")
  if (!month) return value

  const monthIndex = Number(month) - 1
  if (monthIndex < 0 || monthIndex > 11) return value

  return new Date(2026, monthIndex, 1).toLocaleString("en-US", { month: "short" })
}

export default function PaymentChart() {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0")

  const [chartData, setChartData] = useState<PaymentChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedType, setSelectedType] = useState<ChartType>("month")
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)

  const years = Array.from({ length: 10 }, (_, i) => String(currentYear - i))
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1
    return {
      value: String(monthNum).padStart(2, "0"),
      label: new Date(2026, i, 1).toLocaleString("en-US", { month: "long" }),
    }
  })

  const selectedValue = useMemo(() => {
    if (selectedType === "month") {
      return `${selectedYear}-${selectedMonth}`
    }

    return selectedYear
  }, [selectedType, selectedYear, selectedMonth])

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchPaymentChartInformation(selectedType, selectedValue)
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
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-2))",
    },
    profit: {
      label: "Net Profit",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <main className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8">
      <Card className="mb-8 w-full max-w-6xl rounded-2xl border border-orange-100 shadow-xl">
        <CardHeader className="flex flex-col items-start gap-2 space-y-0 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white px-6 py-4">
          <CardTitle className="text-2xl font-bold text-gray-800">Financial Overview</CardTitle>
          <CardDescription className="text-gray-600">Visualize revenue, expenses, and net profit.</CardDescription>

          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Select value={selectedType} onValueChange={(value: ChartType) => setSelectedType(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Yearly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedType === "month" && (
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10">
              <LoadingSpinner />
              <p className="mt-4 font-medium text-gray-600">Loading financial data...</p>
            </motion.div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
              <p className="text-gray-500">Please try another period or refresh the page.</p>
            </motion.div>
          ) : !chartData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10">
              <FaChartBar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-700">No financial data available</h3>
              <p className="text-gray-500">Please select a different period or check back later.</p>
            </motion.div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card className="flex items-center justify-between rounded-lg border-blue-200 bg-blue-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Revenue</p>
                    <h4 className="text-2xl font-bold text-blue-800">{formatCurrency(chartData.summary.total_revenue)}</h4>
                  </div>
                  <FaMoneyBillWave className="text-3xl text-blue-500" />
                </Card>

                <Card className="flex items-center justify-between rounded-lg border-red-200 bg-red-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-red-700">Total Expenses</p>
                    <h4 className="text-2xl font-bold text-red-800">{formatCurrency(chartData.summary.total_expenses)}</h4>
                  </div>
                  <FaMoneyBillWave className="text-3xl text-red-500" />
                </Card>

                <Card className="flex items-center justify-between rounded-lg border-orange-200 bg-orange-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Job Expenses</p>
                    <h4 className="text-2xl font-bold text-orange-800">{formatCurrency(chartData.summary.job_expenses)}</h4>
                  </div>
                  <FaBriefcase className="text-3xl text-orange-500" />
                </Card>

                <Card className="flex items-center justify-between rounded-lg border-green-200 bg-green-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-green-700">Net Profit</p>
                    <h4 className="text-2xl font-bold text-green-800">{formatCurrency(chartData.summary.net_profit)}</h4>
                  </div>
                  <FaChartLine className="text-3xl text-green-500" />
                </Card>

                <Card className="flex items-center justify-between rounded-lg border-purple-200 bg-purple-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Profit Margin</p>
                    <h4 className="text-2xl font-bold text-purple-800">{chartData.summary.profit_margin.toFixed(2)}%</h4>
                  </div>
                  <FaPercent className="text-3xl text-purple-500" />
                </Card>
              </div>

              {chartData.breakdown.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                  No breakdown data available for this period.
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="min-h-[320px] w-full">
                  <BarChart accessibilityLayer data={chartData.breakdown}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => formatXAxisPeriod(value, selectedType)}
                    />
                    <YAxis
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => formatCurrency(Number(value))}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" formatter={(value) => formatCurrency(Number(value))} />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="total_revenue" name="Revenue" fill="var(--color-revenue)" radius={4} />
                    <Bar dataKey="total_expenses" name="Expenses" fill="var(--color-expenses)" radius={4} />
                    <Bar dataKey="net_profit" name="Net Profit" fill="var(--color-profit)" radius={4} />
                  </BarChart>
                </ChartContainer>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
