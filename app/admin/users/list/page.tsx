"use client";

import { useState, useEffect } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function Table() {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  const [data, setData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accessToken = sessionStorage.getItem("access_token");
        if (!accessToken) {
          console.error("No access token found in sessionStorage.");
          return;
        }

        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch data:", response.statusText);
          return;
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      const accessToken = sessionStorage.getItem("access_token");
      if (!accessToken) {
        console.error("No access token found in sessionStorage.");
        return;
      }

      const response = await fetch(`/api/users/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to delete user:", response.statusText);
        setToastMessage("Failed to delete user.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      setData((prevData) => prevData.filter((user) => user.id !== selectedUserId));
      setIsPopupOpen(false);
      setToastMessage("User deleted successfully.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error deleting user:", error);
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

  return (
    <div className="w-full bg-white rounded-2xl py-2">
      <div className="mx-2 font-bold text-gray-500 text-xl my-3">Users</div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-[#f6f8fb] sticky top-0 z-10">
              <tr className="text-[#5d7186]">
                {["Name", "Email", "Roles", "Action"].map((header) => (
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
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:cursor-pointer text-[#5d7186]">
                  <td className="px-4 py-2 text-sm border-b">{row.name}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.email}</td>
                  <td className="px-4 py-2 text-sm border-b">{row.role}</td>
                  <td className="px-4 py-2 text-sm border-b">
                    <div className="flex flex-row">
                      <div
                        className="me-4 px-3 bg-red-100 text-orange-600 p-2 rounded-lg"
                        onClick={() => router.push(`/admin/users/${row.id}`)}
                      >
                        <IoEyeOutline size={20} />
                      </div>
                      <div
                        className="mx-2 px-3 bg-red-100 text-orange-500 p-2 rounded-lg cursor-pointer"
                        onClick={() => {
                          setSelectedUserId(row.id);
                          setIsPopupOpen(true);
                        }}
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
      )}

      {/* Pagination Bar */}
      <div className="bottom-0 flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-[#A5A8AB]">
        <div>
          Showing{" "}
          <span className="font-bold">
            {Math.min(currentPage * rowsPerPage - rowsPerPage + 1, data.length)}
          </span>
          -
          <span className="font-bold">
            {Math.min(currentPage * rowsPerPage, data.length)}
          </span>{" "}
          of <span className="font-bold">{data.length}</span> Users
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
