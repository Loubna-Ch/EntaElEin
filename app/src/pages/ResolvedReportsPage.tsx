import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function ResolvedReportsPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [involvedInRows, setInvolvedInRows] = useState<any[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [editingParticipantId, setEditingParticipantId] = useState<number | null>(null);
  const [participantSubmitting, setParticipantSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [participantForm, setParticipantForm] = useState({
    participantname: "",
    participanttype: "Person",
    pdateofbirth: "",
    gender: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");
        const [reportsRes, participantsRes, involvedRes] = await Promise.all([
          fetch(`${API_URL}/report`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_URL}/participant`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_URL}/involvedin`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (!reportsRes.ok || !participantsRes.ok || !involvedRes.ok) {
          throw new Error("Failed to fetch reports");
        }

        const [reportsData, participantsData, involvedData] = await Promise.all([
          reportsRes.json(),
          participantsRes.json(),
          involvedRes.json(),
        ]);

        const nextReports = Array.isArray(reportsData) ? reportsData : [];
        setReports(nextReports);
        setParticipants(Array.isArray(participantsData) ? participantsData : []);
        setInvolvedInRows(Array.isArray(involvedData) ? involvedData : []);

        if (!selectedReportId) {
          const firstResolved = nextReports.find((r: any) => String(r.status || "").toLowerCase() === "resolved");
          if (firstResolved) {
            setSelectedReportId(Number(firstResolved.reportid ?? firstResolved.id));
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load resolved reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 2500);
    return () => clearTimeout(timer);
  }, [success]);

  const resolvedReports = useMemo(
    () => reports.filter((r) => String(r.status || "").toLowerCase() === "resolved"),
    [reports]
  );

  const selectedReport = resolvedReports.find((r: any) => Number(r.reportid ?? r.id) === Number(selectedReportId));

  const linkedParticipants = participants.filter((p: any) =>
    involvedInRows.some((row: any) => Number(row.reportid) === Number(selectedReportId) && Number(row.participantid) === Number(p.participantid))
  );

  const normalizeParticipantPayload = () => {
    const isPerson = participantForm.participanttype === "Person";
    return {
      participantname: participantForm.participantname.trim(),
      participanttype: participantForm.participanttype,
      pdateofbirth: isPerson && participantForm.pdateofbirth ? participantForm.pdateofbirth : undefined,
      gender: isPerson && participantForm.gender ? participantForm.gender : undefined,
      description: participantForm.description.trim() || undefined,
    };
  };

  const refreshParticipants = async () => {
    const [participantsRes, involvedRes] = await Promise.all([
      fetch(`${API_URL}/participant`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      fetch(`${API_URL}/involvedin`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    ]);

    if (participantsRes.ok && involvedRes.ok) {
      const [participantsData, involvedData] = await Promise.all([
        participantsRes.json(),
        involvedRes.json(),
      ]);
      setParticipants(Array.isArray(participantsData) ? participantsData : []);
      setInvolvedInRows(Array.isArray(involvedData) ? involvedData : []);
    }
  };

  const handleCreateParticipant = async () => {
    if (!selectedReportId) return;
    if (!participantForm.participantname.trim()) {
      setError("Participant name is required");
      return;
    }

    setParticipantSubmitting(true);
    setError("");
    try {
      const createRes = await fetch(`${API_URL}/participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(normalizeParticipantPayload()),
      });
      const created = await createRes.json().catch(() => null);
      if (!createRes.ok) throw new Error(created?.message || "Failed to create participant");

      const linkRes = await fetch(`${API_URL}/involvedin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ participantid: Number(created.participantid), reportid: Number(selectedReportId) }),
      });
      if (!linkRes.ok) throw new Error("Failed to link participant with report");

      setParticipantForm({
        participantname: "",
        participanttype: "Person",
        pdateofbirth: "",
        gender: "",
        description: "",
      });
      await refreshParticipants();
      setSuccess("Participant added to resolved report");
    } catch (err: any) {
      setError(err.message || "Failed to add participant");
    } finally {
      setParticipantSubmitting(false);
    }
  };

  const startEdit = (participant: any) => {
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
    setParticipantSubmitting(true);
    setError("");
    try {
      const updateRes = await fetch(`${API_URL}/participant/${editingParticipantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(normalizeParticipantPayload()),
      });
      const updated = await updateRes.json().catch(() => null);
      if (!updateRes.ok) throw new Error(updated?.message || "Failed to update participant");

      setEditingParticipantId(null);
      setParticipantForm({
        participantname: "",
        participanttype: "Person",
        pdateofbirth: "",
        gender: "",
        description: "",
      });
      await refreshParticipants();
      setSuccess("Participant updated");
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
      const res = await fetch(`${API_URL}/participant/${participantId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete participant");

      await refreshParticipants();
      setSuccess("Participant deleted");
    } catch (err: any) {
      setError(err.message || "Failed to delete participant");
    } finally {
      setParticipantSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <Sidebar />
      <div className="ml-64 px-12 py-8">
        <h1 className="text-3xl font-bold text-white">Resolved Reports</h1>
        <p className="text-[#94a3b8] mt-2">All reports marked as resolved</p>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl">
            {success}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-[#94a3b8]">Loading resolved reports...</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-4">
            {resolvedReports.length === 0 ? (
              <div className="text-[#94a3b8]">No resolved reports found.</div>
            ) : (
              resolvedReports.map((report) => (
                <div
                  key={String(report.reportid ?? report.id)}
                  className={`bg-[#1a2744] border rounded-xl p-5 cursor-pointer ${Number(report.reportid ?? report.id) === Number(selectedReportId) ? "border-[#dc143c]" : "border-white/10"}`}
                  onClick={() => setSelectedReportId(Number(report.reportid ?? report.id))}
                >
                  <p className="text-sm text-[#94a3b8]">Report ID: {report.reportid ?? report.id}</p>
                  <p className="text-white font-semibold mt-1">{report.title || `Report #${report.reportid ?? report.id}`}</p>
                  <p className="text-[#cbd5e1] text-sm mt-2">{report.description || "No description"}</p>
                  {report.image_url && (
                    <img
                      src={report.image_url}
                      alt={`Evidence for report ${report.reportid ?? report.id}`}
                      className="mt-3 w-full h-32 object-cover rounded-lg border border-white/10"
                    />
                  )}
                  <p className="text-xs text-[#94a3b8] mt-3">
                    Crime Date: {report.crimedate ? new Date(report.crimedate).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-1">Region ID: {report.regionid ?? "N/A"}</p>
                </div>
              ))
            )}
          </div>
        )}

        {!loading && selectedReport && (
          <div className="mt-8 bg-[#1a2744] border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white">Participants For Report #{selectedReport.reportid ?? selectedReport.id}</h2>
            <p className="text-[#94a3b8] mt-1">Participants can always be modified even after report resolution.</p>

            <div className="mt-4 space-y-2">
              {linkedParticipants.length === 0 ? (
                <p className="text-sm text-[#94a3b8]">No participants linked yet. Add one below.</p>
              ) : (
                linkedParticipants.map((p: any) => (
                  <div key={p.participantid} className="bg-[#0f1729] border border-white/10 rounded-lg p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white text-sm font-semibold">{p.participantname}</p>
                      <p className="text-xs text-[#94a3b8]">{p.participanttype}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="px-2 py-1 text-xs rounded bg-blue-600 text-white">Edit</button>
                      <button onClick={() => handleDeleteParticipant(Number(p.participantid))} className="px-2 py-1 text-xs rounded bg-red-600 text-white">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
              <h3 className="text-sm font-semibold text-white">{editingParticipantId ? "Update Participant" : "Add Participant"}</h3>
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

              {participantForm.participanttype === "Person" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                </div>
              ) : (
                <p className="text-xs text-[#94a3b8]">Birthdate and gender are only for participant type "Person".</p>
              )}

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
                {participantSubmitting ? "Saving..." : editingParticipantId ? "Update Participant" : "Add Participant"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
