"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchPayment } from "@/app/api/apiClient"
import PaymentDocument, { type PaymentDocumentData } from "@/components/payments/PaymentDocument"
import { mapPaymentToDocumentData } from "@/lib/paymentDocument"

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState<PaymentDocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()
  const paymentId = id as string

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await fetchPayment(paymentId)
        setInvoiceData(result ? mapPaymentToDocumentData(result) : null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoiceData()
  }, [paymentId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading invoice...
      </div>
    )
  }

  if (error || !invoiceData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || "No invoice data found"}
      </div>
    )
  }

  return <PaymentDocument variant="invoice" fileName={`invoice-${invoiceData.orderId}.pdf`} data={invoiceData} />
}
