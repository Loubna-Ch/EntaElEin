import { X, Star, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setContent("");
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-[#1a2744] rounded-xl p-8 border border-white/10 m-4">
              {!submitted ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl text-white">Share Your Feedback</h2>
                    <button
                      onClick={onClose}
                      className="p-2 text-[#94a3b8] hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm mb-3 text-white">How would you rate your experience?</label>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= (hoveredRating || rating)
                                  ? 'fill-[#dc143c] text-[#dc143c]'
                                  : 'text-[#64748b]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-white">Additional Comments</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        className="w-full bg-[#2d3e5f] text-white px-4 py-3 rounded-lg border border-white/10 focus:outline-none focus:border-[#dc143c] transition-colors resize-none"
                        placeholder="Share your thoughts, suggestions, or report issues..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={rating === 0}
                      className="w-full bg-[#dc143c] text-white py-3 rounded-lg hover:bg-[#c41236] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Feedback
                    </button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
                  <h3 className="text-xl mb-2 text-white">Thank You!</h3>
                  <p className="text-[#94a3b8]">
                    Thank you for contributing to national stability
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
