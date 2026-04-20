import {
  addSale,
  deleteSale,
  editSale,
  fetchAllSales,
  fetchSale,
} from "@/app/api/apiClient"
import { CreateSalePayload, Sale, SaleQueryFilters, UpdateSalePayload } from "./types"
import { normalizeSale } from "./utils"

export const getSales = async (filters?: SaleQueryFilters): Promise<Sale[]> => {
  const response = await fetchAllSales(filters as Record<string, string | undefined> | undefined)
  const rows = Array.isArray(response?.sales)
    ? response.sales
    : Array.isArray(response)
    ? response
    : []

  return rows.map(normalizeSale)
}

export const getSaleById = async (id: string): Promise<Sale> => {
  const response = await fetchSale(id)
  return normalizeSale(response?.sale ?? response)
}

export const createSale = async (payload: CreateSalePayload): Promise<Sale> => {
  const response = await addSale(payload)
  return normalizeSale(response?.sale ?? response)
}

export const updateSale = async (id: string, payload: UpdateSalePayload): Promise<Sale> => {
  const response = await editSale(id, payload)
  return normalizeSale(response?.sale ?? response)
}

export const removeSale = async (id: string): Promise<void> => {
  await deleteSale(id)
}
