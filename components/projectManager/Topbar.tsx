"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import SearchBar from './Searchbar'
import { IoNotifications } from "react-icons/io5";
import { FaMoon } from "react-icons/fa";
import {jwtDecode} from 'jwt-decode';

const Topbar = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve the access token from sessionStorage
    const token = sessionStorage.getItem('access_token');
    
    if (token) {
      // Decode the token and extract the name
      const decodedToken = jwtDecode(token);
      setUserName((decodedToken as { name: string }).name);
    }
  }, []);

  return (
    <div>
        <div className='flex justify-between my-10 items-center sticky text-gray-500'>
            <div className='text-xl font-bold'>
                <div>WELCOME, {userName || 'Project Manager'}</div> {/* Dynamically show the name */}
                <div className="text-sm">Role: Project Manager</div>
            </div>
            <div className='flex flex-row items-center'>
                <div className='w-12 h-12 flex items-center justify-center'>
                    <FaMoon size={20}/>
                </div>
                <div className='w-12 h-12 flex items-center justify-center'>
                    <IoNotifications size={20} />
                </div>
                <div className='w-6 h-6 mx-1'>
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

export default Topbar;
