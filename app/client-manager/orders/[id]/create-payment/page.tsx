"use client"

import { useRouter, useParams } from "next/navigation"
import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, DollarSign, Receipt, Percent, Tag } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createPayment, fetchOrderById } from "@/app/api/apiClient"

const Form = () => {
  const router = useRouter()
  const { id } = useParams()
  const orderId = id as string

  const [orderLoading, setOrderLoading] = useState(true)
  const [formData, setFormData] = useState<{
    order_id: string
    going_rate: string
    VAT: string
    discount?: string
  }>({
    order_id: "",
    going_rate: "",
    VAT: "7.5",
    discount: "",
  })

  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  // Fetch order_id on mount
  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
      try {
        setOrderLoading(true)

        const res = await fetchOrderById(orderId)
        setFormData((f) => ({
          ...f,
          order_id: res.order_id,
        }))
      } catch (err) {
        console.error(err)
        setResponseMessage("Failed to load order details")
        setMessageType("error")
      } finally {
        setOrderLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage(null)

    try {
      const session = await getSession()
      const token = session?.user?.token
      if (!token) {
        throw new Error("Access token not found in session storage.")
      }

      // Format data exactly as requested: order_id as string, going_rate as number
      const payload = {
        order_id: formData.order_id,
        going_rate: Number.parseFloat(formData.going_rate) || 0,
        VAT: Number.parseFloat(formData.VAT) || 7.5, // Default to 7.5% if not provided
        discount: formData.discount ? Number.parseFloat(formData.discount) : undefined, // Optional field
      }

      const result = await createPayment(payload)
      console.log('create payment result', result)

        setResponseMessage("Payment created successfully!")
        setMessageType("success")
        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/client-manager/payments/${result.data.id}`)
        }, 1500)
      
    } catch (error: any) {
      setResponseMessage(`Error: ${error.message}`)
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4">
             <div className="text-2xl text-white">₦</div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Create Payment
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Generate payment to get invoice for order <span className="text-orange-500">{formData.order_id || "Loading..."} </span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order ID Field */}
              <div className="space-y-2">
                <Label htmlFor="order_id" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Order ID
                </Label>
                <div className="relative">
                  <Input
                    id="order_id"
                    name="order_id"
                    value={formData.order_id}
                    placeholder="Loading order ID..."
                    disabled
                    className="bg-slate-50 border-slate-200 text-slate-600 pr-10"
                  />
                  {orderLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">Auto-generated order reference</p>
              </div>

              {/* Going Rate Field */}
              <div className="space-y-2">
                <Label htmlFor="going_rate" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Going Rate (₦) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="going_rate"
                  name="going_rate"
                  type="number"
                  step="0.01"
                  value={formData.going_rate}
                  onChange={handleChange}
                  placeholder="Enter actual price amount"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-slate-500">Enter the total payment amount in Naira</p>
              </div>

              {/* VAT Field */}
              <div className="space-y-2">
                <Label htmlFor="VAT" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  VAT (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="VAT"
                  name="VAT"
                  type="number"
                  step="0.01"
                  value={formData.VAT}
                  onChange={handleChange}
                  placeholder="7.5"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-slate-500">Standard VAT rate (default: 7.5%)</p>
              </div>

              {/* Discount Field */}
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Discount (%) <span className="text-slate-400">(Optional)</span>
                </Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="Enter discount percentage"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500">Optional discount to apply to the payment</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading || orderLoading || !formData.order_id}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:bg-orange-900 text-white font-semibold py-3 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Payment...
                    </>
                  ) : (
                    <>
                      Create Payment
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Response Message */}
            {responseMessage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Alert
                  className={messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                >
                  <AlertDescription className={messageType === "success" ? "text-green-800" : "text-red-800"}>
                    {responseMessage}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Form
