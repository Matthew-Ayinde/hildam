"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaRegCalendarTimes } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { motion } from "framer-motion"; // Import Framer Motion
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import TailorJobLists from "@/components/head-of-tailoring/TailorJobLists";
import { FaClipboardList, FaClock, FaCheckCircle } from "react-icons/fa";
   
// Extend the NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string; // Add the token property here
    };
  }
}

export default function Table() {
  interface Order {
    id: any;
    order_id: string;
    created_at: string;
    customer_name: string;
    priority: string;
    order_status: string;
  }

  const [data, setData] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const router = useRouter();
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const session = await getSession(); // Get session from NextAuth
        const token = session?.user?.token; // Access token from session
        if (!token) throw new Error("No access token found");

        const response = await fetch(
          `https://hildam.insightpublicis.com/api/tailorjoblists`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.message !== "success") {
          throw new Error("Failed to fetch data");
        }

        setData(result.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "An unexpected error occurred");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePageChange = (newPage: SetStateAction<number>) => {
    if (typeof newPage === "number" && newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="w-full">
      <div ref={statsRef} className="flex flex-row gap-5 overflow-x-auto">
        {[
          {
            label: "Total Jobs",
            value: data.length,
            icon: <FaClipboardList size={30} className="text-[#ff6c2f]" />,
          },
          {
            label: "Pending Jobs",
            value: data.length,
            icon: <FaClock size={30} className="text-[#ff6c2f]" />,
          },
          {
            label: "Completed Jobs",
            value: data.length,
            icon: <FaCheckCircle size={30} className="text-[#ff6c2f]" />,
          },
          // Add more stats if needed
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl flex items-center p-5 mb-5 min-w-[200px]" // min-w helps for scrollable layout
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="text-[#81899d]">
              <div className="font-bold text-gray-700 whitespace-nowrap">
                {stat.label}
              </div>
              <div className="text-2xl text-[#5d7186]">{stat.value}</div>
            </div>
            <div className="p-4 rounded-lg bg-[#fff0ea] ml-5">{stat.icon}</div>
          </motion.div>
        ))}
      </div>

      <TailorJobLists />
    </div>
  );
}
