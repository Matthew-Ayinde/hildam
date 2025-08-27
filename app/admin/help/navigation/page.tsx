"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Navigation, Menu, Search, Bell, User, Home, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HelpBreadcrumb from "@/components/admin/help/HelpBreadcrumb"
import HelpNavigation from "@/components/admin/help/HelpNavigation"

const NavigationHelpPage = () => {
  const navigationFeatures = [
    {
      title: "Sidebar Navigation",
      icon: <Menu className="w-6 h-6" />,
      description: "Primary navigation through the main sidebar menu",
      details: [
        "Collapsible sidebar with expandable menu sections",
        "Quick access to all major system functions",
        "Visual indicators for active pages and sections",
        "Mobile-responsive design with hamburger menu",
        "Persistent navigation state across page refreshes"
      ]
    },
    {
      title: "Top Bar Functions",
      icon: <User className="w-6 h-6" />,
      description: "Quick access tools and user account management",
      details: [
        "Help icon: Access this comprehensive help system",
        "Notifications: View system alerts and updates",
        "Profile menu: Account settings and logout options",
        "Welcome message: Personalized greeting and role display",
        "Responsive design: Adapts to different screen sizes"
      ]
    },
    {
      title: "Search & Filters",
      icon: <Search className="w-6 h-6" />,
      description: "Powerful search capabilities across all modules",
      details: [
        "Global search: Find customers, orders, and items quickly",
        "Advanced filters: Narrow results by date, status, or category",
        "Saved searches: Store frequently used search criteria",
        "Quick filters: One-click access to common filter combinations",
        "Search suggestions: Auto-complete for faster searching"
      ]
    },
    {
      title: "Keyboard Shortcuts",
      icon: <Zap className="w-6 h-6" />,
      description: "Speed up your workflow with keyboard shortcuts",
      details: [
        "Ctrl+N: Create new customer, order, or inventory item",
        "Ctrl+F: Open global search functionality",
        "Ctrl+D: Access dashboard from any page",
        "Ctrl+H: Open help system (this page)",
        "Esc: Close modals and dropdown menus"
      ]
    }
  ]

  const navigationTips = [
    "Use breadcrumbs to understand your current location in the system",
    "Bookmark frequently accessed pages in your browser",
    "Learn keyboard shortcuts to speed up common tasks",
    "Use the search function instead of navigating through menus",
    "Keep multiple tabs open for different workflows"
  ]

  const interfaceElements = [
    {
      element: "Sidebar Menu",
      description: "Main navigation with collapsible sections",
      location: "Left side of screen",
      tip: "Click section headers to expand/collapse menu items"
    },
    {
      element: "Top Bar",
      description: "User info, notifications, and quick actions",
      location: "Top of every page",
      tip: "Access help, notifications, and profile settings"
    },
    {
      element: "Breadcrumbs",
      description: "Shows your current location in the system",
      location: "Below top bar on content pages",
      tip: "Click any breadcrumb to navigate back to that level"
    },
    {
      element: "Action Buttons",
      description: "Primary actions for each page or section",
      location: "Top right of content areas",
      tip: "Look for orange buttons for main actions"
    },
    {
      element: "Status Indicators",
      description: "Visual cues for item status and progress",
      location: "Throughout lists and cards",
      tip: "Color-coded badges show status at a glance"
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
              <h1 className="text-3xl font-bold text-gray-900">Navigation Guide</h1>
              <p className="text-gray-600 mt-1">Master the interface and optimize your workflow</p>
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
                <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Navigation className="w-8 h-8" />
                    Interface Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Efficient navigation is key to productivity in the Hildam Couture system. Learn how to 
                    move quickly between sections, use shortcuts, and optimize your workflow for maximum efficiency.
                  </p>
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
                    <h3 className="font-semibold text-teal-900 mb-3">Navigation Features:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-teal-800">
                        <Home className="w-4 h-4" />
                        <span>Intuitive menu structure</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-800">
                        <Search className="w-4 h-4" />
                        <span>Powerful search capabilities</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-800">
                        <Zap className="w-4 h-4" />
                        <span>Keyboard shortcuts</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-800">
                        <Bell className="w-4 h-4" />
                        <span>Smart notifications</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation Features */}
            {/* <div className="space-y-6">
              {navigationFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
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
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div> */}

            {/* Interface Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Interface Elements Guide</CardTitle>
                  <p className="text-gray-600">Understanding key interface components and their functions</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interfaceElements.map((element, index) => (
                      <div key={element.element} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{element.element}</h4>
                          <Badge variant="outline" className="text-xs">
                            {element.location}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{element.description}</p>
                        <p className="text-xs text-teal-700 bg-teal-50 p-2 rounded">
                          💡 {element.tip}
                        </p>
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

            {/* Navigation Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-900">Navigation Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {navigationTips.map((tip, index) => (
                      <div key={index} className="flex gap-3">
                        <Navigation className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-purple-800">{tip}</p>
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
                  <CardTitle className="text-lg text-gray-900">Quick Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/admin" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Dashboard</span>
                    </Link>
                    <Link href="/admin/customers" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Customers</span>
                    </Link>
                    <Link href="/admin/orders" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-900">Orders</span>
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

export default NavigationHelpPage
