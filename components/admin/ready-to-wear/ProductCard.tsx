"use client"

import Link from "next/link"
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi"
import { IoEyeOutline } from "react-icons/io5"
import { ReadyToWearProduct } from "@/features/ready-to-wear/types"

interface ProductCardProps {
  product: ReadyToWearProduct
  onEdit: (product: ReadyToWearProduct) => void
  onDelete: (product: ReadyToWearProduct) => void
}

const statusStyles: Record<ReadyToWearProduct["stockStatus"], string> = {
  in_stock: "bg-emerald-100 text-emerald-700 border-emerald-200",
  low_stock: "bg-amber-100 text-amber-700 border-amber-200",
  out_of_stock: "bg-red-100 text-red-700 border-red-200",
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const imageSrc = product.images[0] ?? "/logo.png"

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="aspect-[16/10] w-full bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={product.name} className="h-full w-full object-cover" />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="line-clamp-1 text-base font-semibold text-gray-800">{product.name}</p>
            <p className="text-sm text-gray-500">{product.category || "Uncategorized"}</p>
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[product.stockStatus]}`}>
            {product.stockStatus.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <span className="text-xs uppercase tracking-wide text-gray-500">Selling Price</span>
          <span className="text-sm font-semibold text-orange-700">₦{product.sellingPrice.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/admin/fabrics/ready-to-wear/${product.id}`}
            className="flex items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-2 text-xs font-medium text-blue-700"
            aria-label={`View ${product.name}`}
          >
            <IoEyeOutline size={14} /> View
          </Link>
          <Link
            href={`/admin/fabrics/ready-to-wear/${product.id}/edit`}
            className="flex items-center justify-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-2 py-2 text-xs font-medium text-orange-700"
            aria-label={`Edit ${product.name}`}
          >
            <HiOutlinePencil size={14} /> Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-xs font-medium text-red-700"
            aria-label={`Delete ${product.name}`}
          >
            <HiOutlineTrash size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
