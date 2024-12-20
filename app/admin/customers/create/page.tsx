"use client";

import React, { useState } from "react";
import { MdOutlineHideSource, MdOutlineRemoveRedEye } from "react-icons/md";

const Form = () => {
  const [formData, setFormData] = useState<{
    name: string;
    gender: string;
    age: string;
    phone: string;
    password: string;
    email: string;
    address: string;
    description: string;
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
    name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    bust: "",
    waist: "",
    hips: "",
    shoulderWidth: "",
    neck: "",
    armLength: "",
    backLength: "",
    frontLength: "",
    highBust: "",
    password: ""
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
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        throw new Error("Access token not found in session storage.");
      }

      console.log(JSON.stringify({
        name: formData.name,
        gender: formData.gender,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        age: formData.age,
      }));

      const response = await fetch("/api/addcustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          email: formData.email,
          phone_number: formData.phone,
          password: formData.password,
          age: formData.age,
        }),
      });

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
  };

  {console.log(responseMessage)}


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        <div className="font-bold text-gray-500 text-xl my-3">
          Customer Information
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
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Enter your Gender"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          
        </div>

        
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="string"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
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

        {/* <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            />
          </div>
        </div> */}

        <div className="mt-6">
          <button
            type="submit"
            className={`w-fit px-4 bg-[#ff6c2f] text-white rounded-md py-2 text-sm font-medium ${
              loading ? "cursor-not-allowed opacity-50" : "hover:bg-orange-600"
            } focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Create Customer"}
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
