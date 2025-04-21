"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { MdOutlineHideSource, MdOutlineRemoveRedEye } from "react-icons/md";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth

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
    phone_number: "",
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
      const session = await getSession(); // Get session from NextAuth
      const token = session?.user?.token; // Access token from session
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
          body: JSON.stringify({
            name: formData.name,
            gender: formData.gender,
            age: formData.age,
            phone_number: formData.phone_number,
            password: formData.password,
            email: formData.email,
            address: formData.address,
            customer_description: formData.customer_description,
            bust: formData.bust,
            waist: formData.waist,
            hip: formData.hip,
            shoulder: formData.shoulder,
            bustpoint: formData.bustpoint,
            shoulder_to_underbust: formData.shoulder_to_underbust,
            round_under_bust: formData.round_under_bust,
            sleeve_length: formData.sleeve_length,
            half_length: formData.half_length,
            blouse_length: formData.blouse_length,
            round_sleeve: formData.round_sleeve,
            dress_length: formData.dress_length,
            chest: formData.chest,
            round_shoulder: formData.round_shoulder,
            skirt_length: formData.skirt_length,
            trousers_length: formData.trousers_length,
            round_thigh: formData.round_thigh,
            round_knee: formData.round_knee,
            round_feet: formData.round_feet,
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


    // Define measurements
const measurements = [
  { label: "Bust", id: "bust", name: "bust", placeholder: "Bust", delay: 0.8, value: formData.bust},
  {
    label: "Waist",
    id: "waist",
    name: "waist",
    placeholder: "Waist",
    delay: 0.9,
    value: formData.waist,
  },
  { label: "Hip", id: "hip", name: "hip", placeholder: "Hip", delay: 1.0, value: formData.hip},
  {
    label: "Shoulder",
    id: "shoulder",
    name: "shoulder",
    placeholder: "Shoulder",
    delay: 1.1,
    value: formData.shoulder,
  },
  {
    label: "Bust Point",
    id: "bustpoint",
    name: "bustpoint",
    placeholder: "Bust Point",
    delay: 1.2,
    value: formData.bustpoint,
  },
  {
    label: "Shoulder to under Bust",
    id: "shoulder_to_underbust",
    name: "shoulder_to_underbust",
    placeholder: "Shoulder to under Bust",
    delay: 1.3,
    value: formData.shoulder_to_underbust,
  },
  {
    label: "Round under Bust",
    id: "round_under_bust",
    name: "round_under_bust",
    placeholder: "Round under Bust",
    delay: 1.4,
    value: formData.round_under_bust
  },
  {
    label: "Sleeve Length",
    id: "sleeve_length",
    name: "sleeve_length",
    placeholder: "Sleeve Length",
    delay: 1.5,
    value: formData.sleeve_length
  },
  {
    label: "Half Length",
    id: "halfLength",
    name: "half_length",
    placeholder: "Half Length",
    delay: 1.6,
    value: formData.half_length
  },
  {
    label: "Blouse Length",
    id: "blouseLength",
    name: "blouse_length",
    placeholder: "Blouse Length",
    delay: 1.7,
    value: formData.blouse_length
  },
  {
    label: "Round Sleeve",
    id: "roundSleeve",
    name: "round_sleeve",
    placeholder: "Round Sleeve",
    delay: 1.8,
    value: formData.round_sleeve
  },
  {
    label: "Dress Length",
    id: "dressLength",
    name: "dress_length",
    placeholder: "Dress Length",
    delay: 1.9,
    value: formData.dress_length
  },
  {
    label: "Chest",
    id: "chest",
    name: "chest",
    placeholder: "Chest",
    delay: 2.0,
    value: formData.chest
  },
  {
    label: "Round Shoulder",
    id: "roundShoulder",
    name: "round_shoulder",
    placeholder: "Round Shoulder",
    delay: 2.1,
    value: formData.round_shoulder
  },
  {
    label: "Skirt Length",
    id: "skirtLength",
    name: "skirt_length",
    placeholder: "Skirt Length",
    delay: 2.2,
    value: formData.skirt_length
  },
  {
    label: "Trousers Length",
    id: "trousersLength",
    name: "trousers_length",
    placeholder: "Trousers Length",
    delay: 2.3,
    value: formData.trousers_length
  },
  {
    label: "Round Thigh",
    id: "roundThigh",
    name: "round_thigh",
    placeholder: "Round Thigh",
    delay: 2.4,
    value: formData.round_thigh
  },
  {
    label: "Round Knee",
    id: "roundKnee",
    name: "round_knee",
    placeholder: "Round Knee",
    delay: 2.5,
    value: formData.round_knee
  },
  {
    label: "Round Feet",
    id: "roundFeet",
    name: "round_feet",
    placeholder: "Round Feet",
    delay: 2.6,
    value: formData.round_feet
  },
];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gray-100 flex justify-center"
    >
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        <div className="font-bold text-gray-700 text-xl my-3">
          Add Customer Information
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          <div className="w-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length <= 11) {
                  if (value.length > 4 && value.length <= 7) {
                    value = `${value.slice(0, 4)} ${value.slice(4)}`;
                  } else if (value.length > 7) {
                    value = `${value.slice(0, 4)} ${value.slice(
                      4,
                      7
                    )} ${value.slice(7)}`;
                  }
                  handleChange({
                    target: { name: "phone_number", value },
                  } as React.ChangeEvent<HTMLInputElement>);
                }
              }}
              placeholder="XXXX XXX XXXX"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
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
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && Number(value) <= 100) {
                  handleChange(e);
                }
              }}
              placeholder="Enter your age"
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e);
                setPasswordError(e.target.value.length < 6);
              }}
              placeholder="Enter your password"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-9 text-gray-500 hover:text-[#ff6c2f]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <MdOutlineHideSource size={30} className="h-5 w-5" />
              ) : (
                <MdOutlineRemoveRedEye size={30} className="h-5 w-5" />
              )}
            </button>

            {passwordError && (
              <p className="mt-2 text-sm text-red-600">
                Password must be at least 6 characters long.
              </p>
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="block text-xl font-bold text-gray-700 mt-10 mb-1">
            Measurements
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap -mx-2">
              {measurements.map((measurement, index) => (
                <motion.div
                  key={measurement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: measurement.delay }}
                  className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
                >
                  <label
                    htmlFor={measurement.id}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {measurement.label}
                  </label>
                  <input
                    type="number"
                    id={measurement.id}
                    name={measurement.name}
                    placeholder={measurement.placeholder}
                  onChange={handleChange}
                  value={formData[measurement.name as keyof typeof formData]}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                  />
                </motion.div>
              ))}
            </div>
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
