"use client";

import { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import SkeletonLoader from "@/components/SkeletonLoader";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { getSession } from "next-auth/react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ProjectManager {
  user_id: string;
  name: string;
}

interface Customer {
  name: string;
  age: string;
  order_id: string;
  clothing_name: string;
  clothing_description: string;
  order_status: string;
  priority: string;
  shoulder_width: number;
  phone_number: string;
  email: string;
  bust: number;
  address: string;
  waist: number;
  hip: number;
  neck: number;
  shoulder: number;
  bustpoint: number;
  shoulder_to_underbust: number;
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
  style_reference_images: string;
  created_at: string;
  manager_id: string;
  manager_name: string;
  first_fitting_date: string | null;
  second_fitting_date: string | null;
  duration: string;
}

export default function EditCustomer() {
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [errorManagers, setErrorManagers] = useState("");

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);

  const router = useRouter();
  const { id } = useParams();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [firstFittingDate, setFirstFittingDate] = useState<Date | null>(null);
  const [secondFittingDate, setSecondFittingDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone_number: "",
    email: "",
    bust: 0,
    address: "",
    waist: 0,
    hip: 0,
    neck: 0,
    shoulder: 0,
    bustpoint: 0,
    shoulder_to_underbust: 0,
    round_under_bust: 0,
    half_length: 0,
    blouse_length: 0,
    sleeve_length: 0,
    round_sleeve: 0,
    dress_length: 0,
    chest: 0,
    round_shoulder: 0,
    skirt_length: 0,
    trousers_length: 0,
    round_thigh: 0,
    round_knee: 0,
    round_feet: 0,
    style_reference_images: "",
    created_at: "",
    manager_id: "",
    manager_name: "",
    order_status: "",
    shoulder_width: 0,
    clothing_name: "",
    clothing_description: "",
    priority: "",
    order_id: "",
    first_fitting_date: "",
    second_fitting_date: "",
    duration: "",
  });

  // --- Helper Functions ---

  // Converts input values to numbers if the input type is number.
  const parseInputValue = (name: string, value: string) => {
    const numericFields = [
      "bust",
      "waist",
      "hip",
      "neck",
      "shoulder",
      "bustpoint",
      "shoulder_to_underbust",
      "round_under_bust",
      "half_length",
      "blouse_length",
      "sleeve_length",
      "round_sleeve",
      "dress_length",
      "chest",
      "round_shoulder",
      "skirt_length",
      "trousers_length",
      "round_thigh",
      "round_knee",
      "round_feet",
      "shoulder_width",
    ];
    return numericFields.includes(name) ? parseFloat(value) || 0 : value;
  };

  // Inside your component state declarations:
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(formData.style_reference_images);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const parsedValue = parseInputValue(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      // Store the file temporarily and update the preview URL
      setSelectedFile(file);
      setPreviewUrl(imageUrl);
    }
  };

  // Function to keep the selected image
  const handleKeepImage = () => {
    // Update the formData with the new preview URL
    setFormData((prev) => ({
      ...prev,
      style_reference_images: previewUrl,
    }));
    setIsCustomerModalOpen(false);
  };

  // Function to cancel image selection and revert to the previous image
  const handleCancelImage = () => {
    // Reset preview URL and clear selected file
    setPreviewUrl(formData.style_reference_images);
    setSelectedFile(null);
    setIsCustomerModalOpen(false);
  };

  const handleCustomerImageClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };

  // --- Data Fetching Functions ---

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
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
        hip: result.data.hip,
        neck: result.data.neck,
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
        style_reference_images: result.data.style_reference_images,
        created_at: result.data.created_at,
        order_status: result.data.order_status,
        shoulder_width: result.data.shoulder_width,
        manager_id: result.data.manager_id,
        manager_name: result.data.manager_name,
        clothing_name: result.data.clothing_name,
        clothing_description: result.data.clothing_description,
        priority: result.data.priority,
        order_id: result.data.order_id,
        first_fitting_date: result.data.first_fitting_date || "",
        second_fitting_date: result.data.second_fitting_date || "",
        duration: result.data.duration || "",
      });

      setFirstFittingDate(
        result.data.first_fitting_date
          ? new Date(result.data.first_fitting_date)
          : null
      );
      setSecondFittingDate(
        result.data.second_fitting_date
          ? new Date(result.data.second_fitting_date)
          : null
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchProjectManagers = useCallback(async () => {
    setLoadingManagers(true);
    setErrorManagers("");
    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/headoftailoringlist`,
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
  }, []);

  useEffect(() => {
    fetchCustomer();
    fetchProjectManagers();
  }, [fetchCustomer, fetchProjectManagers]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) throw new Error("No access token found");

      const formDataToSend = new FormData();

      // Sync date fields into formData
      if (firstFittingDate) {
        formDataToSend.append(
          "first_fitting_date",
          firstFittingDate.toISOString().split("T")[0]
        );
      }
      if (secondFittingDate) {
        formDataToSend.append(
          "second_fitting_date",
          secondFittingDate.toISOString().split("T")[0]
        );
      }
      formDataToSend.append("duration", formData.duration + "");

      // Append remaining fields
      Object.keys(formData).forEach((key) => {
        if (key === "style_reference_images") {
          if (selectedFile) {
            formDataToSend.append("style_reference_images", selectedFile);
          }
        } else if (
          !["first_fitting_date", "second_fitting_date", "duration"].includes(
            key
          )
        ) {
          formDataToSend.append(
            key,
            formData[key as keyof typeof formData] + ""
          );
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editorder/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Failed to update order");

      setSuccessMessage("Order updated successfully!");
      setTimeout(() => router.push("/admin/orders"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

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
        Error: {error}
        <button onClick={fetchCustomer} className="text-blue-500 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
        {successMessage && (
          <div className="fixed top-5 left-0 right-0 flex justify-center z-50">
            <div className="text-center bg-green-500 w-fit px-4 rounded text-white py-2 shadow-lg">
              {successMessage}
            </div>
          </div>
        )}
        <Link
          href="/admin/orders"
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
              <label className="block text-gray-700 font-bold">
                Cloth Name
              </label>
              <input
                type="text"
                name="clothing_name"
                value={formData.clothing_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold">Priority</label>
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
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold">
                Clothing Description
              </label>
              <textarea
                name="clothing_description"
                rows={1}
                value={formData.clothing_description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
              />
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
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-bold">
                Head of Tailoring
              </label>
              <select
                name="manager_id"
                value={formData.manager_id || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-white"
                disabled={loadingManagers}
              >
                <option value="" disabled>
                  {loadingManagers
                    ? "Loading..."
                    : errorManagers
                    ? "Error loading"
                    : "Select Manager"}
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
            <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md mt-6">
              <div>
                <label className="block text-gray-700 font-bold">
                  Customer Style
                </label>
                <img
                  src={formData.style_reference_images}
                  alt="Customer style reference"
                  className="border w-24 h-24 border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50 cursor-pointer"
                  onClick={handleCustomerImageClick}
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
                            e.currentTarget.src = "";
                            e.currentTarget.alt = "Image failed to load";
                          }}
                        />
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={handleKeepImage}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Keep
                          </button>
                          <button
                            onClick={handleCancelImage}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="lg:mt-4 mt-1 border border-gray-300 p-2 rounded-md cursor-pointer"
                          onChange={handleImageChange}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full">
            <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">
              Measurements
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Bust", name: "bust" },
                { label: "Waist", name: "waist" },
                { label: "Hip", name: "hip" },
                { label: "Bust Point", name: "bustpoint" },
                {
                  label: "Shoulder to Underbust",
                  name: "shoulder_to_underbust",
                },
                { label: "Round Under Bust", name: "round_under_bust" },
                { label: "Half Length", name: "half_length" },
                { label: "Blouse Length", name: "blouse_length" },
                { label: "Sleeve Length", name: "sleeve_length" },
                { label: "Round Sleeve", name: "round_sleeve" },
                { label: "Dress Length", name: "dress_length" },
                { label: "Chest", name: "chest" },
                { label: "Round Shoulder", name: "round_shoulder" },
                { label: "Skirt Length", name: "skirt_length" },
                { label: "Trousers Length", name: "trousers_length" },
                { label: "Round Thigh", name: "round_thigh" },
                { label: "Round Knee", name: "round_knee" },
                { label: "Round Feet", name: "round_feet" },
              ].map((measurement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <label
                    htmlFor={measurement.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {measurement.label}
                  </label>
                  <input
                    type="number"
                    id={measurement.name}
                    name={measurement.name}
                    value={formData[measurement.name as keyof typeof formData] || ""}
                    onChange={handleInputChange}
                    placeholder={measurement.label}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fitting Section */}
          <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md mt-6">
            <div className="text-2xl font-bold text-gray-700 mb-4">
              Add other details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Fitting Date
                </label>
                <DatePicker
                  selected={firstFittingDate}
                  onChange={(date) => {
                    setFirstFittingDate(date);
                    setFormData((prev) => ({
                      ...prev,
                      first_fitting_date: date
                        ? date.toISOString().split("T")[0]
                        : "",
                    }));
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select first fitting date"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Second Fitting Date
                </label>
                <DatePicker
                  selected={secondFittingDate}
                  onChange={(date) => {
                    setSecondFittingDate(date);
                    setFormData((prev) => ({
                      ...prev,
                      second_fitting_date: date
                        ? date.toISOString().split("T")[0]
                        : "",
                    }));
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select second fitting date"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
                {secondFittingDate &&
                  firstFittingDate &&
                  secondFittingDate < firstFittingDate && (
                    <p className="text-red-500 text-sm mt-1">
                      Second fitting date must be after the first.
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  placeholder="Enter number of days"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
