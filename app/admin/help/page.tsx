"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import { 
  FaUsers, 
  FaShoppingCart, 
  FaMoneyBillWave,
  FaQuestionCircle 
} from "react-icons/fa"
import { 
  MdDashboard, 
  MdOutlinePayment, 
  MdOutlineInventory2,
  MdOutlineHelp 
} from "react-icons/md"
import { Calendar, BookOpen, Navigation, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const HelpPage = () => {
  const helpSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of navigating and using the Hildam Couture management system",
      icon: <BookOpen className="w-8 h-8" />,
      href: "/admin/help/getting-started",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Dashboard Overview",
      description: "Understand your dashboard metrics, analytics, and key performance indicators",
      icon: <MdDashboard className="w-8 h-8" />,
      href: "/admin/help/dashboard",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Customer Management",
      description: "Complete guide to managing customers, profiles, and customer relationships",
      icon: <FaUsers className="w-8 h-8" />,
      href: "/admin/help/customers",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Order Processing",
      description: "Step-by-step guide to creating, managing, and tracking customer orders",
      icon: <FaShoppingCart className="w-8 h-8" />,
      href: "/admin/help/orders",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      title: "Payment Management",
      description: "Handle payments, invoicing, and financial transactions efficiently",
      icon: <MdOutlinePayment className="w-8 h-8" />,
      href: "/admin/help/payments",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Inventory Control",
      description: "Manage stock levels, inventory requests, and supply chain operations",
      icon: <MdOutlineInventory2 className="w-8 h-8" />,
      href: "/admin/help/inventory",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      title: "Calendar & Scheduling",
      description: "Schedule appointments, manage timelines, and coordinate team activities",
      icon: <Calendar className="w-8 h-8" />,
      href: "/admin/help/calendar",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    },
    {
      title: "Expense Tracking",
      description: "Monitor job expenses, daily costs, and financial reporting",
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      href: "/admin/help/expenses",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600"
    },
    {
      title: "User Management",
      description: "Manage team members, roles, permissions, and user accounts",
      icon: <Settings className="w-8 h-8" />,
      href: "/admin/help/users",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "Navigation Guide",
      description: "Master the interface navigation, shortcuts, and workflow optimization",
      icon: <Navigation className="w-8 h-8" />,
      href: "/admin/help/navigation",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HelpBreadcrumb />
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-2xl">
                <MdOutlineHelp className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help & Documentation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Welcome to the comprehensive help center for Hildam Couture Management System. 
              Find detailed guides, tutorials, and documentation to help you master every aspect of the platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <FaQuestionCircle className="w-8 h-8" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-100 mb-6 text-lg">
                New to the system? Start here for a quick overview of the essential features and workflows.
              </p>
              <Link href="/admin/help/getting-started">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
                >
                  Get Started →
                </motion.button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Sections Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Link href={section.href}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 ${section.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                        <div className={section.textColor}>
                          {section.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {section.description}
                      </p>
                      <div className="mt-4">
                        <span className={`inline-flex items-center text-sm font-medium ${section.textColor}`}>
                          Learn more →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Need Additional Support?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                <p className="text-gray-600 text-sm">
                  Comprehensive guides and API documentation for advanced users
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaQuestionCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">FAQ</h4>
                <p className="text-gray-600 text-sm">
                  Frequently asked questions and common troubleshooting solutions
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdOutlineHelp className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Support</h4>
                <p className="text-gray-600 text-sm">
                  Get in touch with our support team for personalized assistance
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HelpPage
