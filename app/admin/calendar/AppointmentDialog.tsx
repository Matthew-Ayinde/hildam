"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { addCalendarDate, fetchAllCustomers } from "@/app/api/apiClient" // Assuming this path is correct

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null // Keep as Date | null for initial selection if any
  onSaveAppointment: (appointment: any) => Promise<void>
}

export function AppointmentDialog({ open, onOpenChange, selectedDate, onSaveAppointment }: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    firstFittingDate: null as Date | null, // Default to null
    secondFittingDate: null as Date | null, // Default to null
    collectionDate: null as Date | null, // Default to null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomerData = async () => {
    try {
      const customer = await fetchAllCustomers()

        console.log("Fetched customer data:", customer)
       
    } catch (err: any) {
      console.error("Error fetching customer data:", err)
      setError(err.message || "Failed to fetch customer data.")
    }
  }

  // Fetch customer data when orderId changes
  useEffect(() => {
    fetchCustomerData()
  }, [])
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const appointmentData: {
        order_id: string
        first_fitting_date?: string
        second_fitting_date?: string
        collection_date?: string
      } = {
        order_id: formData.orderId,
      }

      // Use format(date, "yyyy-MM-dd") to get the local date string
      if (formData.firstFittingDate) {
        appointmentData.first_fitting_date = format(formData.firstFittingDate, "yyyy-MM-dd")
      }
      if (formData.secondFittingDate) {
        appointmentData.second_fitting_date = format(formData.secondFittingDate, "yyyy-MM-dd")
      }
      if (formData.collectionDate) {
        appointmentData.collection_date = format(formData.collectionDate, "yyyy-MM-dd")
      }

      console.log("Submitting appointment data:", appointmentData)
      const res = await addCalendarDate(appointmentData)
      console.log("Appointment created successfully:", res)

      // Reset form
      setFormData({
        orderId: "",
        firstFittingDate: null,
        secondFittingDate: null,
        collectionDate: null,
      })
      onOpenChange(false)
      // Call onSaveAppointment if needed, passing the response or relevant data
      await onSaveAppointment(res)
      window.location.reload() // Reload to reflect changes in the calendar
    } catch (err: any) {
      // More robust error handling
      const errorMessage = err.response?.data?.message?.order_id?.[0] || err.message || "An unexpected error occurred."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const DatePicker = ({
    date,
    onDateChange,
    label,
    placeholder,
  }: {
    date: Date | null // Allow null for date
    onDateChange: (date: Date | null) => void // Allow null for date change
    label: string
    placeholder: string
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date || undefined} // Calendar's selected prop expects Date | undefined
            onSelect={(newDate) => onDateChange(newDate || null)} // Pass null if newDate is undefined (e.g., clearing selection)
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Schedule New Appointment
          </DialogTitle>
          <DialogDescription>
            Create a new appointment for{" "}
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>
        {error && <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">{error}</div>}
        
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              value={formData.orderId}
              onChange={(e) => setFormData((prev) => ({ ...prev, orderId: e.target.value }))}
              placeholder="Enter Order ID (e.g., ORD-2025-001)"
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              date={formData.firstFittingDate}
              onDateChange={(date) => setFormData((prev) => ({ ...prev, firstFittingDate: date }))}
              label="First Fitting Date"
              placeholder="Select first fitting date"
            />
            <DatePicker
              date={formData.secondFittingDate}
              onDateChange={(date) => setFormData((prev) => ({ ...prev, secondFittingDate: date }))}
              label="Second Fitting Date"
              placeholder="Select second fitting date"
            />
          </div>
          <DatePicker
            date={formData.collectionDate}
            onDateChange={(date) => setFormData((prev) => ({ ...prev, collectionDate: date }))}
            label="Collection Date"
            placeholder="Select collection date"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              disabled={!formData.orderId || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Appointment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  )
}
