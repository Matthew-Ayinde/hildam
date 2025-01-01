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
          "/api/orderslist",
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
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePageChange = (newPage: SetStateAction<number>) => {
    const pageNumber = typeof newPage === 'number' ? newPage : currentPage;
    if (pageNumber > 0 && pageNumber <= totalPages) {
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
      <div className="overflow-x-auto bg-white py-3 rounded-2xl">
        <div className="mx-2 font-bold text-gray-500 text-xl my-3 flex flex-row justify-between items-center">
          <div>Recent Orders</div>
          <Link href="/admin/orders/create">
          <div className="w-fit bg-red-100 px-4 py-2 text-base text-orange-500 rounded-lg">
            + Create Order
          </div>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error} {" "}
            <button
              className="text-blue-500 underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-[#f6f8fb] sticky top-0 z-10">
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
                <tr key={index} className="hover:cursor-pointer text-[#5d7186]">
                  <td className="px-4 py-2 text-sm border-b">{row.order_id}</td>
                  <td className="px-4 py-2 text-sm border-b">{formatDate(row.created_at)}</td>
                  <td className="px-4 py-2 text-sm border-b text-[#da6d35]">
                    {row.customer_name}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">{row.priority}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        row.order_status === "Completed"
                          ? "bg-white text-green-800 border border-green-800"
                          : row.order_status === "Processing"
                          ? "text-yellow-600 bg-white border border-yellow-600"
                          : "text-red-600 bg-white border border-red-600"
                      }`}
                    >
                      {row.order_status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    <div className="flex flex-row">
                      <div className="me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg"
                      onClick={() => router.push(`/admin/orders/${row.id}`)}
                      >
                        <IoEyeOutline size={20} />
                      </div>
                      <div className="mx-2 px-3 bg-red-100 text-orange-500 p-2 rounded-lg">
                        <MdOutlineDeleteForever size={20} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      {!loading && !error && (
        <div className="bottom-0 flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-[#A5A8AB]">
          <div>
            Showing {" "}
            <span className="font-bold">
              {currentPage * rowsPerPage - rowsPerPage + 1}
            </span>
            -
            <span className="font-bold">
              {Math.min(currentPage * rowsPerPage, data.length)}
            </span>{" "}
            of <span className="font-bold">{data.length}</span> Orders
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-3 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaArrowLeft />
            </button>
            {Array.from(
              { length: Math.min(3, totalPages) },
              (_, i) => currentPage + i - 1
            )
              .filter((page) => page > 0 && page <= totalPages)
              .map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 text-sm ${
                    page === currentPage
                      ? "bg-[#ff6c2f] text-white rounded"
                      : "text-gray-600"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            <button
              className="p-3 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
