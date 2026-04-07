"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ReadyToWearDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
      <p className="font-semibold">Unable to load product details</p>
      <p className="text-sm">An unexpected error occurred.</p>
      <Button variant="outline" className="mt-3" onClick={reset}>
        Retry
      </Button>
    </div>
  )
}
