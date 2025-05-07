"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import { FaRegSmile } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Dummy customer data
const dummyCustomers = [
  { id: 1, name: "Gabriel Babatunde", email: "gabriel@gmail.com", age: "30" },
  { id: 2, name: "Chi chi", email: "chioma@yahoo.com", age: "25" },
  { id: 3, name: "Alice Johnson", email: "alice@site.com", age: "28" },
  { id: 4, name: "Bob Brown", email: "bob@web.com", age: "32" },
];


type FormDataType = {
  blouse_length: string;
  bust: string;
  bustpoint: string;
  chest: string;
  clothing_description: string;
  clothing_name: string;
  customer_description: string;
  customer_email: string;
  customer_name: string;
  dress_length: string;
  gender: string;
  half_length: string;
  hip: string;
  manager_id: string;
  neck: string;
  order_status: string;
  phone_number: string;
  priority: string;
  round_shoulder: string;
  round_sleeve: string;
  round_under_bust: string;
  shoulder: string;
  shoulder_to_underbust: string;
  skirt_length: string;
  sleeve_length: string;
  style_reference_images: File | null;
  waist: string;
};

const initialFormData: FormDataType = {
  blouse_length: "",
  bust: "",
  bustpoint: "",
  chest: "",
  clothing_description: "",
  clothing_name: "",
  customer_description: "",
  customer_email: "",
  customer_name: "",
  dress_length: "",
  gender: "",
  half_length: "",
  hip: "",
  manager_id: "",
  neck: "",
  order_status: "",
  phone_number: "",
  priority: "",

  round_shoulder: "",
  round_sleeve: "",
  round_under_bust: "",
  shoulder: "",
  shoulder_to_underbust: "",
  skirt_length: "",
  sleeve_length: "",
  style_reference_images: null,
  waist: ""
};


const Form = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<typeof dummyCustomers>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [managers, setManagers] = useState<
    {
      id: string;
      user_id: string;
      name: string;
    }[]
  >([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const router = useRouter();

    // Close suggestions on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setShowSuggestions(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);
  

  useEffect(() => {
    const fetchHeadOfTailoringList = async () => {
      try {
        setLoadingManagers(true);

        const session = await getSession(); // Get session from NextAuth
        const token = session?.user?.token; // Access token from session
        if (!token) {
          throw new Error("No token found, please log in.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/headoftailoringlist`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.data) {
          throw new Error("Failed to fetch head of tailoring list");
        }

        setManagers(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchHeadOfTailoringList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "customer_name") {
      if (value.trim() === "") {
        setFilteredCustomers([]);
        setShowSuggestions(false);
        return;
      }
      const matches = dummyCustomers.filter(c =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(matches);
      setShowSuggestions(matches.length > 0);
    }
  };

  const handleSelect = (customer: typeof dummyCustomers[0]) => {
    setFormData(prev => ({
      ...prev,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_age: customer.age,
    }));
    setShowSuggestions(false);
  };




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) throw new Error("Authentication required. Please log in.");

      // Build FormData dynamically
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          // Handle file input separately
          if (key === "style_reference_images" && value instanceof File) {
            payload.append(key, value);
          } else if (typeof value === "string") {
            payload.append(key, value);
          }
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/createorder`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order.");
      }

      setResponseMessage("Order created successfully!");
      // setFormData(initialFormData);
      setImagePreview(null);

      // Redirect after a short delay
      // setTimeout(() => router.push("/admin/orders"), 1000);
    } catch (error: any) {
      console.error(error);
      setResponseMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      // Hide response message after 5 seconds
      setTimeout(() => setResponseMessage(null), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 flex justify-center items-center p-4"
    >
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-lg shadow-xl p-8 space-y-8 relative">
        <div className="flex items-center space-x-3">
          <FaRegSmile size={28} className="text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-800">Order Information</h2>
        </div>

        {/* Autocomplete Customer Name */}
        <div className="relative" ref={inputRef}>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <motion.input
            id="customer_name"
            name="customer_name"
            type="text"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="Start typing customer name..."
            autoComplete="off"
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
          />
          {showSuggestions && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredCustomers.map(c => (
                <li
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="font-medium text-gray-800">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Email & Age (auto-filled) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="customer_email"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          <div>
            <label htmlFor="customer_age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="customer_age"
              name="customer_age"
              type="text"
              value={formData.customer_age}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-2"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-fit px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            Submit
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default Form;
