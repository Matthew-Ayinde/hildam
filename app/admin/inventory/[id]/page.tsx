"use client";

import SkeletonLoader from "@/components/SkeletonLoader";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import React from "react";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import {motion} from "framer-motion";


export default function ShowCustomer() {

  const router = useRouter();
  const { id } = useParams();
  interface Customer {
    item_name: string;
    item_quantity: number;
    created_at: string;
    price_purchased: number;
    unit: string;
    color: string;
    
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession(); // Get session from NextAuth
      const token = session?.user?.token;

      if (!token) {
        throw new Error("Unauthorized");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/inventory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();
      setCustomer(result.data);
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
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl"
  >
    <div className="flex items-center justify-between mb-8">
      <Link
        href="/admin/inventory"
        className="flex items-center text-orange-500 hover:text-orange-700 transition duration-200"
      >
        <IoIosArrowBack size={30} />
        <span className="ml-2 font-semibold">Back to List</span>
      </Link>
    </div>
    <form className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Item Name */}
      <div>
        <label className="block text-gray-800 font-bold mb-2">
          Item Name
        </label>
        <input
          type="text"
          value={customer.item_name}
          readOnly
          className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-2 bg-gray-100"
        />
      </div>
      {/* Quantity */}
      <div>
        <label className="block text-gray-800 font-bold mb-2">
          Quantity
        </label>
        <input
          type="text"
          value={customer.item_quantity}
          readOnly
          className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-2 bg-gray-100"
        />
      </div>
      {/* Price Purchased */}
      <div>
        <label className="block text-gray-800 font-bold mb-2">
          Price Purchased
        </label>
        <input
          type="text"
          value={customer.price_purchased}
          readOnly
          className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-2 bg-gray-100"
        />
      </div>
      {/* Unit */}
      <div>
        <label className="block text-gray-800 font-bold mb-2">
          Unit
        </label>
        <input
          type="text"
          value={customer.unit}
          readOnly
          className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-2 bg-gray-100"
        />
      </div>
      {/* Color */}
      <div>
        <label className="block text-gray-800 font-bold mb-2">
          Color
        </label>
        <input
          type="text"
          value={customer.color}
          readOnly
          className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-2 bg-gray-100"
        />
      </div>
      {/* Created On */}
      <div>
        <label className="block text-gray-800 font-bold mb-2">
          Created On
        </label>
        <input
          type="text"
          value={new Date(customer.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          readOnly
          className="w-full border border-gray-300 text-gray-600 text-sm rounded-lg p-2 bg-gray-100"
        />
      </div>
      {/* Additional fields can be added here */}
    </form>
    <div className="mt-8 flex justify-end">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          href={`/admin/inventory/${id}/edit`}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold transition duration-200 hover:bg-orange-600"
        >
          Edit
        </Link>
      </motion.div>
    </div>
  </motion.div>
  );
}
