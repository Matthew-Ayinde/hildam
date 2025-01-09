"use client";

import Spinner from "@/components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ShowCustomer() {
  const router = useRouter();
  const { id } = useParams();
  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    fullName: string;
    gender: string;
    phone: string;
    date: string;
    email: string;
    address: string;
    bust: number;
    waist: number;
    hip: number;
    shoulderWidth: number;
    neck: number;
    armLength: number;
    backLength: number;
    frontLength: number;
    project_manager_order_status: string;
    project_manager_amount: string;
    clothing_description: string;
    clothing_name: string;
    order_id: string;
    priority: string;
    order_status: string;
    customer_description: string;
    tailor_job_image?: string; 
    manager_name?: string; 
    approval?: string; // Add approval to the Customer interface
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [customerFeedback, setCustomerFeedback] = useState<string>(""); // State for customer feedback
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // State for feedback modal

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/myorders/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();

      if (result.data) {
        const mappedCustomer: Customer = {
          fullName: result.data.customer_name || "N/A",
          gender: result.data.gender || "N/A",
          phone: result.data.phone_number || "N/A",
          date: new Date().toLocaleDateString(),
          email: result.data.customer_email || "N/A",
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          high_bust: result.data.high_bust || 0,
          waist: result.data.waist || 0,
          hip: result.data.hips || 0,
          shoulderWidth: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          armLength: result.data.arm_length || 0,
          backLength: result.data.back_length || 0,
          frontLength: result.data.front_length || 0,
          clothing_description: result.data.clothing_description || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          order_id: result.data.order_id || "N/A",
          priority: result.data.priority || "N/A",
          order_status: result.data.order_status || "N/A",
          customer_description: result.data.customer_description || "N/A",
          project_manager_order_status: result.data.project_manager_order_status || "N/A",
          project_manager_amount: result.data.project_manager_amount || "N/A",
          manager_name: result.data.manager_name || "N/A",
          tailor_job_image: result.data.tailor_job_image || null,
          approval: result.data.approval || null, // Add approval
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

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsFeedbackModalOpen(false);
    setCustomerFeedback(""); // Reset feedback when closing modal
  };

  const handleApproveStyle = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/approvestyle/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send image to project manager");
      }

      const result = await response.json();
      console.log(result);
      setUploadMessage("Image approved"); // Set notification message

      // Show toast notification for 5 seconds
      setTimeout(() => {
        setUploadMessage(null); // Clear notification message
      }, 5000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }

    handleCloseModal();
  };

  const handleRejectStyle = () => {
    setIsFeedbackModalOpen(true); // Open feedback modal
  };

  const handleSubmitFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/rejectstyle/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_feedback: customerFeedback }), // Send feedback in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to reject image");
      }

      const result = await response.json();
      console.log(result);
      setUploadMessage("Image rejected with feedback"); // Set notification message

      // Remove the image from the page
      setCustomer((prev) => prev ? {
        ...prev,
        tailor_job_image: null as string, // Remove the image
      } : null);

      // Show toast notification for 5 seconds
      setTimeout(() => {
        setUploadMessage(null); // Clear notification message
      }, 5000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }

    handleCloseModal();
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-10">
      <Spinner />
    </div>;
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
    <div className="w-full mx-auto p-6 min-h-full h-full bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/customers/list")}
          className="text-blue-500 underline"
        >
          Back to List
        </button>
        <div className="text-end font-bond text-lg text-gray-700 flex flex-row">
          <div className="font-bold me-3">Client Manager:</div> {customer.manager_name}
        </div>
      </div>
      <form>
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <label className="block text-gray-700 font-bold">Order ID</label>
            <input
              type="text"
              value={customer.order_id}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Order Status</label>
            <input
              type="text"
              value={customer.order_status}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Create Date</label>
            <input
              type="text"
              value={customer.date}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div className="">
            <div className="block text-gray-700 font-bold">Clothing Name</div>
            <textarea
              rows={1}
              value={customer.clothing_name}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div className="">
            <div className="block text-gray-700 font-bold">Clothing Description</div>
            <textarea
              rows={1}
              value={customer.clothing_description}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-gray-700 font-bold">Address</label>
          <textarea
            value={customer.address}
            readOnly
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
          />
        </div>
        <div className="w-full">
          <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">Measurements</div>
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
                <label htmlFor="bust" className="block text-sm font-medium text-gray-700">Bust</label>
                <input
                  type="number"
                  readOnly
                  id="bust"
                  name="bust"
                  value={customer.bust }
                  placeholder="Bust"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="waist" className="block text-sm font-medium text-gray-700">Waist</label>
                <input
                  type="number"
                  readOnly
                  id="waist"
                  name="waist"
                  value={customer.waist}
                  placeholder="Waist"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="hips" className="block text-sm font-medium text-gray-700">Hips</label>
                <input
                  type="number"
                  readOnly
                  id="hips"
                  name="hips"
                  value={customer.hip}
                  placeholder="Hips"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
                <label htmlFor="shoulderWidth" className="block text-sm font-medium text-gray-700">Shoulder Width</label>
                <input
                  type="number"
                  readOnly
                  id="shoulderWidth"
                  name="shoulderWidth"
                  value={customer.shoulderWidth}
                  placeholder="Shoulder Width"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="neck" className="block text-sm font-medium text-gray-700">Neck</label>
                <input
                  type="number"
                  readOnly
                  id="neck"
                  name="neck"
                  value={customer.neck}
                  placeholder="Neck"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="armLength" className="block text-sm font-medium text-gray-700">Arm Length</label>
                <input
                  type="number"
                  readOnly
                  id="armLength"
                  name="armLength"
                  value={customer.armLength}
                  placeholder="Arm Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
                <label htmlFor="backLength" className="block text-sm font-medium text-gray-700">Back Length</label>
                <input
                  type="number"
                  readOnly
                  id="backLength"
                  name="backLength"
                  value={customer.backLength}
                  placeholder="Back Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label htmlFor="frontLength" className="block text-sm font-medium text-gray-700">Front Length</label>
                <input
                  type="number"
                  readOnly
                  id="frontLength"
                  name="frontLength"
                  value={customer.frontLength}
                  placeholder="Front Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="high_bust"
                  className="block text-sm font-medium text-gray-700"
                >
                  High Bust
                </label>
                <input
                  type="number"
                  readOnly
                  id="high_bust"
                  name="high_bust"
                  value={customer.high_bust}
                  placeholder="High Bust"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      {customer.tailor_job_image && (
        <div className="mt-10">
          <h2 className="text-lg font-bold">Proposed Image</h2>
          <div className="mt-2">
            <Image
              src={customer.tailor_job_image || ""}
              alt="Proposed Tailor Job"
              width={100}
              height={100}
              onClick={handleImageClick}
              className="cursor-pointer"
            />
            {customer.approval === null && (
              <div className="text-red-500 mt-2">Please approve image</div>
            )}
            {customer.approval === "3" && (
              <div className="text-green-500 mt-2">Style Approved</div>
            )}
            {customer.approval === "1" && (
              <div className ="text-red-500 mt-2">Style Rejected</div>
            )}
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={customer.tailor_job_image || ""}
              alt="Proposed Tailor Job"
              width={400}
              height={400}
            />
            <div className="mt-4 flex justify-between">
              <button 
                onClick={handleApproveStyle} 
                className={`px-4 py-2 ${customer.approval === "Approved" ? "bg-gray-500" : "bg-green-500"} text-white rounded`}
                disabled={customer.approval === "Approved"}
              >
                Approve Style
              </button>
              <button 
                onClick={handleRejectStyle} 
                className={`px-4 py-2 ${customer.approval === "Rejected" ? "bg-gray-500" : "bg-red-500"} text-white rounded`}
                disabled={customer.approval === "Rejected"}
              >
                Reject Style
              </button>
            </div>
          </div>
        </div>
      )}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleCloseModal}>
          <div className="bg-white w-[400px] rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold">Customer Feedback</h2>
            <textarea
              value={customerFeedback}
              onChange={(e) => setCustomerFeedback(e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded p-2"
              rows={4}
              placeholder="Enter your feedback here..."
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleSubmitFeedback} 
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-4">
        <div
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => router.push(`/client/orders/${id}/edit`)}
        >
          Edit
        </div>
        <button className="px-4 py-2 bg-red-500 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
}