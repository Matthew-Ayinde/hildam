"use client";

import Spinner from "@/components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ShowCustomer() {

  const [price, setPrice] = useState(""); // State for price value
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false); // State for modal visibility

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
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/projectlists/${id}`, {
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
          manager_name: result.data.manager_name || "N/A",
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

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageClick = () => {
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
        {" "}
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
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/rejecttailorstyle/${id}`, {
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
              // tailor_job_image: undefined, // Remove the image
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
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/sendtocustomer/${id}`, {
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
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/editproject/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        //send price to the server as amount
        body: JSON.stringify({
          amount: price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to set price");
      }

      const result = await response.json();
      console.log(result);
      setUploadMessage("Price set successfully"); // Set notification message

      // Show toast notification for 5 seconds
      setTimeout(() => {
        setUploadMessage(null); // Clear notification message
      }, 5000);

    // closePriceModal();

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }

    handleApproveStyle();
    // closePriceModal();
  }


  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/joblists/projects")}
          className="text-blue-500 underline"
        >
          Back to List
        </button>
        <div className="text-end font-bond text-lg text-gray-700 flex flex-row">
          <div className="font-bold me-3">Head of Tailoring:</div>{" "}
          {customer.manager_name}
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
            <label className="block text-gray-700 font-bold">
              Clothing Item
            </label>
            <input
              type="text"
              value={customer.clothing_name}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">
              Order Status
            </label>
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
          <div className="w-full">
            <label className="block text-gray-700 font-bold">
              Clothing description
            </label>
            <textarea
              value={customer.clothing_description}
              readOnly
              rows={3}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            ></textarea>
          </div>
          <div className="w-full">
            <label className="block text-gray-700 font-bold">
              Customer description
            </label>
            <textarea
              value={customer.customer_description}
              readOnly
              rows={3}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            ></textarea>
          </div>

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
        <div className="w-full">
          <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">
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
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
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
              </div>
              <div className="w-1/3">
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


      <button onClick={openPriceModal} className="btn-open-modal">
        Open Price Modal
      </button>

      {/* Price Modal */}
      {isPriceModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closePriceModal}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <button
              onClick={closePriceModal}
              className="absolute bg-gray-100 border-red-500 py-2 px-4 rounded-lg top-2 right-2 text-xl text-red-500 hover:text-red-400"
            >
              Close
            </button> */}
            <div className="text-center text-xl font-bold mb-4">
              Set Price
            </div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={handelSetPrice}
            >
              Set Price
            </button>
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
            please click to view full image
          </div>
        )}
        {/* Display approval status directly under the image */}
        {customer.customer_approval === "Approved" && (
          <div className="text-green-500 mt-2">Style approved</div>
        )}
        {customer.customer_approval === "Rejected" && (
          <div className="text-red-500 mt-2">Style rejected</div>
        )}
        {/* {customer.customer_approval === null && customer.tailor_job_image !== null && (
          <div className="text-red-500 mt-2">Awaiting Approval from Customer</div>
        )} */}
        {customer.customer_approval === null && (
          <div className="text-red-500 mt-2">Awaiting review from customer</div>
        )}

        {/* customer feedback */}
        {customer.customer_feedback !== null && (
          <div className="mt-3">
            {/* <div className="text-red-500">Image Rejected by customer</div> */}
          <div className="text-xl font-bold">Customer Feedback</div>
          <div className=" py-2 px-3 bg-gray-50 rounded-lg w-1/2">
            {customer.customer_feedback}
          </div>
          </div>
        )}
        {customer.customer_feedback === "In Review" && (
          <div className="mt-3">
            <div>Status:</div>
           <div className="text-red-500 text-sm">Awaiting Confirmation from customer</div>
          </div>
        )}
      </div>

      

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 modal-overlay"
          onClick={handleModalClick}
        >
          <div className="bg-white p-4 rounded shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute bg-gray-100 border-red-500 py-2 px-4 rounded-lg top-2 right-2 text-xl text-red-500 hover:text-red-400"
            >
              Close
            </button>
            {imageLoading && <Spinner />}
            {imageError && <div className="text-red-500">Error loading images</div>}
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
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => {
                  // handleApproveStyle();
                  openPriceModal();
                  handelSetPrice();
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
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end space-x-4">
        <div
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => router.push(`/admin/joblists/projects/${id}/edit`)}
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
