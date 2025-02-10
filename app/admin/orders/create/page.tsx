"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Form = () => {
  const [formData, setFormData] = useState<{
    order_status: string | number | readonly string[] | undefined;
    priority: string | number | readonly string[] | undefined;
    clothing_description: string | number | readonly string[] | undefined;
    clothing_name: string | number | readonly string[] | undefined;
    customer_name: string;
    customer_description: string;
    gender: string;
    age: string;
    phone: string;
    customer_email: string;
    address: string;
    description: string;
    photo: File | null;
    bust: string;
    waist: string;
    style_reference_images: File | null;
    hips: string;
    shoulderWidth: string;
    neck: string;
    armLength: string;
    backLength: string;
    frontLength: string;
    highBust: string;
    manager_id: string; // New field for selected project manager
  }>({
    order_status: "",
    priority: "",
    clothing_description: "",
    customer_description: "",
    clothing_name: "",
    customer_name: "",
    gender: "",
    age: "",
    phone: "",
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
    manager_id: "", // Initialize with empty string
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
        const token = sessionStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch(
          "https://hildam.insightpublicis.com/api/projectmanagerlist",
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
          throw new Error("Failed to fetch project managers");
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

    const accessToken = sessionStorage.getItem("access_token");

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
    payload.append("hips", formData.hips);
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
    payload.append("shoulder_width", formData.shoulderWidth);
    payload.append("neck", formData.neck);
    payload.append("arm_length", formData.armLength);
    payload.append("back_length", formData.backLength);
    payload.append("front_length", formData.frontLength);
    payload.append("high_bust", formData.highBust);
    payload.append("manager_id", formData.manager_id); // Include selected manager ID

    try {
      const response = await fetch(
        "https://hildam.insightpublicis.com/api/createorder",
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
          phone: "",
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
      className="min-h-screen bg-gray-100 flex justify-center"
    >
      {popupMessage && <div>{popupMessage}</div>}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        {/* Name and Gender */}
        <div className="font-bold text-gray-500 text-xl my-3">
          Order Information
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-5 mb-5">
          <div className="">
            <label
              htmlFor="customer_name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="customer_email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="text"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 text-gray-500 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2 bg-white"
            >
              <option value="" disabled className="">
                Select Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="">
            <label
              htmlFor="customer_description"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Description
            </label>
            <textarea
              rows={4}
              id="customer_description"
              name="customer_description"
              value={formData.customer_description}
              onChange={handleChange}
              placeholder="Enter customer description"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="clothing_name"
              className="block text-sm font-medium text-gray-700"
            >
              Cloth Name
            </label>
            <textarea
              rows={3}
              id="clothing_name"
              name="clothing_name"
              value={formData.clothing_name}
              onChange={handleChange}
              placeholder="Cloth Name"
              className="mt-1 block w-full h-24 rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
            />
          </div>
          <div className="">
            <label
              htmlFor="clothing_description"
              className="block text-sm font-medium text-gray-700"
            >
              Clothing Description
            </label>
            <textarea
              id="clothing_description"
              name="clothing_description"
              value={formData.clothing_description}
              onChange={handleChange}
              placeholder="Cloth Description"
              className="mt-1 block w-full h-24 rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
            />
          </div>

          <div className="">
            <label
              htmlFor="style_reference_images"
              className="block text-sm font-medium text-gray-700"
            >
              Style Reference Images
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="file"
              id="style_reference_images"
              name="style_reference_images"
              onChange={handleChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected"
                className="mt-2 w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Project Manager Dropdown */}
          <div className="mb-5">
            <label
              htmlFor="manager_id"
              className="block text-sm font-medium text-gray-700"
            >
              Select Project Manager
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
                className="mt-1 text-gray-500 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2 bg-white"
              >
                <option value="">Select project manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.user_id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Measurement Fields */}
        <div className="block text-xl font-medium text-gray-700 mt-10 mb-4">
          Measurements
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="bust"
              className="block text-sm font-medium text-gray-700"
            >
              Bust
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="bust"
              name="bust"
              value={formData.bust}
              onChange={handleChange}
              placeholder="Bust"
            />
          </div>
          <div>
            <label
              htmlFor="waist"
              className="block text-sm font-medium text-gray-700"
            >
              Waist
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="waist"
              name="waist"
              value={formData.waist}
              onChange={handleChange}
              placeholder="Waist"
            />
          </div>
          <div>
            <label
              htmlFor="hips"
              className="block text-sm font-medium text-gray-700"
            >
              Hips
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="hips"
              name="hips"
              value={formData.hips}
              onChange={handleChange}
              placeholder="Hips"
            />
          </div>
          <div>
            <label
              htmlFor="shoulderWidth"
              className="block text-sm font-medium text-gray-700"
            >
              Shoulder Width
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="shoulderWidth"
              name="shoulderWidth"
              value={formData.shoulderWidth}
              onChange={handleChange}
              placeholder="Shoulder Width"
            />
          </div>
          <div>
            <label
              htmlFor="neck"
              className="block text-sm font-medium text-gray-700"
            >
              Neck
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="neck"
              name="neck"
              value={formData.neck}
              onChange={handleChange}
              placeholder="Neck"
            />
          </div>
          <div>
            <label
              htmlFor="armLength"
              className="block text-sm font-medium text-gray-700"
            >
              Arm Length
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="armLength"
              name="armLength"
              value={formData.armLength}
              onChange={handleChange}
              placeholder="Arm Length"
            />
          </div>
          <div>
            <label
              htmlFor="backLength"
              className="block text-sm font-medium text-gray-700"
            >
              Back Length
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="backLength"
              name="backLength"
              value={formData.backLength}
              onChange={handleChange}
              placeholder="Back Length"
            />
          </div>
          <div>
            <label
              htmlFor="frontLength"
              className="block text-sm font-medium text-gray-700"
            >
              Front Length
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="frontLength"
              name="frontLength"
              value={formData.frontLength}
              onChange={handleChange}
              placeholder="Front Length"
            />
          </div>
          <div>
            <label
              htmlFor="highBust"
              className="block text-sm font-medium text-gray-700"
            >
              High Bust
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              type="number"
              id="highBust"
              name="highBust"
              value={formData.highBust}
              onChange={handleChange}
              placeholder="High Bust"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-fit px-4 bg-[#ff6c2f] text-white rounded-md py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </motion.button>
        </div>
        {responseMessage && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 text-sm bg-green-500 text-white px-3 py-1 w-fit rounded-lg">
            {responseMessage}
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Form;
