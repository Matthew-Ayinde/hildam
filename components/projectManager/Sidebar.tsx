"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaShoppingCart,
  FaCreditCard,
  FaBoxes,
  FaUser,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { usePathname } from "next/navigation";
import "nprogress/nprogress.css"; // Import default styles for NProgress

// Sidebar items definition
const sidebarItems = [
  {
    id: 1,
    text: "Customers",
    icon: <FaUsers />,
    links: [
      { name: "List", href: "/customers/list" },
      { name: "Create", href: "/customers/create" },
    ],
  },
  {
    id: 2,
    text: "Orders",
    icon: <FaShoppingCart />,
    links: [
      { name: "List", href: "/orders/list" },
      { name: "Create Order", href: "/orders/create" },
    ],
  },
  {
    id: 3,
    text: "Payments",
    icon: <FaCreditCard />,
    links: [{ name: "List", href: "/payments/list" }],
  },
  {
    id: 4,
    text: "Inventory",
    icon: <FaBoxes />,
    links: [
      { name: "List", href: "/inventory/list" },
      { name: "Create", href: "/inventory/create" },
    ],
  },
  {
    id: 5,
    text: "Users",
    icon: <FaUser />,
    links: [
      { name: "List", href: "/users/list" },
      { name: "Create", href: "/users/create" },
    ],
  },
];

const Sidebar = () => {
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const pathname = usePathname(); // Get the current route

  // Toggle dropdown menus
  const handleToggle = (id: number) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  // Determine if a link or submenu is active
  const isActive = (href: string) => pathname === href;
  const isParentActive = (links: { href: string }[]) =>
    links.some((link) => pathname.startsWith(link.href));

  return (
    <>
      {/* Add NProgress styles */}
      <style jsx global>{`
        #nprogress .bar {
          background: #ff6c2f;
          height: 4px;
        }
      `}</style>

      {/* Sidebar container */}
      <div className="fixed top-0 left-0 h-full w-[250px] bg-[#262d34] text-[#A5A8AB] shadow-lg overflow-y-auto">
        {/* Sidebar header */}
        <div className="mx-9 mt-10">
          <div className="flex flex-row items-center justify-between">
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
        </div>

        {/* General label */}
        <div className="mt-10 mb-0 text-sm mx-9 text-gray-400">GENERAL</div>

        {/* Dashboard link */}
        <div className="relative mt-5 mx-4">
          <div
            className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-opacity duration-300 ${
              pathname === "/" ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <Link
            href="/"
            className={`flex items-center space-x-3 px-4 py-2 text-base font-medium transition-all duration-300 ${
              pathname === "/" ? "text-[#ff6c2f]" : "text-[#A5A8AB]"
            }`}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Sidebar navigation */}
        <ul className="space-y-1 mt-3 px-4">
          {sidebarItems.map((item) => (
            <li key={item.id} className="relative">
              {/* Main Button */}
              <div className="relative">
                <div
                  className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-opacity duration-300 ${
                    isParentActive(item.links) ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`flex w-full items-center justify-between py-2 px-4 text-left text-base font-medium transition-all duration-300 ${
                    isParentActive(item.links)
                      ? "text-[#ff6c2f]"
                      : "text-[#A5A8AB]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                  {openItemId === item.id ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </button>
              </div>

              {/* Dropdown Menu */}
              <ul
                className={`ml-8 mt-2 space-y-2 overflow-hidden transition-all duration-500 ${
                  openItemId === item.id ? "max-h-40" : "max-h-0"
                }`}
              >
                {item.links.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.href}
                      className={`block px-4 py-2 text-base transition-all duration-300 ${
                        isActive(subItem.href)
                          ? "text-[#ff6c2f] bg-transparent"
                          : "text-[#A5A8AB] hover:text-[#ff6c2f]"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
