"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const DashboardHelpPage = () => {
  const dashboardSections = [
    {
      title: "Key Performance Indicators (KPIs)",
      icon: <TrendingUp className="w-6 h-6" />,
      content: [
        "Total Revenue: Track your overall business income and growth trends",
        "Active Orders: Monitor orders currently in progress and their status",
        "Customer Count: View total customers and new customer acquisition",
        "Inventory Value: Keep track of your total inventory worth and stock levels"
      ]
    },
    {
      title: "Analytics Charts",
      icon: <BarChart3 className="w-6 h-6" />,
      content: [
        "Revenue Trends: Visual representation of income over time periods",
        "Order Status Distribution: Pie charts showing order completion rates",
        "Customer Growth: Line graphs tracking customer acquisition",
        "Popular Services: Bar charts of most requested tailoring services"
      ]
    },
    {
      title: "Quick Actions",
      icon: <Users className="w-6 h-6" />,
      content: [
        "Create New Order: Quick access to start a new customer order",
        "Add Customer: Rapidly add new customer profiles to the system",
        "Inventory Check: Quick view of low-stock items requiring attention",
        "Schedule Appointment: Fast scheduling for customer consultations"
      ]
    },
    {
      title: "Recent Activities",
      icon: <ShoppingCart className="w-6 h-6" />,
      content: [
        "Latest Orders: View the most recent orders placed by customers",
        "Recent Payments: Track recent payment transactions and status",
        "Inventory Updates: See recent stock changes and adjustments",
        "System Notifications: Important alerts and system messages"
      ]
    }
  ]

  const tips = [
    "Use the date range selector to view analytics for specific time periods",
    "Click on any chart element to drill down into detailed information",
    "Bookmark frequently used quick actions for faster access",
    "Set up notification preferences to stay informed about important events",
    "Use the search functionality to quickly find specific customers or orders"
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Understanding your business metrics and analytics</p>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Business Command Center</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The dashboard is your central hub for monitoring business performance, tracking key metrics, 
                    and accessing quick actions. It provides real-time insights into your tailoring business 
                    operations and helps you make informed decisions.
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Dashboard Benefits
                    </h3>
                    <ul className="space-y-2 text-purple-800">
                      <li>• Real-time business performance monitoring</li>
                      <li>• Quick access to frequently used functions</li>
                      <li>• Visual analytics for better decision making</li>
                      <li>• Centralized view of all business activities</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Dashboard Sections */}
            <div className="space-y-6">
              {dashboardSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                          {section.icon}
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help Navigation */}
            <HelpNavigation />

            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-lg text-green-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-green-800">{tip}</p>
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
                    <Link href="/admin/help/analytics" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Analytics Deep Dive</span>
                      </div>
                    </Link>
                    <Link href="/admin/help/notifications" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Notification Settings</span>
                      </div>
                    </Link>
                    <Link href="/admin/help/customization" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Dashboard Customization</span>
                      </div>
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

export default DashboardHelpPage
