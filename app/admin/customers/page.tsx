"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import Link from "next/link";
import { motion } from "framer-motion"; // Import Framer Motion
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import Spinner from "@/components/Spinner";

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
  interface Customer {
    fullName: string;
    age: number;
    gender: string;
    phone: string;
    id: string;
    date: string;
  }

  const [data, setData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const rowsPerPage = 10;

  const handleDelete = async () => {
    if (!selectedCustomerId) return;

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/deletecustomer/${selectedCustomerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      // Remove the deleted customer from the local state
      setData((prevData) =>
        prevData.filter((customer) => customer.id !== selectedCustomerId)
      );

      // Show success popup
      setPopupMessage("Customer successfully deleted");

      // Hide popup after 5 seconds
      setTimeout(() => setPopupMessage(null), 5000);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting customer:", error.message);
      } else {
        console.error("Error deleting customer:", error);
      }
      setPopupMessage("Error deleting customer");
      setTimeout(() => setPopupMessage(null), 5000);
    } finally {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const session = await getSession(); // Get session from NextAuth
        const accessToken = session?.user?.token; // Access token from session
        if (!accessToken) {
          throw new Error("No token found, please log in.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/customerslist`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`, // Attach JWT token
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const filteredData = result.data.map(
            (item: {
              id: any;
              gender: any;
              name: any;
              age: any;
              phone_number: any;
            }) => ({
              fullName: item.name,
              age: item.age,
              gender: item.gender,
              phone: item.phone_number || "N/A",
              id: item.id,
              date: new Date().toLocaleDateString(),
            })
          );
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

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (newPage: SetStateAction<number>) => {
    if (typeof newPage === "number" && newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="w-full">
      {popupMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {popupMessage}
        </div>
      )}
      <div className="overflow-x-auto bg-white rounded-2xl py-3">
        <div className="mx-2 ml-5 font-bold text-gray-500 text-xl my-3">
          Customers List
        </div>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[#f6f8fb] sticky top-0 z-10">
            <tr className="text-[#5d7186]">
              {[
                "Full Name",
                "Age",
                "Gender",
                "Phone No",
                "Create Date",
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
              // Show Spinner while loading
              <tr>
                <td colSpan={6} className="text-center py-10">  
                  <Spinner />
                </td>
              </tr>
            ) : data.length === 0 ? (
              // Show "No data found" when the API returns an empty array
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-700 font-bold">
                  <div>No customers found</div>
                  <div className="flex justify-center">
                    <Link href="/admin/customers/create" className="bg-[#ff6c2f] text-white py-1 px-2 mt-2 rounded-lg">
                      <div className="">Add new customer</div>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="text-[#5d7186] hover:bg-gray-100"
                >
                  <td className="px-4 py-2 text-sm border-b">{row.fullName}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.age}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.gender}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.phone}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.date}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    <div className="flex flex-row">
                      <Link
                        href={`/admin/customers/${row.id}`}
                        className="ml-0 me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg hover:cursor-pointer hover:bg-red-200"
                      >
                        <IoEyeOutline size={20} />
                      </Link>
                      <div
                        className="mx-2 px-3 bg-red-100 text-orange-500 p-2 rounded-lg hover:cursor-pointer hover:bg-red-200"
                        onClick={() => {
                          setSelectedCustomerId(row.id);
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
          initial={{ opacity: 0 }} // Initial state for popup animation
          animate={{ opacity: 1 }} // Final state for popup animation
          transition={{ duration: 0.3 }} // Animation duration
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
              Are you sure you want to delete this customer? This action cannot
              be undone.
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
