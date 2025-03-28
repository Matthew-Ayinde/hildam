"use client";

import Spinner from "@/components/Spinner";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function EditCustomer() {

  const router = useRouter();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    item_name: "",
    item_quantity: "",
    price_purchased: "",
    unit: "",
    color: "",
  });
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

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
      setFormData({
        item_name: result.data.item_name,
        item_quantity: result.data.item_quantity,
        price_purchased: result.data.price_purchased,
        unit: result.data.unit,
        color: result.data.color,
      });
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

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);

    try {
      const session = await getSession();
      const token = session?.user?.token;

      if (!token) {
        throw new Error("Unauthorized");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/inventory/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }

      // Show confirmation message
      setConfirmationMessage("Inventory item updated");
      setTimeout(() => {
        setConfirmationMessage(null);
      }, 3000);

      router.push(`/admin/inventory`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
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
        Error: {error}
        <button onClick={fetchCustomer} className="text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {confirmationMessage && (
        <div className="fixed top-5 rounded-lg left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-2 w-fit z-50">
          {confirmationMessage}
        </div>
      )}
      <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold">Item Name</label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Quantity</label>
            <input
              type="text"
              name="item_quantity"
              value={formData.item_quantity}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Price purchased</label>
            <input
              type="text"
              name="price_purchased"
              value={formData.price_purchased}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Unit</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded"
            >
              Save Changes
            </button>
            <Link
              href={`/admin/inventory/${id}`}
              className="ml-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
