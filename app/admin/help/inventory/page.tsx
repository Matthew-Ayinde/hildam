"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Package, Plus, AlertTriangle, TrendingDown, BarChart3, RefreshCw, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const InventoryHelpPage = () => {
  const inventoryFeatures = [
    {
      title: "Stock Management",
      icon: <Package className="w-6 h-6" />,
      description: "Track and manage all inventory items",
      details: [
        "Real-time stock level monitoring across all items",
        "Automatic low-stock alerts and notifications",
        "Batch updates for multiple items simultaneously",
        "Stock movement history and audit trails",
        "Category-based organization for easy navigation"
      ]
    },
    {
      title: "Inventory Requests",
      icon: <Plus className="w-6 h-6" />,
      description: "Streamlined requesting system for stock replenishment",
      details: [
        "Submit requests for new inventory items or restocking",
        "Specify quantities, preferred suppliers, and urgency levels",
        "Track request status from submission to fulfillment",
        "Approve or reject requests with detailed reasoning",
        "Automated notifications for request status changes"
      ]
    },
    {
      title: "Stock Alerts",
      icon: <AlertTriangle className="w-6 h-6" />,
      description: "Proactive monitoring and alert system",
      details: [
        "Customizable low-stock thresholds for each item",
        "Automatic alerts when items reach minimum levels",
        "Overstock warnings for items with excessive quantities",
        "Expiration date tracking for time-sensitive materials",
        "Email and in-app notifications for critical stock issues"
      ]
    },
    {
      title: "Inventory Analytics",
      icon: <BarChart3 className="w-6 h-6" />,
      description: "Data-driven insights for inventory optimization",
      details: [
        "Usage patterns and consumption rate analysis",
        "Cost analysis and inventory value tracking",
        "Supplier performance and delivery time metrics",
        "Seasonal demand forecasting and planning",
        "ROI analysis for inventory investments"
      ]
    }
  ]

  const stockCategories = [
    { category: "Fabrics", description: "Cotton, silk, wool, and specialty materials", color: "bg-blue-100 text-blue-800" },
    { category: "Threads", description: "Various thread types, colors, and weights", color: "bg-green-100 text-green-800" },
    { category: "Buttons & Zippers", description: "Fasteners and closure accessories", color: "bg-purple-100 text-purple-800" },
    { category: "Tools & Equipment", description: "Sewing machines, scissors, and measuring tools", color: "bg-orange-100 text-orange-800" },
    { category: "Trims & Accessories", description: "Lace, ribbons, and decorative elements", color: "bg-pink-100 text-pink-800" },
    { category: "Interfacing", description: "Stabilizers and support materials", color: "bg-indigo-100 text-indigo-800" }
  ]

  const inventoryTips = [
    "Set up automatic reorder points to prevent stockouts",
    "Regularly audit physical inventory against system records",
    "Use barcode scanning for faster inventory updates",
    "Organize storage areas to match system categories",
    "Train staff on proper inventory handling procedures"
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
              <h1 className="text-3xl font-bold text-gray-900">Inventory Control</h1>
              <p className="text-gray-600 mt-1">Manage stock levels, requests, and supply chain operations</p>
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
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Package className="w-8 h-8" />
                    Inventory Management System
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Effective inventory management is crucial for maintaining smooth operations in your tailoring business. 
                    Our system helps you track materials, manage stock levels, process requests, and optimize your 
                    supply chain for maximum efficiency and cost-effectiveness.
                  </p>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                    <h3 className="font-semibold text-indigo-900 mb-3">Inventory Management Benefits:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-indigo-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Prevent material shortages</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Optimize storage costs</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Track material usage patterns</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Improve supplier relationships</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Inventory Features */}
            <div className="space-y-6">
              {inventoryFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
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
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Stock Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Inventory Categories</CardTitle>
                  <p className="text-gray-600">Understanding different types of inventory items</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stockCategories.map((category, index) => (
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
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-900">Inventory Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inventoryTips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <TrendingDown className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">{tip}</p>
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
                    <Link href="/admin/inventory" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">View All Items</span>
                    </Link>
                    <Link href="/admin/inventory/create" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Add New Item</span>
                    </Link>
                    <Link href="/admin/inventory/requests" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">View Requests</span>
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

export default InventoryHelpPage
