"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowCustomer() {
  const router = useRouter();
  const { id } = useParams();
  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    fullName: string;
    gender: string;
    phone: string;
    date: string;
    email: string;
    address: string;
    bust: number;
    waist: number;
    hip: number;
    shoulderWidth: number;
    neck: number;
    armLength: number;
    backLength: number;
    frontLength: number;
    project_manager_order_status: string;
    project_manager_amount: string;
    clothing_description: string;
    clothing_name: string;
    order_id: string;
    priority: string;
    order_status: string;
    customer_description: string;

  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/orderslist/${id}`, {
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
        const mappedCustomer: Customer = {
          fullName: result.data.customer_name || "N/A",
          gender: result.data.gender || "N/A",
          phone: result.data.phone_number || "N/A",
          date: new Date().toLocaleDateString(), // Placeholder date if not provided
          email: result.data.customer_email || "N/A",
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hip: result.data.hips || 0,
          shoulderWidth: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          armLength: result.data.armLength || 0,
          backLength: result.data.back_length || 0,
          frontLength: result.data.front_length || 0,
          clothing_description: result.data.clothing_description || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          order_id: result.data.order_id || "N/A",
          priority: result.data.priority || "N/A",
          order_status: result.data.order_status || "N/A",
          customer_description: result.data.customer_description || "N/A",
          project_manager_order_status: result.data.project_manager_order_status || "N/A",
          project_manager_amount: result.data.project_manager_amount || "N/A",
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
          onClick={() => router.push("/admin/customers/list")}
          className="text-blue-500 underline"
        >
          Back to List
        </button>
      </div>
      <form>
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div>
            <label className="block text-gray-700 font-bold">Order ID</label>
            <input
              type="text"
              value={customer.order_id}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Cloth Name</label>
            <input
              type="text"
              value={customer.clothing_name}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Priority</label>
            <input
              type="text"
              value={customer.priority}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Order Status</label>
            <input
              type="text"
              value={customer.order_status}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
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
            <label className="block text-gray-700 font-bold">Customer Name</label>
            <input
              type="text"
              value={customer.fullName}
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
          <div>
            <label className="block text-gray-700 font-bold">Customer Email</label>
            <input
              type="text"
              value={customer.email}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Project Manager Order Status</label>
            <input
              type="text"
              value={customer.project_manager_order_status}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div className="">
            <div className="block text-gray-700 font-bold">
              Customer Description
            </div>
            <textarea
              rows={1}
              value={customer.customer_description}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div className=" mb-6">
            <div className="block text-gray-700 font-bold">
              Clothing Description
            </div>
            <textarea
              rows={1}
              value={customer.clothing_description}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-gray-700 font-bold">Address</label>
          <textarea
            value={customer.address}
            readOnly
            className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
          />
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
                  readOnly
                  id="bust"
                  name="bust"
                  value={customer.bust}
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
                  readOnly
                  id="waist"
                  name="waist"
                  value={customer.waist}
                  placeholder="Waist"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="hips"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hips
                </label>
                <input
                  type="number"
                  readOnly
                  id="hips"
                  name="hips"
                  value={customer.hips}
                  placeholder="Hips"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
                <label
                  htmlFor="shoulderWidth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Shoulder Width
                </label>
                <input
                  type="number"
                  readOnly
                  id="shoulderWidth"
                  name="shoulderWidth"
                  value={customer.shoulderWidth}
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
                  readOnly
                  id="neck"
                  name="neck"
                  value={customer.neck}
                  placeholder="Neck"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="armLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Arm Length
                </label>
                <input
                  type="number"
                  readOnly
                  id="armLength"
                  name="armLength"
                  value={customer.armLength}
                  placeholder="Arm Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/3">
                <label
                  htmlFor="backLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Back Length
                </label>
                <input
                  type="number"
                  readOnly
                  id="backLength"
                  name="backLength"
                  value={customer.backLength}
                  placeholder="Back Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="frontLength"
                  className="block text-sm font-medium text-gray-700"
                >
                  Front Length
                </label>
                <input
                  type="number"
                  readOnly
                  id="frontLength"
                  name="frontLength"
                  value={customer.frontLength}
                  placeholder="Front Length"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
              <div className="w-1/3">
                <label
                  htmlFor="highBust"
                  className="block text-sm font-medium text-gray-700"
                >
                  High Bust
                </label>
                <input
                  type="number"
                  readOnly
                  id="highBust"
                  name="highBust"
                  value={customer.highBust}
                  placeholder="High Bust"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-[#ff6c2f] focus:ring-[#ff6c2f] sm:text-sm p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="mt-6 flex justify-end space-x-4">
      <div
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => router.push(`/admin/orders/${id}/assign-project-manager`)}
        >
          Assign Project Manager
        </div>
        <div
          className="px-4 py-2 bg-orange-500 text-white rounded"
          onClick={() => router.push(`/admin/orders/${id}/edit`)}
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
