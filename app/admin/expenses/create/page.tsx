"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";
import { IoArrowBack } from "react-icons/io5";
import { FiSave, FiPlusCircle } from "react-icons/fi";

export default function AddExpensePage() {
  const router = useRouter();

  interface ExpenseForm {
    total_amount: string;
    balance_remaining: string;
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
  }

  const [form, setForm] = useState<ExpenseForm>({
    total_amount: "",
    balance_remaining: "",
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) throw new Error("Authentication token missing.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/addexpense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!response.ok) throw new Error("Failed to add expense.");

      setNotification("Expense added successfully!");
      setTimeout(() => setNotification(null), 5000);
      setForm({
        total_amount: "",
        balance_remaining: "",
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
      });
    } catch (err: any) {
      console.error(err);
      setNotification(err.message || "Error adding expense.");
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded shadow-lg z-50">
          {notification}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <header className="flex items-center bg-orange-500 text-white p-4">
          <IoArrowBack
            size={24}
            className="cursor-pointer mr-4 hover:text-orange-200"
            onClick={() => router.back()}
          />
          <FiPlusCircle size={28} className="mr-2" />
          <h1 className="text-2xl font-semibold">Add New Expense</h1>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Summary Fields */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Total Amount
              </label>
              <input
                type="number"
                name="total_amount"
                value={form.total_amount}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Balance Remaining
              </label>
              <input
                type="number"
                name="balance_remaining"
                value={form.balance_remaining}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>
          </motion.div>

          {/* Breakdown Fields */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { name: "utilities", label: "Utilities", placeholder: "2000" },
              { name: "services", label: "Services", placeholder: "3000" },
              { name: "purchase_costs", label: "Purchase Costs", placeholder: "3000" },
              { name: "labour", label: "Labour", placeholder: "1000" },
              { name: "rent", label: "Rent", placeholder: "10000" },
            ].map(({ name, label, placeholder }) => (
              <div key={name} className="space-y-2">
                <label className="block text-gray-700 font-medium">
                  {label}
                </label>
                <input
                  type="number"
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
                />
                <textarea
                  name={`${name}_description`}
                  value={(form as any)[`${name}_description`]}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Description"
                  className="w-full border border-gray-300 rounded p-2 focus:ring-orange-300 focus:border-orange-300"
                />
              </div>
            ))}
          </motion.div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {isSubmitting ? <Spinner /> : <FiSave size={20} />}
              <span className="ml-2">
                {isSubmitting ? "Adding..." : "Add Expense"}
              </span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
