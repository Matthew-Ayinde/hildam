"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { motion } from "framer-motion";
import {
  FaChartPie,
  FaTools,
  FaTv,
  FaShoppingCart,
  FaHardHat,
  FaBuilding,
} from "react-icons/fa";

// Mocked API data
const apiData = [
  {
    id: "1",
    total_amount: "1000000",
    utilities: "2000",
    services: "3000",
    purchase_costs: "3000",
    labour: "1000",
    rent: "10000",
    updated_at: "2025-04-01T17:47:33",
  },
  {
    id: "2",
    total_amount: "50000",
    utilities: "1500",
    services: "2000",
    purchase_costs: "600",
    labour: "1000",
    rent: "9000",
    updated_at: "2025-04-17T11:00:36",
  },
  // …more records
];

// Colors and icons
const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA"];
const ICONS = [
  <FaTools />,
  <FaTv />,
  <FaShoppingCart />,
  <FaHardHat />,
  <FaBuilding />,
];
const KEYS: Array<keyof typeof apiData[0]> = [
  "utilities",
  "services",
  "purchase_costs",
  "labour",
  "rent",
];

const ExpensePieChart: React.FC = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // filter & aggregate
  const chartData = useMemo(() => {
    // parse inputs
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // filter by date range
    const filtered = apiData.filter((rec) => {
      const d = new Date(rec.updated_at);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });

    // initialize sums
    const sums = KEYS.reduce<Record<string, number>>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    // accumulate
    filtered.forEach((rec) => {
      KEYS.forEach((key) => {
        sums[key] += Number(rec[key]);
      });
    });

    // map into recharts format
    return KEYS.map((key, idx) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: sums[key],
      icon: ICONS[idx],
    }));
  }, [startDate, endDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white shadow-lg rounded-2xl p-6 max-w-lg mx-auto"
    >
      {/* Title */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        <FaChartPie className="text-2xl text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">
          Expense Breakdown
        </h2>
      </div>

      {/* Date pickers */}
      <div className="flex justify-center space-x-4 mb-6">
        <div className="flex flex-col">
          <label htmlFor="start" className="text-sm font-medium text-gray-600">
            Start Date
          </label>
          <input
            id="start"
            type="date"
            className="border rounded p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end" className="text-sm font-medium text-gray-600">
            End Date
          </label>
          <input
            id="end"
            type="date"
            className="border rounded p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Pie Chart */}
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          isAnimationActive={true}
          animationDuration={800}
        >
          {chartData.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={COLORS[idx % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => value.toLocaleString()}
          itemStyle={{ fontSize: "14px" }}
        />
      </PieChart>

      {/* Legend */}
      <ul className="flex flex-wrap justify-center mt-6 gap-4">
        {chartData.map((entry, idx) => (
          <li
            key={entry.name}
            className="flex items-center space-x-2 text-gray-700"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="flex items-center space-x-1 text-sm font-medium">
              {entry.icon}
              <span>{entry.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ExpensePieChart;
