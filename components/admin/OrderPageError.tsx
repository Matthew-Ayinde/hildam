import React from 'react'
import Image from 'next/image'


const OrderPageError = () => {
  return (
    <div className='flex flex-col items-center justify-center py-10 text-gray-700'>
        <h1 className='text-4xl font-bold'>Error</h1>
        <p className='mb-10'>Sorry, there was an error loading the order page.</p>
         <Image src="/ordernotfound.png" alt="Error" width={300} height={300} />
        <button className='bg-orange-500 py-1 px-3 rounded-lg shadow-2xl text-lg text-white' onClick={() => window.history.back()}>Go Back</button>

    </div>
  )
}

export default OrderPageError
