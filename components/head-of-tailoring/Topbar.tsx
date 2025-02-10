"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { IoNotifications } from "react-icons/io5";
import LogoutButton from "@/components/Logout";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const [userName, setUserName] = useState("CEO");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  interface Notification {
    id: string;
    message: string;
    link: string;
    read: string;
    created_at: string;
    action_type: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const fetchNotifications = async () => {
    try {
      setError(null);
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await fetch(
        "https://hildam.insightpublicis.com/api/allnotifications",
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

    // Set up polling to fetch notifications every 10 seconds
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
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      await fetch(
        `https://hildam.insightpublicis.com/api/readnotification/${id}`,
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

      // Close the dropdown after marking as read
      setDropdownOpen(false);

      // Optionally, navigate to the notification's link if required
      // if (link) {
      //   router.push(link);
      // }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }

    //get the id from the end of the link value and save it with linking_id
    const linking_id = link.split("/").pop();
    console.log(linking_id);

    //check if action_type is project_lists, if so redirect to project lists
    if (link.includes("orderslist")) {
      router.push("/admin/orders/" + linking_id);
    }
    if (link.includes("projectlist")) {
      router.push("/admin/joblists/projects/" + linking_id);
    }
    if (link.includes("tailorjoblist")) {
      router.push("/admin/joblists/tailorjoblists/" + linking_id);
    }

    // router.push("/admin/joblists/projects");
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
            <IoNotifications size={24} className="text-gray-700" />
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
            <div className="absolute top-full right-0 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
              <div className="p-4 border-b border-gray-200 font-semibold text-gray-700">
                Notifications
              </div>
              <div className="max-h-72 overflow-y-auto">
                {error && (
                  <div className="p-3 text-red-600 text-center">{error}</div>
                )}
                {!error &&
                  notifications.filter((notif) => notif.read === "0").length ===
                    0 && (
                    <div className="p-3 text-gray-600 text-center">
                      No unread notifications
                    </div>
                  )}
                {!error &&
                  notifications
                    .filter((notif) => notif.read === "0")
                    .map((notification: any) => (
                      <div
                        key={notification.id}
                        className="p-3 text-sm hover:bg-gray-100 cursor-pointer text-orange-600 border-b border-gray-200 flex justify-between items-center"
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
                {notifications.filter((notif) => notif.read === "0").length >
                  4 && (
                  <div className="flex justify-center p-2">
                    <button
                      onClick={() => router.push("/notifications")}
                      className="text-white w-fit px-10 rounded-xl bg-orange-500 hover:bg-orange-600 p-2 font-medium"
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
