"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const rowsPerPage = 10;
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const accessToken = sessionStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`/api/deletecustomer/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      // Remove the deleted customer from the local state
      setData((prevData) => prevData.filter((customer) => customer.id !== id));

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
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found in sessionStorage");
      return;
    }

    fetch("/api/customerslist", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
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
          console.error("Invalid data format received");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
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
        <div className="mx-2 font-bold text-gray-500 text-xl my-3">
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
            {paginatedData.map((row, index) => (
              <tr key={index} className="text-[#5d7186]">
                <td className="px-4 py-2 text-sm border-b">{row.fullName}</td>
                <td className="px-4 py-2 text-sm border-b">{row.age}</td>
                <td className="px-4 py-2 text-sm border-b">{row.gender}</td>
                <td className="px-4 py-2 text-sm border-b">{row.phone}</td>
                <td className="px-4 py-2 text-sm border-b">{row.date}</td>

                <td className="px-4 py-2 text-sm border-b">
                  <div className="flex flex-row">
                    <div
                      className="ml-0 me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg hover:cursor-pointer"
                      onClick={() => router.push(`/admin/customers/${row.id}`)}
                    >
                      <IoEyeOutline size={20} />
                    </div>
                    <div
                      className="mx-2 px-3 bg-red-100 text-orange-500 p-2 rounded-lg hover:cursor-pointer"
                      onClick={() => handleDelete(row.id)}
                    >
                      <MdOutlineDeleteForever size={20} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
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
    </div>
  );
}
