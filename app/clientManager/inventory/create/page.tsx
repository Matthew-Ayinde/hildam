"use client";

import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState<{
    name: string;
    gender: string;
    age: string;
    phone: string;
    email: string;
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
  }>({
    name: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
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
  });

  const [dragging, setDragging] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, photo: file });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };

  return (
    <div className=" bg-gray-100 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        {/* Name and Gender */}
      <div className="font-bold text-gray-500 text-xl my-3">Add Inventory</div>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
          
        </div>

        {/* Age and Phone Number */}
        <div className="flex space-x-4 mb-4">
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
         
        </div>

     
        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-fit px-4 bg-[#ff6c2f] text-white rounded-md py-2 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Create Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
