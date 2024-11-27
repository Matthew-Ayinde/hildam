import Image from 'next/image'
import React from 'react'
import SearchBar from './Searchbar'
import { IoNotifications } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";

const Topbar = () => {
  return (
    <div>
        <div className='flex justify-between my-10 items-center sticky text-gray-500'>
            <div className='text-xl font-bold'>WELCOME, ADMIN</div>
            <div className='flex flex-row items-center'>
                <div className='w-12 h-12 flex items-center justify-center'>
                <FaMoon size={25}/>
                </div>
                <div className='w-12 h-12 flex items-center justify-center'>
                <IoNotifications size={25} className=''/>
                </div>
                <div className='w-9 h-9 mx-1'>
                    <Image src='/profile.jpeg' alt='Notification' width={500} height={500} className='rounded-full w-full h-full' />
                </div>
                <div className='ml-3 flex items-center'>
                    <SearchBar />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Topbar