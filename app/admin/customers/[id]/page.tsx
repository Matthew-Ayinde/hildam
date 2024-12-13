"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowCustomer() {
  const router = useRouter();
  const { id } = useParams();
  interface Customer {
    fullName: string;
    age: number;
    gender: string;
    phone: string;
    date: string;
  }
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

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

      // Map response to fields used in the Table component
      if (result.data) {
        const mappedCustomer = {
          fullName: result.data.name,
          age: result.data.age,
          gender: result.data.gender,
          phone: result.data.phone_number || "N/A",
          date: new Date().toLocaleDateString(), // Placeholder date if not provided
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

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Loading...</div>;
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
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/inventory/list")}
          className="text-blue-500 underline"
        >
          Back to List
        </button>
      </div>
      <form className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold">Full Name</label>
          <input
            type="text"
            value={customer.fullName}
            readOnly
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Age</label>
          <input
            type="text"
            value={customer.age}
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
          <label className="block text-gray-700 font-bold">Phone</label>
          <input
            type="text"
            value={customer.phone}
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
      </form>
      <div className="mt-6 flex justify-end space-x-4">
        <div
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => router.push(`/admin/customers/${id}/edit`)}
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
