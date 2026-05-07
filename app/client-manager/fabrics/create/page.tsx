"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { IoArrowBack, IoCalendarOutline, IoCloudUploadOutline, IoDocumentTextOutline, IoPeopleOutline, IoCheckmark, IoChevronDown } from "react-icons/io5"
import Spinner from "@/components/Spinner"
import { createFabric, fetchAllCustomers, fetchAllUsersForClient } from "@/app/api/apiClient"

/**
 * Customer data structure from API
 */
interface Customer {
  id: number
  name: string
  email?: string | null
  phone_number?: string
  gender?: string
  customer_description?: string
  [key: string]: any
}

/**
 * User/Staff data structure from API
 */
interface Staff {
  id: number
  name: string
  email: string
  role: "admin" | "client manager" | "head of tailoring" | "tailor"
}

/**
 * Processed customer option for UI
 */
interface CustomerOption {
  id: string
  name: string
  displayText: string
}

/**
 * Processed staff option for UI
 */
interface StaffOption {
  id: string
  name: string
  email: string
  role: string
  displayText: string
}

export default function AdminCreateFabricPage() {
  const router = useRouter()
  const customerInputRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  // Data state
  const [customers, setCustomers] = useState<CustomerOption[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffOption[]>([])
  const [isLoadingLookups, setIsLoadingLookups] = useState(true)
  
  // Customer autocomplete state
  const [customerQuery, setCustomerQuery] = useState("")
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false)
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerOption[]>([])
  const [customerHighlightedIndex, setCustomerHighlightedIndex] = useState<number>(-1)
  
  // Form state
  const [formData, setFormData] = useState({
    customer_id: "",
    description: "",
    received_by_staff_id: "",
    dropped_off_at: "",
    fabric_images: [] as File[],
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<"success" | "error">("success")

  /**
   * Filter customers based on search query
   * Matches both name and ID with priority to name prefix matches
   */
  const getCustomerSuggestions = useCallback((query: string): CustomerOption[] => {
    if (!query.trim()) {
      return customers.slice(0, 8)
    }

    const normalizedQuery = query.trim().toLowerCase()
    
    const matches = customers.filter((customer) => {
      const matchesName = customer.name.toLowerCase().includes(normalizedQuery)
      const matchesId = customer.id.toLowerCase().includes(normalizedQuery)
      return matchesName || matchesId
    })

    // Sort by relevance: name prefix matches first, then contains matches
    return matches.sort((a, b) => {
      const aNameStarts = a.name.toLowerCase().startsWith(normalizedQuery)
      const bNameStarts = b.name.toLowerCase().startsWith(normalizedQuery)
      if (aNameStarts && !bNameStarts) return -1
      if (!aNameStarts && bNameStarts) return 1
      return 0
    }).slice(0, 10)
  }, [customers])

  /**
   * Load customers and staff from API
   */
  useEffect(() => {
    const loadLookups = async () => {
      setIsLoadingLookups(true)
      try {
        const [customerResult, userResult] = await Promise.all([
          fetchAllCustomers(),
          fetchAllUsersForClient(),
        ])

        // Process customers
        const customerOptions: CustomerOption[] = (customerResult || []).map((item: Customer) => ({
          id: String(item.id),
          name: item.name || `Customer #${item.id}`,
          displayText: `${item.name}${item.phone_number ? ` • ${item.phone_number}` : ""}`,
        }))

        // Process staff
        const users: Staff[] = (userResult?.data || [])
        const staffOptions: StaffOption[] = users.map((item: Staff) => ({
          id: String(item.id),
          name: item.name || `Staff #${item.id}`,
          email: item.email || "",
          role: item.role || "",
          displayText: `${item.name} (${item.role})`,
        }))

        setCustomers(customerOptions)
        setStaffMembers(staffOptions)
      } catch (error) {
        console.error("Failed to load lookup data:", error)
        setStatusMessage("Unable to load customers/staff. Please refresh and try again.")
        setStatusType("error")
      } finally {
        setIsLoadingLookups(false)
      }
    }

    loadLookups()
  }, [])

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerInputRef.current && !customerInputRef.current.contains(event.target as Node)) {
        setShowCustomerSuggestions(false)
        setCustomerHighlightedIndex(-1)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const selectedFilesText = useMemo(() => {
    if (formData.fabric_images.length === 0) return "No files selected"
    if (formData.fabric_images.length === 1) return formData.fabric_images[0].name
    return `${formData.fabric_images.length} files selected`
  }, [formData.fabric_images])

  /**
   * Handle form input changes for standard fields
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /**
   * Handle customer search with debouncing
   */
  const handleCustomerSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setCustomerQuery(value)
    setCustomerHighlightedIndex(-1)
    
    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Clear selection when typing
    setFormData((prev) => ({
      ...prev,
      customer_id: "",
    }))

    // Debounce filter update
    debounceTimerRef.current = setTimeout(() => {
      const matches = getCustomerSuggestions(value)
      setFilteredCustomers(matches)
      setShowCustomerSuggestions(matches.length > 0)
    }, 150)
  }, [getCustomerSuggestions])

  /**
   * Handle keyboard navigation in customer suggestions
   */
  const handleCustomerKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showCustomerSuggestions || filteredCustomers.length === 0) {
      if (event.key === "Enter") {
        event.preventDefault()
      }
      return
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setCustomerHighlightedIndex((prev) =>
          prev < filteredCustomers.length - 1 ? prev + 1 : prev
        )
        break

      case "ArrowUp":
        event.preventDefault()
        setCustomerHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break

      case "Enter":
        event.preventDefault()
        if (customerHighlightedIndex >= 0 && customerHighlightedIndex < filteredCustomers.length) {
          handleCustomerSelect(filteredCustomers[customerHighlightedIndex])
        }
        break

      case "Escape":
        event.preventDefault()
        setShowCustomerSuggestions(false)
        setCustomerHighlightedIndex(-1)
        break

      default:
        break
    }
  }, [showCustomerSuggestions, filteredCustomers, customerHighlightedIndex])

  /**
   * Select a customer from suggestions
   */
  const handleCustomerSelect = useCallback((customer: CustomerOption) => {
    setCustomerQuery(customer.name)
    setFormData((prev) => ({
      ...prev,
      customer_id: customer.id,
    }))
    setShowCustomerSuggestions(false)
    setCustomerHighlightedIndex(-1)
  }, [])

  /**
   * Handle customer input focus to show initial suggestions
   */
  const handleCustomerFocus = useCallback(() => {
    const matches = getCustomerSuggestions(customerQuery)
    setFilteredCustomers(matches)
    setShowCustomerSuggestions(matches.length > 0)
  }, [customerQuery, getCustomerSuggestions])

  /**
   * Handle file selection
   */
  const handleFilesChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setFormData((prev) => ({
      ...prev,
      fabric_images: files,
    }))
  }, [])

  /**
   * Handle form submission
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Validation
    if (!formData.customer_id) {
      setStatusMessage("Please select a customer from the list.")
      setStatusType("error")
      return
    }

    if (!formData.received_by_staff_id) {
      setStatusMessage("Please select a staff member who received the fabric.")
      setStatusType("error")
      return
    }

    if (!formData.description.trim()) {
      setStatusMessage("Please provide a fabric description.")
      setStatusType("error")
      return
    }

    if (!formData.dropped_off_at) {
      setStatusMessage("Please select the dropped off date.")
      setStatusType("error")
      return
    }

    if (formData.fabric_images.length === 0) {
      setStatusMessage("Please upload at least one fabric image.")
      setStatusType("error")
      return
    }

    setIsSubmitting(true)
    setStatusMessage(null)

    try {
      const payload = new FormData()
      payload.append("customer_id", formData.customer_id)
      payload.append("description", formData.description)
      payload.append("received_by_staff_id", formData.received_by_staff_id)
      payload.append("dropped_off_at", formData.dropped_off_at)

      formData.fabric_images.forEach((file) => {
        payload.append("fabric_images[]", file)
      })

      await createFabric(payload)

      setStatusMessage("✓ Fabric added successfully")
      setStatusType("success")
      setTimeout(() => router.push("/client-manager/fabrics"), 1500)
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to create fabric right now. Please check your fields and try again."
      setStatusMessage(serverMessage)
      setStatusType("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setStatusMessage(null), 5000)
    }
  }

  /**
   * Get selected staff member info for display
   */
  const selectedStaff = useMemo(
    () => staffMembers.find((s) => s.id === formData.received_by_staff_id),
    [formData.received_by_staff_id, staffMembers]
  )

  /**
   * Get selected customer info for display
   */
  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === formData.customer_id),
    [formData.customer_id, customers]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-white shadow-lg ${
              statusType === "success"
                ? "bg-gradient-to-r from-emerald-500 to-green-600"
                : "bg-gradient-to-r from-rose-500 to-red-600"
            }`}
          >
            <p className="font-medium">{statusMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Fabric</h1>
            <p className="mt-1 text-sm text-gray-600">
              Register dropped-off fabric details, upload photos, and track receiving staff.
            </p>
          </div>

          <Link
            href="/client-manager/fabrics"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <IoArrowBack size={16} />
            Back to Fabrics
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {isLoadingLookups ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Customer Autocomplete Field */}
              <div className="relative" ref={customerInputRef}>
                <label htmlFor="customer-search" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoPeopleOutline size={16} className="text-orange-500" />
                    Customer <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    id="customer-search"
                    type="text"
                    value={customerQuery}
                    onChange={handleCustomerSearchChange}
                    onKeyDown={handleCustomerKeyDown}
                    onFocus={handleCustomerFocus}
                    placeholder="Search customer by name or ID..."
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={showCustomerSuggestions}
                    aria-controls="customer-suggestions"
                    className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-700 transition-colors focus:outline-none ${
                      formData.customer_id
                        ? "border-gray-300"
                        : "border-gray-300 focus:border-orange-400"
                    }`}
                  />
                  {formData.customer_id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {/* <IoCheckmark size={18} className="text-emerald-600" /> */}
                    </motion.div>
                  )}
                </div>

                {/* Customer Suggestions Dropdown */}
                <AnimatePresence>
                  {showCustomerSuggestions && filteredCustomers.length > 0 && (
                    <motion.div
                      id="customer-suggestions"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                    >
                      {filteredCustomers.map((customer, index) => (
                        <motion.button
                          key={customer.id}
                          type="button"
                          onClick={() => handleCustomerSelect(customer)}
                          onMouseEnter={() => setCustomerHighlightedIndex(index)}
                          whileHover={{ backgroundColor: "#fef3c7" }}
                          className={`w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 ${
                            customerHighlightedIndex === index
                              ? "bg-amber-100"
                              : formData.customer_id === customer.id
                                ? "bg-white"
                                : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-800">{customer.name}</div>
                              {/* <div className="text-xs text-gray-500">ID: {customer.id}</div> */}
                            </div>
                          
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {showCustomerSuggestions && filteredCustomers.length === 0 && customerQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm text-gray-500 shadow-lg"
                  >
                    No customers found matching "{customerQuery}"
                  </motion.div>
                )}
              </div>

              {/* Staff Member Dropdown */}
              <div>
                <label htmlFor="received_by_staff_id" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoPeopleOutline size={16} className="text-blue-500" />
                    Received By Staff <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    id="received_by_staff_id"
                    name="received_by_staff_id"
                    value={formData.received_by_staff_id}
                    onChange={handleInputChange}
                    aria-label="Select staff member"
                    className="w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-700 transition-colors focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    required
                  >
                    <option value="">
                      {staffMembers.length > 0 ? "Select staff member..." : "Loading staff..."}
                    </option>
                    {staffMembers.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} ({staff.role})
                      </option>
                    ))}
                  </select>
                  <motion.div
                    animate={formData.received_by_staff_id ? { rotate: 180 } : { rotate: 0 }}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                  >
                    {/* <IoChevronDown size={16} /> */}
                  </motion.div>
                 
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
                <span className="inline-flex items-center gap-2">
                  <IoDocumentTextOutline size={16} className="" />
                  Fabric Description
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe fabric pattern, color, quality, and any important notes"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="dropped_off_at" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoCalendarOutline size={16} className="text-orange-500" />
                    Dropped Off Date
                  </span>
                </label>
                <input
                  id="dropped_off_at"
                  name="dropped_off_at"
                  type="date"
                  value={formData.dropped_off_at}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="fabric_images" className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <IoCloudUploadOutline size={16} className="text-indigo-500" />
                    Fabric Images
                  </span>
                </label>
                <input
                  id="fabric_images"
                  name="fabric_images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-orange-100 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-orange-700 hover:file:bg-orange-200"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">{selectedFilesText}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                href="/client-manager/fabrics"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save Fabric"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  )
}
