"use client"

import { Calendar, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface QuickAppointmentCardProps {
  selectedDate: Date
  onAddAppointment: () => void
  existingAppointments: any[]
  isPastDate?: boolean
}

export function QuickAppointmentCard({
  selectedDate,
  onAddAppointment,
  existingAppointments,
  isPastDate = false,
}: QuickAppointmentCardProps) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-orange-50/50 to-orange-25/50 border-orange-200/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {existingAppointments.length} existing appointment{existingAppointments.length !== 1 ? "s" : ""}
                </span>
                {isPastDate && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Past Date
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
        </div>
        {isPastDate && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
            <p className="text-sm text-muted-foreground italic">
              You can only view existing appointments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
