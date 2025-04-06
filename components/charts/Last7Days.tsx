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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartData, setChartData] = useState(null);

  // Function to generate and filter data based on selected date range
  const fetchChartData = () => {
    let currentDate = new Date(startDate);
    let datesArray = [];

    while (currentDate <= endDate) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const simulatedData = datesArray.map((date) => {
      return {
        date: date.toISOString().split("T")[0],
        formattedDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        orders: Math.floor(Math.random() * 200) + 50,
        completedOrders: Math.floor(Math.random() * 150) + 30,
      };
    });

    setChartData({
      labels: simulatedData.map((item) => item.formattedDate),
      datasets: [
        {
          label: "Total Orders",
          data: simulatedData.map((item) => item.orders),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          pointRadius: 5,
          tension: 0.4,
          fill: true,
        },
        {
          label: "Completed Orders",
          data: simulatedData.map((item) => item.completedOrders),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 2,
          pointRadius: 5,
          tension: 0.4,
          fill: true,
        },
      ],
    });
  };

  // Fetch initial data on mount
  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <motion.h1
        className="text-4xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Order Analytics
      </motion.h1>

      <div className="flex justify-between items-center w-full px-32 mb-5">
        <div className="flex flex-row">
          <div className="flex items-center gap-2 me-5">
            <label className="font-semibold text-gray-700">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="border border-gray-300 p-2 rounded-md shadow-md text-gray-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold text-gray-700">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              className="border border-gray-300 p-2 rounded-md shadow-md text-gray-700"
            />
          </div>
        </div>

        {/* Apply Filter Button */}
        <button
          onClick={fetchChartData}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
        >
          Apply Filter
        </button>
      </div>

      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: { font: { size: 16 }, color: "#333" },
                },
                title: {
                  display: true,
                  text: "Orders & Completed Orders Per Day",
                  font: { size: 20 },
                  color: "#333",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Date",
                    font: { size: 16 },
                    color: "#333",
                  },
                  ticks: {
                    color: "#555",
                    font: { size: 14 },
                  },
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Number of Orders",
                    font: { size: 16 },
                    color: "#333",
                  },
                  ticks: { color: "#555", font: { size: 14 } },
                  grid: { color: "rgba(200,200,200,0.2)" },
                },
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500">Loading chart data...</p>
        )}
      </motion.div>
    </div>
  );
}
