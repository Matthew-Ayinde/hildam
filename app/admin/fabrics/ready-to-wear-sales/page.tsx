"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { HiOutlinePlus, HiOutlineTrash, HiOutlineShoppingCart, HiOutlinePencil } from "react-icons/hi"
import { IoSearchOutline } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { useReadyToWearProducts } from "@/features/ready-to-wear/hooks"
import { useSaleMutations, useSales } from "@/features/ready-to-wear-sales/hooks"
import { SalePaymentMethod } from "@/features/ready-to-wear-sales/types"

const paymentMethodOptions: Array<{ value: SalePaymentMethod | ""; label: string }> = [
  { value: "", label: "All payment methods" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
]

export default function ReadyToWearSalesPage() {
  const { sales, isLoading, error, refetch } = useSales()
  const { products } = useReadyToWearProducts()
  const { deleteSale, isMutating } = useSaleMutations()

  const [searchText, setSearchText] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"" | SalePaymentMethod>("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const displaySales = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return sales.filter((sale) => {
      const customerMatches = sale.customer_name.toLowerCase().includes(query)
      const productMatches = sale.product?.product_name.toLowerCase().includes(query) ?? false
      const paymentMatches = !paymentMethod || sale.payment_method === paymentMethod
      const fromMatches = !fromDate || sale.sale_date >= fromDate
      const toMatches = !toDate || sale.sale_date <= toDate
      return (customerMatches || productMatches) && paymentMatches && fromMatches && toMatches
    })
  }, [sales, searchText, paymentMethod, fromDate, toDate])

  const handleDeleteSale = async (saleId: string) => {
    try {
      await deleteSale(saleId)
      toast({
        title: "Sale deleted",
        description: "Stock has been restored and the sale record removed.",
      })
      await refetch()
    } catch (error) {
      toast({
        title: "Unable to delete sale",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApplyFilters = async () => {
    await refetch({
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      payment_method: paymentMethod || undefined,
      customer_name: searchText.trim() || undefined,
    })
  }

  const handleClearFilters = async () => {
    setSearchText("")
    setPaymentMethod("")
    setFromDate("")
    setToDate("")
    await refetch()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 p-4">
              <HiOutlineShoppingCart className="text-orange-600" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ready-to-Wear Sales</h1>
              <p className="text-sm text-gray-600">Record and review retail sales for ready-to-wear inventory.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/admin/fabrics/ready-to-wear-sales/create">
              <Button>
                <HiOutlinePlus size={16} /> Record Sale
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="relative mt-1">
              <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Customer name or product"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "" | SalePaymentMethod)}>
              <SelectTrigger className="mt-1" aria-label="Select payment method">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">From date</label>
            <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To date</label>
            <Input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1" />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="outline" onClick={handleClearFilters} disabled={isLoading || isMutating}>
            Clear
          </Button>
          <Button onClick={handleApplyFilters} disabled={isLoading || isMutating}>
            Apply Filters
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-gray-600">
          Loading sales...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-semibold">Unable to load sales</p>
          <p className="text-sm">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => void refetch()}>
            Refresh
          </Button>
        </div>
      ) : displaySales.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-gray-800">No sales found</p>
          <p className="text-sm text-gray-500">Start by recording a new ready-to-wear sale.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displaySales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.sale_date}</TableCell>
                  <TableCell>{sale.product?.product_name ?? "Unknown product"}</TableCell>
                  <TableCell>{sale.customer_name}</TableCell>
                  <TableCell>{sale.quantity_sold}</TableCell>
                  <TableCell>₦{sale.total_amount}</TableCell>
                  <TableCell>
                    <Badge className="capitalize bg-slate-100 text-slate-700">
                      {sale.payment_method.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/fabrics/ready-to-wear-sales/${sale.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <HiOutlinePencil size={16} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleDeleteSale(sale.id)}
                        disabled={isMutating}
                        className="text-rose-600"
                      >
                        <HiOutlineTrash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
