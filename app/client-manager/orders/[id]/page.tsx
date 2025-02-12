"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion"; // Import motion from framer-motion

export default function ShowCustomer() {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleCustomerImageClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

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
    style_reference_images: string;
    clothing_name: string;
    order_id: string;
    priority: string;
    order_status: string;
    customer_description: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/orderslist/${id}`,
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
          fullName: result.data.customer_name || "N/A",
          gender: result.data.gender || "N/A",
          phone: result.data.phone_number || "N/A",
          date: new Date().toLocaleDateString(),
          email: result.data.customer_email || "N/A",
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hip: result.data.hips || 0,
          highBust: result.data.high_bust,
          shoulderWidth: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          armLength: result.data.arm_length || 0,
          backLength: result.data.back_length || 0,
          frontLength: result.data.front_length || 0,
          clothing_description: result.data.clothing_description || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          style_reference_images: result.data.style_reference_images || "N/A",
          order_id: result.data.order_id || "N/A",
          priority: result.data.priority || "N/A",
          order_status: result.data.order_status || "pending",
          customer_description: result.data.customer_description || "N/A",
          project_manager_order_status:
            result.data.project_manager_order_status || "N/A",
          project_manager_amount: result.data.project_manager_amount || "N/A",
          manager_name: result.data.manager_name || "N/A",
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

  return (
    <motion.div 
      className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/client-manager/customers"
          className="hover:text-orange-700 text-orange-500 flex flex-row items-center"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </Link>
        <div className="text-end font-bond text-lg text-gray-700 flex flex-row">
          <div className="font-bold me-3">Project Manager:</div>{" "}
          {customer.manager_name}
        </div>
      </div>
      <form>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          {[
            { label: "Order ID", value: customer.order_id },
            { label: "Cloth Name", value: customer.clothing_name },
            { label: "Priority", value: customer.priority },
            { label: "Order Status", value: customer.order_status },
            { label: "Customer Name", value: customer.fullName },
            { label: "Gender", value: customer.gender },
            { label: "Phone", value: customer.phone },
            { label: "Create Date", value: customer.date },
            { label: "Customer Email", value: customer.email },
          ].map((field, index) => (
            <motion.div key={index} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 10 }} 
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <label className="block text-gray-700 font-bold">{field.label}</label>
              <input
                type="text"
                value={field.value}
                readOnly
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
              />
            </motion.div>
          ))}
          <div className="">
            <div className="block text-gray-700 font-bold">Customer Description</div>
            <textarea
              rows={1}
              value={customer.customer_description}
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

        {customer.style_reference_images && (
          <motion.div 
            className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            transition={{ duration: 0.5 }}
          >
            <div className="">
              <label className="block text-gray-700 font-bold">Customer Style</label>
              {customer.style_reference_images === "" ? (
                <div>No image selected</div>
              ) : (
                <div>
                  <img
                    src={customer.style_reference_images}
                    alt="style_reference_images"
                    className="border w-24 h-24 border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50 cursor-pointer"
                    onClick={handleCustomerImageClick}
                  />
                </div>
              )}
            </div>

            {isCustomerModalOpen && (
              <motion.div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
                    className="lg:w-[400px] lg:h-[400px] w-80 h-80 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Image failed to load";
                    }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="w-full">
          <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">
            Measurements
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Bust", value: customer.bust },
              { label: "Waist", value: customer.waist },
              { label: "Hips", value: customer.hip },
              { label: "Shoulder Width", value: customer.shoulderWidth },
              { label: "Neck", value: customer.neck },
              { label: "Arm Length", value: customer.armLength },
              { label: "Back Length", value: customer.backLength },
              { label: "Front Length", value: customer.frontLength },
              { label: "High Bust", value: customer.highBust },
            ].map((measurement, index) => (
              <motion.div key={index} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }} 
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <label
                  htmlFor={measurement.label.toLowerCase().replace(" ", "")}
                  className="block text-sm font-medium text-gray-700"
                >
                  {measurement.label}
                </label>
                <input
                  type="number"
                  readOnly
                  id={measurement.label.toLowerCase().replace(" ", "")}
                  name={measurement.label.toLowerCase().replace(" ", "")}
                  value={measurement.value}
                  placeholder={measurement.label}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </form>
      <div className="mt-6 flex justify-end space-x-4">
        <Link
          href={`/client-manager/orders/${id}/edit`}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Edit
        </Link>
      </div>
      <div className="text-sm text-gray-700 text-center">Click edit to make changes</div>
    </motion.div>
  );
}