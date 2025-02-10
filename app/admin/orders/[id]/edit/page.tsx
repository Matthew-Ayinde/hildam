"use client";

import Spinner from "@/components/Spinner";
import { style } from "framer-motion/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function EditCustomer() {
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
    name: string;
    age: string;
    phone_number: string;
    email: string;
    bust: number;
    address: string;
    waist: number;
    hip: number;
    neck: number;
    gender: string;
    created_at: string;
    shoulder_width: number;
    arm_length: number;
    back_length: number;
    front_length: number;
    high_bust: number;
    style_reference_images: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    bust: "",
    address: "",
    waist: "",
    hip: "",
    neck: "",
    style_reference_images: "",
    hips: "",
    gender: "",
    order_status: "",
    date: "",
    shoulderWidth: "",
    armLength: "",
    backLength: "",
    frontLength: "",
    highBust: "",
    order_id: "",
    priority: "",
    clothing_name: "",
    clothing_description: "",
    customer_description: "",
    project_manager_order_status: "",
    project_manager_amount: "",
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file); // Convert file to preview URL
      setFormData((prev) => ({
        ...prev,
        style_reference_images: imageUrl, // Update form data
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchCustomer = async () => {
    setLoading(true);
    setError("");

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
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();
      setCustomer(result.data);
      setFormData({
        name: result.data.customer_name,
        age: result.data.age,
        phone: result.data.phone_number,
        email: result.data.customer_email,
        bust: result.data.bust,
        address: result.data.address,
        waist: result.data.waist,
        hip: result.data.hip,
        neck: result.data.neck,
        gender: result.data.gender,
        style_reference_images: result.data.style_reference_images,
        date: result.data.created_at,
        shoulderWidth: result.data.shoulder_width,
        armLength: result.data.arm_length,
        backLength: result.data.back_length,
        frontLength: result.data.front_length,
        highBust: result.data.high_bust,
        order_id: result.data.order_id,
        priority: result.data.priority,
        order_status: result.data.order_status,
        clothing_name: result.data.clothing_name,
        clothing_description: result.data.clothing_description,
        customer_description: result.data.customer_description,
        project_manager_order_status: result.data.project_manager_order_status,
        hips: result.data.hips,
        project_manager_amount: result.data.project_manager_amount,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    console.log("function called");
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/editorder/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      setSuccessMessage("Order updated successfully!");
      setTimeout(() => {
        router.push("/admin/orders");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
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
        Error: {error}
        <button onClick={fetchCustomer} className="text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      {successMessage && (
        <div className="fixed top-5 left-0 right-0 flex justify-center z-50">
          <div className="text-center bg-green-500 w-fit px-4 rounded text-white py-2 shadow-lg">
            {successMessage}
          </div>
        </div>
      )}
      <Link
        href={"/admin/orders"}
        className="hover:text-orange-700 text-orange-500 flex flex-row items-center mb-5"
      >
        <IoIosArrowBack size={30} />
        <div className="mx-2">Back to List</div>
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold">Order ID</label>
            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              disabled
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Cloth Name</label>
            <input
              type="text"
              name="clothing_name"
              value={formData.clothing_name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">
              Order Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-white"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">
              Order Status
            </label>
            <select
              name="order_status"
              value={formData.order_status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-white"
            >
              <option value="" disabled>
                Select Order Status
              </option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
        </div>

        {formData.style_reference_images && (
          <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
            <div>
              <label className="block text-gray-700 font-bold">
                Customer Style
              </label>
              <img
                src={formData.style_reference_images}
                alt="style_reference_images"
                className="border w-24 h-24 border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50 cursor-pointer"
                onClick={handleCustomerImageClick} // Open modal on click
              />
            </div>

            {isCustomerModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                onClick={handleCustomerCloseModal}
              >
                <div
                  className="bg-white rounded-lg p-4 flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={formData.style_reference_images}
                    alt="Style Reference"
                    className="lg:w-[400px] lg:h-[400px] w-80 h-80 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = ""; // Clear the image source
                      e.currentTarget.alt = "Image failed to load"; // Update alt text
                    }}
                  />

                  {/* Change Image Button */}
                  <div className="font-bold lg:text-xl text-lg text-gray-700 mt-1 lg:mt-3">
                    Change Image
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="lg:mt-4 mt-1 border border-gray-300 p-2 rounded-md cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full">
          {/* Measurement Fields */}
          <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">
            Measurements
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="bust"
                className="block text-sm font-medium text-gray-700"
              >
                Bust
              </label>
              <input
                type="number"
                id="bust"
                name="bust"
                value={formData.bust || ""}
                onChange={handleInputChange}
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
                id="waist"
                name="waist"
                value={formData.waist || ""}
                onChange={handleInputChange}
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
                id="hips"
                name="hips"
                value={formData.hips || ""}
                onChange={handleInputChange}
                placeholder="Hips"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                htmlFor="shoulderWidth"
                className="block text-sm font-medium text-gray-700"
              >
                Shoulder Width
              </label>
              <input
                type="number"
                id="shoulderWidth"
                name="shoulderWidth"
                value={formData.shoulderWidth || ""}
                onChange={handleInputChange}
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
                id="neck"
                name="neck"
                value={formData.neck || ""}
                onChange={handleInputChange}
                placeholder="Neck"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                htmlFor="armLength"
                className="block text-sm font-medium text-gray-700"
              >
                Arm Length
              </label>
              <input
                type="number"
                id="armLength"
                name="armLength"
                value={formData.armLength || ""}
                onChange={handleInputChange}
                placeholder="Arm Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                htmlFor="backLength"
                className="block text-sm font-medium text-gray-700"
              >
                Back Length
              </label>
              <input
                type="number"
                id="backLength"
                name="backLength"
                value={formData.backLength || ""}
                onChange={handleInputChange}
                placeholder="Back Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                htmlFor="frontLength"
                className="block text-sm font-medium text-gray-700"
              >
                Front Length
              </label>
              <input
                type="number"
                id="frontLength"
                name="frontLength"
                value={formData.frontLength || ""}
                onChange={handleInputChange}
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
                id="highBust"
                name="highBust"
                value={formData.highBust || ""}
                onChange={handleInputChange}
                placeholder="High Bust"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-2 hover:bg-orange-700 bg-orange-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
