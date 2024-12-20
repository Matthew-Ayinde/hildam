"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectManagerDropdown() {
  const { id } = useParams();
  const [managers, setManagers] = useState<
    {
      id: string;
      user_id: string;
      name: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [formData, setFormData] = useState<{
    user_id: string;
  }>({
    user_id: "",
  });

  useEffect(() => {
    const fetchProjectManagers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await fetch("/api/headoftailoringlist", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.data) {
          throw new Error("Failed to fetch project managers");
        }

        setManagers(result.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message || "An unexpected error occurred");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectManagers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      alert("No access token found! Please login first.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      manager_id: formData.user_id,
    };

    try {
      const response = await fetch(`/api/assignheadoftailoring/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setPopupMessage("Project manager assigned successfully");
        setFormData({
          user_id: "",
        });

        // Automatically hide popup message after 5 seconds
        setTimeout(() => {
          setPopupMessage("");
        }, 5000);
      } else {
        const error = await response.json();
        alert(`Failed to Assign Manager: ${error.message || "Unknown error"}`);
      }
    } catch (err) {
      alert("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {popupMessage && (
        <div className="fixed top-5 left-1/2 transform -transla-500 bg-green-500 text-white text-center py-2 px-4 rounded-lg shadow-lg z-50">
          {popupMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="w-full max-w-md mt-10">
          <label
            htmlFor="project-manager"
            className="block text-2xl font-medium text-gray-700"
          >
            Select Head of Tailoring
          </label>
          {loading ? (
            <div className="text-center text-gray-500 mt-2">Loading...</div>
          ) : error ? (
            <div className="text-red-500 mt-2">
              {error}{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div>
              <select
                id="user_id"
                className="mt-2 block w-full p-2 border border-gray-300 rounded-lg shadow-sm  focus:outline-none"
                value={formData.user_id}
                onChange={(e) => setFormData({ user_id: e.target.value })}
              >
                <option value="">Select Head of Tailoring</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.user_id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-orange-500 px-4 py-2 text-white mt-3 rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Assign"}
        </button>
      </form>
    </>
  );
}
