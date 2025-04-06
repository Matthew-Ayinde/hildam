"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import { FaRegSmile } from "react-icons/fa";

const Form = () => {

  const [formData, setFormData] = useState<{
    order_status: string;
    priority: string;
    clothing_description: string;
    clothing_name: string;
    customer_name: string;
    customer_email: string;
    customer_description: string;
    manager_id: string; // New field for selected project manager
    bust: string;
    waist: string;
    hip: string;
    neck: string;   
    shoulder: string;
    bustpoint: string;
    shoulder_to_underbust: string;
    round_under_bust: string;
    half_length: string;
    blouse_length: string;
    sleeve_length: string;
    round_sleeve: string;
    dress_length: string;
    chest: string;
    round_shoulder: string;
    skirt_length: string;
    trousers_length: string;
    round_thigh: string;
    round_knee: string;
    round_feet: string;
    style_reference_images: File | null; // New field for style reference images
    phone_number: string;

  }>({
    order_status: "",
    priority: "",
    clothing_description: "",
    clothing_name: "",
    customer_name: "",
    customer_description: "",
    customer_email: "",
    manager_id: "", // Initialize with empty string
    bust: "",
    waist: "",
    hip: "",
    neck: "",
    shoulder: "",
    bustpoint: "",
    shoulder_to_underbust: "",
    round_under_bust: "",
    half_length: "",
    blouse_length: "",
    sleeve_length: "",
    round_sleeve: "",
    dress_length: "",
    chest: "",
    round_shoulder: "",
    skirt_length: "",
    trousers_length: "",
    round_thigh: "",
    round_knee: "",
    round_feet: "",
    style_reference_images: null,
    phone_number: "", // Initialize with empty string
   // Initialize with empty string
  });

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

  useEffect(() => {
    const fetchProjectManagers = async () => {
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

    fetchProjectManagers();
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

    const session = await getSession(); // Get session from NextAuth
    const accessToken = session?.user?.token; // Access token from session
    if (!accessToken) {
      throw new Error("No token found, please log in.");
    }


    if (!accessToken) {
      alert("No access token found! Please login first.");
      setIsSubmitting(false);
      return;
    }

    const payload = new FormData();
    payload.append("customer_name", formData.customer_name);
    payload.append("customer_description", formData.customer_description);
    payload.append("customer_email", formData.customer_email);
    payload.append("clothing_name", formData.clothing_name?.toString() || "");
    payload.append("hips", formData.hip);
    payload.append("bust", formData.bust);
    payload.append("waist", formData.waist);
    if (formData.style_reference_images) {
      payload.append("style_reference_images", formData.style_reference_images);
    }
    payload.append(
      "clothing_description",
      formData.clothing_description?.toString() || ""
    );
    payload.append("order_status", formData.order_status?.toString() || "");
    payload.append("priority", formData.priority?.toString() || "");
    payload.append("neck", formData.neck);
    payload.append("manager_id", formData.manager_id); // Include selected manager ID

    if (formData.style_reference_images) {
      payload.append("style_reference_images", formData.style_reference_images);
    }
    
    payload.append(
      "clothing_description",
      formData.clothing_description?.toString() || ""
    );
    payload.append("order_status", formData.order_status?.toString() || "");
    payload.append("priority", formData.priority?.toString() || "");


    payload.append("hip", formData.hip);
payload.append("shoulder", formData.shoulder);
payload.append("bustpoint", formData.bustpoint);
payload.append("shoulder_to_underbust", formData.shoulder_to_underbust);
payload.append("round_under_bust", formData.round_under_bust);
payload.append("half_length", formData.half_length);
payload.append("blouse_length", formData.blouse_length);
payload.append("sleeve_length", formData.sleeve_length);
payload.append("round_sleeve", formData.round_sleeve);
payload.append("dress_length", formData.dress_length);
payload.append("chest", formData.chest);
payload.append("round_shoulder", formData.round_shoulder);
payload.append("skirt_length", formData.skirt_length);
payload.append("trousers_length", formData.trousers_length);
payload.append("round_thigh", formData.round_thigh);
payload.append("round_knee", formData.round_knee);
payload.append("round_feet", formData.round_feet); // Handles 'tread' case


    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/createorder`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: payload,
        }
      );

      if (response.ok) {
        setResponseMessage("Order created successfully");
        setFormData({
          order_status: "",
          customer_description: "",
          priority: "",
          clothing_description: "",
          clothing_name: "",
          customer_name: "",
          gender: "",
          age: "",
          phone_number: "",
          customer_email: "",
          address: "",
          description: "",
          photo: null,
          bust: "",
          waist: "",
          style_reference_images: null,
          hips: "",
          shoulderWidth: "",
          neck: "",
          armLength: "",
          backLength: "",
          frontLength: "",
          highBust: "",
          manager_id: "", // Reset manager ID
        });
        setImagePreview(null); // Reset image preview

        // Automatically hide response message after 5 seconds
        setTimeout(() => {
          setResponseMessage(null);
        }, 5000);
      } else {
        const error = await response.json();
        alert(`Failed to create order: ${error.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }

    //redirect to orders page
    setTimeout(() => {
      window.location.href = "/admin/orders";
    }, 100);
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen bg-gray-100 flex justify-center items-center p-4"
  >
    {popupMessage && (
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white bg-red-500 shadow-lg">
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
            placeholder="Enter your name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
          />
        </div>
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
            placeholder="Enter your email"
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
        <h3 className="block text-xl font-medium text-gray-700 mt-10 mb-4">
          Measurements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: "bust", label: "Bust" },
            { id: "waist", label: "Waist" },
            { id: "hips", label: "Hips" },
            { id: "neck", label: "Neck" },
            { id: "hip", label: "Hip" },
            { id: "shoulder", label: "Shoulder" },
            { id: "bustpoint", label: "Bust Point" },
            { id: "shoulder_to_underbust", label: "Shoulder to Underbust" },
            { id: "round_under_bust", label: "Round Under Bust" },
            { id: "half_length", label: "Half Length" },
            { id: "blouse_length", label: "Blouse Length" },
            { id: "sleeve_length", label: "Sleeve Length" },
            { id: "round_sleeve", label: "Round Sleeve" },
            { id: "dress_length", label: "Dress Length" },
            { id: "chest", label: "Chest" },
            { id: "round_shoulder", label: "Round Shoulder" },
            { id: "skirt_length", label: "Skirt Length" },
            { id: "trousers_length", label: "Trousers Length" },
            { id: "round_thigh", label: "Round Thigh" },
            { id: "round_knee", label: "Round Knee" },
            { id: "round_feet", label: "Round Feet" }
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
                type={id === "round_feet" ? "text" : "number"}
                value={formData[id]}
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
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {responseMessage}
        </div>
      )}
    </form>
  </motion.div>
  );
};

export default Form;
