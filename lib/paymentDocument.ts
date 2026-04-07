import type { PaymentDocumentData } from "@/components/payments/PaymentDocument"

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
  discount: result?.discount || "N/A",
  totalAmountDue: result?.total_amount_due || "N/A",
  amountPaid: result?.amount_paid || "N/A",
  balanceRemaining: result?.balance_remaining || "N/A",
})
