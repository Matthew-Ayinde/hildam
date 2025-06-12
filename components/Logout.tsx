import React from "react";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";

const LogoutButton = () => {

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })} // Redirects to /login after logout
      className="px-4 py-1 flex flex-row items-center text-red-500 border border-red-500 text-sm space-x-2  rounded hover:bg-red-500 hover:text-white"
    >
      <div>Log Out</div>
      <MdLogout />
    </button>
  );
};

export default LogoutButton;
