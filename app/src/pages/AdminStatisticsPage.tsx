import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MapPin } from "lucide-react";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const incidentCategories = [
  "Assault",
  "Armed Robbery",
  "Homicide",
  "Kidnapping",
  "Domestic Violence",
  "Theft",
  "Burglary",
  "Vandalism",
  "Arson",
  "Shoplifting",
  "Motor Vehicle Theft",
  "Harassment",
  "Suspicious Activity",
  "Drug-Related Activity",
  "Public Intoxication",
  "Disorderly Conduct",
  "Weapon Possession",
  "Cybercrime",
  "Traffic Accident",
  "Hit and Run",
  "Reckless Driving",
  "DUI",
  "Earthquake",
  "Flood",
  "Wildfire",
  "Storm/Hurricane",
  "Landslide",
  "Extreme Heat",
  "Missing Person",
  "Medical Emergency",
  "Other",
];

export function AdminStatisticsPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");
        const [reportsRes, regionsRes] = await Promise.all([
          fetch(`${API_URL}/report`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_URL}/region`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (!reportsRes.ok || !regionsRes.ok) {
          throw new Error("Failed to fetch reports or regions");
        }

        const [reportsData, regionsData] = await Promise.all([
          reportsRes.json(),
          regionsRes.json(),
        ]);
        setReports(Array.isArray(reportsData) ? reportsData : []);
        setRegions(Array.isArray(regionsData) ? regionsData : []);
      } catch (err: any) {
        setError(err.message || "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const filteredReports = useMemo(() => {
    return reports.filter((report: any) => {
      const status = String(report.status || "").toLowerCase();
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      if (regionFilter !== "all" && String(report.regionid) !== regionFilter) {
        return false;
      }

      const dateVal = report.crimedate || report.reportdate;
      if (!dateVal) {
        return !fromDate && !toDate;
      }

      const d = new Date(dateVal);
      if (Number.isNaN(d.getTime())) {
        return false;
      }

      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        if (d < from) return false;
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }

      return true;
    });
  }, [reports, statusFilter, regionFilter, fromDate, toDate]);

  const trendData = useMemo(() => {
    const monthMap = new Map<string, number>();

    filteredReports.forEach((report: any) => {
      const dateVal = report.crimedate || report.reportdate;
      if (!dateVal) return;

      const d = new Date(dateVal);
      if (Number.isNaN(d.getTime())) return;

      const month = d.toLocaleString("en-US", { month: "short" });
      monthMap.set(month, (monthMap.get(month) || 0) + 1);
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthOrder
      .filter((m) => monthMap.has(m))
      .map((m) => ({ month: m, incidents: monthMap.get(m) || 0 }));
  }, [filteredReports]);

  const incidentTypeData = useMemo(() => {
    const typeMap = new Map<string, number>();

    filteredReports.forEach((report: any) => {
      const hadasId = Number(report.hadasid);
      const type = incidentCategories[hadasId - 1] || "Unknown";
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });

    return Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [filteredReports]);

  const pendingCount = filteredReports.filter((r: any) => String(r.status || "").toLowerCase() === "pending").length;
  const inProgressCount = filteredReports.filter((r: any) => String(r.status || "").toLowerCase() === "in progress").length;
  const resolvedCount = filteredReports.filter((r: any) => String(r.status || "").toLowerCase() === "resolved").length;

  const statsCards = [
    { title: "Account Status", value: "Verified", desc: "Authorized Officer" },
    { title: "Your Contributions", value: `${inProgressCount} Active`, desc: "Incidents being handled" },
    {
      title: "Regional Safety",
      value: filteredReports.length > 0 ? `${Math.round((resolvedCount / filteredReports.length) * 100)}%` : "0%",
      desc: "Resolved ratio index",
    },
  ];

  const exportCsv = () => {
    const headers = ["reportid", "crimedate", "reportdate", "status", "hadasid", "regionid", "userid", "description"];
    const rows = filteredReports.map((r: any) => [
      String(r.reportid ?? r.id ?? ""),
      String(r.crimedate ?? ""),
      String(r.reportdate ?? ""),
      String(r.status ?? ""),
      String(r.hadasid ?? ""),
      String(r.regionid ?? ""),
      String(r.userid ?? ""),
      `"${String(r.description ?? "").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((row: string[]) => row.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "admin-statistics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <Sidebar />
      <div className="ml-64">
        <div className="bg-[#1a2744] border-b border-white/10 px-12 py-8">
          <h1 className="text-3xl font-bold text-white">Statistics</h1>
          <p className="text-[#94a3b8] mt-2">Regional trends and incident analytics</p>
        </div>

        <div className="px-12 py-8 space-y-8">
          <div className="bg-[#1a2744] border border-white/10 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-6 gap-3 items-end">
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1 uppercase">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1 uppercase">Region</label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Regions</option>
                {regions.map((region: any) => (
                  <option key={String(region.regionid)} value={String(region.regionid)}>
                    {region.regionname || `Region ${region.regionid}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1 uppercase">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#94a3b8] mb-1 uppercase">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <button
              onClick={() => {
                setStatusFilter("all");
                setRegionFilter("all");
                setFromDate("");
                setToDate("");
              }}
              className="bg-[#334155] text-white rounded-lg px-3 py-2 text-sm"
            >
              Reset Filters
            </button>
            <button
              onClick={exportCsv}
              className="bg-[#dc143c] hover:bg-[#c41236] text-white rounded-lg px-3 py-2 text-sm font-semibold"
            >
              Export CSV
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-[#94a3b8]">Loading statistics...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a2744] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-5 h-5 text-[#dc143c]" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Regional Safety Trends</h3>
                  </div>
                  <div className="h-[280px] w-full">
                    {trendData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[#94a3b8] text-sm">No report data available yet.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#0f1729", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                            itemStyle={{ color: "#fff" }}
                          />
                          <Line type="monotone" dataKey="incidents" stroke="#dc143c" strokeWidth={4} dot={{ fill: "#dc143c", strokeWidth: 2, r: 4 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="bg-[#1a2744] p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-[#dc143c]" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Local Incident Breakdown</h3>
                  </div>
                  <div className="h-[280px] w-full">
                    {incidentTypeData.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[#94a3b8] text-sm">No incident type data available yet.</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incidentTypeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="type" stroke="#64748b" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={70} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            contentStyle={{ backgroundColor: "#0f1729", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                            itemStyle={{ color: "#fff" }}
                          />
                          <Bar dataKey="count" fill="#dc143c" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#1a2744] p-6 rounded-2xl border border-white/10 hover:border-[#dc143c]/40 transition-all cursor-default group"
                  >
                    <p className="text-[#94a3b8] text-xs uppercase tracking-[0.15em] font-bold">{card.title}</p>
                    <p className="text-3xl font-black text-white mt-3 group-hover:text-[#dc143c] transition-colors">{card.value}</p>
                    <p className="text-[#64748b] text-sm mt-2 font-medium">{card.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#1a2744] border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-[#94a3b8] uppercase">Pending</p>
                  <p className="text-xl font-bold text-white">{pendingCount}</p>
                </div>
                <div className="bg-[#1a2744] border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-[#94a3b8] uppercase">In Progress</p>
                  <p className="text-xl font-bold text-white">{inProgressCount}</p>
                </div>
                <div className="bg-[#1a2744] border border-white/10 rounded-lg p-3">
                  <p className="text-xs text-[#94a3b8] uppercase">Resolved</p>
                  <p className="text-xl font-bold text-white">{resolvedCount}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
