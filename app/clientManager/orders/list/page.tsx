"use client";

import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaRegCalendarTimes } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function Table() {
  interface Order {
    manager_name: ReactNode;
    id: any;
    order_id: string;
    created_at: string;
    customer_name: string;
    priority: string;
    order_status: string;
  }

  const [data, setData] = useState<Order[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);
  const rowsPerPage = 10;
  const router = useRouter();

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch("/api/orderslist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.message !== "success") {
          throw new Error("Failed to fetch data");
        }

        setData(result.data);
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id: any) => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await fetch(`/api/deleteorder/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete order");
      }

      // Update state
      setData((prevData) => prevData.filter((order) => order.id !== selectedUserId));
      setIsPopupOpen(false);
      setToastMessage("Order deleted successfully");
      setToastType("success");
    } catch (error) {
      setToastMessage(error.message || "An unexpected error occurred");
      setToastType("error");
    } finally {
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToastMessage(null);
        setToastType(null);
      }, 3000);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString: string) => {
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
    <div className="w-full relative">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div className="flex flex-row gap-5">
        {[ /* Example stats */ ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl flex items-center p-5 mb-5">
            <div className="text-[#81899d]">
              <div className="font-bold text-gray-700">{stat.label}</div>
              <div className="text-2xl text-[#5d7186]">{stat.value}</div>
            </div>
            <div className="p-4 rounded-lg bg-[#fff0ea] text-[#ff6c2f] ml-5">
              <FaRegCalendarTimes size={30} />
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto bg-white py-3 rounded-2xl">
        <div className="mx-2 font-bold text-gray-500 text-xl my-3">Order List</div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
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
            <thead className="bg-[#f6f8fb] sticky top-0 z-10">
              <tr className="text-[#5d7186]">
                {[
                  "Order ID",
                  "Date",
                  "Customer",
                  "Priority",
                  "Order Status",
                  "Project Manager",
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
                  <td className="px-4 py-2 text-sm border-b">
                    {formatDate(row.created_at)}
                  </td>
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
                  <td className="px-4 py-2 text-sm border-b">{row.manager_name || 'Not Assigned'}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    <div className="flex flex-row">
                      <div
                        className="me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg"
                        onClick={() => router.push(`/admin/orders/${row.id}`)}
                      >
                        <IoEyeOutline size={20} />
                      </div>
                      <div
                        className="mx-2 px-3 bg-red-100 text-orange-500 p-2 rounded-lg"
                        onClick={() => {
                          setSelectedUserId(row.id);
                          handleDelete(row.id);
                          setIsPopupOpen(true);
                        }
                        }
                      >
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
              Are you sure you want to delete this user? This action cannot be
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
