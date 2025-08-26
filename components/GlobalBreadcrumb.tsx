"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, Users, ShoppingCart, DollarSign, Package, Calendar, Receipt, Settings, HelpCircle, User } from "lucide-react"
import { motion } from "framer-motion"
import { FaUsers, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa"
import { MdDashboard, MdOutlinePayment, MdOutlineInventory2 } from "react-icons/md"

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ReactNode
}

const GlobalBreadcrumb = () => {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on login page or root
  if (pathname === '/login' || pathname === '/') {
    return null
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs: BreadcrumbItem[] = []
    
    // Define route mappings with icons
    const routeConfig: Record<string, { label: string; icon?: React.ReactNode }> = {
      'admin': { label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
      'h-o-t': { label: 'Head of Tailoring', icon: <MdDashboard className="w-4 h-4" /> },
      'customers': { label: 'Customers', icon: <FaUsers className="w-4 h-4" /> },
      'orders': { label: 'Orders', icon: <FaShoppingCart className="w-4 h-4" /> },
      'payments': { label: 'Payments', icon: <MdOutlinePayment className="w-4 h-4" /> },
      'inventory': { label: 'Inventory', icon: <MdOutlineInventory2 className="w-4 h-4" /> },
      'calendar': { label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
      'expenses': { label: 'Expenses', icon: <FaMoneyBillWave className="w-4 h-4" /> },
      'users': { label: 'Users', icon: <User className="w-4 h-4" /> },
      'help': { label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
      'notifications': { label: 'Notifications', icon: <Receipt className="w-4 h-4" /> },
      'create': { label: 'Create New' },
      'edit': { label: 'Edit' },
      'getting-started': { label: 'Getting Started' },
      'dashboard': { label: 'Dashboard Overview' },
      'navigation': { label: 'Navigation Guide' },
      'daily-expenses': { label: 'Daily Expenses' },
      'job-expenses': { label: 'Job Expenses' },
      'requests': { label: 'Requests' },
      'joblists': { label: 'Job Lists' },
      'tailorjoblists': { label: 'Tailor Job Lists' },
      'analytics': { label: 'Analytics' },
      'list': { label: 'List View' }
    }

    // Build breadcrumbs from path segments
    let currentPath = ''
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip numeric IDs in breadcrumbs (show as "Details" instead)
      if (/^\d+$/.test(segment)) {
        breadcrumbs.push({
          label: 'Details',
          href: currentPath,
          icon: <Settings className="w-4 h-4" />
        })
        return
      }
      
      const config = routeConfig[segment]
      if (config) {
        breadcrumbs.push({
          label: config.label,
          href: currentPath,
          icon: config.icon
        })
      } else {
        // Fallback for unknown segments
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: currentPath
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't render if no breadcrumbs or only one item
  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="backdrop-enhanced border-b border-gray-200/60 px-6 py-4 sticky top-0 z-40 shadow-soft"
    >
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
              <Link href={crumb.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    index === breadcrumbs.length - 1
                      ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-100/80 font-medium shadow-soft border border-orange-200/50"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/60 hover:shadow-soft"
                  }`}
                >
                  {crumb.icon}
                  <span>{crumb.label}</span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </motion.nav>
  )
}

export default GlobalBreadcrumb
