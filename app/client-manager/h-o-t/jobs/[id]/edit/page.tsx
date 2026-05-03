import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import AssignedTailorsEditor from "../AssignedTailorsEditor";

interface EditAssignedTailorsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAssignedTailorsPage({
  params,
}: EditAssignedTailorsPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={`/client-manager/h-o-t/jobs/${id}`}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <IoIosArrowBack className="text-lg" />
            Back to Jobs
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-7 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <FaUserTie className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Edit Assigned Tailors</h1>
                <p className="mt-1 text-sm text-indigo-100">
                  Update assignment details for this tailoring job.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-6 md:px-8">
            <AssignedTailorsEditor jobId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
