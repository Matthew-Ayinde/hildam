"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, ChevronLeft, ChevronRight, Filter, User, Package, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentDialog } from "./AppointmentDialog"
import { QuickAppointmentCard } from "./QuickAppointmentCard"

// Sample order data with Naira currency
const orders = [
  {
    id: "ORD-2023-001",
    customer: "Jane Smith",
    firstFitting: new Date(2025, 6, 15),
    secondFitting: new Date(2025, 6, 28),
    status: "Confirmed",
    items: ["Wedding Dress", "Veil"],
    totalAmount: "₦1,850.00",
  },
   {
    id: "ORD-2023-024",
    customer: "Jane Smith",
    firstFitting: new Date(2025, 6, 15),
    secondFitting: new Date(2025, 6, 28),
    status: "Confirmed",
    items: ["Wedding Dress", "Veil"],
    totalAmount: "₦1,850.00",
  },
   {
    id: "ORD-6023-001",
    customer: "Jane Smith",
    firstFitting: new Date(2025, 5, 15),
    secondFitting: new Date(2025, 5, 28),
    status: "Confirmed",
    items: ["Wedding Dress", "Veil"],
    totalAmount: "₦1,850.00",
  },
  {
    id: "ORD-6023-0021",
    customer: "Jane Smith",
    firstFitting: new Date(2025, 5, 15),
    secondFitting: new Date(2025, 5, 28),
    status: "Confirmed",
    items: ["Wedding Dress", "Veil"],
    totalAmount: "₦1,850.00",
  },
  {
    id: "ORD-2023-002",
    customer: "Michael Johnson",
    firstFitting: new Date(2025, 5, 18),
    secondFitting: new Date(2025, 6, 2),
    status: "In Progress",
    items: ["Tuxedo", "Bow Tie"],
    totalAmount: "₦950.00",
  },
  {
    id: "ORD-2023-003",
    customer: "Emily Davis",
    firstFitting: new Date(2025, 5, 22),
    secondFitting: new Date(2025, 6, 6),
    status: "Confirmed",
    items: ["Bridesmaid Dress"],
    totalAmount: "₦450.00",
  },
  {
    id: "ORD-2023-004",
    customer: "Robert Wilson",
    firstFitting: new Date(2025, 6, 5),
    secondFitting: new Date(2025, 6, 19),
    status: "Pending",
    items: ["Suit", "Shirt", "Tie"],
    totalAmount: "₦1,200.00",
  },
  {
    id: "ORD-2023-005",
    customer: "Sarah Thompson",
    firstFitting: new Date(2025, 6, 8),
    secondFitting: new Date(2025, 6, 22),
    status: "Confirmed",
    items: ["Evening Gown"],
    totalAmount: "₦780.00",
  },
  // Add more orders for different years
  {
    id: "ORD-2023-006",
    customer: "David Brown",
    firstFitting: new Date(2023, 8, 12),
    secondFitting: new Date(2023, 8, 26),
    status: "Completed",
    items: ["Business Suit"],
    totalAmount: "₦1,100.00",
  },
  {
    id: "ORD-2025-001",
    customer: "Lisa Anderson",
    firstFitting: new Date(2025, 2, 10),
    secondFitting: new Date(2025, 2, 24),
    status: "Scheduled",
    items: ["Cocktail Dress"],
    totalAmount: "₦650.00",
  },
]

// Helper functions
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const getMonthName = (month: number) => {
  return new Date(0, month).toLocaleString("default", { month: "long" })
}

// Generate available years from orders
const getAvailableYears = () => {
  const years = new Set<number>()
  orders.forEach((order) => {
    years.add(order.firstFitting.getFullYear())
    years.add(order.secondFitting.getFullYear())
  })
  return Array.from(years).sort((a, b) => b - a)
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month" | "year">("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterType, setFilterType] = useState<"all" | "first" | "second">("all")
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [appointments, setAppointments] = useState(orders)

  // Appointment saving function
  const handleSaveAppointment = (newAppointment: any) => {
    setAppointments((prev) => [...prev, newAppointment])
  }

  const currentYear = selectedYear
  const currentMonth = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  // Filter orders by selected year and filter type
  const getFilteredOrders = () => {
    return appointments.filter((order) => {
      const orderYear =
        order.firstFitting.getFullYear() === selectedYear || order.secondFitting.getFullYear() === selectedYear

      if (!orderYear) return false

      if (filterType === "all") return true
      if (filterType === "first") return order.firstFitting.getFullYear() === selectedYear
      if (filterType === "second") return order.secondFitting.getFullYear() === selectedYear

      return true
    })
  }

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

  // Check if a date has orders
  const getOrdersForDate = (date: Date) => {
    const filteredOrders = getFilteredOrders()
    return filteredOrders.filter(
      (order) =>
        order.firstFitting.toDateString() === date.toDateString() ||
        order.secondFitting.toDateString() === date.toDateString(),
    )
  }

  const isFirstFitting = (date: Date, order: any) => {
    return order.firstFitting.toDateString() === date.toDateString()
  }

  // Render calendar based on view mode
  const renderCalendarView = () => {
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

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </h2>
          <p className="text-muted-foreground mt-2">
            {dayOrders.length} fitting{dayOrders.length !== 1 ? "s" : ""} scheduled
          </p>
          <Button
            onClick={() => {
              setSelectedDate(currentDate)
              setShowAppointmentDialog(true)
            }}
            className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add Appointment
          </Button>
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
                <OrderCard order={order} isFitting={isFirstFitting(currentDate, order) ? "First" : "Second"} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-orange-400" />
            </div>
            <p className="text-muted-foreground text-lg">No fittings scheduled for this day</p>
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
                          isFirstFitting(date, order)
                            ? "bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-500 hover:shadow-sm"
                            : "bg-gradient-to-r from-orange-50 to-orange-25 border-l-4 border-orange-300 hover:shadow-sm",
                        )}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="font-semibold text-gray-800">{order.customer}</div>
                        <div className="text-orange-600">{isFirstFitting(date, order) ? "1st" : "2nd"} Fitting</div>
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
                      {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} Fittings
                    </CardTitle>
                    <CardDescription className="text-base">
                      {getOrdersForDate(selectedDate).length} fitting
                      {getOrdersForDate(selectedDate).length !== 1 ? "s" : ""} scheduled
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAppointmentDialog(true)}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <QuickAppointmentCard
                  selectedDate={selectedDate}
                  onAddAppointment={() => setShowAppointmentDialog(true)}
                  existingAppointments={getOrdersForDate(selectedDate)}
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
                          isFitting={isFirstFitting(selectedDate, order) ? "First" : "Second"}
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
    const blankDays = Array(firstDayOfMonth).fill(null)

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
                )}
                onClick={() => {
                  setSelectedDate(day.date)
                  // Remove the immediate dialog opening
                  // setShowAppointmentDialog(true)
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200",
                      isToday
                        ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-orange-100",
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
                  {day.orders.slice(0, 2).map((order: any) => (
                    <div
                      key={order.id}
                      className={cn(
                        "text-xs p-1.5 truncate rounded-md font-medium transition-all duration-200",
                        isFirstFitting(day.date, order)
                          ? "bg-gradient-to-r from-orange-200 to-orange-100 text-orange-800"
                          : "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700",
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
                    </CardTitle>
                    <CardDescription className="text-base">
                      {getOrdersForDate(selectedDate).length} fitting
                      {getOrdersForDate(selectedDate).length !== 1 ? "s" : ""} scheduled
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAppointmentDialog(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Add Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <QuickAppointmentCard
                  selectedDate={selectedDate}
                  onAddAppointment={() => setShowAppointmentDialog(true)}
                  existingAppointments={getOrdersForDate(selectedDate)}
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
                          <OrderCard
                            order={order}
                            isFitting={isFirstFitting(selectedDate, order) ? "First" : "Second"}
                          />
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

  // Year view
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthOrders = getFilteredOrders().filter(
        (order) =>
          (order.firstFitting.getMonth() === i && order.firstFitting.getFullYear() === selectedYear) ||
          (order.secondFitting.getMonth() === i && order.secondFitting.getFullYear() === selectedYear),
      )

      return {
        month: i,
        name: getMonthName(i),
        orders: monthOrders,
      }
    })

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
                  {month.orders.length} fitting{month.orders.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-25 rounded-lg">
                    <span className="text-sm font-medium text-orange-800">First Fittings</span>
                    <Badge className="bg-orange-500 text-white">
                      {month.orders.filter((o) => o.firstFitting.getMonth() === month.month).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-25 to-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-700">Second Fittings</span>
                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                      {month.orders.filter((o) => o.secondFitting.getMonth() === month.month).length}
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
                className="hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
              >
                Today
              </Button>

              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  className="rounded-r-none hover:bg-orange-50 hover:border-orange-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-l-none border-l-0 hover:bg-orange-50 hover:border-orange-300"
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

              <Select value={filterType} onValueChange={(value: "all" | "first" | "second") => setFilterType(value)}>
                <SelectTrigger className="w-36 hover:border-orange-300 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fittings</SelectItem>
                  <SelectItem value="first">First Fittings</SelectItem>
                  <SelectItem value="second">Second Fittings</SelectItem>
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
function OrderCard({ order, isFitting }: { order: any; isFitting: "First" | "Second" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-xl overflow-hidden shadow-lg border-2 transition-all duration-300 hover:shadow-xl bg-white",
        isFitting === "First"
          ? "border-l-4 border-l-orange-500 hover:border-orange-300"
          : "border-l-4 border-l-orange-300 hover:border-orange-200",
      )}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{order.customer}</h3>
            <p className="text-sm text-muted-foreground font-medium">{order.id}</p>
          </div>
          <Badge
            variant={isFitting === "First" ? "default" : "outline"}
            className={cn(
              "font-semibold px-3 py-1",
              isFitting === "First"
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                : "text-orange-600 border-orange-300 bg-orange-50",
            )}
          >
            {isFitting} Fitting
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="font-medium">
              {isFitting === "First"
                ? order.firstFitting.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : order.secondFitting.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
