"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const InventoryEditPage = () => {
  const { id } = useParams(); // Get the dynamic route parameter
  const [customer, setCustomer] = useState<any>(null);
  const [formData, setFormData] = useState({
    item_name: "",
    item_quantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="item_name">Item Name:</label>
            <input
              id="item_name"
              type="text"
              value={formData.item_name}
              onChange={(e) =>
                setFormData({ ...formData, item_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="item_quantity">Item Quantity:</label>
            <input
              id="item_quantity"
              type="number"
              value={formData.item_quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  item_quantity: parseInt(e.target.value, 10),
                })
              }
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
};

export default InventoryEditPage;
