"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";

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
import {
  fetchOrderById,
  rejectTailorImage,
  acceptTailorImage,
  closeOrder,
} from "@/app/api/apiClient";
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

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const modalRoot = typeof document !== "undefined" ? document.body : null;

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
      const response = await closeOrder(orderId);

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
    fabric_images: string[];
    tailor_job_image: string;
    finished_cloth_image: string;
    finished_cloth_images: string[];
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
    collection_date: string;
    has_payment: string
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [approvePrice, setApprovePrice] = useState("");
  const [isFabricModalOpen, setIsFabricModalOpen] = useState(false);
  const [activeFabricIndex, setActiveFabricIndex] = useState<number>(0);
  const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
  const [activeFinishedIndex, setActiveFinishedIndex] = useState<number>(0);

  const normalizeImageList = (value: string | string[] | null | undefined): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [String(parsed)].filter(Boolean);
    } catch {
      return [value].filter(Boolean);
    }
  };

  const handleScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDownload = async () => {
    if (!customer) return;
    setIsGeneratingPDF(true);

    try {
      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 52;
      const contentWidth = pageWidth - margin * 2;
      let cursorY = margin;

      const ensurePageSpace = (requiredHeight: number) => {
        if (cursorY + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          cursorY = margin;
        }
      };

      const drawDivider = () => {
        pdf.setDrawColor(220, 220, 220);
        pdf.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 20;
      };

      const addSectionTitle = (title: string) => {
        ensurePageSpace(34);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(34, 34, 34);
        pdf.text(title, margin, cursorY);
        cursorY += 16;
        drawDivider();
      };

      const addFieldRows = (
        fields: Array<{ label: string; value: string }>,
        cols = 2
      ) => {
        const colGap = 14;
        const colWidth = (contentWidth - colGap * (cols - 1)) / cols;
        const rows = Math.ceil(fields.length / cols);

        for (let row = 0; row < rows; row++) {
          const rowFields: Array<{ label: string; wrapped: string[] }> = [];
          let maxWrappedLines = 1;

          for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            if (!fields[index]) continue;

            const safeValue = fields[index].value || "-";
            const wrapped = pdf.splitTextToSize(safeValue, colWidth - 20) as string[];
            maxWrappedLines = Math.max(maxWrappedLines, wrapped.length);
            rowFields.push({ label: fields[index].label, wrapped });
          }

          const rowHeight = 34 + maxWrappedLines * 12;
          ensurePageSpace(rowHeight + 14);

          for (let col = 0; col < cols; col++) {
            const field = rowFields[col];
            if (!field) continue;

            const x = margin + col * (colWidth + colGap);

            pdf.setFillColor(249, 250, 251);
            pdf.setDrawColor(229, 231, 235);
            pdf.roundedRect(x, cursorY, colWidth, rowHeight, 6, 6, "FD");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(9);
            pdf.setTextColor(90, 90, 90);
            pdf.text(field.label, x + 10, cursorY + 14);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(25, 25, 25);
            pdf.text(field.wrapped, x + 10, cursorY + 30);
          }

          cursorY += rowHeight + 14;
        }
      };

      const addParagraph = (label: string, value: string) => {
        const lines = pdf.splitTextToSize(value || "-", contentWidth - 24) as string[];
        const blockHeight = 40 + lines.length * 12;
        ensurePageSpace(blockHeight + 16);

        pdf.setFillColor(249, 250, 251);
        pdf.setDrawColor(229, 231, 235);
        pdf.roundedRect(margin, cursorY, contentWidth, blockHeight, 8, 8, "FD");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(90, 90, 90);
        pdf.text(label, margin + 12, cursorY + 16);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(30, 30, 30);
        pdf.text(lines, margin + 12, cursorY + 34);
        cursorY += blockHeight + 16;
      };

      const addMeasurementTable = (
        measurements: Array<{ label: string; value: string }>
      ) => {
        const colCount = 2;
        const colGap = 14;
        const colWidth = (contentWidth - colGap) / colCount;
        const rowHeight = 42;

        for (let i = 0; i < measurements.length; i += colCount) {
          ensurePageSpace(rowHeight + 12);
          const row = measurements.slice(i, i + colCount);

          row.forEach((item, index) => {
            const x = margin + index * (colWidth + colGap);
            pdf.setFillColor(249, 250, 251);
            pdf.setDrawColor(229, 231, 235);
            pdf.roundedRect(x, cursorY, colWidth, rowHeight, 6, 6, "FD");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            pdf.text(item.label, x + 10, cursorY + 15);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.setTextColor(30, 30, 30);
            pdf.text(item.value || "-", x + 10, cursorY + 31);
          });

          cursorY += rowHeight + 12;
        }
      };

      const formatValue = (value: string | number | null | undefined) => {
        if (value === null || value === undefined || value === "") return "-";
        return String(value);
      };

      const addImageFromUrl = async (
        imageUrl: string,
        title: string,
        imageHeight = 210
      ) => {
        if (!imageUrl) return;

        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = dataUrl;
          });

          addSectionTitle(title);
          ensurePageSpace(imageHeight + 16);

          pdf.setDrawColor(220, 220, 220);
          pdf.setFillColor(255, 255, 255);
          pdf.roundedRect(margin, cursorY, contentWidth, imageHeight, 8, 8, "FD");

          const boxX = margin + 10;
          const boxY = cursorY + 10;
          const boxWidth = contentWidth - 20;
          const boxHeight = imageHeight - 20;
          const scale = Math.min(
            boxWidth / imageElement.naturalWidth,
            boxHeight / imageElement.naturalHeight
          );
          const drawWidth = imageElement.naturalWidth * scale;
          const drawHeight = imageElement.naturalHeight * scale;
          const drawX = boxX + (boxWidth - drawWidth) / 2;
          const drawY = boxY + (boxHeight - drawHeight) / 2;

          pdf.addImage(
            dataUrl,
            dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG",
            drawX,
            drawY,
            drawWidth,
            drawHeight,
            undefined,
            "MEDIUM"
          );
          cursorY += imageHeight + 16;
        } catch (error) {
          console.error("Failed to include image in PDF:", error);
        }
      };

      pdf.setFillColor(239, 246, 255);
      pdf.rect(0, 0, pageWidth, 118, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(22);
      pdf.text(`Order #${customer.order_id}`, margin, 58);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        `Generated: ${new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`,
        margin,
        82
      );

      pdf.setFontSize(10);
      pdf.text("Tailoring Order Profile", margin, 102);

      cursorY = 146;

      addSectionTitle("Order Summary");
      addFieldRows(
        [
          { label: "Order ID", value: formatValue(customer.order_id) },
          { label: "Status", value: formatValue(customer.order_status) },
          { label: "Priority", value: formatValue(customer.priority) },
          { label: "Customer", value: formatValue(customer.customer_name) },
          { label: "Email", value: formatValue(customer.customer_email) },
          { label: "Phone", value: formatValue(customer.phone_number) },
          { label: "Gender", value: formatValue(customer.gender) },
          { label: "Manager", value: formatValue(customer.manager_name) },
          {
            label: "Created Date",
            value: formatValue(formatDate(customer.created_at)),
          },
          {
            label: "Collection Date",
            value: formatValue(formatDateTime(customer.collection_date)),
          },
        ],
        2
      );

      addParagraph(
        "Customer Description",
        formatValue(customer.customer_description)
      );
      addParagraph(
        "Clothing Description",
        formatValue(customer.clothing_description)
      );

      addSectionTitle("Measurements (inches)");
      addMeasurementTable([
        { label: "Shoulder", value: `${formatValue(customer.shoulder)} in` },
        { label: "Bust", value: `${formatValue(customer.bust)} in` },
        { label: "Bust Point", value: `${formatValue(customer.bustpoint)} in` },
        {
          label: "Shoulder to Underbust",
          value: `${formatValue(customer.shoulder_to_underbust)} in`,
        },
        {
          label: "Round Under Bust",
          value: `${formatValue(customer.round_under_bust)} in`,
        },
        { label: "Waist", value: `${formatValue(customer.waist)} in` },
        { label: "Half Length", value: `${formatValue(customer.half_length)} in` },
        {
          label: "Blouse Length",
          value: `${formatValue(customer.blouse_length)} in`,
        },
        {
          label: "Sleeve Length",
          value: `${formatValue(customer.sleeve_length)} in`,
        },
        {
          label: "Round Sleeve",
          value: `${formatValue(customer.round_sleeve)} in`,
        },
        {
          label: "Dress Length",
          value: `${formatValue(customer.dress_length)} in`,
        },
        { label: "Hip", value: `${formatValue(customer.hip)} in` },
        { label: "Chest", value: `${formatValue(customer.chest)} in` },
        {
          label: "Round Shoulder",
          value: `${formatValue(customer.round_shoulder)} in`,
        },
        {
          label: "Skirt Length",
          value: `${formatValue(customer.skirt_length)} in`,
        },
        {
          label: "Trousers Length",
          value: `${formatValue(customer.trousers_length)} in`,
        },
        {
          label: "Round Thigh",
          value: `${formatValue(customer.round_thigh)} in`,
        },
        { label: "Round Knee", value: `${formatValue(customer.round_knee)} in` },
        { label: "Round Feet", value: `${formatValue(customer.round_feet)} in` },
      ]);

      addSectionTitle("Project Timeline");
      addFieldRows(
        [
          {
            label: "First Fitting",
            value: formatValue(formatDateTime(customer.first_fitting_date)),
          },
          {
            label: "Second Fitting",
            value: formatValue(formatDateTime(customer.second_fitting_date)),
          },
          { label: "Duration", value: `${formatValue(customer.duration)} days` },
          {
            label: "Collection Date",
            value: formatValue(formatDateTime(customer.collection_date)),
          },
        ],
        2
      );

      const firstStyleRef = customer.style_reference_images?.[0];
      if (firstStyleRef) {
        await addImageFromUrl(firstStyleRef, "Style Reference", 210);
      }

      if (customer.tailor_job_image) {
        await addImageFromUrl(customer.tailor_job_image, "Tailor Proposed Style", 240);
      }

      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(120, 120, 120);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 20,
          { align: "right" }
        );
      }

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
          style_reference_images: result.style_reference_images || [],
          fabric_images: result.fabric?.fabric_images || [],
          fabric_description: result.fabric?.description || "",
          fabric_dropped_off_at: result.fabric?.dropped_off_at || null,
          fabric_status: result.fabric?.status || "",
          fabric_received_by_staff_id: result.fabric?.received_by_staff_id || "",
          finished_cloth_images: normalizeImageList(result.tailoring?.finished_cloth_image),
          tailor_job_image: normalizeImageList(result.tailoring?.finished_cloth_image)[0] || "",
          finished_cloth_image: normalizeImageList(result.tailoring?.finished_cloth_image)[0] || "",
          order_id: result.order_id,
          priority: result.priority,
          order_status: result.order_status,
          customer_description: result.customer.customer_description,
          created_at: result.created_at,
          first_fitting_date: result.first_fitting_date,
          second_fitting_date: result.second_fitting_date,
          collection_date: result.collection_date,
          customer_name: result.customer_name,
          customer_email: result.customer.email,
          gender: result.customer.gender,
          phone_number: result.customer.phone_number,
          address: result.address,
          manager_name: result.tailoring?.manager?.name || "Not Assigned",
          duration: result.duration,
          style_approval: result.tailoring.client_manager_approval,
          style_approval_feedback: result.tailoring.client_manager_feedback,
          has_payment: result.has_payment,
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
      client_manager_feedback: rejectFeedback,
    };
    try {
      const response = await rejectTailorImage(orderId, feedback);

      setIsRejectModalOpen(false);
      setRejectFeedback("");

      setTimeout(() => {
        router.push(ApplicationRoutes.AdminOrders);
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
      const response = await acceptTailorImage(orderId);

      setIsApproveModalOpen(false);
      setApprovePrice("");
      router.push(`/admin/orders/${id}/add-job-expense`);
    } catch (err) {
      console.error(err);
    }
  };

  const parseDateTimeValue = (value: string | number | Date) => {
    if (!value) return null;
    const normalizedValue = String(value)
      .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1")
      .replace(/(\d)(am|pm)\b/gi, "$1 $2")
      .trim();

    const parsedDate = new Date(normalizedValue);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = parseDateTimeValue(dateString);
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = parseDateTimeValue(dateString);
    if (!date) return String(dateString);

    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
        <div className="space-y-8">
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

          {/* Fabric Information */}
          {(customer.fabric_images && Array.isArray(customer.fabric_images) && customer.fabric_images.length > 0) || customer.fabric_description ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <FiPackage className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Fabric</h3>
                    <p className="text-gray-200">Details about the fabric attached to this order</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    {customer.fabric_images && Array.isArray(customer.fabric_images) && customer.fabric_images.length > 0 ? (
                      <div className="overflow-hidden rounded-xl border-2 border-gray-200 w-full max-w-full">
                        <div className="flex gap-3 overflow-x-auto py-2">
                          {customer.fabric_images.map((src, i) => (
                            <button
                              key={i}
                              onClick={() => { setActiveFabricIndex(i); setIsFabricModalOpen(true); }}
                              className="flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-all duration-200"
                            >
                              <img
                                src={src || "/placeholder.svg"}
                                alt={`Fabric ${i + 1}`}
                                className="w-48 h-36 object-cover block"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <HiOutlinePhotograph className="mx-auto text-gray-400 mb-2" size={36} />
                        <p className="text-gray-500">No fabric image available</p>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{customer.fabric_description || "-"}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Dropped off</label>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{(() => {
                            const d = Array.isArray(customer.fabric_dropped_off_at)
                              ? customer.fabric_dropped_off_at[0]
                              : customer.fabric_dropped_off_at;
                            return d ? formatDate(String(d)) : "-";
                          })()}</p>
                        </div>
                     
                      </div>

                   
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}

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
                  { label: "Trousers Length", value: customer.trousers_length },
                  { label: "Round Thigh", value: customer.round_thigh },
                  { label: "Round Knee", value: customer.round_knee },
                  { label: "Round Feet", value: customer.round_feet },
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
                        inches
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tailor Job Image */}
          
          {customer.finished_cloth_images?.length > 0 && (
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
                      Finished Cloth Image
                    </h3>
                    <p className="text-emerald-100">
                      Finished cloth image from the tailoring team
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {customer.finished_cloth_images && Array.isArray(customer.finished_cloth_images) && customer.finished_cloth_images.length > 0 ? (
                  <div>
                    <div className="flex gap-3 flex-wrap">
                      {customer.finished_cloth_images.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => { setActiveFinishedIndex(i); setIsFinishedModalOpen(true); }}
                          className="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-300 transition-all duration-200"
                        >
                          <img
                            src={src || "/placeholder.svg"}
                            alt={`Finished ${i + 1}`}
                            className="w-40 h-40 object-cover block"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BsStars className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">
                      No finished cloth images available yet
                    </p>
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
                      formatDateTime(customer.first_fitting_date) || "Not scheduled"
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
                      formatDateTime(customer.second_fitting_date) ||
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
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiCalendar className="text-indigo-500" size={16} />
                    <span>Collection Date</span>
                  </label>
                  <input
                    type="text"
                    value={
                      formatDateTime(customer.collection_date) || "Not scheduled"
                    }
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

      {/* Fabric Modal */}
      <AnimatePresence>
        {isFabricModalOpen && customer?.fabric_images && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFabricModalOpen(false)}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 max-w-4xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsFabricModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <IoIosClose size={22} />
              </button>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => setActiveFabricIndex((i) => Math.max(0, i - 1))}
                  className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  ‹
                </button>

                <div className="w-full max-h-[70vh] overflow-hidden flex items-center justify-center">
                  <img
                    src={customer.fabric_images[activeFabricIndex] || "/placeholder.svg"}
                    alt={`Fabric ${activeFabricIndex + 1}`}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>

                <button
                  onClick={() => setActiveFabricIndex((i) => Math.min(customer.fabric_images!.length - 1, i + 1))}
                  className="p-2 ml-4 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  ›
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                {activeFabricIndex + 1} / {customer.fabric_images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finished Cloth Modal */}
      <AnimatePresence>
        {isFinishedModalOpen && customer?.finished_cloth_images && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFinishedModalOpen(false)}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-4 max-w-4xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setIsFinishedModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <IoIosClose size={22} />
              </button>

              <div className="flex items-center justify-center">
                <button
                  onClick={() => setActiveFinishedIndex((i) => Math.max(0, i - 1))}
                  className="p-2 mr-4 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  ‹
                </button>

                <div className="w-full max-h-[70vh] overflow-hidden flex items-center justify-center">
                  <img
                    src={customer.finished_cloth_images[activeFinishedIndex] || "/placeholder.svg"}
                    alt={`Finished ${activeFinishedIndex + 1}`}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>

                <button
                  onClick={() => setActiveFinishedIndex((i) => Math.min(customer.finished_cloth_images!.length - 1, i + 1))}
                  className="p-2 ml-4 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  ›
                </button>
              </div>

              <div className="mt-4 text-center text-sm text-gray-600">
                {activeFinishedIndex + 1} / {customer.finished_cloth_images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tailor Job Modal */}
      {modalRoot
        ? createPortal(
            <AnimatePresence>
              {isTailorJobModalOpen && (
                <motion.div
                  className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setIsTailorJobModalOpen(false)}
                >
                  <motion.div
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 z-[201]"
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
                        Tailor Job Image
                      </h3>
                      <p className="text-gray-600">
                        This image shows the finished cloth from the tailoring team
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

                    <div className="flex flex-wrap items-center justify-center gap-4"></div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            modalRoot,
          )
        : null}

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
                  You're about to approve this design and proceed to payments
                  generation.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApproveConfirm}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold"
              >
                Confirm & Create Payment
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
