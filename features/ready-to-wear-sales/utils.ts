import { Sale } from "./types"

export const normalizeSale = (raw: any): Sale => {
  return {
    id: String(raw?.id ?? ""),
    product_id: String(raw?.product_id ?? ""),
    product_variant_id:
      raw?.product_variant_id === null || raw?.product_variant_id === undefined
        ? null
        : String(raw.product_variant_id),
    quantity_sold: Number(raw?.quantity_sold ?? 0),
    unit_price: String(raw?.unit_price ?? "0"),
    unit_cost: String(raw?.unit_cost ?? "0"),
    total_amount: String(raw?.total_amount ?? "0"),
    profit: String(raw?.profit ?? "0"),
    sale_date: String(raw?.sale_date ?? ""),
    customer_name: String(raw?.customer_name ?? ""),
    customer_phone: String(raw?.customer_phone ?? ""),
    customer_address: String(raw?.customer_address ?? ""),
    payment_method: String(raw?.payment_method ?? "cash") as any,
    notes: raw?.notes ?? null,
    created_at: raw?.created_at ? String(raw.created_at) : undefined,
    updated_at: raw?.updated_at ? String(raw.updated_at) : undefined,
    product: raw?.product
      ? {
          id: String(raw.product.id ?? ""),
          product_name: String(raw.product.product_name ?? ""),
          selling_price: String(raw.product.selling_price ?? "0"),
          cost_price: String(raw.product.cost_price ?? "0"),
        }
      : null,
    variant: raw?.variant
      ? {
          id: String(raw.variant.id ?? ""),
          color: raw.variant.color ? String(raw.variant.color) : undefined,
          size: raw.variant.size ? String(raw.variant.size) : undefined,
        }
      : null,
  }
}
