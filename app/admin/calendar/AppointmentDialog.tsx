"use client"

import type React from "react"
import { useState } from "react"
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
import { addCalendarDate } from "@/app/api/apiClient"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  onSaveAppointment: (appointment: any) => Promise<void>
}

export function AppointmentDialog({ open, onOpenChange, selectedDate, onSaveAppointment }: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    firstFittingDate: selectedDate || new Date(),
    secondFittingDate: selectedDate ? new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000) : new Date(),
    collectionDate: selectedDate ? new Date(selectedDate.getTime() + 14 * 24 * 60 * 60 * 1000) : new Date(),
    
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    setLoading(true)
    setError(null)

    try {
      const appointmentData = {
        order_id: formData.orderId,
        first_fittingDate: formData.firstFittingDate.toISOString().split("T")[0],
        second_fittingDate: formData.secondFittingDate.toISOString().split("T")[0],
        collection_date: formData.collectionDate.toISOString().split("T")[0],
        
      }


      console.log("Submitting appointment data:", appointmentData)

      const res = await addCalendarDate(appointmentData)
      console.log("Appointment created successfully:", res)

      // Reset form
      setFormData({
        orderId: "",
        firstFittingDate: selectedDate || new Date(),
        secondFittingDate: selectedDate ? new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000) : new Date(),
        collectionDate: selectedDate ? new Date(selectedDate.getTime() + 14 * 24 * 60 * 60 * 1000) : new Date(),
      
      })

      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save appointment")
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
    date: Date
    onDateChange: (date: Date) => void
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
          <Calendar mode="single" selected={date} onSelect={(date) => date && onDateChange(date)} initialFocus />
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
            <Button type="submit" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
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
