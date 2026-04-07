"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  getCachedProduct,
  getCachedProductList,
  invalidateReadyToWearCache,
  setCachedProduct,
  setCachedProductList,
} from "./cache"
import {
  createReadyToWearProduct,
  getAllReadyToWearProducts,
  getReadyToWearProductById,
  removeReadyToWearProduct,
  updateReadyToWearProduct,
} from "./service"
import { ReadyToWearProduct } from "./types"

export function useReadyToWearProducts() {
  const [products, setProducts] = useState<ReadyToWearProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getAllReadyToWearProducts()
      setProducts(data)
      setCachedProductList(data)
      data.forEach((product) => setCachedProduct(product))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const cached = getCachedProductList()
    if (cached) {
      setProducts(cached)
      setIsLoading(false)
      return
    }

    void refetch()
  }, [refetch])

  return {
    products,
    isLoading,
    error,
    refetch,
  }
}

export function useReadyToWearProduct(id: string) {
  const [product, setProduct] = useState<ReadyToWearProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getReadyToWearProductById(id)
      setProduct(data)
      setCachedProduct(data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to fetch product")
      setProduct(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return

    const cached = getCachedProduct(id)
    if (cached) {
      setProduct(cached)
      setIsLoading(false)
      return
    }

    void refetch()
  }, [id, refetch])

  return {
    product,
    isLoading,
    error,
    refetch,
  }
}

export function useReadyToWearMutations() {
  const [isMutating, setIsMutating] = useState(false)

  const createProduct = useCallback(async (payload: FormData) => {
    setIsMutating(true)
    try {
      const created = await createReadyToWearProduct(payload)
      invalidateReadyToWearCache()
      return created
    } finally {
      setIsMutating(false)
    }
  }, [])

  const editProduct = useCallback(async (id: string, payload: FormData) => {
    setIsMutating(true)
    try {
      const updated = await updateReadyToWearProduct(id, payload)
      invalidateReadyToWearCache(id)
      return updated
    } finally {
      setIsMutating(false)
    }
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    setIsMutating(true)
    try {
      await removeReadyToWearProduct(id)
      invalidateReadyToWearCache(id)
    } finally {
      setIsMutating(false)
    }
  }, [])

  return useMemo(
    () => ({
      isMutating,
      createProduct,
      editProduct,
      deleteProduct,
    }),
    [createProduct, deleteProduct, editProduct, isMutating]
  )
}
