"use client"

import { HiOutlineTrash } from "react-icons/hi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReadyToWearVariantInput } from "@/features/ready-to-wear/types"

interface VariantFormProps {
  variants: ReadyToWearVariantInput[]
  errors: Record<string, { color?: string; size?: string; quantity?: string }>
  onUpdate: (clientId: string, field: "color" | "size" | "quantity", value: string) => void
  onAdd: () => void
  onRemove: (clientId: string) => void
}

export default function VariantForm({ variants, errors, onUpdate, onAdd, onRemove }: VariantFormProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Variants</label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd} aria-label="Add variant">
          Add Variant
        </Button>
      </div>

      {variants.map((variant, index) => {
        const fieldError = errors[variant.clientId] || {}

        return (
          <div key={variant.clientId} className="grid grid-cols-1 gap-2 rounded-lg border border-gray-200 p-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <Input
                value={variant.color}
                onChange={(event) => onUpdate(variant.clientId, "color", event.target.value)}
                placeholder="Color"
                aria-label={`Variant ${index + 1} color`}
                aria-invalid={Boolean(fieldError.color)}
              />
              {fieldError.color ? <p className="mt-1 text-xs text-red-500">{fieldError.color}</p> : null}
            </div>

            <div className="md:col-span-4">
              <Input
                value={variant.size}
                onChange={(event) => onUpdate(variant.clientId, "size", event.target.value)}
                placeholder="Size"
                aria-label={`Variant ${index + 1} size`}
                aria-invalid={Boolean(fieldError.size)}
              />
              {fieldError.size ? <p className="mt-1 text-xs text-red-500">{fieldError.size}</p> : null}
            </div>

            <div className="md:col-span-3">
              <Input
                type="number"
                value={String(variant.quantity)}
                onChange={(event) => onUpdate(variant.clientId, "quantity", event.target.value)}
                min={0}
                placeholder="Quantity"
                aria-label={`Variant ${index + 1} quantity`}
                aria-invalid={Boolean(fieldError.quantity)}
              />
              {fieldError.quantity ? <p className="mt-1 text-xs text-red-500">{fieldError.quantity}</p> : null}
            </div>

            <div className="md:col-span-1 md:flex md:justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(variant.clientId)}
                disabled={variants.length === 1}
                aria-label={`Remove variant ${index + 1}`}
              >
                <HiOutlineTrash size={16} className="text-red-500" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
