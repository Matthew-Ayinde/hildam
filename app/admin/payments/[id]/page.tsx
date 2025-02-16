"use client";

import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

export default function ShowCustomer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    payment_status_id: "",
    order_id: "",
  });

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

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleCustomerImageClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleCustomerCloseModal = () => {
    setIsCustomerModalOpen(false);
  };
  const router = useRouter();
  const { id } = useParams();
  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    fullName: string;
    phone_number: string;
    payment_receipt: string;
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
    project_manager_payment_method: string;
    project_manager_amount: string;
    clothing_description: string;
    clothing_name: string;
    order_id: string;
    customer_email: string;
    payment_method: string;
    payment_status: string;
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
      const response = await fetch(
        `${baseUrl}/payment/${id}`,
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

      // Map response to fields used in the Table component
      if (result.data) {
        const mappedCustomer: Customer = {
          fullName: result.data.customer_name || "N/A",
          phone_number: result.data.phone_number || "N/A",
          payment_receipt: result.data.payment_receipt || "N/A",
          phone: result.data.phone_number || "N/A",
          payment_status: result.data.payment_status || "N/A",
          date: new Date().toLocaleDateString(), // Placeholder date if not provided
          email: result.data.customer_email || "N/A",
          address: result.data.address || "N/A",
          bust: result.data.bust || 0,
          waist: result.data.waist || 0,
          hip: result.data.hips || 0,
          highBust: result.data.high_bust,
          shoulderWidth: result.data.shoulder_width || 0,
          neck: result.data.neck || 0,
          armLength: result.data.arm_length || 0,
          backLength: result.data.back_length || 0,
          frontLength: result.data.front_length || 0,
          clothing_description: result.data.clothing_description || "N/A",
          clothing_name: result.data.clothing_name || "N/A",
          order_id: result.data.order_id || "N/A",
          customer_email: result.data.customer_email || "N/A",
          payment_method: result.data.payment_method || "N/A",
          customer_description: result.data.customer_description || "N/A",
          project_manager_payment_method:
            result.data.project_manager_payment_method || "N/A",
          project_manager_amount: result.data.project_manager_amount || "N/A",
          manager_name: result.data.manager_name || "N/A",
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
        <button onClick={fetchCustomer} className="text-orange-500 underline">
          Retry
        </button>
      </div>
    );
  }

  const handleApprovePayment = async () => {
    handleCustomerCloseModal();
  };

  const handleRejectPayment = async () => {
    handleCustomerCloseModal();
  };

  if (!customer) {
    return <div className="text-center text-gray-500 py-10">No data found</div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/payments"
          className="hover:text-orange-700 text-orange-500 flex flex-row items-center"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </Link>
      </div>
      <form>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
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
            <label className="block text-gray-700 font-bold">
              Customer Name
            </label>
            <input
              type="text"
              value={customer.fullName}
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
            <label className="block text-gray-700 font-bold">
              Customer Email
            </label>
            <input
              type="text"
              value={customer.customer_email}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          {/* <div>
            <label className="block text-gray-700 font-bold">
              Payment Method
            </label>
            <input
              type="text"
              value={customer.payment_method}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div> */}
          <div>
            <label className="block text-gray-700 font-bold">
              Payment Status
            </label>
            <input
              type="text"
              value={customer.payment_status}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">
              Phone Number
            </label>
            <input
              type="text"
              value={customer.phone_number}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Date</label>
            <input
              type="text"
              value={customer.date}
              readOnly
              className="w-full border border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50"
            />
          </div>
        </div>
          <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-md">
            <div className="">
              <label className="block text-gray-700 font-bold">
                Proof of Payment
              </label>
              <img
                src={
                  typeof customer.payment_receipt === "string"
                    ? customer.payment_receipt
                    : undefined
                }
                alt="style_reference_images"
                className="border w-24 h-24 border-gray-300 text-[#5d7186] text-sm rounded p-2 bg-gray-50 cursor-pointer"
                onClick={handleCustomerImageClick} // Open modal on click
              />
              <div className="text-sm my-2">Click to view</div>

              {customer.payment_status === "Paid" && (
                <div className="flex items-center space-x-2">
                  <div className="font-bold">Status:</div>
                  <div className="bg-green-500 text-white w-fit rounded text-sm py-1 px-3">
                    Paid
                  </div>
                </div>
              )}

              {customer.payment_status === "Not Paid" && (
                <div className="flex items-center space-x-2">
                  <div className="font-bold">Status:</div>
                  <div className="bg-red-500 text-white w-fit rounded text-sm py-1 px-3">
                    Not Paid
                  </div>
                </div>
              )}

              <div className="text-sm mt-3">
                Click next to change payment status
              </div>
            </div>

            {isCustomerModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                onClick={handleCustomerCloseModal}
              >
                <div
                  className="bg-white rounded-lg p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={customer.payment_receipt}
                    alt="Style Reference"
                    className="w-60 h-60 lg:w-96 lg:h-96 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = ""; // Clear the image source
                      e.currentTarget.alt = "Image failed to load"; // Update alt text
                    }}
                  />
                  {/* <p className="text-red-500 text-center mt-2">
                    Image failed to load
                  </p> */}
                  {/* <div className="flex justify-between mt-3 text-sm lg:text-base">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded"
                      onClick={handleApprovePayment}
                    >
                      Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={handleRejectPayment}
                    >
                      Close
                    </button>
                  </div> */}
                </div>
              </div>
            )}
          </div>
      </form>
      <div className="mt-6 flex justify-end space-x-4">
        <Link
          href={`/admin/payments/${id}/edit`}
          className="px-4 py-2 bg-orange-500 text-white rounded"
        >
          Next
        </Link>
      </div>
      {/* 
      <form>
        <button
          onClick={() => router.push("/admin/payments")}
          className="hover:text-blue-500 text-orange-500 flex flex-row items-center mb-5"
        >
          <IoIosArrowBack size={30} />
          <div className="mx-2">Back to List</div>
        </button>
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
                className={`px-4 py-2 rounded ${formData.payment_status_id === "2" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                In Review
              </button>
              <button
                type="button"
                onClick={() => handlePaymentStatusChange("3")}
                className={`px-4 py-2 rounded ${formData.payment_status_id === "3" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                Paid
              </button>
              <button
                type="button"
                onClick={() => handlePaymentStatusChange("1")}
                className={`px-4 py-2 rounded ${formData.payment_status_id === "1" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
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
      </form> */}
    </div>
  );
}
