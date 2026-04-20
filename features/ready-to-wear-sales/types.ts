export type SalePaymentMethod = "cash" | "card" | "mobile_money" | "bank_transfer" | "other"

export interface SaleProduct {
  id: string
  product_name: string
  selling_price: string
  cost_price: string
}

export interface SaleVariant {
  id: string
  color?: string
  size?: string
}

export interface Sale {
  id: string
  product_id: string
  product_variant_id?: string | null
  quantity_sold: number
  unit_price: string
  unit_cost: string
  total_amount: string
  profit: string
  sale_date: string
  customer_name: string
  customer_phone: string
  customer_address: string
  payment_method: SalePaymentMethod
  notes?: string | null
  created_at?: string
  updated_at?: string
  product?: SaleProduct | null
  variant?: SaleVariant | null
}

export interface SaleQueryFilters {
  from_date?: string
  to_date?: string
  product_id?: string
  payment_method?: SalePaymentMethod
  customer_name?: string
}

export interface CreateSalePayload {
  product_id: string
  product_variant_id?: string
  quantity_sold: number
  sale_date: string
  customer_name: string
  customer_phone: string
  customer_address: string
  payment_method: SalePaymentMethod
  notes?: string
}

export interface UpdateSalePayload {
  sale_date?: string
  customer_name?: string
  customer_phone?: string
  customer_address?: string
  payment_method?: SalePaymentMethod
  notes?: string
}
