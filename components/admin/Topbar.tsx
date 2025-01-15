"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import LogoutButton from "./Logout";
import { useRouter } from "next/navigation";

const notificationsData = [
  { id: 1, text: "New user registration", isRead: false, timestamp: new Date() },
  { id: 2, text: "Server maintenance scheduled", isRead: false, timestamp: new Date() },
  { id: 3, text: "Password change request", isRead: true, timestamp: new Date() },
  { id: 4, text: "New comment on your post", isRead: false, timestamp: new Date() },
  { id: 5, text: "New message from John", isRead: true, timestamp: new Date() },
  { id: 6, text: "Update available for your app", isRead: false, timestamp: new Date() },
  { id: 7, text: "New follower", isRead: false, timestamp: new Date() },
  { id: 8, text: "Event reminder", isRead: true, timestamp: new Date() },
  { id: 9, text: "New like on your photo", isRead: false, timestamp: new Date() },
  { id: 10, text: "System update completed", isRead: true, timestamp: new Date() },
];

const Topbar = () => {
  const [userName, setUserName] = useState("CEO");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
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

  const unreadCount = notificationsData.filter(
    (notification) => !notification.isRead
  ).length;

  const handleSeeMore = () => {
    router.push("/notifications");
  };

  return (
    <div className="sticky top-0 z-50 mt-5">
      <div className="shadow-lg rounded-xl lg:flex justify-between items-center py-3 px-6 text-gray-700">
        <div className="text-xl font-bold">
          <div className="uppercase">Welcome, {userName}</div>
          <div className="text-sm mt-1">Role: Admin</div>
        </div>
        <div
          className="flex items-center gap-4 relative"
          ref={dropdownRef}
        >
          <LogoutButton />
          <div
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <IoNotifications size={24} className="text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="w-8 h-8">
            <Image
              src="/profile.jpeg"
              alt="Profile"
              width={500}
              height={500}
              className="rounded-full border-2 border-white  shadow-md hover:scale-105 transition-transform"
            />
          </div>
          {dropdownOpen && (
            <div className="absolute top-full right-0 w-72 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200 font-semibold text-gray-700">
                Notifications
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notificationsData.slice(0, 4).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-100 ${
                      notification.isRead
                        ? "text-gray-600"
                        : "text-blue-600 font-semibold"
                    } border-b border-gray-200`}
                  >
                    {notification.text}
                  </div>
                ))}
                {notificationsData.length > 4 && (
                  <div className="flex justify-center p-2">
                    <button
                    onClick={handleSeeMore}
                    className="text-white w-fit px-20 rounded-xl bg-blue-500 hover:underline p-2 font-medium"
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
