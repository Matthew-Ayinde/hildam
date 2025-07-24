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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  onSaveAppointment: (appointment: any) => Promise<void>
}

export function AppointmentDialog({ open, onOpenChange, selectedDate, onSaveAppointment }: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    orderId: "",
    appointmentType: "first" as "first" | "second" | "collection",
    firstFittingDate: selectedDate || new Date(),
    secondFittingDate: selectedDate ? new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000) : new Date(),
    collectionDate: selectedDate ? new Date(selectedDate.getTime() + 14 * 24 * 60 * 60 * 1000) : new Date(),
    time: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !formData.orderId) return

    setLoading(true)
    setError(null)

    try {
      const appointmentData = {
        orderId: formData.orderId,
        appointmentType: formData.appointmentType,
        firstFittingDate: formData.firstFittingDate.toISOString().split("T")[0],
        secondFittingDate: formData.secondFittingDate.toISOString().split("T")[0],
        collectionDate: formData.collectionDate.toISOString().split("T")[0],
        time: formData.time,
      }

      await onSaveAppointment(appointmentData)

      // Reset form
      setFormData({
        orderId: "",
        appointmentType: "first",
        firstFittingDate: selectedDate || new Date(),
        secondFittingDate: selectedDate ? new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000) : new Date(),
        collectionDate: selectedDate ? new Date(selectedDate.getTime() + 14 * 24 * 60 * 60 * 1000) : new Date(),
        time: "",
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

          <div className="space-y-2">
            <Label htmlFor="appointmentType">Primary Appointment Type</Label>
            <Select
              value={formData.appointmentType}
              onValueChange={(value: "first" | "second" | "collection") =>
                setFormData((prev) => ({ ...prev, appointmentType: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Fitting</SelectItem>
                <SelectItem value="second">Second Fitting</SelectItem>
                <SelectItem value="collection">Collection/Pickup</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="space-y-2">
            <Label htmlFor="time">Appointment Time</Label>
            <Select
              value={formData.time || ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="13:00">1:00 PM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
                <SelectItem value="17:00">5:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
