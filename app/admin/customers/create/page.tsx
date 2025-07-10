"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdDescription,
  MdCalendarToday,
  MdWc,
  MdStraighten,
  MdCheckCircle,
  MdError,
  MdAdd,
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { getSession } from "next-auth/react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ApplicationRoutes } from "@/constants/ApplicationRoutes";
import StyledPhoneInput from "./PhoneNumberInput";

const Form = () => {
  const router = useRouter();
  const [passwordError, setPasswordError] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    gender: string;
    age: string;
    phone_number: string;
    password: string;
    email: string;
    address: string;
    customer_description: string;
    bust: string;
    waist: string;
    hip: string;
    shoulder: string;
    bustpoint: string;
    shoulder_to_underbust: string;
    round_under_bust: string;
    sleeve_length: string;
    half_length: string;
    blouse_length: string;
    round_sleeve: string;
    dress_length: string;
    chest: string;
    round_shoulder: string;
    skirt_length: string;
    trousers_length: string;
    round_thigh: string;
    round_knee: string;
    round_feet: string;
  }>({
    name: "",
    gender: "",
    age: "",
    phone_number: "+234",
    password: "",
    email: "",
    address: "",
    customer_description: "",
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    bustpoint: "",
    shoulder_to_underbust: "",
    round_under_bust: "",
    sleeve_length: "",
    half_length: "",
    blouse_length: "",
    round_sleeve: "",
    dress_length: "",
    chest: "",
    round_shoulder: "",
    skirt_length: "",
    trousers_length: "",
    round_thigh: "",
    round_knee: "",
    round_feet: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone_number: value });
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
        throw new Error("Access token not found.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/addcustomer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create customer.");
      }

      const result = await response.json();
      setResponseMessage("Customer created successfully!");

      setTimeout(() => {
        setResponseMessage(null);
      }, 5000);
    } catch (error: any) {
      setResponseMessage(`Error: ${error.message}`);

      setTimeout(() => {
        setResponseMessage(null);
      }, 5000);
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      router.push(ApplicationRoutes.AdminCustomers);
    }, 2000);
  };

  const measurements = [
    {
      label: "Shoulder",
      id: "shoulder",
      name: "shoulder",
      placeholder: "Shoulder",
      delay: 1.1,
      value: formData.shoulder,
    },
    {
      label: "Bust",
      id: "bust",
      name: "bust",
      placeholder: "Bust",
      delay: 0.2,
      value: formData.bust,
    },
    {
      label: "Bust Point",
      id: "bustpoint",
      name: "bustpoint",
      placeholder: "Bust Point",
      delay: 0.3,
      value: formData.bustpoint,
    },
    {
      label: "Shoulder to under Bust",
      id: "shoulder_to_underbust",
      name: "shoulder_to_underbust",
      placeholder: "Shoulder to under Bust",
      delay: 1.2,
      value: formData.shoulder_to_underbust,
    },

    {
      label: "Round under Bust",
      id: "round_under_bust",
      name: "round_under_bust",
      placeholder: "Round under Bust",
      delay: 1.0,
      value: formData.round_under_bust,
    },
    {
      label: "Waist",
      id: "waist",
      name: "waist",
      placeholder: "Waist",
      delay: 1.5,
      value: formData.waist,
    },
    {
      label: "Half Length",
      id: "halfLength",
      name: "half_length",
      placeholder: "Half Length",
      delay: 0.6,
      value: formData.half_length,
    },
    {
      label: "Blouse Length",
      id: "blouseLength",
      name: "blouse_length",
      placeholder: "Blouse Length",
      delay: 0.1,
      value: formData.blouse_length,
    },
    {
      label: "Sleeve Length (Long, Quarter, Short)",
      id: "sleeve_length",
      name: "sleeve_length",
      placeholder: "Sleeve Length",
      delay: 1.4,
      value: formData.sleeve_length,
    },
    {
      label: "Round Sleeve (Arm, Below Elbow, Wrist)",
      id: "roundSleeve",
      name: "round_sleeve",
      placeholder: "Round Sleeve",
      delay: 0.9,
      value: formData.round_sleeve,
    },
    {
      label: "Dress Length (Long, 3/4, Short)",
      id: "dressLength",
      name: "dress_length",
      placeholder: "Dress Length",
      delay: 0.5,
      value: formData.dress_length,
    },

    {
      label: "Hip",
      id: "hip",
      name: "hip",
      placeholder: "Hip",
      delay: 0.7,
      value: formData.hip,
    },
    {
      label: "Chest",
      id: "chest",
      name: "chest",
      placeholder: "Chest",
      delay: 0.4,
      value: formData.chest,
    },

    {
      label: "Round Shoulder",
      id: "roundShoulder",
      name: "round_shoulder",
      placeholder: "Round Shoulder",
      delay: 0.8,
      value: formData.round_shoulder,
    },

    {
      label: "Skirt Length (Long, 3/4, Short)",
      id: "skirtLength",
      name: "skirt_length",
      placeholder: "Skirt Length",
      delay: 1.3,
      value: formData.skirt_length,
    },
  ];

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen  py-8 rounded-3xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff6c2f] to-orange-600 rounded-2xl mb-4 shadow-lg">
            <MdAdd className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Add New Customer
          </h1>
          <p className="text-gray-600">
            Create a comprehensive customer profile with measurements
          </p>
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          {/* Personal Information Section */}
          <motion.div
            variants={itemVariants}
            className="mb-10 px-4 sm:px-6 lg:px-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ff6c2f] to-orange-600 rounded-xl flex items-center justify-center">
                <MdPerson className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Full Name */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MdPerson className="text-[#ff6c2f]" /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6c2f] focus:ring-2 focus:ring-orange-100 transition duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MdEmail className="text-[#ff6c2f]" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6c2f] focus:ring-2 focus:ring-orange-100 transition duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </motion.div>

              {/* Age */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="age"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MdCalendarToday className="text-[#ff6c2f]" /> Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*$/.test(v) && Number(v) <= 100) handleChange(e);
                  }}
                  placeholder="Enter age"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6c2f] focus:ring-2 focus:ring-orange-100 transition duration-200 bg-gray-50 focus:bg-white"
                  required
                />
              </motion.div>

              {/* Gender */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="gender"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MdWc className="text-[#ff6c2f]" /> Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6c2f] focus:ring-2 focus:ring-orange-100 transition duration-200 bg-gray-50 focus:bg-white"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>

              <div className="space-y-2">
              <label htmlFor="phone_number" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MdPhone className="text-[#ff6c2f]" /> Phone Number
              </label>
              <StyledPhoneInput value={formData.phone_number} onChange={handlePhoneChange} />
            </div>

              {/* Address (spans two on md and three on lg) */}
              <motion.div
                variants={itemVariants}
                className="space-y-2 sm:col-span-2 lg:col-span-3"
              >
                <label
                  htmlFor="address"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <MdLocationOn className="text-[#ff6c2f]" /> Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter full address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6c2f] focus:ring-2 focus:ring-orange-100 transition duration-200 bg-gray-50 focus:bg-white resize-none"
                  required
                />
              </motion.div>

            
            </div>

            {/* Customer Description (full width) */}
            <motion.div variants={itemVariants} className="mt-6 space-y-2">
              <label
                htmlFor="customer_description"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
              >
                <MdDescription className="text-[#ff6c2f]" /> Customer
                Description
              </label>
              <textarea
                id="customer_description"
                name="customer_description"
                value={formData.customer_description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter customer description and preferences"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6c2f] focus:ring-2 focus:ring-orange-100 transition duration-200 bg-gray-50 focus:bg-white resize-none"
                required
              />
            </motion.div>
          </motion.div>

          {/* Measurements Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex lg:flex-row flex-col  lg:justify-between lg:gap-0 gap-3 lg:items-center mb-6">
                  <div className="flex items-center gap-3 ">
              <div className="w-10 h-10 bg-gradient-to-r from-[#ff6c2f] to-orange-600 rounded-xl flex items-center justify-center">
                <MdStraighten className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Body Measurements
              </h2>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                For duplicate values, separate using hyphens (e.g., 34-36-38)
              </p>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {measurements.map((measurement, index) => (
                <motion.div
                  key={measurement.id}
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <label
                    htmlFor={measurement.id}
                    className="block text-sm font-semibold text-gray-700"
                  >
                    {measurement.label}
                  </label>
                  <input
                    type="text"
                    id={measurement.id}
                    name={measurement.name}
                    placeholder={measurement.placeholder}
                    onChange={handleChange}
                    value={formData[measurement.name as keyof typeof formData]}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff6c2f] focus:ring-2 focus:ring-orange-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="flex justify-end">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`px-8 py-4 bg-gradient-to-r from-[#ff6c2f] to-orange-600 text-white rounded-2xl font-semibold text-lg shadow-lg transition-all duration-200 ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : "hover:shadow-xl hover:from-orange-600 hover:to-[#ff6c2f]"
              } focus:outline-none focus:ring-4 focus:ring-orange-200`}
            >
              <div className="flex items-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Customer...
                  </>
                ) : (
                  <>
                    <MdAdd className="text-xl" />
                    Create Customer
                  </>
                )}
              </div>
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Response Message */}
        <AnimatePresence>
          {responseMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
                  responseMessage.includes("Error")
                    ? "bg-red-500 border-red-600 text-white"
                    : "bg-green-500 border-green-600 text-white"
                }`}
              >
                {responseMessage.includes("Error") ? (
                  <MdError className="text-xl" />
                ) : (
                  <MdCheckCircle className="text-xl" />
                )}
                <span className="font-semibold">{responseMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Form;
