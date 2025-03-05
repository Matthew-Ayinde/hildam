"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineHideSource, MdOutlineRemoveRedEye } from "react-icons/md";
import { motion } from "framer-motion";

const Form = () => {

  const router = useRouter();
  const [passwordError, setPasswordError] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    gender: string;
    age: string;
    phone: string;
    password: string;
    email: string;
    address: string;
    description: string;
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
    age: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    bust: "",
    waist: "",
    hips: "",
    shoulderWidth: "",
    neck: "",
    armLength: "",
    backLength: "",
    frontLength: "",
    highBust: "",
    password: "",
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
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        throw new Error("Access token not found in session storage.");
      }

      console.log(
        JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password,
          age: formData.age,
        })
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/addcustomer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            gender: formData.gender,
            email: formData.email,
            phone_number: formData.phone,
            password: formData.password,
            age: formData.age,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create customer.");
      }

      const result = await response.json();
      setResponseMessage("Customer created successfully!");

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

    router.push("/admin/customers");
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
  <div className="font-bold text-gray-500 text-xl my-3">Create Payment</div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
    {/* Order ID */}
    <div className="w-full">
      <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">
        Order ID
      </label>
      <input
        type="text"
        id="orderId"
        name="orderId"
        // value={formData.order_id}
        onChange={handleChange}
        placeholder="Enter Order ID"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
        required
      />
    </div>
  
    <div className="w-full">
      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
        Payment Method
      </label>
      <select
        id="gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
        required
        disabled
      >
        <option value="">Transfer</option>
        <option value="male">Cash</option>
        <option value="female">Transfer</option>
      </select>
    </div>
  
    <div className="w-full">
      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
        Payment Status
      </label>
      <select
        id="gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
        required
      >
        <option value="">Select payment status</option>
        <option value="other">In Review</option>
        <option value="male">Paid</option>
        <option value="female">Not Paid</option>
      </select>
    </div>
  
    <div className="w-full">
      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
        Gender
      </label>
      <select
        id="gender"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
        required
      >
        <option value="">Select your gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div className="w-full">
      <label
        htmlFor="file"
        className="block text-sm font-medium text-gray-700"
      >
        Payment Receipt
      </label>
      <input
        type="file"
        id="file"
        name="file"
        // value={formData.file}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
        required
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
      {loading ? "Loading..." : "Create Customer"}
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
