"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Keyboard, Command } from "lucide-react"
import { KEYBOARD_SHORTCUTS } from "@/hooks/useKeyboardShortcuts"

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const KeyboardShortcutsModal = ({ isOpen, onClose }: KeyboardShortcutsModalProps) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-dark"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="card-floating max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Keyboard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h2>
                <p className="text-sm text-gray-600">Speed up your workflow with these shortcuts</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(KEYBOARD_SHORTCUTS).map(([shortcut, description]) => (
                <motion.div
                  key={shortcut}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700 font-medium">{description}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.split('+').map((key, index) => (
                      <div key={index} className="flex items-center gap-1">
                        {index > 0 && <span className="text-gray-400 text-sm">+</span>}
                        <kbd className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-600 shadow-sm">
                          {key === 'ctrl' ? (
                            <div className="flex items-center gap-1">
                              <Command className="w-3 h-3" />
                              <span>Ctrl</span>
                            </div>
                          ) : (
                            key.toUpperCase()
                          )}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Shortcuts work when you're not typing in input fields</li>
                <li>• Use Ctrl+/ anytime to see this help</li>
                <li>• Escape key closes modals and dropdowns</li>
                <li>• Context-dependent shortcuts adapt to your current page</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default KeyboardShortcutsModal
