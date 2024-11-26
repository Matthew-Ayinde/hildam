"use client";

import { SetStateAction, useState } from "react";
import { mockData } from "../data/mockData";

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
      <div className="overflow-x-auto max-h-[500px]">
        <table className="min-w-full border-collapse border border-gray-200 whitespace-nowrap">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="">
              {[
                "Order ID",
                "Date",
                "Clothing",
                "Customer Name",
                "Email",
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
              <tr key={index} className="hover:cursor-pointer">
                <td className="px-4 py-2 text-sm border-b">{row.orderId}</td>
                <td className="px-4 py-2 text-sm border-b">{row.date}</td>
                <td className="px-4 py-2 text-sm border-b">{row.clothing}</td>
                <td className="px-4 py-2 text-sm border-b">
                  {row.customerName}
                </td>
                <td className="px-4 py-2 text-sm border-b">{row.email}</td>
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
      <div className="bottom-0 flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div>
          Showing {currentPage * rowsPerPage - rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, data.length)} of {data.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ←
          </button>
          {Array.from(
            { length: Math.min(3, totalPages) },
            (_, i) => currentPage + i - 1
          )
            .filter((page) => page > 0 && page <= totalPages)
            .map((page) => (
              <button
                key={page}
                className={`px-3 py-1 text-sm ${
                  page === currentPage
                    ? "bg-blue-500 text-white rounded"
                    : "text-gray-600"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          <button
            className="px-2 py-1 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
