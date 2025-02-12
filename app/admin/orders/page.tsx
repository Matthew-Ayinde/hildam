"use client";

import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaRegCalendarTimes } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Table() {
  interface Order {
    manager_name: string;
    id: any;
    order_id: string;
    created_at: string;
    clothing_name: string;
    customer_name: string;
    priority: string;
    order_status: string;
  }

  const [data, setData] = useState<Order[]>([]);
  const [filteredData, setFilteredData] = useState<Order[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const rowsPerPage = 10;
  const router = useRouter();

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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
        setFilteredData(result.data); // Initialize filtered data
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

  const handleFilter = () => {
    let filtered = data;

    if (filterCategory === "Customer" && filterValue) {
      filtered = filtered.filter((order) =>
        order.customer_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    } else if (filterCategory === "Cloth Name" && filterValue) {
      filtered = filtered.filter((order) =>
        order.clothing_name.toLowerCase().includes(filterValue.toLowerCase())
      );
    } else if (filterCategory === "Priority" && filterValue) {
      filtered = filtered.filter((order) => order.priority === filterValue);
    } else if (filterCategory === "Date" && startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        return (
          orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
        );
      });
    }

    setFilteredData(filtered);
    if (filtered.length === 0) {
      setToastMessage("No results found");
      setToastType("error");
    }
  };

  const handleReset = () => {
    setFilterCategory("");
    setFilterValue("");
    setStartDate("");
    setEndDate("");
    setFilteredData(data); // Reset to original data
  };

  const handleDelete = async (id: any) => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await fetch(
        `https://hildam.insightpublicis.com/api/deleteorder/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete order");
      }

      // Update state
      setData((prevData) =>
        prevData.filter((order) => order.id !== selectedUserId)
      );
      setIsPopupOpen(false);
      setToastMessage("Order deleted successfully");
      setToastType("success");
    } catch (error) {
      if (error instanceof Error) {
        setToastMessage(error.message || "An unexpected error occurred");
      } else {
        setToastMessage("An unexpected error occurred");
      }
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

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative"
    >
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
        {[
          { label: "Total Orders", value: filteredData.length },
          // Add more stats as needed
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl flex items-center p-5 mb-5"
          >
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
          <>
            {/* Filter Section */}
            <div className="flex flex-row justify-between items-center px-4 mb-5">
              <div className="mx-2 font-bold text-gray-500 text-2xl my-3 whitespace-nowrap me-10">
                Orders list
              </div>
              <div className="flex items-center text-gray-500 text-sm my-3">
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setFilterValue(""); // Reset filter value when category changes
                    setStartDate(""); // Reset start date
                    setEndDate(""); // Reset end date
                  }}
                  className="border rounded p-2 mr-2"
                >
                  <option value="">Select Category</option>
                  <option value="Customer">Customer</option>
                  <option value="Cloth Name">Cloth Name</option>
                  <option value="Priority">Priority</option>
                  <option value="Date">Date</option>
                </select>

                {filterCategory === "Priority" ? (
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="border rounded p-2 mr-2"
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                ) : filterCategory === "Date" ? (
                  <>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border rounded p-2 mr-2"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border rounded p-2 mr-2"
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Type to filter..."
                    className="border rounded p-2 mr-2"
                  />
                )}

                <button
                  onClick={handleFilter}
                  className="bg-orange-500 text-white rounded p-2 mr-2"
                >
                  Submit
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-500 text-white rounded p-2"
                >
                  Reset
                </button>
              </div>
            </div>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-[#f6f8fb]">
                <tr className="text-[#5d7186]">
                  {[
                    "Order ID",
                    "Date",
                    "Customer",
                    "Cloth Name",
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
                  <motion.tr
                    key={index}
                    className="hover:cursor-pointer text-[#5d7186] hover:bg-gray-100 transition duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }} // Sequential animation
                  >
                    <td className="px-4 py-2 text-sm border-b">
                      {row.order_id}
                    </td>
                    <td className="px-4 py-2 text-sm border-b">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-2 text-sm border-b text-[#da6d35]">
                      {row.customer_name}
                    </td>
                    <td className="px-4 py-2 text-sm border-b">
                      {row.clothing_name}
                    </td>
                    <td
                      className={`px-4 py-2 text-sm border-b ${
                        row.priority === "high" ? "text-red-500" : ""
                      }`}
                    >
                      {row.priority || "medium"}
                    </td>
                    <td className="px-4 py-2 text-sm border-b">
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded ${
                          row.order_status === "completed"
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
                      {row.manager_name || "Not Assigned"}
                    </td>
                    <td className="px-4 py-2 text-sm border-b">
                      <div className="flex flex-row">
                        <Link
                          href={`/admin/orders/${row.id}`}
                          className="me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg hover:bg-red-200 transition duration-200"
                        >
                          <IoEyeOutline size={20} />
                        </Link>
                        <div
                          className="mx-2 px-3 bg-red-100 text-orange-500 p-2 rounded-lg hover:bg-red-200 transition duration-200"
                          onClick={() => {
                            setSelectedUserId(row.id);
                            setIsPopupOpen(true);
                          }}
                        >
                          <MdOutlineDeleteForever size={20} />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </>
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
              {Math.min(currentPage * rowsPerPage, filteredData.length)}
            </span>{" "}
            of <span className="font-bold">{filteredData.length}</span> Orders
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
          <motion.div
            className="bg-white rounded-lg shadow-lg w-96 p-6 text-center"
            onClick={(e) => e.stopPropagation()}
            aria-modal="true"
            role="dialog"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200"
                onClick={handleDelete}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 text-sm font-bold text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-100 transition duration-200"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}