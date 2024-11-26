import Image from 'next/image'
import React from 'react'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import CollapsibleButton from './customerDropdown';

const Sidebar = () => {
  return (
    <div className='bg-gray-900 text-gray-400 h-full py-10 px-5 fixed'>
        <div>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row items-center'>
                    <div className='w-10 h-10'>
                        <Image src='/logo.jpg' alt='Logo' width={300} height={300} className='w-full h-full' />
                    </div>
                    <div>HildaM</div>
                </div>
                <div>
                <IoIosArrowDroprightCircle size={25}/>
                </div>
            </div>

            <div className='mt-16'>
                <div>GENERAL</div>
                <div className='mt-7'>
                    <div className='flex flex-row items-center my-1'>
                        <div>
                        <MdDashboard size={35}/>
                        </div>
                        <div className='ml-5'>Dashboard</div>
                    </div>
                    <div className='flex flex-row items-center my-1'>
                        <div>
                        <IoSettingsSharp size={35}/>
                        </div>
                        <div className='ml-5'>Settings</div>
                    </div>
                    <CollapsibleButton />
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