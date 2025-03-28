"use client";

import React from 'react'
import { signOut } from "next-auth/react";

const page = () => {
  return (
    <div className='flex justify-center items-center w-screen flex-col h-screen'>
      <div className='font-bold text-5xl'>Homepage</div>
       <button
      onClick={() => signOut({ callbackUrl: "/login" })} // Redirects to /login after logout
      className="bg-red-500 text-white mt-5 px-4 py-2 rounded-md"
    >
      Logout 
    </button>
    </div>
  )
}

export default page