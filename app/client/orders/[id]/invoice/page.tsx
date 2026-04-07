"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Spinner from "@/components/Spinner"
import PaymentDocument, { type PaymentDocumentData } from "@/components/payments/PaymentDocument"

export default function ClientInvoicePage() {
  const { id } = useParams()
  const orderId = id as string

  const [invoiceData, setInvoiceData] = useState<PaymentDocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      setError(null)

      try {
        const accessToken = sessionStorage.getItem("access_token")
        const response = await fetch(`https://hildam.insightpublicis.com/api/myorders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch invoice data")
        }

        const result = await response.json()
        const order = result?.data

        if (!order) {
          setInvoiceData(null)
          return
        }

        setInvoiceData({
          orderId: order.order_id || "N/A",
          createdAt: order.created_at || "N/A",
          customerName: order.customer_name || "N/A",
          customerEmail: order.customer_email || "N/A",
          phoneNumber: order.phone_number || "N/A",
          address: order.address || "N/A",
          clothingName: order.clothing_name || "N/A",
          clothingDescription: order.clothing_description || "N/A",
          goingRate: order.amount || "N/A",
          vat: "0",
          discount: "0",
          totalAmountDue: order.amount || "N/A",
          amountPaid: order.amount || "N/A",
          balanceRemaining: "0",
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Spinner />
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

  return (
    <>
      <PaymentDocument variant="invoice" fileName={`invoice-${invoiceData.orderId}.pdf`} data={invoiceData} />
      <div className="no-print fixed bottom-6 right-6">
        <Link
          href={`/client/orders/${orderId}/payment`}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          Make Payment
        </Link>
      </div>
    </>
  )
}
