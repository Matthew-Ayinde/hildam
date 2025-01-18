"use client";

import { useState } from "react";
import Link from "next/link";
import { FaUsers, FaShoppingCart, FaCreditCard, FaBoxes, FaUser } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";
import "nprogress/nprogress.css";

const sidebarItems = [
  {
    id: 1,
    text: "Customers",
    icon: <FaUsers />,
    links: [
      { name: "List", href: "/customers" },
      { name: "Create", href: "/customers/create" },
    ],
  },
  {
    id: 2,
    text: "Orders",
    icon: <FaShoppingCart />,
    links: [
      { name: "List", href: "/orders" },
      { name: "Create Order", href: "/orders/create" },
    ],
  },
  {
    id: 3,
    text: "Payments",
    icon: <FaCreditCard />,
    links: [{ name: "List", href: "/payments" }],
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
      { name: "List", href: "/users" },
      { name: "Create", href: "/users/create" },
    ],
  },
];

const Sidebar = () => {
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleToggle = (id: number) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (links: { href: string }[]) =>
    links.some((link) => pathname.startsWith(link.href));

  return (
    <>
      <style jsx global>{`
        #nprogress .bar {
          background: #ff6c2f;
          height: 4px;
        }
      `}</style>

      {/* Hamburger Menu */}
      <div className="flex items-center w-full justify-between bg-black text-white p-4 md:hidden">
      <button onClick={toggleSidebar} className="text-2xl">
          {isSidebarOpen ? <HiX /> : <HiMenu />}
        </button>
        <div className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </div>
        <div className="w-10 h-10 overflow-hidden rounded-full">
          <Image src="/profile.jpeg" alt="Profile" width={30} height={30} className="w-full" />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`h-screen fixed top-0 left-0 bg-black text-white transition-transform duration-500 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-1/4`}
        style={{ width: "80vw", maxWidth: "250px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={50} height={50} />
            <span className="ml-2 text-lg font-bold">HildaM Couture</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-2xl md:hidden"
          >
            <HiX />
          </button>
        </div>

        {/* General label */}
        <div className="mt-4 mb-2 px-4 text-sm text-gray-400">GENERAL</div>

        {/* Dashboard link */}
        <div className="relative mx-4">
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

        {/* Sidebar Items */}
        <ul className="mt-3 space-y-2 px-4">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <div className="relative">
                <div
                  className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-opacity duration-300 ${
                    isParentActive(item.links) ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`flex w-full items-center justify-between py-2 text-base font-medium transition-all duration-300 ${
                    isParentActive(item.links)
                      ? "text-[#ff6c2f]"
                      : "text-[#A5A8AB]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                  {openItemId === item.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
              </div>

              {/* Dropdown Links */}
              <ul
                className={`ml-8 mt-2 space-y-2 overflow-hidden transition-all duration-500 ${
                  openItemId === item.id ? "max-h-40" : "max-h-0"
                }`}
              >
                {item.links.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.href}
                      className={`block px-4 py-2 text-sm transition-all duration-300 ${
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
