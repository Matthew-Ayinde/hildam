import Image from 'next/image'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='bg-gray-900 text-gray-400 h-full py-10 px-5 fixed'>
        <div>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row items-center'>
                    <div className='w-10 h-10'>
                        <Image src='/logo.jpg' alt='Logo' width={300} height={300} className='w-full h-full' />
                    </div>
                    <div>HildaM Couture</div>
                </div>
                <div>Logo</div>
            </div>

            <div className='mt-16'>
                <div>GENERAL</div>
                <div className='mt-7'>
                    <div>general</div>
                    <div>general</div>
                    <div>general</div>
                    <div>general</div>
                    <div>general</div>
                    <div>general</div>
                    <div>general</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Sidebar