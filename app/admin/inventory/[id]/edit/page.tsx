"use client";

import Spinner from "@/components/Spinner";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import {motion} from "framer-motion";
import { editInventory, fetchInventory } from "@/app/api/apiClient";

export default function EditCustomer() {

  const router = useRouter();
  const { id } = useParams();
  const inventoryId = id as string;
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

      const result = await fetchInventory(inventoryId);
      console.log('eeedd', result);

      setCustomer(result);
      setFormData({
        item_name: result.item_name,
        item_quantity: result.item_quantity,
        price_purchased: result.price_purchased,
        unit: result.unit,
        color: result.color,
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


      const response = await editInventory(inventoryId, formData);

      console.log('response', response);

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg w-fit shadow-lg z-50"
      >
        {confirmationMessage}
      </motion.div>
    )}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-2xl mt-12"
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Item Name */}
        <div>
          <label className="block text-gray-800 font-bold mb-2">
            Item Name
          </label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={handleInputChange}
            placeholder="Enter item name"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
        {/* Quantity */}
        <div>
          <label className="block text-gray-800 font-bold mb-2">
            Quantity
          </label>
          <input
            type="text"
            name="item_quantity"
            value={formData.item_quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
        {/* Price Purchased */}
        <div>
          <label className="block text-gray-800 font-bold mb-2">
            Price Purchased
          </label>
          <input
            type="text"
            name="price_purchased"
            value={formData.price_purchased}
            onChange={handleInputChange}
            placeholder="Enter price"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
        {/* Unit */}
        <div>
          <label className="block text-gray-800 font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            placeholder="Enter unit"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
        {/* Color */}
        <div>
          <label className="block text-gray-800 font-bold mb-2">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Enter color"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
        {/* Form Actions */}
        <div className="col-span-2 flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition duration-200"
          >
            Save Changes
          </motion.button>
          <Link
            href={`/admin/inventory/${id}`}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition duration-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </motion.div>
  </div>
  );
}
