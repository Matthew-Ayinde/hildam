"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react"; // Import getSession from NextAuth
import { FaRegSmile } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner"; // Import your Spinner component

// Dummy customer data with measurements (all keys now in snake_case)
const dummyCustomers = [
  {
    id: 1,
    name: "Chioma Ante",
    email: "chioma@gmail.com",
    age: "21",
    blouse_length: 42.1,
    bust: 36.5,
    bust_point: 37.0,
    chest: 38.2,
    dress_length: 50.0,
    half_length: 25.5,
    hip: 40.3,
    round_shoulder: 12.5,
    round_sleeve: 16.0,
    round_under_bust: 34.2,
    shoulder: 14.1,
    shoulder_to_underbust: 9.8,
    sleeve_length: 24.3,
    skirt_length: 45.7,
    waist: 32.0,
  },
  {
    id: 2,
    name: "Benjamin Lee",
    email: "benjamin.lee@example.com",
    age: "22",
    blouse_length: 44.8,
    bust: 38.1,
    bust_point: 38.5,
    chest: 39.0,
    dress_length: 52.3,
    half_length: 26.0,
    hip: 42.6,
    round_shoulder: 13.0,
    round_sleeve: 16.8,
    round_under_bust: 36.0,
    shoulder: 14.5,
    shoulder_to_underbust: 10.2,
    sleeve_length: 25.1,
    skirt_length: 47.5,
    waist: 33.4,
  },
  {
    id: 3,
    name: "Carla Hernández",
    email: "carla.hernandez@example.com",
    age: "23",
    blouse_length: 41.3,
    bust: 35.8,
    bust_point: 36.2,
    chest: 37.4,
    dress_length: 49.1,
    half_length: 24.7,
    hip: 39.8,
    round_shoulder: 12.2,
    round_sleeve: 15.5,
    round_under_bust: 33.5,
    shoulder: 13.8,
    shoulder_to_underbust: 9.5,
    sleeve_length: 23.7,
    skirt_length: 44.2,
    waist: 31.7,
  },
  {
    id: 4,
    name: "Kingsley ",
    email: "david.okoye@example.com",
    age: "24",
    blouse_length: 43.5,
    bust: 37.3,
    bust_point: 37.9,
    chest: 38.7,
    dress_length: 51.0,
    half_length: 25.9,
    hip: 41.5,
    round_shoulder: 12.9,
    round_sleeve: 16.2,
    round_under_bust: 35.1,
    shoulder: 14.3,
    shoulder_to_underbust: 10.0,
    sleeve_length: 24.9,
    skirt_length: 46.8,
    waist: 32.9,
  },
  {
    id: 5,
    name: "Ella Thompson",
    email: "ella.thompson@example.com",
    age: "25",
    blouse_length: 45.0,
    bust: 38.8,
    bust_point: 39.4,
    chest: 40.1,
    dress_length: 53.2,
    half_length: 27.1,
    hip: 43.2,
    round_shoulder: 13.4,
    round_sleeve: 17.0,
    round_under_bust: 36.8,
    shoulder: 14.8,
    shoulder_to_underbust: 10.5,
    sleeve_length: 26.3,
    skirt_length: 48.9,
    waist: 34.2,
  },
  {
    id: 6,
    name: "Farah Khan",
    email: "farah.khan@example.com",
    age: "26",
    blouse_length: 40.7,
    bust: 35.2,
    bust_point: 36.0,
    chest: 37.0,
    dress_length: 48.3,
    half_length: 24.2,
    hip: 39.1,
    round_shoulder: 12.0,
    round_sleeve: 15.2,
    round_under_bust: 33.0,
    shoulder: 13.5,
    shoulder_to_underbust: 9.3,
    sleeve_length: 23.4,
    skirt_length: 43.5,
    waist: 31.2,
  },
  {
    id: 7,
    name: "George Müller",
    email: "george.muller@example.com",
    age: "27",
    blouse_length: 46.2,
    bust: 39.5,
    bust_point: 40.1,
    chest: 41.3,
    dress_length: 54.1,
    half_length: 27.8,
    hip: 44.0,
    round_shoulder: 13.7,
    round_sleeve: 17.3,
    round_under_bust: 37.5,
    shoulder: 15.1,
    shoulder_to_underbust: 10.8,
    sleeve_length: 26.9,
    skirt_length: 49.7,
    waist: 35.0,
  },
  {
    id: 8,
    name: "Hannah Johnson",
    email: "hannah.johnson@example.com",
    age: "28",
    blouse_length: 42.9,
    bust: 36.9,
    bust_point: 37.6,
    chest: 38.5,
    dress_length: 51.5,
    half_length: 26.4,
    hip: 41.0,
    round_shoulder: 12.7,
    round_sleeve: 16.5,
    round_under_bust: 35.5,
    shoulder: 14.6,
    shoulder_to_underbust: 10.3,
    sleeve_length: 25.3,
    skirt_length: 47.1,
    waist: 33.7,
  },
  {
    id: 9,
    name: "Isaac Chen",
    email: "isaac.chen@example.com",
    age: "29",
    blouse_length: 44.4,
    bust: 38.2,
    bust_point: 38.9,
    chest: 39.8,
    dress_length: 52.7,
    half_length: 26.9,
    hip: 42.5,
    round_shoulder: 13.2,
    round_sleeve: 16.9,
    round_under_bust: 36.2,
    shoulder: 14.9,
    shoulder_to_underbust: 10.6,
    sleeve_length: 26.1,
    skirt_length: 48.3,
    waist: 34.4,
  },
  {
    id: 10,
    name: "Julia Martín",
    email: "julia.martin@example.com",
    age: "30",
    blouse_length: 41.8,
    bust: 35.6,
    bust_point: 36.4,
    chest: 37.6,
    dress_length: 49.8,
    half_length: 24.8,
    hip: 40.0,
    round_shoulder: 12.3,
    round_sleeve: 15.7,
    round_under_bust: 33.8,
    shoulder: 13.9,
    shoulder_to_underbust: 9.6,
    sleeve_length: 23.9,
    skirt_length: 44.8,
    waist: 31.9,
  },
  {
    id: 11,
    name: "Kevin O’Neal",
    email: "kevin.oneal@example.com",
    age: "31",
    blouse_length: 45.5,
    bust: 39.0,
    bust_point: 39.7,
    chest: 40.6,
    dress_length: 53.8,
    half_length: 27.4,
    hip: 43.8,
    round_shoulder: 13.6,
    round_sleeve: 17.1,
    round_under_bust: 37.0,
    shoulder: 15.0,
    shoulder_to_underbust: 10.7,
    sleeve_length: 26.7,
    skirt_length: 49.3,
    waist: 35.5,
  },
  {
    id: 12,
    name: "Lina Petrova",
    email: "lina.petrova@example.com",
    age: "32",
    blouse_length: 43.0,
    bust: 37.5,
    bust_point: 38.2,
    chest: 39.1,
    dress_length: 51.2,
    half_length: 26.2,
    hip: 41.2,
    round_shoulder: 12.8,
    round_sleeve: 16.4,
    round_under_bust: 35.2,
    shoulder: 14.4,
    shoulder_to_underbust: 10.1,
    sleeve_length: 25.0,
    skirt_length: 47.0,
    waist: 33.9,
  },
  {
    id: 13,
    name: "Marcus Green",
    email: "marcus.green@example.com",
    age: "33",
    blouse_length: 42.5,
    bust: 36.7,
    bust_point: 37.3,
    chest: 38.0,
    dress_length: 50.5,
    half_length: 25.6,
    hip: 40.5,
    round_shoulder: 12.6,
    round_sleeve: 15.9,
    round_under_bust: 34.5,
    shoulder: 14.0,
    shoulder_to_underbust: 9.7,
    sleeve_length: 24.5,
    skirt_length: 45.4,
    waist: 32.5,
  },
  {
    id: 14,
    name: "Natalie Wright",
    email: "natalie.wright@example.com",
    age: "34",
    blouse_length: 46.0,
    bust: 39.3,
    bust_point: 39.9,
    chest: 40.9,
    dress_length: 54.0,
    half_length: 27.6,
    hip: 44.2,
    round_shoulder: 13.8,
    round_sleeve: 17.2,
    round_under_bust: 37.3,
    shoulder: 15.2,
    shoulder_to_underbust: 10.9,
    sleeve_length: 26.8,
    skirt_length: 49.5,
    waist: 35.2,
  },
  {
    id: 15,
    name: "Omar Ali",
    email: "omar.ali@example.com",
    age: "35",
    blouse_length: 41.5,
    bust: 35.4,
    bust_point: 36.1,
    chest: 37.2,
    dress_length: 49.5,
    half_length: 24.5,
    hip: 39.5,
    round_shoulder: 12.1,
    round_sleeve: 15.4,
    round_under_bust: 33.2,
    shoulder: 13.7,
    shoulder_to_underbust: 9.4,
    sleeve_length: 23.6,
    skirt_length: 44.5,
    waist: 31.5,
  },
  {
    id: 16,
    name: "Priya Desai",
    email: "priya.desai@example.com",
    age: "36",
    blouse_length: 44.2,
    bust: 38.0,
    bust_point: 38.7,
    chest: 39.6,
    dress_length: 52.0,
    half_length: 26.7,
    hip: 42.0,
    round_shoulder: 13.3,
    round_sleeve: 16.7,
    round_under_bust: 36.1,
    shoulder: 14.7,
    shoulder_to_underbust: 10.4,
    sleeve_length: 26.0,
    skirt_length: 48.0,
    waist: 34.0,
  },
  {
    id: 17,
    name: "Quinton Ross",
    email: "quinton.ross@example.com",
    age: "37",
    blouse_length: 43.8,
    bust: 37.8,
    bust_point: 38.4,
    chest: 39.3,
    dress_length: 51.8,
    half_length: 26.5,
    hip: 41.8,
    round_shoulder: 13.1,
    round_sleeve: 16.6,
    round_under_bust: 35.9,
    shoulder: 14.5,
    shoulder_to_underbust: 10.3,
    sleeve_length: 25.8,
    skirt_length: 47.8,
    waist: 33.8,
  },
  {
    id: 18,
    name: "Rina Suzuki",
    email: "rina.suzuki@example.com",
    age: "38",
    blouse_length: 45.8,
    bust: 39.7,
    bust_point: 40.2,
    chest: 41.6,
    dress_length: 54.5,
    half_length: 28.0,
    hip: 44.5,
    round_shoulder: 13.9,
    round_sleeve: 17.4,
    round_under_bust: 37.7,
    shoulder: 15.3,
    shoulder_to_underbust: 11.0,
    sleeve_length: 27.0,
    skirt_length: 49.9,
    waist: 35.7,
  },
  {
    id: 19,
    name: "Steven Brown",
    email: "steven.brown@example.com",
    age: "39",
    blouse_length: 42.3,
    bust: 36.3,
    bust_point: 37.1,
    chest: 38.1,
    dress_length: 50.2,
    half_length: 25.3,
    hip: 40.1,
    round_shoulder: 12.4,
    round_sleeve: 15.6,
    round_under_bust: 34.1,
    shoulder: 13.8,
    shoulder_to_underbust: 9.6,
    sleeve_length: 24.0,
    skirt_length: 45.0,
    waist: 31.8,
  },
  {
    id: 20,
    name: "Tina Gómez",
    email: "tina.gomez@example.com",
    age: "40",
    blouse_length: 46.5,
    bust: 39.9,
    bust_point: 40.5,
    chest: 41.8,
    dress_length: 55.0,
    half_length: 28.2,
    hip: 45.0,
    round_shoulder: 14.0,
    round_sleeve: 17.5,
    round_under_bust: 38.0,
    shoulder: 15.4,
    shoulder_to_underbust: 11.1,
    sleeve_length: 27.2,
    skirt_length: 50.2,
    waist: 36.0,
  },
];




type FormDataType = {
  blouse_length: string;
  bust: string;
  bustpoint: string;
  chest: string;
  clothing_description: string;
  clothing_name: string;
  customer_description: string;
  customer_email: string;  
  customer_name: string;
  dress_length: string;
  gender: string;
  half_length: string;
  hip: string;
  manager_id: string;
  neck: string;
  order_status: string;
  phone_number: string;
  priority: string;
  round_shoulder: string;
  round_sleeve: string;
  round_under_bust: string;
  shoulder: string;
  shoulder_to_underbust: string;
  skirt_length: string;
  sleeve_length: string;
  style_reference_images: File | null;
  waist: string;
};

const initialFormData: FormDataType = {
  blouse_length: "",
  bust: "",
  bustpoint: "",
  chest: "",
  clothing_description: "",
  clothing_name: "",
  customer_description: "",
  customer_email: "",
  customer_name: "",
  dress_length: "",
  gender: "",
  half_length: "",
  hip: "",
  manager_id: "",
  neck: "",
  order_status: "",
  phone_number: "",
  priority: "",

  round_shoulder: "",
  round_sleeve: "",
  round_under_bust: "",
  shoulder: "",
  shoulder_to_underbust: "",
  skirt_length: "",
  sleeve_length: "",
  style_reference_images: null,
  waist: ""
};


const Form = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredCustomers, setFilteredCustomers] = useState<typeof dummyCustomers>([]);
    const inputRef = useRef<HTMLInputElement>(null);

const [basicCustomers, setBasicCustomers] = useState<typeof dummyCustomers>([]);
    
  const [managers, setManagers] = useState<
    {
      id: string;
      user_id: string;
      name: string;
    }[]
  >([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        const token   = session?.user?.token!;
        const res     = await fetch(
          `https://hildam.insightpublicis.com/api/customerslist`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json    = await res.json();
        setBasicCustomers(json.data);
      } catch (err) {
        console.error("Failed to load customer list", err);
      }
    })();
  }, []);

    // Close suggestions on click outside
      useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            setShowSuggestions(false);
          }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }, []);
    

  useEffect(() => {
    const fetchHeadOfTailoringList = async () => {
      try {
        setLoadingManagers(true);

        const session = await getSession(); // Get session from NextAuth
        const token = session?.user?.token; // Access token from session
        if (!token) {
          throw new Error("No token found, please log in.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/headoftailoringlist`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.data) {
          throw new Error("Failed to fetch head of tailoring list");
        }

        setManagers(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchHeadOfTailoringList();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
  
    // 1. Handle file inputs (and preview)
    if (type === "file" && e.target instanceof HTMLInputElement) {
      const file = e.target.files ? e.target.files[0] : null;
      setFormData(prev => ({ ...prev, [name]: file }));
  
      if (file) {
        const fileURL = URL.createObjectURL(file);
        setImagePreview(fileURL);
      } else {
        setImagePreview(null);
      }
      return; // bail out so we don't run the text logic
    }
  
    // 2. Handle all other inputs (text, textarea, select)
    setFormData(prev => ({ ...prev, [name]: value }));
  
    // 3. If this field is your customer‐name, update suggestions
    if (name === "customer_name") {
      setFormData(f => ({ ...f, customer_name: value }));
      if (value.trim()) {
        const matches = basicCustomers.filter(c =>
          c.name.toLowerCase().includes(value.trim().toLowerCase())
        );
        setFilteredCustomers(matches);
        setShowSuggestions(matches.length > 0);
      } else {
        setFilteredCustomers([]);
        setShowSuggestions(false);
      }
      return;
    }
  };
  

  const handleSelect = async (customer: {
    id: string; name: string; email: string; age: string;
  }) => {
    try {
      setShowSuggestions(false);
      const session = await getSession();
      const token   = session?.user?.token!;
      const res     = await fetch(
        `https://hildam.insightpublicis.com/api/customerslist/${customer.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = await res.json();
  
      // Map the returned data directly into formData:
      setFormData(f => ({
        ...f,
        customer_name: data.name,
        customer_email: data.email,
        // age or phone if you track them
        // now all your measurement fields:
        blouse_length:          data.blouse_length,
        bust:                   data.bust,
        bust_point:             data.bustpoint,
        chest:                  data.chest,
        dress_length:           data.dress_length,
        half_length:            data.half_length,
        hip:                    data.hip,
        round_shoulder:         data.round_shoulder,
        round_sleeve:           data.round_sleeve,
        round_under_bust:       data.round_under_bust,
        shoulder:               data.shoulder,
        shoulder_to_underbust:  data.shoulder_to_underbust,
        sleeve_length:          data.sleeve_length,
        skirt_length:           data.skirt_length,
        waist:                  data.waist,
        customer_description:   data.customer_description,
        // …any other fields you want to prefill
      }));
    } catch (err) {
      console.error("Failed to load customer details", err);
    }
  };
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const session = await getSession();
      const token = session?.user?.token;
      if (!token) throw new Error("Authentication required. Please log in.");

      // Build FormData dynamically
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          // Handle file input separately
          if (key === "style_reference_images" && value instanceof File) {
            payload.append(key, value);
          } else if (typeof value === "string") {
            payload.append(key, value);
          }
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/createorder`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order.");
      }

      setResponseMessage("Order created successfully!");
      // setFormData(initialFormData);
      setImagePreview(null);

      // Redirect after a short delay
      // setTimeout(() => router.push("/admin/orders"), 1000);
    } catch (error: any) {
      console.error(error);
      setResponseMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
      // Hide response message after 5 seconds
      setTimeout(() => setResponseMessage(null), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 flex justify-center items-center p-4"
    >
      {popupMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white bg-red-500 shadow-lg">
          {popupMessage}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-lg shadow-xl p-8 space-y-8"
      >
        <div className="flex items-center space-x-3">
          <FaRegSmile size={28} className="text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-800">
            Order Information
          </h2>
        </div>

        {/* Customer Info */}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Autocomplete Customer Name */}
          <div className="relative" ref={inputRef}>
                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name
                    </label>
                    <motion.input
                      id="customer_name"
                      name="customer_name"
                      type="text"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Start typing customer name..."
                      autoComplete="off"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
                    />
                    {showSuggestions && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredCustomers.map(c => (
                          <li
                            key={c.id}
                            onClick={() => handleSelect(c)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="font-medium text-gray-800">{c.name}</div>
                            <div className="text-sm text-gray-500">{c.email}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
        <div>
            <label
              htmlFor="customer_email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              id="customer_email"
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="Enter customer email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          {/* <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            whileHover={{ scale: 1.01 }}
            id="phone_number"
            name="phone_number"
            type="text"
            value={formData.phone_number}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 11) {
                handleChange({ ...e, target: { ...e.target, value } });
              }
            }}
            placeholder="Enter your phone number"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
          />
        </div> */}

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 text-gray-500 shadow-sm p-2 bg-white focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            >
              <option value="" disabled>
                Select Priority
              </option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Manager Dropdown */}
          <div className="">
            <label
              htmlFor="manager_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Head of Tailoring
            </label>
            {loadingManagers ? (
              <div className="text-center text-gray-500 mt-2">
                <Spinner
                />
                <span className="text-sm">please wait...</span>
              </div>
            ) : (
              <select
                id="manager_id"
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border text-gray-700 border-gray-300 shadow-sm p-2 bg-white focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
              >
                <option value="">Select head of tailoring</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.user_id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <label
              htmlFor="clothing_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cloth Name
            </label>
            <textarea
              id="clothing_name"
              name="clothing_name"
              rows={3}
              value={formData.clothing_name}
              onChange={handleChange}
              placeholder="Enter cloth name"
              className="mt-1 block w-full h-24 rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="clothing_description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Clothing Description
            </label>
            <textarea
              id="clothing_description"
              name="clothing_description"
              rows={3}
              value={formData.clothing_description}
              onChange={handleChange}
              placeholder="Enter cloth description"
              className="mt-1 block w-full h-24 rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
          </div>


          <div className="w-full">
            <label
              htmlFor="customer_description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Customer Description
            </label>
            <textarea
              id="customer_description"
              name="customer_description"
              rows={4}
              value={formData.customer_description}
              onChange={handleChange}
              placeholder="Enter customer description"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
          </div>
         
          {/* File Input */}
          <div className="lg:col-span-2">
            <label
              htmlFor="style_reference_images"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Style Reference Images
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              id="style_reference_images"
              name="style_reference_images"
              type="file"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected"
                className="mt-2 w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>

        {/* Measurement Fields */}
        <div>
          <div className="lg:flex-row flex flex-col lg:gap-0 gap-3 justify-between my-5 items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Measurement Fields
            </h2>
            <p className="text-sm text-gray-500">
              (For multiple values, please use hyphen, e.g., 2-3-4)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "blouse_length", label: "Blouse Length" },
              { id: "bust", label: "Bust" },
              { id: "bust_point", label: "Bust Point" },
              { id: "chest", label: "Chest" },
              { id: "dress_length", label: "Dress Length(Long, 3/4, Short)" },
              { id: "half_length", label: "Half Length" },
              { id: "hip", label: "Hip" },
              { id: "round_shoulder", label: "Round Shoulder" },
              {
                id: "round_sleeve",
                label: "Round Sleeve(Arm, Below Elbow, Wrist)",
              },
              { id: "round_under_bust", label: "Round under Bust" },
              { id: "shoulder", label: "Shoulder" },
              { id: "shoulder_to_underbust", label: "Shoulder to under Bust" },
              {
                id: "sleeve_length",
                label: "Sleeve Length(Long, Quarter, Short)",
              },
              { id: "skirt_length", label: "Skirt Length(Long, 3/4, Short)" },
              { id: "waist", label: "Waist" },
            ].map(({ id, label }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {label} 
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  id={id}
                  name={id}
                  type="text"
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={label}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-orange-500 focus:ring focus:ring-orange-200 transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className="w-fit px-6 py-3 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition"
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </motion.button>
        </div>
        {responseMessage && (
          <div className="fixed top-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {responseMessage}
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default Form;
