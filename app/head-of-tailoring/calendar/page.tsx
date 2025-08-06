"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Filter, User, Package, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentDialog } from "./AppointmentDialog"
import { QuickAppointmentCard } from "./QuickAppointmentCard"
import { fetchAllDatesHot } from "@/app/api/apiClient"

// Types
interface Order {
  id: string
  customer: string
  items: string[]
  firstFitting: Date | null // Allow null
  secondFitting: Date | null // Allow null
  collectionDate: Date | null // Allow null
}

interface YearlyData {
  month: string
  first_fitting_count: number
  second_fitting_count: number
  collection_count: number
}

interface MonthlyOrder {
  customer_name: string
  order_id: string
  clothing_name: string
  first_fitting_date: string | null
  second_fitting_date: string | null
  collection_date: string | null
}

interface MonthlyData {
  date: string
  orders: MonthlyOrder[]
  total: number
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const getMonthName = (month: number) => {
  return new Date(0, month).toLocaleString("default", { month: "long" })
}

// Check if a date is in the past (before today)
const isPastDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0) // Reset time to start of day
  return checkDate < today
}

// Generate available years (current year and next 2 years)
const getAvailableYears = () => {
  const currentYear = new Date().getFullYear()
  return [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]
}

// Custom hook for calendar data
const useCalendarData = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseMonthlyDataToOrders = (data: MonthlyData[]): Order[] => {
    const orders: Order[] = []
    data.forEach((dayData) => {
      dayData.orders.forEach((orderData) => {
        const order: Order = {
          id: orderData.order_id,
          customer: orderData.customer_name,
          items: [orderData.clothing_name],
          firstFitting: orderData.first_fitting_date ? new Date(orderData.first_fitting_date) : null, // Set to null
          secondFitting: orderData.second_fitting_date ? new Date(orderData.second_fitting_date) : null, // Set to null
          collectionDate: orderData.collection_date ? new Date(orderData.collection_date) : null, // Set to null
        }
        orders.push(order)
      })
    })
    return orders
  }

  const fetchCalendarData = useCallback(async (payload: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchAllDatesHot(payload)
      if (response.success) {
        if (response.type === "year") {
          setYearlyData(response.data)
          setOrders([]) // Clear orders for year view
        } else if (response.type === "month") {
          const parsedOrders = parseMonthlyDataToOrders(response.data)
          setOrders(parsedOrders)
          setYearlyData([]) // Clear yearly data for month view
        }
      } else {
        setError("Failed to fetch calendar data")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Failed to fetch calendar data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addAppointment = async (appointmentData: any) => {
    // Implementation for adding appointment
  }

  const clearError = () => setError(null)

  return {
    orders,
    yearlyData,
    loading,
    error,
    fetchCalendarData,
    addAppointment,
    clearError,
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "year">("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterType, setFilterType] = useState<"all" | "first" | "second" | "collection">("all")
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)

  const { orders, yearlyData, loading, error, fetchCalendarData, addAppointment, clearError } = useCalendarData()

  // Fetch data when view parameters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (viewMode === "year") {
          const payload = `year=${selectedYear}`
          await fetchCalendarData(payload)
        } else if (viewMode === "month") {
          const monthString = `${selectedYear}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
          const payload = `month=${monthString}`
          await fetchCalendarData(payload)
        } else if (viewMode === "week") {
          // Calculate ISO week number
          const date = new Date(currentDate)
          const yearStart = new Date(date.getFullYear(), 0, 1)
          const weekNumber = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) / 7)
          const payload = `week=${weekNumber}`
          await fetchCalendarData(payload)
        } else {
          // For day view, fetch the month data
          const monthString = `${selectedYear}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
          const payload = `month=${monthString}`
          await fetchCalendarData(payload)
        }
      } catch (err) {
        console.error("Failed to fetch calendar data:", err)
      }
    }
    fetchData()
  }, [viewMode, selectedYear, currentDate, fetchCalendarData])

  const currentYear = selectedYear
  const currentMonth = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // Removed getFilteredOrders as its logic is now integrated into getOrdersForDate
  // const getFilteredOrders = useCallback(...)

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewMode === "year") {
      setSelectedYear((prev) => prev - 1)
      return
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewMode === "year") {
      setSelectedYear((prev) => prev + 1)
      return
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedYear(today.getFullYear())
  }

  // Check if a date has orders - MODIFIED
  const getOrdersForDate = useCallback(
    (date: Date) => {
      // `orders` already contains data relevant to the current month/week/day view
      return orders.filter((order) => {
        const isFirstFitting = order.firstFitting && order.firstFitting.toDateString() === date.toDateString()
        const isSecondFitting = order.secondFitting && order.secondFitting.toDateString() === date.toDateString()
        const isCollectionDate = order.collectionDate && order.collectionDate.toDateString() === date.toDateString()

        let matchesDate = false
        let appointmentTypeForDate: "First" | "Second" | "Collection" | null = null

        if (isFirstFitting) {
          matchesDate = true
          appointmentTypeForDate = "First"
        } else if (isSecondFitting) {
          matchesDate = true
          appointmentTypeForDate = "Second"
        } else if (isCollectionDate) {
          matchesDate = true
          appointmentTypeForDate = "Collection"
        }

        if (!matchesDate) return false // No appointment for this specific date on this date

        // Apply filterType based on the *actual* appointment type for this date
        if (filterType === "all") return true
        if (filterType === "first" && appointmentTypeForDate === "First") return true
        if (filterType === "second" && appointmentTypeForDate === "Second") return true
        if (filterType === "collection" && appointmentTypeForDate === "Collection") return true

        return false // If filterType doesn't match the appointment type for this date
      })
    },
    [orders, filterType],
  )

  const getAppointmentType = (date: Date, order: Order) => {
    if (order.firstFitting && order.firstFitting.toDateString() === date.toDateString()) return "First"
    if (order.secondFitting && order.secondFitting.toDateString() === date.toDateString()) return "Second"
    if (order.collectionDate && order.collectionDate.toDateString() === date.toDateString()) return "Collection"
    return "First" // Default, though ideally this case shouldn't be hit if getOrdersForDate is correct
  }

  // Handle appointment saving
  const handleSaveAppointment = async (appointmentData: any) => {
    try {
      await addAppointment({
        order_id: appointmentData.orderId,
        collection_date: appointmentData.collectionDate,
        first_fitting_date: appointmentData.firstFittingDate,
        second_fitting_date: appointmentData.secondFittingDate,
      })
    } catch (err) {
      console.error("Failed to save appointment:", err)
    }
  }

  // Render calendar based on view mode
  const renderCalendarView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-500" />
            <p className="text-muted-foreground">Loading calendar data...</p>
          </div>
        </div>
      )
    }
    switch (viewMode) {
      case "day":
        return renderDayView()
      case "week":
        return renderWeekView()
      case "month":
        return renderMonthView()
      case "year":
        return renderYearView()
      default:
        return renderMonthView()
    }
  }

  // Day view
  const renderDayView = () => {
    const dayOrders = getOrdersForDate(currentDate)
    const isCurrentDatePast = isPastDate(currentDate)
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h2>
          <p className="text-muted-foreground mt-2">
            {dayOrders.length} appointment{dayOrders.length !== 1 ? "s" : ""} scheduled
          </p>
          
          
        </div>
        {dayOrders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {dayOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OrderCard order={order} appointmentType={getAppointmentType(currentDate, order)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-orange-400" />
            </div>
            <p className="text-muted-foreground text-lg">No appointments scheduled for this day</p>
          </div>
        )}
      </div>
    )
  }

  // Week view
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate)
    const day = currentDate.getDay()
    startOfWeek.setDate(currentDate.getDate() - day)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={cn(
                  "rounded-full w-12 h-12 mx-auto flex items-center justify-center text-lg font-semibold transition-all duration-200",
                  date.toDateString() === new Date().toDateString()
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg"
                    : "hover:bg-orange-50 text-gray-700",
                )}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date, index) => {
            const dateOrders = getOrdersForDate(date)
            return (
              <Card key={index} className="min-h-[120px] hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {dateOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "text-xs p-2 rounded-lg cursor-pointer transition-all duration-200",
                          getAppointmentType(date, order) === "First"
                            ? "bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-500 hover:shadow-sm"
                            : getAppointmentType(date, order) === "Second"
                              ? "bg-gradient-to-r from-orange-50 to-orange-25 border-l-4 border-orange-300 hover:shadow-sm"
                              : "bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500 hover:shadow-sm",
                        )}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="font-semibold text-gray-800">{order.customer}</div>
                        <div className="text-orange-600">
                          {getAppointmentType(date, order) === "First"
                            ? "1st Fitting"
                            : getAppointmentType(date, order) === "Second"
                              ? "2nd Fitting"
                              : "Collection"}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50/30">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                      {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} Appointments
                    </CardTitle>
                    <CardDescription className="text-base">
                      {getOrdersForDate(selectedDate).length} appointment
                      {getOrdersForDate(selectedDate).length !== 1 ? "s" : ""} scheduled
                    </CardDescription>
                  </div>
                  
                </div>
              </CardHeader>
              <CardContent>
                <QuickAppointmentCard
                  selectedDate={selectedDate}
                  onAddAppointment={() => setShowAppointmentDialog(true)}
                  existingAppointments={getOrdersForDate(selectedDate)}
                  isPastDate={isPastDate(selectedDate)}
                />
                {getOrdersForDate(selectedDate).length > 0 && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Existing Appointments</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {getOrdersForDate(selectedDate).map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          appointmentType={getAppointmentType(selectedDate, order)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    )
  }

  // Month view
  const renderMonthView = () => {
    const days = []
    const blankDays = Array(firstDayOfMonth).fill(null) // [^2]
    // Add blank days for the start of the month
    days.push(...blankDays)

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dateOrders = getOrdersForDate(date)
      days.push({
        day: i,
        date,
        orders: dateOrders,
      })
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-4 text-sm font-bold text-gray-600 bg-gradient-to-br from-orange-50 to-orange-25 rounded-lg"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`blank-${index}`} className="h-28 rounded-xl bg-gray-50/50"></div>
            }
            const isToday = day.date.toDateString() === new Date().toDateString()
            const isDatePast = isPastDate(day.date)
            return (
              <motion.div
                key={`day-${day.day}`}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "h-28 rounded-xl p-2 overflow-hidden cursor-pointer transition-all duration-200 border-2",
                  isToday
                    ? "border-orange-500 bg-gradient-to-br from-orange-50 to-white shadow-lg"
                    : "border-gray-100 bg-white hover:border-orange-200 hover:shadow-md",
                  day.date.toDateString() === selectedDate?.toDateString()
                    ? "ring-2 ring-orange-400 ring-offset-2"
                    : "",
                  isDatePast ? "opacity-75" : "",
                )}
                onClick={() => {
                  setSelectedDate(day.date)
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200",
                      isToday
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-orange-100",
                      isDatePast ? "text-gray-400" : "",
                    )}
                  >
                    {day.day}
                  </span>
                  {day.orders.length > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200 text-xs font-semibold"
                    >
                      {day.orders.length}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1 overflow-hidden">
                  {day.orders.slice(0, 2).map((order: Order) => (
                    <div
                      key={order.id}
                      className={cn(
                        "text-xs p-1.5 truncate rounded-md font-medium transition-all duration-200",
                        getAppointmentType(day.date, order) === "First"
                          ? "bg-gradient-to-r from-orange-200 to-orange-100 text-orange-800"
                          : getAppointmentType(day.date, order) === "Second"
                            ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700"
                            : "bg-gradient-to-r from-green-200 to-green-100 text-green-800",
                      )}
                    >
                      {order.customer.split(" ")[0]}
                    </div>
                  ))}
                  {day.orders.length > 2 && (
                    <div className="text-xs text-muted-foreground font-medium">+{day.orders.length - 2} more</div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-orange-50/20 to-white">
              <CardHeader className="pb-4 bg-gradient-to-r from-orange-500/5 to-orange-400/5 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                      {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      {isPastDate(selectedDate) && (
                        <span className="text-sm text-muted-foreground ml-2 font-normal">(Past Date)</span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {getOrdersForDate(selectedDate).length} appointment
                      {getOrdersForDate(selectedDate).length !== 1 ? "s" : ""} scheduled
                    </CardDescription>
                  </div>
                  
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <QuickAppointmentCard
                  selectedDate={selectedDate}
                  onAddAppointment={() => setShowAppointmentDialog(true)}
                  existingAppointments={getOrdersForDate(selectedDate)}
                  isPastDate={isPastDate(selectedDate)}
                />
                {getOrdersForDate(selectedDate).length > 0 && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Existing Appointments</h4>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {getOrdersForDate(selectedDate).map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <OrderCard order={order} appointmentType={getAppointmentType(selectedDate, order)} />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Year view - Updated to use API data
  const renderYearView = () => {
    const months = yearlyData.map((monthData, index) => ({
      month: index,
      name: monthData.month,
      firstFittingCount: monthData.first_fitting_count,
      secondFittingCount: monthData.second_fitting_count,
      collectionCount: monthData.collection_count,
      totalCount: monthData.first_fitting_count + monthData.second_fitting_count + monthData.collection_count,
    }))

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, index) => (
          <motion.div
            key={month.month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 hover:shadow-xl border-2",
                currentMonth === month.month && selectedYear === new Date().getFullYear()
                  ? "border-orange-500 bg-gradient-to-br from-orange-50 to-white shadow-lg"
                  : "border-gray-100 hover:border-orange-300 bg-white",
              )}
              onClick={() => {
                setCurrentDate(new Date(selectedYear, month.month, 1))
                setViewMode("month")
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  {month.name}
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  {month.totalCount} appointment{month.totalCount !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-25 rounded-lg">
                    <span className="text-sm font-medium text-orange-800">First Fittings</span>
                    <Badge className="bg-orange-500 text-white">{month.firstFittingCount}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-25 to-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-700">Second Fittings</span>
                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                      {month.secondFittingCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-25 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Collections</span>
                    <Badge variant="outline" className="border-green-300 text-green-600">
                      {month.collectionCount}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  Fitting Calendar
                </h1>
                <p className="text-muted-foreground">Manage your appointments with style</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 bg-transparent"
              >
                Today
              </Button>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  className="rounded-r-none hover:bg-orange-50 hover:border-orange-300 bg-transparent"
                  disabled={loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-l-none border-l-0 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
                  disabled={loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
              >
                <SelectTrigger className="w-24 hover:border-orange-300 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableYears().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterType}
                onValueChange={(value: "all" | "first" | "second" | "collection") => setFilterType(value)}
              >
                <SelectTrigger className="w-36 hover:border-orange-300 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="first">First Fittings</SelectItem>
                  <SelectItem value="second">Second Fittings</SelectItem>
                  <SelectItem value="collection">Collections</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gradient-to-r from-orange-50/50 to-orange-25/50 border-b">
                <TabsList className="bg-white shadow-md border">
                  <TabsTrigger value="day" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                    Day
                  </TabsTrigger>
                  <TabsTrigger
                    value="week"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Week
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Month
                  </TabsTrigger>
                  <TabsTrigger
                    value="year"
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    Year
                  </TabsTrigger>
                </TabsList>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mt-4 md:mt-0">
                  {viewMode === "year"
                    ? selectedYear
                    : viewMode === "month"
                      ? `${getMonthName(currentMonth)} ${selectedYear}`
                      : viewMode === "week"
                        ? `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </h2>
              </div>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderCalendarView()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
      <AppointmentDialog
        open={showAppointmentDialog}
        onOpenChange={setShowAppointmentDialog}
        selectedDate={selectedDate}
        onSaveAppointment={handleSaveAppointment}
      />
    </div>
  )
}

// Enhanced Order card component
function OrderCard({ order, appointmentType }: { order: Order; appointmentType: "First" | "Second" | "Collection" }) {
  const getAppointmentDate = () => {
    if (appointmentType === "First") return order.firstFitting
    if (appointmentType === "Second") return order.secondFitting
    return order.collectionDate
  }

  const getAppointmentColor = () => {
    if (appointmentType === "First") return "border-l-orange-500 hover:border-orange-300"
    if (appointmentType === "Second") return "border-l-orange-300 hover:border-orange-200"
    return "border-l-green-500 hover:border-green-300"
  }

  const getBadgeStyle = () => {
    if (appointmentType === "First") return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
    if (appointmentType === "Second") return "text-orange-600 border-orange-300 bg-orange-50"
    return "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
  }

  const appointmentDate = getAppointmentDate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-xl overflow-hidden shadow-lg border-2 transition-all duration-300 hover:shadow-xl bg-white border-l-4",
        getAppointmentColor(),
      )}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{order.customer}</h3>
            <p className="text-sm text-muted-foreground font-medium">{order.id}</p>
          </div>
          <Badge
            variant={appointmentType === "First" || appointmentType === "Collection" ? "default" : "outline"}
            className={cn("font-semibold px-3 py-1", getBadgeStyle())}
          >
            {appointmentType === "Collection" ? "Collection" : `${appointmentType} Fitting`}
          </Badge>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="font-medium">
              {appointmentDate
                ? appointmentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-orange-500" />
            <span className="font-medium truncate">{order.customer}</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg col-span-2">
            <Package className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="font-medium">{order.items.join(", ")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
