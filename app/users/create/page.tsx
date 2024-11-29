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
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-md p-6"
      >
        {/* Name and Gender */}
      <div className="font-bold text-gray-500 text-xl my-3">User Information</div>
        
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
          <div className="w-1/2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full text-gray-700 rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              required
            >
              <option value="">Select Role</option>
              <option value="male">Account Manager</option>
              <option value="female">Project Manager</option>
              <option value="designer">Designer</option>
              <option value="other">Operations</option>
            </select>
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
          <div className="w-1/2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
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
        </div>

        {/* Email and Address */}
        <div className="flex space-x-4 mb-4">
          <div className="w-1/2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description about the customer"
            className="mt-1 block w-full h-24 rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
          />
        </div>

        {/* Measurement Fields */}
        <div className="mb-4">
          <div className="flex space-x-4 mb-4">
            <div className="w-1/3">
              <label htmlFor="bust" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="waist" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="hips" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="neck" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="armLength" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="highBust" className="block text-sm font-medium text-gray-700">
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
        <div className="block text-xl font-medium text-gray-700 mt-14">Measurements</div>
        <div
          className={`flex justify-center items-center border-2 border-dashed p-4 rounded-md ${
            dragging ? "border-[#ff6c2f] bg-green-100" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="photo"
            className="text-sm text-gray-600 hover:text-[#ff6c2f] p-20 cursor-pointer"
          >
            {formData.photo ? formData.photo.name : "Drag and drop a photo, or click to upload"}
          </label>
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
