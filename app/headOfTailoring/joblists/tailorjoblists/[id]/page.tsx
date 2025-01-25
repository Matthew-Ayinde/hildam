"use client";

import Spinner from "@/components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Next.js Image component
import { IoIosArrowBack } from "react-icons/io";

export default function ShowCustomer() {
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleCustomerImageClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isImageUploaded, setIsImageUploaded] = useState(false); // New state to track upload status

  const router = useRouter();
  const { id } = useParams();

  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    fullName: string;
    age: number;
    gender: string;
    date: string;
    address: string;
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
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);

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
          project_manager_approval:
            result.data.project_manager_approval || null,
          customer_feedback: result.data.customer_feedback || null,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("design_image", selectedImage);

    setLoading(true);
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
      console.log(result);
      setImagePath(result.data.image_path);
      setUploadMessage("Image uploaded successfully!");
      setIsImageUploaded(true); // Set image upload status to true

      setTimeout(() => {
        setUploadMessage(null);
      }, 5000);

      setSelectedImage(null);
    } catch (err) {
      if (err instanceof Error) {
        setUploadError(err.message);
      } else {
        setUploadError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendToProjectManager = async () => {
    if (!imagePath) return;

    setLoading(true);
    setError(null);

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
          body: JSON.stringify({
            image_path: imagePath,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send image to project manager");
      }

      const result = await response.json();
      console.log(result);
      setUploadMessage("Image sent to project manager successfully!");

      setTimeout(() => {
        setUploadMessage(null);
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
    <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">
      {/* Toast Notification */}
      {uploadMessage && (
        <div className="flex justify-center w-full">
          <div className="bg-green-500 text-white p-2 w-52 max-w-96 rounded mb-4 text-center">
            {uploadMessage}
          </div>
        </div>
      )}
      {uploadError && (
        <div className="flex justify-center w-full">
          <div className="bg-red-500 text-white p-2 w-52 max-w-96 rounded mb-4 text-center">
            {uploadError}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() =>
            router.push("/headoftailoring/joblists/tailorjoblists")
          }
          className="hover:text-blue-500 text-orange-500 flex flex-row items-center mb-2"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </button>
      </div>
      <form>
        <div className="text-2xl text-gray-700 font-bold mb-2">
          Tailor Job Information
        </div>
        <div className="grid grid-cols-2 gap-6 mb-5">
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
          <div className="block text-xl font-bold text-gray-700 mt-10 mb-1">
            Measurements
          </div>
          <div className="mb-4">
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
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
              <div className="w-1/3">
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
              <div className="w-1/3">
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
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
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
              <div className="w-1/3">
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
              <div className="w-1/3">
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
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
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
              <div className="w-1/3">
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
              <div className="w-1/3">
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
        </div>
      </form>
      <div className="text-gray-700">
        <div className="font-bold text-xl">Image Style</div>
        {/* {customer.project_manager_approval === null || customer.project_manager_approval === 'In Review' && ( */}

        <div>
          <div className="my-2">Attach proposed images style</div>
          {!isImageUploaded && ( // Conditionally render input and button
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 block w-full text-sm text-gray-500"
              />
              <button
                onClick={handleUploadImage}
                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded"
              >
                Upload Image
              </button>
            </>
          )}
        </div>

        {loading && <div className="text-gray-500">Loading...</div>}
        {selectedImage && (
          <div className="flex items-center mt-4">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt={selectedImage.name}
              className="h-24 w-24 rounded-lg object-cover mr-4"
            />
            <span className="text-gray-700">{selectedImage.name}</span>
          </div>
        )}
        {isImageUploaded &&
          imagePath && ( // Show uploaded image
            <div className="mt-4">
              <img
                src={imagePath}
                alt="Uploaded"
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="text-gray-700 mt-2">
                Image sent, awaiting approval
              </div>
              <button
                onClick={handleSendToProjectManager}
                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded"
                disabled={loading}
              >
                Send to Project Manager
              </button>
              {uploadMessage && (
                <div className="text-green-500 mt-2">{uploadMessage}</div>
              )}
            </div>
          )}
        {customer.tailor_image && (
          <div className="mt-4">
            <Image
              src={customer.tailor_image}
              alt="Tailor Image"
              width={100}
              height={100}
              className="rounded-lg"
            />
            {customer.project_manager_approval === "In Review" && (
              <div className="text-red-500 mt-2">Image pending approval</div>
            )}
            {customer.project_manager_approval === "Rejected" && (
              <div className="text-red-500 mt-2">
                Image rejected by project manager
                <button
                  className="ml-2 text-blue-500 underline"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePath(null);
                    setIsImageUploaded(false);
                  }}
                >
                  Please upload another image
                </button>
              </div>
            )}

            {/* customer feedback */}
            {customer.customer_feedback !== null && (
              <div className="mt-3">
                <div className="text-red-500">Image Rejected by customer</div>
                <div className="text-xl font-bold">Customer Feedback</div>
                <div className=" py-2 px-3 bg-gray-50 rounded-lg w-1/2">
                  {customer.customer_feedback}
                </div>
              </div>
            )}
          </div>
        )}
        {customer.tailor_image === null && (
          <div className="mt-4 text-gray-500">Please upload an image</div>
        )}
      </div>
    </div>
  );
}
