"use client";

import Spinner from "@/components/Spinner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    item_name: "",
    item_quantity: "",
  });

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/inventory/${id}`, {
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
        item_name: result.data.item_name,
        item_quantity: result.data.item_quantity,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/inventory/${id}`, {
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

      router.push(`/admin/inventory/${id}`);
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
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold">Item Name</label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Quantity</label>
          <input
            type="text"
            name="item_quantity"
            value={formData.item_quantity}
            onChange={handleInputChange}
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
          />
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
