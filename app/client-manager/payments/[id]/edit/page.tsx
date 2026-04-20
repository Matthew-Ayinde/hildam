"use client"

import { useParams } from "next/navigation"
import PaymentEditForm from "@/components/payments/PaymentEditForm"

export default function EditPaymentPage() {
  const { id } = useParams()
  const paymentId = id as string

  return (
    <PaymentEditForm
      paymentId={paymentId}
      backHref="/client-manager/payments"
      cancelHref={`/client-manager/payments/${paymentId}`}
      successRedirectHref="/client-manager/payments"
    />
  )
}