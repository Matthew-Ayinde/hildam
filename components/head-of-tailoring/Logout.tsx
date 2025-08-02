import React, { useState } from "react";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
      // no need to setLoading(false) because next-auth will redirect
    } catch (error) {
      console.error("Logout failed", error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`
        px-4 py-1 flex items-center text-sm space-x-2 rounded
        border border-red-500
        ${loading 
          ? "text-gray-400 cursor-not-allowed bg-red-100" 
          : "text-red-500 hover:bg-red-500 hover:text-white"
        }
      `}
    >
      <span>{loading ? "Logging out..." : "Log Out"}</span>
      <MdLogout className={loading ? "animate-spin" : ""} />
    </button>
  );
};

export default LogoutButton;
