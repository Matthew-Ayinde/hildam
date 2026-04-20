"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { HiOutlineCollection, HiOutlinePlus } from "react-icons/hi"
import { IoSearchOutline } from "react-icons/io5"
import ProductCard from "@/components/admin/ready-to-wear/ProductCard"
import DeleteProductModal from "@/components/admin/ready-to-wear/DeleteProductModal"
import ProductListSkeleton from "@/components/admin/ready-to-wear/ProductListSkeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useReadyToWearMutations, useReadyToWearProducts } from "@/features/ready-to-wear/hooks"
import { ReadyToWearProduct } from "@/features/ready-to-wear/types"

export default function ReadyToWearPage() {
  const { products, isLoading, error, refetch } = useReadyToWearProducts()
  const { isMutating, deleteProduct } = useReadyToWearMutations()

  const [searchValue, setSearchValue] = useState("")
  const [deletingProduct, setDeletingProduct] = useState<ReadyToWearProduct | null>(null)

  const filteredProducts = useMemo(() => {
    const search = searchValue.trim().toLowerCase()
    if (!search) return products

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.stockStatus.toLowerCase().includes(search)
      )
    })
  }, [products, searchValue])

  const onDelete = async () => {
    if (!deletingProduct?.id) return

    try {
      await deleteProduct(deletingProduct.id)
      toast({ title: "Product deleted", description: "Product and related resources were removed." })
      setDeletingProduct(null)
      await refetch()
    } catch (deleteError) {
      toast({
        title: "Unable to delete product",
        description: deleteError instanceof Error ? deleteError.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 p-4">
              <HiOutlineCollection className="text-orange-600" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ready-to-Wear Inventory</h1>
              <p className="text-sm text-gray-600">Manage products, variants, stock, and product images.</p>
            </div>
          </div>

          <Link
            href="/admin/fabrics/ready-to-wear/create"
            className="inline-flex bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2 rounded-md font-medium text-sm"
          >
            <HiOutlinePlus size={16} /> Add Product
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="relative">
            <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by product name, category, or stock status"
              className="pl-10"
              aria-label="Search ready-to-wear products"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <ProductListSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Could not load products</p>
          <p className="text-sm">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => void refetch()}>
            Try Again
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-gray-800">No products found</p>
          <p className="text-sm text-gray-500">
            {searchValue ? "No product matches your search." : "Start by adding your first ready-to-wear product."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => {}}
              onDelete={(value) => setDeletingProduct(value)}
            />
          ))}
        </div>
      )}

      <DeleteProductModal
        open={Boolean(deletingProduct)}
        product={deletingProduct}
        isDeleting={isMutating}
        onClose={() => setDeletingProduct(null)}
        onConfirm={onDelete}
      />
    </div>
  )
}
