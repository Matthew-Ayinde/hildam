"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineHideSource, MdOutlineRemoveRedEye } from "react-icons/md";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";

const Form = () => {
  const router = useRouter();
  const [passwordError, setPasswordError] = useState(false);

  const [formData, setFormData] = useState<{
    order_id: string;
    going_rate: string;
    VAT: string;
    discount?: string;
  }>({
    order_id: "",
    going_rate: "",
    VAT: "",
    discount: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) {
        throw new Error("Access token not found in session storage.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/addpayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: formData.order_id,
            going_rate: formData.going_rate,
            VAT: formData.VAT,
            discount: formData.discount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment.");
      }

      const result = await response.json();
      setResponseMessage("Payment created successfully!");

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

    router.push("/client-manager/payments");
  };

  {
    console.log(responseMessage);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className=" bg-gray-100 flex justify-center"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        <div className="font-bold text-gray-500 text-3xl my-3">
          Create Payment
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Order ID */}
          <div className="w-full">
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700"
            >
              Order ID
            </label>
            <input
              type="text"
              id="order_id"
              name="order_id"
              value={formData.order_id}
              onChange={handleChange}
              placeholder="Enter Order ID"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>

          {/* Going Rate */}
          <div className="w-full">
            <label
              htmlFor="goingRate"
              className="block text-sm font-medium text-gray-700"
            >
              Going Rate
            </label>
            <input
              type="text"
              id="going_rate"
              name="going_rate"
              value={formData.going_rate}
              onChange={handleChange}
              placeholder="Enter Going Rate"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
            </div>

          {/* VAT */}
          <div className="w-full">
            <label
              htmlFor="vat"
              className="block text-sm font-medium text-gray-700"
            >
              VAT
            </label>
            <input
              type="text"
              id="VAT"
              name="VAT"
              value={formData.VAT}
              onChange={handleChange}
              placeholder="Enter VAT"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
            </div>

          {/* Discount */}
          <div className="w-full">
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700"
            >
              Discount (optional)
            </label>
            <input
              type="text"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter Discount (optional)"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
            />
            </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-right">
          <button
            type="submit"
            className={`px-4 bg-[#ff6c2f] text-white rounded-md py-2 text-sm font-medium ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-orange-600"
            } focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Create Payment"}   
            
          </button>
        </div>

        {/* Response Message */}
        {responseMessage && (
          <div className="mt-4 text-sm bg-green-500 text-white px-3 py-1 w-fit rounded-lg">
            {responseMessage}
          </div>
        )}
      </motion.form>
    </motion.div>
  );
};

export default Form;
