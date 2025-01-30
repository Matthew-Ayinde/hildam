"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Form = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    gender: string;
    quantity: string;
    phone: string;
    email: string;
    address: string;
    description: string;
    photo: File | null;
    bust: string;
    waist: string;
    hips: string;
    shoulderWidth: string;
    neck: string;
    armLength: string;
    backLength: string;
    frontLength: string;
    highBust: string;
  }>({
    name: "",
    gender: "",
    quantity: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    photo: null,
    bust: "",
    waist: "",
    hips: "",
    shoulderWidth: "",
    neck: "",
    armLength: "",
    backLength: "",
    frontLength: "",
    highBust: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        throw new Error("Access token not found in session storage.");
      }

      const response = await fetch(
        "https://hildam.insightpublicis.com/api/inventory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            item_name: formData.name,
            item_quantity: formData.quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create Inventory.");
      }

      const result = await response.json();
      setResponseMessage("Inventory created successfully!");

      // Automatically clear the response message after 5 seconds
      setTimeout(() => {
        setResponseMessage(null);
      }, 5000);
    } catch (error: any) {
      setResponseMessage(`Error: ${error.message}`);

      // Automatically clear the error message after 5 seconds
      setTimeout(() => {
        setResponseMessage(null);
      }, 5000);
    } finally {
      setLoading(false);
    }

    router.push("/client-manager/inventory");
  };

  return (
    <div className="bg-gray-100 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        {/* Name and Gender */}
        <div className="font-bold text-gray-500 text-xl my-3">
          Add Inventory
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-5 mb-5">
          <div className="">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter item quantity"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className={`w-fit px-4 bg-[#ff6c2f] text-white rounded-md py-2 text-sm font-medium ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-orange-600"
            } focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Create Inventory"}
          </button>
        </div>

        {responseMessage && (
          <div className="fixed top-5 flex z-50 left-1/2 transform-translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg">
            {responseMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;
