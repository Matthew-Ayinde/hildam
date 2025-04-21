"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChartBar, FaCalendarAlt } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Last7Days() {
  const [chartData, setChartData] = useState<any>(null);

  // Compute "today" and "7‑days‑ago" once on mount
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [startDate, setStartDate] = useState<Date>(sevenDaysAgo);
  const [endDate, setEndDate] = useState<Date>(today);

  // Format dates for display
  const formattedStart = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedEnd = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const fetchChartData = () => {
    // Generate array of dates in range
    let cursor = new Date(startDate);
    const dates: Date[] = [];
    while (cursor <= endDate) {
      dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    // Mock fetch: random orders and completions for each day
    const data = dates.map((d) => ({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      orders: Math.floor(Math.random() * 200) + 50,
      completed: Math.floor(Math.random() * 150) + 30,
    }));

    setChartData({
      labels: data.map((d) => d.label),
      datasets: [
        {
          label: "Total Orders",
          data: data.map((d) => d.orders),
          backgroundColor: "#34D399", // Tailwind green-400
          borderColor: "#34D399",
          borderWidth: 1,
        },
        {
          label: "Completed",
          data: data.map((d) => d.completed),
          backgroundColor: "#60A5FA", // Tailwind blue-400
          borderColor: "#60A5FA",
          borderWidth: 1,
        },
      ],
    });
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className="w-full flex flex-col justify-start py-10 px-4">
      {/* Header */}
      <motion.div
        className="flex items-center space-x-3 justify-center mb-4 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaChartBar className="text-3xl text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Orders Overview</h1>
      </motion.div>

      {/* Date Range Pickers and Apply Button */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4 w-full">
        <div className="flex space-x-5 w-full md:w-auto">
          {/* Start Date */}
          <div className="relative flex flex-col flex-1">
            <label
              htmlFor="start"
              className="mb-1 font-medium text-gray-700 flex items-center"
            >
              <FaCalendarAlt className="mr-2 text-gray-500" />
              Start
            </label>
            <DatePicker
              id="start"
              selected={startDate}
              onChange={(date: Date | null) => date && setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="pl-10 pr-4 py-2 border-2 border-transparent rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 transition w-full"
            />
            <FaCalendarAlt className="absolute left-3 top-9 text-gray-400 pointer-events-none" />
          </div>

          {/* End Date */}
          <div className="relative flex flex-col flex-1">
            <label
              htmlFor="end"
              className="mb-1 font-medium text-gray-700 flex items-center"
            >
              <FaCalendarAlt className="mr-2 text-gray-500" />
              End
            </label>
            <DatePicker
              id="end"
              selected={endDate}
              onChange={(date: Date | null) => date && setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              className="pl-10 pr-4 py-2 border-2 border-transparent rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 transition w-full"
            />
            <FaCalendarAlt className="absolute left-3 top-9 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Apply Button */}
        <motion.button
          onClick={fetchChartData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition w-full md:w-auto"
        >
          Apply
        </motion.button>
      </div>

      {/* Descriptive Text */}
      <div className="mb-6 text-center text-gray-600 italic w-full">
        Displaying data from <span className="font-semibold">{formattedStart}</span> to <span className="font-semibold">{formattedEnd}</span>.
        Use the date pickers above to adjust the range and click <span className="font-semibold">Apply</span> to refresh.
      </div>

      {/* Chart Container (full width) */}
      <motion.div
        className="w-full bg-white rounded-2xl shadow-xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `Orders from ${formattedStart} to ${formattedEnd}`,
                  font: { size: 18 },
                  color: "#374151",
                },
                legend: {
                  position: "top",
                  labels: { font: { size: 14 }, color: "#374151" },
                },
                tooltip: { enabled: true },
              },
              scales: {
                x: {
                  ticks: { color: "#6B7280", font: { size: 12 } },
                  grid: { display: false },
                },
                y: {
                  beginAtZero: true,
                  ticks: { color: "#6B7280", font: { size: 12 } },
                  grid: { color: "rgba(156, 163, 175, 0.2)" },
                },
              },
            }}
            height={400}
          />
        ) : (
          <p className="text-center text-gray-500">Loading chart...</p>
        )}
      </motion.div>
    </div>
  );
}
