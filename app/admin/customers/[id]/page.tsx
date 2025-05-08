"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineDeleteForever } from "react-icons/md";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import SkeletonLoader from "@/components/SkeletonLoader";
import DataPageError from "@/components/admin/DataNotFound";

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
    email: string;
    address: string;
    bust: number;
    waist: number;
    hip: number;
    shoulder: number;
    bustpoint: number;
    shoulder_to_underbust: number;
    round_under_bust: number;
    sleeve_length: number;
    half_length: number;
    blouse_length: number;
    trousers_length: number;
    trouser_waist: number;
    round_sleeve: number;
    round_thigh: number;
    round_knee: number;
    round_feet: number;
    skirt_length: number;
    round_shoulder: number;
    chest: number;
    dress_length: number;
    create_date: string;
    customer_description: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      router.push("/admin/customers");
    }
  };

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customerslist/${id}`,
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
          phone_number: result.data.phone_number || "N/A",
          email: result.data.email || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hip: result.data.hip || 0,
          shoulder: result.data.shoulder || 0,
          bustpoint: result.data.bustpoint || 0,
          shoulder_to_underbust: result.data.shoulder_to_underbust || 0,
          round_under_bust: result.data.round_under_bust || 0,
          sleeve_length: result.data.sleeve_length || 0,
          half_length: result.data.half_length || 0,
          blouse_length: result.data.blouse_length || 0,
          trousers_length: result.data.trousers_length || 0,
          trouser_waist: result.data.trouser_waist || 0,
          round_sleeve: result.data.round_sleeve || 0,
          round_thigh: result.data.round_thigh || 0,
          round_knee: result.data.round_knee || 0,
          round_feet: result.data.round_feet || 0,
          skirt_length: result.data.skirt_length || 0,
          round_shoulder: result.data.round_shoulder || 0,
          chest: result.data.chest || 0,
          dress_length: result.data.dress_length || 0,
          create_date: result.data.created_at,
          address: result.data.address || "N/A",
          customer_description: result.data.customer_description || "N/A",
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
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <DataPageError />
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  const measurements = [
    { label: "Blouse Length", key: "blouse_length" },
    { label: "Bust", key: "bust" },
    { label: "Bust Point", key: "bustpoint" },
    { label: "Chest", key: "chest" },
    { label: "Dress Length(Long, 3/4, Short)", key: "dress_length" },
    { label: "Half Length", key: "half_length" },
    { label: "Hip", key: "hip" },
    { label: "Round Shoulder", key: "round_shoulder" },
    { label: "Round Sleeve(Arm, Below Elbow, Wrist)", key: "round_sleeve" },
    { label: "Round Under Bust", key: "round_under_bust" },
    { label: "Shoulder", key: "shoulder" },
    { label: "Shoulder to Underbust", key: "shoulder_to_underbust" },
    { label: "Skirt Length(Long, 3/4, Short)", key: "skirt_length" },
    { label: "Sleeve Length(Long, Quarter, Short)", key: "sleeve_length" },
    { label: "Waist", key: "waist" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full mx-auto p-8 bg-white rounded-2xl shadow-lg"
    >
      {/* Popup Message */}
      {popupMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {popupMessage}
        </motion.div>
      )}

      {/* Header & Back Link */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/customers"
          className="flex items-center space-x-2 text-orange-500 hover:text-orange-700 transition duration-200"
        >
          <IoIosArrowBack size={30} />
          <span className="font-semibold">Back to List</span>
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Customer Details
      </h2>

      {/* Customer Details Form */}
      <form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Full Name */}
          <motion.div
            key={1}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label className="block text-gray-700 font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={customer.fullName}
              readOnly
              className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
            />
          </motion.div>
          {/* Age */}
          <motion.div
            key={2}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block text-gray-700 font-bold mb-2">Age</label>
            <input
              type="text"
              value={customer.age}
              readOnly
              className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
            />
          </motion.div>
          {/* Gender */}
          <motion.div
            key={3}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="block text-gray-700 font-bold mb-2">Gender</label>
            <input
              type="text"
              value={customer.gender}
              readOnly
              className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
            />
          </motion.div>
          {/* Phone */}
          <motion.div
            key={4}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label className="block text-gray-700 font-bold mb-2">Phone</label>
            <input
              type="text"
              value={customer.phone_number}
              readOnly
              className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
            />
          </motion.div>
          {/* Create Date */}
          <motion.div
            key={5}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <label className="block text-gray-700 font-bold mb-2">
              Date Created
            </label>
            <input
              type="text"
              value={new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(customer.create_date))}
              readOnly
              className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
            />
          </motion.div>
          {/* Email */}
          <motion.div
            key={6}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="text"
              value={customer.email}
              readOnly
              className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Address */}
         
        <motion.div
          key={7}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <label className="block text-gray-700 font-bold mb-2">Address</label>
          <textarea
            rows={2}
            value={customer.address}
            readOnly
            className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
          />
        </motion.div>
        <motion.div
          key={8}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <label className="block text-gray-700 font-bold mb-2">Customer Description</label>
          <textarea
            rows={2}
            value={customer.customer_description}
            readOnly
            className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-3 bg-gray-50"
          />
        </motion.div>
        </div>

        {/* Measurements Section */}
        <div className="w-full">
          <h3 className="block text-2xl font-bold text-gray-800 my-3">
            Measurements
          </h3>
          <div className="mb-6">
            <div className="flex flex-wrap -mx-2">
              {measurements.map((measurement, index) => (
                <motion.div
                  key={measurement.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
                >
                  <label
                    htmlFor={measurement.key}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {measurement.label}
                  </label>
                  <input
                    type="number"
                    readOnly
                    id={measurement.key}
                    name={measurement.key}
                    value={customer[measurement.key]}
                    placeholder={measurement.label}
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm bg-gray-50 text-gray-600 sm:text-sm p-3 focus:border-orange-500 focus:ring-orange-500 transition duration-200"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <Link href={`/admin/customers/${id}/edit`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold transition duration-200 hover:bg-orange-600"
          >
            Edit Customer Details
          </motion.div>
        </Link>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (typeof id === "string") {
              setSelectedCustomerId(id);
            }
            setIsPopupOpen(true);
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold transition duration-200 hover:bg-red-600 cursor-pointer"
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
            className="bg-white rounded-lg shadow-lg w-96 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
            aria-modal="true"
            role="dialog"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
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
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg transition duration-200 hover:bg-red-700"
              >
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 text-sm font-bold text-orange-600 border border-orange-600 rounded-lg transition duration-200 hover:bg-orange-100"
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
