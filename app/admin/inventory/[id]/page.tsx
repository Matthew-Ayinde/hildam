"use client";

import Spinner from "../../../../components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import React from "react";

export default function ShowCustomer() {

  const router = useRouter();
  const { id } = useParams();
  interface Customer {
    id: string;
    item_name: string;
    item_quantity: number;
    created_at: string;
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/inventory/${id}`,
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

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/admin/inventory`}
          className="hover:text-blue-500 text-orange-500 flex flex-row items-center"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </Link>
      </div>
      <form className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-bold">Item Name</label>
          <input
            type="text"
            value={customer.item_name}
            readOnly
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold">Quantity</label>
          <input
            type="text"
            value={customer.item_quantity}
            readOnly
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-100"
          />
        </div>
        {/* Additional fields */}
      </form>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => router.push(`/admin/inventory/${id}/edit`)}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
