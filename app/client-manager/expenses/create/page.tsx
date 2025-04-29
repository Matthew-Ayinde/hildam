"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";
import { IoArrowBack } from "react-icons/io5";
import { FiSave, FiHash, FiZap, FiTool, FiShoppingCart, FiUsers, FiHome, FiPercent } from "react-icons/fi";
import { TbCurrencyNaira } from "react-icons/tb";

// Field configuration
interface FieldConfig {
  name: keyof ExpenseForm;
  label: string;
  type?: "text" | "number";
  icon: React.ReactNode;
  readOnly?: boolean;
}

// Expense form state shape
interface ExpenseForm {
  order_id: string;
  total_amount: string;
  balance_remaining: string;
  utilities: string;
  services: string;
  purchase_costs: string;
  labour: string;
  rent: string;
  total_tailor_commission_percentage: string;
  total_tailor_commission_amount: string;
}

const SUMMARY_FIELDS: FieldConfig[] = [
  { name: 'order_id', label: 'Order ID', type: 'text', icon: <FiHash size={20} /> },
  { name: 'total_amount', label: 'Total Amount (₦)', type: 'number', icon: <TbCurrencyNaira size={20} /> },
];

const BREAKDOWN_FIELDS: FieldConfig[] = [
  { name: 'utilities', label: 'Utilities (₦)', type: 'number', icon: <FiZap size={18} /> },
  { name: 'services', label: 'Services (₦)', type: 'number', icon: <FiTool size={18} /> },
  { name: 'purchase_costs', label: 'Purchase Costs (₦)', type: 'number', icon: <FiShoppingCart size={18} /> },
  { name: 'labour', label: 'Labour (₦)', type: 'number', icon: <FiUsers size={18} /> },
  { name: 'rent', label: 'Rent (₦)', type: 'number', icon: <FiHome size={18} /> },
  { name: 'total_tailor_commission_percentage', label: 'Commission (%)', type: 'number', icon: <FiPercent size={18} /> },
{ name: 'total_tailor_commission_amount', label: 'Commission Amount (₦)', type: 'number', icon: <TbCurrencyNaira size={18} />, readOnly: true },
];

// Reusable input component (always input for cleaner design)
function Field({ config, value, onChange }: { config: FieldConfig; value: string; onChange: (name: keyof ExpenseForm, value: string) => void; }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="flex items-center space-x-2 text-gray-700 font-medium">
        {config.icon}
        <span>{config.label}</span>
      </label>
      <input
        type={config.type || 'text'}
        name={config.name}
        value={value}
        onChange={e => onChange(config.name, e.target.value)}
        readOnly={config.readOnly}
        className={
          `border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300 ` +
          (config.readOnly ? 'bg-gray-100' : '')
        }
      />
    </div>
  );
}

// Section wrapper
function FormSection({ title, fields, form, onChange }: { title: string; fields: FieldConfig[]; form: ExpenseForm; onChange: (name: keyof ExpenseForm, value: string) => void; }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-inner p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-orange-600 border-b pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(f => (
          <Field
            key={f.name}
            config={f}
            value={form[f.name]}
            onChange={onChange}
          />
        ))}
      </div>
    </motion.section>
  );
}

export default function AddExpensePage() {
  const router = useRouter();
  const [form, setForm] = useState<ExpenseForm>({
    order_id: '', total_amount: '', balance_remaining: '',
    utilities: '', services: '', purchase_costs: '', labour: '', rent: '',
    total_tailor_commission_percentage: '0', total_tailor_commission_amount: '0',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-calculate commission amount
  useEffect(() => {
    const amt = parseFloat(form.total_amount) || 0;
    const pct = parseFloat(form.total_tailor_commission_percentage) || 0;
    const calc = ((amt * pct) / 100).toFixed(2);
    setForm(prev => ({ ...prev, total_tailor_commission_amount: calc }));
  }, [form.total_amount, form.total_tailor_commission_percentage]);

  const handleChange = useCallback((name: keyof ExpenseForm, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/addexpense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to add expense');
      setNotification('Expense added successfully!');
      setTimeout(() => setNotification(null), 4000);
      setForm({
        order_id: '', total_amount: '', balance_remaining: '',
        utilities: '', services: '', purchase_costs: '', labour: '', rent: '',
        total_tailor_commission_percentage: '0', total_tailor_commission_amount: '0',
      });
    } catch (err: any) {
      setNotification(err.message || 'Error adding expense');
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
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
            <h1 className="text-2xl font-semibold">Add New Expense</h1>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <FormSection title="Summary" fields={SUMMARY_FIELDS} form={form} onChange={handleChange} />
          <FormSection title="Expense Breakdown" fields={BREAKDOWN_FIELDS} form={form} onChange={handleChange} />
          <div className="flex justify-end">
            <motion.button
              type="submit" disabled={isSubmitting}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
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
