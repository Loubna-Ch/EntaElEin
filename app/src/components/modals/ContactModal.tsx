import { motion, AnimatePresence } from "motion/react";
import { X, Phone } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-[#1a2744] border border-white/10 rounded-2xl p-8 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-[#94a3b8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-white mb-2">Get In Touch</h2>
              <p className="text-[#94a3b8] text-sm mb-6">
                We're here to help. Contact us with any questions or concerns.
              </p>

              {/* Contact Content */}
              <div className="space-y-6">
                {/* Phone Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0f1729]/50 border border-[#dc143c]/20 rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-5 h-5 text-[#dc143c]" />
                    <h3 className="text-lg font-semibold text-white">Phone</h3>
                  </div>
                  <a
                    href="tel:+96171073716"
                    className="text-2xl font-bold text-[#dc143c] hover:text-[#ff4d7d] transition-colors"
                  >
                    +961 71 073 716
                  </a>
                  <p className="text-[#94a3b8] text-sm mt-3">
                    For any concerns or urgent matters, please do not hesitate to contact us at the
                    number above.
                  </p>
                </motion.div>

                {/* Additional Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-[#2d3e5f]/30 border-l-2 border-[#dc143c] rounded"
                >
                  <p className="text-[#94a3b8] text-sm">
                    <span className="text-white font-semibold">Response Time:</span> We typically
                    respond within 1-59 minutes during business hours.
                  </p>
                </motion.div>
              </div>

              {/* Action Button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onClose}
                className="w-full mt-6 bg-[#dc143c] text-white py-3 rounded-lg font-semibold hover:bg-[#c41236] transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
