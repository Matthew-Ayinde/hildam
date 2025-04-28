"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Label, Legend } from "recharts";
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
    order_id: "BQH372",
    total_amount: "1000000",
    utilities: "2000",
    services: "3000",
    purchase_costs: "3000",
    labour: "1000",
    rent: "10000",
    updated_at: "2025-04-28T00:00:00",
  },
  {
    id: "2",
    order_id: "KLM491",
    total_amount: "50000",
    utilities: "1500",
    services: "2000",
    purchase_costs: "600",
    labour: "1000",
    rent: "9000",
    updated_at: "2025-04-27T00:00:00",
  },
  {
    id: "3",
    order_id: "TXP284",
    total_amount: "200000",
    utilities: "1800",
    services: "2500",
    purchase_costs: "1200",
    labour: "800",
    rent: "9500",
    updated_at: "2025-04-26T00:00:00",
  },
  {
    id: "4",
    order_id: "NGD572",
    total_amount: "150000",
    utilities: "2000",
    services: "3000",
    purchase_costs: "1000",
    labour: "900",
    rent: "10000",
    updated_at: "2025-04-25T00:00:00",
  },
  {
    id: "5",
    order_id: "VQY801",
    total_amount: "80000",
    utilities: "1200",
    services: "2200",
    purchase_costs: "800",
    labour: "600",
    rent: "8000",
    updated_at: "2025-04-24T00:00:00",
  },
  {
    id: "6",
    order_id: "LZW194",
    total_amount: "180000",
    utilities: "2500",
    services: "3400",
    purchase_costs: "1500",
    labour: "1200",
    rent: "11000",
    updated_at: "2025-04-23T00:00:00",
  },
  {
    id: "7",
    order_id: "WJU635",
    total_amount: "120000",
    utilities: "1600",
    services: "1800",
    purchase_costs: "900",
    labour: "700",
    rent: "9500",
    updated_at: "2025-04-22T00:00:00",
  },
  {
    id: "8",
    order_id: "ZFD758",
    total_amount: "90000",
    utilities: "1300",
    services: "2100",
    purchase_costs: "750",
    labour: "650",
    rent: "9000",
    updated_at: "2025-04-21T00:00:00",
  },
  {
    id: "9",
    order_id: "CRN832",
    total_amount: "110000",
    utilities: "1700",
    services: "2300",
    purchase_costs: "950",
    labour: "850",
    rent: "10500",
    updated_at: "2025-04-20T00:00:00",
  },
  {
    id: "10",
    order_id: "MVB209",
    total_amount: "95000",
    utilities: "1450",
    services: "2600",
    purchase_costs: "1100",
    labour: "950",
    rent: "9800",
    updated_at: "2025-04-19T00:00:00",
  },
  {
    id: "11",
    order_id: "PKS472",
    total_amount: "210000",
    utilities: "1900",
    services: "3100",
    purchase_costs: "1400",
    labour: "1300",
    rent: "12000",
    updated_at: "2025-04-18T00:00:00",
  },
  {
    id: "12",
    order_id: "YQN186",
    total_amount: "100000",
    utilities: "1750",
    services: "2550",
    purchase_costs: "1000",
    labour: "900",
    rent: "8500",
    updated_at: "2025-04-17T00:00:00",
  },
  {
    id: "13",
    order_id: "SGX397",
    total_amount: "175000",
    utilities: "2250",
    services: "3300",
    purchase_costs: "1600",
    labour: "1500",
    rent: "11500",
    updated_at: "2025-04-16T00:00:00",
  },
  {
    id: "14",
    order_id: "HBR652",
    total_amount: "130000",
    utilities: "1850",
    services: "2750",
    purchase_costs: "1300",
    labour: "1100",
    rent: "9800",
    updated_at: "2025-04-15T00:00:00",
  },
  {
    id: "15",
    order_id: "DKM714",
    total_amount: "85000",
    utilities: "1600",
    services: "2400",
    purchase_costs: "900",
    labour: "800",
    rent: "8200",
    updated_at: "2025-04-14T00:00:00",
  },
  {
    id: "16",
    order_id: "AVP580",
    total_amount: "160000",
    utilities: "2050",
    services: "2950",
    purchase_costs: "1450",
    labour: "1250",
    rent: "10700",
    updated_at: "2025-04-13T00:00:00",
  },
  {
    id: "17",
    order_id: "RLF307",
    total_amount: "140000",
    utilities: "1950",
    services: "2850",
    purchase_costs: "1350",
    labour: "1150",
    rent: "10200",
    updated_at: "2025-04-12T00:00:00",
  },
  {
    id: "18",
    order_id: "XDW682",
    total_amount: "90000",
    utilities: "1800",
    services: "2600",
    purchase_costs: "1250",
    labour: "1000",
    rent: "9000",
    updated_at: "2025-04-11T00:00:00",
  },
  {
    id: "19",
    order_id: "UBC598",
    total_amount: "200000",
    utilities: "2100",
    services: "3050",
    purchase_costs: "1500",
    labour: "1400",
    rent: "11000",
    updated_at: "2025-04-10T00:00:00",
  },
  {
    id: "20",
    order_id: "JPV431",
    total_amount: "90000",
    utilities: "1750",
    services: "2350",
    purchase_costs: "950",
    labour: "850",
    rent: "8500",
    updated_at: "2025-04-09T00:00:00",
  },
];



// Updated color palette (softer, professional tones)
const COLORS = ["#4ADE80", "#60A5FA", "#FACC15", "#F87171", "#A78BFA"];
const ICONS = [
  <FaTools key="tools" />,
  <FaTv key="tv" />,
  <FaShoppingCart key="cart" />,
  <FaHardHat key="hat" />,
  <FaBuilding key="building" />,
];
const KEYS = ["utilities", "services", "purchase_costs", "labour", "rent"];

/**
 * Generate array of dates between two Date objects (inclusive)
 */
function getDatesInRange(start: Date, end: Date) {
  const dates: Date[] = [];
  const curr = new Date(start);
  while (curr <= end) {
    dates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

// Defaults for last 7 days
const today = new Date();
const defaultEndStr = today.toISOString().split("T")[0];
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
const defaultStartStr = sevenDaysAgo.toISOString().split("T")[0];

const ExpensePieChart: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(defaultStartStr);
  const [endDate, setEndDate] = useState<string>(defaultEndStr);

  // Derive range of dates
  const dateRange = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!startDate || !endDate || end < start) return [];
    return getDatesInRange(start, end);
  }, [startDate, endDate]);

  // Compute chart data + totals per day, including order_id
  const chartsByDate = useMemo(() => {
    return dateRange.map((date) => {
      const iso = date.toISOString().split("T")[0];
      // Sum categories and collect order_ids
      const sums = KEYS.reduce<Record<string, number>>((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {} as Record<string, number>);
      const orderIds: string[] = [];
      apiData.forEach((rec) => {
        if (rec.updated_at.startsWith(iso)) {
          KEYS.forEach((key) => {
            sums[key] += Number(rec[key as keyof typeof rec] || 0);
          });
          orderIds.push(rec.order_id);
        }
      });
      const total = KEYS.reduce((sum, key) => sum + sums[key], 0);
      const data = KEYS.map((key, idx) => ({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: sums[key],
        icon: ICONS[idx],
        order_id: orderIds.join(", "), // Join order IDs for tooltip
      }));
      return { date: iso, data, total, orderIds };
    });
  }, [dateRange]);

  // Custom tooltip to include order_id
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: {data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Order ID: {data.order_id}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-2xl p-8 max-w-7xl mx-auto"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-center space-x-3 mb-6">
        <FaChartPie className="text-3xl text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Daily Expense Breakdown
        </h2>
      </div>

      {/* Instructions */}
      <p className="text-center text-gray-600 mb-6 max-w-2xl text-sm leading-relaxed">
        Select a date range to view daily expense breakdowns. The past 7 days are shown by default. Each card displays a pie chart with total expenses in the center. Hover or tap a slice for details, including order IDs. Days without records display a notice.
      </p>

      {/* Date pickers */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
        <div className="flex flex-col">
          <label htmlFor="start" className="text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="start"
            type="date"
            className="border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end" className="text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="end"
            type="date"
            className="border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Charts */}
      {chartsByDate.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center">
          {chartsByDate.map(({ date, data, total }, i) => {
            const hasData = total > 0;
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {new Date(date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>

                {hasData ? (
                  <PieChart width={280} height={300}>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      labelLine={false}
                      label={({ x, y, value, percent }) =>
                        percent > 0.1 ? (
                          <text
                            x={x}
                            y={y}
                            fill="#1F2937"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-xs font-medium"
                          >
                            {value.toLocaleString()}
                          </text>
                        ) : null
                      }
                      isAnimationActive
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      <Label
                        value={total.toLocaleString()}
                        position="center"
                        className="text-xl font-bold text-gray-900"
                      />
                      {data.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                          stroke={COLORS[idx % COLORS.length]}
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-48 w-48 border border-gray-200 rounded-lg bg-gray-50">
                    <span className="text-gray-500 text-sm italic">
                      No record found
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No valid date range selected.</p>
      )}
    </motion.div>
  );
};

export default ExpensePieChart;