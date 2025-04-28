"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import LogoutButton from "@/components/Logout";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

type Notification = {
  id: string;
  message: string;
  link: string;   
  read: string;
  created_at: string;
};

const Topbar = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [userName, setUserName] = useState("USER");
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
      setDropdownOpen(false);

      const linking_id = link.split("/").pop();
      if (link.includes("tailorjoblist")) {
        router.push("/head-of-tailoring/jobs/" + linking_id);
      }
      // if (link.includes("projectlist")) {
      //   router.push("/admin/joblists/projects/" + linking_id);
      // }
      
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
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

    setDropdownOpen(false);
  };

  return (
    <div className="mt-5">
      <div className="shadow-lg rounded-xl lg:flex justify-between items-center py-3 px-6 text-gray-700 bg-white">
        <div className="text-xl font-bold">
          <div className="uppercase">Welcome, {userName}</div>
          <div className="text-sm mt-1">Role: Head of Tailoring</div>
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
          {dropdownOpen && (
            <div className="absolute top-full right-0 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200 p-2 mt-2">
              <div className="flex justify-between items-center p-4 border-b border-gray-200 font-semibold text-gray-700">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="text-white bg-orange-500 px-3 py-1 rounded hover:bg-orange-700 hover:cursor-pointer text-xs"
                    onClick={() => markAllAsRead()}
                  >
                    Mark All as Read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {error && <div className="p-3 text-center text-red-500">{error}</div>}
                {!error && notifications.filter((notif) => notif.read === "0").length === 0 && (
                  <div className="p-3 text-gray-600 text-center">No unread notifications</div>
                )}
                {!error &&
                  notifications
                    .filter((notif) => notif.read === "0")
                    .map((notification: any) => (
                      <div
                        key={notification.id}
                        className="p-3 text-sm hover:bg-gray-100 cursor-pointer text-orange-600 border-b border-gray-200 flex justify-between items-center rounded-lg transition-all duration-200"
                        onClick={() =>
                          markAsRead(
                            notification.id,
                            notification.message,
                            notification.link
                          )
                        }
                      >
                        <span>{notification.message}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                {notifications.filter((notif) => notif.read === "0").length > 4 && (
                  <div className="flex justify-center p-2">
                    <button
                      onClick={() => router.push("/notifications")}
                      className="text-white px-8 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-all duration-300"
                    >
                      See More
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;