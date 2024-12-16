import React from "react";

const Page = () => {
  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Assign Project Manager
      </h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Order Details
        </h2>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Order ID: <span className="font-medium">123456</span></p>
          <p>Customer Name: <span className="font-medium">John Smith</span></p>
          <p>Order Date: <span className="font-medium">2023-10-01</span></p>
          <p>Total Amount: <span className="font-medium">$250.00</span></p>
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="projectManager"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Project Manager
        </label>
        <select
          name="projectManager"
          id="projectManager"
          className="block w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="" disabled>
            Select Project Manager
          </option>
          <option value="1">John Doe</option>
          <option value="2">Jane Doe</option>
        </select>
      </div>
      <button className="w-full bg-orange-500 text-white py-2 rounded-md font-medium hover:bg-orange-600 transition">
        Assign Manager
      </button>
    </div>
  );
};

export default Page;
