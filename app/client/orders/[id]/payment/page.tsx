"use client";

import Spinner from "@/components/Spinner";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Invoice = () => {
  const router = useRouter();
  const { id } = useParams();
  
  interface Customer {
    [x: string]: string | number | readonly string[] | undefined;
    date: string;
    order_id: string;
    amount: string
  }

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const fetchCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/myorders/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customer data");
      }

      const result = await response.json();

      if (result.data) {
        const mappedCustomer: Customer = {
          date: new Date().toLocaleDateString(),
          order_id: result.data.order_id || "N/A",
          amount: result.data.amount
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPaymentReceipt(file); // Store the selected file in state
  };

  const handleMakePayment = async () => {
    setLoading(true);
    setError(null);

    if (!paymentReceipt) {
      setError("Please upload a payment receipt.");
      setLoading(false);
      return;
    }

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("payment_method", "Transfer");
      formData.append("payment_receipt", paymentReceipt); // Append the file
      formData.append("order_id", customer?.order_id || "N/A");
      formData.append("payment_status_id", "1");

      const response = await fetch(`/api/makepayment/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // Send FormData with the file
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      console.log(result);
      setUploadMessage("Payment successful!"); // Set notification message

      // Show toast notification for 5 seconds
      setTimeout(() => {
        setUploadMessage(null); // Clear notification message
      }, 5000);

      // Redirect to the orders page
      router.push(`/client/orders/list`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }

    handleApproveStyle();
  };

  const handleApproveStyle = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`/api/approvestyle/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send image to project manager");
      }

      const result = await response.json();
      console.log(result);
      setUploadMessage("Image approved"); // Set notification message

      // Show toast notification for 5 seconds
      setTimeout(() => {
        return setUploadMessage(null); // Clear notification message
      }, 5000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }

    handleCloseModal();
    //redirect to the orders:id page
    router.push(`/client/orders/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red -500 py-10">
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <div className="border p-4 rounded shadow-lg">
        <div className="flex justify-between mb-4">
          <div>
            <img src="/logo.png" alt="Company Logo" className="h-12" />
          </div>
          <div className="text-right">
            <p className="font-bold">Invoice ID: #{customer.order_id}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <h1 className="text-3xl my-2 font-bold text-center">Payment Page</h1>
        <div className="flex justify-center py-10">
          <div className="w-[700px] p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 my-5">
            <h2 className="text-2xl font-bold text-center">Account Information</h2>
            <p className="text-center mb-6">Order ID: {customer.order_id}</p>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <div className="text-lg font-semibold mr-4 whitespace-nowrap">Account Number:</div>
                <div className="px-4 py-2 border border-gray-300 rounded-md w-full">2270293089</div>
              </div>
              <div className="flex items-center">
                <div className="text-lg font-semibold mr-4 whitespace-nowrap">Account Name:</div>
                <div className="px-4 py-2 border border-gray-300 rounded-md w-full">Hildam Couture</div>
              </div>
              <div className="flex items-center">
                <div className="text-lg font-semibold mr-4 whitespace-nowrap">Bank Name:</div>
                <div className="px-4 py-2 border border-gray-300 rounded-md w-full">First City Monument Bank</div>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="payment_method"
                  className="text-lg font-semibold mr-4 whitespace-nowrap"
                >
                  Payment Method:
                </label>
                <select
                  name="payment_method"
                  id="payment_method"
                  className="px-4 py-2 border border-gray-300 rounded-md w-full"
                  disabled
                >
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="payment_proof"
                  className="text-lg font-semibold mr-4 whitespace-nowrap"
                >
                  Upload Payment Proof:
                </label>
                <input
                  type="file"
                  name="payment_proof"
                  id="payment_proof"
                  className="px-4 py-2 border border-gray-300 rounded-md w-full"
                  onChange={handleFileChange} // Handle file change
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <h2 className="text-lg font-semibold">Subtotal:</h2>
              <p className="text-lg font-semibold text-green-600">₦{customer.amount}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-lg font-semibold">Payment Mode:</h2>
              <p className="text-lg">Transfer</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleMakePayment}
                className="my-10 px-4 py-2 bg-orange-500 flex text-white rounded hover:bg-orange-600"
              >
                Confirm Payment
              </button>
            </div>
            {uploadMessage && (
              <div className="text-center text-green-500">{uploadMessage}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

function handleCloseModal() {
  throw new Error("Function not implemented.");
}
