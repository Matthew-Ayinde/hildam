import {
  ReadyToWearEditContext,
  ReadyToWearFormValues,
  ReadyToWearProduct,
  ReadyToWearValidationErrors,
  ReadyToWearVariant,
  ReadyToWearVariantInput,
  StockStatus,
} from "./types"

export const createEmptyVariant = (): ReadyToWearVariantInput => ({
  clientId: `variant-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  color: "",
  size: "",
  quantity: 0,
})

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const normalizeVariant = (variant: any): ReadyToWearVariant => ({
  id: variant?.id != null ? String(variant.id) : undefined,
  color: variant?.color ?? "",
  size: variant?.size ?? "",
  quantity: toNumber(variant?.quantity_in_stock ?? variant?.quantity ?? variant?.qty ?? 0),
  quantitySold: toNumber(variant?.quantity_sold ?? 0),
  images: Array.isArray(variant?.product_images) ? variant.product_images : [],
  createdAt: variant?.created_at,
  updatedAt: variant?.updated_at,
})

export const computeStockStatus = (variants: ReadyToWearVariant[], explicitStatus?: string): StockStatus => {
  if (explicitStatus === "in_stock" || explicitStatus === "low_stock" || explicitStatus === "out_of_stock") {
    return explicitStatus
  }

  const totalStock = variants.reduce((sum, variant) => sum + Math.max(0, variant.quantity), 0)
  if (totalStock <= 0) return "out_of_stock"
  if (totalStock <= 5) return "low_stock"
  return "in_stock"
}

export const normalizeReadyToWearProduct = (raw: any): ReadyToWearProduct => {
  const variants = Array.isArray(raw?.variants) ? raw.variants.map(normalizeVariant) : []
  const quantityInStock = toNumber(raw?.quantity_in_stock)
  const inferredStockStatus =
    variants.length > 0
      ? computeStockStatus(variants, raw?.stock_status)
      : quantityInStock <= 0
        ? "out_of_stock"
        : quantityInStock <= 5
          ? "low_stock"
          : "in_stock"

  return {
    id: raw?.id != null ? String(raw.id) : "",
    name: raw?.name ?? raw?.product_name ?? "",
    category: raw?.category ?? "",
    description: raw?.description ?? "",
    fabricType: raw?.fabric_type,
    costPrice: toNumber(raw?.cost_price ?? raw?.costPrice),
    sellingPrice: toNumber(raw?.selling_price ?? raw?.sellingPrice),
    quantityInStock,
    quantitySold: toNumber(raw?.quantity_sold),
    reorderLevel: toNumber(raw?.reorder_level),
    stockStatus: inferredStockStatus,
    status: raw?.status,
    images: raw?.images ?? raw?.product_images ?? raw?.image_urls ?? [],
    variants,
    createdAt: raw?.created_at,
    updatedAt: raw?.updated_at,
  }
}

export const buildFormValuesFromProduct = (product: ReadyToWearProduct): ReadyToWearFormValues => ({
  name: product.name,
  category: product.category,
  fabricType: product.fabricType || "",
  status: product.status || "active",
  description: product.description,
  costPrice: product.costPrice,
  sellingPrice: product.sellingPrice,
  reorderLevel: product.reorderLevel ?? 0,
  variants:
    product.variants.length > 0
      ? product.variants.map((variant) => ({
          clientId: `variant-${variant.id ?? Math.random().toString(16).slice(2)}`,
          id: variant.id,
          color: variant.color,
          size: variant.size,
          quantity: variant.quantity,
        }))
      : [createEmptyVariant()],
  newImages: [],
})

export const validateReadyToWearForm = (
  values: ReadyToWearFormValues,
  mode: "create" | "edit"
): ReadyToWearValidationErrors => {
  const errors: ReadyToWearValidationErrors = {
    variantFieldErrors: {},
  }

  if (!values.name.trim()) errors.name = "Product name is required"
  if (!values.category.trim()) errors.category = "Category is required"
  if (!values.fabricType.trim()) errors.fabricType = "Fabric type is required"

  if (values.status && !["active", "inactive"].includes(values.status)) {
    errors.status = "Status must be active or inactive"
  }

  if (values.costPrice < 0) errors.costPrice = "Cost price cannot be negative"
  if (values.sellingPrice <= values.costPrice) {
    errors.sellingPrice = "Selling price must be greater than cost price"
  }

  if (values.reorderLevel < 0) {
    errors.reorderLevel = "Reorder level cannot be negative"
  }

  if (!values.variants.length) {
    errors.variants = "At least one variant is required"
  }

  values.variants.forEach((variant) => {
    const fieldError: { color?: string; size?: string; quantity?: string } = {}

    if (!variant.color.trim()) fieldError.color = "Color is required"
    if (!variant.size.trim()) fieldError.size = "Size is required"
    if (variant.quantity < 0) fieldError.quantity = "Quantity cannot be negative"

    if (Object.keys(fieldError).length > 0) {
      errors.variantFieldErrors[variant.clientId] = fieldError
    }
  })

  if (mode === "create" && values.newImages.length === 0) {
    errors.images = "Upload at least one product image"
  }

  const hasInvalidImage = values.newImages.some((image) => image.size > 5 * 1024 * 1024)
  if (hasInvalidImage) {
    errors.images = "Each image must be 5MB or smaller"
  }

  return errors
}

const appendBaseProductFields = (formData: FormData, values: ReadyToWearFormValues) => {
  formData.append("name", values.name.trim())
  formData.append("product_name", values.name.trim())
  formData.append("category", values.category.trim())
  formData.append("fabric_type", values.fabricType.trim())
  formData.append("status", values.status || "active")
  formData.append("description", values.description.trim())
  formData.append("cost_price", String(values.costPrice))
  formData.append("selling_price", String(values.sellingPrice))
  formData.append("reorder_level", String(values.reorderLevel))
}

const mapVariantForPayload = (variant: ReadyToWearVariantInput) => ({
  ...(variant.id ? { id: variant.id } : {}),
  color: variant.color.trim(),
  size: variant.size.trim(),
  quantity: Number(variant.quantity),
})

export const buildCreateProductFormData = (values: ReadyToWearFormValues): FormData => {
  const formData = new FormData()
  appendBaseProductFields(formData, values)

  const variants = values.variants.map(mapVariantForPayload)
  formData.append("variants", JSON.stringify(variants))

  values.newImages.forEach((image) => {
    formData.append("images[]", image)
    formData.append("product_images[]", image)
  })

  return formData
}

export const buildEditProductFormData = ({ originalProduct, values }: ReadyToWearEditContext): FormData => {
  const formData = new FormData()
  appendBaseProductFields(formData, values)

  const existingVariantIds = new Set(originalProduct.variants.filter((variant) => variant.id).map((variant) => String(variant.id)))
  const submittedVariants = values.variants.map(mapVariantForPayload)
  const submittedExistingVariantIds = new Set(
    submittedVariants.filter((variant) => variant.id != null).map((variant) => String(variant.id))
  )

  const updatedVariants = submittedVariants.filter((variant) => variant.id != null)
  const newVariants = submittedVariants.filter((variant) => variant.id == null)
  const deletedVariantIds = Array.from(existingVariantIds).filter((id) => !submittedExistingVariantIds.has(id))

  formData.append("variants", JSON.stringify(submittedVariants))
  formData.append("updated_variants", JSON.stringify(updatedVariants))
  formData.append("new_variants", JSON.stringify(newVariants))
  formData.append("deleted_variant_ids", JSON.stringify(deletedVariantIds))

  if (values.newImages.length > 0) {
    formData.append("replace_images", "true")
    values.newImages.forEach((image) => {
      formData.append("images[]", image)
      formData.append("product_images[]", image)
    })
  } else {
    formData.append("replace_images", "false")
  }

  return formData
}
