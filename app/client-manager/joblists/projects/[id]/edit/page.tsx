"use client";

import Spinner from "../../../../../../components/Spinner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosArrowBack } from "react-icons/io";
import React from "react";
import Link from "next/link";

export default function EditCustomer() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [realTestdata, setRealTestdata] = useState<{
    duration: string;
    order_status: string;
    first_fitting_date: Date | null;
    second_fitting_date: Date | null;
  }>({
    duration: "",
    order_status: "",
    first_fitting_date: null,
    second_fitting_date: null,
  });

  const handleDateChange = (
    date: Date | [Date, Date] | null,
    field: string
  ) => {
    const selectedDate = Array.isArray(date) ? date[0] : date;
    setRealTestdata({
      ...realTestdata,
      [field]: selectedDate,
    });
  };

  const handleTestSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Add validation to ensure dates are not in the past
    const today = new Date();
    if (
      (realTestdata.first_fitting_date &&
        realTestdata.first_fitting_date < today) ||
      (realTestdata.second_fitting_date &&
        realTestdata.second_fitting_date < today)
    ) {
      alert("Fitting dates cannot be in the past.");
      return;
    }
    // Handle form submission logic here
    console.log(realTestdata);

    e.preventDefault();
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/editproject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(realTestdata),
        }
      );

      // Log the response for debugging
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }

      router.push("/client-manager/joblists/projects");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
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
    order_id: "",
    customer_approval: "",
  });
  const [realdata, setRealdata] = useState({
    manager_id: "",
    duration: "",
  });

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
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/projectlists/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }

      const result = await response.json();
      setCustomer(result.data);
      setFormData({
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
        order_id: result.data.order_id,
        customer_approval: result.data.customer_approval,
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
      const response = await fetch(
        "https://hildam.insightpublicis.com/api/headoftailoringlist",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
  const handleInputTestChange = (e: { target: { name: any; value: any } }) => {
    setRealTestdata({
      ...realTestdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `https://hildam.insightpublicis.com/api/editproject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(realdata),
        }
      );

      // Log the response for debugging
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }

      router.push("/client-manager/joblists/projects");
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
    <div className="w-full h-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      <Link href="/client-manager/joblists/projects"
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
              value={formData.order_id || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold">
              Head of Tailoring
            </label>
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

        <div className="col-span-2 mt-10 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Assign
          </button>
        </div>
      </form>

      {formData.customer_approval === "Approved" && (
  <div className="my-10 mt-10">
    <h1 className="text-2xl font-bold">Add Other details</h1>

    <form onSubmit={handleTestSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold">
            Duration ( days )
          </label>
          <input
            type="text"
            name="duration"
            placeholder="Enter days required"
            value={realTestdata.duration}
            onChange={handleInputTestChange}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">
            Order Status
          </label>
          <select
            name="order_status"
            value={realTestdata.order_status}
            onChange={handleInputTestChange}
            className="px-4 py-2 border rounded w-full"
          >
            <option value="transfer">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="w-full">
          <label className="block text-gray-700 font-bold">
            First Fitting Date
          </label>
          <div className="w-full">
            <DatePicker
              selected={realTestdata.first_fitting_date}
              onChange={(date: Date | null) =>
                handleDateChange(date, "first_fitting_date")
              }
              dateFormat="dd/MM/yyyy"
              className="w-full border placeholder:w-full border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
              placeholderText="Select a date"
              filterDate={(date) => date >= new Date()} // Disable past dates
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-bold">
            Second Fitting Date
          </label>
          <DatePicker
            selected={realTestdata.second_fitting_date}
            onChange={(date: Date | null) =>
              handleDateChange(date, "second_fitting_date")
            }
            dateFormat="dd/MM/yyyy"
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            placeholderText="Select a date"
            filterDate={(date) => date >= new Date()} // Disable past dates
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
}
