"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import SkeletonLoader from "@/components/SkeletonLoader";

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
    gender: string;
    phone: string;
    date: string;
    customer_email: string;
    address: string;
    bust: number;
    waist: number;
    hip: number;
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
    order_id: string;
    priority: string;
    order_status: string;
    customer_description: string;
    first_fitting_date: string;
    second_fitting_date: string;
    customer_name: string;

  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
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
          shoulder: result.data.shoulder,
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
          order_id: result.data.order_id,
          priority: result.data.priority,
          order_status: result.data.order_status,
          customer_description: result.data.customer_description,
          date: result.data.date,
          first_fitting_date: result.data.first_fitting_date,
          second_fitting_date: result.data.second_fitting_date,
          customer_name: result.data.customer_name,
          customer_email: result.data.customer_email,
          gender: "",
          phone: "",
          address: ""
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
      className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/customers"
          className="hover:text-orange-700 text-orange-500 flex flex-row items-center"
        >
          <IoIosArrowBack />
          <div className="mx-2">Back to List</div>
        </Link>
      </div>
      <form>
        <div className="block text-2xl my-2 font-bold text-gray-700">
          Order Information
        </div>
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
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
          <div className="">
            <div className="block text-gray-700 font-bold">
              Customer Description
            </div>
            <textarea
              rows={1}
              value={customer.customer_description}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div className="">
            <div className="block text-gray-700 font-bold">
              Clothing Description
            </div>
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
              <label className="block text-gray-700 font-bold">
                Customer Style
              </label>
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
          <div className="block text-xl font-bold text-gray-700 mt-10 mb-1">
            Measurements
          </div>

          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          href={`/admin/orders/${id}/edit`}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Edit
        </Link>
      </div>
      <div className="text-sm text-gray-700 text-center">
        Click edit to make changes
      </div>
    </motion.div>
  );
}
