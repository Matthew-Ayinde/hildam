import {
  addReadyToWearProduct,
  deleteReadyToWearProduct,
  editReadyToWearProduct,
  fetchAllReadyToWearProducts,
  fetchReadyToWearProduct,
} from "@/app/api/apiClient"
import { ReadyToWearListApiResponse, ReadyToWearProduct } from "./types"
import { normalizeReadyToWearProduct } from "./utils"

export const getAllReadyToWearProducts = async (): Promise<ReadyToWearProduct[]> => {
  const response = await fetchAllReadyToWearProducts()

  const rows = Array.isArray(response)
    ? response
    : Array.isArray((response as ReadyToWearListApiResponse)?.products)
      ? (response as ReadyToWearListApiResponse).products
      : []

  return rows.map(normalizeReadyToWearProduct)
}

export const getReadyToWearProductById = async (id: string): Promise<ReadyToWearProduct> => {
  const response = await fetchReadyToWearProduct(id)
  return normalizeReadyToWearProduct(response)
}

export const createReadyToWearProduct = async (payload: FormData): Promise<ReadyToWearProduct> => {
  const response = await addReadyToWearProduct(payload)
  return normalizeReadyToWearProduct(response?.data ?? response)
}

export const updateReadyToWearProduct = async (id: string, payload: FormData): Promise<ReadyToWearProduct> => {
  const response = await editReadyToWearProduct(id, payload)
  return normalizeReadyToWearProduct(response?.data ?? response)
}

export const removeReadyToWearProduct = async (id: string): Promise<void> => {
  await deleteReadyToWearProduct(id)
}
