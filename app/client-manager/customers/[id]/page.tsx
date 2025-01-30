"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Spinner from "../../../../components/Spinner";
import { useRouter, useParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";

export default function ShowCustomer() {
  const router = useRouter();
  const { id } = useParams();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    fullName: string;
    age: number;
    gender: string;
    phone: string;
    date: string;
    email: string;
    address: string;
    bust: number;
    waist: number;
    hip: number;
    shoulderWidth: number;
    neck: number;
    armLength: number;
    backLength: number;
    frontLength: number;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedCustomerId) return;

    try {
      const accessToken = sessionStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `https://hildam.insightpublicis.com/api/deletecustomer/${selectedCustomerId}`,
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

    router.push("/client-manager/customers");
  };

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/customerslist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();

      // Map response to fields used in the Table component
      if (result.data) {
        const mappedCustomer: Customer = {
          fullName: result.data.name,
          age: result.data.age,
          gender: result.data.gender,
          phone: result.data.phone_number || "N/A",
          date: new Date().toLocaleDateString(), // Placeholder date if not provided
          email: result.data.email || "N/A",
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hip: result.data.hip || 0,
          shoulderWidth: result.data.shoulderWidth || 0,
          neck: result.data.neck || 0,
          armLength: result.data.armLength || 0,
          backLength: result.data.backLength || 0,
          frontLength: result.data.frontLength || 0,
        };
        setCustomer(mappedCustomer);
      } else {
        setCustomer(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error}{" "}
        <button onClick={fetchCustomer} className="text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md"
    >
      {popupMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50"
        >
          {popupMessage}
        </motion.div>
      )}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/client-manager/customers"
          className="text-orange-500 hover:text-orange-700 flex flex-row space-x-2 items-center"
        >
          <IoIosArrowBack />
          <div>Back to List</div>
        </Link>
      </div>
      <form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5"
        >
          <motion.div
            key={1}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 * 0.1 }}
          >
            <label className="block text-gray-700 font-bold">Full Name</label>
            <input
              type="text"
              value={customer.fullName}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            key={2}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 2 * 0.1 }}
          >
            <label className="block text-gray-700 font-bold">Age</label>
            <input
              type="text"
              value={customer.age}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            key={3}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 3 * 0.1 }}
          >
            <label className="block text-gray-700 font-bold">Gender</label>
            <input
              type="text"
              value={customer.gender}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            key={4}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 4 * 0.1 }}
          >
            <label className="block text-gray-700 font-bold">Phone</label>
            <input
              type="text"
              value={customer.phone}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            key={5}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 5 * 0.1 }}
          >
            <label className="block text-gray-700 font-bold">Create Date</label>
            <input
              type="text"
              value={customer.date}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            key={6}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 6 * 0.1 }}
          >
            <label className="block text-gray-700 font-bold">Email</label>
            <input
              type="text"
              value={customer.email}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
        </motion.div>
      </form>

      <div className="mt-6 flex justify-end space-x-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mx-2 px-3 bg-red-500 text-white p-2 rounded hover:cursor-pointer"
          onClick={() => {
            if (typeof id === "string") {
              setSelectedCustomerId(id);
            }
            setIsPopupOpen(true);
          }}
        >
          Delete
        </motion.div>
      </div>

      {/* Confirmation Popup */}
      {isPopupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsPopupOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg"
                onClick={handleDelete}
              >
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-bold text-orange-600 border border-orange-600 rounded-lg"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
