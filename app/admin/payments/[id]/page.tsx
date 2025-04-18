"use client";

import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { getSession } from "next-auth/react";
// Importing additional icons
import { AiOutlineCalendar } from "react-icons/ai";
import { MdOutlineReceiptLong } from "react-icons/md";
import { FaUserCircle, FaRegCreditCard } from "react-icons/fa";

interface Customer {
  id?: string;
  order_id: string;
  created_at?: string;
  updated_at?: string;
  VAT?: string;
  discount?: string;
  going_rate?: string;
  total_amount_due?: string;
  cumulative_total_amount?: string;
  amount_paid?: string;
  balance_remaining?: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  clothing_name: string;
  clothing_description: string;
  priority?: string;
  order_status?: string;
  // Existing fields for measurement & additional info
  fullName: string;
  phone_number: string;
  payment_receipt: string;
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
  project_manager_payment_method: string;
  project_manager_amount: string;
  customer_description: string;
}

// Helper function to format dates
const formatDate = (dateStr?: string) => {
  if (!dateStr || dateStr === "N/A") return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function ShowCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${id}`,
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
      if (result.data) {
        const mappedCustomer: Customer = {
          id: result.data.id,
          order_id: result.data.order_id || "N/A",
          created_at: result.data.created_at || "N/A",
          updated_at: result.data.updated_at || "N/A",
          VAT: result.data.VAT || "N/A",
          discount: result.data.discount || "N/A",
          going_rate: result.data.going_rate || "N/A",
          total_amount_due: result.data.total_amount_due || "N/A",
          cumulative_total_amount: result.data.cumulative_total_amount || "N/A",
          amount_paid: result.data.amount_paid || "N/A",
          balance_remaining: result.data.balance_remaining || "N/A",
          payment_status: result.data.payment_status || "N/A",
          customer_name: result.data.customer_name || "N/A",
          customer_email: result.data.customer_email || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          clothing_description: result.data.clothing_description || "N/A",
          priority: result.data.priority || "N/A",
          order_status: result.data.order_status || "N/A",
          // Existing mapping
          fullName: result.data.customer_name || "N/A",
          phone_number: result.data.phone_number || "N/A",
          payment_receipt: result.data.payment_receipt || "N/A",
          phone: result.data.phone_number || "N/A",
          date: new Date().toLocaleDateString(),
          email: result.data.customer_email || "N/A",
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hip: result.data.hips || 0,
          shoulderWidth: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          armLength: result.data.arm_length || 0,
          backLength: result.data.back_length || 0,
          frontLength: result.data.front_length || 0,
          project_manager_payment_method:
            result.data.project_manager_payment_method || "N/A",
          project_manager_amount: result.data.project_manager_amount || "N/A",
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
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error}{" "}
        <button onClick={fetchCustomer} className="text-orange-500 underline">
          Retry
        </button>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full mx-auto p-8 bg-white rounded-2xl shadow-xl space-y-8 border-t-4 border-orange-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <Link
          href="/admin/payments"
          className="flex items-center text-orange-500 hover:text-orange-700 transition"
        >
          <IoIosArrowBack size={30} />
          <span className="ml-2 font-semibold">Back to List</span>
        </Link>
        <div className="flex items-center space-x-2 text-lg font-bold text-gray-800">
          <MdOutlineReceiptLong size={24} className="text-orange-500" />
          <span>Order ID: {customer.order_id}</span>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        className="p-6 bg-gradient-to-r from-white to-orange-50 rounded-lg shadow-md border border-orange-200"
      >
        <div className="flex items-center space-x-2 mb-4">
          <FaRegCreditCard size={24} className="text-orange-600" />
          <h2 className="text-2xl font-bold text-orange-600">Payment & Order Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Customer Name</p>
            <p className="mt-1 text-gray-800">
              <FaUserCircle className="inline mr-1 text-orange-500" />
              {customer.customer_name}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Customer Email</p>
            <p className="mt-1 text-gray-800">{customer.customer_email}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Payment Status</p>
            <p className="mt-1 text-gray-800">{customer.payment_status}</p>
          </div>
          
          
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Clothing Name</p>
            <p className="mt-1 text-gray-800">{customer.clothing_name}</p>
          </div>
          <div className="md:col-span-2 border-b pb-2">
            <p className="text-sm text-gray-600">Clothing Description</p>
            <p className="mt-1 text-gray-800">{customer.clothing_description}</p>
          </div>

          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">VAT</p>
            <p className="mt-1 text-gray-800">{customer.VAT}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Discount</p>
            <p className="mt-1 text-gray-800">{customer.discount}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Going Rate</p>
            <p className="mt-1 text-gray-800">
              <span className="inline mr-1 text-orange-500">₦</span>
              {customer.going_rate}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Total Amount Due</p>
            <p className="mt-1 text-gray-800">
              <span className="inline mr-1 text-orange-500">₦</span>
              {customer.total_amount_due}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Cumulative Total</p>
            <p className="mt-1 text-gray-800">
              <span className="inline mr-1 text-orange-500">₦</span>
              {customer.cumulative_total_amount}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Amount Paid</p>
            <p className="mt-1 text-gray-800">
              <span className="inline mr-1 text-orange-500">₦</span>
              {customer.amount_paid}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Balance Remaining</p>
            <p className="mt-1 text-gray-800">
              <span className="inline mr-1 text-orange-500">₦</span>
              {customer.balance_remaining}
            </p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Order Status</p>
            <p className="mt-1 text-gray-800">{customer.order_status}</p>
          </div>
          <div className="border-b pb-2">
            <p className="text-sm text-gray-600">Priority</p>
            <p className="mt-1 text-gray-800">{customer.priority}</p>
          </div>
        </div>
      </motion.div>


      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Link
          href={`/admin/payments/${id}/invoice`}
          className="px-6 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition"
        >
          Generate Invoice
        </Link>
        <Link
          href={`/admin/payments/${id}/receipt`}
          className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
        >
          Generate Receipt
        </Link>
      </div>
    </motion.div>
  );
}
