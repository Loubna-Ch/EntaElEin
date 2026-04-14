import { useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Star, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface FeedbackFormProps {
  onSubmit?: () => Promise<void>;
  onClose?: () => void;
}

export function FeedbackForm({ onSubmit, onClose }: FeedbackFormProps) {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    content: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!token || !user?.userid) {
        throw new Error("Authentication required. Please log in.");
      }

      if (!formData.content.trim()) {
        throw new Error("Please provide feedback content.");
      }

      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: formData.content,
          rating: formData.rating,
          userid: user.userid,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit feedback");
      }

      setSuccess(true);
      setFormData({ content: "", rating: 5 });
      await onSubmit?.();
      onClose?.();
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback");
      console.error("Feedback submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-[#1a2744] rounded-xl border border-white/10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#dc143c]" />
            <h2 className="text-2xl font-bold text-white">Send Us Feedback</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-[#94a3b8] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center"
          >
            <p className="text-green-500 font-semibold text-lg">
              ✓ Thank you for your feedback!
            </p>
            <p className="text-[#94a3b8] mt-2">
              We appreciate your input and will use it to improve our platform.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-4">
                How would you rate your experience?
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? "fill-[#dc143c] text-[#dc143c]"
                          : "text-[#64748b]"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Feedback Field */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-white mb-2">
                Your Feedback
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tell us what you think... What can we improve? What did you like?"
                required
                rows={5}
                className="w-full bg-[#0f1729] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-[#64748b] focus:border-[#dc143c] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-[#dc143c] text-white py-3 rounded-lg font-semibold hover:bg-[#c41236] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
