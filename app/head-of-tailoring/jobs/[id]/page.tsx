"use client";

import type React from "react";
import Spinner from "@/components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IoIosArrowBack,
  IoMdCloudOutline,
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
} from "react-icons/io";
import {
  FaCheckCircle,
  FaRegCircle,
  FaUserTie,
  FaSearch,
  FaImages,
  FaUpload,
  FaPaperPlane,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { TbRulerMeasure2 } from "react-icons/tb";
import {
  editTailorJob,
  fetchTailorJob,
  SendJobToClientManager,
} from "@/app/api/apiClient";

export default function ShowCustomer() {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedModalImage, setSelectedModalImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [isAssignSectionVisible, setIsAssignSectionVisible] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleCustomerImageClick = (imageUrl: string) => {
    setSelectedModalImage(imageUrl);
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
    setSelectedModalImage("");
  };

  const router = useRouter();
  const { id } = useParams();
  const tailorId = id as string;

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
    formData.append("design_image_path", selectedImage);

    setIsUploading(true);
    setUploadMessage(null);
    setUploadError(null);

    try {
      const result = await editTailorJob(tailorId, formData);
      setUploadMessage("Image uploaded successfully");
      setImagePath(result.design_image_path);
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
      const response = await SendJobToClientManager(tailorId);

      setUploadMessage("Image sent to project manager successfully");
      setSentSuccess(true);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSending(false);
    }

    router.push("/head-of-tailoring/jobs");
  };

  interface StoreRequest {
    items_name: string;
    items_quantities: number;
    requested_color: string;
    status: string;
  }

  interface Customer {
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
    tailor_image: string;
    project_manager_approval?: string;
    style_reference_images?: string[];
    store_requests?: StoreRequest[];
    client_manager_approval: string;
    hip: number;
    shoulder: number;
    bustpoint: number;
    shoulder_to_underbust: number;
    round_under_bust: number;
    half_length: number;
    blouse_length: number;
    sleeve_length: number;
    round_sleeve: number;
    dress_length: number;
    chest: number;
    round_shoulder: number;
    skirt_length: number;
    trousers_length: number;
    round_thigh: number;
    round_knee: number;
    round_feet: number;
    assigned_tailors?: { id: number; name: string; email: string }[];
    client_manager_feedback?: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchTailorJob(tailorId);


      if (result) {
        const mappedCustomer: any = {
          fullName: result.customer.name,
          gender: result.customer.gender,
          date: new Date().toLocaleDateString(),
          order_id: result.tailoring.order_id,
          bust: result.customer.bust || 0,
          waist: result.customer.waist || 0,
          hip: result.customer.hip || 0,
          shoulder_width: result.customer.shoulder_width || 0,
          neck: result.customer.neck || 0,
          arm_length: result.customer.arm_length || 0,
          back_length: result.customer.back_length || 0,
          front_length: result.customer.front_length || 0,
          customer_description: result.customer.customer_description || "N/A",
          clothing_name: result.order.clothing_name || "N/A",
          clothing_description: result.order.clothing_description || "N/A",
          tailor_image: result.tailoring.design_image_path || null,
          client_manager_approval:
            result.tailoring.client_manager_approval || null,
          client_manager_feedback:
            result.tailoring.client_manager_feedback || null,
          style_reference_images: result.order.style_reference_images || [],
          store_requests: result.store_requests || [],
          // client_manager_approval: result.data.client_manager_approval,
          // hip: result.data.hip || 0,
          shoulder: result.customer.shoulder || 0,
          bustpoint: result.customer.bustpoint || 0,
          shoulder_to_underbust: result.customer.shoulder_to_underbust || 0,
          round_under_bust: result.customer.round_under_bust || 0,
          half_length: result.customer.half_length || 0,
          blouse_length: result.customer.blouse_length || 0,
          sleeve_length: result.customer.sleeve_length || 0,
          round_sleeve: result.customer.round_sleeve || 0,
          dress_length: result.customer.dress_length || 0,
          chest: result.customer.chest || 0,
          round_shoulder: result.customer.round_shoulder || 0,
          skirt_length: result.customer.skirt_length || 0,
          // trousers_length: result.data.trousers_length || 0,
          // round_thigh: result.data.round_thigh || 0,
          // round_knee: result.data.round_knee || 0,
          // round_feet: result.data.round_feet || 0,
          // assigned_tailors: result.data.assigned_tailors || [],
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spinner />
          <p className="mt-4 text-gray-600 font-medium">
            Loading customer details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:py-40 py-20 flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-2xl shadow-lg"
        >
          <IoMdCloseCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            This Job could not be found
          </h2>
          <Link href={`/head-of-tailoring`}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="h-60 flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-gray-500 text-xl">No customer data found</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {(uploadMessage || uploadError) && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                uploadMessage
                  ? "bg-green-500/90 text-white border-green-400"
                  : "bg-red-500/90 text-white border-red-400"
              }`}
            >
              <div className="flex items-center gap-3">
                {uploadMessage ? (
                  <IoMdCheckmarkCircle className="text-2xl" />
                ) : (
                  <IoMdCloseCircle className="text-2xl" />
                )}
                <span className="font-medium">
                  {uploadMessage || uploadError}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/head-of-tailoring/jobs"
            className="flex items-center gap-3 text-orange-600 hover:text-orange-700 transition-colors group"
          >
            <div className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
              <IoIosArrowBack size={24} />
            </div>
            <span className="font-semibold text-lg">Back to Jobs</span>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Header Section */}
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FaUserTie className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Tailor Job Information</h1>
                <p className="text-orange-100">Order #{customer.order_id}</p>
              </div>
            </div>
          </motion.div>

          <div className="p-8">
            {/* Basic Information */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <FaUserTie className="text-blue-600" />
                </div>
                Order Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Order ID", value: customer.order_id, icon: "📋" },
                  { label: "Order Date", value: customer.date, icon: "📅" },
                  {
                    label: "Customer Name",
                    value: customer.fullName,
                    icon: "👤",
                  },
                  { label: "Gender", value: customer.gender, icon: "⚧" },
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all"
                    whileHover={{ y: -2 }}
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{field.icon}</div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      {field.label}
                    </label>
                    <p className="text-gray-800 font-medium">{field.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Clothing Details */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <FaImages className="text-purple-600" />
                </div>
                Clothing Details
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                  variants={fadeInUp}
                >
                  <label className="block text-sm font-semibold text-purple-700 mb-2">
                    Cloth Name
                  </label>
                  <p className="text-gray-800 font-medium">
                    {customer.clothing_name}
                  </p>
                </motion.div>
                <motion.div
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
                  whileHover={{ scale: 1.02 }}
                  variants={fadeInUp}
                >
                  <label className="block text-sm font-semibold text-purple-700 mb-2">
                    Clothing Description
                  </label>
                  <p className="text-gray-800 font-medium">
                    {customer.clothing_description}
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Style Reference Images */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <FaImages className="text-green-600" />
                </div>
                Style Reference Images
              </h2>

              {!customer.style_reference_images ||
              customer.style_reference_images.length === 0 ? (
                <motion.div
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border-2 border-dashed border-gray-300 text-center"
                  variants={fadeInUp}
                >
                  <FaImages className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">
                    No style reference images available
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={staggerContainer}
                >
                  {customer.style_reference_images.map((imageUrl, index) => (
                    <motion.div
                      key={index}
                      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      variants={fadeInUp}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleCustomerImageClick(imageUrl)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Style reference ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.svg?height=300&width=300";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full">
                            <FaSearch className="text-gray-800" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white font-medium">
                          Reference {index + 1}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Measurements */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                Measurements
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                  {
                    label: "Shoulder",
                    value: customer.shoulder,
                    unit: "inches",
                  },
                  { label: "Bust", value: customer.bust, unit: "inches" },
                  {
                    label: "Bust Point",
                    value: customer.bustpoint,
                    unit: "inches",
                  },
                  {
                    label: "Shoulder To Underbust",
                    value: customer.shoulder_to_underbust,
                    unit: "inches",
                  },
                  {
                    label: "Round Under Bust",
                    value: customer.round_under_bust,
                    unit: "inches",
                  },
                  { label: "Waist", value: customer.waist, unit: "inches" },
                  {
                    label: "Half Length",
                    value: customer.half_length,
                    unit: "inches",
                  },
                  {
                    label: "Blouse Length",
                    value: customer.blouse_length,
                    unit: "inches",
                  },
                  {
                    label: "Sleeve Length",
                    value: customer.sleeve_length,
                    unit: "inches",
                  },
                  {
                    label: "Round Sleeve",
                    value: customer.round_sleeve,
                    unit: "inches",
                  },
                  {
                    label: "Dress Length",
                    value: customer.dress_length,
                    unit: "inches",
                  },
                  { label: "Hip", value: customer.hip, unit: "inches" },
                  { label: "Chest", value: customer.chest, unit: "inches" },
                  {
                    label: "Round Shoulder",
                    value: customer.round_shoulder,
                    unit: "inches",
                  },
                  {
                    label: "Skirt Length",
                    value: customer.skirt_length,
                    unit: "inches",
                  },
                ].map((measurement, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 hover:shadow-md transition-all"
                    variants={fadeInUp}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <label className="block text-xs font-semibold text-yellow-700 mb-1">
                      {measurement.label}
                    </label>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-gray-800">
                        {measurement.value}
                      </span>
                      <span className="text-xs text-gray-500">
                        {measurement.unit}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image Upload Section */}
            {customer.tailor_image === null && (
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaUpload className="text-blue-600 text-2xl" />
                  </div>
                  <h2 className="ml-4 text-2xl font-bold text-gray-700">
                    Design Upload
                  </h2>
                </div>

                {customer.client_manager_approval !== "accepted" && (
                  <motion.div className="mb-6" variants={fadeInUp}>
                    <label className="block text-gray-700 font-medium mb-4">
                      {customer.tailor_image === null ? (
                        <span className="flex items-center gap-2">
                          <IoMdCloudOutline className="text-xl" />
                          Please upload a design image
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FaUpload className="text-xl" />
                          Edit Design Image
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl bg-white hover:bg-blue-50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:font-medium hover:file:bg-blue-600"
                      />
                    </div>
                  </motion.div>
                )}

                {imagePreview && (
                  <motion.div
                    className="mb-6 flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative group">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Selected design"
                        className="w-64 h-64 object-cover rounded-2xl border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <IoMdCloseCircle className="text-xl" />
                      </button>
                    </div>
                    <p className="mt-3 text-gray-600 font-medium">
                      Design Preview
                    </p>
                  </motion.div>
                )}

                {selectedImage && !imagePath && (
                  <motion.button
                    onClick={handleUploadImage}
                    disabled={isUploading}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      isUploading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isUploading ? { scale: 1.02 } : {}}
                    whileTap={!isUploading ? { scale: 0.98 } : {}}
                  >
                    {isUploading ? (
                      <>
                        <Spinner />
                        Uploading Design...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload Design
                      </>
                    )}
                  </motion.button>
                )}

                {imagePath && !sentSuccess && (
                  <motion.button
                    onClick={handleSendToProjectManager}
                    disabled={isSending}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 mt-4 ${
                      isSending
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isSending ? { scale: 1.02 } : {}}
                    whileTap={!isSending ? { scale: 0.98 } : {}}
                  >
                    {isSending ? (
                      <>
                        <Spinner />
                        Sending to Client Manager...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send to Client Manager
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Existing Image Status */}
            {customer.tailor_image !== null && (
              <motion.div
                className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <FaImages className="text-gray-600 text-2xl" />
                  </div>
                  <h2 className="ml-4 text-2xl font-bold text-gray-700">
                    Design Status
                  </h2>
                </div>

                <div className="flex items-center gap-6 mb-6">
                  <div className="relative group">
                    <Image
                      src={customer.tailor_image}
                      alt="Submitted design"
                      width={120}
                      height={120}
                      className="rounded-2xl border-4 border-white shadow-lg"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    {customer.client_manager_approval === null && (
                      <>
                        <div className="p-3 bg-yellow-100 rounded-full">
                          <IoMdCloseCircle className="text-yellow-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-yellow-600 text-lg">
                            Under Review
                          </h3>
                          <p className="text-gray-600">
                            Your design is being reviewed by the client manager
                          </p>
                        </div>
                      </>
                    )}
                    {customer.client_manager_approval === "approved" && (
                      <>
                        <div className="p-3 bg-green-100 rounded-full">
                          <IoMdCheckmarkCircle className="text-green-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-600 text-lg">
                            Design Approved
                          </h3>
                          <p className="text-gray-600">
                            Great! Your design has been approved
                          </p>
                        </div>
                      </>
                    )}
                    {customer.client_manager_approval === "rejected" && (
                      <>
                        <div className="p-3 bg-red-100 rounded-full">
                          <IoMdCloseCircle className="text-red-600 text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-bold text-red-600 text-lg">
                            Design Rejected
                          </h3>
                          <p className="text-gray-600">
                            Please review the feedback and submit a new design
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                

                {customer.client_manager_approval === "rejected" &&
                  customer.client_manager_feedback && (
                    <motion.div
                      className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
                      variants={fadeInUp}
                    >
                      <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                        <IoMdCloseCircle />
                        Feedback from Client Manager
                      </h4>
                      <p className="text-red-600">
                        {customer.client_manager_feedback}
                      </p>
                    </motion.div>
                  )}

                {customer.client_manager_approval === "accepted" && customer.store_requests && customer.store_requests.length < 1 && (
                  <motion.div
                    className="text-center bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-2xl text-white"
                    variants={fadeInUp}
                  >
                    <IoMdCheckmarkCircle className="text-6xl mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">
                      Ready for Inventory Request
                    </h3>
                    <p className="mb-6 text-green-100">
                      Your design has been approved! You can now request the
                      necessary inventory items.
                    </p>
                    <Link
                      href={`/head-of-tailoring/jobs/${id}/request-inventory`}
                    >
                      <motion.button
                        className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors flex items-center gap-3 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaUpload />
                        Request Inventory
                      </motion.button>
                    </Link>
                  </motion.div>
                )}

                {customer.store_requests && (
                  <div className="mt-8">
                    <h4 className="text-2xl font-semibold text-gray-800 mb-4">
                      Store Requests
                    </h4>
                    <div className="space-y-4">
                      {customer.store_requests.map((req, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-200"
                        >
                          {/* Item Details */}
                          <div className="flex-1 space-y-1">
                            <h5 className="text-lg font-medium text-gray-900">
                              {req.items_name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Quantity:{" "}
                              <span className="font-semibold">
                                {req.items_quantities}
                              </span>
                            </p>
                          </div>

                          {/* Color Swatch */}
                          <div className="flex items-center mt-3 sm:mt-0">
                            <span className="text-sm text-gray-600 mr-2">
                              Color:
                            </span>
                            <span
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: req.requested_color }}
                            />
                          </div>

                          {/* Status Badge */}
                          <div className="mt-3 sm:mt-0">
                            <span
                              className={`
                inline-block px-3 py-1 text-sm font-medium rounded-full
                ${
                  req.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : req.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : req.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }
              `}
                            >
                              {req.status.charAt(0).toUpperCase() +
                                req.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Rejected Design Re-upload */}
            {customer.client_manager_approval === "rejected" && (
              <motion.div
                className="mt-8 bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-3xl border border-red-200"
                variants={fadeInUp}
              >
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-red-100 rounded-full">
                    <FaUpload className="text-red-600 text-2xl" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-700">
                      Submit New Design
                    </h2>
                    <p className="text-gray-600">
                      Please upload a new design that addresses the feedback
                    </p>
                  </div>
                </div>

                <motion.div className="mb-6" variants={fadeInUp}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-4 border-2 border-dashed border-red-300 rounded-xl bg-white hover:bg-red-50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-500 file:text-white file:font-medium hover:file:bg-red-600"
                  />
                </motion.div>

                {imagePreview && (
                  <motion.div
                    className="mb-6 flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="New design"
                        className="w-64 h-64 object-cover rounded-2xl border-4 border-white shadow-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <IoMdCloseCircle className="text-xl" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {selectedImage && !imagePath && (
                  <motion.button
                    onClick={handleUploadImage}
                    disabled={isUploading}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                      isUploading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isUploading ? { scale: 1.02 } : {}}
                    whileTap={!isUploading ? { scale: 0.98 } : {}}
                  >
                    {isUploading ? (
                      <>
                        <Spinner />
                        Uploading New Design...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload New Design
                      </>
                    )}
                  </motion.button>
                )}

                {imagePath && !sentSuccess && (
                  <motion.button
                    onClick={handleSendToProjectManager}
                    disabled={isSending}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 mt-4 ${
                      isSending
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                    }`}
                    whileHover={!isSending ? { scale: 1.02 } : {}}
                    whileTap={!isSending ? { scale: 0.98 } : {}}
                  >
                    {isSending ? (
                      <>
                        <Spinner />
                        Sending to Client Manager...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send to Client Manager
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCustomerCloseModal}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCustomerCloseModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
              >
                <IoMdCloseCircle className="text-2xl" />
              </button>
              <Image
                src={selectedModalImage || "/placeholder.svg"}
                alt="Style Reference"
                width={800}
                height={600}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=600&width=800";
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
