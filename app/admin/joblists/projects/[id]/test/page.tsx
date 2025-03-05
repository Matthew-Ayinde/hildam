"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const ManagerDropdown = () => {

    //get id from the url
    const { id } = useParams();

     const [realdata, setRealdata] = useState({
        manager_id: "",
        duration: "",
      });
      
  interface Manager {
    id: string;
    name: string;
  }

  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Fetching Managers on page load
  useEffect(() => {
    const fetchManagers = async () => {
      setLoadingManagers(true);
      try {
        const accessToken = sessionStorage.getItem("access_token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/headoftailoringlist`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }

        const result = await response.json();
        setManagers(result.data);
      } catch (err) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchManagers();
  }, []);

  // Handling manager selection and sending PUT request
  const handleSelect = async (managerId: string) => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const realTestdata = { manager_id: managerId };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editproject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(realTestdata),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      setFlashMessage("Project updated successfully!");
      setTimeout(() => setFlashMessage(""), 5000); // Clear after 5 seconds
    } catch (err) {
      setFlashMessage("Update failed");
      setTimeout(() => setFlashMessage(""), 5000); // Clear after 5 seconds
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {flashMessage && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center">
          {flashMessage}
        </div>
      )}

      <label htmlFor="manager" className="block mb-2">
        Select Manager:
      </label>
      <div className="relative">
        <select
          id="manager"
          value={selectedManager || ""}
          onChange={(e) => {
            const managerId = e.target.value;
            setSelectedManager(managerId);
            handleSelect(managerId);
          }}
          className="block w-full p-2 border rounded-md"
        >
          <option value="">Select a Manager</option>
          {loadingManagers ? (
            <option disabled>Loading...</option>
          ) : (
            managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))
          )}
        </select>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
      </div>

      {errorMessage && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center mt-12">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ManagerDropdown;
