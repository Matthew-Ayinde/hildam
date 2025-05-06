"use client";

import SkeletonLoader from "@/components/SkeletonLoader"
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import { motion } from "framer-motion";
import Link from "next/link";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = useParams();

  interface Customer {
    name: string;
    age: string;
    phone_number: string;
    email: string;
    gender: string;
    bust: number;
    shoulder_to_underbust: number;
    round_under_bust: number;
    sleeve_length: number;
    half_length: number;
    blouse_length: number;
    round_sleeve: number;
    dress_length: number;
    chest: number;
    round_shoulder: number;
    skirt_length: number;
    trousers_length: number;
    round_thigh: number;
    round_knee: number;
    round_feet: number;
    hip: number;
    shoulder_width: number;
    bustpoint: number;
    waist: number;
    shoulder: number;
    address: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone_number: "",
    email: "",
    bust: "",
    gender: "",
    shoulder_to_underbust: "",
    round_under_bust: "",
    sleeve_length: "",
    half_length: "",
    blouse_length: "",
    round_sleeve: "",
    dress_length: "",
    chest: "",
    round_shoulder: "",
    skirt_length: "",
    trousers_length: "",
    round_thigh: "",
    round_knee: "",
    round_feet: "",
    hip: "",
    shoulder: "",
    bustpoint: "",
    waist: "",
    address: "",
  });

  const fetchCustomer = async () => {
    setLoading(true);
    setError("");

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/customerslist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();
      setCustomer(result.data);
      setFormData({
        name: result.data.name,
        age: result.data.age,
        phone_number: result.data.phone_number,
        gender: result.data.gender,
        email: result.data.email,
        bust: result.data.bust,
        shoulder_to_underbust: result.data.shoulder_to_underbust,
        round_under_bust: result.data.round_under_bust,
        sleeve_length: result.data.sleeve_length,
        half_length: result.data.half_length,
        blouse_length: result.data.blouse_length,
        round_sleeve: result.data.round_sleeve,
        dress_length: result.data.dress_length,
        chest: result.data.chest,
        round_shoulder: result.data.round_shoulder,
        skirt_length: result.data.skirt_length,
        trousers_length: result.data.trousers_length,
        round_thigh: result.data.round_thigh,
        round_knee: result.data.round_knee,
        round_feet: result.data.round_feet,
        hip: result.data.hip,
        shoulder: result.data.shoulder,
        bustpoint: result.data.bust,
        waist: result.data.waist,
        address: result.data.address,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editcustomer/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }

      router.push(`/admin/customers/${id}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error}
        <button onClick={fetchCustomer} className="text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  const measurements = [
    { label: "Blouse Length", key: "blouse_length" },
    { label: "Bust", key: "bust" },
    { label: "Bust Point", key: "bustpoint" },
    { label: "Chest", key: "chest" },
    { label: "Dress Length(Long, 3/4, Short)", key: "dress_length" },
    { label: "Half Length", key: "half_length" },
    { label: "Hip", key: "hip" },
    { label: "Round Shoulder", key: "round_shoulder" },
    { label: "Round Sleeve(Arm, Below Elbow, Wrist)", key: "round_sleeve" },
    { label: "Round Under Bust", key: "round_under_bust" },
    { label: "Shoulder", key: "shoulder" },
    { label: "Shoulder to Underbust", key: "shoulder_to_underbust" },
    { label: "Skirt Length(Long, 3/4, Short)", key: "skirt_length" },
    { label: "Sleeve Length(Long, Quarter, Short)", key: "sleeve_length" },
    { label: "Waist", key: "waist" },
  ];
  

  return (
    <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="w-full mx-auto p-8 bg-white rounded-2xl shadow-lg"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Edit Customer Information
    </h2>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-bold mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg p-3 focus:border-orange-500 focus:ring focus:ring-orange-200 transition duration-200"
          />
        </div>
        {/* Age */}
        <div>
          <label className="block text-gray-700 font-bold mb-1">
            Age
          </label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="Enter age"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg p-3 focus:border-orange-500 focus:ring focus:ring-orange-200 transition duration-200"
          />
        </div>
        {/* Gender */}
        <div>
          <label className="block text-gray-700 font-bold mb-1">
            Gender
          </label>
          <select
            name="gender"
            onChange={handleInputChange}
            value={formData.gender || ""}
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg p-3 focus:border-orange-500 focus:ring focus:ring-orange-200 transition duration-200"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Phone Number */}
        <div>
          <label className="block text-gray-700 font-bold mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData?.phone_number || ""}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg p-3 focus:border-orange-500 focus:ring focus:ring-orange-200 transition duration-200"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-gray-700 font-bold mb-1">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            readOnly
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg p-3 "
          />
        </div>
      </div>

      <div className="mt-3">
          <label className="block text-gray-700 font-bold mb-1">
            Address
          </label>
          <textarea
            rows={2} 
            name="address"
            value={formData.address}
            readOnly
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg p-3 "
          />
        </div>

      {/* Measurements Section */}
      <div className="mt-10">
        <h3 className="block text-2xl font-bold text-gray-800 mb-3">
          Measurements
        </h3>
        <div className="mb-4">
          <div className="flex flex-wrap -mx-2">
            {measurements.map((measurement) => (
              <motion.div
                key={measurement.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label className="block text-gray-700 font-bold mb-1">
                  {measurement.label}
                </label>
                <input
                  type="text"
                  name={measurement.key}
                  value={formData[measurement.key as keyof typeof formData] || ""}
                  onChange={handleInputChange}
                  placeholder={measurement.label}
                  className="w-full border border-gray-300 text-gray-700 text-sm rounded-lg p-3 focus:border-orange-500 focus:ring focus:ring-orange-200 transition duration-200"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="submit"
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg transition duration-200 hover:bg-orange-600"
        >
          Save Changes
        </button>
        <Link
          href={`/admin/customers/${id}`}
          className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg transition duration-200 hover:bg-gray-600"
        >
          Back
        </Link>
      </div>
    </form>
  </motion.div>
  );
}
