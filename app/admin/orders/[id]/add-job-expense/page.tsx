"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaCut,
  FaRuler,
//   FaThreads,
  FaCog,
  FaTools,
  FaPlus,
  FaMinus,
  FaMoneyBillWave,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ExpenseItem {
  id: string
  name: string
  price: number
  category: string
  icon: React.ReactNode
}

interface ExpenseCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  items: ExpenseItem[]
}

const expenseCategories: ExpenseCategory[] = [
  {
    id: "fabric",
    name: "Fabric & Materials",
    icon: <FaCut className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    items: [
      { id: "silk", name: "Premium Silk Fabric", price: 4500.0, category: "fabric", icon: <FaCut /> },
      { id: "cotton", name: "Cotton Blend", price: 2500.0, category: "fabric", icon: <FaCut /> },
      { id: "wool", name: "Merino Wool", price: 6500.0, category: "fabric", icon: <FaCut /> },
      { id: "lining", name: "Suit Lining", price: 1800.0, category: "fabric", icon: <FaCut /> },
    ],
  },
//   {
//     id: "threads",
//     name: "Threads & Notions",
//     icon: <FaThreads className="w-5 h-5" />,
//     color: "bg-blue-100 text-blue-700 border-blue-200",
//     items: [
//       { id: "thread-set", name: "Professional Thread Set", price: 1200.0, category: "threads", icon: <FaThreads /> },
//       { id: "elastic", name: "Elastic Bands", price: 800.0, category: "threads", icon: <FaThreads /> },
//       { id: "interfacing", name: "Interfacing Material", price: 1500.0, category: "threads", icon: <FaThreads /> },
//       { id: "bias-tape", name: "Bias Tape", price: 600.0, category: "threads", icon: <FaThreads /> },
//     ],
//   },
  {
    id: "hardware",
    name: "Hardware & Fasteners",
    icon: <FaCog className="w-5 h-5" />,
    color: "bg-green-100 text-green-700 border-green-200",
    items: [
      { id: "buttons", name: "Designer Buttons Set", price: 2200.0, category: "hardware", icon: <FaCog /> },
      { id: "zipper", name: "Premium Zippers", price: 1600.0, category: "hardware", icon: <FaCog /> },
      { id: "snaps", name: "Snap Fasteners", price: 900.0, category: "hardware", icon: <FaCog /> },
      { id: "hooks", name: "Hook & Eye Closures", price: 700.0, category: "hardware", icon: <FaCog /> },
    ],
  },
  {
    id: "labor",
    name: "Labor Costs",
    icon: <FaRuler className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    items: [
      { id: "cutting", name: "Pattern Cutting", price: 3500.0, category: "labor", icon: <FaRuler /> },
      { id: "sewing", name: "Machine Sewing", price: 5000.0, category: "labor", icon: <FaRuler /> },
      { id: "finishing", name: "Hand Finishing", price: 4000.0, category: "labor", icon: <FaRuler /> },
      { id: "pressing", name: "Professional Pressing", price: 2000.0, category: "labor", icon: <FaRuler /> },
    ],
  },
  {
    id: "tools",
    name: "Equipment & Tools",
    icon: <FaTools className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    items: [
      { id: "needles", name: "Specialty Needles", price: 1400.0, category: "tools", icon: <FaTools /> },
      { id: "scissors", name: "Fabric Scissors", price: 2800.0, category: "tools", icon: <FaTools /> },
      { id: "pins", name: "Quilting Pins", price: 1100.0, category: "tools", icon: <FaTools /> },
      { id: "thimble", name: "Leather Thimble", price: 800.0, category: "tools", icon: <FaTools /> },
    ],
  },
]

export default function JobExpensePage() {
  const [totalBudget, setTotalBudget] = useState<string>("")
  const [selectedExpenses, setSelectedExpenses] = useState<Map<string, number>>(new Map())
  const [budgetSet, setBudgetSet] = useState(false)

  const currentTotal = Array.from(selectedExpenses.entries()).reduce((sum, [itemId, quantity]) => {
    const item = expenseCategories.flatMap((cat) => cat.items).find((item) => item.id === itemId)
    return sum + (item ? item.price * quantity : 0)
  }, 0)

  const remainingBudget = Number.parseFloat(totalBudget) - currentTotal
  const isOverBudget = remainingBudget < 0

  const handleBudgetSubmit = () => {
    if (Number.parseFloat(totalBudget) > 0) {
      setBudgetSet(true)
    }
  }

  const updateExpenseQuantity = (itemId: string, change: number) => {
    const newQuantity = Math.max(0, (selectedExpenses.get(itemId) || 0) + change)
    const newExpenses = new Map(selectedExpenses)

    if (newQuantity === 0) {
      newExpenses.delete(itemId)
    } else {
      newExpenses.set(itemId, newQuantity)
    }

    setSelectedExpenses(newExpenses)
  }

  const resetBudget = () => {
    setBudgetSet(false)
    setTotalBudget("")
    setSelectedExpenses(new Map())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Job Expense Tracker</h1>
          <p className="text-gray-600">Manage your tailoring project expenses efficiently</p>
        </motion.div>

        {!budgetSet ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-center gap-2">
                  <FaMoneyBillWave className="w-6 h-6" />
                  Set Project Budget
                </CardTitle>
                <CardDescription className="text-orange-100">
                  Enter the total budget for this tailoring project
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(e.target.value)}
                      className="pl-10 text-lg font-semibold border-orange-200 focus:border-orange-400"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <Button
                    onClick={handleBudgetSubmit}
                    disabled={!totalBudget || Number.parseFloat(totalBudget) <= 0}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    Set Budget & Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Budget Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky top-4 z-10">
              <Card
                className={`border-2 ${isOverBudget ? "border-red-300 bg-red-50" : "border-orange-300 bg-orange-50"} shadow-lg`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Budget</p>
                        <p className="text-2xl font-bold text-gray-800">₦{Number.parseFloat(totalBudget).toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Current Total</p>
                        <p className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : "text-orange-600"}`}>
                          ₦{currentTotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                          ₦{remainingBudget.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOverBudget && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1 text-red-600"
                        >
                          <FaExclamationTriangle />
                          <span className="text-sm font-medium">Over Budget!</span>
                        </motion.div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetBudget}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        Reset Budget
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Expense Categories */}
            <div className="grid gap-6">
              {expenseCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>{category.icon}</div>
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {category.items.map((item) => {
                          const quantity = selectedExpenses.get(item.id) || 0
                          const itemTotal = item.price * quantity

                          return (
                            <motion.div
                              key={item.id}
                              whileHover={{ scale: 1.02 }}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                quantity > 0
                                  ? "border-orange-300 bg-orange-50"
                                  : "border-gray-200 bg-white hover:border-orange-200"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                                  <p className="text-orange-600 font-semibold">₦{item.price.toFixed(2)}</p>
                                </div>
                                {quantity > 0 && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                    {quantity}x
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateExpenseQuantity(item.id, -1)}
                                    disabled={quantity === 0}
                                    className="h-8 w-8 p-0 border-orange-300 text-orange-600 hover:bg-orange-50"
                                  >
                                    <FaMinus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{quantity}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateExpenseQuantity(item.id, 1)}
                                    className="h-8 w-8 p-0 border-orange-300 text-orange-600 hover:bg-orange-50"
                                  >
                                    <FaPlus className="w-3 h-3" />
                                  </Button>
                                </div>
                                {quantity > 0 && (
                                  <span className="text-sm font-semibold text-gray-700">₦{itemTotal.toFixed(2)}</span>
                                )}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Proceed to Payment */}
            <AnimatePresence>
              {currentTotal > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="sticky bottom-4"
                >
                  <Card className="border-green-300 bg-green-50 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Ready to Proceed?</h3>
                          <p className="text-gray-600">
                            Total: <span className="font-bold text-green-600">₦{currentTotal.toFixed(2)}</span>
                            {isOverBudget && (
                              <span className="text-red-600 ml-2">
                                (₦{Math.abs(remainingBudget).toFixed(2)} over budget)
                              </span>
                            )}
                          </p>
                        </div>
                        <Button
                          size="lg"
                          disabled={isOverBudget}
                          className={`${
                            isOverBudget
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          } text-white font-semibold px-8`}
                        >
                          <FaCheck className="w-4 h-4 mr-2" />
                          Proceed to Payment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
