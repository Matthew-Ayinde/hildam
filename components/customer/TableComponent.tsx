"use client";

import { SetStateAction, useState } from "react";
import { mockData } from "../../data/mockDataForDashboard";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

export default function Table() {
  const [data, setData] = useState(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[#f6f8fb] sticky top-0 z-10">
            <tr className="text-[#5d7186]">
              {[
                "Order ID",
                "Date",
                "Clothing",
                "Phone No",
                "Address",
                "Payment Type",
                "Status",
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
                <td className="px-4 py-2 text-sm border-b">{row.orderId}</td>
                <td className="px-4 py-2 text-sm border-b">{row.date}</td>
                <td className="px-4 py-2 text-sm border-b">{row.clothing}</td>
                <td className="px-4 py-2 text-sm border-b">{row.phone}</td>
                <td className="px-4 py-2 text-sm border-b">{row.address}</td>
                <td className="px-4 py-2 text-sm border-b">
                  {row.paymentType}
                </td>
                <td className="px-4 py-2 text-sm border-b">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      row.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : row.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Bar */}
      <div className="bottom-0 flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-[#A5A8AB]">
        <div>
          Showing <span className="font-bold">{currentPage * rowsPerPage - rowsPerPage + 1} </span>-
          <span className="font-bold">{Math.min(currentPage * rowsPerPage, data.length)}</span> of <span className="font-bold">{data.length}</span> Orders
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="p-3 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FaArrowLeft/>
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
