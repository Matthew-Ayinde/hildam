import Image from 'next/image'
import React from 'react'

const Topbar = () => {
  return (
    <div>
        <div className='flex justify-between my-10 items-center sticky'>
            <div>WELCOME! ADMIN</div>
            <div className='flex flex-row'>
                <div className='w-12 h-12 mx-3'>
                    <Image src='/logo.jpg' alt='Notification' width={500} height={500} className='rounded-full w-full h-full' />
                </div>
                <div className='w-12 h-12 mx-3'>
                    <Image src='/logo.jpg' alt='Notification' width={500} height={500} className='rounded-full w-full h-full' />
                </div>
                <div className='w-12 h-12 mx-3'>
                    <Image src='/logo.jpg' alt='Notification' width={500} height={500} className='rounded-full w-full h-full' />
                </div>
                <div className='ml-3 flex items-center'>
                    Lorem, ipsum dolor.
                </div>
            </div>
        </div>
    </div>
  )
}

export default Topbar