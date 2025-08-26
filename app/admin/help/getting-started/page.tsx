"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Play, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const GettingStartedPage = () => {
  const quickSteps = [
    {
      step: 1,
      title: "Explore Your Dashboard",
      description: "Start by familiarizing yourself with the main dashboard. View key metrics, recent activities, and system overview.",
      time: "2 min",
      link: "/admin/help/dashboard"
    },
    {
      step: 2,
      title: "Set Up Customer Profiles",
      description: "Learn how to add and manage customer information, preferences, and contact details.",
      time: "5 min",
      link: "/admin/help/customers"
    },
    {
      step: 3,
      title: "Create Your First Order",
      description: "Walk through the complete order creation process from customer selection to final confirmation.",
      time: "8 min",
      link: "/admin/help/orders"
    },
    {
      step: 4,
      title: "Manage Inventory",
      description: "Understand how to track stock levels, manage inventory requests, and maintain supply chain efficiency.",
      time: "6 min",
      link: "/admin/help/inventory"
    }
  ]

  const keyFeatures = [
    {
      title: "Real-time Notifications",
      description: "Stay updated with instant notifications for orders, payments, and inventory changes."
    },
    {
      title: "Advanced Analytics",
      description: "Monitor business performance with comprehensive charts and reporting tools."
    },
    {
      title: "Streamlined Workflows",
      description: "Efficient processes designed specifically for tailoring and couture businesses."
    },
    {
      title: "Team Collaboration",
      description: "Coordinate with your team through integrated communication and task management."
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
              <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
              <p className="text-gray-600 mt-1">Your complete guide to using Hildam Couture Management System</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Play className="w-8 h-8" />
                    Welcome to Hildam Couture
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Hildam Couture Management System is designed to streamline your tailoring business operations. 
                    From customer management to order processing, inventory control to financial tracking, 
                    our platform provides everything you need to run your couture business efficiently.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">What you can do with this system:</h3>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Manage customer profiles and preferences
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Process orders from consultation to delivery
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Track payments and generate invoices
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Monitor inventory and supply chain
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Schedule appointments and manage calendar
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Track expenses and analyze business performance
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Start Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Quick Start in 4 Steps</CardTitle>
                  <p className="text-gray-600">Follow these steps to get up and running quickly</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {quickSteps.map((step, index) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="flex gap-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                            {step.step}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {step.time}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{step.description}</p>
                          <Link href={step.link}>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                            >
                              Learn more →
                            </motion.button>
                          </Link>
                        </div>
                      </motion.div>
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
            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {keyFeatures.map((feature, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation Help */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Need Help Navigating?</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Learn about the interface, shortcuts, and navigation tips
                    </p>
                    <Link href="/admin/help/navigation">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                      >
                        Navigation Guide
                      </motion.button>
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

export default GettingStartedPage
