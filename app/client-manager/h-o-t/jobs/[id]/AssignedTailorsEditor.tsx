"use client";

import { editTailorJob, fetchTailorJob, fetchTailorsList } from "@/app/api/apiClient";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { useRouter } from "next/navigation";

interface TailorOption {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AssignedTailorsEditorProps {
  jobId: string;
}

export default function AssignedTailorsEditor({ jobId }: AssignedTailorsEditorProps) {
  const router = useRouter();
  const [tailors, setTailors] = useState<TailorOption[]>([]);
  const [selectedTailorId, setSelectedTailorId] = useState<number | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadTailors = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [allTailors, jobDetails] = await Promise.all([
          fetchTailorsList(),
          fetchTailorJob(jobId),
        ]);

        const mappedTailors = (allTailors || []).map((tailor: any) => ({
          id: Number(tailor.id),
          name: tailor.name || "N/A",
          email: tailor.email || "N/A",
          role: tailor.role || "tailor",
        }));

        setTailors(mappedTailors);

        const currentTailor = jobDetails?.tailoring?.tailor;
        const currentTailorId = Array.isArray(currentTailor)
          ? Number(currentTailor[0]?.id)
          : Number(currentTailor?.id);

        if (!Number.isNaN(currentTailorId)) {
          setSelectedTailorId(currentTailorId);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load tailors."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTailors();
  }, [jobId]);

  const handleSave = async () => {
    if (!selectedTailorId) {
      setErrorMessage("Please select one tailor.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");
    setErrorMessage("");

    try {
      await editTailorJob(jobId, { tailor_id: selectedTailorId });
      setSaveMessage("Assigned tailor updated successfully.");
      setTimeout(() => {
        router.push(`/client-manager/h-o-t/jobs/${jobId}`);
      }, 3000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update assigned tailor."
      );
    } finally {
      setIsSaving(false);
    }

    setTimeout(() => setSaveMessage(""), 3000);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-5 text-sm text-gray-600">
        Loading tailors...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {saveMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <div className="flex items-center gap-2">
            <IoMdCheckmarkCircle className="text-lg" />
            <span>{saveMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <div className="flex items-center gap-2">
            <IoMdCloseCircle className="text-lg" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tailors.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
            No tailors found in the system.
          </div>
        ) : (
          tailors.map((tailor) => (
          <div
            key={tailor.id}
            className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors ${
              selectedTailorId === tailor.id
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-200"
            }`}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="assigned-tailor"
                checked={selectedTailorId === tailor.id}
                onChange={() => setSelectedTailorId(tailor.id)}
                className="mt-1 h-4 w-4 text-indigo-600"
              />

              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">{tailor.name}</h3>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    ID: {tailor.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </p>
                    <p className="text-sm text-gray-700">{tailor.role}</p>
                  </div>

                 
                </div>
              </div>
            </label>
          </div>
        ))
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={!selectedTailorId || isSaving}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FaSave />
        {isSaving ? "Saving..." : "Save Assignment"}
      </button>
    </div>
  );
}