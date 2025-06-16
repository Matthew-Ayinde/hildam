"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Line,
  LineChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaArrowUp, FaArrowDown, FaDollarSign, FaChartLine, FaFilter } from "react-icons/fa"
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5"
import { CalendarDays, TrendingUp } from "lucide-react"

// Extended data for different time periods
const yearlyData = [
  { period: "2022", income: 650000, expenses: 480000, profit: 170000 },
  { period: "2023", income: 720000, expenses: 520000, profit: 200000 },
  { period: "2024", income: 780000, expenses: 580000, profit: 200000 },
]

const monthlyData = [
  { period: "Jan", income: 45000, expenses: 32000, profit: 13000 },
  { period: "Feb", income: 52000, expenses: 35000, profit: 17000 },
  { period: "Mar", income: 48000, expenses: 38000, profit: 10000 },
  { period: "Apr", income: 61000, expenses: 42000, profit: 19000 },
  { period: "May", income: 58000, expenses: 39000, profit: 19000 },
  { period: "Jun", income: 67000, expenses: 45000, profit: 22000 },
  { period: "Jul", income: 72000, expenses: 48000, profit: 24000 },
  { period: "Aug", income: 69000, expenses: 46000, profit: 23000 },
  { period: "Sep", income: 75000, expenses: 52000, profit: 23000 },
  { period: "Oct", income: 78000, expenses: 54000, profit: 24000 },
  { period: "Nov", income: 82000, expenses: 58000, profit: 24000 },
  { period: "Dec", income: 85000, expenses: 61000, profit: 24000 },
]

const weeklyData = [
  { period: "Week 1", income: 18500, expenses: 13200, profit: 5300 },
  { period: "Week 2", income: 21200, expenses: 14800, profit: 6400 },
  { period: "Week 3", income: 19800, expenses: 15600, profit: 4200 },
  { period: "Week 4", income: 22100, expenses: 16800, profit: 5300 },
]

type FilterType = "year" | "month" | "week"

export default function IncomeExpenseChart() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("month")

  const getCurrentData = () => {
    switch (activeFilter) {
      case "year":
        return yearlyData
      case "week":
        return weeklyData
      default:
        return monthlyData
    }
  }

  const currentData = getCurrentData()

  // Calculate totals and averages based on current filter
  const totalIncome = currentData.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = currentData.reduce((sum, item) => sum + item.expenses, 0)
  const totalProfit = totalIncome - totalExpenses
  const avgIncome = totalIncome / currentData.length
  const avgExpenses = totalExpenses / currentData.length
  const profitMargin = ((totalProfit / totalIncome) * 100).toFixed(1)

  // Growth calculations
  const incomeGrowth = (
    ((currentData[currentData.length - 1].income - currentData[0].income) / currentData[0].income) *
    100
  ).toFixed(1)
  const expenseGrowth = (
    ((currentData[currentData.length - 1].expenses - currentData[0].expenses) / currentData[0].expenses) *
    100
  ).toFixed(1)

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
        return "Yearly Overview"
      case "week":
        return "Weekly Breakdown"
      default:
        return "Monthly Analysis"
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-h-screen bg-gradient-to-br from-orange-50 to-white p-6"
    >
      {/* Header with Filters */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Overview</h1>
            <p className="text-gray-600">Track your income vs expenses relationship over time</p>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm text-gray-600 mr-2">View by:</span>
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

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Average {activeFilter === "year" ? "Yearly" : activeFilter === "month" ? "Monthly" : "Weekly"}
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{formatCurrency(avgIncome)}</p>
              <div className="flex items-center mt-2">
                <span className="text-gray-600 text-sm">Income per {activeFilter}</span>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl">
              <FaChartLine className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Chart */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-xl border border-orange-100">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Income vs Expenses Trend
            </CardTitle>
            <CardDescription>{getFilterLabel()} - Track performance over time</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
              className="h-[300px]"
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

        <Card className="shadow-xl border border-orange-100">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Profit Analysis
            </CardTitle>
            <CardDescription>{getFilterLabel()} - Profit margins and trends</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer
              config={{
                profit: {
                  label: "Profit",
                  color: "hsl(25, 95%, 53%)",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stroke="var(--color-profit)"
                    strokeWidth={3}
                    fill="var(--color-profit)"
                    fillOpacity={0.3}
                    name="Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-xl border border-orange-100">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaChartLine className="text-orange-500" />
              {getFilterLabel()} Breakdown
            </CardTitle>
            <CardDescription>Detailed view of income, expenses, and profit by {activeFilter}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
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
              className="h-[400px]"
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
