"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createSale, getSaleById, getSales, removeSale, updateSale } from "./service"
import { CreateSalePayload, Sale, SaleQueryFilters, UpdateSalePayload } from "./types"

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async (filters?: SaleQueryFilters) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getSales(filters)
      setSales(data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load sales")
      setSales([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return {
    sales,
    isLoading,
    error,
    refetch,
  }
}

export function useSale(id: string) {
  const [sale, setSale] = useState<Sale | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getSaleById(id)
      setSale(data)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load sale")
      setSale(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    void refetch()
  }, [id, refetch])

  return {
    sale,
    isLoading,
    error,
    refetch,
  }
}

export function useSaleMutations() {
  const [isMutating, setIsMutating] = useState(false)

  const createSaleMutation = useCallback(async (payload: CreateSalePayload) => {
    setIsMutating(true)
    try {
      return await createSale(payload)
    } finally {
      setIsMutating(false)
    }
  }, [])

  const editSaleMutation = useCallback(async (id: string, payload: UpdateSalePayload) => {
    setIsMutating(true)
    try {
      return await updateSale(id, payload)
    } finally {
      setIsMutating(false)
    }
  }, [])

  const deleteSaleMutation = useCallback(async (id: string) => {
    setIsMutating(true)
    try {
      await removeSale(id)
    } finally {
      setIsMutating(false)
    }
  }, [])

  return useMemo(
    () => ({
      isMutating,
      createSale: createSaleMutation,
      editSale: editSaleMutation,
      deleteSale: deleteSaleMutation,
    }),
    [createSaleMutation, deleteSaleMutation, editSaleMutation, isMutating]
  )
}
