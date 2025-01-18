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
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    payment_status: "",
    order_id: "",
      });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchCustomer = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/payment/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment data");
      }

      const result = await response.json();
      setCustomer(result.data);
      setFormData({
        order_id: result.data.order_id,
        payment_status: result.data.payment_status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
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
    setSuccessMessage("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/editpayment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }

      setSuccessMessage("Customer data updated successfully!");
      setTimeout(() => {
        router.push('/admin/orders');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
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
      {successMessage && (
        <div className="text-center text-green-500 py-2">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold">Order ID</label>
            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              onChange={handleInputChange}
              disabled
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Payment Status</label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-white"
            >
              <option value="" disabled>
                Select Payment Status
              </option>
              <option value="In Review">In Review</option>
              <option value="Paid">Paid</option>
              <option value="Not Paid">Not paid</option>
            </select>
          </div>
          
          
        </div>

        <div className="col-span-2 mt-10 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push(`/admin/payments/${id}`)}
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}