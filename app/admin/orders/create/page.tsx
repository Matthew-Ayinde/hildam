"use client";

import React, { useEffect, useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState<{
    order_status: string | number | readonly string[] | undefined;
    priority: string | number | readonly string[] | undefined;
    clothing_description: string | number | readonly string[] | undefined;
    clothing_name: string | number | readonly string[] | undefined;
    customer_name: string;
    gender: string;
    age: string;
    phone: string;
    customer_email: string;
    address: string;
    description: string;
    photo: File | null;
    bust: string;
    waist: string;
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

  useEffect(() => {
    const fetchProjectManagers = async () => {
      try {
        setLoadingManagers(true);
        const token = sessionStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch("/api/projectmanagerlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

    const payload = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      clothing_name: formData.clothing_name,
      hips: formData.hips,
      bust: formData.bust,
      waist: formData.waist,
      clothing_description: formData.clothing_description,
      order_status: formData.order_status,
      priority: formData.priority,
      shoulder_width: formData.shoulderWidth,
      neck: formData.neck,
      arm_length: formData.armLength,
      back_length: formData.backLength,
      front_length: formData.frontLength,
      high_bust: formData.highBust,
      manager_id: formData.manager_id, // Include selected manager ID
    };

    try {
      const response = await fetch("/api/createorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setResponseMessage("Order created successfully");
        setFormData({
          order_status: "",
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
          hips: "",
          shoulderWidth: "",
          neck: "",
          armLength: "",
          backLength: "",
          frontLength: "",
          highBust: "",
          manager_id: "", // Reset manager ID
        });

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
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
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
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="customer_email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
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
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2 bg-white"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="">
            <label
              htmlFor="order_status"
              className="block text-sm font-medium text-gray-700"
            >
              Order Status
            </label>
            <select
              id="order_status"
              name="order_status"
              value={formData.order_status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2 bg-white"
              required
            >
              <option value="" disabled>
                Select Order Status
              </option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
        {/* Project Manager Dropdown */}
        <div className="mb-5">
          <label
            htmlFor="manager_id"
            className="block text-sm font-medium text-gray-700"
          >
            Select Project Manager (Optional)
          </label>
          {loadingManagers ? (
            <div className="text-center text-gray-500 mt-2">Loading...</div>
          ) : (
            <select
              id="manager_id"
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2 bg-white"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          <div className="">
            <label
              htmlFor="clothing_name"
              className="block text-sm font-medium text-gray-700"
            >
              Cloth Name
            </label>
            <textarea
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
              htmlFor="description"
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
        </div>

        {/* Measurement Fields */}
        <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">
          Measurements
        </div>
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <div className="w-1/3">
              <label
                htmlFor="bust"
                className="block text-sm font-medium text-gray-700"
              >
                Bust
              </label>
              <input
                type="number"
                id="bust"
                name="bust"
                value={formData.bust}
                onChange={handleChange}
                placeholder="Bust"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div className="w-1/3">
              <label
                htmlFor="waist"
                className="block text-sm font-medium text-gray-700"
              >
                Waist
              </label>
              <input
                type="number"
                id="waist"
                name="waist"
                value={formData.waist}
                onChange={handleChange}
                placeholder="Waist"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div className="w-1/3">
              <label
                htmlFor="hips"
                className="block text-sm font-medium text-gray-700"
              >
                Hips
              </label>
              <input
                type="number"
                id="hips"
                name="hips"
                value={formData.hips}
                onChange={handleChange}
                placeholder="Hips"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/3">
              <label
                htmlFor="shoulderWidth"
                className="block text-sm font-medium text-gray-700"
              >
                Shoulder Width
              </label>
              <input
                type="number"
                id="shoulderWidth"
                name="shoulderWidth"
                value={formData.shoulderWidth}
                onChange={handleChange}
                placeholder="Shoulder Width"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div className="w-1/3">
              <label
                htmlFor="neck"
                className="block text-sm font-medium text-gray-700"
              >
                Neck
              </label>
              <input
                type="number"
                id="neck"
                name="neck"
                value={formData.neck}
                onChange={handleChange}
                placeholder="Neck"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div className="w-1/3">
              <label
                htmlFor="armLength"
                className="block text-sm font-medium text-gray-700"
              >
                Arm Length
              </label>
              <input
                type="number"
                id="armLength"
                name="armLength"
                value={formData.armLength}
                onChange={handleChange}
                placeholder="Arm Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/3">
              <label
                htmlFor="backLength"
                className="block text-sm font-medium text-gray-700"
              >
                Back Length
              </label>
              <input
                type="number"
                id="backLength"
                name="backLength"
                value={formData.backLength}
                onChange={handleChange}
                placeholder="Back Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div className="w-1/3">
              <label
                htmlFor="frontLength"
                className="block text-sm font-medium text-gray-700"
              >
                Front Length
              </label>
              <input
                type="number"
                id="frontLength"
                name="frontLength"
                value={formData.frontLength}
                onChange={handleChange}
                placeholder="Front Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div className="w-1/3">
              <label
                htmlFor="highBust"
                className="block text-sm font-medium text-gray-700"
              >
                High Bust
              </label>
              <input
                type="number"
                id="highBust"
                name="highBust"
                value={formData.highBust}
                onChange={handleChange}
                placeholder="High Bust"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
          </div>
        </div>

        {/* Photo Upload */}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-fit px-4 bg-[#ff6c2f] text-white rounded-md py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </button>
        </div>
        {responseMessage && (
          <div className="mt-4 text-sm bg-green-500 text-white px-3 py-1 w-fit rounded-lg">
            {responseMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;