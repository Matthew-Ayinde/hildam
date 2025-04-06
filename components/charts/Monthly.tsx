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

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    pointRadius: number;
    tension: number;
    fill: boolean;
  }[];
}

export default function Monthly() {
  // Updated dummy data with monthly results for two metrics: Total Orders and Completed Orders.
  const simulatedMonthlyData = [
    { month: "January", orders: 120, completedOrders: 100 },
    { month: "February", orders: 150, completedOrders: 130 },
    { month: "March", orders: 170, completedOrders: 160 },
    { month: "April", orders: 140, completedOrders: 120 },
    { month: "May", orders: 180, completedOrders: 170 },
    { month: "June", orders: 160, completedOrders: 150 },
    { month: "July", orders: 190, completedOrders: 180 },
    { month: "August", orders: 200, completedOrders: 190 },
    { month: "September", orders: 210, completedOrders: 200 },
    { month: "October", orders: 220, completedOrders: 210 },
    { month: "November", orders: 230, completedOrders: 220 },
    { month: "December", orders: 250, completedOrders: 240 },
  ];

  const [chartData, setChartData] = useState<ChartData | null>(null);

  const updateChartData = () => {
    const labels = simulatedMonthlyData.map((item) => item.month);
    const totalOrders = simulatedMonthlyData.map((item) => item.orders);
    const completedOrders = simulatedMonthlyData.map(
      (item) => item.completedOrders
    );

    const data: ChartData = {
      labels,
      datasets: [
        {
          label: "Total Orders",
          data: totalOrders,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          pointRadius: 5,
          tension: 0.4, // Smooth curve
          fill: true,
        },
        {
          label: "Completed Orders",
          data: completedOrders,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderWidth: 2,
          pointRadius: 5,
          tension: 0.4,
          fill: true,
        },
      ],
    };

    setChartData(data);
  };

  useEffect(() => {
    updateChartData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <motion.h1
        className="text-4xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Monthly Order Overview
      </motion.h1>
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
                  labels: {
                    font: { size: 16 },
                    color: "#333",
                  },
                },
                title: {
                  display: true,
                  text: "Orders & Completed Orders Per Month",
                  font: { size: 20 },
                  color: "#333",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Month",
                    font: { size: 16 },
                    color: "#333",
                  },
                  ticks: { color: "#555", font: { size: 14 } },
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
