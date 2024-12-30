"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaUsers,
  FaShoppingCart,
  FaBoxes,
  FaUser,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { usePathname } from "next/navigation";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import "nprogress/nprogress.css"; // Import default styles for NProgress

const sidebarItems = [
  {
    id: 1,
    text: "Customers",
    icon: <FaUsers />,
    prefix: "/clientmanager/customers/",
    links: [
      { name: "List", href: "/clientmanager/customers/list" },
      { name: "Create", href: "/clientmanager/customers/create" },
    ],
  },
  {
    id: 2,
    text: "Orders",
    icon: <FaShoppingCart />,
    prefix: "/clientmanager/orders/",
    links: [
      { name: "List", href: "/clientmanager/orders/list" },
      { name: "Create Order", href: "/clientmanager/orders/create" },
    ],
  },
  {
    id: 3,
    text: "Job Lists",
    icon: <FaBoxes />,
    prefix: "/clientmanager/joblists/",
    links: [
      { name: "Projects", href: "/clientmanager/joblists/projects" },
      { name: "Tailor Jobs", href: "/clientmanager/joblists/tailorjoblists" },
    ],
  },
  {
    id: 4,
    text: "Inventory",
    icon: <FaBoxes />,
    prefix: "/clientmanager/inventory/",
    links: [
      { name: "List", href: "/clientmanager/inventory/list" },
      { name: "Create", href: "/clientmanager/inventory/create" },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <>
      <style jsx global>{`
        #nprogress .bar {
          background: #ff6c2f;
          height: 4px;
        }
      `}</style>

      <div className="lg:hidden fixed top-0 w-full bg-[#262d34] text-white flex justify-between items-center px-4 py-3 z-50 shadow-md">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <div className="ml-2 text-white font-bold text-lg">HildaM Couture</div>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-3xl text-white focus:outline-none"
        >
          {isSidebarOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
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
            <div className="ml-2 text-white font-bold text-lg">HildaM Couture</div>
          </div>
        </div>

        <div className="mt-10 mb-0 text-sm mx-9 text-gray-400">GENERAL</div>

        <div className="relative mt-5 mx-4">
          <div
            className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-opacity duration-300 ${
              pathname === "/clientmanager" ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <Link
            href="/clientmanager"
            className={`flex items-center space-x-3 px-4 py-2 text-base font-medium transition-all duration-300 ${
              pathname === "/clientmanager" ? "text-[#ff6c2f]" : "text-[#A5A8AB]"
            }`}
            onClick={closeSidebar}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </Link>
        </div>

        <ul className="space-y-1 mt-3 px-4">
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
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
