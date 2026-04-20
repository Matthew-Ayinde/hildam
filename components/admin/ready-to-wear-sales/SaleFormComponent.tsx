"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ReadyToWearProduct } from "@/features/ready-to-wear/types"
import { CreateSalePayload, Sale, SalePaymentMethod, UpdateSalePayload } from "@/features/ready-to-wear-sales/types"

const paymentMethods: SalePaymentMethod[] = [
  "cash",
  "card",
  "mobile_money",
  "bank_transfer",
  "other",
]

interface SaleFormBaseProps {
  products: ReadyToWearProduct[]
  isLoading?: boolean
  onCancel: () => void
}

interface CreateSaleFormProps extends SaleFormBaseProps {
  mode: "create"
  sale?: Sale | null
  onSubmit: (payload: CreateSalePayload) => Promise<void>
}

interface EditSaleFormProps extends SaleFormBaseProps {
  mode: "edit"
  sale: Sale
  onSubmit: (payload: UpdateSalePayload) => Promise<void>
}

type SaleFormComponentProps = CreateSaleFormProps | EditSaleFormProps

export default function SaleFormComponent({
  mode,
  products,
  sale,
  isLoading = false,
  onSubmit,
  onCancel,
}: SaleFormComponentProps) {
  const [productId, setProductId] = useState(sale?.product_id || "")
  const [variantId, setVariantId] = useState(sale?.product_variant_id || "")
  const [quantitySold, setQuantitySold] = useState(sale?.quantity_sold || 1)
  const [saleDate, setSaleDate] = useState(sale?.sale_date || "")
  const [customerName, setCustomerName] = useState(sale?.customer_name || "")
  const [customerPhone, setCustomerPhone] = useState(sale?.customer_phone || "")
  const [customerAddress, setCustomerAddress] = useState(sale?.customer_address || "")
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>(
    (sale?.payment_method as SalePaymentMethod) || "cash"
  )
  const [notes, setNotes] = useState(sale?.notes || "")
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  )

  const variantOptions = selectedProduct?.variants ?? []

  const handleSubmit = async () => {
    if (mode === "create") {
      if (!productId) {
        setValidationError("Please choose a product.")
        return
      }

      if (!saleDate) {
        setValidationError("Sale date is required.")
        return
      }

      if (!customerName.trim()) {
        setValidationError("Customer name is required.")
        return
      }

      if (!paymentMethod) {
        setValidationError("Payment method is required.")
        return
      }

      if (quantitySold < 1) {
        setValidationError("Quantity sold must be at least 1.")
        return
      }
    } else {
      // Edit mode - only validate customer info and dates
      if (!saleDate) {
        setValidationError("Sale date is required.")
        return
      }

      if (!customerName.trim()) {
        setValidationError("Customer name is required.")
        return
      }

      if (!paymentMethod) {
        setValidationError("Payment method is required.")
        return
      }
    }

    setValidationError(null)
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await onSubmit({
          product_id: productId,
          product_variant_id: variantId || undefined,
          quantity_sold: quantitySold,
          sale_date: saleDate,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_address: customerAddress.trim(),
          payment_method: paymentMethod,
          notes: notes.trim() || undefined,
        } as CreateSalePayload)
      } else {
        await onSubmit({
          sale_date: saleDate,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_address: customerAddress.trim(),
          payment_method: paymentMethod,
          notes: notes.trim() || undefined,
        } as UpdateSalePayload)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "create" ? "Record Ready-to-Wear Sale" : "Edit Sale Details"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {mode === "create"
            ? "Add a new sale record for ready-to-wear products."
            : "Update customer information and payment details."}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6">
          {mode === "create" && (
            <>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label htmlFor="product" className="text-base font-semibold">
                    Product
                  </Label>
                  <Select value={productId} onValueChange={(value) => setProductId(value)}>
                    <SelectTrigger id="product" aria-label="Select product" className="mt-2">
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="variant" className="text-base font-semibold">
                    Variant (optional)
                  </Label>
                  <Select value={variantId} onValueChange={(value) => setVariantId(value)}>
                    <SelectTrigger
                      id="variant"
                      aria-label="Select variant"
                      className="mt-2"
                      disabled={variantOptions.length === 0}
                    >
                      <SelectValue
                        placeholder={
                          variantOptions.length > 0 ? "Choose a variant" : "Select a product first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {variantOptions.map((variant) => (
                        <SelectItem key={variant.id} value={variant.id ?? ""}>
                          {variant.color || "Variant"} {variant.size ? `- ${variant.size}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <Label htmlFor="quantity" className="text-base font-semibold">
                    Quantity Sold
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={quantitySold}
                    onChange={(event) => setQuantitySold(Number(event.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="saleDate" className="text-base font-semibold">
                    Sale Date
                  </Label>
                  <Input
                    id="saleDate"
                    type="date"
                    value={saleDate}
                    onChange={(event) => setSaleDate(event.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod" className="text-base font-semibold">
                    Payment Method
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as SalePaymentMethod)}
                  >
                    <SelectTrigger
                      id="paymentMethod"
                      aria-label="Choose payment method"
                      className="mt-2"
                    >
                      <SelectValue placeholder="Payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {mode === "edit" && (
            <>
              <div>
                <Label className="text-sm font-medium text-gray-600">Product</Label>
                <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {sale?.product?.product_name || "Unknown product"}
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Quantity</Label>
                  <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {sale?.quantity_sold || 0}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
                  <div className="mt-2 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    ₦{sale?.total_amount || "0"}
                  </div>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <Label htmlFor="saleDate" className="text-base font-semibold">
                    Sale Date
                  </Label>
                  <Input
                    id="saleDate"
                    type="date"
                    value={saleDate}
                    onChange={(event) => setSaleDate(event.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod" className="text-base font-semibold">
                    Payment Method
                  </Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as SalePaymentMethod)}
                  >
                    <SelectTrigger
                      id="paymentMethod"
                      aria-label="Choose payment method"
                      className="mt-2"
                    >
                      <SelectValue placeholder="Payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="customerName" className="text-base font-semibold">
                Customer Name
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Jane Doe"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone" className="text-base font-semibold">
                Phone Number
              </Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="08012345678"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerAddress" className="text-base font-semibold">
              Customer Address
            </Label>
            <Input
              id="customerAddress"
              value={customerAddress}
              onChange={(event) => setCustomerAddress(event.target.value)}
              placeholder="123 Main St"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-base font-semibold">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Gift wrapping, delivery instructions, etc."
              className="mt-2"
            />
          </div>

          {validationError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validationError}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting || isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Saving..." : mode === "create" ? "Record Sale" : "Update Sale"}
        </Button>
      </div>
    </div>
  )
}
