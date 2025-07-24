"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus } from "lucide-react"
import { motion } from "framer-motion"

interface QuickAppointmentCardProps {
  selectedDate: Date
  onAddAppointment: () => void
  existingAppointments: any[]
}

export function QuickAppointmentCard({
  selectedDate,
  onAddAppointment,
  existingAppointments,
}: QuickAppointmentCardProps) {
  const [showQuickOptions, setShowQuickOptions] = useState(false)

  const quickAppointmentTypes = [
    { type: "Wedding Consultation", duration: "2 hours", color: "bg-pink-100 text-pink-800 border-pink-200" },
    { type: "First Fitting", duration: "1 hour", color: "bg-orange-100 text-orange-800 border-orange-200" },
    { type: "Second Fitting", duration: "45 mins", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { type: "Collection/Pickup", duration: "30 mins", color: "bg-green-100 text-green-800 border-green-200" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <Card className="border-2 border-dashed border-orange-200 hover:border-orange-300 transition-all duration-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Schedule New Appointment</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {existingAppointments.length > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  {existingAppointments.length} existing appointment{existingAppointments.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {!showQuickOptions ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={onAddAppointment}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Custom Appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowQuickOptions(true)}
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Quick Options
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <p className="text-sm font-medium text-gray-700">Quick appointment types:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickAppointmentTypes.map((apt, index) => (
                    <motion.div
                      key={apt.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full justify-start h-auto p-3 ${apt.color} hover:shadow-md transition-all duration-200`}
                        onClick={() => {
                          // Pre-fill appointment dialog with quick type
                          onAddAppointment()
                        }}
                      >
                        <div className="text-left">
                          <div className="font-medium">{apt.type}</div>
                          <div className="text-xs opacity-75">{apt.duration}</div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickOptions(false)}
                  className="text-muted-foreground"
                >
                  Show less
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
