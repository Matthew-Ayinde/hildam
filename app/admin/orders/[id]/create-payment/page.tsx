"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdOutlineHideSource, MdOutlineRemoveRedEye } from "react-icons/md";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Spinner from "@/components/Spinner"; // adjust the path as needed
import { FaSpinner } from "react-icons/fa";

const Form = () => {
  const router = useRouter();
  const { id } = useParams();

  const [passwordError, setPasswordError] = useState(false);
  const [orderLoading, setOrderLoading] = useState(true);

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

  // Fetch order_id on mount
  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setOrderLoading(true);
        const session = await getSession();
        const token = session?.user?.token;
        if (!token) throw new Error("Access token not found.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/orderslist/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch order.");
        const json = await res.json();
        setFormData((f) => ({
          ...f,
          order_id: json.data.order_id,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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

      const result = await response.json() as {
        status: string;
        data: { id: number };
      };

      if (result.status === 'success') {
        // Redirect to /admin/payments/{id}
        router.push(`/admin/payments/${result.data.id}`);
      } else {
        // handle error‐status case
        console.error('Server error:', result);
      }


      setResponseMessage("Payment created successfully!");
      setTimeout(() => setResponseMessage(null), 5000);
    } catch (error: any) {
      setResponseMessage(`Error: ${error.message}`);
      setTimeout(() => setResponseMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex justify-center p-4"
  >
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-2xl shadow-xl p-8"
      aria-labelledby="create-payment-heading"
    >
      <h2 id="create-payment-heading" className="text-4xl font-extrabold text-gray-700 mb-6">
        Create Payment
      </h2>

      <p className="text-gray-600 mb-8">
        Fill out the form below to generate a new payment record. All fields marked with
        <span className="text-red-500"> *</span> are mandatory.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Order ID with spinner and help text */}
        <div className="relative">
          <label htmlFor="order_id" className="block text-sm font-semibold text-gray-700">
            Order ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="order_id"
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
            placeholder="Auto-generated order reference"
            disabled
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-600 placeholder-gray-400 shadow-sm sm:text-sm"
            aria-describedby="order-id-help"
            required
          />
          {orderLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </motion.div>
          )}
          <p id="order-id-help" className="mt-2 text-xs text-gray-500">
            This value is automatically generated by the system and cannot be changed.
          </p>
        </div>

        {/* Going Rate */}
        <div>
          <label htmlFor="going_rate" className="block text-sm font-semibold text-gray-700">
            Going Rate (₦) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            id="going_rate"
            name="going_rate"
            value={formData.going_rate}
            onChange={handleChange}
            placeholder="Enter the actual payment amount, e.g., 15000.00"
            className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm shadow-sm"
            aria-describedby="going-rate-help"
            required
          />
          <p id="going-rate-help" className="mt-2 text-xs text-gray-500">
            Enter the full amount the customer must pay before any taxes or discounts.
          </p>
        </div>

        {/* VAT */}
        <div>
          <label htmlFor="VAT" className="block text-sm font-semibold text-gray-700">
            VAT (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            id="VAT"
            name="VAT"
            value={formData.VAT}
            onChange={handleChange}
            placeholder="Default VAT rate is 7.5"
            className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm shadow-sm"
            aria-describedby="vat-help"
            required
          />
          <p id="vat-help" className="mt-2 text-xs text-gray-500">
            VAT rate is the tax to be applied on the going rate. Use a number between 0 and 100.
          </p>
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="discount" className="block text-sm font-semibold text-gray-700">
            Discount (%) <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="number"
            step="0.01"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Any discount to apply, e.g., 5"
            className="mt-1 block w-full rounded-lg border border-gray-300 p-3 focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm shadow-sm"
            aria-describedby="discount-help"
          />
          <p id="discount-help" className="mt-2 text-xs text-gray-500">
            If you have a special discount, enter it here. Leave empty if none applies.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 text-right">
        <button
          type="submit"
          className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium text-white transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 
            ${loading ? "cursor-not-allowed bg-orange-300" : "bg-[#ff6c2f] hover:bg-orange-600 shadow-lg"}`}
          disabled={loading}
        >
          {loading ? (
            <motion.span
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              🔄
            </motion.span>
          ) : (
            "Create Payment"
          )}
        </button>
      </div>

      {responseMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded-md shadow-lg z-50 text-sm"
          role="alert"
        >
          {responseMessage}
        </motion.div>
      )}
    </motion.form>
  </motion.div>
  )
};

export default Form;
