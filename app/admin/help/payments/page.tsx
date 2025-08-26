"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, CreditCard, DollarSign, Receipt, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const PaymentsHelpPage = () => {
  const paymentFeatures = [
    {
      title: "Payment Processing",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Handle various payment methods and transactions",
      details: [
        "Accept cash, card, and digital payments",
        "Process partial payments and installments",
        "Generate automatic receipts and invoices",
        "Track payment status and outstanding balances",
        "Handle refunds and payment adjustments"
      ]
    },
    {
      title: "Invoice Management",
      icon: <Receipt className="w-6 h-6" />,
      description: "Create and manage professional invoices",
      details: [
        "Generate detailed invoices with itemized services",
        "Include tax calculations and discount applications",
        "Send invoices directly to customers via email",
        "Track invoice status: sent, viewed, paid, overdue",
        "Customize invoice templates with business branding"
      ]
    },
    {
      title: "Financial Reporting",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Monitor financial performance and trends",
      details: [
        "Daily, weekly, and monthly revenue reports",
        "Payment method analysis and preferences",
        "Outstanding balance tracking and aging reports",
        "Profit margin analysis by service type",
        "Tax reporting and financial summaries"
      ]
    },
    {
      title: "Payment Security",
      icon: <CheckCircle className="w-6 h-6" />,
      description: "Secure payment processing and data protection",
      details: [
        "PCI-compliant payment processing standards",
        "Encrypted customer payment information storage",
        "Secure transaction logging and audit trails",
        "Fraud detection and prevention measures",
        "Regular security updates and compliance monitoring"
      ]
    }
  ]

  const paymentMethods = [
    { method: "Cash", description: "Traditional cash payments with receipt generation", icon: <DollarSign className="w-5 h-5" /> },
    { method: "Credit/Debit Card", description: "Secure card processing with instant verification", icon: <CreditCard className="w-5 h-5" /> },
    { method: "Bank Transfer", description: "Direct bank transfers for larger transactions", icon: <Receipt className="w-5 h-5" /> },
    { method: "Digital Wallets", description: "Mobile payment solutions and digital wallets", icon: <CheckCircle className="w-5 h-5" /> }
  ]

  const troubleshooting = [
    {
      issue: "Payment Failed",
      solution: "Check card details, verify sufficient funds, or try alternative payment method"
    },
    {
      issue: "Invoice Not Sent",
      solution: "Verify customer email address and check spam folder, resend if necessary"
    },
    {
      issue: "Refund Processing",
      solution: "Process refunds through original payment method, allow 3-5 business days"
    },
    {
      issue: "Outstanding Balance",
      solution: "Send payment reminders, offer payment plans, or schedule collection calls"
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-1">Handle payments, invoicing, and financial transactions</p>
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
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Financial Transaction Management</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The payment system provides comprehensive tools for managing all financial aspects of your 
                    tailoring business. From processing customer payments to generating detailed financial reports, 
                    everything is designed to ensure accuracy and efficiency.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Features */}
            <div className="space-y-6">
              {paymentFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
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
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Supported Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method, index) => (
                      <div key={method.method} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-white rounded-lg text-gray-600">
                            {method.icon}
                          </div>
                          <h4 className="font-semibold text-gray-900">{method.method}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
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

            {/* Troubleshooting */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
                <CardHeader>
                  <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Troubleshooting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {troubleshooting.map((item, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-semibold text-red-900 mb-1">{item.issue}</h4>
                        <p className="text-sm text-red-800">{item.solution}</p>
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
                    <Link href="/admin/payments" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">View All Payments</span>
                    </Link>
                    <Link href="/admin/orders" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Process Order Payment</span>
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

export default PaymentsHelpPage
