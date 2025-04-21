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
import { FaChartBar } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RevenueAnalytics() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [totals, setTotals] = useState<{ revenue: number; expenditure: number } | null>(null);

  // Dummy year-based data
  const fetchChartData = (selectedYear: number) => {
    const revenueValues = MONTH_LABELS.map(() => Math.floor(Math.random() * 5000000) + 500000);
    const expenditureValues = MONTH_LABELS.map(() => Math.floor(Math.random() * 4000000) + 300000);

    const totalRevenue = revenueValues.reduce((sum, v) => sum + v, 0);
    const totalExpenditure = expenditureValues.reduce((sum, v) => sum + v, 0);
    setTotals({ revenue: totalRevenue, expenditure: totalExpenditure });

    setChartData({
      labels: MONTH_LABELS,
      datasets: [
        {
          label: "Total Revenue (₦)",
          data: revenueValues,
          backgroundColor: "#34D399",
        },
        {
          label: "Total Expenditure (₦)",
          data: expenditureValues,
          backgroundColor: "#F87171",
        },
      ],
    });
  };

  // Dummy weekly data
  const fetchWeeklyData = (week: string) => {
    const revenueValues = WEEK_LABELS.map(() => Math.floor(Math.random() * 500000) + 100000);
    const expenditureValues = WEEK_LABELS.map(() => Math.floor(Math.random() * 400000) + 80000);

    const totalRevenue = revenueValues.reduce((sum, v) => sum + v, 0);
    const totalExpenditure = expenditureValues.reduce((sum, v) => sum + v, 0);
    setTotals({ revenue: totalRevenue, expenditure: totalExpenditure });

    setChartData({
      labels: WEEK_LABELS,
      datasets: [
        {
          label: "Revenue (₦)",
          data: revenueValues,
          backgroundColor: "#34D399",
        },
        {
          label: "Expenditure (₦)",
          data: expenditureValues,
          backgroundColor: "#F87171",
        },
      ],
    });
  };

  useEffect(() => {
    if (selectedWeek) {
      fetchWeeklyData(selectedWeek);
    } else {
      fetchChartData(year);
    }
  }, [year, selectedWeek]);

  return (
    <div className="w-full flex flex-col items-center py-10 px-4 bg-white">
      {/* Header */}
      <motion.div
        className="flex items-center space-x-3 mb-4 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FaChartBar className="text-3xl text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-800">
          {selectedWeek ? "Weekly Financial Overview" : "Yearly Financial Overview"}
        </h1>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mb-6">
        {/* Year Selector */}
        <div className="flex items-center">
          <label htmlFor="year-select" className="mr-3 text-gray-700 font-medium">
            Select Year:
          </label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => {
              setSelectedWeek(null); // clear week
              setYear(Number(e.target.value));
            }}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            {Array.from({ length: 7 }, (_, i) => currentYear - 3 + i).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Week Picker */}
        <div className="flex items-center">
          <label htmlFor="week-picker" className="mr-3 text-gray-700 font-medium">
            Select Week:
          </label>
          <input
            id="week-picker"
            type="week"
            value={selectedWeek ?? ""}
            onChange={(e) => {
              setYear(currentYear); // reset year
              setSelectedWeek(e.target.value);
            }}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Totals */}
      {totals && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6 w-full">
          <div className="bg-green-50 p-4 rounded-lg shadow-md flex-1 text-center">
            <p className="text-gray-700">
              Total Revenue {selectedWeek ? `for week ${selectedWeek}` : `for ${year}`}
            </p>
            <p className="text-2xl font-semibold text-green-600">
              ₦ {totals.revenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-md flex-1 text-center">
            <p className="text-gray-700">
              Total Expenditure {selectedWeek ? `for week ${selectedWeek}` : `for ${year}`}
            </p>
            <p className="text-2xl font-semibold text-red-600">
              ₦ {totals.expenditure.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-center text-gray-600 italic mb-6">
        Showing {selectedWeek ? "daily" : "monthly"} <span className="font-semibold">revenue</span> (green) vs{" "}
        <span className="font-semibold">expenditure</span> (red).
      </p>

      {/* Chart */}
      <motion.div
        className="w-full bg-gray-50 rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {chartData ? (
          <div className="relative h-96">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: selectedWeek
                      ? `Week Overview - ${selectedWeek}`
                      : `Revenue vs Expenditure - ${year}`,
                    font: { size: 20 },
                    color: "#111827",
                  },
                  legend: {
                    position: "top",
                    labels: { font: { size: 14 }, color: "#374151" },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `₦${ctx.parsed.y.toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#374151", font: { size: 12 } },
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (val) => `₦${Number(val).toLocaleString()}`,
                      color: "#374151",
                      font: { size: 12 },
                    },
                    grid: { color: "rgba(156, 163, 175, 0.2)" },
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
      </motion.div>
    </div>
  );
}
