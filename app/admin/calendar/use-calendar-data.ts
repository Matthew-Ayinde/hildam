"use client"

import { useState, useCallback } from "react"
import { apiService, type OrderData, type DayData } from "./api-service"

interface TransformedOrder {
  id: string
  customer: string
  firstFitting: Date
  secondFitting: Date
  collectionDate: Date
  status: string
  items: string[]
  totalAmount: string
}

export function useCalendarData() {
  const [orders, setOrders] = useState<TransformedOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transformApiOrderToLocal = useCallback((apiOrder: OrderData): TransformedOrder => {
    return {
      id: apiOrder.order_id,
      customer: apiOrder.customer_name,
      firstFitting: new Date(apiOrder.first_fitting_date),
      secondFitting: new Date(apiOrder.second_fitting_date),
      collectionDate: new Date(apiOrder.collection_date),
      status: "Confirmed", // Default status since API doesn't provide this
      items: [apiOrder.clothing_name],
      totalAmount: "₦0.00", // Default amount since API doesn't provide this
    }
  }, [])

  const fetchCalendarData = useCallback(
    async (params: { year?: number; month?: string; week?: string }) => {
      setLoading(true)
      setError(null)

      try {
        const response = await apiService.getFittingDates(params)

        if (response.success && response.data) {
          const transformedOrders: TransformedOrder[] = []

          if (Array.isArray(response.data)) {
            // Handle day/week data
            const dayData = response.data as DayData[]
            dayData.forEach((day) => {
              day.orders.forEach((order) => {
                transformedOrders.push(transformApiOrderToLocal(order))
              })
            })
          }

          setOrders(transformedOrders)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch calendar data"
        setError(errorMessage)
        console.error("Calendar data fetch error:", err)
      } finally {
        setLoading(false)
      }
    },
    [transformApiOrderToLocal],
  )

  const addAppointment = useCallback(
    async (appointmentData: {
      order_id: string
      collection_date: string
      first_fitting_date: string
      second_fitting_date: string
    }) => {
      setError(null)

      // Optimistic update
      const optimisticOrder: TransformedOrder = {
        id: appointmentData.order_id,
        customer: "New Customer", // Placeholder
        firstFitting: new Date(appointmentData.first_fitting_date),
        secondFitting: new Date(appointmentData.second_fitting_date),
        collectionDate: new Date(appointmentData.collection_date),
        status: "Confirmed",
        items: ["New Item"], // Placeholder
        totalAmount: "₦0.00",
      }

      setOrders((prev) => [...prev, optimisticOrder])

      try {
        const response = await apiService.addCalendarDate(appointmentData)

        if (response.success && response.order) {
          // Replace optimistic update with real data
          const realOrder = transformApiOrderToLocal(response.order)
          setOrders((prev) => prev.map((order) => (order.id === appointmentData.order_id ? realOrder : order)))
        }

        return response
      } catch (err) {
        // Revert optimistic update on error
        setOrders((prev) => prev.filter((order) => order.id !== appointmentData.order_id))

        const errorMessage = err instanceof Error ? err.message : "Failed to add appointment"
        setError(errorMessage)
        throw err
      }
    },
    [transformApiOrderToLocal],
  )

  return {
    orders,
    loading,
    error,
    fetchCalendarData,
    addAppointment,
    clearError: () => setError(null),
  }
}
