"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
// import { IoNotifications } from "react-icons/io5";
import LogoutButton from "./Logout";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

import { IoNotifications, IoCheckmarkDoneCircleOutline, IoTimeOutline, IoCalendarOutline } from "react-icons/io5";


type Notification = {
  id: string;
  message: string;
  link: string;   
  read: string;
  created_at: string;
};

const Topbar = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [userName, setUserName] = useState("CEO");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
   const fetchNotifications = async () => {
    const session = await getSession(); // Get session from NextAuth
    const token = session?.user?.token; // Access token from session
    if (!token) {
      throw new Error("No token found, please log in.");
    }
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        if (payload?.name) {
          setUserName(payload.name);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }
  
  fetchNotifications();
}, []);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const session = await getSession(); // Get session from NextAuth
      const token = session?.user?.token; // Access token from session
      if (!token) {
        throw new Error("No token found, please log in.");
      }

      const response = await fetch(
        `${baseUrl}/allnotifications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      if (data.status === "success") {
        setNotifications(data.data);
        setUnreadCount(
          data.data.filter((notif: any) => notif.read === "0").length
        );
      } else {
        throw new Error("Cannot fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Cannot fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (id: string, message: string, link: string) => {
    setDropdownOpen(false);

    try {
      const session = await getSession(); // Get session from NextAuth
      const token = session?.user?.token; // Access token from session
      if (!token) {
        throw new Error("No token found, please log in.");
      }
      if (!token) throw new Error("No access token found");

      await fetch(
        `${baseUrl}/readnotification/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, link }),
        }
      );

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: "1" } : notif))
      );
      setUnreadCount((prev) => prev - 1);

      const linking_id = link.split("/").pop();
      if (link.includes("orderslist")) {
        router.push("/admin/orders/" + linking_id);
      }
      if (link.includes("payments")) {
        router.push("/admin/payments/" + linking_id);
      }
      if (link.includes("inventory")) {
        router.push("/admin/inventory/");
      }
      if (link.includes("tailorjoblist")) {
        router.push("/admin/joblists/tailorjoblists/jobs/" + linking_id);
      }
      if (link.includes("storerequest")) {
        router.push("/admin/inventory/requests/");
      }
      if (link.includes("expenses")) {
        router.push("/admin/expenses/" + linking_id);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setDropdownOpen(false);

    try {
      const session = await getSession(); // Get session from NextAuth
      const token = session?.user?.token; // Access token from session
      if (!token) {
        throw new Error("No token found, please log in.");
      }
      if (!token) throw new Error("No access token found");

      await fetch(
        `${baseUrl}/readallnotification`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }

  };

  return (
    <div className="mt-5">
      <div className="shadow-lg rounded-xl lg:flex justify-between items-center py-3 px-6 text-gray-700 bg-white">
        <div className="text-xl font-bold">
          <div className="uppercase">Welcome, {userName}</div>
          <div className="text-sm mt-1">Role: Admin</div>
        </div>
        <div
          className="lg:flex hidden items-center gap-4 relative"
          ref={dropdownRef}
        >
          <LogoutButton />
          <div
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <IoNotifications size={24} className="text-gray-700 rounded-full m-2" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="w-8 h-8">
            <Image
              src="/no-profile.jpg"
              alt="Profile"
              width={500}
              height={500}
              className="rounded-full border-2 border-white shadow-md hover:scale-105 transition-transform"
            />
          </div>
         
<AnimatePresence>
  {dropdownOpen && (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="absolute top-full right-0 w-80 bg-white rounded-2xl shadow-xl z-50 p-1 mt-2 border-2 border-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 border-b-2 border-orange-500 text-orange-600 font-semibold">
        <span className="flex items-center gap-2">
          <IoNotifications size={20} /> Notifications
        </span>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 bg-orange-500 text-white hover:bg-orange-600 transition px-3 py-1 rounded-full text-xs"
          >
            <IoCheckmarkDoneCircleOutline />
            Mark All
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {error && (
          <div className="p-4 text-center text-red-600 bg-orange-100 rounded-lg">
            {error}
          </div>
        )}
        {!error && notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">No new notifications</div>
        )}
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            whileHover={{ backgroundColor: "#FFF3E0" }}
            onClick={() => markAsRead(notif.id, notif.message, notif.link)}
            className={`flex justify-between items-start gap-3 px-5 py-3 cursor-pointer transition 
              ${notif.read === "0" ? "bg-orange-50" : "bg-white"} 
              border-b border-gray-200`}
          >
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{notif.message}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <IoCalendarOutline />
                <span>{new Date(notif.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                <IoTimeOutline />
                <span>{new Date(notif.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            {notif.read === "0" && (
              <span className="self-start text-orange-500">
                <IoNotifications size={18} />
              </span>
            )}
          </motion.div>
        ))}
        {notifications.length > 4 && (
          <div className="flex justify-center p-3">
            <button
              onClick={() => router.push("/notifications")}
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              See More
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Topbar;