"use client";

import Spinner from "@/components/Spinner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = useParams();
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState(null)
  const [formData, setFormData] = useState({
    customer_name: "",
    age: "",
    bust: "",
    waist: "",
    hips: "",
    neck: "",
    gender: "",
    order_created_at: "",
    shoulder_width: "",
    arm_length: "",
    back_length: "",
    front_length: "",
    high_bust: "",
    manager_id: "",
  });
const [realdata, setRealdata] = useState({
  manager_id: "",
  amount: "",
  customer_name: "",
})


  const [managers, setManagers] = useState<
    {
      id: string;
      user_id: string;
      name: string;
    }[]
  >([]);
  const [loadingManagers, setLoadingManagers] = useState(true);

  const fetchCustomer = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/projectlists/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }

      const result = await response.json();
      setCustomer(result.data);
      setFormData({
        customer_name: result.data.customer_name,
        age: result.data.age,
        bust: result.data.bust,
        waist: result.data.waist,
        hips: result.data.hips,
        neck: result.data.neck,
        gender: result.data.gender,
        order_created_at: result.data.created_at,
        shoulder_width: result.data.shoulder_width,
        arm_length: result.data.arm_length,
        back_length: result.data.back_length,
        front_length: result.data.front_length,
        high_bust: result.data.high_bust,
        manager_id: result.data.manager_id, // Set the current manager_id
      });
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

  const fetchManagers = async () => {
    setLoadingManagers(true);
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch("/api/headoftailoringlist", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });


      if (!response.ok) {
        throw new Error("Failed to fetch managers");
      }

      const result = await response.json();
      setManagers(result.data);
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

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setRealdata({
      ...realdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/editproject/${id}`, {
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

  useEffect(() => {
    fetchCustomer();
    fetchManagers(); // Fetch managers when the component mounts
  }, [id]);

  if (loading || loadingManagers) {
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
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.customer_name}
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
              value={formData.gender || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold">Head of Tailoring</label>
            <select
              name="manager_id"
              value={realdata.manager_id}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            >
              <option value="">Select Head of Tailoring</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.user_id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full">
          {/* Measurement Fields */}
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
                  id="bust"
                  name="bust"
                  value={formData.bust || ""}
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
                  id="waist"
                  name="waist"
                  value={formData.waist || ""}
                  placeholder="Waist"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="hips"
                  className="block text-sm font-medium text-gray-700"
                >
                  hips
                </label>
                <input
                  type="number"
                  id="hips"
                  name="hips"
                  value={formData.hips || ""}
                  placeholder="hips"
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
                  id="shoulder_width"
                  name="shoulder_width"
                  value={formData.shoulder_width || ""}
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
                  id="neck"
                  name="neck"
                  value={formData.neck || ""}
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
                  id="arm_length"
                  name="arm_length"
                  value={formData.arm_length || ""}
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
                  id="back_length"
                  name="back_length"
                  value={formData.back_length || ""}
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
                  id="front_length"
                  name="front_length"
                  value={formData.front_length || ""}
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
                  id="high_bust"
                  name="high_bust"
                  value={formData.high_bust || ""}
                  placeholder="High Bust"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
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