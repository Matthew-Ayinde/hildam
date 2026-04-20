"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ReadyToWearProduct } from "@/features/ready-to-wear/types"
import { CreateSalePayload, SalePaymentMethod } from "@/features/ready-to-wear-sales/types"

const paymentMethods: SalePaymentMethod[] = [
  "cash",
  "card",
  "mobile_money",
  "bank_transfer",
  "other",
]

interface SaleFormModalProps {
  open: boolean
  isSaving: boolean
  products: ReadyToWearProduct[]
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CreateSalePayload) => Promise<void>
}

export default function SaleFormModal({
  open,
  isSaving,
  products,
  onOpenChange,
  onSubmit,
}: SaleFormModalProps) {
  const [productId, setProductId] = useState("")
  const [variantId, setVariantId] = useState("")
  const [quantitySold, setQuantitySold] = useState(1)
  const [saleDate, setSaleDate] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<SalePaymentMethod>("cash")
  const [notes, setNotes] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  )

  useEffect(() => {
    if (!open) {
      setProductId("")
      setVariantId("")
      setQuantitySold(1)
      setSaleDate("")
      setCustomerName("")
      setCustomerPhone("")
      setCustomerAddress("")
      setPaymentMethod("cash")
      setNotes("")
      setValidationError(null)
    }
  }, [open])

  const handleSubmit = async () => {
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

    setValidationError(null)

    try {
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
      })
      onOpenChange(false)
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Unable to record sale. Try again."
      )
    }
  }

  const variantOptions = selectedProduct?.variants ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Ready-to-Wear Sale</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="product">Product</Label>
              <Select value={productId} onValueChange={(value) => setProductId(value)}>
                <SelectTrigger id="product" aria-label="Select product">
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
              <Label htmlFor="variant">Variant (optional)</Label>
              <Select value={variantId} onValueChange={(value) => setVariantId(value)}>
                <SelectTrigger id="variant" aria-label="Select variant">
                  <SelectValue placeholder={variantOptions.length > 0 ? "Choose a variant" : "Select a product first"} />
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
              <Label htmlFor="quantity">Quantity Sold</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantitySold}
                onChange={(event) => setQuantitySold(Number(event.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="saleDate">Sale Date</Label>
              <Input
                id="saleDate"
                type="date"
                value={saleDate}
                onChange={(event) => setSaleDate(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as SalePaymentMethod)}
              >
                <SelectTrigger id="paymentMethod" aria-label="Choose payment method">
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

          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                placeholder="08012345678"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerAddress">Customer Address</Label>
            <Input
              id="customerAddress"
              value={customerAddress}
              onChange={(event) => setCustomerAddress(event.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Gift wrapping, delivery instructions, etc."
            />
          </div>

          {validationError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validationError}
            </div>
          ) : null}
        </div>

        <DialogFooter className="space-x-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Record Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
