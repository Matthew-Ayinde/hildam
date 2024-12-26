"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SearchBar from './Searchbar';
import { IoNotifications } from 'react-icons/io5';
import { FaMoon } from 'react-icons/fa';
import LogoutButton from './Logout';

const Topbar = () => {
  const [userName, setUserName] = useState('CEO');

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      try {
        // Decode the token payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        // Extract the name from the payload and update the state
        if (payload?.name) {
          setUserName(payload.name);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <div>
      <div className="lg:flex justify-between my-10 items-center sticky text-gray-500 hidden">
        <div className="text-xl font-bold">
          <div>WELCOME, {userName.toUpperCase()}</div>
          <div className="text-sm mt-1">Role: Admin</div>
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
