"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FaArrowUp, FaArrowDown, FaDollarSign, FaChartLine } from "react-icons/fa"
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5"
import { CalendarDays, TrendingUp, CalendarIcon } from "lucide-react"
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns"

// Extended data with actual dates
const allData = [
  // 2022 data
  { date: new Date(2025, 0, 15), income: 45000, expenses: 32000, profit: 13000 },
  { date: new Date(2025, 1, 15), income: 52000, expenses: 35000, profit: 17000 },
  { date: new Date(2025, 2, 15), income: 48000, expenses: 38000, profit: 10000 },
  { date: new Date(2025, 3, 15), income: 61000, expenses: 42000, profit: 19000 },
  { date: new Date(2025, 4, 15), income: 58000, expenses: 39000, profit: 19000 },
  { date: new Date(2025, 5, 15), income: 67000, expenses: 45000, profit: 22000 },
  { date: new Date(2025, 6, 15), income: 72000, expenses: 48000, profit: 24000 },
  { date: new Date(2025, 7, 15), income: 69000, expenses: 46000, profit: 23000 },
  { date: new Date(2025, 8, 15), income: 75000, expenses: 52000, profit: 23000 },
  { date: new Date(2025, 9, 15), income: 78000, expenses: 54000, profit: 24000 },
  { date: new Date(2025, 10, 15), income: 82000, expenses: 58000, profit: 24000 },
  { date: new Date(2025, 11, 15), income: 85000, expenses: 61000, profit: 24000 },

  // 2023 data
  { date: new Date(2023, 0, 15), income: 48000, expenses: 34000, profit: 14000 },
  { date: new Date(2023, 1, 15), income: 55000, expenses: 37000, profit: 18000 },
  { date: new Date(2023, 2, 15), income: 51000, expenses: 40000, profit: 11000 },
  { date: new Date(2023, 3, 15), income: 64000, expenses: 44000, profit: 20000 },
  { date: new Date(2023, 4, 15), income: 61000, expenses: 41000, profit: 20000 },
  { date: new Date(2023, 5, 15), income: 70000, expenses: 47000, profit: 23000 },
  { date: new Date(2023, 6, 15), income: 75000, expenses: 50000, profit: 25000 },
  { date: new Date(2023, 7, 15), income: 72000, expenses: 48000, profit: 24000 },
  { date: new Date(2023, 8, 15), income: 78000, expenses: 54000, profit: 24000 },
  { date: new Date(2023, 9, 15), income: 81000, expenses: 56000, profit: 25000 },
  { date: new Date(2023, 10, 15), income: 85000, expenses: 60000, profit: 25000 },
  { date: new Date(2023, 11, 15), income: 88000, expenses: 63000, profit: 25000 },

  // 2024 data (weekly data for current month)
  { date: new Date(2024, 11, 1), income: 18500, expenses: 13200, profit: 5300 },
  { date: new Date(2024, 11, 8), income: 21200, expenses: 14800, profit: 6400 },
  { date: new Date(2024, 11, 15), income: 19800, expenses: 15600, profit: 4200 },
  { date: new Date(2024, 11, 22), income: 22100, expenses: 16800, profit: 5300 },
  { date: new Date(2024, 11, 29), income: 20500, expenses: 15200, profit: 5300 },
]

type FilterType = "year" | "month" | "week"

export default function IncomeExpenseChart() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const getFilteredData = () => {
    let startDate: Date
    let endDate: Date

    switch (activeFilter) {
      case "year":
        startDate = startOfYear(selectedDate)
        endDate = endOfYear(selectedDate)
        break
      case "month":
        startDate = startOfMonth(selectedDate)
        endDate = endOfMonth(selectedDate)
        break
      case "week":
        startDate = startOfWeek(selectedDate, { weekStartsOn: 1 })
        endDate = endOfWeek(selectedDate, { weekStartsOn: 1 })
        break
      default:
        startDate = startOfMonth(selectedDate)
        endDate = endOfMonth(selectedDate)
    }

    const filteredData = allData.filter((item) => isWithinInterval(item.date, { start: startDate, end: endDate }))

    return filteredData.map((item) => ({
      ...item,
      period:
        activeFilter === "year"
          ? format(item.date, "MMM yyyy")
          : activeFilter === "month"
            ? format(item.date, "MMM dd")
            : format(item.date, "MMM dd"),
    }))
  }

  const currentData = getFilteredData()

  // Calculate totals and averages based on current filter
  const totalIncome = currentData.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = currentData.reduce((sum, item) => sum + item.expenses, 0)
  const totalProfit = totalIncome - totalExpenses
  const profitMargin = totalIncome > 0 ? ((totalProfit / totalIncome) * 100).toFixed(1) : "0"

  // Growth calculations
  const incomeGrowth =
    currentData.length > 1
      ? (((currentData[currentData.length - 1].income - currentData[0].income) / currentData[0].income) * 100).toFixed(
          1,
        )
      : "0"

  const expenseGrowth =
    currentData.length > 1
      ? (
          ((currentData[currentData.length - 1].expenses - currentData[0].expenses) / currentData[0].expenses) *
          100
        ).toFixed(1)
      : "0"

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getFilterLabel = () => {
    switch (activeFilter) {
      case "year":
        return `Year ${format(selectedDate, "yyyy")}`
      case "week":
        return `Week of ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "MMM dd, yyyy")}`
      default:
        return `${format(selectedDate, "MMMM yyyy")}`
    }
  }

  const getDateRangeText = () => {
    switch (activeFilter) {
      case "year":
        return format(selectedDate, "yyyy")
      case "month":
        return format(selectedDate, "MMM yyyy")
      case "week":
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
        return `${format(weekStart, "MMM dd")} - ${format(weekEnd, "MMM dd, yyyy")}`
      default:
        return format(selectedDate, "MMM yyyy")
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-medium" style={{ color: entry.color }}>
                {entry.name}: {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
          {payload.length > 1 && (
            <div className="border-t pt-2 mt-2">
              <span className="text-sm text-gray-600">
                Profit Margin: {(((payload[0].value - payload[1].value) / payload[0].value) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full min-h-screen p-6">
      {/* Header with Filters */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Overview</h1>
            <p className="text-gray-600">Track your income vs expenses relationship over time</p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Period Type Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View by:</span>
              <div className="flex gap-2">
                {(["year", "month", "week"] as FilterType[]).map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter)}
                    className={`capitalize ${
                      activeFilter === filter ? "bg-orange-500 hover:bg-orange-600 text-white" : "hover:bg-orange-50"
                    }`}
                  >
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {getDateRangeText()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      setIsCalendarOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filter Indicator */}
        <div className="mt-4">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <TrendingUp className="w-3 h-3 mr-1" />
            {getFilterLabel()} • {currentData.length} periods
          </Badge>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalIncome)}</p>
              <div className="flex items-center mt-2">
                {Number.parseFloat(incomeGrowth) >= 0 ? (
                  <IoTrendingUp className="text-green-500 mr-1" size={16} />
                ) : (
                  <IoTrendingDown className="text-red-500 mr-1" size={16} />
                )}
                <span
                  className={`text-sm font-medium ${Number.parseFloat(incomeGrowth) >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {incomeGrowth}%
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-400 to-green-500 rounded-xl">
              <FaArrowUp className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
              <div className="flex items-center mt-2">
                {Number.parseFloat(expenseGrowth) >= 0 ? (
                  <IoTrendingUp className="text-red-500 mr-1" size={16} />
                ) : (
                  <IoTrendingDown className="text-green-500 mr-1" size={16} />
                )}
                <span
                  className={`text-sm font-medium ${Number.parseFloat(expenseGrowth) >= 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {expenseGrowth}%
                </span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-red-400 to-red-500 rounded-xl">
              <FaArrowDown className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Net Profit</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(totalProfit)}</p>
              <div className="flex items-center mt-2">
                <span className="text-orange-600 text-sm font-medium">{profitMargin}% margin</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl">
              <FaDollarSign className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={itemVariants} className="w-full mb-8">
        <Card className="shadow-xl border border-orange-100 w-full">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Income vs Expenses Trend
            </CardTitle>
            <CardDescription>{getFilterLabel()} - Track performance over time</CardDescription>
          </CardHeader>
          <CardContent className="p-6 w-full">
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "hsl(142, 76%, 36%)",
                },
                expenses: {
                  label: "Expenses",
                  color: "hsl(0, 84%, 60%)",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="var(--color-income)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-income)", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "var(--color-income)", strokeWidth: 3 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="var(--color-expenses)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-expenses)", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: "var(--color-expenses)", strokeWidth: 3 }}
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div variants={itemVariants} className="w-full">
        <Card className="shadow-xl border border-orange-100 w-full">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaChartLine className="text-orange-500" />
              {getFilterLabel()} Breakdown
            </CardTitle>
            <CardDescription>Detailed view of income, expenses, and profit for {getFilterLabel()}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 w-full">
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "hsl(142, 76%, 36%)",
                },
                expenses: {
                  label: "Expenses",
                  color: "hsl(0, 84%, 60%)",
                },
                profit: {
                  label: "Profit",
                  color: "hsl(25, 95%, 53%)",
                },
              }}
              className="h-[400px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
                  <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} name="Expenses" />
                  <Bar dataKey="profit" fill="var(--color-profit)" radius={[4, 4, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
