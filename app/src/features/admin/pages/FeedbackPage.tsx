import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MessageSquare, Star, User as UserIcon } from "lucide-react";
import { Sidebar } from "../../../components/layout/Sidebar";
import { useAuth } from "../../../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type FeedbackRow = {
	feedbackid: number;
	content: string | null;
	rating: number;
	dateposted: string;
	userid: number | null;
	user?: {
		userid: number;
		username: string;
		email: string;
	} | null;
};

export function FeedbackPage() {
	const { token, user } = useAuth();
	const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchFeedback = async () => {
			if (!user?.userid) {
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError("");
				const response = await fetch(`${API_URL}/feedback`, {
					headers: {
						...(token ? { Authorization: `Bearer ${token}` } : {}),
						"x-user-id": String(user.userid),
					},
				});

				const data = await response.json().catch(() => null);
				if (!response.ok) {
					throw new Error(data?.message || "Failed to fetch feedback");
				}

				setFeedback(Array.isArray(data) ? data : []);
			} catch (err: any) {
				setError(err.message || "Failed to load feedback");
			} finally {
				setLoading(false);
			}
		};

		fetchFeedback();
	}, [token, user?.userid]);

	const stats = useMemo(() => {
		const total = feedback.length;
		const average = total > 0 ? feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) / total : 0;

		return { total, average };
	}, [feedback]);

	return (
		<div className="min-h-screen bg-[#0f1729]">
			<Sidebar />
			<div className="ml-64 relative overflow-hidden">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,20,60,0.14),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]" />
				<div className="relative bg-[#1a2744]/92 border-b border-white/10 px-6 xl:px-8 py-8 backdrop-blur-sm">
					<div className="flex flex-col gap-2">
						<h1 className="text-3xl font-bold text-white">Feedback Inbox</h1>
						<p className="text-[#94a3b8]">Review all submitted citizen feedback.</p>
					</div>
				</div>

				<div className="relative px-6 xl:px-8 py-8 space-y-8">
					{error && (
						<div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl shadow-lg shadow-red-950/10">
							{error}
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg shadow-black/10 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
							<p className="text-sm text-[#94a3b8] mb-1">Total feedback</p>
							<p className="text-3xl font-bold text-white">{stats.total}</p>
						</div>
						<div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg shadow-black/10 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
							<p className="text-sm text-[#94a3b8] mb-1">Average rating</p>
							<p className="text-3xl font-bold text-white">{stats.average ? stats.average.toFixed(1) : "0.0"}</p>
						</div>
					</div>

					{loading ? (
						<div className="flex items-center justify-center py-16 text-[#94a3b8]">
							<div className="w-8 h-8 border-2 border-[#dc143c] border-t-transparent rounded-full animate-spin mr-3" />
							Loading feedback...
						</div>
					) : feedback.length === 0 ? (
						<div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-[#94a3b8] shadow-lg shadow-black/10 backdrop-blur-sm">
							No feedback has been submitted yet.
						</div>
					) : (
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
							{feedback.map((item, index) => (
								<motion.div
									key={item.feedbackid}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: Math.min(index * 0.05, 0.3) }}
									className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-10 h-10 rounded-full bg-[#0f1729]/80 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
												<UserIcon className="w-5 h-5 text-[#94a3b8]" />
											</div>
											<div className="min-w-0">
												<p className="text-white font-semibold truncate">{item.user?.username || "Anonymous user"}</p>
												<p className="text-xs text-[#94a3b8] truncate">{item.user?.email || `User ID: ${item.userid ?? "N/A"}`}</p>
											</div>
										</div>

										<div className="flex items-center gap-1 text-amber-400 shrink-0">
											<Star className="w-4 h-4 fill-current" />
											<span className="text-sm font-semibold text-white">{item.rating}</span>
										</div>
									</div>

									<div className="mt-4 bg-[#0f1729]/55 rounded-xl border border-white/5 p-4 shadow-inner">
										<div className="flex items-center gap-2 text-[#94a3b8] text-xs mb-2">
											<MessageSquare className="w-4 h-4" />
											Feedback message
										</div>
										<p className="text-sm text-white leading-6 whitespace-pre-wrap">
											{item.content || "No message provided."}
										</p>
									</div>

									<div className="mt-4 flex items-center gap-2 text-xs text-[#94a3b8]">
										<Clock className="w-4 h-4" />
										<span>
											{item.dateposted ? new Date(item.dateposted).toLocaleString() : "Unknown date"}
										</span>
									</div>
								</motion.div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}