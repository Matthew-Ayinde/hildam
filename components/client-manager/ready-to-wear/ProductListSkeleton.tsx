import { Skeleton } from "@/components/ui/skeleton"

export default function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-gray-100 bg-white p-4">
          <Skeleton className="mb-3 h-40 w-full rounded-xl" />
          <Skeleton className="mb-2 h-4 w-2/3" />
          <Skeleton className="mb-4 h-4 w-1/2" />
          <Skeleton className="mb-4 h-10 w-full" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
