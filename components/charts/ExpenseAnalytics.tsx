"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";
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
  {
    id: "3",
    total_amount: "200000",
    utilities: "1800",
    services: "2500",
    purchase_costs: "1200",
    labour: "800",
    rent: "9500",
    updated_at: "2025-04-02T08:15:00",
  },
  {
    id: "4",
    total_amount: "150000",
    utilities: "2000",
    services: "3000",
    purchase_costs: "1000",
    labour: "900",
    rent: "10000",
    updated_at: "2025-04-03T14:22:10",
  },
  {
    id: "5",
    total_amount: "80000",
    utilities: "1200",
    services: "2200",
    purchase_costs: "800",
    labour: "600",
    rent: "8000",
    updated_at: "2025-04-04T09:45:55",
  },
  {
    id: "6",
    total_amount: "180000",
    utilities: "2500",
    services: "3400",
    purchase_costs: "1500",
    labour: "1200",
    rent: "11000",
    updated_at: "2025-04-05T20:05:25",
  },
  {
    id: "7",
    total_amount: "120000",
    utilities: "1600",
    services: "1800",
    purchase_costs: "900",
    labour: "700",
    rent: "9500",
    updated_at: "2025-04-06T12:30:40",
  },
  {
    id: "8",
    total_amount: "90000",
    utilities: "1300",
    services: "2100",
    purchase_costs: "750",
    labour: "650",
    rent: "9000",
    updated_at: "2025-04-07T16:10:15",
  },
  {
    id: "9",
    total_amount: "110000",
    utilities: "1700",
    services: "2300",
    purchase_costs: "950",
    labour: "850",
    rent: "10500",
    updated_at: "2025-04-08T07:55:05",
  },
  {
    id: "10",
    total_amount: "95000",
    utilities: "1450",
    services: "2600",
    purchase_costs: "1100",
    labour: "950",
    rent: "9800",
    updated_at: "2025-04-09T18:45:20",
  },
  {
    id: "11",
    total_amount: "210000",
    utilities: "1900",
    services: "3100",
    purchase_costs: "1400",
    labour: "1300",
    rent: "12000",
    updated_at: "2025-04-10T11:12:33",
  },
  {
    id: "12",
    total_amount: "100000",
    utilities: "1750",
    services: "2550",
    purchase_costs: "1000",
    labour: "900",
    rent: "8500",
    updated_at: "2025-04-11T13:50:00",
  },
  {
    id: "13",
    total_amount: "175000",
    utilities: "2250",
    services: "3300",
    purchase_costs: "1600",
    labour: "1500",
    rent: "11500",
    updated_at: "2025-04-12T17:25:45",
  },
  {
    id: "14",
    total_amount: "130000",
    utilities: "1850",
    services: "2750",
    purchase_costs: "1300",
    labour: "1100",
    rent: "9800",
    updated_at: "2025-04-13T10:05:30",
  },
  {
    id: "15",
    total_amount: "85000",
    utilities: "1600",
    services: "2400",
    purchase_costs: "900",
    labour: "800",
    rent: "8200",
    updated_at: "2025-04-14T19:40:10",
  },
  {
    id: "16",
    total_amount: "160000",
    utilities: "2050",
    services: "2950",
    purchase_costs: "1450",
    labour: "1250",
    rent: "10700",
    updated_at: "2025-04-15T15:15:00",
  },
  {
    id: "17",
    total_amount: "140000",
    utilities: "1950",
    services: "2850",
    purchase_costs: "1350",
    labour: "1150",
    rent: "10200",
    updated_at: "2025-04-16T09:00:00",
  },
  {
    id: "18",
    total_amount: "90000",
    utilities: "1800",
    services: "2600",
    purchase_costs: "1250",
    labour: "1000",
    rent: "9000",
    updated_at: "2025-04-17T14:00:00",
  },
  {
    id: "19",
    total_amount: "200000",
    utilities: "2100",
    services: "3050",
    purchase_costs: "1500",
    labour: "1400",
    rent: "11000",
    updated_at: "2025-04-18T11:30:00",
  },
  {
    id: "20",
    total_amount: "90000",
    utilities: "1750",
    services: "2350",
    purchase_costs: "950",
    labour: "850",
    rent: "8500",
    updated_at: "2025-04-18T16:45:25",
  },
];


// Colors and icons
const COLORS = ["#34D399", "#60A5FA", "#FBBF24", "#F87171", "#A78BFA"];
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

  // derive range of dates
  const dateRange = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!startDate || !endDate || end < start) return [];
    return getDatesInRange(start, end);
  }, [startDate, endDate]);

  // compute chart data + totals per day
  const chartsByDate = useMemo(() => {
    return dateRange.map((date) => {
      const iso = date.toISOString().split("T")[0];
      // sum categories
      const sums = KEYS.reduce<Record<string, number>>((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {} as Record<string, number>);
      apiData.forEach((rec) => {
        if (rec.updated_at.startsWith(iso)) {
          KEYS.forEach((key) => {
            sums[key] += Number(rec[key as keyof typeof rec] || 0);
          });
        }
      });
      const total = KEYS.reduce((sum, key) => sum + sums[key], 0);
      const data = KEYS.map((key, idx) => ({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: sums[key],
        icon: ICONS[idx],
      }));
      return { date: iso, data, total };
    });
  }, [dateRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        <FaChartPie className="text-2xl text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">
          Daily Expense Breakdown
        </h2>
      </div>

      {/* Instructions */}
      <p className="text-center text-gray-600 mb-4">
        Select your desired date range. By default, the past 7 days appear. Each card shows a pie chart representing total daily expenses in the center, and segment values appear on slices that are large enough to fit. Hover or tap a slice for details; days without any records show a "No record found" notice.
      </p>

      {/* Date pickers */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        {/** Start Date **/}
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

        {/** End Date **/}
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

      {/* Charts */}
      {chartsByDate.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full justify-items-center">
          {chartsByDate.map(({ date, data, total }, i) => {
            const hasData = total > 0;
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h3 className="text-gray-700 font-medium mb-2">
                  {new Date(date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>

                {hasData ? (
                  <PieChart width={250} height={250}>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      labelLine={false}
                      // show slice values only if slice >10%
                      label={({ x, y, value, percent }) =>
                        percent > 0.1 ? (
                          <text
                            x={x}
                            y={y}
                            fill="#000"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-xs"
                          >
                            {value.toLocaleString()}
                          </text>
                        ) : null
                      }
                      isAnimationActive
                      animationDuration={600}
                    >
                      {/* Center total label */}
                      <Label
                        value={total.toLocaleString()}
                        position="center"
                        className="text-lg font-semibold text-gray-800"
                      />

                      {/* Colored slices */}
                      {data.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => val.toLocaleString()}
                      itemStyle={{ fontSize: "12px" }}
                    />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-48 w-48 border border-gray-200 rounded-lg">
                    <span className="text-gray-500 italic">
                      No record found
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No valid date range selected.</p>
      )}
    </motion.div>
  );
};

export default ExpensePieChart;
