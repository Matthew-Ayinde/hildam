"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"

const HelpBreadcrumb = () => {
  const pathname = usePathname()
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs = []
    
    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: "/admin",
      icon: <Home className="w-4 h-4" />
    })
    
    // Add Help section
    if (pathSegments.includes('help')) {
      breadcrumbs.push({
        label: "Help",
        href: "/admin/help",
        icon: <HelpCircle className="w-4 h-4" />
      })
    }
    
    // Add specific help section if we're in a subsection
    if (pathSegments.length > 2 && pathSegments[0] === 'admin' && pathSegments[1] === 'help') {
      const section = pathSegments[2]
      const sectionLabels: Record<string, string> = {
        'getting-started': 'Getting Started',
        'dashboard': 'Dashboard',
        'customers': 'Customers',
        'orders': 'Orders',
        'payments': 'Payments',
        'inventory': 'Inventory',
        'calendar': 'Calendar',
        'expenses': 'Expenses',
        'users': 'Users',
        'navigation': 'Navigation'
      }
      
      if (sectionLabels[section]) {
        breadcrumbs.push({
          label: sectionLabels[section],
          href: `/admin/help/${section}`,
          icon: null
        })
      }
    }
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border-b border-gray-200 px-6 py-4"
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
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-orange-600 bg-orange-50 font-medium"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
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

export default HelpBreadcrumb
