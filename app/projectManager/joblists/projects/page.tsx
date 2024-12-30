"use client";

import { SetStateAction, useEffect, useState } from "react";
import { mockData } from "@/data/mockDataForPaymentList";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { IoEyeOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaRegCalendarTimes } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { useRouter } from "next/navigation";


export default function Table() {
  interface ProjectItem {
    manager_name: string;
    items: string;
    status: string;
    id: number;
    order_id: string;
    amount: string;
    assigned_at: string;
    clothing_name: string;
    itemData: string;
    itemQuantity: number;
    date: string;
    customer_name: string;
    order_created_at: string;
    order_status: string;
  }

  const [data, setData] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const router = useRouter();

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch("/api/projectlists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      const formattedData = result.data.map((item: any) => ({
        manager_name: item.manager_name,
        id: item.id,
        order_id: item.order_id,
        itemData: item.item_name,
        clothing_name: item.clothing_name,
        itemQuantity: item.item_quantity,
        customer_name: item.customer_name,
        order_status: item.order_status,
        date: new Date(item.order_created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      }));
      setData(formattedData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Loading...</div>;
  }

  
  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error} <button onClick={fetchData}>Retry</button>
      </div>
    );
  }


  return (
    <div className="w-full bg-white rounded-2xl py-3">

      <div className="my-5 mx-5 font-bold text-gray-500 text-xl">Project Lists</div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[#f6f8fb] sticky top-0 z-10">
            <tr className="text-[#5d7186]">
              {[
                "Order ID",
                "Order By",
                "Item",
                "Date Assigned",
                "Order Status",
                "Head of Tailoring",
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
                <td className="px-4 py-2 text-sm border-b">{row.customer_name}</td>
                <td className="px-4 py-2 text-sm border-b">{row.clothing_name}</td>
                <td className="px-4 py-2 text-sm border-b">{row.date}</td>
                {/* <td className="px-4 py-2 text-sm border-b">
                  <span
                    className={`px-4 py-2 text-xs font-medium rounded whitespace-nowrap ${
                      row.paymentStatus === "Items Recieved"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {row.paymentStatus}
                  </span>
                </td> */}

                {/* <td className="px-4 py-2 text-sm border-b">{row.paymentStatus}</td> */}
                {/* <td className="px-4 py-2 text-sm border-b">
                  {row.paymentType}
                </td> */}
                <td className="px-4 py-2 text-sm border-b">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      row.order_status === "Completed"
                        ? "bg-white text-green-800 border border-green-800"
                        : row.status === "Processing"
                        ? "text-yellow-600 bg-white border border-yellow-600"
                        : "text-red-600 bg-white border border-red-600"
                    }`}
                  >
                    {row.order_status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm border-b">{row.manager_name || "Not Assigned"}</td>
                <td className="px-4 py-2 text-sm border-b">
                  <div className="flex flex-row">
                    <div className="me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg"
                    onClick={() => router.push(`/admin/joblists/projects/${row.id}`)}
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
      </div>
      {/* Pagination Bar */}
      <div className="bottom-0 flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-[#A5A8AB]">
        <div>
          Showing{" "}
          <span className="font-bold">
            {currentPage * rowsPerPage - rowsPerPage + 1}{" "}
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
    </div>
  );
}
