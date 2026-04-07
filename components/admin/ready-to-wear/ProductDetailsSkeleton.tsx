import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-gray-100 bg-white p-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
