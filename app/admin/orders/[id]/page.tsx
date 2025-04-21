"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function ShowCustomer() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { id } = useParams();

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
    style_reference_images: string;
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

  const handleCustomerImageClick = () => {
    // Only open the tailor job modal if no other modal is open.
    if (!isRejectModalOpen && !isApproveModalOpen) {
      setIsCustomerModalOpen(true);
    }
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/orderslist/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const result = await response.json();

      if (result.data) {
        const mappedCustomer: Customer = {
          hip: result.data.hip,
          waist: result.data.waist,
          bust: result.data.bust,
          shoulder: result.data.shoulder, // Added shoulder field
          bustpoint: result.data.bustpoint,
          shoulder_to_underbust: result.data.shoulder_to_underbust,
          round_under_bust: result.data.round_under_bust,
          half_length: result.data.half_length,
          blouse_length: result.data.blouse_length,
          sleeve_length: result.data.sleeve_length,
          round_sleeve: result.data.round_sleeve,
          dress_length: result.data.dress_length,
          chest: result.data.chest,
          round_shoulder: result.data.round_shoulder,
          skirt_length: result.data.skirt_length,
          trousers_length: result.data.trousers_length,
          round_thigh: result.data.round_thigh,
          round_knee: result.data.round_knee,
          round_feet: result.data.round_feet,
          clothing_description: result.data.clothing_description,
          clothing_name: result.data.clothing_name,
          style_reference_images: result.data.style_reference_images,
          tailor_job_image: result.data.tailor_job_image,
          order_id: result.data.order_id,
          priority: result.data.priority,
          order_status: result.data.order_status,
          customer_description: result.data.customer_description,
          created_at: result.data.created_at,
          first_fitting_date: result.data.first_fitting_date,
          second_fitting_date: result.data.second_fitting_date,
          customer_name: result.data.customer_name,
          customer_email: result.data.customer_email,
          gender: result.data.gender,
          phone_number: result.data.phone_number,
          address: result.data.address,
          manager_name: result.data.manager_name,
          duration: result.data.duration,
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

  // ----- New Handlers for Reject Modal -----
  const handleOpenRejectModal = () => {
    // Close the underlying tailor job modal if open
    setIsCustomerModalOpen(false);
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/rejecttailorstyle/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ feedback: rejectFeedback }),
        }
      );

      console.log("Response:", response); // Debugging line
      console.log("Reject Feedback:", rejectFeedback); // Debugging line

      if (!response.ok) {
        throw new Error("Failed to send rejection feedback");
      }
      // Optionally handle the response here

      setIsRejectModalOpen(false);
      setRejectFeedback("");
    } catch (err) {
      console.error(err);
      // Optionally show error to user
    }
  };

  // ----- New Handlers for Approve Modal -----
  const handleOpenApproveModal = () => {
    // Close the underlying tailor job modal if open
    // setIsCustomerModalOpen(false);
    // setIsRejectModalOpen(false);
    // setIsApproveModalOpen(true);
    router.push(`/admin/orders/${id}/create-payment`);
  };

  const handleApproveConfirm = async () => {
    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/accepttailorstyle/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          // body: JSON.stringify({ enter_price: approvePrice }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send approval price");
      }
      // Optionally handle the response here

      setIsApproveModalOpen(false);
      setApprovePrice("");
      // Navigate to invoice route
      router.push(`/admin/payments/${id}/invoice`);
    } catch (err) {
      console.error(err);
      // Optionally show error to user
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

  return (
    <motion.div
      className="w-full mx-auto p-8 bg-white rounded-2xl shadow-xl relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
        <Link
          href="/admin/customers"
          className="flex items-center text-orange-500 hover:text-orange-700 transition-colors"
        >
          <IoIosArrowBack size={28} />
          <span className="ml-2 font-semibold">Back to List</span>
        </Link>
        <div className="mt-4 lg:mt-0 flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-800">
            Head of Tailoring:
          </h1>
          <span className="text-xl font-medium text-gray-700">
            {customer.manager_name}
          </span>
        </div>
      </div>

      {/* <button
        onClick={handleScroll}
        className="mt-2 px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-200 transition"
      >
        Go to Section
      </button> */}

      {/* Order Information */}
      <form>
        <div className="flex justify-between">
          <h2 className="block text-2xl font-bold text-gray-800 mb-4">
            Order Information
          </h2>

          <div className="flex items-center space-x-2">
            {customer.order_status === "completed" && (
              <div className="text-sm text-green-500">
                *order has been completed
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { label: "Order ID", value: customer.order_id },
            { label: "Cloth Name", value: customer.clothing_name },
            { label: "Priority", value: customer.priority },
            { label: "Order Status", value: customer.order_status },
            { label: "Customer Name", value: customer.customer_name },
            { label: "Gender", value: customer.gender },
            { label: "Phone Number", value: customer.phone_number },
            { label: "Create Date", value: formatDate(customer.created_at) },
            { label: "Customer Email", value: customer.customer_email },
          ].map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                readOnly
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-600 focus:outline-none focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
              />
            </motion.div>
          ))}
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Customer Description
            </label>
            <textarea
              rows={2}
              value={customer.customer_description}
              readOnly
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-600 focus:outline-none focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Clothing Description
            </label>
            <textarea
              rows={2}
              value={customer.clothing_description}
              readOnly
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-600 focus:outline-none focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
        </div>

        {/* Style Reference */}
        {customer.style_reference_images && (
          <motion.div
            ref={targetRef}
            className="w-full mb-8 p-6 bg-gray-50 rounded-2xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Style reference images
            </label>
            {customer.style_reference_images === "" ? (
              <div className="text-gray-500">No image selected</div>
            ) : (
              <div>
                <img
                  src={customer.style_reference_images}
                  alt="Customer Style Reference"
                  className="w-24 h-24 object-cover rounded-md border border-gray-300 cursor-pointer transition hover:shadow-lg"
                  onClick={handleCustomerImageClick}
                />
              </div>
            )}
            {isCustomerModalOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
                onClick={handleCustomerCloseModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="bg-white rounded-lg p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={customer.style_reference_images}
                    alt="Style Reference"
                    className="w-80 h-80 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Image failed to load";
                    }}
                  />
                  {/* Tailor Job Image Action Buttons */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={handleOpenApproveModal}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Approve Style
                    </button>
                    <button
                      onClick={handleOpenRejectModal}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Reject Style
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Measurements */}
        <div className="w-full">
          <h3 className="block text-xl font-bold text-gray-700 mt-10 mb-4">
            Measurements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Bust", value: customer.bust },
              { label: "Waist", value: customer.waist },
              { label: "Hips", value: customer.hip },
              { label: "Shoulder Width", value: customer.shoulder },
              { label: "Bust Point", value: customer.bustpoint },
              {
                label: "Shoulder to Underbust",
                value: customer.shoulder_to_underbust,
              },
              { label: "Round Under Bust", value: customer.round_under_bust },
              { label: "Half Length", value: customer.half_length },
              { label: "Blouse Length", value: customer.blouse_length },
              { label: "Sleeve Length", value: customer.sleeve_length },
              { label: "Round Sleeve", value: customer.round_sleeve },
              { label: "Dress Length", value: customer.dress_length },
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
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <label
                  htmlFor={measurement.label.toLowerCase().replace(/\s/g, "")}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {measurement.label}
                </label>
                <input
                  type="number"
                  readOnly
                  id={measurement.label.toLowerCase().replace(/\s/g, "")}
                  name={measurement.label.toLowerCase().replace(/\s/g, "")}
                  value={measurement.value}
                  placeholder={measurement.label}
                  className="w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-50 text-gray-600 focus:border-orange-500 focus:ring focus:ring-orange-500 transition"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md mt-6">
            <div className="text-2xl font-bold text-gray-700 mb-4">
              Other details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Fitting Date
                </label>

                <input
                  type="text"
                  value={customer.first_fitting_date}
                  readOnly
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-600 focus:outline-none focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Second Fitting Date
                </label>
                <input
                  type="text"
                  value={customer.second_fitting_date}
                  readOnly
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 text-gray-600 focus:outline-none focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  placeholder="Enter number of days"
                  value={customer.duration}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Edit Action */}
      <div className="mt-6 flex flex-col items-end">
        <Link
          href={`/admin/orders/${id}/edit`}
          className="px-6 py-3 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 transition duration-200"
        >
          Edit
        </Link>
        <div className="mt-2 text-sm text-gray-600">
          Click edit to make changes
        </div>
      </div>

      {/* Other Details - Tailor Job Image */}
      {customer.tailor_job_image && (
        <div className="w-full mb-8 p-6 bg-gray-50 rounded-2xl shadow-md">
          <div className="font-bold text-2xl">Other Details</div>
          <motion.div
            className="w-full mb-8 p-6 bg-gray-50 rounded-2xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tailor Style
            </label>
            {customer.tailor_job_image === "" ? (
              <div className="text-gray-500">No image selected</div>
            ) : (
              <div>
                <img
                  src={customer.tailor_job_image}
                  alt="Tailor Job Style"
                  className="w-24 h-24 object-cover rounded-md border border-gray-300 cursor-pointer transition hover:shadow-lg"
                  onClick={handleCustomerImageClick}
                />
              </div>
            )}
            {isCustomerModalOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
                onClick={handleCustomerCloseModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="bg-white rounded-lg p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={customer.tailor_job_image}
                    alt="Tailor Job Style"
                    className="w-80 h-80 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Image failed to load";
                    }}
                  />
                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={handleOpenApproveModal}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Approve Style
                    </button>
                    <button
                      // onClick={handleOpenApproveModal}
                      className="px-4 py-2 bg-orange-500 mx-5 text-white rounded hover:bg-green-600 transition"
                    >
                      Download Image
                    </button>

                    <button
                      onClick={handleOpenRejectModal}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Reject Style
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* ---------- New Reject Modal ---------- */}
      {isRejectModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
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
            className="bg-white rounded-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Reject Style
            </h2>
            <input
              type="text"
              placeholder="feedback"
              name="rejectFeedback"
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleRejectConfirm}
              className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Confirm
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ---------- New Approve Modal ---------- */}
      {isApproveModalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => {
            setIsApproveModalOpen(false);
            setApprovePrice("");
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Approve Style
            </h2>
            <input
              type="text"
              placeholder="enter_price"
              value={approvePrice}
              onChange={(e) => setApprovePrice(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-orange-500"
            />
            {/* <button
              onClick={handleApproveConfirm}
              className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Generate Invoice
            </button> */}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
