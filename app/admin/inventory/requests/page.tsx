"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Spinner from "@/components/Spinner";

// Extend the NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      token?: string;
    };
  }
}

export default function Table() {
  interface Customer {
    id: string;
    itemName: string;
    requestedQty: number;
    headOfTailoring: string;
    status: string;
    orderId: string;
    date: string;
    color: string;
  }

  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  // New state for filtering - default to "pending"
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected" | "all"
  >("pending");

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const accessToken = session?.user?.token;
        if (!accessToken) {
          throw new Error("No token found, please log in.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/allstorerequests`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const filteredData: Customer[] = result.data.map((item: any) => ({
            id: item.id,
            itemName: item.items_name,
            color: item.color,
            requestedQty: Number(item.requested_quantities),
            headOfTailoring: item.requested_by_name,
            status: item.status,
            orderId: item.order_id_for_the_job,
            date: new Date(item.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
          }));
          setData(filteredData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setPopupMessage("Error fetching data");
        setTimeout(() => setPopupMessage(null), 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Modify handleDelete (remains largely the same)
  const handleDelete = async (id: string) => {
    if (!selectedCustomerId) return;

    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/rejectrequestfororderid/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      // Update list by removing the deleted customer
      setData((prevData) =>
        prevData.filter((customer) => customer.id !== selectedCustomerId)
      );

      setPopupMessage("Customer successfully deleted");
      setTimeout(() => setPopupMessage(null), 5000);
    } catch (error) {
      console.error("Error deleting customer:", error);
      setPopupMessage("Error deleting customer");
      setTimeout(() => setPopupMessage(null), 5000);
    } finally {
      setIsPopupOpen(false);
    }
  };

  // New handleApprove takes the row's id as a parameter and updates the row status locally.
  const handleApprove = async (id: string) => {
    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/acceptrequestfororderid/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve request");
      }

      // Update the status of the approved request
      setData((prevData) =>
        prevData.map((customer) =>
          customer.id === id ? { ...customer, status: "approved" } : customer
        )
      );

      setPopupMessage("Request successfully approved");
      setTimeout(() => setPopupMessage(null), 5000);
    } catch (error) {
      console.error("Error approving request:", error);
      setPopupMessage("Error approving request");
      setTimeout(() => setPopupMessage(null), 5000);
    } finally {
      setIsPopupOpen(false);
    }
  };

  // Filter data based on selected status
  const filteredData =
    statusFilter === "all"
      ? data
      : data.filter((item) => item.status === statusFilter);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage: SetStateAction<number>) => {
    if (typeof newPage === "number" && newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full">
      {popupMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {popupMessage}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-2xl py-3">
        <div className="mx-2 ml-5 flex justify-between items-center">
          <div className="font-bold text-gray-500 text-xl my-3">
            Inventory Requests
          </div>
          {/* Filter controls - placed at the top right */}
          <div className="flex justify-end space-x-2 my-4 mx-2">
            {(["pending", "approved", "rejected", "all"] as const).map(
              (filterStatus) => (
                <button
                  key={filterStatus}
                  onClick={() => {
                    setStatusFilter(filterStatus);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className={`px-4 py-2 text-sm rounded ${
                    statusFilter === filterStatus
                      ? "bg-[#ff6c2f] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
        <div className="my-2 text-gray-500 mx-5">Attention required: Review inventory requests awaiting your approval.</div>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[#f6f8fb] sticky top-0 z-10">
            <tr className="text-[#5d7186]">
              {[
                "Order ID",
                "Request ID",
                "Item Name",
                "Requested Qty",
                "Colour",
                "Head of Tailoring",
                "Status",
                "Date",
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
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-10">
                  <Spinner />
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-700 font-bold"
                >
                  <div>No requests found</div>
                  <div className="flex justify-center"></div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="text-[#5d7186] hover:bg-gray-100"
                >
                  <td className="px-4 py-2 text-sm border-b">{row.orderId}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.id}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.itemName}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    {row.requestedQty}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">{row.color}</td>
                  {/* Added color column */}
                  <td className="px-4 py-2 text-sm border-b">
                    {row.headOfTailoring}
                  </td>
                  <td className="px-4 py-2 text-sm border-b">{row.status}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.date}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    <div className="flex flex-row">
                      {/* Approval button uses dynamic row id */}
                      {row.status === "pending" && (
                        <button
                          onClick={() => handleApprove(row.id)}
                          className="ml-0 me-4 px-3 bg-green-100 text-green-600 p-2 rounded-lg hover:cursor-pointer hover:bg-green-200"
                        >
                          <FaCheck size={20} />
                        </button>
                      )}
                      <div
                        className="mx-2 px-3 bg-red-100 text-red-500 p-2 rounded-lg hover:cursor-pointer hover:bg-red-200"
                        onClick={() => {
                          setSelectedCustomerId(row.id);
                          setIsPopupOpen(true);
                        }}
                      >
                        <TiDelete size={20} />
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bottom-0 flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-[#A5A8AB]">
        <div>
          Showing{" "}
          <span className="font-bold">
            {currentPage * rowsPerPage - rowsPerPage + 1}{" "}
          </span>
          -
          <span className="font-bold">
            {Math.min(currentPage * rowsPerPage, filteredData.length)}
          </span>{" "}
          of <span className="font-bold">{filteredData.length}</span> Entries
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

      {/* Confirmation Popup */}
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
            aria-modal="true"
            role="dialog"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this request? This action cannot
              be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg"
                onClick={() => handleDelete(selectedCustomerId)}
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
