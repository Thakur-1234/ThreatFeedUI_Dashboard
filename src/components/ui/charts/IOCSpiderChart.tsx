"use client"
import { IOC } from "@/types/ioc"
import { useMemo, useState } from "react"
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Cell,
  Line,
  LineChart,
  PieChart,
  Pie,
  Legend,
} from "recharts"
import dayjs from "dayjs"
import { useAutoRefresh } from "@/hooks/useAutoRefresh"
import { RefreshCw, Settings, Sun, Moon } from "lucide-react"
import clsx from "clsx"

//  Reusable Legend Component
const ChartLegend = ({ dark }: { dark: boolean }) => (
  <div className="absolute top-4 right-4 flex gap-4 text-sm">
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
      <span className={dark ? "text-gray-300" : "text-gray-700"}>IP</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
      <span className={dark ? "text-gray-300" : "text-gray-700"}>Subnet</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="w-3 h-3 rounded-sm bg-red-500"></span>
      <span className={dark ? "text-gray-300" : "text-gray-700"}>URL</span>
    </div>
  </div>
)

export default function IOCDashboard({ data }: { data: IOC[] }) {
  const [interval, setInterval] = useState(300000) // default 5 min
  const { refresh } = useAutoRefresh(interval)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(true) // 🔹 theme toggle
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const [sort, setSort] = useState("latest")
  const [search, setSearch] = useState("")

  //  Refresh handler
  const handleRefresh = () => {
    refresh()
    setLastRefresh(new Date())
  }

  // Group by day
  const trendData = useMemo(() => {
    const byDay: Record<string, { ip: number; subnet: number; url: number }> = {}
    data.forEach((d) => {
      const day = dayjs(d.timestamp).format("DD MMM")
      if (!byDay[day]) byDay[day] = { ip: 0, subnet: 0, url: 0 }
      byDay[day][d.type as "ip" | "subnet" | "url"]++
    })
    return Object.entries(byDay)
      .sort(([a], [b]) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
      .map(([day, vals]) => ({ day, ...vals }))
  }, [data])

  //  Waterfall Data
  const waterfallData = useMemo(() => {
    const arr: any[] = []
    for (let i = 1; i < trendData.length; i++) {
      arr.push({
        day: trendData[i].day,
        ipChange: trendData[i].ip - trendData[i - 1].ip,
        subnetChange: trendData[i].subnet - trendData[i - 1].subnet,
        urlChange: trendData[i].url - trendData[i - 1].url,
      })
    }
    return arr
  }, [trendData])

  // Pie Data
  const pieData = useMemo(() => {
    const totals = { ip: 0, subnet: 0, url: 0 }
    trendData.forEach((d) => {
      totals.ip += d.ip
      totals.subnet += d.subnet
      totals.url += d.url
    })
    return [
      { name: "IP", value: totals.ip, fill: "#06b6d4" },
      { name: "Subnet", value: totals.subnet, fill: "#a855f7" },
      { name: "URL", value: totals.url, fill: "#ef4444" },
    ]
  }, [trendData])

  // Table Sorting
  const sortedData = [...data].sort((a, b) => {
    if (sort === "alpha") return a.value.localeCompare(b.value)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  // Table Filter
  const filteredData = sortedData.filter((item) =>
    item.value.toLowerCase().includes(search.toLowerCase())
  )

  //  Theme classes
  const bgClass = dark
    ? "bg-gradient-to-br from-black via-gray-900 to-black"
    : "bg-gradient-to-br from-white via-gray-100 to-white"
  const textClass = dark ? "text-gray-200" : "text-gray-800"

  return (
    <div className="flex flex-col gap-8 w-full relative">
      {/* ---- Controls ---- */}
      <div
        className={`flex justify-between items-center px-2 transition-all duration-300 ${
          open ? "mb-32 pb-6" : "mb-4"
        }`}
      >
        {/* Settings */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-200"
          >
            <Settings size={18} />
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-black ring-opacity-5 z-50">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={interval !== 0}
                    onChange={(e) => setInterval(e.target.checked ? 300000 : 0)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300 text-sm">Enable Auto Refresh</span>
                </div>
                {interval !== 0 && (
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">Interval</label>
                    <select
                      value={interval}
                      onChange={(e) => setInterval(Number(e.target.value))}
                      className="w-full bg-gray-800 text-gray-200 p-2 rounded-md"
                    >
                      <option value={10000}>Every 10s</option>
                      <option value={30000}>Every 30s</option>
                      <option value={60000}>Every 1min</option>
                      <option value={300000}>Every 5min</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Refresh + Theme toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          {lastRefresh && (
            <span className="text-xs text-gray-400">
              Last: {dayjs(lastRefresh).format("HH:mm:ss")}
            </span>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />} {dark ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* ---- Row 1: Pie + Column ---- */}
      <div className="flex gap-8 w-full">
        <div className={`relative h-[400px] w-1/2 ${bgClass} rounded-2xl p-8 shadow-lg`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-4`}>IOC Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={120}
                innerRadius={50}
                padAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: dark ? "#1f2937" : "#f3f4f6",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: dark ? "#fff" : "#000",
                }}
              />
              <Legend verticalAlign="bottom" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`relative h-[400px] w-1/2 ${bgClass} rounded-2xl p-8 shadow-lg`}>
          <h3 className={`text-lg font-semibold ${textClass} mb-4`}>
            IOC Daily Totals (Column)
          </h3>
          <ChartLegend dark={dark} />
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" tick={{ fill: dark ? "#9ca3af" : "#374151", fontSize: 12 }} />
              <YAxis tick={{ fill: dark ? "#9ca3af" : "#374151" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: dark ? "#1f2937" : "#f3f4f6",
                  border: "1px solid #333",
                  color: dark ? "#fff" : "#000",
                }}
              />
              <Bar dataKey="ip" stackId="x" fill="#06b6d4" />
              <Bar dataKey="subnet" stackId="x" fill="#a855f7" />
              <Bar dataKey="url" stackId="x" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- Row 2: Waterfall ---- */}
      <div className={`relative h-[500px] w-full ${bgClass} rounded-2xl p-8 shadow-lg`}>
        <h3 className={`text-lg font-semibold ${textClass} mb-4`}>
          IOC Daily Change (Waterfall)
        </h3>
        <ChartLegend dark={dark} />
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={waterfallData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" tick={{ fill: dark ? "#9ca3af" : "#374151", fontSize: 12 }} />
            <YAxis tick={{ fill: dark ? "#9ca3af" : "#374151" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? "#1f2937" : "#f3f4f6",
                border: "1px solid #333",
                borderRadius: "8px",
                color: dark ? "#fff" : "#000",
              }}
            />
            <Bar dataKey="ipChange" stackId="a">
              {waterfallData.map((entry, idx) => (
                <Cell key={idx} fill={entry.ipChange >= 0 ? "#06b6d4" : "#0e7490"} />
              ))}
            </Bar>
            <Bar dataKey="subnetChange" stackId="b">
              {waterfallData.map((entry, idx) => (
                <Cell key={idx} fill={entry.subnetChange >= 0 ? "#a855f7" : "#6b21a8"} />
              ))}
            </Bar>
            <Bar dataKey="urlChange" stackId="c">
              {waterfallData.map((entry, idx) => (
                <Cell key={idx} fill={entry.urlChange >= 0 ? "#ef4444" : "#7f1d1d"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---- Row 3: Running Total ---- */}
      <div className={`relative h-[500px] w-full ${bgClass} rounded-2xl p-8 shadow-lg`}>
        <h3 className={`text-lg font-semibold ${textClass} mb-4`}>IOC Running Total</h3>
        <ChartLegend dark={dark} />
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" tick={{ fill: dark ? "#9ca3af" : "#374151", fontSize: 12 }} />
            <YAxis tick={{ fill: dark ? "#9ca3af" : "#374151" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? "#1f2937" : "#f3f4f6",
                border: "1px solid #333",
                borderRadius: "8px",
                color: dark ? "#fff" : "#000",
              }}
            />
            <Line type="monotone" dataKey="ip" stroke="#06b6d4" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="subnet" stroke="#a855f7" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="url" stroke="#ef4444" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
{/* ---- Row 4: Threat Table ---- */}
<div
  className={clsx(
    "mt-4 rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.25)] border overflow-hidden",
    dark ? "border-cyan-500/20 bg-gray-950" : "border-gray-300 bg-white"
  )}
>
  {/* Search + Sort */}
  <div
    className={clsx(
      "flex items-center justify-between gap-3 p-3 border-b",
      dark ? "bg-gray-900/70 border-cyan-500/20" : "bg-gray-100 border-gray-300"
    )}
  >
    <input
      type="text"
      placeholder="🔍 Search by Value..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={clsx(
        "px-3 py-2 rounded-md text-sm outline-none w-1/2",
        dark
          ? "bg-gray-800 text-gray-200 border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          : "bg-white text-gray-800 border border-gray-300 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
      )}
    />
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className={clsx(
        "px-3 py-2 rounded-md text-sm outline-none",
        dark
          ? "bg-gray-800 text-gray-200 border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          : "bg-white text-gray-800 border border-gray-300 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
      )}
    >
      <option value="latest">⏱️ Latest First</option>
      <option value="alpha">🔤 Alphabetical</option>
    </select>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left border-collapse">
      <thead className={dark ? "bg-gray-900/80" : "bg-gray-200"}>
        <tr>
          <th className="px-4 py-3 text-cyan-500 font-semibold">Value</th>
          <th className="px-4 py-3 text-cyan-500 font-semibold">Type</th>
          <th className="px-4 py-3 text-cyan-500 font-semibold">Source</th>
          <th className="px-4 py-3 text-cyan-500 font-semibold">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((i, idx) => (
            <tr
              key={idx}
              className={clsx(
                "border-b transition-colors",
                dark
                  ? "border-gray-700/40 hover:bg-cyan-500/10 bg-gray-950"
                  : "border-gray-300 hover:bg-cyan-100/70 bg-white"
              )}
            >
              <td
                className={clsx(
                  "px-4 py-2 font-mono",
                  dark ? "text-gray-200" : "text-gray-800"
                )}
              >
                {i.value}
              </td>
              <td className="px-4 py-2">
                <span
                  className={clsx(
                    "px-2 py-1 rounded-md text-xs font-semibold",
                    i.type === "ip" &&
                      (dark
                        ? "bg-cyan-500/20 text-cyan-300"
                        : "bg-cyan-200 text-cyan-800"),
                    i.type === "subnet" &&
                      (dark
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-purple-200 text-purple-800"),
                    i.type === "url" &&
                      (dark
                        ? "bg-red-500/20 text-red-300"
                        : "bg-red-200 text-red-800")
                  )}
                >
                  {i.type.toUpperCase()}
                </span>
              </td>
              <td
                className={clsx(
                  "px-4 py-2",
                  dark ? "text-gray-300" : "text-gray-700"
                )}
              >
                {i.source}
              </td>
              <td
                className={clsx(
                  "px-4 py-2",
                  dark ? "text-gray-400" : "text-gray-600"
                )}
              >
                {dayjs(i.timestamp).format("YYYY-MM-DD HH:mm")}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={4}
              className={clsx(
                "px-4 py-3 text-center italic",
                dark ? "text-gray-400" : "text-gray-500 bg-white"
              )}
            >
              No results found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

    </div>
  )
}
