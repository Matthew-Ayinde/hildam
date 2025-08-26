"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, DollarSign, Receipt, TrendingUp, PieChart, FileText, Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const ExpensesHelpPage = () => {
  const expenseFeatures = [
    {
      title: "Job Expenses",
      icon: <Receipt className="w-6 h-6" />,
      description: "Track costs associated with specific customer orders",
      details: [
        "Record material costs for each individual order",
        "Track labor hours and associated costs",
        "Monitor subcontractor fees and external services",
        "Calculate profit margins per job automatically",
        "Generate detailed cost breakdowns for customers"
      ]
    },
    {
      title: "Daily Expenses",
      icon: <DollarSign className="w-6 h-6" />,
      description: "Manage general business operating expenses",
      details: [
        "Record utilities, rent, and facility costs",
        "Track equipment maintenance and repair expenses",
        "Monitor office supplies and administrative costs",
        "Manage staff salaries and benefit expenses",
        "Document marketing and advertising expenditures"
      ]
    },
    {
      title: "Expense Analytics",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Analyze spending patterns and optimize costs",
      details: [
        "Monthly and quarterly expense trend analysis",
        "Category-wise expense distribution reports",
        "Budget vs. actual spending comparisons",
        "Cost per order and profitability analysis",
        "Vendor and supplier cost comparison tools"
      ]
    },
    {
      title: "Financial Reporting",
      icon: <FileText className="w-6 h-6" />,
      description: "Generate comprehensive financial reports",
      details: [
        "Profit and loss statements with detailed breakdowns",
        "Tax-ready expense reports and documentation",
        "Cash flow analysis and forecasting tools",
        "Budget planning and variance analysis",
        "Export reports for accounting software integration"
      ]
    }
  ]

  const expenseCategories = [
    { category: "Materials", description: "Fabrics, threads, buttons, and other raw materials", color: "bg-blue-100 text-blue-800" },
    { category: "Labor", description: "Staff wages, contractor fees, and overtime costs", color: "bg-green-100 text-green-800" },
    { category: "Equipment", description: "Sewing machines, tools, and equipment maintenance", color: "bg-purple-100 text-purple-800" },
    { category: "Utilities", description: "Electricity, water, internet, and facility costs", color: "bg-orange-100 text-orange-800" },
    { category: "Marketing", description: "Advertising, promotions, and customer acquisition", color: "bg-pink-100 text-pink-800" },
    { category: "Administrative", description: "Office supplies, software, and business operations", color: "bg-indigo-100 text-indigo-800" }
  ]

  const expenseTips = [
    "Categorize expenses consistently for accurate reporting",
    "Keep digital receipts and documentation for all expenses",
    "Review expense reports monthly to identify cost-saving opportunities",
    "Set budget alerts to prevent overspending in key categories",
    "Regularly compare supplier prices to ensure competitive costs"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HelpBreadcrumb />
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/help">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracking</h1>
              <p className="text-gray-600 mt-1">Monitor costs, analyze spending, and optimize profitability</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <DollarSign className="w-8 h-8" />
                    Expense Management System
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Comprehensive expense tracking helps you understand your business costs, optimize spending, 
                    and maintain healthy profit margins. The system separates job-specific costs from general 
                    business expenses for accurate profitability analysis.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-semibold text-yellow-900 mb-3">Expense Tracking Benefits:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Calculator className="w-4 h-4" />
                        <span>Accurate cost calculation</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-800">
                        <PieChart className="w-4 h-4" />
                        <span>Spending pattern analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-800">
                        <TrendingUp className="w-4 h-4" />
                        <span>Profit margin optimization</span>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-800">
                        <FileText className="w-4 h-4" />
                        <span>Tax-ready documentation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Expense Features */}
            <div className="space-y-6">
              {expenseFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                          {feature.icon}
                        </div>
                        {feature.title}
                      </CardTitle>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Expense Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Expense Categories</CardTitle>
                  <p className="text-gray-600">Organize expenses for better tracking and analysis</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {expenseCategories.map((category, index) => (
                      <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                        <Badge className={`${category.color} border-0 mb-2`}>
                          {category.category}
                        </Badge>
                        <p className="text-sm text-gray-700">{category.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help Navigation */}
            <HelpNavigation />

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Expense Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenseTips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <Calculator className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/admin/expenses" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">View Job Expenses</span>
                    </Link>
                    <Link href="/admin/expenses/daily-expenses" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Daily Expenses</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpensesHelpPage
