"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import Spinner from "@/components/Spinner";

export default function Table() {
  interface InventoryItem {
    id: number;
    itemData: string;
    itemQuantity: number;
    date: string;
  }

  const [data, setData] = useState<InventoryItem[]>([]);
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
      const response = await fetch("/api/inventory", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      const formattedData = result.data.map((item: any) => ({
        id: item.id,
        itemData: item.item_name,
        itemQuantity: item.item_quantity,
        date: new Date(item.created_at).toLocaleDateString("en-GB", {
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
    return <div className="text-center text-gray-500 py-10">
      <Spinner />
    </div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error} <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-3 rounded-2xl">
      <div className="mx-2 font-bold text-gray-500 text-xl my-3">Inventory List</div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[#f6f8fb] sticky top-0 z-10">
            <tr className="text-[#5d7186]">
              {["ID", "Item", "Item Quantity", "Created On", "Action"].map((header) => (
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
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:cursor-pointer text-[#5d7186]">
                <td className="px-4 py-2 text-sm border-b">{row.id}</td>
                <td className="px-4 py-2 text-sm border-b">{row.itemData}</td>
                <td className="px-4 py-2 text-sm border-b">{row.itemQuantity}</td>
                <td className="px-4 py-2 text-sm border-b">{row.date}</td>
                <td className="px-4 py-2 text-sm border-b">
                  <div className="flex flex-row">
                    <div
                      className="ml-0 me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg hover:cursor-pointer"
                      onClick={() => router.push(`/admin/inventory/${row.id}`)}
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
          of <span className="font-bold">{data.length}</span> Inventory Items
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
