import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion"; 
import { useNavigate } from "react-router";
import { AlertCircle, MessageSquare, MapPin, TrendingUp, User as UserIcon } from "lucide-react";
import { FeedbackForm } from "../forms/FeedbackForm";
import { Sidebar } from "../layout/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

export function CitizenDashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth(); 
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [myReports, setMyReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");

  useEffect(() => {
    const fetchMyReports = async () => {
      if (!user?.userid) {
        setReportsLoading(false);
        return;
      }

      try {
        setReportsLoading(true);
        setReportsError("");
        const response = await fetch(`${API_URL}/report`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error("Failed to fetch your reports");
        }

        const data = await response.json();
        const reports = Array.isArray(data) ? data : [];
        setAllReports(reports);

        const ownReports = reports.filter((r: any) => Number(r.userid) === Number(user.userid));
        setMyReports(ownReports);
      } catch (err: any) {
        setReportsError(err.message || "Unable to load your report statuses");
      } finally {
        setReportsLoading(false);
      }
    };

    fetchMyReports();
  }, [token, user?.userid]);

  const statusCounts = {
    pending: myReports.filter((r) => String(r.status || "").toLowerCase() === "pending").length,
    inProgress: myReports.filter((r) => String(r.status || "").toLowerCase() === "in progress").length,
    resolved: myReports.filter((r) => String(r.status || "").toLowerCase() === "resolved").length,
    rejected: myReports.filter((r) => String(r.status || "").toLowerCase() === "rejected").length,
  };

  const getStatusBadgeClass = (status: string) => {
    const s = String(status || "").toLowerCase();
    if (s === "resolved") return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    if (s === "in progress") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    if (s === "rejected") return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    return "bg-sky-500/20 text-sky-300 border-sky-500/30";
  };

  const trendData = useMemo(() => {
    const monthMap = new Map<string, number>();

    allReports.forEach((report: any) => {
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
  }, [allReports]);

  const incidentTypeData = useMemo(() => {
    const typeMap = new Map<string, number>();

    allReports.forEach((report: any) => {
      const hadasId = Number(report.hadasid);
      const type = incidentCategories[hadasId - 1] || "Unknown";
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    });

    return Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [allReports]);

  const handleFeedbackSubmit = async () => {
    // Feedback form handles the submission and closing
    setShowFeedbackForm(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <Sidebar />
      <div className="ml-64">
      {/* Hero Section */}
      <div className="bg-[#1a2744] border-b border-white/10 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.username || "Citizen"}
            </h1>
            <p className="text-[#94a3b8] mt-2">
              Monitoring safety updates for Tripoli and surrounding regions.
            </p>
          </div>
          <div className="flex items-center self-start md:self-center gap-3 bg-[#0f1729] px-4 py-2 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <UserIcon className="w-4 h-4 text-[#dc143c]" />
            <span className="text-white text-sm font-medium">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-8">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/report')} // Redirect to your new CrimeReport component
            className="bg-[#dc143c] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 group transition-all"
          >
            <AlertCircle className="w-5 h-5 group-hover:animate-bounce" />
            Report New Incident
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFeedbackForm(true)}
            className="bg-[#1e293b] text-white py-4 rounded-xl font-bold border border-white/10 flex items-center justify-center gap-2 hover:bg-[#2d3748] transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Submit Community Feedback
          </motion.button>
        </div>

        {/* Feedback Modal Overlay */}
        {showFeedbackForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg"
            >
              <FeedbackForm
                onSubmit={handleFeedbackSubmit}
                onClose={() => setShowFeedbackForm(false)}
              />
            </motion.div>
          </div>
        )}

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
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
                    <XAxis dataKey="month" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
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

          {/* Type Chart */}
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
                    <XAxis dataKey="type" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}} 
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Account Status", value: "Verified", desc: "Trusted Reporter" },
            { title: "Your Contributions", value: "3 Active", desc: "Incident reports filed" },
            { title: "Regional Safety", value: "82%", desc: "Tripoli North Index" },
          ].map((card, i) => (
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

        {/* My Report Status */}
        <div className="bg-[#1a2744] p-6 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white tracking-tight">My Reports Status</h3>
            <p className="text-xs text-[#94a3b8]">Total: {myReports.length}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
            <div className="bg-[#0f1729] border border-white/10 rounded-lg p-3">
              <p className="text-xs text-[#94a3b8] uppercase">Pending</p>
              <p className="text-xl font-bold text-white">{statusCounts.pending}</p>
            </div>
            <div className="bg-[#0f1729] border border-white/10 rounded-lg p-3">
              <p className="text-xs text-[#94a3b8] uppercase">In Progress</p>
              <p className="text-xl font-bold text-white">{statusCounts.inProgress}</p>
            </div>
            <div className="bg-[#0f1729] border border-white/10 rounded-lg p-3">
              <p className="text-xs text-[#94a3b8] uppercase">Resolved</p>
              <p className="text-xl font-bold text-white">{statusCounts.resolved}</p>
            </div>
            <div className="bg-[#0f1729] border border-white/10 rounded-lg p-3">
              <p className="text-xs text-[#94a3b8] uppercase">Rejected</p>
              <p className="text-xl font-bold text-white">{statusCounts.rejected}</p>
            </div>
          </div>

          {reportsError && <p className="text-sm text-red-400">{reportsError}</p>}
          {reportsLoading ? (
            <p className="text-sm text-[#94a3b8]">Loading your reports...</p>
          ) : myReports.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">You have not submitted reports yet.</p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {myReports.map((report: any) => (
                <div key={String(report.reportid ?? report.id)} className="bg-[#0f1729] border border-white/10 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Report #{report.reportid ?? report.id}</p>
                      <p className="text-xs text-[#94a3b8] mt-1 line-clamp-2">{report.description || "No description"}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(report.status)}`}>
                      {report.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-[#0f1729] py-6 px-12 border-t border-white/10 mt-8">
        <div className="text-center text-[#64748b]">
          <p>للأمان.... كُن العين</p>
        </div>
      </footer>
      </div>
    </div>
  );
}