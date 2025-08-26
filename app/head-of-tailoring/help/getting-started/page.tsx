"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Users, Briefcase, Calendar, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import GlobalBreadcrumb from "@/components/GlobalBreadcrumb"

const HeadOfTailoringGettingStartedPage = () => {
  const quickSteps = [
    {
      step: 1,
      title: "Review Active Jobs",
      description: "Start by checking all active tailoring jobs and their current status. Prioritize urgent orders and identify any bottlenecks.",
      time: "5 min",
      link: "/head-of-tailoring/help/jobs"
    },
    {
      step: 2,
      title: "Coordinate Team Schedule",
      description: "Review team availability, assign jobs to tailors, and schedule important fittings and deadlines.",
      time: "10 min",
      link: "/head-of-tailoring/help/calendar"
    },
    {
      step: 3,
      title: "Process Inventory Requests",
      description: "Review and approve pending inventory requests to ensure materials are available for production.",
      time: "8 min",
      link: "/head-of-tailoring/help/inventory"
    },
    {
      step: 4,
      title: "Quality Control Check",
      description: "Inspect completed work, approve finished garments, and ensure quality standards are maintained.",
      time: "15 min",
      link: "/head-of-tailoring/help/quality"
    }
  ]

  const keyResponsibilities = [
    {
      title: "Production Oversight",
      description: "Monitor all tailoring activities and ensure timely completion of orders."
    },
    {
      title: "Team Coordination",
      description: "Assign tasks, manage schedules, and support team members as needed."
    },
    {
      title: "Quality Assurance",
      description: "Maintain high standards and approve all completed garments before delivery."
    },
    {
      title: "Resource Management",
      description: "Ensure adequate materials and tools are available for production needs."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <GlobalBreadcrumb />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/head-of-tailoring/help">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Getting Started as Head of Tailoring</h1>
              <p className="text-gray-600 mt-1">Your complete guide to managing production and leading your team</p>
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
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    Welcome to Production Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    As Head of Tailoring, you are the backbone of our production process. Your role involves 
                    coordinating team activities, ensuring quality standards, managing schedules, and 
                    maintaining smooth workflow from order receipt to final delivery.
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">Your Key Areas of Impact:</h3>
                    <ul className="space-y-2 text-purple-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Production planning and workflow optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Team leadership and task assignment
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Quality control and final approvals
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Resource allocation and inventory management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-600" />
                        Customer satisfaction and delivery timelines
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
                  <CardTitle className="text-2xl text-gray-900">Daily Workflow in 4 Steps</CardTitle>
                  <p className="text-gray-600">Follow this routine to maintain efficient production management</p>
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
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
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
                              className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1"
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
            {/* Key Responsibilities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Key Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {keyResponsibilities.map((responsibility, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">{responsibility.title}</h4>
                        <p className="text-sm text-gray-600">{responsibility.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Access */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Ready to Start?</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Jump directly to your main work areas
                    </p>
                    <div className="space-y-2">
                      <Link href="/head-of-tailoring/jobs">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                        >
                          View Jobs
                        </motion.button>
                      </Link>
                      <Link href="/head-of-tailoring/calendar">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                        >
                          Team Schedule
                        </motion.button>
                      </Link>
                    </div>
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

export default HeadOfTailoringGettingStartedPage
