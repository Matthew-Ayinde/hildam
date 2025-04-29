"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Spinner from "@/components/Spinner";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { FiDollarSign, FiPieChart } from "react-icons/fi";
import { GiWaterDrop, GiTakeMyMoney } from "react-icons/gi";
import { MdMiscellaneousServices, MdConstruction } from "react-icons/md";
import { FaHome } from "react-icons/fa";

export default function ShowExpensePage() {
  const { id } = useParams();
  const router = useRouter();

  interface Expense {
    id: string;
    total_amount: string;
    utilities: string;
    utilities_description: string;
    services: string;
    services_description: string;
    purchase_costs: string;
    purchase_costs_description: string;
    labour: string;
    labour_description: string;
    rent: string;
    rent_description: string;
    balance_remaining: string;
    created_at: string;
    updated_at: string;
  }

  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    const day = date.getUTCDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getUTCFullYear();
    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    const fetchExpense = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const token = session?.user?.token;
        if (!token) throw new Error("Authentication token not found.");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/getexpense/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch expense.");

        const json = await res.json();
        setExpense(json.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading expense");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpense();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500 mb-4">{error || "Expense not found."}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          <IoArrowBack size={20} className="mr-2" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <header className="flex items-center bg-orange-500 text-white p-4">
          <IoArrowBack
            size={24}
            className="cursor-pointer mr-4 hover:text-orange-200"
            onClick={() => router.back()}
          />
          <FiPieChart size={28} className="mr-2" />
          <h1 className="text-2xl font-semibold">Expense Overview</h1>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Summary Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-orange-600 border-b-2 border-orange-200 pb-2">
              Summary
            </h2>
            <div className="flex items-center bg-orange-50 p-4 rounded-lg shadow-sm">
              <div className="text-orange-500 mr-3 text-3xl">₦</div>
              <div>
                <p className="text-gray-700 font-medium">Total Amount</p>
                <p className="text-lg font-semibold">₦{expense.total_amount}</p>
              </div>
            </div>

            {/* <div className="flex items-center bg-orange-50 p-4 rounded-lg shadow-sm">
              <GiTakeMyMoney size={24} className="text-orange-500 mr-3" />
              <div>
                <p className="text-gray-700 font-medium">Balance Remaining</p>
                <p className="text-lg font-semibold">
                  ₦{expense.balance_remaining}
                </p>
              </div>
            </div> */}

            <div className="flex items-center bg-orange-50 p-4 rounded-lg shadow-sm">
              <div className="text-orange-500 mr-3 text-3xl">₦</div>
              <div>
                <p className="text-gray-700 font-medium">Created On</p>
                <p className="text-lg font-semibold">
                  {formatDate(expense.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-orange-50 p-4 rounded-lg shadow-sm">
              <div className="text-orange-500 mr-3 text-3xl">₦</div>
              <div>
                <p className="text-gray-700 font-medium">Updated On</p>
                <p className="text-lg font-semibold">
                  {formatDate(expense.updated_at)}
                </p>
              </div>
            </div>
          </motion.div>
          {/* Breakdown Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-orange-600 border-b-2 border-orange-200 pb-2">
              Breakdown
            </h2>

            {[
              {
                label: "Utilities",
                value: expense.utilities,
                desc: expense.utilities_description,
                icon: (
                  <GiWaterDrop size={24} className="text-orange-500 mr-3" />
                ),
              },
              {
                label: "Services",
                value: expense.services,
                desc: expense.services_description,
                icon: (
                  <MdMiscellaneousServices
                    size={24}
                    className="text-orange-500 mr-3"
                  />
                ),
              },
              {
                label: "Purchase Costs",
                value: expense.purchase_costs,
                desc: expense.purchase_costs_description,
                icon: (
                  <GiTakeMyMoney size={24} className="text-orange-500 mr-3" />
                ),
              },
              {
                label: "Labour",
                value: expense.labour,
                desc: expense.labour_description,
                icon: (
                  <MdConstruction size={24} className="text-orange-500 mr-3" />
                ),
              },
              {
                label: "Rent",
                value: expense.rent,
                desc: expense.rent_description,
                icon: <FaHome size={24} className="text-orange-500 mr-3" />,
              },
            ].map(({ label, value, desc, icon }) => (
              <div
                key={label}
                className="flex items-start bg-orange-50 p-4 rounded-lg shadow-sm"
              >
                {icon}
                <div>
                  <p className="text-gray-700 font-medium">
                    {label}: ₦{value}
                  </p>
                  <p className="italic text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex justify-end m-5"
          >
            <button
              onClick={() => router.push(`/admin/expenses/${id}/edit`)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              <div className="text-orange-500 mr-3 text-3xl">₦</div>
              Edit Expense
            </button>
          </motion.div>
      </motion.div>
    </div>
  );
}
