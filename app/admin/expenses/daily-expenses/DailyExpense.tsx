"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  TrendingUp,
  DollarSign,
  Filter,
  Download,
  Search,
  Package,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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

// Sample data with orders
const expenseCategories = [
  { value: "fabric", label: "Fabric & Materials", color: "#f97316" },
  { value: "equipment", label: "Equipment & Tools", color: "#3b82f6" },
  { value: "utilities", label: "Utilities", color: "#10b981" },
  { value: "labor", label: "Labor Costs", color: "#8b5cf6" },
  { value: "supplies", label: "Supplies", color: "#f59e0b" },
  { value: "maintenance", label: "Maintenance", color: "#ef4444" },
  { value: "other", label: "Other", color: "#6b7280" },
]

const orders = [
  { id: "ORD-001", name: "Wedding Dress - Sarah", client: "Sarah Johnson", status: "In Progress" },
  { id: "ORD-002", name: "Business Suits - Corp", client: "ABC Corporation", status: "Completed" },
  { id: "ORD-003", name: "Evening Gown - Maria", client: "Maria Rodriguez", status: "In Progress" },
  { id: "ORD-004", name: "School Uniforms", client: "St. Mary's School", status: "In Progress" },
  { id: "ORD-005", name: "Casual Wear - John", client: "John Smith", status: "Pending" },
]

const initialExpenses = [
  {
    id: 1,
    date: "2024-01-24",
    orderId: "ORD-001",
    category: "fabric",
    amount: 25000.0,
    description: "Silk fabric for wedding dress",
    supplier: "Premium Fabrics",
    paymentMethod: "Card",
  },
  {
    id: 2,
    date: "2024-01-24",
    orderId: "ORD-001",
    category: "supplies",
    amount: 4500.0,
    description: "Beads and sequins",
    supplier: "Craft Supplies",
    paymentMethod: "Cash",
  },
  {
    id: 3,
    date: "2024-01-24",
    orderId: "ORD-002",
    category: "fabric",
    amount: 18000.0,
    description: "Wool fabric for suits",
    supplier: "Business Fabrics Ltd",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    date: "2024-01-24",
    orderId: "ORD-002",
    category: "labor",
    amount: 15000.0,
    description: "Tailoring labor for suits",
    supplier: "Expert Tailors",
    paymentMethod: "Cash",
  },
  {
    id: 5,
    date: "2024-01-24",
    orderId: "ORD-003",
    category: "fabric",
    amount: 12000.0,
    description: "Chiffon fabric for evening gown",
    supplier: "Elegant Fabrics",
    paymentMethod: "Card",
  },
  {
    id: 6,
    date: "2024-01-24",
    orderId: "ORD-003",
    category: "supplies",
    amount: 3500.0,
    description: "Zipper and buttons",
    supplier: "Notions Store",
    paymentMethod: "Cash",
  },
  {
    id: 7,
    date: "2024-01-24",
    orderId: "ORD-004",
    category: "fabric",
    amount: 22000.0,
    description: "Cotton fabric for uniforms",
    supplier: "School Suppliers",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 8,
    date: "2024-01-24",
    orderId: "ORD-005",
    category: "fabric",
    amount: 8000.0,
    description: "Denim fabric",
    supplier: "Casual Fabrics",
    paymentMethod: "Cash",
  },
]

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterOrder, setFilterOrder] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    orderId: "",
    category: "",
    amount: "",
    description: "",
    supplier: "",
    paymentMethod: "",
  })

  // Filter expenses for selected date
  const dailyExpenses = expenses.filter((expense) => expense.date === selectedDate)

  // Further filter by search, category, and order
  const filteredExpenses = dailyExpenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || expense.category === filterCategory
    const matchesOrder = filterOrder === "all" || expense.orderId === filterOrder
    return matchesSearch && matchesCategory && matchesOrder
  })

  // Group expenses by order for pie charts
  const expensesByOrder = useMemo(() => {
    const grouped = dailyExpenses.reduce(
      (acc, expense) => {
        if (!acc[expense.orderId]) {
          acc[expense.orderId] = []
        }
        acc[expense.orderId].push(expense)
        return acc
      },
      {} as Record<string, typeof dailyExpenses>,
    )

    return Object.entries(grouped).map(([orderId, orderExpenses]) => {
      const order = orders.find((o) => o.id === orderId)
      const total = orderExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      // Group by category for pie chart
      const categoryData = expenseCategories
        .map((category) => {
          const categoryTotal = orderExpenses
            .filter((expense) => expense.category === category.value)
            .reduce((sum, expense) => sum + expense.amount, 0)
          return {
            name: category.label,
            value: categoryTotal,
            color: category.color,
          }
        })
        .filter((item) => item.value > 0)

      return {
        orderId,
        order,
        expenses: orderExpenses,
        total,
        categoryData,
      }
    })
  }, [dailyExpenses])

  const dailyTotal = dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const handleAddExpense = () => {
    if (newExpense.orderId && newExpense.category && newExpense.amount && newExpense.description) {
      const expense = {
        id: expenses.length + 1,
        ...newExpense,
        amount: Number.parseFloat(newExpense.amount),
      }
      setExpenses([expense, ...expenses])
      setNewExpense({
        date: new Date().toISOString().split("T")[0],
        orderId: "",
        category: "",
        amount: "",
        description: "",
        supplier: "",
        paymentMethod: "",
      })
      setIsAddDialogOpen(false)
    }
  }

  const getCategoryColor = (category: string) => {
    return expenseCategories.find((cat) => cat.value === category)?.color || "#6b7280"
  }

  const getCategoryLabel = (category: string) => {
    return expenseCategories.find((cat) => cat.value === category)?.label || category
  }

  const getOrderName = (orderId: string) => {
    return orders.find((order) => order.id === orderId)?.name || orderId
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    currentDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Daily Expense Tracker
            </h1>
            <p className="text-slate-600 text-lg">Manage expenses for your tailoring orders</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 hover:bg-orange-50 border-orange-200">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 gap-2 shadow-lg">
                  <Plus className="h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add New Expense</DialogTitle>
                  <DialogDescription>Record a new expense for your tailoring order</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date" className="text-sm font-medium">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-sm font-medium">
                        Amount (₦)
                      </Label>
                      <Input
                        id="amount"
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
                    <Label htmlFor="order" className="text-sm font-medium">
                      Order
                    </Label>
                    <Select
                      value={newExpense.orderId}
                      onValueChange={(value) => setNewExpense({ ...newExpense, orderId: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select order" />
                      </SelectTrigger>
                      <SelectContent>
                        {orders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{order.name}</span>
                              <span className="text-xs text-slate-500">{order.client}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">
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
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                              {category.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the expense..."
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="mt-1 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="supplier" className="text-sm font-medium">
                        Supplier
                      </Label>
                      <Input
                        id="supplier"
                        placeholder="Supplier name"
                        value={newExpense.supplier}
                        onChange={(e) => setNewExpense({ ...newExpense, supplier: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment" className="text-sm font-medium">
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddExpense}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Date Selection */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => navigateDate("prev")} className="hover:bg-orange-50">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  {new Date(selectedDate).toLocaleDateString("en-NG", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto border-orange-200 focus:border-orange-400"
                />
              </div>

              <Button variant="outline" size="sm" onClick={() => navigateDate("next")} className="hover:bg-orange-50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Daily Total</CardTitle>
              <DollarSign className="h-5 w-5 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(dailyTotal)}</div>
              <p className="text-xs text-orange-200">{dailyExpenses.length} transactions today</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Active Orders</CardTitle>
              <Package className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{expensesByOrder.length}</div>
              <p className="text-xs text-slate-500">Orders with expenses today</p>
            </CardContent>
          </Card>

          {/* <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Average per Order</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(expensesByOrder.length > 0 ? dailyTotal / expensesByOrder.length : 0)}
              </div>
              <p className="text-xs text-slate-500">Per active order</p>
            </CardContent>
          </Card> */}

          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">Categories Used</CardTitle>
              <Filter className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {new Set(dailyExpenses.map((e) => e.category)).size}
              </div>
              <p className="text-xs text-slate-500">Unique categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Pie Charts */}
        {expensesByOrder.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold text-slate-800">Expense Breakdown by Order</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {expensesByOrder.map(({ orderId, order, total, categoryData }) => (
                <Card key={orderId} className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-slate-800">{order?.name || orderId}</CardTitle>
                        <CardDescription className="text-slate-600">{order?.client}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          order?.status === "Completed"
                            ? "border-green-200 text-green-700 bg-green-50"
                            : order?.status === "In Progress"
                              ? "border-orange-200 text-orange-700 bg-orange-50"
                              : "border-slate-200 text-slate-700 bg-slate-50"
                        }`}
                      >
                        {order?.status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{formatCurrency(total)}</div>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length > 0 ? (
                      <ChartContainer
                        config={{
                          fabric: { label: "Fabric", color: "#f97316" },
                          equipment: { label: "Equipment", color: "#3b82f6" },
                          utilities: { label: "Utilities", color: "#10b981" },
                          labor: { label: "Labor", color: "#8b5cf6" },
                          supplies: { label: "Supplies", color: "#f59e0b" },
                          maintenance: { label: "Maintenance", color: "#ef4444" },
                          other: { label: "Other", color: "#6b7280" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={70}
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload
                                  return (
                                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                                      <p className="font-medium text-slate-800">{data.name}</p>
                                      <p className="text-orange-600 font-semibold">{formatCurrency(data.value)}</p>
                                      <p className="text-xs text-slate-500">
                                        {((data.value / total) * 100).toFixed(1)}% of total
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
                                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
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
                      <div className="h-[200px] flex items-center justify-center text-slate-500">
                        No expenses recorded
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Expense List */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <CardTitle className="text-xl text-slate-800">Daily Expenses</CardTitle>
                <CardDescription className="text-slate-600">
                  All expenses for {new Date(selectedDate).toLocaleDateString("en-NG")}
                </CardDescription>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-400"
                  />
                </div>
                <Select value={filterOrder} onValueChange={setFilterOrder}>
                  <SelectTrigger className="w-40 border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Filter by order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40 border-orange-200 focus:border-orange-400">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="rounded-lg border border-orange-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50/50">
                      <TableHead className="font-semibold text-slate-700">Order</TableHead>
                      <TableHead className="font-semibold text-slate-700">Category</TableHead>
                      <TableHead className="font-semibold text-slate-700">Description</TableHead>
                      <TableHead className="font-semibold text-slate-700">Supplier</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-orange-50/30 transition-colors">
                        <TableCell className="font-medium text-slate-800">
                          <div className="flex flex-col">
                            <span className="text-sm">{getOrderName(expense.orderId)}</span>
                            <span className="text-xs text-slate-500">{expense.orderId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            style={{
                              backgroundColor: getCategoryColor(expense.category) + "20",
                              color: getCategoryColor(expense.category),
                              border: `1px solid ${getCategoryColor(expense.category)}40`,
                            }}
                            className="border-0"
                          >
                            {getCategoryLabel(expense.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-700">{expense.description}</TableCell>
                        <TableCell className="text-slate-700">{expense.supplier}</TableCell>
                        {/* <TableCell>
                          <Badge variant="outline" className="border-slate-200 text-slate-600">
                            {expense.paymentMethod}
                          </Badge>
                        </TableCell> */}
                        <TableCell className="text-right font-semibold text-slate-800">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
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
