"use client"
import Card from '@/components/ui/Card'
import IOCWaterfallCharts from '@/components/ui/charts/IOCSpiderChart'
import { useIOCStore } from '@/store/iocStore'
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { motion } from "framer-motion"
import dayjs from "dayjs"

export default function DashboardPage() {
  const iocs = useIOCStore(s => s.iocs)
  const filters = useIOCStore(s => s.filters)
  const setFilters = useIOCStore(s => s.setFilters)
  useAutoRefresh()

  //  Filtered IOCs (without sort)
  const filteredIOCs = iocs.filter(i => {
    let ok = true
    if (filters.type && i.type !== filters.type) ok = false
    if (filters.source && i.source !== filters.source) ok = false
    if (filters.from && dayjs(i.timestamp).isBefore(dayjs(filters.from))) ok = false
    if (filters.to && dayjs(i.timestamp).isAfter(dayjs(filters.to))) ok = false
    return ok
  })

  // Summary data
  const summaryData = [
    { type: "IPs", value: filteredIOCs.filter(i => i.type === "ip").length, fill: "#001effff" },
    { type: "Subnets", value: filteredIOCs.filter(i => i.type === "subnet").length, fill: "#8400ffff" },
    { type: "URLs", value: filteredIOCs.filter(i => i.type === "url").length, fill: "#ef4444" },
  ]

  const total = summaryData.reduce((acc, cur) => acc + cur.value, 0)
  const summaryWithPercent = summaryData.map(d => ({
    ...d,
    percent: total > 0 ? `${((d.value / total) * 100).toFixed(1)}%` : "0%",
  }))

  // Unique sources for dropdown
  const uniqueSources = Array.from(new Set(iocs.map(i => i.source)))

  return (
    <div className="p-6 grid gap-6">
      {/*  Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Type filter */}
          <select
            value={filters.type || ""}
            onChange={(e) => setFilters({ type: e.target.value || undefined })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
          >
            <option value="">All Types</option>
            <option value="ip">IPs</option>
            <option value="subnet">Subnets</option>
            <option value="url">URLs</option>
          </select>

          {/* Source filter */}
          <select
            value={filters.source || ""}
            onChange={(e) => setFilters({ source: e.target.value || undefined })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
          >
            <option value="">All Sources</option>
            {uniqueSources.map((src, idx) => (
              <option key={idx} value={src}>
                {src}
              </option>
            ))}
          </select>

          {/* Date range */}
          <input
            type="date"
            value={filters.from || ""}
            onChange={(e) => setFilters({ from: e.target.value })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
          />
          <input
            type="date"
            value={filters.to || ""}
            onChange={(e) => setFilters({ to: e.target.value })}
            className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700"
          />
        </div>
      </Card>

      {/* Spider Chart */}
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Card>
          <h2 className="font-semibold mb-2">IOC Distribution</h2>
          <IOCWaterfallCharts data={filteredIOCs} />
        </Card>
      </motion.div>
      {/* Threat Feed */}
      
    </div>
  )
}

