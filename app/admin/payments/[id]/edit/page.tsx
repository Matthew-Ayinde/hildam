"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function EditCustomer() {

  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    payment_status_id: "",
    order_id: "",
  });

  const fetchCustomer = async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment data");
      }

      const result = await response.json();
      setFormData({
        order_id: result.data.order_id,
        payment_status_id: result.data.payment_status_id, // Use fetched payment_status_id
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentStatusChange = (statusId: string) => {
    setFormData({
      ...formData,
      payment_status_id: statusId,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editpayment/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment data");
      }

      setSuccessMessage("Payment status updated successfully!");
      setTimeout(() => {
        router.push("/admin/payments");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
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
        <div className="fixed top-0 left-1/2 mt-5 -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-md">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Link href={"/admin/payments"}
          className="hover:text-orange-700 text-orange-500 flex flex-row items-center mb-5"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </Link>
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
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handlePaymentStatusChange("2")}
                className={`px-4 py-2 rounded ${formData.payment_status_id === "2" ? "bg-orange-500 text-white" : "bg-gray-200 text-black"}`}
              >
                In Review
              </button>
              <button
                type="button"
                onClick={() => handlePaymentStatusChange("3")}
                className={`px-4 py-2 rounded ${formData.payment_status_id === "3" ? "bg-orange-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => handlePaymentStatusChange("1")}
                className={`px-4 py-2 rounded ${formData.payment_status_id === "1" ? "bg-orange-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Not Paid
              </button>
            </div>
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