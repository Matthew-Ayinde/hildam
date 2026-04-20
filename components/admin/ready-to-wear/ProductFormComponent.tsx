"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import VariantForm from "./VariantForm"
import ImageUploader from "./ImageUploader"
import {
  ReadyToWearFormValues,
  ReadyToWearProduct,
  ReadyToWearValidationErrors,
} from "@/features/ready-to-wear/types"
import {
  buildCreateProductFormData,
  buildEditProductFormData,
  buildFormValuesFromProduct,
  createEmptyVariant,
  validateReadyToWearForm,
} from "@/features/ready-to-wear/utils"

interface ProductFormComponentProps {
  mode: "create" | "edit"
  product?: ReadyToWearProduct | null
  isSubmitting: boolean
  onBack: () => void
  onSubmitCreate: (payload: FormData) => Promise<void>
  onSubmitEdit: (id: string, payload: FormData) => Promise<void>
}

const emptyFormValues: ReadyToWearFormValues = {
  name: "",
  category: "",
  fabricType: "",
  status: "active",
  description: "",
  costPrice: 0,
  sellingPrice: 0,
  reorderLevel: 0,
  variants: [createEmptyVariant()],
  newImages: [],
}

export default function ProductFormComponent({
  mode,
  product,
  isSubmitting,
  onBack,
  onSubmitCreate,
  onSubmitEdit,
}: ProductFormComponentProps) {
  const [values, setValues] = useState<ReadyToWearFormValues>(emptyFormValues)
  const [errors, setErrors] = useState<ReadyToWearValidationErrors>({ variantFieldErrors: {} })

  const title = mode === "create" ? "Add Product" : "Edit Product"
  const description =
    mode === "create"
      ? "Create a ready-to-wear product with variants and images."
      : "Update product details and variants."

  useEffect(() => {
    if (mode === "edit" && product) {
      setValues(buildFormValuesFromProduct(product))
    } else {
      setValues(emptyFormValues)
    }

    setErrors({ variantFieldErrors: {} })
  }, [mode, product])

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validation = validateReadyToWearForm(values, mode)
    const hasErrors =
      Boolean(validation.name) ||
      Boolean(validation.category) ||
      Boolean(validation.costPrice) ||
      Boolean(validation.sellingPrice) ||
      Boolean(validation.variants) ||
      Boolean(validation.images) ||
      Object.keys(validation.variantFieldErrors).length > 0

    setErrors(validation)
    if (hasErrors) return

    if (mode === "create") {
      await onSubmitCreate(buildCreateProductFormData(values))
    } else if (product?.id) {
      await onSubmitEdit(product.id, buildEditProductFormData({ originalProduct: product, values }))
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Product Name</label>
            <Input
              value={values.name}
              onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g., Floral Gown"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Category</label>
            <Input
              value={values.category}
              onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="e.g., Gown"
              aria-invalid={Boolean(errors.category)}
            />
            {errors.category ? <p className="mt-1 text-xs text-red-500">{errors.category}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Cost Price</label>
            <Input
              type="number"
              min={0}
              value={String(values.costPrice)}
              onChange={(event) => setValues((prev) => ({ ...prev, costPrice: Number(event.target.value) || 0 }))}
              placeholder="e.g., 5000"
              aria-invalid={Boolean(errors.costPrice)}
            />
            {errors.costPrice ? <p className="mt-1 text-xs text-red-500">{errors.costPrice}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Selling Price</label>
            <Input
              type="number"
              min={0}
              value={String(values.sellingPrice)}
              onChange={(event) => setValues((prev) => ({ ...prev, sellingPrice: Number(event.target.value) || 0 }))}
              placeholder="e.g., 10000"
              aria-invalid={Boolean(errors.sellingPrice)}
            />
            {errors.sellingPrice ? <p className="mt-1 text-xs text-red-500">{errors.sellingPrice}</p> : null}
          </div>
        </div>

        <VariantForm
          variants={values.variants}
          errors={errors.variantFieldErrors}
          onAdd={() => setValues((prev) => ({ ...prev, variants: [...prev.variants, createEmptyVariant()] }))}
          onRemove={(clientId) =>
            setValues((prev) => {
              const next = prev.variants.filter((variant) => variant.clientId !== clientId)
              return { ...prev, variants: next.length > 0 ? next : [createEmptyVariant()] }
            })
          }
          onUpdate={(clientId, field, value) =>
            setValues((prev) => ({
              ...prev,
              variants: prev.variants.map((variant) =>
                variant.clientId === clientId
                  ? {
                      ...variant,
                      [field]: field === "quantity" ? Number(value) || 0 : value,
                    }
                  : variant
              ),
            }))
          }
        />
        {errors.variants ? <p className="text-xs text-red-500">{errors.variants}</p> : null}

        <ImageUploader
          files={values.newImages}
          onChange={(files) => setValues((prev) => ({ ...prev, newImages: files }))}
          error={errors.images}
        />

        <div className="flex gap-3 border-t border-gray-200 pt-6">
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit} className="bg-orange-600 hover:bg-orange-700">
            {isSubmitting ? "Saving..." : mode === "create" ? "Add Product" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
