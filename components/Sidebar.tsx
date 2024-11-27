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
import {
  IoIosArrowDown,
  IoIosArrowDroprightCircle,
  IoIosArrowUp,
} from "react-icons/io";
import Image from "next/image";
import { MdDashboard } from "react-icons/md";

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
    links: [
      { name: "List", href: "/payments/list" },
    ],
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
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);

  const handleToggle = (id: number) => {
    setOpenItemId(openItemId === id ? null : id); // Toggle dropdown
    setActiveSubItem(null); // Reset sub-item when toggling
  };

  const handleSubItemClick = (itemId: number, subItem: string) => {
    setActiveSubItem(subItem);
    setOpenItemId(itemId); // Ensure parent remains open
  };

  return (
    <div className="fixed top-0 left-0 h-full w-[250px] bg-[#262d34] text-[#A5A8AB] shadow-lg font-play">
      <div className="mt-10">
        <div className="mx-9">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <div className="w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={300}
                  height={300}
                  className="w-full h-full"
                />
              </div>
              <div>HildaM Couture</div>
            </div>
            <div></div>
          </div>
        </div>

        <div className="mt-10 mb-0 text-sm mx-9">GENERAL</div>

        <div className="relative mt-5">
          <div
            className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-all duration-300`}
          ></div>
          <div
            className={`flex w-full items-center justify-between py-1 px-4 text-left text-base transition-all duration-300 mx-4`}
          >
            <Link href={'/'}>
            <div className="flex items-center space-x-3">
            <MdDashboard />
              <span>Dashboard</span>
            </div>
            </Link>
          </div>
        </div>
        <ul className="space-y-1 p-4">
          {sidebarItems.map((item) => (
            <li key={item.id} className="relative">
              {/* Main Button */}
              <div className="relative">
                <div
                  className={`absolute left-0 top-0 h-full w-[2px] bg-[#ff6c2f] transition-all duration-300 ${
                    openItemId === item.id ||
                    activeSubItem?.startsWith(item.text)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                ></div>
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`flex w-full items-center justify-between py-1 px-4 text-left text-base transition-all duration-300 ${
                    openItemId === item.id ||
                    activeSubItem?.startsWith(item.text)
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
                className={`ml-8 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                  openItemId === item.id ? "max-h-40" : "max-h-0"
                }`}
              >
                {item.links.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.href}
                      onClick={() =>
                        handleSubItemClick(
                          item.id,
                          `${item.text}-${subItem.name}`
                        )
                      }
                      className={`block w-full text-left text-base transition-all duration-300 ${
                        activeSubItem === `${item.text}-${subItem.name}`
                          ? "text-[#ff6c2f]"
                          : "text-gray-600"
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
    </div>
  );
};

export default Sidebar;
