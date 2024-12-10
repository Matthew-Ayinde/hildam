"use client";

import { SetStateAction, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";

export default function Table() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    // Fetch the token from sessionStorage
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      console.error("No access token found in sessionStorage");
      return;
    }

    // Fetch the data from the API
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
          // Take only the first 8 entries
          const filteredData = result.data.slice(0, 8).map((item: { name: any; age: any; role: string; phone_number: any; }) => ({
            fullName: item.name,
            age: item.age,
            gender: item.role,
            phone: item.phone_number || "N/A",
            date: new Date().toLocaleDateString(), // Placeholder date
          }));
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
              <tr key={index} className="hover:cursor-pointer text-[#5d7186]">
                <td className="px-4 py-2 text-sm border-b">{row.fullName}</td>
                <td className="px-4 py-2 text-sm border-b">{row.age}</td>
                <td className="px-4 py-2 text-sm border-b">{row.gender}</td>
                <td className="px-4 py-2 text-sm border-b">{row.phone}</td>
                <td className="px-4 py-2 text-sm border-b">{row.age}</td>

                <td className="px-4 py-2 text-sm border-b">
                  <div className="flex flex-row">
                    <div className="mx-2 px-3 bg-gray-200 p-2 rounded-lg">
                      <IoEyeOutline size={20} />
                    </div>
                    <div className="mx-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg">
                      <CiEdit size={20} />
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
