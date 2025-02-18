"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaRegCalendarTimes } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { GoClock } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch(
          "https://hildam.insightpublicis.com/api/orderslist",
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
          setError(error.message);
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
    <div className="pb-64">
      <div className="text-2xl font-bold text-gray-700 m-3">Dashboard</div>
      
      {/* <div className="flex justify-between items-center mt-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaRegCalendarTimes className="text-xl text-gray-500" />
            <span className="text-gray-500">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <GoClock className="text-xl text-gray-500" />
            <span className="text-gray-500">Last 7 days</span>
          </div>
        </div>
        <Link href="/store-manager/orders" className="text-blue-500">
          View all orders
        </Link>
        </div> */}
    </div>
  )
}
