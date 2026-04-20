export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

export interface ReadyToWearVariant {
  id?: string
  color: string
  size: string
  quantity: number
  quantitySold?: number
  images?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ReadyToWearProduct {
  id: string
  name: string
  category: string
  description: string
  fabricType?: string
  costPrice: number
  sellingPrice: number
  quantityInStock?: number
  quantitySold?: number
  reorderLevel?: number
  stockStatus: StockStatus
  status?: string
  images: string[]
  variants: ReadyToWearVariant[]
  createdAt?: string
  updatedAt?: string
}

export interface ReadyToWearListApiProduct {
  id: number | string
  product_name: string
  description: string
  category: string
  selling_price: string | number
  product_images: string[]
}

export interface ReadyToWearListApiResponse {
  success: boolean
  products: ReadyToWearListApiProduct[]
}

export interface ReadyToWearDetailApiResponse {
  success?: boolean
  data?: Record<string, unknown>
  product?: Record<string, unknown>
}

export interface ReadyToWearDetailApiVariant {
  id: number | string
  product_id?: number | string
  color: string
  size: string
  quantity_in_stock: number | string
  quantity_sold?: number | string
  product_images?: string[] | null
  created_at?: string
  updated_at?: string
}

export interface ReadyToWearDetailApiProduct {
  id: number | string
  product_name: string
  description: string
  category: string
  fabric_type?: string
  cost_price?: number | string
  selling_price?: number | string
  quantity_in_stock?: number | string
  quantity_sold?: number | string
  reorder_level?: number | string
  stock_status?: StockStatus
  product_images?: string[]
  status?: string
  created_at?: string
  updated_at?: string
  variants?: ReadyToWearDetailApiVariant[]
}

export interface ReadyToWearVariantInput {
  clientId: string
  id?: string
  color: string
  size: string
  quantity: number
}

export interface ReadyToWearFormValues {
  name: string
  category: string
  costPrice: number
  sellingPrice: number
  variants: ReadyToWearVariantInput[]
  newImages: File[]
}

export interface ReadyToWearValidationErrors {
  name?: string
  category?: string
  costPrice?: string
  sellingPrice?: string
  variants?: string
  images?: string
  variantFieldErrors: Record<string, { color?: string; size?: string; quantity?: string }>
}

export interface ReadyToWearEditContext {
  originalProduct: ReadyToWearProduct
  values: ReadyToWearFormValues
}
