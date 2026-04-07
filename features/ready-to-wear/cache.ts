import { ReadyToWearProduct } from "./types"

type ProductListCache = {
  data: ReadyToWearProduct[]
  timestamp: number
} | null

const TTL_MS = 60_000
let productListCache: ProductListCache = null
const productByIdCache = new Map<string, { data: ReadyToWearProduct; timestamp: number }>()

export const getCachedProductList = (): ReadyToWearProduct[] | null => {
  if (!productListCache) return null
  if (Date.now() - productListCache.timestamp > TTL_MS) {
    productListCache = null
    return null
  }
  return productListCache.data
}

export const setCachedProductList = (products: ReadyToWearProduct[]) => {
  productListCache = {
    data: products,
    timestamp: Date.now(),
  }
}

export const getCachedProduct = (id: string): ReadyToWearProduct | null => {
  const cached = productByIdCache.get(id)
  if (!cached) return null

  if (Date.now() - cached.timestamp > TTL_MS) {
    productByIdCache.delete(id)
    return null
  }

  return cached.data
}

export const setCachedProduct = (product: ReadyToWearProduct) => {
  productByIdCache.set(product.id, {
    data: product,
    timestamp: Date.now(),
  })
}

export const invalidateReadyToWearCache = (productId?: string) => {
  productListCache = null
  if (productId) {
    productByIdCache.delete(productId)
    return
  }
  productByIdCache.clear()
}
