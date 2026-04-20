"use client"

import { useParams } from "next/navigation"
import PaymentEditForm from "@/components/payments/PaymentEditForm"

export default function EditPaymentPage() {
  const { id } = useParams()
  const paymentId = id as string

  return (
    <PaymentEditForm
      paymentId={paymentId}
      backHref="/admin/payments"
      cancelHref={`/admin/payments/${paymentId}`}
      successRedirectHref="/admin/payments"
    />
  )
}