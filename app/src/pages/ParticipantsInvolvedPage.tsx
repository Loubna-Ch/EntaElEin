import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function ParticipantsInvolvedPage() {
  const { token } = useAuth();
  const [participants, setParticipants] = useState<any[]>([]);
  const [involvedIn, setInvolvedIn] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [participantsRes, involvedRes] = await Promise.all([
          fetch(`${API_URL}/participant`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
          fetch(`${API_URL}/involvedin`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (!participantsRes.ok || !involvedRes.ok) {
          throw new Error("Failed to fetch participants or involved records");
        }

        const [participantsData, involvedData] = await Promise.all([
          participantsRes.json(),
          involvedRes.json(),
        ]);

        setParticipants(Array.isArray(participantsData) ? participantsData : []);
        setInvolvedIn(Array.isArray(involvedData) ? involvedData : []);
      } catch (err: any) {
        setError(err.message || "Failed to load participants");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const participantById = useMemo(() => {
    const map = new Map<number, any>();
    participants.forEach((p) => map.set(Number(p.participantid), p));
    return map;
  }, [participants]);

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <Sidebar />
      <div className="ml-64 px-12 py-8">
        <h1 className="text-3xl font-bold text-white">Participants Involved</h1>
        <p className="text-[#94a3b8] mt-2">Read from backend participant + involvedin tables</p>

        {error && (
          <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-[#94a3b8]">Loading participants...</div>
        ) : (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-[#1a2744] text-[#cbd5e1]">
                <tr>
                  <th className="text-left p-3">Report ID</th>
                  <th className="text-left p-3">Participant ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Gender</th>
                  <th className="text-left p-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {involvedIn.length === 0 ? (
                  <tr>
                    <td className="p-3 text-[#94a3b8]" colSpan={6}>No involved records found.</td>
                  </tr>
                ) : (
                  involvedIn.map((row) => {
                    const participant = participantById.get(Number(row.participantid));
                    return (
                      <tr key={`${row.participantid}-${row.reportid}`} className="border-t border-white/10 text-white">
                        <td className="p-3">{row.reportid}</td>
                        <td className="p-3">{row.participantid}</td>
                        <td className="p-3">{participant?.participantname || "Unknown"}</td>
                        <td className="p-3">{participant?.participanttype || "Unknown"}</td>
                        <td className="p-3">{participant?.gender || "-"}</td>
                        <td className="p-3">{participant?.description || "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
