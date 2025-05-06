"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import { FaRegSmile } from "react-icons/fa";
import { useRouter } from "next/navigation";

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "file" && e.target instanceof HTMLInputElement) {
      const file = e.target.files ? e.target.files[0] : null;
      setFormData({ ...formData, [name]: file });
      // Create a URL for the selected image
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setImagePreview(fileURL); // Set the image preview URL
      } else {
        setImagePreview(null); // Reset the preview if no file is selected
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      {popupMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white bg-red-500 shadow-lg">
          {popupMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-xl p-8 space-y-8"
      >
        <div className="flex items-center space-x-3">
          <FaRegSmile size={28} className="text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-800">
            Order Information
          </h2>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
            <label
              htmlFor="customer_email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              id="customer_email"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="Enter customer email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          <div>
            <label
              htmlFor="customer_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              id="customer_name"
              name="customer_name"
              type="text"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          {/* <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            whileHover={{ scale: 1.01 }}
            id="phone_number"
            name="phone_number"
            type="text"
            value={formData.phone_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 11) {
                handleChange({ ...e, target: { ...e.target, value } });
              }
            }}
            placeholder="Enter your phone number"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
          />
        </div> */}

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 text-gray-500 shadow-sm p-2 bg-white focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Manager Dropdown */}
          <div className="">
            <label
              htmlFor="manager_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Head of Tailoring
            </label>
            {loadingManagers ? (
              <div className="text-center text-gray-500 mt-2">Loading...</div>
            ) : (
              <select
                id="manager_id"
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-white focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
              >
                <option value="">Select head of tailoring</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.user_id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="lg:col-span-2">
            <label
              htmlFor="customer_description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer Description
            </label>
            <textarea
              id="customer_description"
              name="customer_description"
              rows={4}
              value={formData.customer_description}
              onChange={handleChange}
              placeholder="Enter customer description"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          <div className="lg:col-span-2">
            <label
              htmlFor="clothing_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cloth Name
            </label>
            <textarea
              id="clothing_name"
              name="clothing_name"
              rows={3}
              value={formData.clothing_name}
              onChange={handleChange}
              placeholder="Enter cloth name"
              className="mt-1 block w-full h-24 rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          <div className="lg:col-span-2">
            <label
              htmlFor="clothing_description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Clothing Description
            </label>
            <textarea
              id="clothing_description"
              name="clothing_description"
              rows={3}
              value={formData.clothing_description}
              onChange={handleChange}
              placeholder="Enter cloth description"
              className="mt-1 block w-full h-24 rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>

          {/* File Input */}
          <div className="lg:col-span-2">
            <label
              htmlFor="style_reference_images"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Style Reference Images
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              id="style_reference_images"
              name="style_reference_images"
              type="file"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected"
                className="mt-2 w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Measurement Fields */}
        <div>
          <div className="lg:flex-row flex flex-col lg:gap-0 gap-3 justify-between my-5 items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Measurement Fields
            </h2>
            <p className="text-sm text-gray-500">
              (For multiple values, please use hyphen, e.g., 2-3-4)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "blouseLength", label: "Blouse Length" },
              { id: "bust", label: "Bust" },
              { id: "bustpoint", label: "Bust Point" },
              { id: "chest", label: "Chest" },
              { id: "dressLength", label: "Dress Length(Long, 3/4, Short)" },
              { id: "halfLength", label: "Half Length" },
              { id: "hip", label: "Hip" },
              { id: "roundShoulder", label: "Round Shoulder" },
              {
                id: "roundSleeve",
                label: "Round Sleeve(Arm, Below Elbow, Wrist)",
              },
              { id: "round_under_bust", label: "Round under Bust" },
              { id: "shoulder", label: "Shoulder" },
              { id: "shoulder_to_underbust", label: "Shoulder to under Bust" },
              {
                id: "sleeve_length",
                label: "Sleeve Length(Long, Quarter, Short)",
              },
              { id: "skirtLength", label: "Skirt Length(Long, 3/4, Short)" },
              { id: "waist", label: "Waist" },
            ].map(({ id, label }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {label}
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  id={id}
                  name={id}
                  type="text"
                  value={(formData[id as keyof FormDataType] ?? "").toString()}
                  onChange={handleChange}
                  placeholder={label}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className="w-fit px-6 py-3 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </motion.button>
        </div>
        {responseMessage && (
          <div className="fixed top-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {responseMessage}
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Form;
