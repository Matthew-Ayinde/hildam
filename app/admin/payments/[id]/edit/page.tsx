"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io";
import { FiDollarSign } from "react-icons/fi";
import { AiOutlineBarChart } from "react-icons/ai";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    order_id: "",
    payment_status_id: "",
    total_paid: "",
    cumulative: "",
  });

  const fetchCustomer = async () => {
    setLoading(true);
    setError("");
    try {
      const session = await getSession();
      const token = session?.user?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch payment data");
      const { data } = await res.json();
      setFormData({
        order_id: data.order_id,
        payment_status_id: data.payment_status_id,
        total_paid: data.total_paid,
        cumulative: data.cumulative,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      const session = await getSession();
      const token = session?.user?.token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editpayment/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to update payment data");
      setSuccessMessage("Payment updated successfully!");
      setTimeout(() => router.push("/admin/payments"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-full py-20">
      <Spinner />
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 py-10">
      <p>Error: {error}</p>
      <button onClick={fetchCustomer} className="mt-4 text-blue-600 underline">
        Retry
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto p-8 bg-white rounded-3xl shadow-lg"
    >
      {successMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-6 rounded-full shadow-md flex items-center"
        >
          <FiDollarSign className="mr-2" />
          {successMessage}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Link
          href="/admin/payments"
          className="flex items-center text-orange-500 hover:text-orange-700"
        >
          <IoIosArrowBack size={24} />
          <span className="ml-2">Back to List</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Order ID
            </label>
            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              disabled
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-600"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-1">
              Payment Status
            </label>
            <select
              name="payment_status_id"
              value={formData.payment_status_id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3 appearance-none bg-white"
            >
              <option value="">Select status</option>
              <option value="1">Not Paid</option>
              <option value="2">In Review</option>
              <option value="3">Paid</option>
            </select>
            <IoIosArrowDown className="absolute right-3 top-10 pointer-events-none text-gray-500" />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              <span className="text-xl inline mr-1">₦</span> Total Paid
            </label>
            <input
              type="number"
              name="total_paid"
              value={formData.total_paid}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              <AiOutlineBarChart className="inline mr-1" /> Cumulative
            </label>
            <input
              type="number"
              name="cumulative"
              value={formData.cumulative}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-3"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <motion.button
            type="button"
            onClick={() => router.push(`/admin/payments/${id}`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </motion.button>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg"
          >
            Save Changes
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
