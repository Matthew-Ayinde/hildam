"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProductFormComponent from "@/components/admin/ready-to-wear/ProductFormComponent"
import { toast } from "@/hooks/use-toast"
import { useReadyToWearMutations, useReadyToWearProducts } from "@/features/ready-to-wear/hooks"
import { ReadyToWearProduct } from "@/features/ready-to-wear/types"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const { id } = params
  const { isMutating, editProduct } = useReadyToWearMutations()
  const { products, isLoading, error, refetch } = useReadyToWearProducts()

  const [product, setProduct] = useState<ReadyToWearProduct | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!isLoading && products.length > 0) {
      const foundProduct = products.find((p) => p.id === id)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setNotFound(true)
      }
    }
  }, [isLoading, products, id])

  const onEdit = async (productId: string, payload: FormData) => {
    try {
      await editProduct(productId, payload)
      toast({
        title: "Product updated",
        description: "Product details have been updated.",
      })
      await refetch()
      router.push("/admin/fabrics/ready-to-wear")
    } catch (editError) {
      toast({
        title: "Unable to update product",
        description: editError instanceof Error ? editError.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const onCreate = async () => {
    // Not used in edit page
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (error || notFound) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Product not found</p>
          <p className="text-sm">The product you're trying to edit doesn't exist or has been deleted.</p>
          <button
            onClick={() => router.push("/admin/fabrics/ready-to-wear")}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-800"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {product && (
        <ProductFormComponent
          mode="edit"
          product={product}
          isSubmitting={isMutating}
          onBack={() => router.back()}
          onSubmitCreate={onCreate}
          onSubmitEdit={onEdit}
        />
      )}
    </div>
  )
}
