import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { Sidebar } from "../layout/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import type { IncidentReport } from "../../types/index";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";


export function AdminDashboard() {
  const { token } = useAuth();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [involvedInRows, setInvolvedInRows] = useState<any[]>([]);
  const [participantSubmitting, setParticipantSubmitting] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);
  const [participantForm, setParticipantForm] = useState({
    participantname: "",
    participanttype: "Person",
    pdateofbirth: "",
    gender: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReports();
    fetchParticipantsData();
  }, [token]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2500);
    return () => clearTimeout(timer);
  }, [success]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/report`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data);
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipantsData = async () => {
    try {
      const [participantsRes, involvedInRes] = await Promise.all([
        fetch(`${API_URL}/participant`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        }),
        fetch(`${API_URL}/involvedin`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        }),
      ]);

      if (!participantsRes.ok || !involvedInRes.ok) {
        throw new Error("Failed to load participants data");
      }

      const [participantsData, involvedData] = await Promise.all([
        participantsRes.json(),
        involvedInRes.json(),
      ]);

      setParticipants(Array.isArray(participantsData) ? participantsData : []);
      setInvolvedInRows(Array.isArray(involvedData) ? involvedData : []);
    } catch (err: any) {
      setError(err.message || "Failed to load participants");
    }
  };

  const normalizeStatusForBackend = (status: string) => {
    const val = status.toLowerCase();
    if (val === "resolved") return "Resolved";
    if (val === "in progress") return "In Progress";
    if (val === "rejected") return "Rejected";
    return "Pending";
  };

  const updateReportStatus = async (report: any, nextStatus: "Pending" | "In Progress" | "Resolved" | "Rejected") => {
    try {
      setError("");
      const reportId = Number(report.reportid ?? report.id);
      const response = await fetch(`${API_URL}/report/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          crimedate: report.crimedate,
          reportdate: report.reportdate,
          description: report.description,
          status: nextStatus,
          image_url: report.image_url || undefined,
          userid: Number(report.userid),
          regionid: Number(report.regionid),
          hadasid: Number(report.hadasid),
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update report status");
      }

      setReports((prev) =>
        prev.map((r: any) =>
          Number((r as any).reportid ?? (r as any).id) === reportId
            ? { ...r, ...data }
            : r
        )
      );

      setSelectedReport((prev: any) => {
        if (!prev) return prev;
        const prevId = Number(prev.reportid ?? prev.id);
        return prevId === reportId ? { ...prev, ...data } : prev;
      });
      setSuccess(`Report status updated to ${nextStatus}`);
    } catch (err: any) {
      setError(err.message || "Failed to update report status");
    }
  };

  const handleApprove = (report: any) => updateReportStatus(report, "In Progress");
  const handleReject = (report: any) => updateReportStatus(report, "Rejected");
  const handleMarkResolved = (report: any) => updateReportStatus(report, "Resolved");

  const getReportId = (report: any) => String(report.id ?? report.reportid);
  const getReportTitle = (report: any) => report.title || `Report #${report.reportid ?? report.id}`;
  const getReportLocation = (report: any) => report.location || `Region ID: ${report.regionid ?? "N/A"}`;
  const getReportDate = (report: any) => report.createdAt || report.reportdate || report.crimedate;
  const getStatusValue = (report: any) => normalizeStatusForBackend(String(report.status || "")).toLowerCase();
  const getSelectedReportId = () => Number((selectedReport as any)?.reportid ?? (selectedReport as any)?.id ?? 0);

  const linkedParticipants = participants.filter((p: any) =>
    involvedInRows.some((row: any) => Number(row.reportid) === getSelectedReportId() && Number(row.participantid) === Number(p.participantid))
  );

  const normalizeParticipantPayload = (form: typeof participantForm) => {
    const isPerson = form.participanttype === "Person";
    return {
      participantname: form.participantname.trim(),
      participanttype: form.participanttype,
      pdateofbirth: isPerson && form.pdateofbirth ? form.pdateofbirth : undefined,
      gender: isPerson && form.gender ? form.gender : undefined,
      description: form.description.trim() || undefined,
    };
  };

  const handleCreateParticipant = async () => {
    if (!selectedReport) return;
    if (!participantForm.participantname.trim()) {
      setError("Participant name is required");
      return;
    }

    setParticipantSubmitting(true);
    setError("");
    try {
      const participantResponse = await fetch(`${API_URL}/participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...normalizeParticipantPayload(participantForm),
        }),
      });

      const participantData = await participantResponse.json();
      if (!participantResponse.ok) {
        throw new Error(participantData?.message || "Failed to create participant");
      }

      const participantId = Number(participantData.participantid);
      const reportId = Number((selectedReport as any).reportid ?? (selectedReport as any).id);

      if (participantId && reportId) {
        const involvedInResponse = await fetch(`${API_URL}/involvedin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            participantid: participantId,
            reportid: reportId,
          }),
        });

        if (!involvedInResponse.ok) {
          throw new Error("Participant created, but failed to link with report");
        }
      }

      setParticipantForm({
        participantname: "",
        participanttype: "Person",
        pdateofbirth: "",
        gender: "",
        description: "",
      });
      await fetchParticipantsData();
      setSuccess("Participant created and linked successfully");
    } catch (err: any) {
      setError(err.message || "Failed to add participant");
    } finally {
      setParticipantSubmitting(false);
    }
  };

  const startEditParticipant = (participant: any) => {
    setEditingParticipantId(Number(participant.participantid));
    setParticipantForm({
      participantname: participant.participantname || "",
      participanttype: participant.participanttype || "Person",
      pdateofbirth: participant.pdateofbirth ? String(participant.pdateofbirth).slice(0, 10) : "",
      gender: participant.gender || "",
      description: participant.description || "",
    });
  };

  const handleUpdateParticipant = async () => {
    if (!editingParticipantId) return;
    if (!participantForm.participantname.trim()) {
      setError("Participant name is required");
      return;
    }

    setParticipantSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/participant/${editingParticipantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...normalizeParticipantPayload(participantForm),
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update participant");
      }

      setEditingParticipantId(null);
      setParticipantForm({
        participantname: "",
        participanttype: "Person",
        pdateofbirth: "",
        gender: "",
        description: "",
      });
      await fetchParticipantsData();
      setSuccess("Participant updated successfully");
    } catch (err: any) {
      setError(err.message || "Failed to update participant");
    } finally {
      setParticipantSubmitting(false);
    }
  };

  const handleDeleteParticipant = async (participantId: number) => {
    setParticipantSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/participant/${participantId}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete participant");
      }

      await fetchParticipantsData();
      setSuccess("Participant deleted successfully");
    } catch (err: any) {
      setError(err.message || "Failed to delete participant");
    } finally {
      setParticipantSubmitting(false);
    }
  };

  // Filter and count reports by status
  const dynamicStats = [
    { status: "pending", count: reports.filter((r: any) => getStatusValue(r) === "pending").length, color: "#f59e0b" },
    { status: "in progress", count: reports.filter((r: any) => getStatusValue(r) === "in progress").length, color: "#10b981" },
    { status: "resolved", count: reports.filter((r: any) => getStatusValue(r) === "resolved").length, color: "#3b82f6" },
    { status: "rejected", count: reports.filter((r: any) => getStatusValue(r) === "rejected").length, color: "#ef4444" },
    { status: "all", count: reports.length, color: "#ef4444" },
  ];
  const activeReports = reports.filter((r: any) => getStatusValue(r) !== "resolved");


  return (
    <div className="min-h-screen bg-[#0f1729]">
      <Sidebar />
      <div className="ml-64 w-[calc(100%-16rem)]">
      {/* Header */}
      <div className="bg-[#1a2744] border-b border-white/10 px-6 xl:px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Control Panel</h1>
            <p className="text-[#94a3b8] mt-2">Manage reports, approve submissions, and oversee operations</p>
          </div>
          <div className="text-right">
            <p className="text-[#94a3b8] text-sm">Logged in as Administrator</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 xl:px-8 py-8 space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl"
          >
            {success}
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#dc143c] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#94a3b8] ml-3">Loading reports...</p>
          </div>
        ) : (
          <>
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {dynamicStats.map((stat) => (
            <motion.div
              key={stat.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a2744] p-6 rounded-xl border border-white/10"
            >
              <p className="text-[#94a3b8] text-sm capitalize mb-2">{stat.status}</p>
              <p className="text-3xl font-bold text-white">{stat.count}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Layout: Pending Queue + Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Reports Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-[#1a2744] p-6 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-[#dc143c]" />
              <h3 className="text-lg font-bold text-white">
                Active Reports ({activeReports.length})
              </h3>
            </div>

            {activeReports.length === 0 ? (
              <p className="text-[#94a3b8] text-center py-8">No active reports available</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeReports.map((report: any) => (
                  <motion.button
                    key={getReportId(report)}
                    onClick={() => {
                      setSelectedReport(report);
                      setAdminNotes(report.adminNotes || "");
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedReport && getReportId(selectedReport) === getReportId(report)
                        ? "bg-[#dc143c]/10 border-[#dc143c]"
                        : "bg-[#0f1729]/50 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{getReportTitle(report)}</h4>
                        <p className="text-sm text-[#94a3b8] mt-1">{getReportLocation(report)}</p>
                        {report.image_url && (
                          <img
                            src={report.image_url}
                            alt={`Evidence for report ${getReportId(report)}`}
                            className="mt-2 w-full max-w-xs h-24 object-cover rounded-lg border border-white/10"
                          />
                        )}
                        <p className="text-xs text-[#94a3b8] mt-1 capitalize">Status: {String(report.status)}</p>
                        <p className="text-xs text-[#64748b] mt-2">
                          {getReportDate(report) ? new Date(getReportDate(report)).toLocaleString() : "No date"}
                        </p>
                      </div>
                      <Clock className="w-4 h-4 text-[#f59e0b] flex-shrink-0" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Detail & Action Panel */}
          {selectedReport ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a2744] p-6 rounded-xl border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-4">Report Details</h3>

              {/* Report Info */}
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <p className="text-[#94a3b8] text-sm">Title</p>
                  <p className="text-white font-semibold">{getReportTitle(selectedReport)}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8] text-sm">Description</p>
                  <p className="text-white text-sm">{selectedReport.description}</p>
                </div>
                <div>
                  <p className="text-[#94a3b8] text-sm">Location</p>
                  <p className="text-white">{getReportLocation(selectedReport)}</p>
                </div>
                {selectedReport.image_url && (
                  <div>
                    <p className="text-[#94a3b8] text-sm mb-2">Evidence Image</p>
                    <img
                      src={selectedReport.image_url}
                      alt={`Evidence for report ${getReportId(selectedReport)}`}
                      className="w-full max-h-72 object-contain rounded-lg border border-white/10 bg-[#0f1729]"
                    />
                  </div>
                )}
              </div>

              {/* Admin Notes */}
              <div className="mb-4">
                <label className="block text-[#94a3b8] text-sm mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this report..."
                  className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-[#64748b] text-sm resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApprove(selectedReport)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Set In Progress
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReject(selectedReport)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMarkResolved(selectedReport)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Resolved
                </motion.button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <h4 className="text-sm font-semibold text-white">Participants For This Report</h4>
                {linkedParticipants.length === 0 ? (
                  <p className="text-xs text-[#94a3b8]">No participants linked yet.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {linkedParticipants.map((p: any) => (
                      <div key={p.participantid} className="bg-[#0f1729] border border-white/10 rounded-lg p-3">
                        <p className="text-white text-sm font-semibold">{p.participantname}</p>
                        <p className="text-xs text-[#94a3b8]">{p.participanttype}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => startEditParticipant(p)}
                            className="px-2 py-1 text-xs rounded bg-blue-600 text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteParticipant(Number(p.participantid))}
                            className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <h4 className="text-sm font-semibold text-white">
                  {editingParticipantId ? "Update Participant" : "Add Participant"}
                </h4>
                <input
                  value={participantForm.participantname}
                  onChange={(e) => setParticipantForm((prev) => ({ ...prev, participantname: e.target.value }))}
                  placeholder="Participant name"
                  className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                />
                <select
                  value={participantForm.participanttype}
                  onChange={(e) => setParticipantForm((prev) => ({ ...prev, participanttype: e.target.value }))}
                  className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="Person">Person</option>
                  <option value="Object">Object</option>
                  <option value="Natural_Event">Natural_Event</option>
                  <option value="Crime_Entity">Crime_Entity</option>
                  <option value="Other">Other</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  {participantForm.participanttype === "Person" ? (
                    <>
                      <input
                        type="date"
                        value={participantForm.pdateofbirth}
                        onChange={(e) => setParticipantForm((prev) => ({ ...prev, pdateofbirth: e.target.value }))}
                        className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                      />
                      <select
                        value={participantForm.gender}
                        onChange={(e) => setParticipantForm((prev) => ({ ...prev, gender: e.target.value }))}
                        className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                      >
                        <option value="">Gender (optional)</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </>
                  ) : (
                    <p className="col-span-2 text-xs text-[#94a3b8]">Birthdate and gender are only applicable for participant type "Person".</p>
                  )}
                </div>
                <textarea
                  value={participantForm.description}
                  onChange={(e) => setParticipantForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Participant description (optional)"
                  className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none"
                  rows={2}
                />
                <button
                  onClick={editingParticipantId ? handleUpdateParticipant : handleCreateParticipant}
                  disabled={participantSubmitting}
                  className="w-full bg-[#dc143c] text-white py-2 rounded-lg font-semibold hover:bg-[#c41236] transition-colors text-sm disabled:opacity-60"
                >
                  {participantSubmitting
                    ? "Saving participant..."
                    : editingParticipantId
                      ? "Update Participant"
                      : "Create Participant for This Report"}
                </button>
                {editingParticipantId && (
                  <button
                    onClick={() => {
                      setEditingParticipantId(null);
                      setParticipantForm({
                        participantname: "",
                        participanttype: "Person",
                        pdateofbirth: "",
                        gender: "",
                        description: "",
                      });
                    }}
                    className="w-full bg-[#334155] text-white py-2 rounded-lg text-sm"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a2744] p-6 rounded-xl border border-white/10 flex items-center justify-center"
            >
              <p className="text-[#94a3b8] text-center">
                Select a report to review and take action
              </p>
            </motion.div>
          )}
        </div>

        {/* Stats Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a2744] p-6 rounded-xl border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-6">Report Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dynamicStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {dynamicStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
