import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;

// "use client";

// import Spinner from "@/components/Spinner";
// import { useEffect, useState } from "react";

// export default function ProjectManagerDropdown() {
//   const [managers, setManagers] = useState<{ id: string; name: string }[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProjectManagers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const token = sessionStorage.getItem("access_token");
//         if (!token) throw new Error("No access token found");

//         const response = await fetch(
//           "https://hildam.insightpublicis.com/api/projectmanagerlist",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();
//         if (!result.data) {
//           throw new Error("Failed to fetch project managers");
//         }

//         setManagers(result.data);
//       } catch (error) {
//         if (error instanceof Error) {
//           setError(error.message || "An unexpected error occurred");
//         } else {
//           setError("An unexpected error occurred");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjectManagers();
//   }, []);

//   return (
//     <div className="w-full max-w-md mt-10">
//       <label htmlFor="project-manager" className="block text-2xl font-medium text-gray-700">
//         Select Project Manager
//       </label>
//       {loading ? (
//         <div className="text-center text-gray-500 mt-2">
//           <Spinner />
//         </div>
//       ) : error ? (
//         <div className="text-red-500 mt-2">
//           {error}{" "}
//           <button
//             className="text-blue-500 underline"
//             onClick={() => window.location.reload()}
//           >
//             Retry
//           </button>
//         </div>
//       ) : (
//         <div>
//           <select
//           id="project-manager"
//           className="mt-2 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
//         >
//           <option value="">Select project manager</option>
//           {managers.map((manager) => (
//             <option key={manager.id} value={manager.user_id}>
//               {manager.name}
//             </option>
//           ))}
//         </select>

//         <div
//           className="mt-2 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-green-300 focus:outline-none"
//         >
//           {managers.map((manager) => (
//             <h1 key={manager.id} className="flex flex-col">
//               {manager.name}
//               {manager.id}
//               {manager.user_id}
//             </h1>
//           ))}
//         </div>
//         </div>

//       )}
//     </div>
//   );
// }
