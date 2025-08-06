"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import Spinner from "@/components/Spinner";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { TbCurrencyNaira } from "react-icons/tb";
import { editJobExpense, fetchJobExpense } from "@/app/api/apiClient";
import { ApplicationRoutes } from "@/constants/ApplicationRoutes";

export default function EditExpensePage() {
  const { id } = useParams();
  const jobExpenseId = id as string;
  const router = useRouter();

  interface Expense {
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
  }

  const [form, setForm] = useState<Expense>({
    total_amount: "",
    utilities: "",
    utilities_description: "",
    services: "",
    services_description: "",
    purchase_costs: "",
    purchase_costs_description: "",
    labour: "",
    labour_description: "",
    rent: "",
    rent_description: "",
    balance_remaining: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const session = await getSession();
        const token = session?.user?.token;
        if (!token) throw new Error("Authentication token missing");

        const res = await fetchJobExpense(jobExpenseId);
        // Populate form
        setForm({
          total_amount: res.total_amount,
          utilities: res.utilities,
          utilities_description: res.utilities_description,
          services: res.services,
          services_description: res.services_description,
          purchase_costs: res.purchase_costs,
          purchase_costs_description: res.purchase_costs_description,
          labour: res.labour,
          labour_description: res.labour_description,
          rent: res.rent,
          rent_description: res.rent_description,
          balance_remaining: res.balance_remaining,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {

      const res = await editJobExpense(jobExpenseId, form);

      setNotification("Expense updated successfully");
      setTimeout(() => setNotification(null), 5000);

      router.push(ApplicationRoutes.AdminJobExpenses);
    } catch (err: any) {
      console.error(err);
      setNotification(err.message || "Error updating expense");
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <IoArrowBack size={20} className="mr-2" /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded shadow-lg z-50">
          {notification}
        </div>
      )}

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
          <h1 className="text-2xl font-semibold">Edit Expense</h1>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Summary Fields */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Total Amount
              </label>
              <input
                type="text"
                name="total_amount"
                value={form.total_amount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>
          
          </div> */}

          {/* Breakdown Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "utilities", label: "Utilities", desc: "utilities_description" },
              { name: "services", label: "Services", desc: "services_description" },
              { name: "purchase_costs", label: "Purchase Costs", desc: "purchase_costs_description" },
              { name: "labour", label: "Labour", desc: "labour_description" },
              { name: "rent", label: "Rent", desc: "rent_description" },
            ].map(({ name, label, desc }) => (
              <div key={name} className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  {label}
                </label>
                <input
                  type="text"
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
                />
                {/* <textarea
                  name={desc}
                  value={(form as any)[desc]}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
                  placeholder="Description"
                /> */}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              <FiSave size={20} className="mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
