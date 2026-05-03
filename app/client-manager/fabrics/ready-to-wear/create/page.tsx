"use client"

import { useRouter } from "next/navigation"
import ProductFormComponent from "@/components/client-manager/ready-to-wear/ProductFormComponent"
import { toast } from "@/hooks/use-toast"
import { useReadyToWearMutations, useReadyToWearProducts } from "@/features/ready-to-wear/hooks"
import { formatReadyToWearApiError } from "@/features/ready-to-wear/utils"

export default function CreateProductPage() {
  const router = useRouter()
  const { isMutating, createProduct } = useReadyToWearMutations()
  const { refetch } = useReadyToWearProducts()

  const onCreate = async (payload: FormData) => {
    try {
      await createProduct(payload)
      toast({
        title: "Product added",
        description: "Ready-to-Wear product created successfully.",
      })
      await refetch()
      router.push("/client-manager/fabrics/ready-to-wear")
    } catch (createError) {
      toast({
        title: "Unable to add product",
        description: formatReadyToWearApiError(createError),
        variant: "destructive",
      })
    }
  }

  const onEdit = async () => {
    // Not used in create page
  }

  return (
    <div className="space-y-6">
      <ProductFormComponent
        mode="create"
        isSubmitting={isMutating}
        onBack={() => router.back()}
        onSubmitCreate={onCreate}
        onSubmitEdit={onEdit}
      />
    </div>
  )
}
