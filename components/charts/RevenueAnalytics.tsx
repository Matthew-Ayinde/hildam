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
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function RevenueAnalytics() {
  // Current year and options
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [chartData, setChartData] = useState<any>(null);
  const [totals, setTotals] = useState<{ revenue: number; expenditure: number } | null>(null);

  // Generate dummy monthly and total data for selected year
  const fetchChartData = (selectedYear: number) => {
    // Monthly arrays
    const revenueValues = MONTH_LABELS.map(
      () => Math.floor(Math.random() * 5000000) + 500000
    );
    const expenditureValues = MONTH_LABELS.map(
      () => Math.floor(Math.random() * 4000000) + 300000
    );

    // Annual totals
    const totalRevenue = revenueValues.reduce((sum, v) => sum + v, 0);
    const totalExpenditure = expenditureValues.reduce((sum, v) => sum + v, 0);
    setTotals({ revenue: totalRevenue, expenditure: totalExpenditure });

    // Chart data
    setChartData({
      labels: MONTH_LABELS,
      datasets: [
        {
          label: "Total Revenue (₦)",
          data: revenueValues,
          backgroundColor: "#34D399",
          borderColor: "#34D399",
          borderWidth: 1,
        },
        {
          label: "Total Expenditure (₦)",
          data: expenditureValues,
          backgroundColor: "#F87171",
          borderColor: "#F87171",
          borderWidth: 1,
        },
      ],
    });
  };

  // Fetch on mount and year change
  useEffect(() => {
    fetchChartData(year);
  }, [year]);

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
        <h1 className="text-2xl font-bold text-gray-800">Yearly Financial Overview</h1>
      </motion.div>

      {/* Year Selector */}
      <div className="flex items-center justify-end mb-6 w-full">
        <label htmlFor="year-select" className="mr-3 text-gray-700 font-medium">
          Select Year:
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-200"
        >
          {Array.from({ length: 7 }, (_, i) => currentYear - 3 + i).map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      {/* Annual Totals Display */}
      {totals && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6 w-full">
          <div className="bg-green-50 p-4 rounded-lg shadow-md flex-1 text-center">
            <p className="text-gray-700">Total Revenue for {year}</p>
            <p className="text-2xl font-semibold text-green-600">
              ₦ {totals.revenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-md flex-1 text-center">
            <p className="text-gray-700">Total Expenditure for {year}</p>
            <p className="text-2xl font-semibold text-red-600">
              ₦ {totals.expenditure.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Descriptive Text */}
      <p className="text-center text-gray-600 italic mb-6">
        Showing monthly <span className="font-semibold">revenue</span> (green) vs <span className="font-semibold">expenditure</span> (red). Hover bars to see exact month-by-month ₦ amounts.
      </p>

      {/* Chart Container */}
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
                    text: `Revenue vs Expenditure - ${year}`,
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
