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
  fetchGroupedStoreRequests,
  SendJobToClientManager,
} from "@/app/api/apiClient";
import AssignedTailorsSection from "./AssignedTailorsSection";

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
  const [finishedClothFiles, setFinishedClothFiles] = useState<File[]>([]);
  const [finishedClothPreviews, setFinishedClothPreviews] = useState<string[]>([]);
  const [isUploadingCloth, setIsUploadingCloth] = useState(false);
  const [isSendingCloth, setIsSendingCloth] = useState(false);
  const [sendClothConfirmOpen, setSendClothConfirmOpen] = useState(false);
  const [clothUploadMessage, setClothUploadMessage] = useState<string | null>(null);
  const [clothUploadError, setClothUploadError] = useState<string | null>(null);
  const [finishedClothImages, setFinishedClothImages] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [pendingOverwriteFiles, setPendingOverwriteFiles] = useState<File[]>([]);

  const parseFinishedClothImages = (imageData: string | string[] | null): string[] => {
    if (!imageData) return [];
    
    try {
      if (typeof imageData === 'string') {
        // Try to parse as JSON
        const parsed = JSON.parse(imageData);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      return Array.isArray(imageData) ? imageData : [];
    } catch {
      // If not valid JSON, return as array
      return Array.isArray(imageData) ? imageData : imageData ? [imageData] : [];
    }
  };

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
    if (uploadMessage || uploadError) {
      const t = setTimeout(() => {
        setUploadMessage(null);
        setUploadError(null);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [uploadMessage, uploadError]);

  useEffect(() => {
    if (clothUploadMessage || clothUploadError) {
      setTimeout(() => {
        setClothUploadMessage(null);
        setClothUploadError(null);
      }, 5000);
    }
  }, [clothUploadMessage, clothUploadError]);

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
      // Delay navigation so the toast message is visible for 5 seconds
      setTimeout(() => {
        router.push("/client-manager/h-o-t/jobs");
      }, 5000);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClothFilesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFinishedClothUploadLocked) {
      setClothUploadError("Images can no longer be uploaded after sending to the client manager.");
      return;
    }
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    addClothFiles(files);
  };

  const handleClothFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinishedClothUploadLocked) {
      setClothUploadError("Images can no longer be uploaded after sending to the client manager.");
      e.target.value = "";
      return;
    }
    const files = e.target.files ? Array.from(e.target.files) : [];
    addClothFiles(files);
  };

  const addClothFiles = (files: File[]) => {
    if (isFinishedClothUploadLocked) {
      setClothUploadError("Images can no longer be uploaded after sending to the client manager.");
      return;
    }

    // If there are already uploaded images, ask for confirmation to overwrite
    if (finishedClothImages.length > 0 && finishedClothPreviews.length === 0) {
      setPendingOverwriteFiles(files);
      setShowOverwriteConfirm(true);
      return;
    }

    const newFiles = [...finishedClothFiles, ...files];
    setFinishedClothFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFinishedClothPreviews([...finishedClothPreviews, ...newPreviews]);
  };

  const handleConfirmOverwrite = () => {
    // Clear existing images and add new ones
    setFinishedClothImages([]);
    setFinishedClothFiles(pendingOverwriteFiles);
    const newPreviews = pendingOverwriteFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setFinishedClothPreviews(newPreviews);
    setPendingOverwriteFiles([]);
    setShowOverwriteConfirm(false);
  };

  const handleCancelOverwrite = () => {
    setPendingOverwriteFiles([]);
    setShowOverwriteConfirm(false);
  };

  const removeClothFile = (index: number) => {
    const newFiles = finishedClothFiles.filter((_, i) => i !== index);
    const newPreviews = finishedClothPreviews.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(finishedClothPreviews[index]);
    
    setFinishedClothFiles(newFiles);
    setFinishedClothPreviews(newPreviews);
  };

  const handleUploadFinishedCloth = async () => {
    if (isFinishedClothUploadLocked) {
      setClothUploadError("Images can no longer be uploaded after sending to the client manager.");
      return;
    }

    if (finishedClothFiles.length === 0) return;

    const formData = new FormData();
    finishedClothFiles.forEach((file) => {
      formData.append("finished_cloth_image[]", file);
    });

    setIsUploadingCloth(true);
    setClothUploadMessage(null);
    setClothUploadError(null);

    try {
      const result = await editTailorJob(tailorId, formData);
      setClothUploadMessage("Finished cloth images uploaded successfully");
      
      // Parse the response images properly
      const uploadedImages = parseFinishedClothImages(
        result.finished_cloth_image || result.tailoring?.finished_cloth_image
      );
      setFinishedClothImages(uploadedImages);
      setFinishedClothFiles([]);
      setFinishedClothPreviews([]);
    } catch (err) {
      setClothUploadError(
        err instanceof Error ? err.message : "Failed to upload images"
      );
    } finally {
      setIsUploadingCloth(false);
    }
  };

  const removeExistingClothImage = (index: number) => {
    const newImages = finishedClothImages.filter((_, i) => i !== index);
    setFinishedClothImages(newImages);
  };

  const handleSendFinishedClothToClientManager = async () => {
    if (finishedClothImages.length === 0) {
      setClothUploadError("Please upload images before sending");
      return;
    }

    setIsSendingCloth(true);
    setClothUploadMessage(null);
    setClothUploadError(null);

    try {
      await SendJobToClientManager(tailorId);
      setClothUploadMessage("Finished cloth sent to client manager for approval");
      setSentSuccess(true);
      setSendClothConfirmOpen(false);
      // Delay navigation so the toast message is visible for 5 seconds
      setTimeout(() => {
        router.push("/client-manager/h-o-t/jobs");
      }, 5000);
    } catch (err) {
      setClothUploadError(
        err instanceof Error ? err.message : "Failed to send to client manager"
      );
    } finally {
      setIsSendingCloth(false);
    }
  };

  interface StoreRequest {
    id: number;
    items_name: string;
    items_quantities: number | string;
    requested_color: string;
    status: string;
    requested_by_name?: string;
    created_at?: string;
    accepted_at?: string | null;
    rejected_at?: string | null;
    order_id?: string;
  }

  interface Customer {
    fullName: string;
    age: number;
    gender: string;
    date: string;
    address: string;
    order_id: string;
    order_status?: string;
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
    assigned_tailors?: { id: number; name: string; email: string; role: string }[];
    client_manager_feedback?: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStoreRequests, setOrderStoreRequests] = useState<StoreRequest[]>([]);
  const [storeRequestsLoading, setStoreRequestsLoading] = useState(false);
  const [storeRequestsError, setStoreRequestsError] = useState<string | null>(null);
  const isFinishedClothUploadLocked = sentSuccess || customer?.client_manager_approval === "pending";

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchTailorJob(tailorId);


      if (result) {
        const tailorFromApi = result?.tailoring?.tailor;
        const assignedTailors = Array.isArray(tailorFromApi)
          ? tailorFromApi
          : tailorFromApi
          ? [tailorFromApi]
          : [];

        const mappedCustomer: any = {
          fullName: result.customer.name,
          gender: result.customer.gender,
          date: new Date().toLocaleDateString(),
          order_id: result.tailoring.order_id,
          order_status: result.tailoring.order?.order_status || "N/A",
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
          trousers_length: result.customer.trousers_length || 0,
          round_thigh: result.customer.round_thigh || 0,
          round_knee: result.customer.round_knee || 0,
          round_feet: result.customer.round_feet || 0,
          assigned_tailors: assignedTailors.map((tailor: any) => ({
            id: Number(tailor.id),
            name: tailor.name || "N/A",
            email: tailor.email || "N/A",
            role: tailor.role || "tailor",
          })),
          // assigned_tailors: result.data.assigned_tailors || [],
        };
        setCustomer(mappedCustomer);

        // Parse and set finished cloth images from API response
        const finishedImages = parseFinishedClothImages(
          result.tailoring.finished_cloth_image || result.order.finished_cloth_images
        );
        setFinishedClothImages(finishedImages);
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

  useEffect(() => {
    const fetchOrderStoreRequests = async () => {
      if (!customer?.order_id) return;

      setStoreRequestsLoading(true);
      setStoreRequestsError(null);

      try {
        const groupedRequests = await fetchGroupedStoreRequests();
        const requestsForOrder = groupedRequests?.[customer.order_id];
        setOrderStoreRequests(Array.isArray(requestsForOrder) ? requestsForOrder : []);
      } catch (err) {
        setStoreRequestsError(
          err instanceof Error ? err.message : "Unable to fetch store requests"
        );
      } finally {
        setStoreRequestsLoading(false);
      }
    };

    fetchOrderStoreRequests();
  }, [customer?.order_id]);

  const approvedCount = orderStoreRequests.filter(
    (request) => (request.status || "").toLowerCase() === "approved"
  ).length;
  const pendingCount = orderStoreRequests.filter(
    (request) => (request.status || "").toLowerCase() === "pending"
  ).length;

  const formatStoreRequestDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRequestStatusClass = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === "approved") return "bg-emerald-100 text-emerald-700";
    if (normalizedStatus === "rejected") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

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
          <Link href={`/client-manager/h-o-t`}
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
        {(uploadMessage || uploadError || clothUploadMessage || clothUploadError) && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
                uploadMessage || clothUploadMessage
                  ? "bg-green-500/90 text-white border-green-400"
                  : "bg-red-500/90 text-white border-red-400"
              }`}
            >
              <div className="flex items-center gap-3">
                {uploadMessage || clothUploadMessage ? (
                  <IoMdCheckmarkCircle className="text-2xl" />
                ) : (
                  <IoMdCloseCircle className="text-2xl" />
                )}
                <span className="font-medium">
                  {uploadMessage || clothUploadMessage || uploadError || clothUploadError}
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
            href="/client-manager/h-o-t/jobs"
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
                  { label: "Order Status", value: customer.order_status, icon: "✅" },
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
                  {
                    label: "Trousers Length",
                    value: customer.trousers_length,
                    unit: "inches",
                  },
                  {
                    label: "Round Thigh",
                    value: customer.round_thigh,
                    unit: "inches",
                  },
                  {
                    label: "Round Knee",
                    value: customer.round_knee,
                    unit: "inches",
                  },
                  {
                    label: "Round Feet",
                    value: customer.round_feet,
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

            <AssignedTailorsSection
              jobId={tailorId}
              tailors={customer.assigned_tailors || []}
            />

              {/* Section to request inventory */}
              <motion.div variants={fadeInUp} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <FaUpload className="text-emerald-600" />
                  </div>
                  Inventory Request
                </h2>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div>
                      <p className="text-gray-600 mt-1">
                        View current store requests for this order and submit additional items when needed.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-sm font-semibold">
                      Existing Requests: {orderStoreRequests.length}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-sm font-semibold">
                      Approved: {approvedCount}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-sm font-semibold">
                      Pending: {pendingCount}
                    </span>
                  </div>

                  {storeRequestsLoading && (
                    <p className="text-sm text-gray-500 mb-4">Loading store requests...</p>
                  )}

                  {storeRequestsError && (
                    <p className="text-sm text-red-600 mb-4">{storeRequestsError}</p>
                  )}

                  {!storeRequestsLoading && !storeRequestsError && orderStoreRequests.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {orderStoreRequests.map((request) => (
                        <div
                          key={request.id}
                          className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <p className="text-base font-semibold text-gray-900">{request.items_name}</p>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRequestStatusClass(
                                request.status || "pending"
                              )}`}
                            >
                              {(request.status || "pending").charAt(0).toUpperCase() +
                                (request.status || "pending").slice(1)}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                              <span>Order ID</span>
                              <span className="font-medium text-gray-800">{request.order_id || customer.order_id}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Quantity</span>
                              <span className="font-medium text-gray-800">{request.items_quantities}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Requested By</span>
                              <span className="font-medium text-gray-800">{request.requested_by_name || "-"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Color</span>
                              <span className="flex items-center gap-2 font-medium text-gray-800">
                                <span
                                  className="h-4 w-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: request.requested_color || "transparent" }}
                                />
                                {request.requested_color || "-"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Requested At</span>
                              <span className="font-medium text-gray-800">
                                {formatStoreRequestDate(request.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!storeRequestsLoading && !storeRequestsError && orderStoreRequests.length === 0 && (
                    <p className="text-sm text-gray-500 mb-6">No store requests yet for this order.</p>
                  )}

                  <Link href={`/client-manager/h-o-t/jobs/${tailorId}/request-inventory`}>
                    <motion.button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-xl font-bold text-base transition-colors flex items-center gap-3"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <FaUpload />
                      {orderStoreRequests.length > 0 ? "Request More Inventory" : "Request Inventory"}
                    </motion.button>
                  </Link>
                </div>

              </motion.div>

            {/* Finished Cloth Upload Section */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <FaImages className="text-emerald-600" />
                </div>
                Upload Finished Cloth
              </h2>

              <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 md:p-8">
                {/* Drag-Drop Upload Area */}
                <motion.div
                  className={`rounded-2xl border-2 border-dashed transition-all p-8 text-center ${
                      isFinishedClothUploadLocked
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-70"
                        : isDragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleClothFilesDrop}
                  whileHover={{ scale: 1.01 }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isFinishedClothUploadLocked}
                    onChange={handleClothFilesChange}
                    className="hidden"
                    id="cloth-files-input"
                  />
                  <label htmlFor="cloth-files-input" className="cursor-pointer">
                    <FaUpload className="text-4xl text-emerald-500 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      Drag &amp; drop your finished cloth images here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse your files
                    </p>
                    <p className="text-xs text-gray-400">
                      Supported formats: JPG, PNG, GIF, WebP (Multiple files allowed)
                    </p>
                  </label>
                </motion.div>

                {/* Preview Gallery */}
                {(finishedClothPreviews.length > 0 || finishedClothImages.length > 0) && (
                  <motion.div className="mt-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      {finishedClothPreviews.length > 0 ? "Ready to Upload" : "Uploaded Images"} ({finishedClothPreviews.length + finishedClothImages.length})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {/* New previews */}
                      {finishedClothPreviews.map((preview, index) => (
                        <motion.div
                          key={`preview-${index}`}
                          className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removeClothFile(index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                              title="Remove image"
                            >
                              <IoMdCloseCircle className="text-xl" />
                            </button>
                          </div>
                          <span className="absolute top-1 right-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            New
                          </span>
                        </motion.div>
                      ))}

                      {/* Already uploaded images */}
                      {finishedClothImages.map((imageUrl, index) => (
                        <motion.div
                          key={`uploaded-${index}`}
                          className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.05 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <img
                            src={imageUrl}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-24 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                              e.currentTarget.className = "w-full h-24 object-contain bg-gray-100";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleCustomerImageClick(imageUrl)}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                              title="View image"
                            >
                              <FaSearch className="text-xl" />
                            </button>
                            <button
                              onClick={() => removeExistingClothImage(index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                              title="Remove image"
                            >
                              <IoMdCloseCircle className="text-xl" />
                            </button>
                          </div>
                          <span className="absolute top-1 right-1 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ✓
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4">
                  {finishedClothPreviews.length > 0 && !isFinishedClothUploadLocked && (
                    <motion.button
                      onClick={handleUploadFinishedCloth}
                      disabled={isUploadingCloth}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold text-base transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isUploadingCloth ? (
                        <>
                          <Spinner />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          <span>Upload {finishedClothPreviews.length} Image{finishedClothPreviews.length > 1 ? "s" : ""}</span>
                        </>
                      )}
                    </motion.button>
                  )}

                  {finishedClothImages.length > 0 && customer?.client_manager_approval !== "pending" && (
                    <motion.button
                      onClick={() => setSendClothConfirmOpen(true)}
                      disabled={isSendingCloth}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold text-base transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isSendingCloth ? (
                        <>
                          <Spinner />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          <span>Send to Client Manager</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </div>

                {finishedClothImages.length === 0 && finishedClothPreviews.length === 0 && (
                  <p className="text-sm text-gray-500 mt-6 text-center">
                    No images uploaded yet. Upload finished cloth images to proceed.
                  </p>
                )}

                {isFinishedClothUploadLocked && (
                    <div>
                   <p className="mt-6 text-sm font-medium text-amber-700 text-center">
                     Images has been sent to the client manager.
                   </p>
                  </div>
                )}
              </div>
            </motion.div>

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

      {/* Send Confirmation Modal */}
      <AnimatePresence>
        {sendClothConfirmOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSendClothConfirmOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPaperPlane className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Send Finished Cloth?
                </h2>
                <p className="text-gray-600">
                  This will send the finished cloth images to the client manager for approval.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setSendClothConfirmOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl font-bold transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSendingCloth}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSendFinishedClothToClientManager}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSendingCloth}
                >
                  {isSendingCloth ? (
                    <>
                      <Spinner />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overwrite Confirmation Modal */}
      <AnimatePresence>
        {showOverwriteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelOverwrite}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoMdCloseCircle className="text-amber-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Overwrite Existing Images?
                </h2>
                <p className="text-gray-600">
                  You already have {finishedClothImages.length} uploaded image{finishedClothImages.length > 1 ? "s" : ""}. Uploading new images will replace the existing ones.
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Action:</span> {pendingOverwriteFiles.length} new image{pendingOverwriteFiles.length > 1 ? "s" : ""} will be uploaded.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={handleCancelOverwrite}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-xl font-bold transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Keep Existing
                </motion.button>
                <motion.button
                  onClick={handleConfirmOverwrite}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaUpload />
                  <span>Overwrite</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
