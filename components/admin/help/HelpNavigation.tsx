"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  FaUsers, 
  FaShoppingCart, 
  FaMoneyBillWave 
} from "react-icons/fa"
import { 
  MdDashboard, 
  MdOutlinePayment, 
  MdOutlineInventory2 
} from "react-icons/md"
import { Calendar, BookOpen, Navigation, Settings, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const HelpNavigation = () => {
  const pathname = usePathname()
  
  const helpSections = [
    {
      title: "Getting Started",
      href: "/admin/help/getting-started",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      title: "Dashboard",
      href: "/admin/help/dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      color: "text-purple-600"
    },
    {
      title: "Customers",
      href: "/admin/help/customers",
      icon: <FaUsers className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      title: "Orders",
      href: "/admin/help/orders",
      icon: <FaShoppingCart className="w-5 h-5" />,
      color: "text-orange-600"
    },
    {
      title: "Payments",
      href: "/admin/help/payments",
      icon: <MdOutlinePayment className="w-5 h-5" />,
      color: "text-emerald-600"
    },
    {
      title: "Inventory",
      href: "/admin/help/inventory",
      icon: <MdOutlineInventory2 className="w-5 h-5" />,
      color: "text-indigo-600"
    },
    {
      title: "Calendar",
      href: "/admin/help/calendar",
      icon: <Calendar className="w-5 h-5" />,
      color: "text-pink-600"
    },
    {
      title: "Expenses",
      href: "/admin/help/expenses",
      icon: <FaMoneyBillWave className="w-5 h-5" />,
      color: "text-yellow-600"
    },
    {
      title: "Users",
      href: "/admin/help/users",
      icon: <Settings className="w-5 h-5" />,
      color: "text-red-600"
    },
    {
      title: "Navigation",
      href: "/admin/help/navigation",
      icon: <Navigation className="w-5 h-5" />,
      color: "text-teal-600"
    }
  ]

  const isActive = (href: string) => pathname === href

  return (
    <Card className="card-floating sticky top-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl shadow-soft">
            <BookOpen className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Help Topics</h3>
        </div>
        
        {/* Back to Main Help */}
        <Link href="/admin/help" className="block mb-4">
          <motion.div
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              pathname === "/admin/help"
                ? "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 shadow-soft"
                : "hover:bg-gray-100 text-gray-700 hover:shadow-soft"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Help Home</span>
          </motion.div>
        </Link>

        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-1">
            {helpSections.map((section, index) => (
              <Link key={section.href} href={section.href}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive(section.href)
                      ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className={section.color}>
                    {section.icon}
                  </div>
                  <span className="text-sm font-medium">{section.title}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Link href="/admin" className="block">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <MdDashboard className="w-4 h-4" />
                <span className="text-sm">Back to Dashboard</span>
              </motion.div>
            </Link>
            <Link href="/admin/customers" className="block">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <FaUsers className="w-4 h-4" />
                <span className="text-sm">Manage Customers</span>
              </motion.div>
            </Link>
            <Link href="/admin/orders" className="block">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <FaShoppingCart className="w-4 h-4" />
                <span className="text-sm">View Orders</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default HelpNavigation
