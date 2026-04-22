import type { PaymentDocumentData } from "@/components/payments/PaymentDocument"

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const resolveVatAmount = (result: any): string => {
  const apiVatAmount =
    result?.vat_amount ??
    result?.VAT_amount ??
    result?.vatAmount ??
    result?.calculated_vat ??
    result?.calculatedVAT

  if (apiVatAmount !== undefined && apiVatAmount !== null && apiVatAmount !== "") {
    return String(apiVatAmount)
  }

  const goingRate = toNumber(result?.going_rate)
  const vatRate = toNumber(result?.VAT)
  const vatAmount = (goingRate * vatRate) / 100

  return vatAmount > 0 ? String(vatAmount) : "N/A"
}

export const mapPaymentToDocumentData = (result: any): PaymentDocumentData => ({
  orderId: result?.order_id || "N/A",
  createdAt: result?.created_at || "N/A",
  customerName: result?.customer_name || "N/A",
  customerEmail: result?.customer_email || "N/A",
  phoneNumber: result?.customer_phone_number || "N/A",
  address: result?.customer_address || "N/A",
  clothingName: result?.clothing_name || "N/A",
  clothingDescription: result?.clothing_description || "N/A",
  goingRate: result?.going_rate || "N/A",
  vat: result?.VAT || "N/A",
  vatAmount: resolveVatAmount(result),
  discount: result?.discount || "N/A",
  totalAmountDue: result?.total_amount_due || "N/A",
  amountPaid: result?.amount_paid || "N/A",
  balanceRemaining: result?.balance_remaining || "N/A",
})
