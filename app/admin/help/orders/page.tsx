"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Plus, Clock, CheckCircle, AlertCircle, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const OrdersHelpPage = () => {
  const orderWorkflow = [
    {
      step: 1,
      title: "Order Creation",
      description: "Start by selecting a customer and defining order requirements",
      icon: <Plus className="w-5 h-5" />,
      details: [
        "Select existing customer or create new customer profile",
        "Choose garment type and style specifications",
        "Add measurements and fitting requirements",
        "Set delivery date and special instructions"
      ]
    },
    {
      step: 2,
      title: "Order Processing",
      description: "Move orders through production stages",
      icon: <Clock className="w-5 h-5" />,
      details: [
        "Assign order to appropriate tailoring team",
        "Track progress through cutting, sewing, and finishing stages",
        "Schedule fittings and adjustment appointments",
        "Update order status as work progresses"
      ]
    },
    {
      step: 3,
      title: "Quality Control",
      description: "Ensure quality standards before delivery",
      icon: <CheckCircle className="w-5 h-5" />,
      details: [
        "Conduct final quality inspection",
        "Schedule final fitting with customer",
        "Make any necessary adjustments",
        "Prepare order for delivery or pickup"
      ]
    },
    {
      step: 4,
      title: "Order Completion",
      description: "Finalize and deliver completed orders",
      icon: <Package className="w-5 h-5" />,
      details: [
        "Process final payment and generate invoice",
        "Package order with care instructions",
        "Coordinate delivery or pickup with customer",
        "Mark order as completed and update records"
      ]
    }
  ]

  const orderStatuses = [
    { status: "Pending", color: "bg-yellow-100 text-yellow-800", description: "Order received, awaiting processing" },
    { status: "In Progress", color: "bg-blue-100 text-blue-800", description: "Currently being worked on by tailoring team" },
    { status: "Fitting", color: "bg-purple-100 text-purple-800", description: "Ready for customer fitting appointment" },
    { status: "Adjustments", color: "bg-orange-100 text-orange-800", description: "Modifications being made after fitting" },
    { status: "Ready", color: "bg-green-100 text-green-800", description: "Completed and ready for delivery/pickup" },
    { status: "Delivered", color: "bg-gray-100 text-gray-800", description: "Order completed and delivered to customer" }
  ]

  const orderTips = [
    "Always confirm measurements before starting production",
    "Set realistic delivery dates considering complexity and current workload",
    "Keep customers informed about order progress with regular updates",
    "Document any special requirements or customer preferences clearly",
    "Schedule fittings well in advance to avoid delays"
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
              <h1 className="text-3xl font-bold text-gray-900">Order Processing</h1>
              <p className="text-gray-600 mt-1">Complete guide to managing orders from creation to delivery</p>
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
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8" />
                    Order Management System
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The order management system handles the complete lifecycle of customer orders, from initial 
                    consultation to final delivery. It ensures smooth workflow coordination between different 
                    departments and maintains clear communication with customers throughout the process.
                  </p>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <h3 className="font-semibold text-orange-900 mb-3">Order System Features:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Real-time order tracking</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Automated status updates</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Customer communication tools</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Production scheduling</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Workflow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Order Workflow</CardTitle>
                  <p className="text-gray-600">Follow these steps for efficient order processing</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {orderWorkflow.map((step, index) => (
                      <div key={step.step} className="relative">
                        {index < orderWorkflow.length - 1 && (
                          <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-300"></div>
                        )}
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                              <div className="p-1 bg-orange-100 rounded text-orange-600">
                                {step.icon}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">{step.description}</p>
                            <ul className="space-y-2">
                              {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Statuses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Order Status Guide</CardTitle>
                  <p className="text-gray-600">Understanding different order statuses and their meanings</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {orderStatuses.map((status, index) => (
                      <div key={status.status} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                        <Badge className={`${status.color} border-0`}>
                          {status.status}
                        </Badge>
                        <div>
                          <p className="text-sm text-gray-700">{status.description}</p>
                        </div>
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
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-900">Order Management Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderTips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Related Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Related Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/admin/help/customers" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Customer Management</span>
                    </Link>
                    <Link href="/admin/help/payments" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Payment Processing</span>
                    </Link>
                    <Link href="/admin/help/inventory" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Inventory Management</span>
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

export default OrdersHelpPage
