// components/AssignTailors.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Spinner from '@/components/Spinner';

interface Tailor {
  id: string;    // user_id for allTailors, and zipped ids for assigned
  name: string;
}

interface AssignTailorsProps {
  jobId: string;
}

export default function AssignTailors({ jobId }: AssignTailorsProps) {
  const [allTailors, setAllTailors] = useState<Tailor[]>([]);
  const [assignedTailors, setAssignedTailors] = useState<Tailor[]>([]);
  const [selectedTailorIds, setSelectedTailorIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // helper to fetch session token
  const getAuthHeaders = async () => {
    const session = await getSession();
    const token = session?.user?.token;
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  // fetch all available tailors
  const fetchAllTailors = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      'https://hildam.insightpublicis.com/api/listoftailors',
      { headers }
    );
    if (!res.ok) throw new Error('Failed to fetch tailor list');
    const json = await res.json();
    setAllTailors(
      json.data.map((t: any) => ({
        id: t.user_id,
        name: t.name,
      }))
    );
  };

  // fetch assigned tailors for this job
  const fetchAssigned = async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `https://hildam.insightpublicis.com/api/tailorjoblists/${jobId}`,
      { headers }
    );
    if (!res.ok) throw new Error('Failed to fetch assigned tailors');
    const json = await res.json();

    const ids: string[] = json.data.tailor_ids || [];
    const names: string[] = json.data.tailor_names || [];

    // zip the first names.length entries of ids with names
    const zipped: Tailor[] = names.map((nm, i) => ({
      id: ids[i],
      name: nm,
    }));
    setAssignedTailors(zipped);
  };

  // on mount: load full list + assignments
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAllTailors(), fetchAssigned()]);
      } catch (err: any) {
        console.error(err);
        setMessage(err.message || 'Error loading tailors');
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  // select/unselect a tailor to assign
  const toggleSelect = (tid: string) => {
    setSelectedTailorIds(prev =>
      prev.includes(tid) ? prev.filter(id => id !== tid) : [...prev, tid]
    );
  };

  // POST new assignments (append-only)
  const handleAssign = async () => {
    if (!selectedTailorIds.length) return;
    setAssigning(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      };
      const res = await fetch(
        `https://hildam.insightpublicis.com/api/edittailorjob/${jobId}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ tailor_ids: selectedTailorIds }),
        }
      );
      if (!res.ok) throw new Error('Failed to assign tailors');

      setMessage('Tailors assigned successfully!');
      setSelectedTailorIds([]);
      await fetchAssigned();
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Assignment failed');
    } finally {
      setAssigning(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      {/* Currently Assigned */}
      <section>
        <h2 className="text-xl font-bold mb-2">
          Currently Assigned Tailors
        </h2>
        {assignedTailors.length ? (
          <ul className="list-disc list-inside space-y-1">
            {assignedTailors.map(t => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tailors assigned yet.</p>
        )}
      </section>

      {/* Selection Grid */}
      <section>
        <h2 className="text-xl font-bold mb-4">Assign New Tailors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allTailors
            .filter(t => !assignedTailors.some(a => a.id === t.id))
            .map(t => (
              <label
                key={t.id}
                className="flex items-center space-x-2 p-3 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTailorIds.includes(t.id)}
                  onChange={() => toggleSelect(t.id)}
                />
                <span>{t.name}</span>
              </label>
            ))}
        </div>
      </section>

      {/* Assign Button */}
      <button
        onClick={handleAssign}
        disabled={assigning || !selectedTailorIds.length}
        className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {assigning ? <Spinner /> : 'Assign Selected Tailors'}
      </button>

      {/* Feedback */}
      {message && (
        <div className="mt-4 text-center text-green-600">{message}</div>
      )}
    </div>
  );
}
