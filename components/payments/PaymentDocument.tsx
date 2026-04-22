"use client"

import { useEffect, useRef, useState } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

type DocumentVariant = "invoice" | "receipt"

export interface PaymentDocumentData {
  orderId: string
  createdAt: string
  customerName: string
  customerEmail: string
  phoneNumber: string
  address: string
  clothingName: string
  clothingDescription: string
  goingRate: string
  vat: string
  vatAmount?: string
  discount: string
  totalAmountDue: string
  amountPaid: string
  balanceRemaining: string
}

interface PaymentDocumentProps {
  variant: DocumentVariant
  fileName: string
  data: PaymentDocumentData
}

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === "N/A") return "N/A"
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return "N/A"
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const formatCurrency = (value: string) => {
  if (!value || value === "N/A") return "N/A"
  const numericValue = Number(value)
  if (Number.isNaN(numericValue)) return `₦${value}`
  return `₦${numericValue.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`
}

const normalize = (value: string) => (value && value.trim() ? value : "N/A")

export default function PaymentDocument({ variant, fileName, data }: PaymentDocumentProps) {
  const documentRef = useRef<HTMLDivElement>(null)
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const title = variant === "invoice" ? "INVOICE" : "RECEIPT"

  const exportPdf = async () => {
    if (!documentRef.current || isExporting) return

    setIsExporting(true)
    try {
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: documentRef.current.scrollWidth,
      })

      const imageData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "pt", "a4")

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 24
      const printableWidth = pageWidth - margin * 2
      const printableHeight = pageHeight - margin * 2

      const imageWidth = printableWidth
      const imageHeight = (canvas.height * imageWidth) / canvas.width

      let currentHeightLeft = imageHeight
      let yOffset = margin

      pdf.addImage(imageData, "PNG", margin, yOffset, imageWidth, imageHeight, undefined, "FAST")
      currentHeightLeft -= printableHeight

      while (currentHeightLeft > 0) {
        pdf.addPage()
        yOffset = margin - (imageHeight - currentHeightLeft)
        pdf.addImage(imageData, "PNG", margin, yOffset, imageWidth, imageHeight, undefined, "FAST")
        currentHeightLeft -= printableHeight
      }

      pdf.save(fileName)
      setSuccessMessage(`${title} downloaded successfully.`)
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
      successTimeoutRef.current = setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="print-page min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
      <div className="mx-auto w-full">
        <div
          ref={documentRef}
          className="print-document bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 text-sm text-gray-800"
        >
          <header className="print-avoid-break flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-gray-200 pb-5">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-wide text-yellow-400">{title}</h1>
              <div className="space-y-1 text-sm leading-relaxed">
                <p><span className="font-semibold">Customer:</span> {normalize(data.customerName)}</p>
                <p><span className="font-semibold">Email:</span> {normalize(data.customerEmail)}</p>
                <p><span className="font-semibold">Phone:</span> {normalize(data.phoneNumber)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 rounded-full border border-gray-200 overflow-hidden bg-white flex items-center justify-center">
                <img src="/logo.png" alt="Hildam Couture" className="h-full w-full object-contain" />
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">Hildam Couture</p>
                <p className="text-xs text-gray-500">Document #{normalize(data.orderId)}</p>
              </div>
            </div>
          </header>

          <section className="print-avoid-break grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Bill To</p>
              <p className="mt-2 break-words leading-relaxed">{normalize(data.address)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Document Info</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="flex justify-between gap-2"><span className="font-medium">Number</span><span className="text-right">#{normalize(data.orderId)}</span></p>
                <p className="flex justify-between gap-2"><span className="font-medium">Date</span><span className="text-right">{formatDate(data.createdAt)}</span></p>
                <p className="flex justify-between gap-2"><span className="font-medium">Type</span><span className="text-right">{title}</span></p>
              </div>
            </div>
          </section>

          <section className="pt-5">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="bg-yellow-400 text-white text-xs sm:text-sm">
                    <th className="w-[42%] text-left p-3 font-semibold">Description</th>
                    <th className="w-[19%] text-right p-3 font-semibold">VAT/Discount</th>
                    <th className="w-[20%] text-right p-3 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="align-top border-t border-gray-200">
                    <td className="p-3 break-words">
                      <p className="font-semibold">{normalize(data.clothingName)}</p>
                      <p className="text-xs text-gray-500 mt-1 break-words">{normalize(data.clothingDescription)}</p>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {variant === "invoice"
                        ? `VAT ${formatCurrency(data.vatAmount || "N/A")}`
                        : `VAT ${formatCurrency(data.vatAmount || "N/A")} / Disc ${normalize(data.discount)}%`}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap font-semibold">
                      {variant === "invoice" ? formatCurrency(data.totalAmountDue) : formatCurrency(data.amountPaid)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="print-avoid-break pt-6 flex justify-end">
            <div className="w-full sm:w-[380px] space-y-2 rounded-xl border border-gray-200 p-4 bg-gray-50">
              <p className="flex justify-between gap-3"><span className="font-medium">VAT Amount</span><span className="text-right">{formatCurrency(data.vatAmount || "N/A")}</span></p>
              <p className="flex justify-between gap-3"><span className="font-medium">VAT Rate (%)</span><span className="text-right">{normalize(data.vat)}</span></p>
              <p className="flex justify-between gap-3"><span className="font-medium">Discount (%)</span><span className="text-right">{normalize(data.discount)}</span></p>
              <p className="flex justify-between gap-3"><span className="font-medium">Total Due</span><span className="text-right">{formatCurrency(data.totalAmountDue)}</span></p>
              {variant === "receipt" && (
                <>
                  <p className="flex justify-between gap-3"><span className="font-medium">Amount Paid</span><span className="text-right">{formatCurrency(data.amountPaid)}</span></p>
                  <p className="flex justify-between gap-3"><span className="font-medium">Balance Remaining</span><span className="text-right">{formatCurrency(data.balanceRemaining)}</span></p>
                </>
              )}
              <div className="mt-3 rounded-lg bg-yellow-400 text-white p-3 flex justify-between gap-3 font-semibold">
                <span>{variant === "invoice" ? "Balance Due" : "Receipt Total"}</span>
                <span className="text-right">
                  {variant === "invoice" ? formatCurrency(data.totalAmountDue) : formatCurrency(data.amountPaid)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {successMessage ? (
          <div className="no-print mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {successMessage}
          </div>
        ) : null}

        <div className="no-print mt-6 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => window.print()}
            className="bg-white border border-gray-300 hover:border-yellow-300 text-gray-800 font-semibold px-6 py-2.5 rounded-lg shadow-sm transition"
          >
            Print {title}
          </button>
          <button
            onClick={exportPdf}
            disabled={isExporting}
            className="bg-yellow-400 hover:bg-yellow-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition"
          >
            {isExporting ? "Generating PDF..." : `Download ${title}`}
          </button>
        </div>
      </div>
    </div>
  )
}
