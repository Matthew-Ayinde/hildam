  "use client";

  import React from "react";
  import Spinner from "@/components/Spinner";
  import { useRouter, useParams } from "next/navigation";
  import { useEffect, useState } from "react";
  import Image from "next/image"; // Import Next.js Image component
  import { IoIosArrowBack } from "react-icons/io";
  import { FaCheckCircle, FaRegCircle, FaUserTie, FaSearch } from "react-icons/fa";
  import Link from "next/link";
  import { FaRegCircleXmark } from "react-icons/fa6";
  import { motion } from "framer-motion"; // Import Framer Motion
  import { getSession } from "next-auth/react";
  import { FaRegClock } from "react-icons/fa";

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
    const [isAssignSectionVisible, setIsAssignSectionVisible] = useState(false);

    // Holds the list we fetch from the server
const [tailorOptions, setTailorOptions] = useState<
{
  user_id: any; id: number; name: string; email: string 
}[]
>([]);


// Loading + error flags
const [tailorsLoading, setTailorsLoading] = useState(false);
const [tailorsError, setTailorsError] = useState<string | null>(null);

const fetchTailors = async () => {
  setTailorsLoading(true);
  setTailorsError(null);
  try {
    // 1️⃣ Get your NextAuth session
    const session = await getSession();
    const token = session?.user?.token;
    if (!token) throw new Error("Not authenticated");

    // 2️⃣ Call the API
    const res = await fetch(
      "https://hildam.insightpublicis.com/api/listoftailors",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    // 3️⃣ Parse JSON and map into the shape you need
    const json = await res.json();
    const list = (json.data as any[]).map((t) => ({
      id: Number(t.id),
      name: t.name,
      email: t.email,
      user_id: t.user_id,
    }));

    // 4️⃣ Save into state
    setTailorOptions(list);
  } catch (err) {
    setTailorsError(err instanceof Error ? err.message : "Unknown error");
  } finally {
    setTailorsLoading(false);
  }
};

useEffect(() => {
  

  fetchTailors();
}, []);// empty deps → runs once

const [assignedTailors, setAssignedTailors] = useState<{ name: string; email: string }[]>([]);

const fetchAssignedTailors = async () => {
  try {
    const session = await getSession();
    const accessToken = session?.user?.token;
    const response = await fetch(`https://hildam.insightpublicis.com/api/tailorjoblists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch assigned tailors");
    }

    const result = await response.json();
    const { tailor_names, tailor_emails } = result.data;

    // Map the names and emails into an array of objects
    const tailors = tailor_names.map((name: any, index: string | number) => ({
      name,
      email: tailor_emails[index],
    }));

    setAssignedTailors(tailors);
  } catch (error) {
    console.error("Error fetching assigned tailors:", error);
  }
};

    
      // pre-select James Carter (id:1) and Sophia Bennett (id:2)
const [selectedTailors, setSelectedTailors] = useState<number[]>([1, 2]);

    const [isAssigning, setIsAssigning] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtered tailor list based on search
    const filteredTailors = tailorOptions.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Toggle tailor selection
    const toggleTailor = (tailorId: number) => {
      setSelectedTailors(prev =>
        prev.includes(tailorId) ? prev.filter(id => id !== tailorId) : [...prev, tailorId]
      );
    };

    

const handleAssignTailors = async () => {
  if (selectedTailors.length === 0) return;
  setIsAssigning(true);
  try {
    const session = await getSession();
    const accessToken = session?.user?.token;

    // Prepare the tailor IDs to send
    const tailorIds = selectedTailors.map(tailorId => {
      const tailor = tailorOptions.find(t => t.id === tailorId);
      return tailor ? tailor.user_id : null; // Get user_id for each selected tailor
    }).filter(id => id !== null); // Filter out any null values

    const res = await fetch(
      `https://hildam.insightpublicis.com/api/edittailorjob/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ tailor_id: tailorIds }) // Send the user_ids
      }
    );

    if (!res.ok) throw new Error("Failed to assign tailors");
    setUploadMessage("Tailors assigned successfully");
  } catch (err) {
    setUploadError(err instanceof Error ? err.message : "Unknown error");
  } finally {
    setIsAssigning(false);
  }

    
};

    const fadeInUp = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    };

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
        const session = await getSession(); // Get session from NextAuth
        const accessToken = session?.user?.token; // Access token from session
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
        const session = await getSession(); // Get session from NextAuth
        const accessToken = session?.user?.token; // Access token from session
        const response = await fetch(
          `https://hildam.insightpublicis.com/api/sendtoorder/${id}`,
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

      router.push("/admin/joblists/tailorjoblists/jobs");
    };

    interface Customer {
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
      client_manager_approval: string;
      hip: number;
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
      assigned_tailors?: { id: number; name: string; email: string }[];
      client_manager_feedback?: string;
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
            project_manager_approval:
              result.data.project_manager_approval || null,
            client_manager_feedback: result.data.client_manager_feedback || null,
            style_reference_images: result.data.style_reference_images || null,
            client_manager_approval: result.data.client_manager_approval,
            hip: result.data.hip || 0,
            shoulder: result.data.shoulder || 0,
            bustpoint: result.data.bustpoint || 0,
            shoulder_to_underbust: result.data.shoulder_to_underbust || 0,
            round_under_bust: result.data.round_under_bust || 0,
            half_length: result.data.half_length || 0,
            blouse_length: result.data.blouse_length || 0,
            sleeve_length: result.data.sleeve_length || 0,
            round_sleeve: result.data.round_sleeve || 0,
            dress_length: result.data.dress_length || 0,
            chest: result.data.chest || 0,
            round_shoulder: result.data.round_shoulder || 0,
            skirt_length: result.data.skirt_length || 0,
            trousers_length: result.data.trousers_length || 0,
            round_thigh: result.data.round_thigh || 0,
            round_knee: result.data.round_knee || 0,
            round_feet: result.data.round_feet || 0,
            assigned_tailors: result.data.assigned_tailors || []
          };
          setCustomer(mappedCustomer);

          // Fetch assigned tailors after setting customer
  fetchAssignedTailors();

          
        // ← seed the UI selection with whatever the API tells you
        setSelectedTailors((mappedCustomer.assigned_tailors ?? []).map(t => t.id));
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
        {(uploadMessage || uploadError) && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`p-2 w-fit px-4 rounded mb-4 text-center 
        ${uploadMessage ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
              {uploadMessage || uploadError}
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex items-center justify-between mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/admin/joblists/tailorjoblists/jobs"
            className="hover:text-orange-700 text-orange-500 flex flex-row items-center mb-2"
          >
            <IoIosArrowBack size={30} />
            <div className="mx-2">Back to List</div>
          </Link>
        </motion.div>
        <form>
          <motion.div
            className="text-2xl text-gray-700 font-bold mb-2"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            Tailor Job Information
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
            {[
              { label: "Order ID", value: customer.order_id },
              { label: "Order Date", value: customer.date },
              { label: "Customer Name", value: customer.fullName },
              { label: "Gender", value: customer.gender },
            ].map((field, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block text-gray-700 font-bold">Cloth Name</label>
              <textarea
                name="clothing_name"
                value={customer.clothing_name}
                readOnly
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label className="block text-gray-700 font-bold">
                Clothing Description
              </label>
              <textarea
                name="clothing_description"
                value={customer.clothing_description}
                readOnly
                className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
              />
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
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
                        className="w-[400px] h-[400px] object-cover"
                        onError={(e) => {
                          e.currentTarget.src = ""; // Clear the image source
                          e.currentTarget.alt = "Image failed to load"; // Update alt text
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <motion.div
            className="w-full"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="block text-xl font-bold text-gray-700 mt-10 mb-4">
              Measurements
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Bust", value: customer.bust, id: "bust" },
                { label: "Waist", value: customer.waist, id: "waist" },
                { label: "Hips", value: customer.hips, id: "hips" },
                {
                  label: "Shoulder Width",
                  value: customer.shoulder_width,
                  id: "shoulder_width",
                },
                { label: "Neck", value: customer.neck, id: "neck" },
                {
                  label: "Arm Length",
                  value: customer.arm_length,
                  id: "arm_length",
                },
                {
                  label: "Back Length",
                  value: customer.back_length,
                  id: "back_length",
                },
                {
                  label: "Front Length",
                  value: customer.front_length,
                  id: "front_length",
                },
                { label: "High Bust", value: customer.high_bust, id: "highBust" },
                { label: "Hip", value: customer.hip, id: "hip" },
                { label: "Shoulder", value: customer.shoulder, id: "shoulder" },
                {
                  label: "Bust Point",
                  value: customer.bustpoint,
                  id: "bustpoint",
                },
                {
                  label: "Shoulder to Underbust",
                  value: customer.shoulder_to_underbust,
                  id: "shoulder_to_underbust",
                },
                {
                  label: "Round Under Bust",
                  value: customer.round_under_bust,
                  id: "round_under_bust",
                },
                {
                  label: "Half Length",
                  value: customer.half_length,
                  id: "half_length",
                },
                {
                  label: "Blouse Length",
                  value: customer.blouse_length,
                  id: "blouse_length",
                },
                {
                  label: "Sleeve Length",
                  value: customer.sleeve_length,
                  id: "sleeve_length",
                },
                {
                  label: "Round Sleeve",
                  value: customer.round_sleeve,
                  id: "round_sleeve",
                },
                {
                  label: "Dress Length",
                  value: customer.dress_length,
                  id: "dress_length",
                },
                { label: "Chest", value: customer.chest, id: "chest" },
                {
                  label: "Round Shoulder",
                  value: customer.round_shoulder,
                  id: "round_shoulder",
                },
                {
                  label: "Skirt Length",
                  value: customer.skirt_length,
                  id: "skirt_length",
                },
                {
                  label: "Trousers Length",
                  value: customer.trousers_length,
                  id: "trousers_length",
                },
                {
                  label: "Round Thigh",
                  value: customer.round_thigh,
                  id: "round_thigh",
                },
                {
                  label: "Round Knee",
                  value: customer.round_knee,
                  id: "round_knee",
                },
                {
                  label: "Round Feet",
                  value: customer.round_feet,
                  id: "round_feet",
                },
              ].map((measurement, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <label
                    htmlFor={measurement.id}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {measurement.label}
                  </label>
                  <input
                    type="number"
                    readOnly
                    id={measurement.id}
                    name={measurement.id}
                    value={measurement.value}
                    placeholder={measurement.label}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </form>

        <motion.div
  className="mt-8 p-6 bg-white rounded-3xl shadow-lg"
  initial="hidden"
  animate="visible"
  variants={fadeInUp}
  transition={{ duration: 0.5, delay: 0.9 }}
>
  <div className="flex items-center justify-between">
  <div className="flex items-center w-full">
    <div className="p-3 bg-green-100 rounded-full">
      <FaUserTie className="text-green-500 text-2xl" />
    </div>
    <h2 className="ml-4 text-2xl font-bold text-gray-700">
      Tailors
    </h2>
  </div>
  {/* <div className="flex space-x-3 whitespace-nowrap">
      <div className="font-bold text-xl text-gray-700">Tailor Commission:</div>
      <div className="flex space-x-2 font-normal items-center text-xl text-gray-700">
        <span>₦</span><span>commission_amount</span>
      </div>
  </div> */}
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-5 gap-6">
    {assignedTailors.length > 0 ? (
      assignedTailors.map((t, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-5 border rounded-2xl"
        >
          <div>
            <h3 className="text-gray-800 font-semibold">{t.name}</h3>
            <p className="text-gray-500 text-sm">{t.email}</p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-xl my-10 font-bold col-span-full text-center">
        No tailors have been assigned yet.
      </p>
    )}
  </div>

  <div className="flex justify-end">
  <button
  onClick={() => setIsAssignSectionVisible(prev => !prev)}
  className="mt-4 flex bg-orange-500 text-white px-4 py-2 rounded"
>
  {isAssignSectionVisible ? "Hide Assign Tailors" : "Assign Tailors"}
</button>
  </div>

</motion.div>





        
        {/* Assign Tailors Section */}
        {isAssignSectionVisible && (
        <motion.div
          className="mt-8 p-6 bg-white rounded-3xl shadow-lg"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="flex items-center mb-6">
            <div className="p-3 bg-orange-100 rounded-full">
              <FaUserTie className="text-orange-500 text-2xl" />
            </div>
            <h2 className="ml-4 text-2xl font-bold text-gray-700">
              Assign Tailors to Order
            </h2>
          </div>

          {/* <div className="relative mb-6">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tailors..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div> */}

          {tailorsLoading && (
  <div className="text-center py-6">
    <Spinner />
    <div>Loading tailors…</div>
  </div>
)}

{tailorsError && (
  <div className="text-red-500 text-center py-4">
    Error loading tailors: {tailorsError}{" "}
    <button onClick={() => fetchTailors()} className="underline">
      Retry
    </button>
  </div>
)}


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredTailors.map(t => {
              const isSelected = selectedTailors.includes(t.id);
              return (
                <motion.button
                  key={t.id}
                  onClick={() => toggleTailor(t.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-5 border rounded-2xl transition-all focus:outline-none \
                    ${isSelected ? 'bg-orange-50 border-orange-300' : 'bg-white hover:shadow-md'}`}
                >
                  <div>
                    <h3 className="text-gray-800 font-semibold">{t.name}</h3>
                    <p className="text-gray-500 text-sm">{t.email}</p>
                  </div>
                  {isSelected ? (
                    <FaCheckCircle className="text-orange-500 text-xl" />
                  ) : (
                    <FaRegCircle className="text-gray-300 text-xl" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <motion.button
            onClick={handleAssignTailors}
            disabled={isAssigning}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-2xl text-white font-semibold transition-all \
              ${isAssigning ? 'bg-gray-300' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            {isAssigning ? <Spinner /> : 'Assign Tailors'}
          </motion.button>
        </motion.div>
              )}

        {customer.tailor_image === null && (
          <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">
            <motion.div
              className="font-bold text-xl mt-5 text-gray-700"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Image Style
            </motion.div>

            {customer.project_manager_approval && (
              <motion.div
                className="flex items-center mt-4"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {customer.tailor_image && (
                  <div className="mr-4">
                    <Image
                      src={customer.tailor_image}
                      alt="Tailor"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Upload Image Section */}
            {customer.client_manager_approval !== "accepted" && (
              <motion.div
                className="mb-6"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <label className="block text-gray-700 font-normal mb-2">
                  {customer.tailor_image === null ? (
                    <div>Please upload an Image</div>
                  ) : (
                    <div className="mt-2 font-bold">Edit Image</div>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full"
                />
              </motion.div>
            )}

            {imagePreview && (
              <motion.div
                className="mb-4 flex flex-col items-center"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
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
              </motion.div>
            )}

            {/* Upload Button */}
            {selectedImage && !imagePath && (
              <motion.button
                onClick={handleUploadImage}
                disabled={isUploading}
                className={`w-full py-2 rounded text-white font-semibold transition ${
                  isUploading
                    ? "bg-gray-100"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                {isUploading ? <Spinner /> : "Upload Image"}
              </motion.button>
            )}

            {/* Send to Project Manager Button */}
            {imagePath && !sentSuccess && (
              <motion.button
                onClick={handleSendToProjectManager}
                disabled={isSending}
                className={`w-full py-2 rounded text-white font-semibold transition mt-4 ${
                  isSending ? "bg-gray-100" : "bg-green-500 hover:bg-green-600"
                }`}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                {isSending ? <Spinner /> : "Send to Client Manager"}
              </motion.button>
            )}
          </div>
        )}

        {customer.tailor_image !== null && (
          <>
            <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">
              <motion.div
                className="font-bold text-xl mt-5 text-gray-700"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                Image Style
              </motion.div>
              <div className="flex items-center mt-4">
                {customer.tailor_image && (
                  <div className="mr-4">
                    <Image
                      src={customer.tailor_image}
                      alt="Tailor"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
                {customer.client_manager_approval === "pending" && (
                  <>
                    <FaRegClock className="text-yellow-500 text-3xl" />
                    <span className="ml-2 text-yellow-500 font-semibold">
                      Style under review
                    </span>
                  </>
                )}
                {customer.client_manager_approval === "accepted" && (
                  <>
                    <FaCheckCircle className="text-green-500 text-3xl" />
                    <span className="ml-2 text-green-500 font-semibold">
                      Style approved
                    </span>
                  </>
                )}
                {customer.client_manager_approval === "rejected" && (
                  <>
                    <FaRegCircleXmark className="text-red-500 text-3xl" />
                    <span className="ml-2 text-red-500 font-semibold">
                      Style rejected
                    </span>
                  </>
                )}
              </div>

              {customer.client_manager_approval === "rejected" && (
                <div className="mt-5">
                  <div className="font-bold text-gray-700 text-2xl">Feedback</div>
                  <div className="text-gray-500">
                    {customer.client_manager_feedback}
                  </div>
                </div>
              )}
            </div>

            {customer.client_manager_approval === "accepted" && (
              <div className="mt-5 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-gray-700">
                  Inventory Request
                </div>
                <h1 className=" font-normal my-3 text-gray-700">
                  Your style has been approved, you may now request inventory
                  items necessary to complete your job
                </h1>
                <Link
                  href={`/admin/joblists/tailorjoblists/jobs/${id}/request-inventory`}
                  className=""
                >
                  <button className="bg-orange-500 text-white px-4 py-2 rounded">
                    Request Inventory
                  </button>
                </Link>
              </div>
            )}
          </>
        )}

      {/* Upload Image Section */}
      {customer.client_manager_approval === "rejected" && (
          <div className="w-full mx-auto min-h-full p-6 bg-white rounded-2xl shadow-md">

            {customer.project_manager_approval && (
              <motion.div
                className="flex items-center mt-4"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {customer.tailor_image && (
                  <div className="mr-4">
                    <Image
                      src={customer.tailor_image}
                      alt="Tailor"
                      width={100}
                      height={100}
                      className="rounded"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Upload Image Section */}
            
              <motion.div
                className="mb-6"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <label className="block text-gray-700 font-normal mb-2">
                  
                    <div className="mt-5 text-2xl font-bold">Edit Image</div>
                    <h1 className=" font-normal my-3 text-gray-700">
                      Your style has been rejected, please upload a new image
                      that meets the requirements
                    </h1>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border p-2 rounded w-full"
                />
              </motion.div>
            

            {imagePreview && (
              <motion.div
                className="mb-4 flex flex-col items-center"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
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
              </motion.div>
            )}

            {/* Upload Button */}
            {selectedImage && !imagePath && (
              <motion.button
                onClick={handleUploadImage}
                disabled={isUploading}
                className={`w-full py-2 rounded text-white font-semibold transition ${
                  isUploading
                    ? "bg-gray-100"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                {isUploading ? <Spinner /> : "Upload Image"}
              </motion.button>
            )}

            {/* Send to Project Manager Button */}
            {imagePath && !sentSuccess && (
              <motion.button
                onClick={handleSendToProjectManager}
                disabled={isSending}
                className={`w-full py-2 rounded text-white font-semibold transition mt-4 ${
                  isSending ? "bg-gray-100" : "bg-green-500 hover:bg-green-600"
                }`}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                {isSending ? <Spinner /> : "Send to Client Manager"}
              </motion.button>
            )}
          </div>
        )}
      </div>
    );
  }
