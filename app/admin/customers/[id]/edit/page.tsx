"use client";

import Spinner from "@/components/Spinner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCustomer() {
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
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
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
    gender: ""
  });

  const fetchCustomer = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/customerslist/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();
      setCustomer(result.data);
      setFormData({
        name: result.data.name,
        age: result.data.age,
        phone: result.data.phone_number,
        email: result.data.email,
        bust: result.data.bust,
        address: result.data.address,
        waist: result.data.waist,
        neck: result.data.neck,
        gender: result.data.gender,
        date: result.data.created_at,
        shoulderWidth: result.data.shoulder_width,
        armLength: result.data.arm_length,
        backLength: result.data.back_length,
        frontLength: result.data.front_length,
        highBust: result.data.high_bust
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/customerslist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }

      router.push(`/admin/customerslist/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500 py-10">
      <Spinner />
    </div>;
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
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Age</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Gender</label>
          <input
            type="text"
            name="gender"
            onChange={handleInputChange}
            value={formData.gender}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData?.phone || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
          />
        </div>
        
        </div>
        

        <div className="col-span-2 mt-5">
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/inventory/${id}`)}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}



// <div className="w-full">
//           {/* Measurement Fields */}
//         <div className="block text-xl font-medium text-gray-700 mt-10 mb-1">Measurements</div>
//         <div className="mb-4">
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/3">
//               <label htmlFor="bust" className="block text-sm font-medium text-gray-700">
//                 Bust
//               </label>
//               <input
//                 type="number"
//                 id="bust"
//                 name="bust"
//                 onChange={handleInputChange}
//                 value={formData?.bust || ""}
//                 placeholder="Bust"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//             <div className="w-1/3">
//               <label htmlFor="waist" className="block text-sm font-medium text-gray-700">
//                 Waist
//               </label>
//               <input
//                 type="number"
//                 id="waist"
//                 name="waist"
//                 onChange={handleInputChange}
//                 value={formData?.waist || ""}
//                 placeholder="Waist"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//             <div className="w-1/3">
//               <label htmlFor="hips" className="block text-sm font-medium text-gray-700">
//                 Hips
//               </label>
//               <input
//                 type="number"
//                 id="hips"
//                 name="hips"
//                 value={customer?.hip || ""}
//                 placeholder="Hips"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//           </div>
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/3">
//               <label
//                 htmlFor="shoulderWidth"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Shoulder Width
//               </label>
//               <input
//                 type="number"
//                 id="shoulderWidth"
//                 name="shoulderWidth"
//                 value={formData?.shoulderWidth || ""}
//                 onChange={handleInputChange}
//                 placeholder="Shoulder Width"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//             <div className="w-1/3">
//               <label htmlFor="neck" className="block text-sm font-medium text-gray-700">
//                 Neck
//               </label>
//               <input
//                 type="number"
//                 id="neck"
//                 name="neck"
//                 value={customer?.neck || ""}
//                 placeholder="Neck"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//             <div className="w-1/3">
//               <label htmlFor="armLength" className="block text-sm font-medium text-gray-700">
//                 Arm Length
//               </label>
//               <input
//                 type="number"
//                 id="armLength"
//                 name="armLength"
//                 value={customer?.arm_length || ""}
//                 placeholder="Arm Length"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//           </div>
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/3">
//               <label
//                 htmlFor="backLength"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Back Length
//               </label>
//               <input
//                 type="number"
//                 id="backLength"
//                 name="backLength"
//                 value={customer?.back_length || ""}
//                 placeholder="Back Length"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//             <div className="w-1/3">
//               <label
//                 htmlFor="frontLength"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Front Length
//               </label>
//               <input
//                 type="number"
//                 id="frontLength"
//                 name="frontLength"
//                 value={customer?.front_length || ""}
//                 placeholder="Front Length"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//             <div className="w-1/3">
//               <label htmlFor="highBust" className="block text-sm font-medium text-gray-700">
//                 High Bust
//               </label>
//               <input
//                 type="number"
//                 id="highBust"
//                 name="highBust"
//                 value={customer?.high_bust || ""}
//                 placeholder="High Bust"
//                 className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
//               />
//             </div>
//           </div>
//         </div>
//         </div>