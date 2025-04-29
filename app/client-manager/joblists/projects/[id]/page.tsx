"use client";

import Spinner from "../../../../../components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";

export default function ShowCustomer() {

  const [price, setPrice] = useState(""); // State for price value
  // Add this state for error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false); // State for modal visibility
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const openPriceModal = () => {
    setIsPriceModalOpen(true); // Open the price modal
  };

  const closePriceModal = () => {
    setIsPriceModalOpen(false); // Close the price modal
  };

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleCustomerImageClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  const router = useRouter();
  const { id } = useParams();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    fullName: string;
    clothing_name: string;
    order_status: string;
    manager_name: string;
    date: string;
    email: string;
    clothing_description: string;
    customer_description: string;
    address: string;
    bust: number;
    waist: number;
    hips: number;
    shoulderWidth: number;
    neck: number;
    armLength: number;
    backLength: number;
    frontLength: number;
    order_id: string;
    high_bust: string;
    tailor_job_image?: string;
    style_reference_images?: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projectlists/${id}`, {
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
          fullName: result.data.customer_name,
          clothing_name: result.data.clothing_name,
          date: new Date().toLocaleDateString(),
          bust: Number(result.data.bust) || 0,
          waist: Number(result.data.waist) || 0,
          hips: Number(result.data.hips) || 0,
          shoulderWidth: Number(result.data.shoulder_width) || 0,
          neck: Number(result.data.neck) || 0,
          armLength: Number(result.data.arm_length) || 0,
          high_bust: String(result.data.high_bust) || "0",
          backLength: Number(result.data.back_length) || 0,
          frontLength: Number(result.data.front_length) || 0,
          order_id: result.data.order_id,
          order_status: result.data.order_status,
          email: "",
          manager_name: result.data.manager_name || "Not Assigned",
          clothing_description: result.data.clothing_description || "",
          customer_description: result.data.customer_description || "",
          address: "",
          tailor_job_image: result.data.tailor_job_image || null,
          customer_feedback: result.data.customer_feedback || null,
          customer_approval: result.data.customer_approval || null,
          style_reference_images: result.data.style_reference_images || null,
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

  const [realdata, setRealdata] = useState({
    manager_id: "",
  });

  const [managers, setManagers] = useState<
    {
      id: string;
      user_id: string;
      name: string;
    }[]
  >([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(
    null
  );

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setRealdata({
      ...realdata,
      [e.target.name]: e.target.value,
    });
  };

  const fetchManagers = async () => {
    setLoadingManagers(true);
    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/headoftailoringlist`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch managers");
      }

      const result = await response.json();
      setManagers(result.data);
      if (customer && typeof customer.manager_id === "string") {
        setSelectedManagerId(customer.manager_id); // Pre-select the current manager
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoadingManagers(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchManagers(); // Fetch managers when the component mounts
  }, [id]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    setShowModal(true);
    setImageLoading(true); // Reset loading state when opening modal
  };

  const closeModal = () => {
    setShowModal(false);
    setImageError(false); // Reset image error state
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // Close modal if clicking outside of it
    const target = e.target as HTMLElement;
    if (target.classList.contains("modal-overlay")) {
      closeModal();
    }
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

  const handleRejectStyle = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/rejecttailorstyle/${id}`, {
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
      setUploadMessage("Image rejected"); // Set notification message

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
  };

  const handleApproveStyle = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/sendtocustomer/${id}`, {
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
      setUploadMessage("Image rejected"); // Set notification message

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
  };

  const handelSetPrice = async () => {
    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editproject/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to set price");
      }

      const result = await response.json();
      console.log(result);
      setSuccessMessage("Price set successfully"); // Set success message

      // Show success message for 3 seconds before redirecting
      setTimeout(() => {
        setSuccessMessage(null); // Clear success message
        router.push("/admin/joblists/projects"); // Redirect after 3 seconds
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message); // Set error message
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }

    handleApproveStyle();
    closePriceModal();
  };

  // Add this block at the top of your return statement
  {
    successMessage && (
      <div className="bg-green-500 text-white text-center p-4 mb-4">
        {successMessage}
      </div>
    );
  }

  {
    errorMessage && (
      <div className="bg-red-500 text-white text-center p-4 mb-4">
        {errorMessage}
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  const handleManagerChange = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editproject/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(realdata),
      });

      // Log the response for debugging
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }

      router.push("/admin/joblists/projects");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/joblists/projects"
          className="hover:text-orange-700 text-orange-500 flex flex-row items-center"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </Link>
        <div className="hidden lg:flex text-gray-700 text-sm">
          Click <div className="font-bold mx-1"> Edit </div> to modify the
          order.
        </div>
        <div className="text-end font-bold text-lg text-gray-700 flex flex-row">
          <div className="font-bold me-3">Head of Tailoring:</div>{" "}
          {customer.manager_name}
        </div>
      </div>
      <form>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-gray-700 font-bold">Order ID</label>
            <input
              type="text"
              value={customer.order_id}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-gray-700 font-bold">
              Clothing Item
            </label>
            <input
              type="text"
              value={customer.clothing_name}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-gray-700 font-bold">
              Order Status
            </label>
            <input
              type="text"
              value={customer.order_status || "pending"}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-700 font-bold">Create Date</label>
            <input
              type="text"
              value={customer.date}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <label className="block text-gray-700 font-bold">
              Clothing description
            </label>
            <textarea
              value={customer.clothing_description}
              readOnly
              rows={3}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            ></textarea>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full"
          >
            <label className="block text-gray-700 font-bold">
              Customer description
            </label>
            <textarea
              value={customer.customer_description}
              readOnly
              rows={3}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            ></textarea>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md"
          >
            <div>
              <label className="block text-gray-700 font-bold">
                Customer Style
              </label>
              <img
                src={customer.style_reference_images}
                alt="style_reference_images"
                className="border w-24 h-24 border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50 cursor-pointer"
                onClick={handleCustomerImageClick}
              />
              <div className="text-sm">Please click to open</div>
            </div>

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
                    className="w-[500px] h-[500px] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Image failed to load";
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
        <div className="w-full">
          <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">
            Measurements
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap -mx-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="bust"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bust
                </label>
                <input
                  type="number"
                  readOnly
                  id="bust"
                  name="bust"
                  value={customer.bust}
                  placeholder="Bust"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="waist"
                  className="block text-sm font-medium text-gray-700"
                >
                  Waist
                </label>
                <input
                  type="number"
                  readOnly
                  id="waist"
                  name="waist"
                  value={customer.waist}
                  placeholder="Waist"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="hips"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hips
                </label>
                <input
                  type="number"
                  readOnly
                  id="hips"
                  name="hips"
                  value={customer.hips}
                  placeholder="Hips"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="shoulderWidth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Shoulder Width
                </label>
                <input
                  type="number"
                  readOnly
                  id="shoulderWidth"
                  name="shoulderWidth"
                  value={customer.shoulderWidth}
                  placeholder="Shoulder Width"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="neck"
                  className="block text-sm font-medium text-gray-700"
                >
                  Neck
                </label>
                <input
                  type="number"
                  readOnly
                  id="neck"
                  name="neck"
                  value={customer.neck}
                  placeholder="Neck"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="armLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Arm Length
                </label>
                <input
                  type="number"
                  readOnly
                  id="armLength"
                  name="armLength"
                  value={customer.armLength}
                  placeholder="Arm Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="backLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Back Length
                </label>
                <input
                  type="number"
                  readOnly
                  id="backLength"
                  name="backLength"
                  value={customer.backLength}
                  placeholder="Back Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
                <label
                  htmlFor="frontLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Front Length
                </label>
                <input
                  type="number"
                  readOnly
                  id="frontLength"
                  name="frontLength"
                  value={customer.frontLength}
                  placeholder="Front Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4"
              >
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
              </motion.div>
            </div>
          </div>
        </div>
      </form>

      {isPriceModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closePriceModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center text-2xl font-bold mb-6 text-gray-800">
              Set Price
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="bg-gray-200 text-gray-700 px-3 py-2">₦</span>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full border-none text-gray-700 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              />
            </div>
            <button
              className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              onClick={handelSetPrice}
            >
              Set Price
            </button>
            {successMessage && (
              <div className="mt-4 text-green-600 text-center text-sm">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Tailor Job Image</h2>
        {!customer.tailor_job_image && (
          <div className="text-gray-500">Awaiting review</div>
        )}
        {imageError && <div className="text-red-500">Error loading Images</div>}
        {customer.tailor_job_image && !imageError && (
          <div onClick={handleImageClick} className="cursor-pointer w-fit">
            <Image
              src={customer.tailor_job_image}
              alt="Tailor Job Image"
              width={100}
              height={100}
              className="rounded"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="text-xs">click to view image</div>
          </div>
        )}
        {customer.customer_approval === "Approved" && (
          <div className="text-green-500 mt-2">Style approved</div>
        )}
        {customer.customer_approval === "In Review" && (
          <div className="font-bold mt-2">Awaiting review from customer</div>
        )}
        {customer.customer_approval === null &&
          customer.tailor_job_image !== null && (
            <div className="font-bold mt-2">Please review Image</div>
          )}
        {customer.customer_feedback !== null && (
          <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
            <div className="my-4 text-red-600 font-semibold text-lg">
              Style Rejected
            </div>
            <div className="text-xl font-bold text-gray-800">
              Customer Feedback
            </div>
            <div className="mt-2 py-3 px-4 bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg shadow-inner">
              {customer.customer_feedback}
            </div>
          </div>
        )}
        {customer.customer_feedback === "In Review" && (
          <div className="mt-3">
            <div>Status:</div>
            <div className="text-red-500 text-sm">
              Awaiting Confirmation from customer
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 modal-overlay"
          onClick={handleModalClick}
        >
          <div
            className="bg-white p-4 rounded shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {imageError && (
              <div className="text-red-500">Error loading images</div>
            )}
            {customer.tailor_job_image && !imageError && (
              <Image
                src={customer.tailor_job_image}
                alt="Tailor Job Image"
                width={400}
                height={400}
                className="rounded"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            {customer.customer_approval === null && (
              <div className="mt-4 flex justify-between">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => {
                    openPriceModal();
                    closeModal();
                  }}
                >
                  Send to Customer
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => {
                    handleRejectStyle();
                    closeModal();
                  }}
                >
                  Reject
                </button>
              </div>
            )}
            {customer.customer_approval === "Rejected" && (
              <div className="mt-4 flex justify-between">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => {
                    openPriceModal();
                    closeModal();
                  }}
                >
                  Send to Customer
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => {
                    handleRejectStyle();
                    closeModal();
                  }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-4">
        <Link
          href={`/admin/joblists/projects/${id}/edit`}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
