"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import {
  IoIosArrowBack,
  IoIosCheckmark,
  IoIosCheckmarkCircleOutline,
  IoIosClose,
  IoIosWarning,
} from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { getSession } from "next-auth/react";
import SkeletonLoader from "@/components/SkeletonLoader";
import Image from "next/image";
import { AiOutlineDownload } from "react-icons/ai";
import { FiUser, FiCalendar, FiPackage, FiEdit3 } from "react-icons/fi";
import { HiOutlineSparkles, HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineRule, MdOutlineClose } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import OrderPageError from "@/components/admin/OrderPageError";
import { fetchOrderById, rejectTailorImage, acceptTailorImage } from "@/app/api/apiClient";
import { ApplicationRoutes } from "@/constants/ApplicationRoutes";

export default function ShowCustomer() {
  const [activeStyleImage, setActiveStyleImage] = useState<string | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { id } = useParams();
  const orderId = id as string;
  const [isTailorJobModalOpen, setIsTailorJobModalOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleOpenStyleModal = (src: string) => {
    setActiveStyleImage(src);
    setIsCustomerModalOpen(true);
  };
  const handleCloseStyleModal = () => {
    setActiveStyleImage(null);
    setIsCustomerModalOpen(false);
  };

  const handleOpenCloseModal = () => setIsCloseModalOpen(true);
  const handleCancelClose = () => setIsCloseModalOpen(false);
  const handleConfirmClose = async () => {
    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) throw new Error("No access token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/closeorder/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to close order");

      router.push(ApplicationRoutes.AdminOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCloseModalOpen(false);
    }
  };

  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    gender: string;
    phone_number: string;
    created_at: string;
    customer_email: string;
    address: string;
    bust: number;
    waist: number;
    hip: number;
    shoulder: number;
    shoulder_to_underbust: number;
    bustpoint: number;
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
    clothing_description: string;
    clothing_name: string;
    style_reference_images: string[];
    tailor_job_image: string;
    order_id: string;
    priority: string;
    order_status: string;
    customer_description: string;
    first_fitting_date: string;
    second_fitting_date: string;
    customer_name: string;
    manager_name: string;
    duration: number;
    style_approval: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [approvePrice, setApprovePrice] = useState("");

  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownload = async () => {
    if (!contentRef.current || !customer) return;
    setIsGeneratingPDF(true);

    try {
      const canvas = await html2canvas(contentRef.current, { useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginX = 40; // Increased from 0 to add horizontal margins
      const marginY = 40;

      const availableWidth = pageWidth - marginX * 2;
      const availableHeight = pageHeight - marginY * 2;
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const finalImgHeight =
        imgHeight > availableHeight ? availableHeight : imgHeight;
      const finalImgWidth =
        imgHeight > availableHeight
          ? (canvas.width * availableHeight) / canvas.height
          : imgWidth;

      const xOffset = marginX + (availableWidth - finalImgWidth) / 2;
      const yOffset = marginY + (availableHeight - finalImgHeight) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        xOffset,
        yOffset,
        finalImgWidth,
        finalImgHeight
      );
      pdf.save(`order-${customer.order_id}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCustomerImageClick = () => {
    if (!isRejectModalOpen && !isApproveModalOpen) {
      setIsCustomerModalOpen(true);
    }
  };

  const handleTailorJobImageClick = () => {
    if (!isRejectModalOpen && !isApproveModalOpen) {
      setIsTailorJobModalOpen(true);
    }
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchOrderById(orderId);

      console.log("Fetched orderssssss data:", result);

      if (result) {
        const mappedCustomer: any = {
          hip: result.customer.hip,
          waist: result.customer.waist,
          bust: result.customer.bust,
          shoulder: result.customer.shoulder,
          bustpoint: result.customer.bustpoint,
          shoulder_to_underbust: result.customer.shoulder_to_underbust,
          round_under_bust: result.customer.round_under_bust,
          half_length: result.customer.half_length,
          blouse_length: result.customer.blouse_length,
          sleeve_length: result.customer.sleeve_length,
          round_sleeve: result.customer.round_sleeve,
          dress_length: result.customer.dress_length,
          chest: result.customer.chest,
          round_shoulder: result.customer.round_shoulder,
          skirt_length: result.customer.skirt_length,
          trousers_length: result.trousers_length,
          round_thigh: result.round_thigh,
          round_knee: result.round_knee,
          round_feet: result.round_feet,
          clothing_description: result.clothing_description,
          clothing_name: result.clothing_name,
          style_reference_images: result.style_reference_images,
          tailor_job_image: result.tailoring.design_image_path,
          order_id: result.order_id,
          priority: result.priority,
          order_status: result.order_status,
          customer_description: result.customer.customer_description,
          created_at: result.created_at,
          first_fitting_date: result.first_fitting_date,
          second_fitting_date: result.second_fitting_date,
          customer_name: result.customer_name,
          customer_email: result.customer.email,
          gender: result.customer.gender,
          phone_number: result.customer.phone_number,
          address: result.address,
          manager_name: result.manager_name,
          duration: result.duration,
          style_approval: result.tailoring.client_manager_approval,
          style_approval_feedback: result.tailoring.client_manager_feedback
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
    fetchOrder();
  }, [id]);

  const handleOpenRejectModal = () => {
    setIsCustomerModalOpen(false);
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    const feedback = {
      client_manager_feedback: rejectFeedback
    }
    try {
      
      const response = await rejectTailorImage(orderId, feedback);
      console.log('reject response', response)


      setIsRejectModalOpen(false);
      setRejectFeedback("");

      setTimeout(() => {
      router.push(ApplicationRoutes.AdminOrders)
      }, 2000);
    } catch (err) {
      console.error(err);
    }

    setIsTailorJobModalOpen(false);
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 3000);
  };

  const handleOpenApproveModal = () => {
    setIsApproveModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    try {

      const response = await acceptTailorImage(orderId)

      console.log('approve res', response)
      setIsApproveModalOpen(false);
      setApprovePrice("");
      router.push(`/admin/orders/${id}/add-job-expense`);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "closed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200";
      case "processing":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200";
      case "medium":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <OrderPageError />
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  return (
    <motion.div
      className="min-h-screen p-4 lg:p-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 bg-white rounded-2xl p-6 shadow-lg border border-orange-100"
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Link
              href="/admin/orders"
              className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-all duration-200 group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                className="p-2 rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors"
              >
                <IoIosArrowBack size={20} />
              </motion.div>
              <span className="font-semibold">Back to Orders</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                <FiPackage className="text-orange-600" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Order #{customer.order_id}
                </h1>
                <p className="text-sm text-gray-600">
                  Order Details & Management
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-sm transition-all duration-200 ${
                isGeneratingPDF
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              }`}
            >
              {isGeneratingPDF ? (
                <Spinner />
              ) : (
                <>
                  <AiOutlineDownload size={18} />
                  <span className="font-medium">Download PDF</span>
                </>
              )}
            </motion.button>

            {customer.order_status !== "closed" ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenCloseModal}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl shadow-sm transition-all duration-200"
              >
                <MdOutlineClose size={18} />
                <span className="font-medium">Close Order</span>
              </motion.button>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 rounded-xl shadow-sm">
                <IoIosCheckmark size={18} />
                <span className="font-medium">Order Closed</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <IoIosCheckmark size={20} />
                <span className="font-medium">
                  Style Rejected Successfully!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div ref={contentRef} className="space-y-8">
          {/* Order Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FiUser className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Order Information
                    </h2>
                    <p className="text-orange-100">
                      Complete order details and customer information
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-sm">Head of Tailoring</p>
                  <p className="text-white font-semibold text-lg">
                    {customer.manager_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {[
                  {
                    label: "Order ID",
                    value: customer.order_id,
                    icon: FiPackage,
                  },
                  {
                    label: "Cloth Name",
                    value: customer.clothing_name,
                    icon: HiOutlineSparkles,
                  },
                  {
                    label: "Customer Name",
                    value: customer.customer_name,
                    icon: FiUser,
                  },
                  { label: "Gender", value: customer.gender, icon: FiUser },
                  {
                    label: "Phone Number",
                    value: customer.phone_number,
                    icon: FiUser,
                  },
                  {
                    label: "Customer Email",
                    value: customer.customer_email,
                    icon: FiUser,
                  },
                  {
                    label: "Create Date",
                    value: formatDate(customer.created_at),
                    icon: FiCalendar,
                  },
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                      <field.icon className="text-orange-500" size={16} />
                      <span>{field.label}</span>
                    </label>
                    <input
                      type="text"
                      value={field.value}
                      readOnly
                      className="w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <BsStars className="text-orange-500" size={16} />
                    <span>Priority</span>
                  </label>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-xl border font-medium ${getPriorityColor(
                      customer.priority
                    )}`}
                  >
                    {customer.priority}
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiPackage className="text-orange-500" size={16} />
                    <span>Order Status</span>
                  </label>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-xl border font-medium ${getStatusColor(
                      customer.order_status
                    )}`}
                  >
                    {customer.order_status}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiUser className="text-orange-500" size={16} />
                    <span>Customer Description</span>
                  </label>
                  <textarea
                    rows={3}
                    value={customer.customer_description}
                    readOnly
                    className="w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <HiOutlineSparkles className="text-orange-500" size={16} />
                    <span>Clothing Description</span>
                  </label>
                  <textarea
                    rows={3}
                    value={customer.clothing_description}
                    readOnly
                    className="w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Style Reference Images */}
          {customer.style_reference_images && (
            <motion.div
              ref={targetRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <HiOutlinePhotograph className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Style Reference Images
                    </h3>
                    <p className="text-purple-100">
                      Customer's style inspiration and references
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {customer.style_reference_images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {customer.style_reference_images.map((src, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group cursor-pointer"
                        onClick={() => handleOpenStyleModal(src)}
                      >
                        <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-purple-300 transition-all duration-200">
                          <img
                            src={src || "/placeholder.svg"}
                            alt={`Style Reference ${idx + 1}`}
                            className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                            <HiOutlinePhotograph
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              size={20}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HiOutlinePhotograph
                      className="mx-auto text-gray-400 mb-4"
                      size={48}
                    />
                    <p className="text-gray-500">
                      No style reference images available
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Measurements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <MdOutlineRule className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Measurements
                  </h3>
                  <p className="text-blue-100">
                    Detailed body measurements for perfect fit
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[
                  { label: "Shoulder", value: customer.shoulder },
                  { label: "Bust", value: customer.bust },
                  { label: "Bust Point", value: customer.bustpoint },
                  {
                    label: "Shoulder to Underbust",
                    value: customer.shoulder_to_underbust,
                  },
                  {
                    label: "Round Under Bust",
                    value: customer.round_under_bust,
                  },
                  { label: "Waist", value: customer.waist },
                  { label: "Half Length", value: customer.half_length },
                  { label: "Blouse Length", value: customer.blouse_length },
                  { label: "Sleeve Length", value: customer.sleeve_length },
                  { label: "Round Sleeve", value: customer.round_sleeve },
                  { label: "Dress Length", value: customer.dress_length },
                  { label: "Hip", value: customer.hip },
                  { label: "Chest", value: customer.chest },
                  { label: "Round Shoulder", value: customer.round_shoulder },
                  { label: "Skirt Length", value: customer.skirt_length },
                ].map((measurement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {measurement.label}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={measurement.value}
                        className="w-full rounded-xl border border-gray-200 shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        cm
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tailor Job Image */}
          {customer.tailor_job_image !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <BsStars className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Tailor Style
                    </h3>
                    <p className="text-emerald-100">
                      Proposed design from our tailoring team
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {customer.tailor_job_image === "" ? (
                  <div className="text-center py-12">
                    <BsStars className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">
                      No tailor style image available yet
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer group"
                        onClick={handleTailorJobImageClick}
                      >
                        <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 group-hover:border-emerald-300 transition-all duration-200">
                          <img
                            src={
                              customer.tailor_job_image || "/placeholder.svg"
                            }
                            alt="Tailor Job Style"
                            className="w-32 h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                            <BsStars
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              size={24}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Approval Status and Buttons */}
                    <div className="mt-4 space-y-3">
                      {/* Current Status Display */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Status:
                        </span>
                        {customer.style_approval === "accepted" && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            <IoIosCheckmark size={16} />
                            <span>Approved</span>
                          </div>
                        )}
                        {customer.style_approval === "rejected" && (
                          <div>
                            <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            <IoIosClose size={16} />
                            <span>Rejected</span>
                            <span className="ml-5">({customer.style_approval_feedback})</span>
                          </div>
                
                          </div>
                        )}
                        {customer.style_approval === null && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            <IoIosWarning size={16} />
                            <span>Pending Review</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {customer.style_approval === null &&
                        customer.order_status !== "closed" && (
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleOpenApproveModal}
                              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm font-medium"
                            >
                              <IoIosCheckmark size={16} />
                              <span>Approve</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleOpenRejectModal}
                              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 text-sm font-medium"
                            >
                              <IoIosClose size={16} />
                              <span>Reject</span>
                            </motion.button>
                          </div>
                        )}

                      {/* Show action for approved status */}
                      {customer.style_approval === "accepted" &&
                        customer.order_status !== "closed" && (
                          <Link href={`/admin/orders/${id}/add-job-expense`}>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 text-sm font-medium"
                            >
                              <span>Add Payment</span>
                            </motion.button>
                          </Link>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Other Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FiCalendar className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Other Details
                  </h3>
                  <p className="text-indigo-100">
                    Fitting dates and project timeline
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiCalendar className="text-indigo-500" size={16} />
                    <span>First Fitting Date</span>
                  </label>
                  <input
                    type="text"
                    value={
                      formatDate(customer.first_fitting_date) || "Not scheduled"
                    }
                    readOnly
                    className="w-full rounded-xl border border-gray-200 shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiCalendar className="text-indigo-500" size={16} />
                    <span>Second Fitting Date</span>
                  </label>
                  <input
                    type="text"
                    value={
                      formatDate(customer.second_fitting_date) ||
                      "Not scheduled"
                    }
                    readOnly
                    className="w-full rounded-xl border border-gray-200 shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiCalendar className="text-indigo-500" size={16} />
                    <span>Duration (days)</span>
                  </label>
                  <input
                    type="text"
                    value={customer.duration ?? "Not specified"}
                    readOnly
                    className="w-full rounded-xl border border-gray-200 shadow-sm p-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Edit Button */}
        {customer.order_status !== "closed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-end mt-8"
          >
            <Link href={`/admin/orders/${id}/edit`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
              >
                <FiEdit3 size={18} />
                <span>Edit Order</span>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {/* Style Reference Modal */}
      <AnimatePresence>
        {isCustomerModalOpen && activeStyleImage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
            onClick={handleCloseStyleModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Style Reference
                </h3>
                <button
                  onClick={handleCloseStyleModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoIosClose size={24} />
                </button>
              </div>
              <img
                src={activeStyleImage || "/placeholder.svg"}
                alt="Style Reference Full"
                className="w-full h-[70vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tailor Job Modal */}
      <AnimatePresence>
        {isTailorJobModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsTailorJobModalOpen(false)}
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsTailorJobModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <IoIosClose size={24} />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Tailor Style Review
                </h3>
                <p className="text-gray-600">
                  Review and approve or reject the proposed design
                </p>
              </div>

              <div className="relative w-full h-[60vh] mb-6 rounded-xl bg-gray-100 overflow-hidden">
                <Image
                  src={customer.tailor_job_image || "/fallback.jpg"}
                  alt="Tailor Job Style"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {customer.style_approval === "pending" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenApproveModal}
                      className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold"
                    >
                      ✓ Approve Style
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenRejectModal}
                      className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-semibold"
                    >
                      ✗ Reject Style
                    </motion.button>
                  </>
                )}

                {customer.style_approval === "accepted" && (
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-green-600 font-semibold text-lg mb-4">
                      <IoIosCheckmark size={24} />
                      <span>Style Approved</span>
                    </div>
                    <Link href={`/admin/orders/${id}/add-job-expense`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-semibold"
                      >
                        Add Payment
                      </motion.button>
                    </Link>
                  </div>
                )}

                {customer.style_approval === "rejected" && (
                  <div className="flex items-center justify-center space-x-2 text-red-600 font-semibold text-lg">
                    <IoIosClose size={24} />
                    <span>Style Rejected</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
            onClick={() => {
              setIsRejectModalOpen(false);
              setRejectFeedback("");
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoIosClose className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Reject Style
                </h2>
                <p className="text-gray-600">
                  Please provide feedback for the rejection
                </p>
              </div>
              <textarea
                rows={4}
                placeholder="Enter your feedback here..."
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all duration-200 resize-none"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectFeedback("");
                  }}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRejectConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-medium"
                >
                  Confirm Rejection
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {isApproveModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsApproveModalOpen(false)}
          >
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoIosClose size={24} />
              </button>

              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <IoIosCheckmarkCircleOutline
                    className="text-green-600"
                    size={32}
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Approve Style
                </h2>
                <p className="text-gray-600">
                  You're about to approve this design and proceed to invoice
                  generation.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApproveConfirm}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold"
              >
                Confirm & Generate Invoice
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Order Modal */}
      <AnimatePresence>
        {isCloseModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCancelClose}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <IoIosWarning className="text-red-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Close Order
                </h2>
                <p className="text-gray-600">
                  Are you sure you want to close this order? This action cannot
                  be undone.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelClose}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmClose}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-medium"
                >
                  Close Order
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
