"use client"

import { useRouter } from "next/navigation"
import { HiOutlineArrowLeft } from "react-icons/hi"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import SaleFormComponent from "@/components/admin/ready-to-wear-sales/SaleFormComponent"
import { useReadyToWearProducts } from "@/features/ready-to-wear/hooks"
import { useSaleMutations } from "@/features/ready-to-wear-sales/hooks"
import { CreateSalePayload } from "@/features/ready-to-wear-sales/types"

export default function CreateSalePage() {
  const router = useRouter()
  const { products, isLoading: isProductsLoading } = useReadyToWearProducts()
  const { isMutating, createSale } = useSaleMutations()

  const handleSubmit = async (payload: CreateSalePayload) => {
    try {
      await createSale(payload)
      toast({
        title: "Sale recorded successfully",
        description: "The sale has been saved and stock adjustments will be handled by the server.",
      })
      router.push("/admin/fabrics/ready-to-wear-sales")
    } catch (error) {
      toast({
        title: "Unable to record sale",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/fabrics/ready-to-wear-sales"
        className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
      >
        <HiOutlineArrowLeft size={16} />
        Back to Sales
      </Link>

      <SaleFormComponent
        mode="create"
        products={products}
        isLoading={isProductsLoading || isMutating}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/fabrics/ready-to-wear-sales")}
      />
    </div>
  )
}
