"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { IoArrowBack, IoImagesOutline } from "react-icons/io5"
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi"
import ProductFormModal from "@/components/admin/ready-to-wear/ProductFormModal"
import DeleteProductModal from "@/components/admin/ready-to-wear/DeleteProductModal"
import ProductDetailsSkeleton from "@/components/admin/ready-to-wear/ProductDetailsSkeleton"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useReadyToWearMutations, useReadyToWearProduct } from "@/features/ready-to-wear/hooks"
import { formatReadyToWearApiError } from "@/features/ready-to-wear/utils"
import { useMemo, useState } from "react"

const statusStyles = {
  in_stock: "bg-emerald-100 text-emerald-700 border-emerald-200",
  low_stock: "bg-amber-100 text-amber-700 border-amber-200",
  out_of_stock: "bg-red-100 text-red-700 border-red-200",
}

export default function ReadyToWearDetailPage() {
  const { id } = useParams()
  const productId = id as string

  const { product, isLoading, error, refetch } = useReadyToWearProduct(productId)
  const { isMutating, editProduct, deleteProduct } = useReadyToWearMutations()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const totalStock = useMemo(() => {
    if (!product) return 0
    return product.variants.reduce((sum, variant) => sum + variant.quantity, 0)
  }, [product])

  const onEdit = async (idValue: string, payload: FormData) => {
    try {
      await editProduct(idValue, payload)
      toast({ title: "Product updated", description: "Changes were saved successfully." })
      setIsEditOpen(false)
      await refetch()
    } catch (editError) {
      toast({
        title: "Unable to update",
        description: formatReadyToWearApiError(editError),
        variant: "destructive",
      })
    }
  }

  const onDelete = async () => {
    if (!product?.id) return

    try {
      await deleteProduct(product.id)
      toast({ title: "Product deleted", description: "Product and related records removed." })
      window.location.href = "/admin/fabrics/ready-to-wear"
    } catch (deleteError) {
      toast({
        title: "Unable to delete",
        description: deleteError instanceof Error ? deleteError.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <ProductDetailsSkeleton />
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link href="/admin/fabrics/ready-to-wear" className="inline-flex items-center gap-2 text-sm text-orange-600">
          <IoArrowBack size={16} /> Back to list
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Product not available</p>
          <p className="text-sm">{error || "This product could not be found."}</p>
          <Button variant="outline" className="mt-3" onClick={() => void refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/fabrics/ready-to-wear" className="inline-flex items-center gap-2 text-sm font-medium text-orange-600">
          <IoArrowBack size={16} /> Back to list
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <HiOutlinePencil size={16} /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <HiOutlineTrash size={16} /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Selling Price</p>
              <p className="text-base font-semibold text-orange-700">₦{product.sellingPrice.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Cost Price</p>
              <p className="text-base font-semibold text-gray-800">₦{product.costPrice.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Total Stock</p>
              <p className="text-base font-semibold text-gray-800">{totalStock}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Quantity in Stock</p>
              <p className="text-base font-semibold text-gray-800">{product.quantityInStock ?? totalStock}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Quantity Sold</p>
              <p className="text-base font-semibold text-gray-800">{product.quantitySold ?? 0}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Reorder Level</p>
              <p className="text-base font-semibold text-gray-800">{product.reorderLevel ?? "N/A"}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Fabric Type</p>
              <p className="text-base font-semibold text-gray-800">{product.fabricType || "N/A"}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Stock Status</p>
              <span className={`mt-1 inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[product.stockStatus]}`}>
                {product.stockStatus.replace("_", " ")}
              </span>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs uppercase text-gray-500">Product Status</p>
              <p className="text-base font-semibold text-gray-800 capitalize">{product.status || "N/A"}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Description</p>
            <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
              {product.description || "No description provided."}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">Variants</p>
            {product.variants.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                No variants available for this product.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600">
                    <tr>
                      <th className="px-3 py-2">Color</th>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">In Stock</th>
                      <th className="px-3 py-2">Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant, index) => (
                      <tr key={variant.id ?? `${variant.color}-${variant.size}-${index}`} className="border-t border-gray-100">
                        <td className="px-3 py-2">{variant.color}</td>
                        <td className="px-3 py-2">{variant.size}</td>
                        <td className="px-3 py-2">{variant.quantity}</td>
                        <td className="px-3 py-2">{variant.quantitySold ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2">
            <IoImagesOutline className="text-orange-600" size={18} />
            <p className="text-sm font-semibold text-gray-700">Images</p>
          </div>

          {product.images.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">No images uploaded.</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {product.images.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden rounded-lg border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${product.name} image ${index + 1}`} className="h-28 w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductFormModal
        open={isEditOpen}
        mode="edit"
        product={product}
        isSubmitting={isMutating}
        onClose={() => setIsEditOpen(false)}
        onSubmitCreate={async () => undefined}
        onSubmitEdit={onEdit}
      />

      <DeleteProductModal
        open={isDeleteOpen}
        product={product}
        isDeleting={isMutating}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDelete}
      />
    </div>
  )
}
