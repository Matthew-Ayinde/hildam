"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaUsers, FaShoppingCart, FaBoxes, FaUser  } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { usePathname } from "next/navigation";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import LogoutButton from "../LogoutMobile";
import { useRouter } from "next/navigation";
import { AiOutlineCheck } from "react-icons/ai";
import { FiBell } from "react-icons/fi";

type Notification = {
  id: string;
  message: string;
  link: string;
  read: string;
  created_at: string;
};

const sidebarItems = [
  {
    id: 1,
    text: "Customers",
    icon: <FaUsers />,
    prefix: "/admin/customers",
    links: [
      { name: "List", href: "/admin/customers" },
      { name: "Create", href: "/admin/customers/create" },
    ],
  },
  {
    id: 2,
    text: "Orders",
    icon: <FaShoppingCart />,
    prefix: "/admin/orders",
    links: [
      { name: "List", href: "/admin/orders" },
      { name: "Create Order", href: "/admin/orders/create" },
    ],
  },
  {
    id: 3,
    text: "Job Lists",
    icon: <FaBoxes />,
    prefix: "/admin/joblists/",
    links: [
      { name: "Projects", href: "/admin/joblists/projects" },
      { name: "Tailor Jobs", href: "/admin/joblists/tailorjoblists" },
    ],
  },
  {
    id: 6,
    text: "Payments",
    icon: <MdOutlinePayment />,
    prefix: "/admin/payments",
    links: [
      { name: "List", href: "/admin/payments" },
      { name: "Create", href: "/admin/payments/create" },
    ],
  },
  {
    id: 4,
    text: "Inventory",
    icon: <MdOutlineInventory2 />,
    prefix: "/admin/inventory",
    links: [
      { name: "List", href: "/admin/inventory" },
      { name: "Create", href: "/admin/inventory/create" },
      { name: "View Requests", href: "/admin/inventory/requests" }
    ],
  },
  {
    id: 5,
    text: "Users",
    icon: <FaUser  />,
    prefix: "/admin/users",
    links: [
      { name: "List", href: "/admin/users" },
      { name: "Create", href: "/admin/users/create" },
    ],
  },
];

const Sidebar = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const router = useRouter();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Create a ref for the dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isActive = (prefix: string) => pathname.startsWith(prefix);

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const fetchNotifications = async () => {
    try {
      setError(null);
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

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
  }, []);

  const markAsRead = async (id: string, message: string, link: string) => {
    try {
      const token = sessionStorage.getItem("access_token");
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
      if (link.includes("orderslist")) {
        router.push("/admin/orders/" + linking_id);
      }
      if (link.includes("projectlist")) {
        router.push("/admin/joblists/projects/" + linking_id);
      }
      if (link.includes("tailorjoblist")) {
        router.push("/admin/joblists/tailorjoblists/" + linking_id);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
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

      // Immediately clear notifications from the state
      setNotifications([]);
      setUnreadCount(0); // Reset unread count
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }

    setDropdownOpen(false);
  };

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <div className="lg:hidden fixed top-0 w-full bg-[#262d34] text-white flex justify-between items-center px-4 py-3 z-50 shadow-md">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <div className="ml-2 text-white font-bold text-lg">
            HildaM Couture
          </div>
        </div>
        <div className="flex flex-row space-x-1 items-center">
          <div
            className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            ref={dropdownRef}
          >
            <IoNotifications size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
            {dropdownOpen && (
              <div className="absolute top-10 -right-10 w-80 bg-white rounded-2xl shadow-xl z-50 border border-gray-200 p-3 mt-2">
                <div className="max-h-72 overflow-y-auto">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 font-semibold text-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-lg">
                      <FiBell className="text-orange-500 text-xl" />
                      <span>Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all"
                      >
                        <AiOutlineCheck className="text-lg" />
                        Mark All
                      </button>
                    )}
                  </div>

                  {/* No notifications message */}
                  {unreadCount === 0 && (
                    <div className="p-4 text-gray-600 text-center">
                      No unread notifications
                    </div>
                  )}

                  {/* Notification Items - Only unread notifications */}
                  {notifications
                    .filter((notif) => notif.read === "0")
                    .slice(0, 4)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 text-sm flex justify-between items-center hover:bg-gray-100 cursor-pointer text-orange-600 border-b border-gray-200 rounded-lg transition-all duration-200"
                        onClick={() =>
                          markAsRead(
                            notification.id,
                            notification.message,
                            notification.link
                          )
                        }
                      >
                        <span className="max-w-[90%] text-sm">
                          {notification.message}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}

                  {/* See More Button */}
                  {notifications.filter((notif) => notif.read === "0").length > 4 && (
                    <div className="flex justify-center p-3">
                      <Link
                        href="/notifications"
                        className="text-white text-sm font-medium px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-all duration-300"
                      >
                        See More
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-3xl text-white focus:outline-none"
          >
            {isSidebarOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-[#262d34] text-[#A5A8AB] shadow-lg overflow-y-auto z-50 transition-transform duration-300 lg:w-[250px] ${
          isSidebarOpen
            ? "translate-x-0 w-3/4"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mx-9 mt-10">
          <div className="flex items-center">
            <div className="w-10 h-10">
              <Image
                src="/logo.png"
                alt="Logo"
                width={300}
                height={300}
                className="w-full h-full"
              />
            </div>
            <div className="ml-2 text-white font-bold text-lg">
              HildaM Couture
            </div>
          </div>
        </div>

        <div className="mt-10 mb-0 text-sm mx-9 text-gray-400">GENERAL</div>

        <div className="relative mt-5 mx-4">
          <div
            className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-opacity duration-300 ${
              pathname === "/admin" ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <Link
            href="/admin"
            className={`flex items-center space-x-3 px-4 py-2 text-base font-medium transition-all duration-300 ${
              pathname === "/admin" ? "text-[#ff6c2f]" : "text-[#A5A8AB]"
            }`}
            onClick={closeSidebar}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </Link>
        </div>

        <ul className="space-y-1 mt-3 mb-10 px-4">
          {sidebarItems.map((item) => {
            const isMenuOpen = openMenus[item.id] || isActive(item.prefix);

            return (
              <li key={item.id} className="relative">
                <div className="relative">
                  <div
                    className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-opacity duration-300 ${
                      isActive(item.prefix) ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`flex w-full items-center justify-between py-2 px-4 text-left text-base font-medium transition-all duration-300 ${
                      isActive(item.prefix)
                        ? "text-[#ff6c2f]"
                        : "text-[#A5A8AB]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                    {isMenuOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                </div>

                <ul
                  className={`ml-8 mt-2 space-y-2 overflow-hidden transition-all duration-500 ${
                    isMenuOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {item.links.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.href}
                        className={`block px-4 py-2 text-base transition-all duration-300 ${
                          pathname === subItem.href
                            ? "text-[#ff6c2f] bg-transparent"
                            : "text-[#A5A8AB] hover:text-[#ff6c2f]"
                        }`}
                        onClick={closeSidebar}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}

          <div className="relative lg:hidden flex justify-center">
            <LogoutButton />
          </div>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;