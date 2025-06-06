// app/inventory/page.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSession } from 'next-auth/react';
import { HiCheckCircle, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import Spinner from '@/components/Spinner';
import { useParams } from 'next/navigation';

interface InventoryItem {
  id: string;
  item_name: string;
  item_quantity: number;
  created_at: string;
  color: string; // Assuming color is a string, adjust if necessary
}

interface InventoryResponse {
  message: string;
  data: Array<{
    id: string;
    item_name: string;
    item_quantity: string;
    created_at: string;
    color: string; // Assuming color is a string, adjust if necessary
  }>;
}

type Requests = {
  [key: string]: number;
};

type Errors = {
  [key: string]: string;
};

export default function InventoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<Requests>({});
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");

  // New state for help modal
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const session = await getSession();
        const accessToken = session?.user?.token;
        if (!accessToken) {
          console.error("Access token not found. You may need to sign in.");
          setDataLoading(false);
          return;
        }

        const res = await fetch('https://hildam.insightpublicis.com/api/inventory', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data: InventoryResponse = await res.json();

        const items: InventoryItem[] = data.data.map((item) => ({
          ...item,
          item_quantity: parseInt(item.item_quantity, 10),
        }));

        setInventoryData(items);
        const initialRequests: Requests = items.reduce((acc: Requests, item) => {
          acc[item.id] = 0;
          return acc;
        }, {});
        setRequests(initialRequests);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setDataLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const handleIncrement = (id: string, available: number) => {
    setErrors((prev) => ({ ...prev, [id]: "" }));
    setRequests((prev) => {
      const newValue = prev[id] + 1;
      if (newValue > available) {
        setErrors((prevErr) => ({
          ...prevErr,
          [id]: `Cannot request more than ${available}`,
        }));
        return { ...prev };
      }
      return { ...prev, [id]: newValue };
    });
  };

  const handleDecrement = (id: string) => {
    setErrors((prev) => ({ ...prev, [id]: "" }));
    setRequests((prev) => ({
      ...prev,
      [id]: Math.max(prev[id] - 1, 0),
    }));
  };

  const handleChange = (id: string, available: number, value: string) => {
    const numericValue = Number(value);
    setErrors((prev) => ({ ...prev, [id]: "" }));
    if (numericValue > available) {
      setErrors((prev) => ({
        ...prev,
        [id]: `Cannot request more than ${available}`,
      }));
      return;
    }
    setRequests((prev) => ({ ...prev, [id]: numericValue }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;

    inventoryData.forEach((item) => {
      if (requests[item.id] > item.item_quantity) {
        setErrors((prev) => ({
          ...prev,
          [item.id]: `Cannot request more than ${item.item_quantity}`,
        }));
        hasError = true;
      }
    });

    if (hasError) return;

    setIsLoading(true);
    setSuccessMsg("");

    try {
      const session = await getSession();
      const accessToken = session?.user?.token;
      if (!accessToken) {
        setErrors((prev) => ({ ...prev, general: "Authentication failed. Please sign in again." }));
        setIsLoading(false);
        return;
      }

      const itemsToRequest = inventoryData
        .filter((item) => requests[item.id] > 0)
        .map((item) => ({ name: item.item_name, quantity: requests[item.id], color: item.color }));

      if (itemsToRequest.length === 0) {
        setErrors((prev) => ({ ...prev, general: "You must request at least one item." }));
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://hildam.insightpublicis.com/api/requestinventory/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ items: itemsToRequest }),
      });

      if (!response.ok) throw new Error(`Server error: ${await response.text()}`);

      setSuccessMsg("Inventory request submitted successfully!");
      setRequests(Object.keys(requests).reduce((acc, key) => ({ ...acc, [key]: 0 }), {} as Requests));
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, general: "Something went wrong during submission. Please try again." }));
    } finally {
      setIsLoading(false);
    }
  };

  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (successMsg) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  if (dataLoading) {
    return (
      <div className="min-h-40 flex items-center justify-center bg-gradient-to-r from-orange-200 to-orange-100 space-x-2">
        <p className="text-xl font-semibold text-orange-600">Loading items...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative rounded-xl">
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2 z-50"
          >
            <HiCheckCircle size={24} />
            <span className="font-medium">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            key="helpBackdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowHelpModal(false)}>×</button>
              <h2 className="text-2xl font-semibold text-orange-600 mb-2 text-center">How Our Inventory Request System Works</h2>
              <p className="text-center text-gray-700 mb-4">Welcome to our streamlined inventory management portal! Below you can
                view real-time stock levels and easily submit requests to adjust
                quantities. Our process ensures accuracy, transparency, and speed
                every step of the way.</p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 px-4">
                <li><strong>Review Stock:</strong> See the current availability for each item to make informed decisions.</li>
                <li><strong>Adjust Quantity:</strong> Use the plus/minus buttons or type directly to specify the number you wish to request.</li>
                <li><strong>Submit Request:</strong> Click "Submit Request" to send your updated quantities to our inventory team instantly.</li>
                <li><strong>Confirmation:</strong> Receive immediate feedback and a confirmation message once your request is processed.</li>
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          className="bg-orange-500 p-3 rounded-full text-white shadow-lg focus:outline-none hover:bg-orange-600 transition"
          onClick={() => setShowHelpModal(true)}
        >
          <HiOutlineQuestionMarkCircle size={24} />
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Available Inventory Items
        </h1>

        <form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {inventoryData.map(item => (
      <div
        key={item.id}
        className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{item.item_name}</h2>
          <p className="text-sm text-gray-500">Available: {item.item_quantity}</p>
          {/* New Color Display */}
          <div className="mt-2 flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Color:</span>
            <div
              className="w-5 h-5 rounded-full border"
              style={{ backgroundColor: item.color }}
            />
            <span className="ml-2 text-sm text-gray-600 capitalize">{item.color}</span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => handleDecrement(item.id)}
              className="px-3 py-1 bg-orange-500 text-white rounded-full focus:outline-none"
            >
              –
            </motion.button>
            <input
              type="number"
              value={requests[item.id]}
              onChange={(e) => handleChange(item.id, item.item_quantity, e.target.value)}
              className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              min={0}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => handleIncrement(item.id, item.item_quantity)}
              className="px-3 py-1 bg-orange-500 text-white rounded-full focus:outline-none"
            >
              +
            </motion.button>
          </div>
          {errors[item.id] && (
            <p className="mt-2 text-center text-sm text-red-500">
              {errors[item.id]}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>

  <button
    type="submit"
    disabled={isLoading}
    className="mt-8 w-full py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 disabled:opacity-50"
  >
    {isLoading ? "Submitting..." : "Submit Request"}
  </button>
</form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If you have any questions, please contact your client manager.
          </p>
        </div>
      </div>
    </div>
  );
}
