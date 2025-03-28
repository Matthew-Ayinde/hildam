"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import Spinner from "@/components/Spinner";
import React from "react";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import { motion } from "framer-motion";


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
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleDelete = async () => {
    try {
          const session = await getSession(); // Get session from NextAuth
          const token = session?.user?.token; // Access token from session
          if (!token) {
            throw new Error("Access token not found.");
          }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/inventory/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete inventory item:", response.statusText);
        setToastMessage("Failed to delete inventory item.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      setData((prevData) =>
        prevData.filter((user) => user.id !== selectedUserId)
      );
      setIsPopupOpen(false);
      setToastMessage("Inventory item deleted successfully.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      setToastMessage("An error occurred. Please try again.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

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
      const session = await getSession(); // Get session from NextAuth
      const token = session?.user?.token; // Access token from session
      if (!token) {
        throw new Error("Access token not found.");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/inventory`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    return (
      <div className="text-center text-gray-500 py-10">
        <Spinner />
      </div>
    );
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
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <div className="mx-2 font-bold text-gray-500 text-xl my-3">
        Inventory List
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[#f6f8fb] sticky top-0 z-10">
            <tr className="text-[#5d7186]">
              {["ID", "Item", "Item Quantity", "Created On", "Action"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-4 text-left text-sm font-extrabold text-gray-700 border-b border-gray-200"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
          {paginatedData.map((row) => (
  <motion.tr
    key={row.id}
    className="hover:cursor-pointer text-[#5d7186] transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
    whileHover={{ scale: 1.02 }}
  >
    <td className="px-4 py-2 text-sm border-b">{row.id}</td>
    <td className="px-4 py-2 text-sm border-b">{row.itemData}</td>
    <td className="px-4 py-2 text-sm border-b">{row.itemQuantity}</td>
    <td className="px-4 py-2 text-sm border-b">{row.date}</td>
    <td className="px-4 py-2 text-sm border-b">
      <div className="flex flex-row">
        <motion.div
          className="ml-0 me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg hover:cursor-pointer transition-all duration-300 hover:bg-orange-200"
          onClick={() => router.push(`/admin/inventory/${row.id}`)}
          whileHover={{ scale: 1.1 }}
        >
          <IoEyeOutline size={20} />
        </motion.div>
        <motion.div
          className="mx-2 px-3 bg-red-100 text-orange-500 p-2 rounded-lg transition-all duration-300 hover:bg-red-300"
          onClick={() => {
            setSelectedUserId(row.id);
            setIsPopupOpen(true);
            console.log("Delete button clicked");
          }}
          whileHover={{ scale: 1.1 }}
        >
          <MdOutlineDeleteForever size={20} />
        </motion.div>
      </div>
    </td>
  </motion.tr>
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

      {/* Popup */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-96 p-6 text-center"
            onClick={(e) => e.stopPropagation()}
            aria-modal="true"
            role="dialog"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg"
                onClick={handleDelete}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 text-sm font-bold text-orange-600 border border-orange-600 rounded-lg"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
