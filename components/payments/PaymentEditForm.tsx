"use client"

import { useEffect, useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { IoIosArrowBack } from "react-icons/io"
import { AiOutlineBarChart } from "react-icons/ai"
import { getSession } from "next-auth/react"
import Spinner from "@/components/Spinner"
import { editPayment, fetchPayment } from "@/app/api/apiClient"

interface PaymentEditFormProps {
  paymentId: string
  backHref: string
  cancelHref: string
  successRedirectHref: string
}

interface PaymentFormState {
  order_id: string
  payment_status: string
  going_rate: string
  VAT: string
  discount: string
  amount_paid: string
  total_amount_due: string
  balance_remaining: string
}

const parseNumberInput = (value: string) => {
  if (value.trim() === "") return undefined
  const parsedValue = Number.parseFloat(value)
  return Number.isNaN(parsedValue) ? undefined : parsedValue
}

const formatCurrency = (value: string) => {
  const parsedValue = Number.parseFloat(value)
  if (Number.isNaN(parsedValue)) return value || "0"
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parsedValue)
}

export default function PaymentEditForm({
  paymentId,
  backHref,
  cancelHref,
  successRedirectHref,
}: PaymentEditFormProps) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState<PaymentFormState>({
    order_id: "",
    payment_status: "",
    going_rate: "",
    VAT: "",
    discount: "",
    amount_paid: "",
    total_amount_due: "",
    balance_remaining: "",
  })

  const loadPayment = async () => {
    setLoading(true)
    setError("")

    try {
      const payment = await fetchPayment(paymentId)
      setFormData({
        order_id: payment.order_id ?? "",
        payment_status: payment.payment_status ?? "",
        going_rate: payment.going_rate ?? "",
        VAT: payment.VAT ?? "",
        discount: payment.discount ?? "",
        amount_paid: payment.amount_paid ?? "",
        total_amount_due: payment.total_amount_due ?? "",
        balance_remaining: payment.balance_remaining ?? "",
      })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPayment()
  }, [paymentId])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setSuccessMessage("")
    setSubmitting(true)

    try {
      const session = await getSession()
      const token = session?.user?.token
      if (!token) {
        throw new Error("Access token not found in session storage.")
      }

      const payload = {
        order_id: formData.order_id,
        going_rate: parseNumberInput(formData.going_rate) ?? 0,
        VAT: parseNumberInput(formData.VAT) ?? 0,
        discount: parseNumberInput(formData.discount),
        amount_paid: parseNumberInput(formData.amount_paid) ?? 0,
      }

      await editPayment(paymentId, payload)
      setSuccessMessage("Payment updated successfully!")

      setTimeout(() => {
        router.push(successRedirectHref)
      }, 1500)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">
        <p>Error: {error}</p>
        <button onClick={() => void loadPayment()} className="mt-4 text-blue-600 underline">
          Retry
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto rounded-3xl bg-white p-8 shadow-lg"
    >
      {successMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center rounded-full bg-green-500 px-6 py-2 text-white shadow-md"
        >
          <div className="mr-2">₦</div>
          {successMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Link href={backHref} className="flex items-center text-orange-500 transition hover:text-orange-700">
          <IoIosArrowBack size={24} />
          <span className="ml-2">Back to List</span>
        </Link>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block font-semibold text-gray-700">Order ID</label>
            <input
              type="text"
              value={formData.order_id}
              disabled
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-600 bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">Payment Status</label>
            <input
              type="text"
              value={formData.payment_status}
              disabled
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-600 bg-gray-50"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">
              <span className="mr-1 inline text-xl">₦</span> Going Rate
            </label>
            <input
              type="number"
              name="going_rate"
              value={formData.going_rate}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">
              <span className="mr-1 inline text-xl">₦</span> Amount Paid
            </label>
            <input
              type="number"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">
              <AiOutlineBarChart className="mr-1 inline" /> VAT (%)
            </label>
            <input
              type="number"
              name="VAT"
              value={formData.VAT}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="0.00"
              step="0.01"
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 p-3"
              placeholder="0.00"
              step="0.01"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">Total Amount Due</label>
            <input
              type="text"
              value={formatCurrency(formData.total_amount_due)}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-600"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-gray-700">Balance Remaining</label>
            <input
              type="text"
              value={formatCurrency(formData.balance_remaining)}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-600"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <motion.button
            type="button"
            onClick={() => router.push(cancelHref)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-gray-500 px-6 py-3 text-white"
            disabled={submitting}
          >
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-orange-500 px-6 py-3 text-white disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}