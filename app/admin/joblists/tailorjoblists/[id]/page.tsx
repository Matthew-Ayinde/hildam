"use client";

import React from "react";
import Spinner from "../../../../../components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Next.js Image component
import { IoIosArrowBack } from "react-icons/io";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import Link from "next/link";
import { FaRegCircleXmark } from "react-icons/fa6";

export default function ShowCustomer() {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false); // New state to track upload status
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleCustomerImageClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  const router = useRouter();
  const { id } = useParams();

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
    formData.append("design_image", selectedImage);

    setIsUploading(true);
    setUploadMessage(null);
    setUploadError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/edittailorjob/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setImagePath(result.data.image_path);
      setUploadMessage("Image uploaded successfully");
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
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/sendtoprojectmanager/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_path: imagePath }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send image to project manager");
      }

      setUploadMessage("Image sent to project manager successfully");
      setSentSuccess(true);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSending(false);
    }

    router.push("/admin/joblists/tailorjoblists");
  };

  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
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
    tailor_image?: string;
    project_manager_approval?: string;
    style_reference_images?: string;
    customer_approval: string;
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
        `https://hildam.insightpublicis.com/api/tailorjoblists/${id}`,
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
      console.log("customer details: ", result);

      if (result.data) {
        const mappedCustomer: Customer = {
          fullName: result.data.customer_name,
          age: result.data.age,
          gender: result.data.gender,
          date: new Date().toLocaleDateString(),
          order_id: result.data.order_id,
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hips: result.data.hips || 0,
          shoulder_width: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          arm_length: result.data.arm_length || 0,
          back_length: result.data.back_length || 0,
          front_length: result.data.front_length || 0,
          customer_description: result.data.customer_description || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          clothing_description: result.data.clothing_description || "N/A",
          high_bust: result.data.high_bust || 0,
          tailor_image: result.data.tailor_image || null,
          project_manager_approval: result.data.project_manager_approval || null,
          customer_feedback: result.data.customer_feedback || null,
          style_reference_images: result.data.style_reference_images || null,
          customer_approval: result.data.customer_approval,
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

  console.log("customer approval", customer.project_manager_approval);

  return (
    <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">
      {/* Toast Notification */}
      {uploadMessage && (
        <div className="flex justify-center w-full">
          <div className="bg-green-500 text-white p-2 w-fit px-4 rounded mb-4 text-center">
            {uploadMessage}
          </div>
        </div>
      )}
      {uploadError && (
        <div className="flex justify-center w-full">
          <div className="bg-red-500 text-white p-2 w-fit px-4 rounded mb-4 text-center">
            {uploadError}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/joblists/tailorjoblists"
          className="hover:text-orange-700 text-orange-500 flex flex-row items-center mb-2"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </Link>
      </div>
      <form>
        <div className="text-2xl text-gray-700 font-bold mb-2">
          Tailor Job Information
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
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
            <label className="block text-gray-700 font-bold">Order Date</label>
            <input
              type="text"
              value={customer.date}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
          <div>
            <label className="block text-gray-700 font-bold">
              Customer Name
            </label>
            <input
              type="text"
              value={customer.fullName}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Gender</label>
            <input
              type="text"
              value={customer.gender}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Cloth Name</label>
            <textarea
              name="clothing_name"
              value={customer.clothing_name}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">
              Clothing Description
            </label>
            <textarea
              name="clothing_description"
              value={customer.clothing_description}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
              <div className="">
                <label className="block text-gray-700 font-bold">
                  Customer Style
                </label>
                <img
                  src={customer.style_reference_images}
                  alt="style_reference_images"
                  className="border w-24 h-24 border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50 cursor-pointer"
                  onClick={handleCustomerImageClick} // Open modal on click
                />
                <div className="text-sm my-2">Click to view</div>
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
                        e.currentTarget.src = ""; // Clear the image source
                        e.currentTarget.alt = "Image failed to load"; // Update alt text
                      }}
                    />
                    {/* <p className="text-red-500 text-center mt-2">
                    Image failed to load
                  </p> */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="block text-xl font-bold text-gray-700 mt-10 mb-4">
            Measurements
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
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
            </div>

            <div>
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
            </div>

            <div>
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
            </div>

            <div>
              <label
                htmlFor="shoulder_width"
                className="block text-sm font-medium text-gray-700"
              >
                Shoulder Width
              </label>
              <input
                type="number"
                readOnly
                id="shoulder_width"
                name="shoulder_width"
                value={customer.shoulder_width}
                placeholder="Shoulder Width"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>

            <div>
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
            </div>

            <div>
              <label
                htmlFor="arm_length"
                className="block text-sm font-medium text-gray-700"
              >
                Arm Length
              </label>
              <input
                type="number"
                readOnly
                id="arm_length"
                name="arm_length"
                value={customer.arm_length}
                placeholder="Arm Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>

            <div>
              <label
                htmlFor="back_length"
                className="block text-sm font-medium text-gray-700"
              >
                Back Length
              </label>
              <input
                type="number"
                readOnly
                id="back_length"
                name="back_length"
                value={customer.back_length}
                placeholder="Back Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>

            <div>
              <label
                htmlFor="front_length"
                className="block text-sm font-medium text-gray-700"
              >
                Front Length
              </label>
              <input
                type="number"
                readOnly
                id="front_length"
                name="front_length"
                value={customer.front_length}
                placeholder="Front Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>

            <div>
              <label
                htmlFor="highBust"
                className="block text-sm font-medium text-gray-700"
              >
                High Bust
              </label>
              <input
                type="number"
                readOnly
                id="highBust"
                name="highBust"
                value={customer.high_bust}
                placeholder="High Bust"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
          </div>
        </div>
      </form>

      <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">
        {/* Success/Error Notifications */}
        {uploadMessage && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex justify-center w-full">
            <div className="bg-green-500 text-white p-2 w-fit px-4 rounded mb-4 text-center">
              {uploadMessage}
            </div>
          </div>
        )}
        {uploadError && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 flex justify-center w-full">
            <div className="bg-red-500 text-white p-2 w-fit px-4 rounded mb-4 text-center">
              {uploadError}{" "}
              <button
                onClick={handleUploadImage}
                className="underline text-white"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="font-bold text-xl mt-5 text-gray-700">Image Style</div>

        {customer.project_manager_approval === "In Review" && (
          <div className="flex items-center mt-4">
            {/* Check if customer.tailor_image exists */}
            {customer.tailor_image && (
              <div className="mr-4">
                <Image
                  src={customer.tailor_image} // Assuming tailor_image is the URL of the image
                  alt="Tailor"
                  width={100}
                  height={100}
                  className="rounded" // Optional: Add a class if you want rounded edges
                />
              </div>
            )}
            <FaCheckCircle className="text-green-500 text-3xl" />
            <span className="ml-2 text-green-500 font-semibold">
              Style under review
            </span>
          </div>
        )}

        {customer.project_manager_approval === "Approved" && (
          <div className="flex items-center mt-4">
            {/* Check if customer.tailor_image exists */}
            {customer.tailor_image && (
              <div className="mr-4">
                <Image
                  src={customer.tailor_image} // Assuming tailor_image is the URL of the image
                  alt="Tailor"
                  width={100}
                  height={100}
                  className="rounded" // Optional: Add a class if you want rounded edges
                />
              </div>
            )}
            <FaCheckCircle className="text-green-500 text-3xl" />
            <span className="ml-2 text-green-500 font-semibold">
              Style accepted
            </span>
          </div>
        )}

        {customer.project_manager_approval === "Rejected" && (
          <div className="flex items-center mt-4">
            {/* Check if customer.tailor_image exists */}
            {customer.tailor_image && (
              <div className="mr-4">
                <Image
                  src={customer.tailor_image} // Assuming tailor_image is the URL of the image
                  alt="Tailor"
                  width={100}
                  height={100}
                  className="rounded" // Optional: Add a class if you want rounded edges
                />
              </div>
            )}
            <FaRegCircleXmark className="text-red-500 text-3xl" />
            <span className="ml-2 text-red-500 font-semibold">
              Style rejected
            </span>
          </div>
        )}
        {/* Upload Image Section */}
        {customer.project_manager_approval !== "Approved" && (
          <div className="mb-6">
          <label className="block text-gray-700 font-normal mb-2">
            {customer.tailor_image === null ? <div>Please upload an Image</div> : <div className="mt-2 font-bold">Edit Image</div>}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 rounded w-full"
          />
        </div>
        )}

        {imagePreview && (
          <div className="mb-4 flex flex-col items-center">
            <img
              src={imagePreview}
              alt="Selected"
              className="w-[200px] h-[200px] object-cover rounded border"
            />
            <button
              onClick={handleRemoveImage}
              className="mt-2 text-red-500 hover:text-red-700 text-sm font-semibold"
            >
              Remove Image
            </button>
          </div>
        )}

        {/* Upload Button */}
        {selectedImage && !imagePath && (
          <button
            onClick={handleUploadImage}
            disabled={isUploading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              isUploading ? "bg-gray-100" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isUploading ? <Spinner /> : "Upload Image"}
          </button>
        )}

        {/* Send to Project Manager Button */}
        {imagePath && !sentSuccess && (
          <button
            onClick={handleSendToProjectManager}
            disabled={isSending}
            className={`w-full py-2 rounded text-white font-semibold transition mt-4 ${
              isSending ? "bg-gray-100" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isSending ? <Spinner /> : "Send to Project Manager"}
          </button>
        )}

        {/* {customer.customer_approval === "Approved" && (
          <div className="flex items-center mt-4">
            <div className="font-bold">Customer Approval:</div>
            <span className="ml-2 text-green-500 font-semibold">
              Approved
            </span>
            <FaCheckCircle className="text-green-500 text-xl" />
          </div>
        )} */}

        
      </div>
    </div>
  );
}
