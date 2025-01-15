"use client";

import React, { useState } from "react";

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
    style_reference_images: File | null;
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
    style_reference_images: null,
    bust: "",
    waist: "",
    hips: "",
    shoulderWidth: "",
    neck: "",
    armLength: "",
    backLength: "",
    frontLength: "",
    highBust: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, style_reference_images: file });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData({ ...formData, style_reference_images: file });
    }
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

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
      style_reference_images: formData.style_reference_images,
    };

    try {
      const response = await fetch("/api/addorders", {
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
          style_reference_images: null,
          bust: "",
          waist: "",
          hips: "",
          shoulderWidth: "",
          neck: "",
          armLength: "",
          backLength: "",
          frontLength: "",
          highBust: "",
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
        <div className="flex space-x-4 mb-4">
        </div>
        
        <div className="flex flex-row space-x-4 mb-5">
          
        </div>

        <div className="w-full grid grid-cols-2 space-x-4">
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="">
            <label
              htmlFor="style_reference_images"
              className="block text-sm font-medium text-gray-700"
            >
              Style Reference Images
            </label>
            <input
              type="file"
              id="style_reference_images"
              name="style_reference_images"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
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

        {/* 
        
        Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-fit px-4 bg-[#ff6c2f] text-white rounded-md py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            Create Order
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
