'use client'

import { jsPDF } from 'jspdf'
import React, { useRef } from 'react'
import Image from 'next/image'

export default function Invoice() {
  const invoiceRef = useRef<HTMLDivElement>(null)

  const handlePrintPDF = async () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
      orientation: 'portrait',
    })

    await doc.html(invoiceRef.current!, {
      callback: (doc) => {
        doc.save('invoice.pdf')
      },
      x: 40,  // Horizontal margin
      y: 40,  // Vertical margin
      width: 515,  // Accounts for A4 width minus margins
      windowWidth: 1024,  // Adjust to fit content width
    })
  }

  return (
    <>
      {/* Main Invoice */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div
          ref={invoiceRef}
          className="bg-white w-full p-8 rounded-lg shadow-lg text-sm sm:text-base border border-gray-200"
        >
          {/* Header */}
          <div>
            <div className='text-orange-500 font-bold text-6xl'>INVOICE</div>
            <div className="flex justify-between mt-4 items-center">
              <div className='flex space-x-10'>
                <div className='font-bold'>
                  <div>Name: </div>
                  <div>Email: </div>
                  <div>Phone: </div>
                </div>
                <div>
                <div>Rosemary Olaoluwa</div>
                <div>rose@gmail.com</div>
                <div>+234 803 123 4567</div>
                </div>
              </div>
              <div className='flex space-x-2 items-center'>
                <div className='font-bold text-3xl text-orange-500'>Hildam Couture</div>
                  <div>
                  <Image
                    src="/logo.png"
                    alt="Company Logo"
                    className="w-14 h-14"
                    width={100}
                    height={100}    
                                  />   
                    </div>            
              </div>
            </div>
          </div>

          <hr className='my-4'/>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex space-x-16'>
              <div className='text-xl font-bold'>Bill to</div>
              <div>
              <p>19/21 Oduduwa Street</p>
              <p>Ikeja, Lagos,</p>
              <p>103473</p>
              </div>
            </div>
            <div className='grid grid-cols-2 justify-center text-right'>
              <div>
                <div>Invoice No:</div>
                <div>Date:</div>
                <div>Terms:</div>
                <div>Due Date:</div>
              </div>
              <div className=''>
                <div>1</div>
                <div>March 20, 2025</div>
                <div>Net 30</div>
                <div>April 1, 2025</div>
              </div>
            </div>
          </div>

          <div>
            <div className='grid grid-cols-2 font-bold bg-orange-500 my-3 p-3'>
              <div>Description</div>
              <div>
                <div className='grid grid-cols-3 text-right'>
                  <div>Quantity</div>
                  <div>Rate</div>
                  <div>Amount</div>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 my-3 p-3'>
              <div>Double breasted suit</div>
              <div className='grid grid-cols-3 text-right'>
                <div>1</div>
                <div>10</div>
                <div>₦50,000.00</div>
              </div>
              </div>
          </div>

          <hr />


          <div>
            <div className='grid grid-cols-2'>
              <div></div>
              <div>
              <div className='grid grid-cols-2 text-right'>
                <div>
                  <div>Subtotal:</div>
                  <div>VAT (10%):</div>
                  <div>Discount:</div>
                  <div>Total:</div>
                  <div>Paid:</div>
                </div>
                <div>
                  <div>₦50,000.00</div>
                  <div>₦5,000.00</div>
                  <div>₦10.00</div>
                  <div>₦44,973.75</div>
                  <div>₦44,973.75</div>
                </div>
                
              </div>
              <div className='grid grid-cols-2 text-right bg-orange-500 p-3 mt-10'>
                <div className='font-bold'>Balance Due:</div>
                <div className='font-bold'>₦50, 000</div>
              </div>
              </div>
              
            </div>
          </div>


        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handlePrintPDF}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Print PDF
          </button>
        </div>
      </div>
    </>
  )
}
