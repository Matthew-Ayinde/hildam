"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Last7Days() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<any>(null);

  const fetchChartData = () => {
    let cursor = new Date(startDate);
    const dates: Date[] = [];
    while (cursor <= endDate) {
      dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

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
          borderColor: "#34D399",           // Tailwind green-400
          backgroundColor: "rgba(52, 211, 153, 0.3)",
          pointBackgroundColor: "#34D399",
          pointBorderColor: "#FFFFFF",
          pointHoverBackgroundColor: "#FFFFFF",
          pointHoverBorderColor: "#34D399",
          borderWidth: 3,
          pointRadius: 6,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Completed",
          data: data.map((d) => d.completed),
          borderColor: "#60A5FA",           // Tailwind blue-400
          backgroundColor: "rgba(96, 165, 250, 0.3)",
          pointBackgroundColor: "#60A5FA",
          pointBorderColor: "#FFFFFF",
          pointHoverBackgroundColor: "#FFFFFF",
          pointHoverBorderColor: "#60A5FA",
          borderWidth: 3,
          pointRadius: 6,
          tension: 0.4,
          fill: true,
        },
      ],
    });
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <motion.div
        className="flex items-center space-x-3 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaChartBar className="text-3xl text-green-500" />
        <h1 className="text-2xl font-bold text-gray-800">Orders Overview</h1>
      </motion.div>

      <div className="flex flex-wrap justify-center items-end gap-6 mb-6 max-w-4xl w-full">
        <div className="relative flex flex-col">
          <label htmlFor="start" className="mb-1 font-medium text-gray-700 flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />Start
          </label>
          <DatePicker
            id="start"
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="pl-10 pr-4 py-2 border-2 border-transparent rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
          />
          <FaCalendarAlt className="absolute left-3 top-9 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative flex flex-col">
          <label htmlFor="end" className="mb-1 font-medium text-gray-700 flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />End
          </label>
          <DatePicker
            id="end"
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            className="pl-10 pr-4 py-2 border-2 border-transparent rounded-lg focus:border-green-400 focus:ring-2 focus:ring-green-100 transition"
          />
          <FaCalendarAlt className="absolute left-3 top-9 text-gray-400 pointer-events-none" />
        </div>

        <motion.button
          onClick={fetchChartData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
        >
          Apply
        </motion.button>
      </div>

      <motion.div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: { font: { size: 14 }, color: "#374151" },
                },
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
          />
        ) : (
          <p className="text-center text-gray-500">Loading chart...</p>
        )}
      </motion.div>
    </div>
  );
}
