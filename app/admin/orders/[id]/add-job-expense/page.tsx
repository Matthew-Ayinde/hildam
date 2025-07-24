"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  FaCut,
  FaRuler,
  FaUserTie,
  FaCog,
  FaPalette,
  FaPlus,
  FaSave,
  FaUser,
  FaFileInvoice,
  FaClipboardList,
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { createExpense, fetchOrderById } from "@/app/api/apiClient"

interface ExpenseItem {
  id: string
  name: string
  icon: React.ReactNode
  amount: number
}

interface OrderInfo {
  orderId: string
  customerName: string
  orderDescription: string
  clothingName: string
}

interface OrderData {
  id: string
  customer_name: string
  clothing_name: string
  clothing_description: string
  order_id: string
  // ... other fields from the API response
}

export default function AddExpensePage() {
  const params = useParams()
  const orderId = params.id as string
  const id = params.id as string

  const router = useRouter()

  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    orderId: "",
    customerName: "",
    orderDescription: "",
    clothingName: "",
  })

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "utilities", name: "Utilities", icon: <FaCut className="w-5 h-5" />, amount: 0 },
    { id: "service", name: "Services", icon: <FaRuler className="w-5 h-5" />, amount: 0 },
    { id: "labour", name: "Labour", icon: <FaUserTie className="w-5 h-5" />, amount: 0 },
    { id: "purchase", name: "Purchase Costs", icon: <FaCog className="w-5 h-5" />, amount: 0 },
    { id: "rent", name: "Rent", icon: <FaPalette className="w-5 h-5" />, amount: 0 },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch order data on component mount
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) {
        setError("No order ID provided in URL")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        

        const result = await fetchOrderById(orderId)

        console.log('fetch invoice expense', result)

        const data: any = result
          setOrderInfo({
            orderId: data.order_id || `ORD-${id}`,
            customerName: data.customer_name || "",
            orderDescription: data.clothing_description || "",
            clothingName: data.clothing_name || "",
          })
          console.log('orde ID', orderId)
          // setSuccess("Order data loaded successfully!")
        
      } catch (error) {
        console.error("Error fetching order data:", error)
        setError(error instanceof Error ? error.message : "Failed to fetch order data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderData()
  }, [id])

  const updateExpenseAmount = (id: string, amount: number) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, amount } : expense)))
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const handleSubmit = async () => {
    if (!orderInfo.orderId || !orderInfo.customerName) {
      setError("Order information is incomplete. Please ensure order data is loaded.")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    // Prepare data for backend submission in the required format
    const submitData = {
      order_id: orderInfo.orderId,
      utilities: expenses.find((expense) => expense.id === "utilities")?.amount || 0,
      labour: expenses.find((expense) => expense.id === "labour")?.amount || 0,
      service: expenses.find((expense) => expense.id === "service")?.amount || 0,
    }

    try {
      console.log("Submitting expense data:", submitData)

      const response = await createExpense(submitData)
      console.log('resulf for create expense', response)


      setSuccess("Expenses submitted successfully!")
      router.push(`/admin/orders/${id}/create-payment`) // Redirect to order details page

      // Reset only the expense amounts after successful submission
      setExpenses((prev) => prev.map((expense) => ({ ...expense, amount: 0 })))
    } catch (error) {
      console.error("Error submitting expenses:", error)
      setError(error instanceof Error ? error.message : "Failed to submit expenses")
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading order data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching order ID: {id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mb-4 shadow-lg"
          >
            <FaPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Order Expense Management</h1>
          <p className="text-gray-600 text-lg">Professional expense tracking for tailoring orders</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Order ID - Prominent at top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <Label
                  htmlFor="orderId"
                  className="text-lg font-bold text-white mb-3 block flex items-center justify-center gap-2"
                >
                  <FaClipboardList className="w-5 h-5" />
                  Order ID
                </Label>
                <Input
                  id="orderId"
                  value={orderInfo.orderId}
                  readOnly
                  className="text-center text-xl font-bold bg-white text-gray-900 border-0 focus:ring-2 focus:ring-white max-w-md mx-auto cursor-not-allowed"
                  placeholder="Loading..."
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl">
                <FaFileInvoice className="w-6 h-6" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-orange-500" />
                    Customer Name
                  </Label>
                  <Input
                    id="customerName"
                    value={orderInfo.customerName}
                    readOnly
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 cursor-not-allowed bg-gray-50"
                    placeholder="Loading customer name..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clothingName" className="text-sm font-semibold text-gray-700">
                    Clothing Name
                  </Label>
                  <Input
                    id="clothingName"
                    value={orderInfo.clothingName}
                    readOnly
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 cursor-not-allowed bg-gray-50"
                    placeholder="Loading clothing name..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="orderDescription" className="text-sm font-semibold text-gray-700">
                    Clothing Description
                  </Label>
                  <Textarea
                    id="orderDescription"
                    value={orderInfo.orderDescription}
                    readOnly
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[100px] cursor-not-allowed bg-gray-50"
                    placeholder="Loading clothing description..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Categories Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Expense Categories</h2>
            <p className="text-gray-600">Track all costs associated with this order</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {expenses.map((expense) => (
              <motion.div key={expense.id} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/90 backdrop-blur-sm hover:bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg text-white shadow-md">
                        {expense.icon}
                      </div>
                      <span className="text-gray-800">{expense.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor={expense.id} className="text-sm font-semibold text-gray-700">
                        Amount (₦)
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 font-bold">
                          ₦
                        </span>
                        <Input
                          id={expense.id}
                          type="number"
                          min="0"
                          step="0.01"
                          value={expense.amount || ""}
                          onChange={(e) => updateExpenseAmount(expense.id, Number.parseFloat(e.target.value) || 0)}
                          className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 font-medium"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Total and Submit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-orange-500 to-amber-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Total Order Expenses</h3>
                  <motion.div
                    key={totalExpenses}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-4xl font-bold"
                  >
                    ₦{totalExpenses.toFixed(2)}
                  </motion.div>
                  <p className="text-orange-100 mt-2">Order ID: {orderInfo.orderId || "Loading..."}</p>
                </div>

                <Separator orientation="vertical" className="hidden md:block h-20 bg-white/20" />

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !orderInfo.orderId || !orderInfo.customerName}
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-10 py-4 rounded-xl shadow-lg disabled:opacity-50 text-lg"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-6 h-6 border-3 border-orange-600 border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        {/* <FaSave className="w-5 h-5 mr-3" /> */}
                        Create Expense
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
