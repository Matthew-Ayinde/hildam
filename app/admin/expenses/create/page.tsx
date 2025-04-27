"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";
import { IoArrowBack } from "react-icons/io5";
import { FiSave, FiPlusCircle, FiActivity, FiSettings } from "react-icons/fi";
import { IoMdCash, IoMdPulse, IoMdConstruct, IoMdHome, IoMdBriefcase } from "react-icons/io";

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
    order_id: string;
    total_tailor_commission_percentage: string
  }


  const sectionVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

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
    order_id: "",
    total_tailor_commission_percentage: ""
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
        order_id: "",
        total_tailor_commission_percentage: "0"
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
    {/* Notification */}
    {notification && (
      <motion.div
        className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-5 py-3 rounded-lg shadow-xl z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {notification}
      </motion.div>
    )}

    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
    >
      <header className="flex items-center justify-between bg-orange-500 text-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <IoArrowBack size={24} className="cursor-pointer hover:text-orange-200" onClick={() => router.back()} />
          <FiActivity size={26} />
          <h1 className="text-2xl font-semibold">Add New Expense</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Summary Fields */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden" animate="visible" variants={sectionVariants} transition={{ delay: 0.2 }}
        >
          {[
            { icon: <IoMdCash size={20} />, name: 'order_id', label: 'Order ID', type: 'text' },
            { icon: <IoMdPulse size={20} />, name: 'total_amount', label: 'Total Amount', type: 'number' },
            { icon: <IoMdConstruct size={20} />, name: 'balance_remaining', label: 'Balance Remaining', type: 'number' }
          ].map(field => (
            <div key={field.name} className="flex flex-col">
              <label className="flex items-center text-gray-700 font-medium mb-2 space-x-2">
                {field.icon}
                <span>{field.label}</span>
              </label>
              <input
                type={field.type}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          ))}
        </motion.div>

        {/* Breakdown Fields */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden" animate="visible" variants={sectionVariants} transition={{ delay: 0.4 }}
        >
          {[
            { name: 'utilities', label: 'Utilities', icon: <IoMdHome size={18} /> },
            { name: 'services', label: 'Services', icon: <FiSettings size={18} /> },
            { name: 'purchase_costs', label: 'Purchase Costs', icon: <IoMdBriefcase size={18} /> },
            { name: 'labour', label: 'Labour', icon: <IoMdPulse size={18} /> },
            { name: 'rent', label: 'Rent', icon: <IoMdHome size={18} /> },
            {name: 'total_tailor_commission_percentage', label: 'Tailor Commission Percentage', icon: <IoMdHome size={18} /> }
          ].map(item => (
            <div key={item.name} className="flex flex-col space-y-2">
              <label className="flex items-center text-gray-700 font-medium space-x-2">
                {item.icon}
                <span>{item.label}</span>
              </label>
              <input
                type="number"
                name={item.name}
                value={(form as any)[item.name]}
                onChange={handleChange}
                required
                placeholder="0"
                className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          ))}
        </motion.div>

        {/* Submit */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 bg-orange-500 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {isSubmitting ? <Spinner /> : <FiSave size={20} />}
            <span>{isSubmitting ? 'Adding...' : 'Add Expense'}</span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  </div>
  );
}
