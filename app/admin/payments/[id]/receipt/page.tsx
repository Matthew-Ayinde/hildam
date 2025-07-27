'use client'

import { jsPDF } from 'jspdf'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { getSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { fetchPayment } from '@/app/api/apiClient'

interface ReceiptData {
  id: string
  order_id: string
  created_at: string
  updated_at: string
  VAT: string
  discount: string
  going_rate: string
  total_amount_due: string
  cumulative_total_amount: string
  amount_paid: string
  balance_remaining: string
  payment_status: string
  customer_name: string
  customer_email: string
  clothing_name: string
  clothing_description: string
  priority: string
  order_status: string
  // Billing info from API
  name: string
  email: string
  phone_number: string
  address: string
}

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === 'N/A') return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Receipt() {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = useParams()
  const paymentId = id as string

  const fetchReceiptData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchPayment(paymentId)
      if (result) {
        const data: ReceiptData = {
          id: result.id,
          order_id: result.order_id || 'N/A',
          created_at: result.created_at || 'N/A',
          updated_at: result.updated_at || 'N/A',
          VAT: result.VAT || 'N/A',
          discount: result.discount || 'N/A',
          going_rate: result.going_rate || 'N/A',
          total_amount_due: result.total_amount_due || 'N/A',
          cumulative_total_amount: result.cumulative_total_amount || 'N/A',
          amount_paid: result.amount_paid || 'N/A',
          balance_remaining: result.balance_remaining || 'N/A',
          payment_status: result.payment_status || 'N/A',
          customer_name: result.customer_name || 'N/A',
          customer_email: result.customer_email || 'N/A',
          clothing_name: result.clothing_name || 'N/A',
          clothing_description: result.clothing_description || 'N/A',
          priority: result.priority || 'N/A',
          order_status: result.order_status || 'N/A',
          // Billing information
          name: result.name || 'N/A',
          email: result.email || 'N/A',
          phone_number: result.customer_phone_number || 'N/A',
          address: result.address || '16, Oduduwa way, ikeja', // Default address if not provided
        }
        setReceiptData(data)
      } else {
        setReceiptData(null)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReceiptData()
  }, [])

  const handlePrintPDF = async () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
      orientation: 'portrait',
    })

    await doc.html(receiptRef.current!, {
      callback: (doc) => {
        doc.save('receipt.pdf')
      },
      x: 40, // Horizontal margin
      y: 40, // Vertical margin
      width: 515, // Accounts for A4 width minus margins
      windowWidth: 1024, // Adjust to fit content width
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading receipt...
      </div>
    )
  }

  if (error || !receiptData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || 'No receipt data found'}
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div
          ref={receiptRef}
          className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-2xl border border-gray-200 text-sm sm:text-base pb-80"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="text-orange-500 font-bold text-6xl tracking-wider">RECEIPT</div>
            <div className="flex flex-col sm:flex-row sm:justify-between mt-6 items-center">
              <div className="flex flex-col sm:flex-row sm:space-x-12 text-gray-800">
                <div className="font-bold mb-2 sm:mb-0">
                  <p>Name:</p>
                  <p>Email:</p>
                  <p>Phone:</p>
                </div>
                <div>
                  <p>{receiptData.customer_name}</p>
                  <p>{receiptData.customer_email}</p>
                  <p>{receiptData.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-6 sm:mt-0">
                <div className="font-bold text-3xl text-orange-500">Hildam Couture</div>
                <div className="relative w-16 h-16">
                  <Image
                    src="/logo.png"
                    alt="Company Logo"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300 my-6" />

          {/* Billing & Receipt Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-8">
              <div className="text-xl font-bold text-gray-700">Bill to</div>
              <div className="text-gray-800">
                <p>{receiptData.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-800 text-right">
              <div className="space-y-2">
                <p className="font-medium">Invoice No:</p>
                <p className="font-medium">Date:</p>
              </div>
              <div className="space-y-2">
                <p>{receiptData.order_id}</p>
                <p>{formatDate(receiptData.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 mt-14">
            <div className="grid grid-cols-2 items-center bg-orange-500 text-white py-3 px-4 rounded-t-lg">
              <div className="font-semibold">Description</div>
              <div>
                <div className="grid grid-cols-3 text-right font-semibold">
                  <div>VAT(%)</div>
                  <div>Discount(%)</div>
                  <div>Total</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center border border-t-0 border-gray-300 py-3 px-4">
              <div className="text-gray-800">{receiptData.clothing_name}</div>
              <div>
                <div className="grid grid-cols-3 text-right text-gray-800">
                  <div>{receiptData.VAT}</div>
                  <div>{receiptData.discount}</div>
                  <div>₦{receiptData.total_amount_due}</div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300 my-6" />

          {/* Totals */}
          <div className="flex flex-col sm:flex-row justify-between mt-20">
            <div className="w-full sm:w-1/2"></div>
            <div className="w-full sm:w-1/2">
              <div className="grid grid-cols-2 gap-2 text-gray-800 text-right mb-4">
                <div className="space-y-2">
                  <p>VAT(%):</p>
                  <p>Discount(%):</p>
                  <p>Paid:</p>
                </div>
                <div className="space-y-2">
                  <p>{receiptData.VAT}</p>
                  <p>{receiptData.discount}</p>
                  <p>₦{receiptData.total_amount_due}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 text-right bg-orange-500 text-white py-3 px-4 rounded">
                <div className="font-bold">Amount Paid:</div>
                <div className="font-bold">₦{receiptData.balance_remaining}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={handlePrintPDF}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            Print PDF
          </button>
        </div>
      </div>
    </>
  )
}
