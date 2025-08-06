// app/inventory/page.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { getSession } from 'next-auth/react';

interface InventoryItem {
  id: string;
  item_name: string;
  item_quantity: number;
  created_at: string;
}

interface InventoryResponse {
  message: string;
  data: Array<{
    id: string;
    item_name: string;
    item_quantity: string;
    created_at: string;
  }>;
}

type Requests = {
  [key: string]: number;
};

type Errors = {
  [key: string]: string;
};

export default function InventoryPage() {
  // State to hold the fetched inventory data
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  // Loading state for data fetch
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  // State for the requested quantities per item
  const [requests, setRequests] = useState<Requests>({});
  // Inline validation errors for each item
  const [errors, setErrors] = useState<Errors>({});
  // Simulated backend loading state on form submission
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Success message state
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Fetch inventory data on component mount with access token from NextAuth
  useEffect(() => {
    async function fetchInventory() {
      try {
        // Get session from NextAuth to extract the access token
        const session = await getSession();
        const accessToken = session?.user?.token;

        // Make sure we have a token before making the request
        if (!accessToken) {
          console.error("Access token not found. You may need to sign in.");
          setDataLoading(false);
          return;
        }

        const res = await fetch('https://hildam.insightpublicis.com/api/inventory', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data: InventoryResponse = await res.json();

        // Convert item_quantity from string to number for each item
        const items: InventoryItem[] = data.data.map((item) => ({
          ...item,
          item_quantity: parseInt(item.item_quantity, 10),
        }));

        setInventoryData(items);
        // Initialize the request state for each item
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    // Simulate a backend call with a delay
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Inventory request submitted successfully!");
    }, 2000);
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-200 to-orange-100">
        <p className="text-xl font-semibold text-orange-600">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-200 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
          List of Inventory Items
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {inventoryData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center border border-orange-300 p-4 rounded-lg shadow-sm"
              >
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {item.item_name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Available: {item.item_quantity}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-3">
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(item.id, item.item_quantity, e.target.value)
                      }
                      className="w-20 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                      min="0"
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
                    <p className="mt-2 text-sm text-red-500">{errors[item.id]}</p>
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
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-md text-center"
          >
            {successMsg}
          </motion.div>
        )}
      </div>
    </div>
  );
}
