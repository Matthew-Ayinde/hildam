"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Users, UserPlus, Search, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const CustomersHelpPage = () => {
  const customerFeatures = [
    {
      title: "Customer Profiles",
      icon: <Users className="w-6 h-6" />,
      description: "Comprehensive customer information management",
      details: [
        "Personal information: Name, contact details, and preferences",
        "Measurement records: Body measurements for tailoring accuracy",
        "Order history: Complete record of past orders and services",
        "Payment history: Track payment patterns and outstanding balances",
        "Notes and preferences: Special requirements and customer preferences"
      ]
    },
    {
      title: "Adding New Customers",
      icon: <UserPlus className="w-6 h-6" />,
      description: "Step-by-step process for customer registration",
      details: [
        "Navigate to Customers → Add Customer from the sidebar",
        "Fill in required fields: Name, phone number, and email address",
        "Add optional information: Address, date of birth, and preferences",
        "Upload customer photo for easy identification (optional)",
        "Save the profile and start taking measurements or creating orders"
      ]
    },
    {
      title: "Customer Search & Filtering",
      icon: <Search className="w-6 h-6" />,
      description: "Efficiently find and organize customer information",
      details: [
        "Use the search bar to find customers by name, phone, or email",
        "Filter customers by registration date, order status, or location",
        "Sort customer list by name, recent activity, or total orders",
        "Use advanced filters for specific customer segments",
        "Export customer lists for external use or reporting"
      ]
    },
    {
      title: "Customer Management",
      icon: <Edit className="w-6 h-6" />,
      description: "Update and maintain customer information",
      details: [
        "Edit customer details by clicking the edit button on customer cards",
        "Update measurements when customers require new fittings",
        "Add notes about customer preferences or special requirements",
        "Manage customer communication preferences and contact methods",
        "Archive inactive customers while preserving historical data"
      ]
    }
  ]

  const bestPractices = [
    {
      title: "Data Accuracy",
      tip: "Always verify customer contact information during each visit to ensure accurate communication."
    },
    {
      title: "Measurement Updates",
      tip: "Update customer measurements regularly, especially for growing children or customers with weight changes."
    },
    {
      title: "Preference Tracking",
      tip: "Document customer style preferences, fabric choices, and fit preferences for personalized service."
    },
    {
      title: "Communication Log",
      tip: "Keep detailed notes of customer interactions, special requests, and delivery preferences."
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
              <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-1">Complete guide to managing customer relationships and profiles</p>
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
                <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    Customer Management Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The customer management system is the heart of your tailoring business. It allows you to 
                    maintain detailed profiles, track customer preferences, manage measurements, and build 
                    lasting relationships with your clientele.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-green-900">Contact Management</h4>
                      <p className="text-sm text-green-700">Phone, email, and address tracking</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <Edit className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-green-900">Measurement Records</h4>
                      <p className="text-sm text-green-700">Detailed body measurements and sizing</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-green-900">Relationship Building</h4>
                      <p className="text-sm text-green-700">Preferences and service history</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature Sections */}
            <div className="space-y-6">
              {customerFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                          {feature.icon}
                        </div>
                        {feature.title}
                      </CardTitle>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {feature.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
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

            {/* Best Practices */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bestPractices.map((practice, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-blue-900 mb-1">{practice.title}</h4>
                        <p className="text-sm text-blue-800">{practice.tip}</p>
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
                    <Link href="/admin/customers/create" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <UserPlus className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Add New Customer</span>
                      </div>
                    </Link>
                    <Link href="/admin/customers" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">View All Customers</span>
                      </div>
                    </Link>
                    <Link href="/admin/help/orders" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Edit className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Creating Orders</span>
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

export default CustomersHelpPage
