"use client";

import React from "react";
import Spinner from "../../../../../components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Next.js Image component
import { IoIosArrowBack } from "react-icons/io";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import Link from "next/link";
import { FaRegCircleXmark } from "react-icons/fa6";
import { motion } from "framer-motion"; // Import Framer Motion
import { CgSearchLoading } from "react-icons/cg";

export default function ShowCustomer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false); // New state to track upload status
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleCustomerImageClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (uploadMessage) {
      setTimeout(() => setUploadMessage(null), 5000);
    }
  }, [uploadMessage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("design_image", selectedImage);

    setIsUploading(true);
    setUploadMessage(null);
    setUploadError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/edittailorjob/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setImagePath(result.data.image_path);
      setUploadMessage("Image uploaded successfully");
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendToProjectManager = async () => {
    if (!imagePath) return;

    setIsSending(true);
    setUploadMessage(null);
    setUploadError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/sendtoprojectmanager/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_path: imagePath }),
      });

      if (!response.ok) {
        throw new Error("Failed to send image to project manager");
      }

      setUploadMessage("Image sent to project manager successfully");
      setSentSuccess(true);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSending(false);
    }

    router.push("/admin/joblists/tailorjoblists");
  };

  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    fullName: string;
    age: number;
    gender: string;
    date: string;
    address: string;
    order_id: string;
    bust: number;
    waist: number;
    hips: number;
    shoulder_width: number;
    neck: number;
    arm_length: number;
    back_length: number;
    front_length: number;
    customer_description: string;
    clothing_name: string;
    clothing_description: string;
    high_bust: number;
    tailor_image?: string;
    project_manager_approval?: string;
    style_reference_images?: string;
    customer_approval: string;
    customer_feedback: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`${baseUrl}/tailorjoblists/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();
      console.log("customer details: ", result);

      if (result.data) {
        const mappedCustomer: Customer = {
          fullName: result.data.customer_name,
          age: result.data.age,
          gender: result.data.gender,
          date: new Date().toLocaleDateString(),
          order_id: result.data.order_id,
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hips: result.data.hips || 0,
          shoulder_width: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          arm_length: result.data.arm_length || 0,
          back_length: result.data.back_length || 0,
          front_length: result.data.front_length || 0,
          customer_description: result.data.customer_description || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          clothing_description: result.data.clothing_description || "N/A",
          high_bust: result.data.high_bust || 0,
          tailor_image: result.data.tailor_image || null,
          project_manager_approval: result.data.project_manager_approval || null,
          customer_feedback: result.data.customer_feedback,
          style_reference_images: result.data.style_reference_images || null,
          customer_approval: result.data.customer_approval,
        };
        setCustomer(mappedCustomer);
      } else {
        setCustomer(null);
      }
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

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error}{" "}
        <button onClick={fetchCustomer} className="text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  console.log("customer approval", customer.project_manager_approval);

  return (
    <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">
      {/* Toast Notification */}
      {(uploadMessage || uploadError) && (
        <motion.div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`p-2 w-fit px-4 rounded mb-4 text-center 
      ${uploadMessage ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {uploadMessage || uploadError}
          </div>
        </motion.div>
      )}

      <motion.div
        className="flex items-center justify-between mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/admin/joblists/tailorjoblists"
          className="hover:text-orange-700 text-orange-500 flex flex-row items-center mb-2"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </Link>
      </motion.div>
      <form>
        <motion.div
          className="text-2xl text-gray-700 font-bold mb-2"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          Tailor Job Information
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          {[
            { label: "Order ID", value: customer.order_id },
            { label: "Order Date", value: customer.date },
            { label: "Customer Name", value: customer.fullName },
            { label: "Gender", value: customer.gender },
          ].map((field, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <label className="block text-gray-700 font-bold">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                readOnly
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label className="block text-gray-700 font-bold">Cloth Name</label>
            <textarea
              name="clothing_name"
              value={customer.clothing_name}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label className="block text-gray-700 font-bold">
              Clothing Description
            </label>
            <textarea
              name="clothing_description"
              value={customer.clothing_description}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
              <label className="block text-gray-700 font-bold">
                Customer Style
              </label>
              <img
                src={customer.style_reference_images}
                alt="style_reference_images"
                className="border w-24 h-24 border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50 cursor-pointer"
                onClick={handleCustomerImageClick} // Open modal on click
              />
              <div className="text-sm my-2">Click to view</div>
              {isCustomerModalOpen && (
                <div
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={handleCustomerCloseModal}
                >
                  <div
                    className="bg-white rounded-lg p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={customer.style_reference_images}
                      alt="Style Reference"
                      className="w-[400px] h-[400px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = ""; // Clear the image source
                        e.currentTarget.alt = "Image failed to load"; // Update alt text
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="w-full"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="block text-xl font-bold text-gray-700 mt-10 mb-4">
            Measurements
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Bust", value: customer.bust, id: "bust" },
              { label: "Waist", value: customer.waist, id: "waist" },
              { label: "Hips", value: customer.hips, id: "hips" },
              {
                label: "Shoulder Width",
                value: customer.shoulder_width,
                id: "shoulder_width",
              },
              { label: "Neck", value: customer.neck, id: "neck" },
              {
                label: "Arm Length",
                value: customer.arm_length,
                id: "arm_length",
              },
              {
                label: "Back Length",
                value: customer.back_length,
                id: "back_length",
              },
              {
                label: "Front Length",
                value: customer.front_length,
                id: "front_length",
              },
              { label: "High Bust", value: customer.high_bust, id: "highBust" },
            ].map((measurement, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <label
                  htmlFor={measurement.id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {measurement.label}
                </label>
                <input
                  type="number"
                  readOnly
                  id={measurement.id}
                  name={measurement.id}
                  value={measurement.value}
                  placeholder={measurement.label}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </form>

      <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">
        <motion.div
          className="font-bold text-xl mt-5 text-gray-700"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Image Style
        </motion.div>

        {customer.project_manager_approval && (
          <motion.div
            className="flex items-center mt-4"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {customer.tailor_image && (
              <div className="mr-4">
                <Image
                  src={customer.tailor_image}
                  alt="Tailor"
                  width={100}
                  height={100}
                  className="rounded"
                />
              </div>
            )}
            {customer.project_manager_approval === "In Review" && (
              <>
    <span className="text-gray-700 font-bold">
    <CgSearchLoading size={20}/>

    </span>
                <span className="ml-2 text-gray-700 font-bold">
                  Style under review
                </span>
              </>
            )}
            {customer.project_manager_approval === "Approved" && (
              <>
                <FaCheckCircle className="text-green-500 text-3xl" />
                <span className="ml-2 text-green-500 font-semibold">
                  Style accepted
                </span>
              </>
            )}
            {customer.project_manager_approval === "Rejected" && (
              <>
                <FaRegCircleXmark className="text-red-500 text-3xl" />
                <span className="ml-2 text-red-500 font-semibold">
                  Style rejected
                </span>
              </>
            )}
          </motion.div>
        )}

        {customer.customer_feedback !== null && customer.project_manager_approval === "Rejected" && (
            <motion.div
              className="mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <div>
                <div className="font-bold text-lg">Feedback</div>
              <div>
                {customer.customer_feedback}
              </div>
              </div>
            </motion.div>
          )}

        {/* Upload Image Section */}
        {customer.project_manager_approval !== "Approved" && (
          <motion.div
            className="mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <label className="block text-gray-700 font-normal mb-2">
              {customer.tailor_image === null ? (
                <div>Please upload an Image</div>
              ) : (
                <div className="mt-2 font-bold">Edit Image</div>
              )}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded w-full"
            />
          </motion.div>
        )}

        {imagePreview && (
          <motion.div
            className="mb-4 flex flex-col items-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <img
              src={imagePreview}
              alt="Selected"
              className="w-[200px] h-[200px] object-cover rounded border"
            />
            <button
              onClick={handleRemoveImage}
              className="mt-2 text-red-500 hover:text-red-700 text-sm font-semibold"
            >
              Remove Image
            </button>
          </motion.div>
        )}

        {/* Upload Button */}
        {selectedImage && !imagePath && (
          <motion.button
            onClick={handleUploadImage}
            disabled={isUploading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              isUploading ? "bg-gray-100" : "bg-orange-500 hover:bg-orange-600"
            }`}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            {isUploading ? <Spinner /> : "Upload Image"}
          </motion.button>
        )}

        {/* Send to Project Manager Button */}
        {imagePath && !sentSuccess && (
          <motion.button
            onClick={handleSendToProjectManager}
            disabled={isSending}
            className={`w-full py-2 rounded text-white font-semibold transition mt-4 ${
              isSending ? "bg-gray-100" : "bg-green-500 hover:bg-green-600"
            }`}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            {isSending ? <Spinner /> : "Send to Project Manager"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
