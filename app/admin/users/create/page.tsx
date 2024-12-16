"use client";

import React, { useState } from "react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineHideSource } from "react-icons/md";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    role: string;
    email: string;
    password: string;
  }>({
    name: "",
    role: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      alert("No access token found! Please login first.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: parseInt(formData.role, 10),
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setPopupMessage("User created successfully");
        setFormData({
          name: "",
          role: "",
          email: "",
          password: "",
        });

        // Automatically hide popup message after 5 seconds
        setTimeout(() => {
          setPopupMessage("");
        }, 5000);
      } else {
        const error = await response.json();
        alert(`Failed to create user: ${error.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[400px] bg-gray-100 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        {/* Popup Message */}
        {popupMessage && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg">
            {popupMessage}
          </div>
        )}

        {/* Name and role */}
        <div className="font-bold text-gray-500 text-xl my-3">
          User Information
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
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
          <div className="w-1/2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            >
              <option value="">Select Role</option>
              <option value="1">Admin</option>
              <option value="2">Client Manager</option>
              <option value="3">Project Manager</option>
              <option value="4">Store Manager</option>
              <option value="5">Head of Tailoring</option>
            </select>
          </div>
        </div>

        {/* Email */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
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
              placeholder="Enter your e-mail"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>

          <div className="w-1/2 relative">
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
              onChange={handleChange}
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
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-fit px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 ${
              isSubmitting
                ? "bg-[#ff6c2f] cursor-not-allowed"
                : "bg-[#ff6c2f] text-white hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin h-3 w-3 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <div className="text-white">Submitting...</div>
              </span>
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
