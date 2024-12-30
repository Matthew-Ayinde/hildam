"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SearchBar from './Searchbar';
import { IoNotifications } from 'react-icons/io5';
import { FaMoon } from 'react-icons/fa';
import LogoutButton from '../admin/Logout';

const Topbar = () => {
  const [userName, setUserName] = useState('Client Manager');

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        // Decode the token payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        // Update the state with the decoded name
        if (payload?.name) {
          setUserName(payload.name);
        }
      } catch (error) {
        console.error('Error decoding access token:', error);
      }
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between my-10 items-center sticky text-gray-500">
        <div className="text-xl font-bold">
            <div> WELCOME, {userName.toUpperCase()} </div>
            <div className='text-sm'>Role: Client Manager</div>
            </div>
        <div className="flex flex-row items-center">
          <LogoutButton />
          <div className="w-12 h-12 flex items-center justify-center">
            <IoNotifications size={20} />
          </div>
          <div className="w-6 h-6 mx-1">
            <Image
              src="/profile.jpeg"
              alt="Notification"
              width={500}
              height={500}
              className="rounded-full w-full h-full"
            />
          </div>
          <div className="ml-3 flex items-center">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
