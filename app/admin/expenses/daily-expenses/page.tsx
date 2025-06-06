"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  TrendingUp,
  DollarSign,
  Download,
  Search,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChartIcon,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Budget categories
const budgetCategories = [
  { value: "materials", label: "Raw Materials", color: "#f97316", icon: "🧵" },
  { value: "equipment", label: "Equipment & Tools", color: "#3b82f6", icon: "🔧" },
  { value: "utilities", label: "Utilities", color: "#10b981", icon: "⚡" },
  { value: "labor", label: "Labor & Wages", color: "#8b5cf6", icon: "👥" },
  { value: "supplies", label: "Office Supplies", color: "#f59e0b", icon: "📦" },
  { value: "maintenance", label: "Maintenance", color: "#ef4444", icon: "🔨" },
  { value: "marketing", label: "Marketing", color: "#ec4899", icon: "📢" },
  { value: "transport", label: "Transportation", color: "#06b6d4", icon: "🚗" },
  { value: "other", label: "Other", color: "#6b7280", icon: "📋" },
]

// Sample budget periods
const initialBudgets = [
  {
    id: 1,
    period: "weekly",
    startDate: "2024-01-22",
    endDate: "2024-01-28",
    totalBudget: 150000,
    name: "Week 4 - January 2024",
  },
  {
    id: 2,
    period: "monthly",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    totalBudget: 500000,
    name: "January 2024",
  },
]

// Sample expenses
const initialExpenses = [
  {
    id: 1,
    budgetId: 1,
    date: "2024-01-24",
    category: "materials",
    amount: 25000.0,
    description: "Silk fabric for premium orders",
    supplier: "Premium Fabrics Ltd",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 2,
    budgetId: 1,
    date: "2024-01-24",
    category: "supplies",
    amount: 4500.0,
    description: "Threads and notions",
    supplier: "Craft Supplies",
    paymentMethod: "Cash",
  },
  {
    id: 3,
    budgetId: 1,
    date: "2024-01-25",
    category: "utilities",
    amount: 8000.0,
    description: "Electricity bill",
    supplier: "Power Company",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    budgetId: 1,
    date: "2024-01-26",
    category: "labor",
    amount: 15000.0,
    description: "Weekly wages for assistants",
    supplier: "Staff Payroll",
    paymentMethod: "Cash",
  },
  {
    id: 5,
    budgetId: 2,
    date: "2024-01-15",
    category: "materials",
    amount: 45000.0,
    description: "Bulk fabric purchase",
    supplier: "Wholesale Fabrics",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 6,
    budgetId: 2,
    date: "2024-01-20",
    category: "equipment",
    amount: 35000.0,
    description: "New sewing machine maintenance",
    supplier: "Equipment Services",
    paymentMethod: "Card",
  },
]

export default function OperationalBudgetTracker() {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [selectedBudgetId, setSelectedBudgetId] = useState(1)
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false)
  const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: "",
    description: "",
    supplier: "",
    paymentMethod: "",
  })

  const [newBudget, setNewBudget] = useState({
    period: "weekly",
    startDate: "",
    endDate: "",
    totalBudget: "",
    name: "",
  })

  const selectedBudget = budgets.find((b) => b.id === selectedBudgetId)
  const budgetExpenses = expenses.filter((expense) => expense.budgetId === selectedBudgetId)

  // Filter expenses
  const filteredExpenses = budgetExpenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Calculate budget analytics
  const budgetAnalytics = useMemo(() => {
    if (!selectedBudget) return null

    const totalSpent = budgetExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const remaining = selectedBudget.totalBudget - totalSpent
    const spentPercentage = (totalSpent / selectedBudget.totalBudget) * 100

    // Category breakdown
    const categoryBreakdown = budgetCategories
      .map((category) => {
        const categoryExpenses = budgetExpenses.filter((expense) => expense.category === category.value)
        const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        const categoryPercentage =
          selectedBudget.totalBudget > 0 ? (categoryTotal / selectedBudget.totalBudget) * 100 : 0

        return {
          ...category,
          spent: categoryTotal,
          percentage: categoryPercentage,
          count: categoryExpenses.length,
        }
      })
      .filter((category) => category.spent > 0)

    // Daily spending trend (for charts)
    const dailySpending = budgetExpenses.reduce(
      (acc, expense) => {
        const date = expense.date
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    const trendData = Object.entries(dailySpending)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("en-NG", { month: "short", day: "numeric" }),
        amount,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return {
      totalBudget: selectedBudget.totalBudget,
      totalSpent,
      remaining,
      spentPercentage,
      categoryBreakdown,
      trendData,
      status: spentPercentage > 90 ? "critical" : spentPercentage > 75 ? "warning" : "good",
    }
  }, [selectedBudget, budgetExpenses])

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.description) {
      const expense = {
        id: expenses.length + 1,
        budgetId: selectedBudgetId,
        ...newExpense,
        amount: Number.parseFloat(newExpense.amount),
      }
      setExpenses([expense, ...expenses])
      setNewExpense({
        date: new Date().toISOString().split("T")[0],
        category: "",
        amount: "",
        description: "",
        supplier: "",
        paymentMethod: "",
      })
      setIsAddExpenseDialogOpen(false)
    }
  }

  const handleAddBudget = () => {
    if (newBudget.period && newBudget.startDate && newBudget.endDate && newBudget.totalBudget && newBudget.name) {
      const budget = {
        id: budgets.length + 1,
        ...newBudget,
        totalBudget: Number.parseFloat(newBudget.totalBudget),
      }
      setBudgets([...budgets, budget])
      setNewBudget({
        period: "weekly",
        startDate: "",
        endDate: "",
        totalBudget: "",
        name: "",
      })
      setIsAddBudgetDialogOpen(false)
      setSelectedBudgetId(budget.id)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getCategoryInfo = (categoryValue: string) => {
    return budgetCategories.find((cat) => cat.value === categoryValue) || budgetCategories[budgetCategories.length - 1]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              Operational Budget Tracker
            </h1>
            <p className="text-slate-600 text-lg">Manage your business operational budgets and expenses</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 hover:bg-blue-50 border-blue-200">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Dialog open={isAddBudgetDialogOpen} onOpenChange={setIsAddBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-indigo-50 border-indigo-200">
                  <Target className="h-4 w-4" />
                  New Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">Create New Budget Period</DialogTitle>
                  <DialogDescription>Set up a new weekly or monthly operational budget</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="budget-name" className="text-sm font-medium">
                      Budget Name
                    </Label>
                    <Input
                      id="budget-name"
                      placeholder="e.g., February 2024 or Week 5"
                      value={newBudget.name}
                      onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="period" className="text-sm font-medium">
                      Budget Period
                    </Label>
                    <Select
                      value={newBudget.period}
                      onValueChange={(value) => setNewBudget({ ...newBudget, period: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date" className="text-sm font-medium">
                        Start Date
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newBudget.startDate}
                        onChange={(e) => setNewBudget({ ...newBudget, startDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date" className="text-sm font-medium">
                        End Date
                      </Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newBudget.endDate}
                        onChange={(e) => setNewBudget({ ...newBudget, endDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="total-budget" className="text-sm font-medium">
                      Total Budget Amount (₦)
                    </Label>
                    <Input
                      id="total-budget"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newBudget.totalBudget}
                      onChange={(e) => setNewBudget({ ...newBudget, totalBudget: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={handleAddBudget}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Create Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddExpenseDialogOpen} onOpenChange={setIsAddExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 gap-2 shadow-lg">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add New Expense</DialogTitle>
                  <DialogDescription>Record a new operational expense</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expense-date" className="text-sm font-medium">
                        Date
                      </Label>
                      <Input
                        id="expense-date"
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expense-amount" className="text-sm font-medium">
                        Amount (₦)
                      </Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expense-category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expense-description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="expense-description"
                      placeholder="Describe the expense..."
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="mt-1 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expense-supplier" className="text-sm font-medium">
                        Supplier/Vendor
                      </Label>
                      <Input
                        id="expense-supplier"
                        placeholder="Supplier name"
                        value={newExpense.supplier}
                        onChange={(e) => setNewExpense({ ...newExpense, supplier: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expense-payment" className="text-sm font-medium">
                        Payment Method
                      </Label>
                      <Select
                        value={newExpense.paymentMethod}
                        onValueChange={(value) => setNewExpense({ ...newExpense, paymentMethod: value })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Check">Check</SelectItem>
                          <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddExpense}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Budget Selection */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-6 w-6 text-blue-500" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Current Budget Period</h2>
                  <p className="text-slate-600">Select a budget period to manage</p>
                </div>
              </div>
              <Select value={selectedBudgetId.toString()} onValueChange={(value) => setSelectedBudgetId(Number(value))}>
                <SelectTrigger className="w-full lg:w-80 border-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select budget period" />
                </SelectTrigger>
                <SelectContent>
                  {budgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{budget.name}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(budget.startDate).toLocaleDateString()} -{" "}
                          {new Date(budget.endDate).toLocaleDateString()} • {formatCurrency(budget.totalBudget)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        {budgetAnalytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-300 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Total Budget</CardTitle>
                  <Target className="h-5 w-5 text-blue-200" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatCurrency(budgetAnalytics.totalBudget)}</div>
                  <p className="text-xs text-blue-200">{selectedBudget?.period} budget</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Spent</CardTitle>
                  <DollarSign className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{formatCurrency(budgetAnalytics.totalSpent)}</div>
                  <p className="text-xs text-slate-500">{budgetAnalytics.spentPercentage.toFixed(1)}% of budget</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Remaining</CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(budgetAnalytics.remaining)}</div>
                  <p className="text-xs text-slate-500">
                    {(100 - budgetAnalytics.spentPercentage).toFixed(1)}% remaining
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-0 shadow-lg ${getStatusColor(budgetAnalytics.status)}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
                  {getStatusIcon(budgetAnalytics.status)}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold capitalize">{budgetAnalytics.status}</div>
                  <Progress value={budgetAnalytics.spentPercentage} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="categories" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-96">
                <TabsTrigger value="categories" className="gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="trends" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Spending Trends
                </TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-800">Expense Distribution</CardTitle>
                      <CardDescription>Breakdown by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {budgetAnalytics.categoryBreakdown.length > 0 ? (
                        <ChartContainer
                          config={Object.fromEntries(
                            budgetCategories.map((cat) => [cat.value, { label: cat.label, color: cat.color }]),
                          )}
                          className="h-[300px]"
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={budgetAnalytics.categoryBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={100}
                                dataKey="spent"
                              >
                                {budgetAnalytics.categoryBreakdown.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <ChartTooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                                        <p className="font-medium text-slate-800 flex items-center gap-2">
                                          <span>{data.icon}</span>
                                          {data.label}
                                        </p>
                                        <p className="text-blue-600 font-semibold">{formatCurrency(data.spent)}</p>
                                        <p className="text-xs text-slate-500">
                                          {data.percentage.toFixed(1)}% of budget • {data.count} transactions
                                        </p>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                              <Legend
                                content={({ payload }) => (
                                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    {payload?.map((entry, index) => (
                                      <div key={index} className="flex items-center gap-1 text-xs">
                                        <div
                                          className="w-3 h-3 rounded-full"
                                          style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-slate-600">{entry.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-500">
                          No expenses recorded yet
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Category Breakdown */}
                  <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-800">Category Details</CardTitle>
                      <CardDescription>Spending by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {budgetAnalytics.categoryBreakdown.map((category) => (
                          <div
                            key={category.value}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{category.icon}</span>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{category.label}</p>
                                <p className="text-xs text-slate-500">{category.count} transactions</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-slate-800">{formatCurrency(category.spent)}</p>
                              <p className="text-xs text-slate-500">{category.percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800">Daily Spending Trend</CardTitle>
                    <CardDescription>Track your daily expenses over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {budgetAnalytics.trendData.length > 0 ? (
                      <ChartContainer
                        config={{
                          amount: { label: "Amount", color: "#3b82f6" },
                        }}
                        className="h-[400px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={budgetAnalytics.trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                            <ChartTooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                                      <p className="font-medium text-slate-800">{label}</p>
                                      <p className="text-blue-600 font-semibold">
                                        {formatCurrency(payload[0].value as number)}
                                      </p>
                                    </div>
                                  )
                                }
                                return null
                              }}
                            />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    ) : (
                      <div className="h-[400px] flex items-center justify-center text-slate-500">
                        No spending data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Expense List */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-slate-800">Expense Records</CardTitle>
                <CardDescription className="text-slate-600">All expenses for {selectedBudget?.name}</CardDescription>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40 border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {budgetCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="rounded-lg border border-blue-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50/50">
                      <TableHead className="font-semibold text-slate-700">Date</TableHead>
                      <TableHead className="font-semibold text-slate-700">Category</TableHead>
                      <TableHead className="font-semibold text-slate-700">Description</TableHead>
                      <TableHead className="font-semibold text-slate-700">Supplier</TableHead>
                      <TableHead className="font-semibold text-slate-700">Payment</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => {
                      const categoryInfo = getCategoryInfo(expense.category)
                      return (
                        <TableRow key={expense.id} className="hover:bg-blue-50/30 transition-colors">
                          <TableCell className="font-medium text-slate-800">
                            {new Date(expense.date).toLocaleDateString("en-NG", {
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              style={{
                                backgroundColor: categoryInfo.color + "20",
                                color: categoryInfo.color,
                                border: `1px solid ${categoryInfo.color}40`,
                              }}
                              className="border-0 gap-1"
                            >
                              <span>{categoryInfo.icon}</span>
                              {categoryInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-700 max-w-xs truncate">{expense.description}</TableCell>
                          <TableCell className="text-slate-700">{expense.supplier}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-200 text-slate-600">
                              {expense.paymentMethod}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-slate-800">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">No expenses found</p>
                <p className="text-sm">Try adjusting your filters or add a new expense</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
