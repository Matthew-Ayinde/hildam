"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineHideSource, MdOutlineRemoveRedEye } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // BELOW your generic handleChange…
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

    setTimeout(() => {
      router.push("/admin/customers");
    }, 2000); // Redirect after 2 seconds
  };

  // Define measurements
  const measurements = [
    {
      label: "Blouse Length",
      id: "blouseLength",
      name: "blouse_length",
      placeholder: "Blouse Length",
      delay: 1.7,
      value: formData.blouse_length,
    },
    {
      label: "Bust",
      id: "bust",
      name: "bust",
      placeholder: "Bust",
      delay: 0.8,
      value: formData.bust,
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
      label: "Chest",
      id: "chest",
      name: "chest",
      placeholder: "Chest",
      delay: 2.0,
      value: formData.chest,
    },
    {
      label: "Dress Length(Long, 3/4, Short)",
      id: "dressLength",
      name: "dress_length",
      placeholder: "Dress Length",
      delay: 1.9,
      value: formData.dress_length,
    },
    {
      label: "Half Length",
      id: "halfLength",
      name: "half_length",
      placeholder: "Half Length",
      delay: 1.6,
      value: formData.half_length,
    },
    {
      label: "Hip",
      id: "hip",
      name: "hip",
      placeholder: "Hip",
      delay: 1.0,
      value: formData.hip,
    },
    {
      label: "Round Shoulder",
      id: "roundShoulder",
      name: "round_shoulder",
      placeholder: "Round Shoulder",
      delay: 2.1,
      value: formData.round_shoulder,
    },
    {
      label: "Round Sleeve(Arm, Below Elbow, Wrist)",
      id: "roundSleeve",
      name: "round_sleeve",
      placeholder: "Round Sleeve",
      delay: 1.8,
      value: formData.round_sleeve,
    },
    {
      label: "Round under Bust",
      id: "round_under_bust",
      name: "round_under_bust",
      placeholder: "Round under Bust",
      delay: 1.4,
      value: formData.round_under_bust,
    },
    {
      label: "Shoulder",
      id: "shoulder",
      name: "shoulder",
      placeholder: "Shoulder",
      delay: 1.1,
      value: formData.shoulder,
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
      label: "Skirt Length(Long, 3/4, Short)",
      id: "skirtLength",
      name: "skirt_length",
      placeholder: "Skirt Length",
      delay: 2.2,
      value: formData.skirt_length,
    },
    {
      label: "Sleeve Length(Long, Quarter, Short)",
      id: "sleeve_length",
      name: "sleeve_length",
      placeholder: "Sleeve Length",
      delay: 1.5,
      value: formData.sleeve_length,
    },
    {
      label: "Waist",
      id: "waist",
      name: "waist",
      placeholder: "Waist",
      delay: 0.9,
      value: formData.waist,
    },
  ];

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage(""); // or however you clear it
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup if component unmounts early
    }
  }, [responseMessage]);

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
              className="mt-1 block w-full rounded-md border text-gray-700 border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
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
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <PhoneInput
              country="ng"
              enableSearch
              disableCountryCode={false}
              countryCodeEditable={false}
              value={formData.phone_number}
              onChange={handlePhoneChange}
              /* container wraps the whole widget */
              containerClass="w-full mt-1"
              containerStyle={{ width: "100%" }}
              /* exactly your form-input styles, with extra left-padding */
              inputClass="
      block w-full rounded-md border border-gray-300 shadow-sm
      focus:border-[#ff6c2f] focus:ring-[#ff6c2f]
      sm:text-sm p-2 pl-20
    "
              /* flag + code button styled and positioned flush left */
              buttonClass="
      absolute left-0 top-0 h-full bg-white
      border-r border-gray-300 rounded-l-md
      pl-3 pr-2
    "
              /* dropdown inherits full width and obvious styling */
              dropdownClass="
      w-full bg-white border border-gray-300
      rounded-md shadow-md
    "
            />
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          <div className="w-full">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
              placeholder="Please enter your address"
            ></textarea>
          </div>
          <div className="w-full">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Description
            </label>
            <textarea
              name="customer_description"
              id="customer_description"
              value={formData.customer_description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
              placeholder="Please enter customer description"
            ></textarea>
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
        {/* Response Message */}
        <AnimatePresence>
          {responseMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 text-sm bg-green-500 text-white px-4 py-2 rounded-lg shadow-md z-50"
            >
              {responseMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.div>
  );
};

export default Form;
