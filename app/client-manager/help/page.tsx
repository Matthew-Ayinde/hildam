"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Users,
  MessageSquare,
  Calendar,
  FileText,
  BookOpen,
  Phone,
  Mail,
  Settings
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GlobalBreadcrumb from "@/components/GlobalBreadcrumb"

const ClientManagerHelpPage = () => {
  const helpSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of managing client relationships and communications",
      icon: <BookOpen className="w-8 h-8" />,
      href: "/client-manager/help/getting-started",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Client Management",
      description: "Manage client profiles, preferences, and relationship history",
      icon: <Users className="w-8 h-8" />,
      href: "/client-manager/help/clients",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Communication Tools",
      description: "Use messaging, email, and phone systems to stay connected with clients",
      icon: <MessageSquare className="w-8 h-8" />,
      href: "/client-manager/help/communication",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Appointment Scheduling",
      description: "Schedule consultations, fittings, and follow-up appointments",
      icon: <Calendar className="w-8 h-8" />,
      href: "/client-manager/help/appointments",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      title: "Reports & Analytics",
      description: "Generate client reports and analyze relationship metrics",
      icon: <FileText className="w-8 h-8" />,
      href: "/client-manager/help/reports",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-soft">
      <GlobalBreadcrumb />
      
      {/* Header Section */}
      <div className="bg-white shadow-soft border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-elegant">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Client Manager Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Master client relationship management with comprehensive guides for building lasting 
              relationships, managing communications, and ensuring exceptional client experiences.
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
          <Card className="card-floating bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="w-8 h-8" />
                Client Relationship Excellence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-6 text-lg">
                As a Client Manager, you are the primary point of contact for our valued clients. 
                Your role focuses on building relationships, managing communications, and ensuring 
                exceptional service delivery.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <Phone className="w-8 h-8 mb-2" />
                  <h4 className="font-semibold mb-1">Client Communication</h4>
                  <p className="text-sm text-green-100">Maintain regular contact and updates</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <Calendar className="w-8 h-8 mb-2" />
                  <h4 className="font-semibold mb-1">Appointment Coordination</h4>
                  <p className="text-sm text-green-100">Schedule and manage client meetings</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <FileText className="w-8 h-8 mb-2" />
                  <h4 className="font-semibold mb-1">Relationship Tracking</h4>
                  <p className="text-sm text-green-100">Monitor client satisfaction and feedback</p>
                </div>
              </div>
              <Link href="/client-manager/help/getting-started">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary-enhanced mt-6"
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
                  <Card className="card-enhanced h-full hover:shadow-floating transition-all duration-300 cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 ${section.bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-soft`}>
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
          <div className="card-floating p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Quick Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/client-manager/clients" className="text-center group">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors shadow-soft">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Manage Clients</h4>
                <p className="text-gray-600 text-sm">
                  View and manage all client relationships
                </p>
              </Link>
              <Link href="/client-manager/communications" className="text-center group">
                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors shadow-soft">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Communications</h4>
                <p className="text-gray-600 text-sm">
                  Send messages and track communications
                </p>
              </Link>
              <Link href="/client-manager/appointments" className="text-center group">
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-100 transition-colors shadow-soft">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Appointments</h4>
                <p className="text-gray-600 text-sm">
                  Schedule and manage client appointments
                </p>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ClientManagerHelpPage
