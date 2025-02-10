"use client";

import Spinner from "@/components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Invoice = () => {
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
    amount: string;
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
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/myorders/${id}`,
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
          amount: result.data.amount || "N/A",
          order_id: result.data.order_id || "N/A",
          priority: result.data.priority || "N/A",
          order_status: result.data.order_status || "N/A",
          customer_description: result.data.customer_description || "N/A",
          project_manager_order_status:
            result.data.project_manager_order_status || "N/A",
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
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/approvestyle/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

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
    //redirect to the orders:id page
    router.push(`/client/orders/${id}`);
  };

  const handleRejectStyle = () => {
    setIsFeedbackModalOpen(true); // Open feedback modal
  };

  const handleSubmitFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/rejectstyle/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customer_feedback: customerFeedback }), // Send feedback in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject image");
      }

      const result = await response.json();
      console.log(result);
      setUploadMessage("Image rejected with feedback"); // Set notification message

      // Remove the image from the page
      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              tailor_job_image: null as unknown as string, // Remove the image
            }
          : null
      );

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

  const handlePrint = () => {
    const invoiceContent = document.getElementById("invoice-content")?.innerHTML;
  
    if (!invoiceContent) return;
  
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${customer.order_id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .border { border: 1px solid #000; padding: 16px; border-radius: 8px; }
              .text-center { text-align: center; }
              .font-bold { font-weight: bold; }
              .mb-4 { margin-bottom: 16px; }
              .flex { display: flex; justify-content: space-between; align-items: center; }
              .uppercase { text-transform: uppercase; }
              @media print {
                .no-print { display: none; } /* Hide elements with this class */
                body { -webkit-print-color-adjust: exact; } 
                /* Add any additional print-specific styles here */
              }
            </style>
          </head>
          <body>
            <div class="border">${invoiceContent}</div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  

  return (
    <div className="p-2">
      <div className="border p-4 rounded shadow-lg" id="invoice-content">
        <div className="flex justify-between mb-4">
          <div>
            <img src="/logo.png" alt="Company Logo" className="h-12" />
            <h1 className="lg:text-5xl text-2xl my-2 font-bold">
              Hildam Couture
            </h1>
          </div>
          <div className="text-right">
            <p className="font-bold">Invoice Number: #{customer.order_id}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mb-4 text-sm lg:text-base">
          <h2 className="text-lg lg:text-xl">Bill To:</h2>
          <p>Insight Redefini</p>
          <p>19/21 oduduwa street</p>
          <p>Ikeja GRA, Lagos</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Invoice Details:</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="text-sm lg:text-base">
                <th className="border border-gray-200 p-2">Cloth Name</th>
                <th className="border border-gray-200 p-2">Description</th>
                <th className="border border-gray-200 p-2">Unit Price</th>
                <th className="border border-gray-200 p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border border-gray-200 p-2">
                  {customer.clothing_name}
                </td>
                <td className="border border-gray-200 p-2">
                  {customer.clothing_description}
                </td>
                <td className="border border-gray-200 p-2">
                  ₦{customer.amount}
                </td>
                <td className="border border-gray-200 p-2">
                  ₦{customer.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mb-4">
          <h2 className="text-sm lg:text-xl font-bold">Subtotal:</h2>
          <p className="text-sm lg:text-xl font-bold">₦{customer.amount}</p>
        </div>
        <div className="mb-4 flex justify-between">
          <h2 className="text-sm lg:text-xl font-bold">Payment Mode:</h2>
          <p>Transfer</p>
        </div>
        <div className="flex justify-end">
          <Link
            href={`/client/orders/${id}/payment`}
            className="mb-4 px-4 py-2 bg-orange-500 flex text-white rounded hover:bg-orange-600"
          >
            Make Payment
          </Link>
        </div>
      </div>

{/* 
      <button
        onClick={handlePrint}
        className="no-print mt-4 bg-green-500 text-white py-2 px-4 rounded"
      >
        Print Invoice
      </button> */}
    </div>
  );
};

export default Invoice;
