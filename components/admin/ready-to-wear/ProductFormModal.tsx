"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import ImageUploader from "./ImageUploader"
import VariantForm from "./VariantForm"
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

interface ProductFormModalProps {
  open: boolean
  mode: "create" | "edit"
  product?: ReadyToWearProduct | null
  isSubmitting: boolean
  onClose: () => void
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

export default function ProductFormModal({
  open,
  mode,
  product,
  isSubmitting,
  onClose,
  onSubmitCreate,
  onSubmitEdit,
}: ProductFormModalProps) {
  const [values, setValues] = useState<ReadyToWearFormValues>(emptyFormValues)
  const [errors, setErrors] = useState<ReadyToWearValidationErrors>({ variantFieldErrors: {} })

  const title = mode === "create" ? "Add Product" : "Edit Product"
  const description =
    mode === "create"
      ? "Create a ready-to-wear product with variants and images."
      : "Update product details, variants, and replace images if needed."

  useEffect(() => {
    if (!open) return

    if (mode === "edit" && product) {
      setValues(buildFormValuesFromProduct(product))
    } else {
      setValues(emptyFormValues)
    }

    setErrors({ variantFieldErrors: {} })
  }, [mode, open, product])

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validation = validateReadyToWearForm(values, mode)
    const hasErrors =
      Boolean(validation.name) ||
      Boolean(validation.category) ||
      Boolean(validation.fabricType) ||
      Boolean(validation.status) ||
      Boolean(validation.costPrice) ||
      Boolean(validation.sellingPrice) ||
      Boolean(validation.reorderLevel) ||
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
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? undefined : onClose())}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Product Name</label>
              <Input
                value={values.name}
                onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Category</label>
              <Input
                value={values.category}
                onChange={(event) => setValues((prev) => ({ ...prev, category: event.target.value }))}
                aria-invalid={Boolean(errors.category)}
              />
              {errors.category ? <p className="mt-1 text-xs text-red-500">{errors.category}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Fabric Type</label>
              <Input
                value={values.fabricType}
                onChange={(event) => setValues((prev) => ({ ...prev, fabricType: event.target.value }))}
                aria-invalid={Boolean(errors.fabricType)}
              />
              {errors.fabricType ? <p className="mt-1 text-xs text-red-500">{errors.fabricType}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Status</label>
              <select
                value={values.status}
                onChange={(event) => setValues((prev) => ({ ...prev, status: event.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-invalid={Boolean(errors.status)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status ? <p className="mt-1 text-xs text-red-500">{errors.status}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Cost Price</label>
              <Input
                type="number"
                min={0}
                value={String(values.costPrice)}
                onChange={(event) => setValues((prev) => ({ ...prev, costPrice: Number(event.target.value) || 0 }))}
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
                aria-invalid={Boolean(errors.sellingPrice)}
              />
              {errors.sellingPrice ? <p className="mt-1 text-xs text-red-500">{errors.sellingPrice}</p> : null}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Reorder Level</label>
              <Input
                type="number"
                min={0}
                value={String(values.reorderLevel)}
                onChange={(event) => setValues((prev) => ({ ...prev, reorderLevel: Number(event.target.value) || 0 }))}
                aria-invalid={Boolean(errors.reorderLevel)}
              />
              {errors.reorderLevel ? <p className="mt-1 text-xs text-red-500">{errors.reorderLevel}</p> : null}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              className="min-h-[90px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={values.description}
              onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
            />
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Add Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
