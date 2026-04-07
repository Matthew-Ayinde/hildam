"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ReadyToWearProduct } from "@/features/ready-to-wear/types"

interface DeleteProductModalProps {
  open: boolean
  product: ReadyToWearProduct | null
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteProductModal({ open, product, isDeleting, onClose, onConfirm }: DeleteProductModalProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? undefined : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product Permanently?</DialogTitle>
          <DialogDescription>
            This will permanently delete the selected product, all variants, and all uploaded images.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-semibold">{product?.name || "Selected product"}</p>
          <p>This action cannot be undone.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void onConfirm()} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
