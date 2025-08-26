"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Users, UserPlus, Shield, Settings, Key, UserCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const UsersHelpPage = () => {
  const userFeatures = [
    {
      title: "User Account Management",
      icon: <Users className="w-6 h-6" />,
      description: "Create and manage team member accounts",
      details: [
        "Add new team members with appropriate access levels",
        "Update user profiles, contact information, and roles",
        "Deactivate or remove user accounts when needed",
        "Reset passwords and manage account security",
        "Track user activity and login history"
      ]
    },
    {
      title: "Role-Based Access Control",
      icon: <Shield className="w-6 h-6" />,
      description: "Manage permissions and access levels",
      details: [
        "Administrator: Full system access and management capabilities",
        "Head of Tailoring: Production oversight and team coordination",
        "Tailor: Order processing and customer interaction access",
        "Receptionist: Customer service and appointment scheduling",
        "Accountant: Financial data access and reporting tools"
      ]
    },
    {
      title: "Security Settings",
      icon: <Key className="w-6 h-6" />,
      description: "Maintain system security and user authentication",
      details: [
        "Enforce strong password requirements and policies",
        "Set up two-factor authentication for enhanced security",
        "Monitor failed login attempts and suspicious activity",
        "Configure session timeouts and automatic logouts",
        "Manage API access and integration permissions"
      ]
    },
    {
      title: "User Permissions",
      icon: <UserCheck className="w-6 h-6" />,
      description: "Fine-tune access controls for different functions",
      details: [
        "Customer data: View, edit, create, or delete permissions",
        "Order management: Processing, status updates, and modifications",
        "Financial access: Payment processing and financial reporting",
        "Inventory control: Stock updates and request approvals",
        "System settings: Configuration and administrative functions"
      ]
    }
  ]

  const userRoles = [
    { 
      role: "Administrator", 
      description: "Complete system access and management", 
      color: "bg-red-100 text-red-800",
      permissions: ["All system functions", "User management", "System configuration", "Financial oversight"]
    },
    { 
      role: "Head of Tailoring", 
      description: "Production oversight and team coordination", 
      color: "bg-purple-100 text-purple-800",
      permissions: ["Order management", "Team scheduling", "Quality control", "Production reports"]
    },
    { 
      role: "Tailor", 
      description: "Order processing and customer interaction", 
      color: "bg-blue-100 text-blue-800",
      permissions: ["Order updates", "Customer communication", "Inventory requests", "Time tracking"]
    },
    { 
      role: "Receptionist", 
      description: "Customer service and appointment scheduling", 
      color: "bg-green-100 text-green-800",
      permissions: ["Customer management", "Appointment scheduling", "Basic order info", "Payment processing"]
    }
  ]

  const securityTips = [
    "Regularly review user access and remove unnecessary permissions",
    "Enforce password changes every 90 days for security",
    "Monitor user activity logs for unusual access patterns",
    "Provide security training for all team members",
    "Use role-based access to limit data exposure"
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
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage team members, roles, and system access</p>
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
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    Team & Access Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    User management ensures that each team member has appropriate access to system functions 
                    based on their role and responsibilities. This maintains security while enabling efficient 
                    collaboration across your tailoring business.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="font-semibold text-red-900 mb-3">Security & Access Control:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-red-800">
                        <Shield className="w-4 h-4" />
                        <span>Role-based permissions</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-800">
                        <Key className="w-4 h-4" />
                        <span>Secure authentication</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-800">
                        <UserCheck className="w-4 h-4" />
                        <span>Activity monitoring</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-800">
                        <Settings className="w-4 h-4" />
                        <span>Flexible configuration</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* User Features */}
            <div className="space-y-6">
              {userFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
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
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* User Roles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">User Roles & Permissions</CardTitle>
                  <p className="text-gray-600">Understanding different access levels and capabilities</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userRoles.map((role, index) => (
                      <div key={role.role} className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={`${role.color} border-0`}>
                            {role.role}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-4">{role.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {role.permissions.map((permission, permIndex) => (
                            <div key={permIndex} className="flex items-center gap-2 text-sm text-gray-600">
                              <UserCheck className="w-3 h-3 text-green-500" />
                              {permission}
                            </div>
                          ))}
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

            {/* Security Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-900">Security Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityTips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <Shield className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-orange-800">{tip}</p>
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
                    <Link href="/admin/users" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">View All Users</span>
                    </Link>
                    <Link href="/admin/users/create" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Add New User</span>
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

export default UsersHelpPage
