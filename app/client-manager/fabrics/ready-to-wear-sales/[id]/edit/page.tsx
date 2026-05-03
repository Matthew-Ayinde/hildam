"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { HiOutlineArrowLeft } from "react-icons/hi"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import SaleFormComponent from "@/components/client-manager/ready-to-wear-sales/SaleFormComponent"
import { useReadyToWearProducts } from "@/features/ready-to-wear/hooks"
import { useSale, useSaleMutations } from "@/features/ready-to-wear-sales/hooks"
import { UpdateSalePayload } from "@/features/ready-to-wear-sales/types"

export default function EditSalePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const saleId = resolvedParams.id

  const { products, isLoading: isProductsLoading } = useReadyToWearProducts()
  const { sale, isLoading: isSaleLoading } = useSale(saleId)
  const { isMutating, editSale, deleteSale } = useSaleMutations()

  const handleSubmit = async (payload: UpdateSalePayload) => {
    try {
      await editSale(saleId, payload)
      toast({
        title: "Sale updated successfully",
        description: "Customer details have been updated.",
      })
      router.push("/client-manager/fabrics/ready-to-wear-sales")
    } catch (error) {
      toast({
        title: "Unable to update sale",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this sale? Stock will be restored.")) {
      return
    }

    try {
      await deleteSale(saleId)
      toast({
        title: "Sale deleted",
        description: "Stock has been restored and the sale record removed.",
      })
      router.push("/client-manager/fabrics/ready-to-wear-sales")
    } catch (error) {
      toast({
        title: "Unable to delete sale",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/client-manager/fabrics/ready-to-wear-sales"
        className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
      >
        <HiOutlineArrowLeft size={16} />
        Back to Sales
      </Link>

      {isSaleLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-gray-600">
          Loading sale details...
        </div>
      ) : !sale ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Sale not found</p>
          <p className="text-sm">The sale record could not be loaded.</p>
        </div>
      ) : (
        <>
          <SaleFormComponent
            mode="edit"
            products={products}
            sale={sale}
            isLoading={isProductsLoading || isMutating}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/client-manager/fabrics/ready-to-wear-sales")}
          />

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">Delete This Sale</h3>
            <p className="mt-2 text-sm text-red-700">
              Deleting this sale will permanently remove the record and restore the deducted stock.
            </p>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isMutating}
              className="mt-4"
            >
              Delete Sale
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
