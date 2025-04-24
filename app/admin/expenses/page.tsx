"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Spinner from "@/components/Spinner";

export default function ExpenseTable() {
  interface Expense {
    id: string;
    total_amount: string;
    utilities: string;
    services: string;
    purchase_costs: string;
    labour: string;
    rent: string;
    balance_remaining: string;
    created_at: string;
    services_description: string;
    utilities_description: string;
    purchase_costs_description: string;
  }

  const [data, setData] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  const rowsPerPage = 10;

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getUTCFullYear();
    return `${day} ${month}, ${year}`;
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) throw new Error("No authentication token found.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/getexpenses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch expenses.");

      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setData(json.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setPopupMessage("Error fetching expenses");
      setTimeout(() => setPopupMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (page: SetStateAction<number>) => {
    if (typeof page === "number" && page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async () => {
    if (!selectedExpenseId) return;
    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) throw new Error("Authentication token not found");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/deleteexpense/${selectedExpenseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete expense");

      setData((prev) => prev.filter((e) => e.id !== selectedExpenseId));
      setPopupMessage("Expense successfully deleted");
      setTimeout(() => setPopupMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setPopupMessage("Error deleting expense");
      setTimeout(() => setPopupMessage(null), 5000);
    } finally {
      setIsPopupOpen(false);
    }
  };

  return (
    <div className="w-full">
      {popupMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {popupMessage}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-2xl py-3">
        <div className="mx-2 ml-5 font-bold text-gray-500 text-xl my-3">
          Expenses Summary
        </div>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[#f6f8fb] sticky top-0 z-10">
            <tr className="text-[#5d7186]">
              {[
                "Description",
                "Total Amount",
                "Utilities",
                "Balance Remaining",
                "Created On",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-4 text-left text-sm font-extrabold text-gray-700 border-b border-gray-200"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-10">
                  <Spinner />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-700 font-bold">
                  No expenses found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="text-[#5d7186] hover:bg-gray-100"
                >
                    <td className="px-4 py-2 text-sm border-b">{row.services_description}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.total_amount}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.utilities}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.balance_remaining}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">
                    <div className="flex space-x-4">
                      <Link
                        href={`/admin/expenses/${row.id}`}
                        className="px-3 bg-red-100 text-orange-600 p-2 rounded-lg hover:bg-red-200"
                      >
                        <IoEyeOutline size={20} />
                      </Link>
                      <div
                        className="px-3 bg-red-100 text-orange-500 p-2 rounded-lg hover:bg-red-200 cursor-pointer"
                        onClick={() => {
                          setSelectedExpenseId(row.id);
                          setIsPopupOpen(true);
                        }}
                      >
                        <MdOutlineDeleteForever size={20} />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-[#A5A8AB]">
        <div>
          Showing{' '}
          <span className="font-bold">{(currentPage - 1) * rowsPerPage + 1}</span>{' '}
          -{' '}
          <span className="font-bold">{Math.min(currentPage * rowsPerPage, data.length)}</span>{' '}
          of <span className="font-bold">{data.length}</span> Entries
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="p-3 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft />
          </button>
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => currentPage + i - 1)
            .filter((p) => p > 0 && p <= totalPages)
            .map((p) => (
              <button
                key={p}
                className={`px-4 py-2 text-sm ${
                  p === currentPage ? 'bg-[#ff6c2f] text-white rounded' : 'text-gray-600'
                }`}
                onClick={() => handlePageChange(p)}
              >
                {p}
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

      {isPopupOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsPopupOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-96 p-6 text-center"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this expense? This action cannot be undone.
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
        </motion.div>
      )}
    </div>
  );
}
