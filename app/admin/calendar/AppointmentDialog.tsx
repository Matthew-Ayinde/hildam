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
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  onSaveAppointment: (appointment: any) => void
}

export function AppointmentDialog({ open, onOpenChange, selectedDate, onSaveAppointment }: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    customer: "",
    fittingType: "first" as "first" | "second",
    items: [] as string[],
    newItem: "",
    totalAmount: "",
    status: "Confirmed" as "Confirmed" | "Pending" | "In Progress",
    time: "",
  })

  const handleAddItem = () => {
    if (formData.newItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, prev.newItem.trim()],
        newItem: "",
      }))
    }
  }

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !formData.customer || formData.items.length === 0) return

    const newAppointment = {
      id: `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
      customer: formData.customer,
      firstFitting:
        formData.fittingType === "first" ? selectedDate : new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      secondFitting:
        formData.fittingType === "second" ? selectedDate : new Date(selectedDate.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: formData.status,
      items: formData.items,
      totalAmount: formData.totalAmount || "₦0.00",
      time: formData.time,
    }

    onSaveAppointment(newAppointment)

    // Reset form
    setFormData({
      customer: "",
      fittingType: "first",
      items: [],
      newItem: "",
      totalAmount: "",
      status: "Confirmed",
      time: "",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Schedule New Appointment
          </DialogTitle>
          <DialogDescription>
            Create a new fitting appointment for{" "}
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customer">Order Id</Label>
            <Input
              id="customer"
              value={formData.customer}
              onChange={(e) => setFormData((prev) => ({ ...prev, customer: e.target.value }))}
              placeholder="Enter Order Id"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fittingType">Appointments</Label>
            <Select
              value={formData.fittingType}
              onValueChange={(value: "first" | "second") => setFormData((prev) => ({ ...prev, fittingType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Fitting</SelectItem>
                <SelectItem value="second">Second Fitting</SelectItem>
                <SelectItem value="final">Collection/pickup date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Appointment Time</Label>
            <Select
              value={formData.time || ""}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
               onClick={() => onOpenChange(false)}
              disabled={!formData.customer}
            >
              Schedule Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
