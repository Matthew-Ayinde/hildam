"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface KeyboardShortcuts {
  [key: string]: () => void
}

export const useKeyboardShortcuts = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in input fields
      const isInputFocused = 
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.contentEditable === 'true'

      if (isInputFocused) return

      // Define keyboard shortcuts
      const shortcuts: KeyboardShortcuts = {
        // Ctrl+H - Open Help
        'ctrl+h': () => {
          event.preventDefault()
          const currentRole = getCurrentRole()
          router.push(`/${currentRole}/help`)
        },
        
        // Ctrl+D - Go to Dashboard
        'ctrl+d': () => {
          event.preventDefault()
          const currentRole = getCurrentRole()
          router.push(`/${currentRole}`)
        },
        
        // Ctrl+N - Create New (context-dependent)
        'ctrl+n': () => {
          event.preventDefault()
          handleCreateNew()
        },
        
        // Ctrl+F - Focus Search (if search exists on page)
        'ctrl+f': () => {
          event.preventDefault()
          focusSearch()
        },
        
        // Escape - Close modals/dropdowns
        'escape': () => {
          closeModalsAndDropdowns()
        },
        
        // Ctrl+/ - Show keyboard shortcuts help
        'ctrl+/': () => {
          event.preventDefault()
          setShowShortcutsModal(true)
        }
      }

      // Create shortcut key from event
      const key = createShortcutKey(event)
      
      // Execute shortcut if it exists
      if (shortcuts[key]) {
        shortcuts[key]()
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [router, pathname])

  // Return modal state for the provider to render
  return {
    showShortcutsModal,
    setShowShortcutsModal
  }

  // Helper function to get current role from pathname
  const getCurrentRole = (): string => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    if (pathSegments.length > 0) {
      const role = pathSegments[0]
      // Map role paths to actual roles
      const roleMap: { [key: string]: string } = {
        'admin': 'admin',
        'head-of-tailoring': 'head-of-tailoring',
        'h-o-t': 'admin/h-o-t', // Special case for head of tailoring in admin
        'tailor': 'tailor',
        'receptionist': 'receptionist'
      }
      return roleMap[role] || 'admin'
    }
    return 'admin'
  }

  // Helper function to create shortcut key string
  const createShortcutKey = (event: KeyboardEvent): string => {
    const parts: string[] = []
    
    if (event.ctrlKey || event.metaKey) parts.push('ctrl')
    if (event.altKey) parts.push('alt')
    if (event.shiftKey) parts.push('shift')
    
    // Handle special keys
    const specialKeys: { [key: string]: string } = {
      'Escape': 'escape',
      '/': '/',
      ' ': 'space'
    }
    
    const key = specialKeys[event.key] || event.key.toLowerCase()
    parts.push(key)
    
    return parts.join('+')
  }

  // Handle context-dependent "Create New" action
  const handleCreateNew = () => {
    const currentPath = pathname.toLowerCase()
    
    if (currentPath.includes('customer')) {
      router.push(`/${getCurrentRole()}/customers/create`)
    } else if (currentPath.includes('order')) {
      router.push(`/${getCurrentRole()}/orders/create`)
    } else if (currentPath.includes('inventory')) {
      router.push(`/${getCurrentRole()}/inventory/create`)
    } else if (currentPath.includes('user')) {
      router.push(`/${getCurrentRole()}/users/create`)
    } else {
      // Default to customer creation
      router.push(`/${getCurrentRole()}/customers/create`)
    }
  }

  // Focus search input if it exists
  const focusSearch = () => {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i], input[placeholder*="Search" i]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
      searchInput.select()
    }
  }

  // Close modals and dropdowns
  const closeModalsAndDropdowns = () => {
    // Trigger escape key event for components that listen to it
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      which: 27,
      bubbles: true
    })
    document.dispatchEvent(escapeEvent)
    
    // Also try to close any open modals by clicking backdrop
    const backdrops = document.querySelectorAll('[data-backdrop="true"], .modal-backdrop, .overlay')
    backdrops.forEach(backdrop => {
      if (backdrop instanceof HTMLElement) {
        backdrop.click()
      }
    })
  }


}

// Export shortcut information for documentation
export const KEYBOARD_SHORTCUTS = {
  'Ctrl+H': 'Open Help System',
  'Ctrl+D': 'Go to Dashboard',
  'Ctrl+N': 'Create New (context-dependent)',
  'Ctrl+F': 'Focus Search Input',
  'Escape': 'Close Modals and Dropdowns',
  'Ctrl+/': 'Show Keyboard Shortcuts'
} as const
