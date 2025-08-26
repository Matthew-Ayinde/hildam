"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Users, Bell, MapPin, Repeat } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const CalendarHelpPage = () => {
  const calendarFeatures = [
    {
      title: "Appointment Scheduling",
      icon: <Calendar className="w-6 h-6" />,
      description: "Efficient appointment booking and management",
      details: [
        "Schedule consultations, fittings, and delivery appointments",
        "Set appointment duration and buffer times between bookings",
        "Assign specific staff members to appointments",
        "Add detailed notes and preparation requirements",
        "Send automatic appointment confirmations to customers"
      ]
    },
    {
      title: "Time Management",
      icon: <Clock className="w-6 h-6" />,
      description: "Optimize scheduling and resource allocation",
      details: [
        "View daily, weekly, and monthly calendar layouts",
        "Block out time for production work and administrative tasks",
        "Set working hours and availability for different services",
        "Manage multiple staff schedules and availability",
        "Track appointment duration and optimize time slots"
      ]
    },
    {
      title: "Customer Coordination",
      icon: <Users className="w-6 h-6" />,
      description: "Seamless customer communication and scheduling",
      details: [
        "Send appointment reminders via SMS and email",
        "Allow customers to reschedule within defined parameters",
        "Track customer punctuality and no-show patterns",
        "Coordinate group fittings for families or events",
        "Manage special event scheduling and rush orders"
      ]
    },
    {
      title: "Recurring Appointments",
      icon: <Repeat className="w-6 h-6" />,
      description: "Automate regular appointments and follow-ups",
      details: [
        "Set up recurring appointments for regular customers",
        "Schedule follow-up fittings and adjustment appointments",
        "Automate seasonal consultation reminders",
        "Create maintenance schedules for equipment and tools",
        "Plan regular inventory checks and stock assessments"
      ]
    }
  ]

  const appointmentTypes = [
    { type: "Consultation", duration: "30-60 min", description: "Initial customer meeting and design discussion", color: "bg-blue-100 text-blue-800" },
    { type: "Measurement", duration: "20-30 min", description: "Taking detailed body measurements", color: "bg-green-100 text-green-800" },
    { type: "Fitting", duration: "30-45 min", description: "Trying on garments and making adjustments", color: "bg-purple-100 text-purple-800" },
    { type: "Final Fitting", duration: "15-30 min", description: "Last fitting before completion", color: "bg-orange-100 text-orange-800" },
    { type: "Delivery", duration: "15-20 min", description: "Final garment delivery and payment", color: "bg-pink-100 text-pink-800" }
  ]

  const schedulingTips = [
    "Book fittings at least 1 week before delivery dates",
    "Allow extra time for complex garments and first-time customers",
    "Schedule demanding appointments during peak energy hours",
    "Keep buffer time between appointments for unexpected delays",
    "Use color coding to quickly identify different appointment types"
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
              <h1 className="text-3xl font-bold text-gray-900">Calendar & Scheduling</h1>
              <p className="text-gray-600 mt-1">Manage appointments, timelines, and team coordination</p>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Scheduling Made Simple</h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    The calendar system streamlines appointment scheduling, resource allocation, and team coordination. 
                    It helps you maintain optimal workflow while ensuring excellent customer service through 
                    timely appointments and efficient time management.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-pink-50 rounded-xl">
                      <Calendar className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-pink-900">Smart Scheduling</h4>
                      <p className="text-sm text-pink-700">Intelligent appointment booking</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-xl">
                      <Bell className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-pink-900">Auto Reminders</h4>
                      <p className="text-sm text-pink-700">Automated customer notifications</p>
                    </div>
                    <div className="text-center p-4 bg-pink-50 rounded-xl">
                      <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <h4 className="font-semibold text-pink-900">Team Coordination</h4>
                      <p className="text-sm text-pink-700">Multi-staff scheduling</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar Features */}
            <div className="space-y-6">
              {calendarFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
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
                            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Appointment Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Appointment Types</CardTitle>
                  <p className="text-gray-600">Different types of appointments and their typical durations</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointmentTypes.map((appointment, index) => (
                      <div key={appointment.type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge className={`${appointment.color} border-0`}>
                              {appointment.type}
                            </Badge>
                            <span className="text-sm text-gray-600">{appointment.duration}</span>
                          </div>
                          <p className="text-sm text-gray-700">{appointment.description}</p>
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

            {/* Scheduling Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-lg text-green-900">Scheduling Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedulingTips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <Clock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-800">{tip}</p>
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
                    <Link href="/admin/calendar" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">View Calendar</span>
                    </Link>
                    <Link href="/admin/orders" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Schedule from Orders</span>
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

export default CalendarHelpPage
