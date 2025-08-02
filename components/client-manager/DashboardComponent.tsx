"use client";

import { SetStateAction, useEffect, useRef, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaRegCalendarTimes, FaUsers } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { motion } from "framer-motion"; // Import Framer Motion
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import Last7Days from "../charts/Last7Days";
import { FaClipboardList, FaClock, FaCheckCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

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
          `https://hildam.insightpublicis.com/api/orderslist`,
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
            label: "Total Orders",
            value: data.length,
            icon: <FaClipboardList size={30} className="text-[#ff6c2f]" />,
          },
          {
            label: "Total Customers",
            value: data.length,
            icon: <FaUser size={30} className="text-[#ff6c2f]" />,
          },
          {
            label: "Total Users",
            value: data.length,
            icon: <FaUsers size={30} className="text-[#ff6c2f]" />,
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

      <Last7Days />

      <div className="overflow-x-auto bg-white py-3 rounded-2xl">
        <div className="mx-2 font-bold text-gray-500 text-xl my-3 flex flex-row justify-between items-center">
          <div>Recent Orders</div>
          <Link href="/client-manager/orders/create">
            <div className="w-fit bg-red-100 px-4 py-2 text-base text-orange-500 rounded-lg">
              + Create Order
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}{" "}
            <button
              className="text-blue-500 underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-[#f6f8fb]">
              <tr className="text-[#5d7186]">
                {[
                  "Order ID",
                  "Date",
                  "Customer",
                  "Priority",
                  "Order Status",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-4 text-left text-sm font-extrabold text-gray-700 border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  className="hover:cursor-pointer text-[#5d7186]"
                  initial={{ opacity: 0, y: 20 }} // Initial state for animation
                  animate={{ opacity: 1, y: 0 }} // Final state for animation
                  transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation with delay
                >
                  <td className="px-4 py-2 text-sm border-b">{row.order_id}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-4 py-2 text-sm border-b text-[#da6d35]">
                    {row.customer_name}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    {row.priority || "medium"}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        row.order_status === "closed"
                          ? "bg-white text-green-800 border border-green-800"
                          : row.order_status === "processing"
                          ? "text-yellow-600 bg-white border border-yellow-600"
                          : "text-red-600 bg-white border border-red-600"
                      }`}
                    >
                      {row.order_status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    <Link
                      href={`/client-manager/orders/${row.id}`}
                      className="me-4 px-3 bg-red-100 text-orange-600 w-fit p-2 rounded-lg flex flex-row space-x-2"
                    >
                      <IoEyeOutline size={20} />
                      <div>View</div>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      {!loading && !error && (
        <div className="bottom-0 flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-[#A5A8AB]">
          <div>
            Showing{" "}
            <span className="font-bold">
              {currentPage * rowsPerPage - rowsPerPage + 1}
            </span>
            -
            <span className="font-bold">
              {Math.min(currentPage * rowsPerPage, data.length)}
            </span>{" "}
            of <span className="font-bold">{data.length}</span> Orders
          </div>
          <div className="flex items-center space-x-5">
            <div>
              <Link href={'/client-manager/orders'} className="text-sm text-white bg-orange-500 hover:bg-orange-700 py-2 px-3 rounded">
                View All Orders
              </Link>
            </div>
            <div className="flex items-center space-x-2">
            <button
              className="p-3 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaArrowLeft />
            </button>
            <button
              className="p-3 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FaArrowRight />
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}