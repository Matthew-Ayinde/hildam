import Link from "next/link";
import { FaUserTie } from "react-icons/fa";

interface AssignedTailor {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AssignedTailorsSectionProps {
  jobId: string;
  tailors: AssignedTailor[];
}

export default function AssignedTailorsSection({
  jobId,
  tailors,
}: AssignedTailorsSectionProps) {
  const activeTailors = tailors.filter(
    (tailor) => tailor.role?.toLowerCase() === "tailor"
  );

  return (
    <section className="mb-12">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <FaUserTie className="text-indigo-600" />
            </div>
            Assigned Tailors
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            The team currently assigned to this tailoring job.
          </p>
        </div>

        <Link
          href={`/client-manager/h-o-t/jobs/${jobId}/edit`}
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Edit Assigned Tailors
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 bg-gray-50 p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Total Assigned
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {tailors.length}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Active Today
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {activeTailors.length}
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {tailors.length === 0 ? (
            <div className="p-5 text-sm text-gray-500">
              No tailor assigned to this job yet.
            </div>
          ) : (
            tailors.map((tailor) => (
              <div
                key={tailor.id}
                className="grid grid-cols-1 gap-3 p-5 md:grid-cols-6 md:items-center"
              >
                <div className="md:col-span-2">
                  <p className="font-semibold text-gray-800">{tailor.name}</p>
                  <p className="text-sm text-gray-500">{tailor.role}</p>
                </div>

                <p className="text-sm text-gray-700 md:col-span-3">{tailor.email}</p>

                <div>
                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Assigned
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}