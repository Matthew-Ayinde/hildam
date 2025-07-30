"use client"

import { useState, useMemo, useEffect } from "react"
import { FaNairaSign } from "react-icons/fa6"
import {
  Plus,
  TrendingUp,
  Search,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  PieChartIcon,
  Loader2,
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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useToast } from "@/hooks/use-toast"
import { createBudget, createOperationalExpense, DeleteExpense, fetchAllBudgets, GetBudgetBreakdown } from "@/app/api/apiClient"

// Updated budget categories to match API
const budgetCategories = [
  { value: "raw_materials", label: "Raw Materials", color: "#f97316", icon: "🧵" },
  { value: "equipment_and_tools", label: "Equipment & Tools", color: "#3b82f6", icon: "🔧" },
  { value: "office_supplies", label: "Office Supplies", color: "#f59e0b", icon: "📦" },
  { value: "maintenance", label: "Maintenance", color: "#ef4444", icon: "🔨" },
  { value: "transportation", label: "Transportation", color: "#06b6d4", icon: "🚗" },
  { value: "welfare", label: "Welfare", color: "#8b5cf6", icon: "👥" },
  { value: "other", label: "Other", color: "#6b7280", icon: "📋" },
]

// Types based on API structure
interface Budget {
  id: number
  name: string
  period_type: "weekly" | "monthly"
  start_date: string
  end_date: string
  total_amount: number
  carry_over?: boolean
  carried_over_from_id?: number
  created_at: string
  updated_at: string
}

interface Expense {
  id: number
  budget_id: number
  expense_date: string
  amount: number
  category: string
  description: string
  created_at: string
  updated_at: string
}

interface BudgetBreakdown {
  total_budget: number
  total_spent: number
  total_remaining: number
  spent_percent: number
  remaining_percent: number
  category_expenses: Array<{
    category: string
    total: number
    percent: number
  }>
  expenses: Expense[]
}

// API functions
const API_BASE_URL = "/api/v1/daily-expenses"

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken") // Adjust based on your auth implementation

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

export default function OperationalBudgetTracker() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [budgetBreakdown, setBudgetBreakdown] = useState<BudgetBreakdown | null>(null)
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null)
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false)
  const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const [newExpense, setNewExpense] = useState({
    expense_date: new Date().toISOString().split("T")[0],
    category: "",
    amount: "",
    description: "",
  })

  const [newBudget, setNewBudget] = useState({
    period_type: "weekly" as "weekly" | "monthly",
    start_date: "",
    end_date: "",
    total_amount: "",
    name: "",
    carry_over: false,
    carried_over_from_id: undefined as number | undefined,
  })

  // Fetch budgets on component mount
  useEffect(() => {
    fetchBudgets()
  }, [])

  // Fetch budget breakdown when selected budget changes
  useEffect(() => {
    if (selectedBudgetId) {
      fetchBudgetBreakdown(selectedBudgetId)
    }
  }, [selectedBudgetId])
 
  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await fetchAllBudgets()  
      setBudgets(response || [])

      if (response && response.length > 0 && !selectedBudgetId) {
        setSelectedBudgetId(response[0].id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budgets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchBudgetBreakdown = async (budgetId: number) => {
    try {
      const response = await GetBudgetBreakdown(budgetId.toString())
      setBudgetBreakdown(response)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch budget breakdown",
        variant: "destructive",
      })
    }
  }

  const handleAddExpense = async () => {
    if (!selectedBudgetId || !newExpense.category || !newExpense.amount || !newExpense.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        budget_id: selectedBudgetId,
          expense_date: newExpense.expense_date,
          amount: Number.parseFloat(newExpense.amount),
          category: newExpense.category,
          description: newExpense.description,
      }
    const resp = await createOperationalExpense(payload)
    console.log('edd', resp)

      setNewExpense({
        expense_date: new Date().toISOString().split("T")[0],
        category: "",
        amount: "",
        description: "",
      })
      setIsAddExpenseDialogOpen(false)

      // Refresh budget breakdown
      if (selectedBudgetId) {
        await fetchBudgetBreakdown(selectedBudgetId)
      }

      toast({
        title: "Success",
        description: "Expense added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddBudget = async () => {
    if (
      !newBudget.period_type ||
      !newBudget.start_date ||
      !newBudget.end_date ||
      !newBudget.total_amount ||
      !newBudget.name
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        name: newBudget.name,
          period_type: newBudget.period_type,
          start_date: newBudget.start_date,
          end_date: newBudget.end_date,
          total_amount: Number.parseFloat(newBudget.total_amount),
          // carry_over: newBudget.carry_over,
          // carried_over_from_id: newBudget.carried_over_from_id
      }

      console.log("Creating budget with payload:", payload)
      const response = await createBudget(payload)
      console.log("Budget created:", response)

      setNewBudget({
        period_type: "weekly",
        start_date: "",
        end_date: "",
        total_amount: "",
        name: "",
        carry_over: false,
        carried_over_from_id: undefined,
      })
      setIsAddBudgetDialogOpen(false)

      // Refresh budgets and select the new one
      await fetchBudgets()
      if (response.data?.id) {
        setSelectedBudgetId(response.data.id)
      }

      toast({
        title: "Success",
        description: "Budget created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      const resp = await DeleteExpense(expenseId.toString())
      console.log('delete expense', resp)

      // Refresh budget breakdown
      if (selectedBudgetId) {
        await fetchBudgetBreakdown(selectedBudgetId)
      }

      toast({
        title: "Success",
        description: "Expense deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      })
    }
  }

  const selectedBudget = budgets.find((b) => b.id === selectedBudgetId)
  const filteredExpenses =
    budgetBreakdown?.expenses?.filter((expense) => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || expense.category === filterCategory
      return matchesSearch && matchesCategory
    }) || []

  // Calculate budget analytics from API data
  const budgetAnalytics = useMemo(() => {
    if (!selectedBudget || !budgetBreakdown) return null

    // Category breakdown with enhanced data
    const categoryBreakdown = budgetCategories
      .map((category) => {
        const apiCategory = budgetBreakdown.category_expenses.find((cat) => cat.category === category.value)
        const categoryExpenses = budgetBreakdown.expenses.filter((expense) => expense.category === category.value)

        return {
          ...category,
          spent: apiCategory?.total || 0,
          percentage: apiCategory?.percent || 0,
          count: categoryExpenses.length,
        }
      })
      .filter((category) => category.spent > 0)

    // Daily spending trend
    const dailySpending = budgetBreakdown.expenses.reduce(
      (acc, expense) => {
        const date = expense.expense_date
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
      totalBudget: budgetBreakdown.total_budget,
      totalSpent: budgetBreakdown.total_spent,
      remaining: budgetBreakdown.total_remaining,
      spentPercentage: budgetBreakdown.spent_percent,
      categoryBreakdown,
      trendData,
      status: budgetBreakdown.spent_percent > 90 ? "critical" : budgetBreakdown.spent_percent > 75 ? "warning" : "good",
    }
  }, [selectedBudget, budgetBreakdown])

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading budget data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
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
            <Dialog open={isAddBudgetDialogOpen} onOpenChange={setIsAddBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 hover:bg-indigo-50 border-indigo-200 bg-transparent">
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
                      value={newBudget.period_type}
                      onValueChange={(value: "weekly" | "monthly") =>
                        setNewBudget({ ...newBudget, period_type: value })
                      }
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
                        value={newBudget.start_date}
                        onChange={(e) => setNewBudget({ ...newBudget, start_date: e.target.value })}
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
                        value={newBudget.end_date}
                        onChange={(e) => setNewBudget({ ...newBudget, end_date: e.target.value })}
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
                      value={newBudget.total_amount}
                      onChange={(e) => setNewBudget({ ...newBudget, total_amount: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  {budgets.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="carry-over"
                          checked={newBudget.carry_over}
                          onChange={(e) => setNewBudget({ ...newBudget, carry_over: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="carry-over" className="text-sm font-medium">
                          Carry over unspent funds from previous budget
                        </Label>
                      </div>
                      {newBudget.carry_over && (
                        <div>
                          <Label htmlFor="previous-budget" className="text-sm font-medium">
                            Previous Budget
                          </Label>
                          <Select
                            value={newBudget.carried_over_from_id?.toString() || ""}
                            onValueChange={(value) =>
                              setNewBudget({ ...newBudget, carried_over_from_id: Number.parseInt(value) })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select previous budget" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgets.map((budget) => (
                                <SelectItem key={budget.id} value={budget.id.toString()}>
                                  {budget.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                  <Button
                    onClick={handleAddBudget}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Budget
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddExpenseDialogOpen} onOpenChange={setIsAddExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 gap-2 shadow-lg"
                  disabled={!selectedBudgetId}
                >
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
                        value={newExpense.expense_date}
                        onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
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
                  <Button
                    onClick={handleAddExpense}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
              {budgets.length > 0 ? (
                <Select
                  value={selectedBudgetId?.toString() || ""}
                  onValueChange={(value) => setSelectedBudgetId(Number(value))}
                >
                  <SelectTrigger className="w-full lg:w-80 border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select budget period" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((budget) => (
                      <SelectItem key={budget.id} value={budget.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{budget.name}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(budget.start_date).toLocaleDateString()} -{" "}
                            {new Date(budget.end_date).toLocaleDateString()} • {formatCurrency(budget.total_amount)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-slate-500 text-center py-4">
                  <p>No budgets found. Create your first budget to get started.</p>
                </div>
              )}
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
                  <p className="text-xs text-blue-200">{selectedBudget?.period_type} budget</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-700">Total Spent</CardTitle>
                  <FaNairaSign className="h-5 w-5 text-red-500" />
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
                  <div className="text-2xl font-bold capitalize">{budgetAnalytics.status}</div>
                  <Progress value={budgetAnalytics.spentPercentage} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="categories" className="space-y-6">
              <TabsList className="grid w-full grid-cols-1 lg:w-96">
                <TabsTrigger value="categories" className="gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Categories
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
                      <TableHead className="text-right font-semibold text-slate-700">Amount</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => {
                      const categoryInfo = getCategoryInfo(expense.category)
                      return (
                        <TableRow key={expense.id} className="hover:bg-blue-50/30 transition-colors">
                          <TableCell className="font-medium text-slate-800">
                            {new Date(expense.expense_date).toLocaleDateString("en-NG", {
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
                          <TableCell className="text-right font-semibold text-slate-800">
                            {formatCurrency(expense.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FaNairaSign className="h-12 w-12 mx-auto mb-4 text-slate-300" />
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
