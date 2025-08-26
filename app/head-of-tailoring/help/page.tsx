"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Calendar,
  Package,
  Briefcase,
  Bell,
  BookOpen,
  Settings,
  Users,
  Clock,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GlobalBreadcrumb from "@/components/GlobalBreadcrumb"

const HeadOfTailoringHelpPage = () => {
  const helpSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of managing your tailoring team and production workflow",
      icon: <BookOpen className="w-8 h-8" />,
      href: "/head-of-tailoring/help/getting-started",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Job Management",
      description: "Oversee tailoring jobs, assign tasks, and track production progress",
      icon: <Briefcase className="w-8 h-8" />,
      href: "/head-of-tailoring/help/jobs",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Team Scheduling",
      description: "Manage team schedules, appointments, and coordinate production timelines",
      icon: <Calendar className="w-8 h-8" />,
      href: "/head-of-tailoring/help/calendar",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Inventory Requests",
      description: "Handle inventory requests, approve materials, and manage stock levels",
      icon: <Package className="w-8 h-8" />,
      href: "/head-of-tailoring/help/inventory",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      title: "Quality Control",
      description: "Ensure quality standards, manage inspections, and approve completed work",
      icon: <CheckCircle className="w-8 h-8" />,
      href: "/head-of-tailoring/help/quality",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Team Communication",
      description: "Coordinate with team members, manage notifications, and track updates",
      icon: <Bell className="w-8 h-8" />,
      href: "/head-of-tailoring/help/communication",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <GlobalBreadcrumb />
      
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
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl">
                <Settings className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Head of Tailoring Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Master your role as Head of Tailoring with comprehensive guides for managing production, 
              coordinating teams, and ensuring quality delivery of all tailoring projects.
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
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Users className="w-8 h-8" />
                Production Management Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 mb-6 text-lg">
                As Head of Tailoring, you oversee the entire production process, manage team schedules, 
                and ensure quality standards are met for all customer orders.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <Clock className="w-8 h-8 mb-2" />
                  <h4 className="font-semibold mb-1">Production Planning</h4>
                  <p className="text-sm text-purple-100">Schedule and coordinate all tailoring activities</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <Users className="w-8 h-8 mb-2" />
                  <h4 className="font-semibold mb-1">Team Management</h4>
                  <p className="text-sm text-purple-100">Assign tasks and monitor team performance</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <h4 className="font-semibold mb-1">Quality Assurance</h4>
                  <p className="text-sm text-purple-100">Maintain high standards and approve deliveries</p>
                </div>
              </div>
              <Link href="/head-of-tailoring/help/getting-started">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors mt-6"
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
              Quick Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/head-of-tailoring/jobs" className="text-center group">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Manage Jobs</h4>
                <p className="text-gray-600 text-sm">
                  View and manage all active tailoring jobs
                </p>
              </Link>
              <Link href="/head-of-tailoring/calendar" className="text-center group">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Team Schedule</h4>
                <p className="text-gray-600 text-sm">
                  Coordinate team schedules and appointments
                </p>
              </Link>
              <Link href="/head-of-tailoring/inventory-requests" className="text-center group">
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition-colors">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Inventory Requests</h4>
                <p className="text-gray-600 text-sm">
                  Review and approve inventory requests
                </p>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeadOfTailoringHelpPage
