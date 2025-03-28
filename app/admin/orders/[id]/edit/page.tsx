"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth

export default function EditCustomer() {
  interface ProjectManager {
    user_id: string;
    name: string;
  }

  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [errorManagers, setErrorManagers] = useState("");

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);

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
    phone_number: "",
    email: "",
    bust: "",
    address: "",
    waist: "",
    hips: "",
    neck: "",
    gender: "",
    style_reference_images: "",
    created_at: "",
    shoulder_width: "",
    arm_length: "",
    back_length: "",
    front_length: "",
    high_bust: "",
    order_id: "",
    priority: "",
    clothing_name: "",
    clothing_description: "",
    customer_description: "",
    project_manager_order_status: "",
    project_manager_amount: "",
    manager_id: "",
    manager_name: "",
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file); // Convert file to preview URL
      setPreviousImage(formData.style_reference_images); // Store previous image
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
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();
      setCustomer(result.data);
      setFormData({
        name: result.data.customer_name,
        age: result.data.age,
        phone_number: result.data.phone_number,
        email: result.data.customer_email,
        bust: result.data.bust,
        address: result.data.address,
        waist: result.data.waist,
        neck: result.data.neck,
        gender: result.data.gender,
        style_reference_images: result.data.style_reference_images,
        created_at: result.data.created_at,
        shoulder_width: result.data.shoulder_width,
        arm_length: result.data.arm_length,
        back_length: result.data.back_length,
        front_length: result.data.front_length,
        high_bust: result.data.high_bust,
        order_id: result.data.order_id,
        priority: result.data.priority,
        order_status: result.data.order_status,
        clothing_name: result.data.clothing_name,
        clothing_description: result.data.clothing_description,
        customer_description: result.data.customer_description,
        project_manager_order_status: result.data.project_manager_order_status,
        hips: result.data.hips,
        project_manager_amount: result.data.project_manager_amount,
        manager_id: result.data.manager_id,
        manager_name: result.data.manager_name,
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

  const fetchProjectManagers = async () => {
    setLoadingManagers(true);
    setErrorManagers("");

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projectmanagerlist`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project managers");
      }

      const result = await response.json();
      setProjectManagers(result.data);
    } catch (err) {
      setErrorManagers(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoadingManagers(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchProjectManagers(); // Fetch project managers when the component mounts
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const session = await getSession(); // Get session from NextAuth
      const accessToken = session?.user?.token; // Access token from session
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editorder/${id}`,
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
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
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
            <label className="block text-gray-700 font-bold">Project Manager</label>
            <select
              name="manager_id"
              value={formData.manager_id || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-white"
              disabled={loadingManagers}
            >
              <option value="" disabled>
                {loadingManagers ? "Loading..." : errorManagers ? "Error loading" : "Select Manager"}
              </option>
              {projectManagers.length > 0 ? (
                projectManagers.map((manager) => (
                  <option key={manager.user_id} value={manager.user_id}>
                    {manager.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Empty
                </option>
              )}
            </select>
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
              <div className="text-gray-700 text-sm">click to open</div>
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
                  {loadingImage ? (
                    <Spinner />
                  ) : (
                    <>
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
                        onChange={async (e) => {
                          setLoadingImage(true);
                          handleImageChange(e);
                          setLoadingImage(false);
                        }}
                      />
                    </>
                  )}
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
                htmlFor="shoulder_width"
                className="block text-sm font-medium text-gray-700"
              >
                Shoulder Width
              </label>
              <input
                type="number"
                id="shoulder_width"
                name="shoulder_width"
                value={formData.shoulder_width || ""}
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
                htmlFor="arm_length"
                className="block text-sm font-medium text-gray-700"
              >
                Arm Length
              </label>
              <input
                type="number"
                id="arm_length"
                name="arm_length"
                value={formData.arm_length || ""}
                onChange={handleInputChange}
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
                id="back_length"
                name="back_length"
                value={formData.back_length || ""}
                onChange={handleInputChange}
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
                id="front_length"
                name="front_length"
                value={formData.front_length || ""}
                onChange={handleInputChange}
                placeholder="Front Length"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
              />
            </div>
            <div>
              <label
                htmlFor="high_bust"
                className="block text-sm font-medium text-gray-700"
              >
                High Bust
              </label>
              <input
                type="number"
                id="high_bust"
                name="high_bust"
                value={formData.high_bust || ""}
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