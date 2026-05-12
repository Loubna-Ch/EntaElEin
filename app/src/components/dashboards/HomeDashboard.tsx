 import { Link } from "react-router";
import { Shield, Map, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ContactModal } from "../modals/ContactModal";
import homePageImage from "../../imports/homeWallpaper.jpeg";

export function Home() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a2744]/80 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-12 h-16 flex items-center justify-between">
          <button onClick={scrollToTop} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="w-6 h-6 text-[#dc143c]" />
            <span className="text-xl text-white font-semibold">EntaElEin</span>
          </button>
          <div className="flex items-center gap-8">
            <button
              onClick={scrollToTop}
              className="text-[#94a3b8] hover:text-white transition-colors"
            >
              Home
            </button>
            <a href="#about" className="text-[#94a3b8] hover:text-white transition-colors">
              About Us
            </a>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="text-[#94a3b8] hover:text-white transition-colors"
            >
              Contact
            </button>
            <Link to="/login" className="text-white hover:text-[#94a3b8] transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={homePageImage}
            alt="City skyline"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1729]/95 via-[#0f1729]/80 to-[#0f1729]/60" />

          {/* Digital Grid Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(#dc143c 1px, transparent 1px), linear-gradient(90deg, #dc143c 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-12 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-7xl mb-6 text-white leading-tight">
              Revolutionizing Public Safety in Lebanon
            </h1>
            <p className="text-xl text-[#94a3b8] mb-12 leading-relaxed">
              A unified platform connecting citizens and law enforcement through real-time incident
              reporting, AI-powered analytics, and community engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/report"
                className="group bg-[#dc143c] text-white px-8 py-4 rounded-lg hover:bg-[#c41236] transition-all inline-flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                Report an Incident
              </Link>
              <Link
                to="/dashboard/citizen"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2 border border-white/20"
              >
                <Map className="w-5 h-5" />
                View Some Statistics 
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-12 bg-[#1a2744]">
        <div className="w-full">
          <h2 className="text-4xl mb-16 text-white text-center">Empowering Communities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#2d3e5f]/50 backdrop-blur-sm p-8 rounded-xl border border-white/10"
            >
              <Shield className="w-12 h-12 text-[#dc143c] mb-4" />
              <h3 className="text-xl mb-3 text-white">Real-Time Reporting</h3>
              <p className="text-[#94a3b8]">
                Submit incidents with geo-tagging, media uploads, and live streaming capabilities
                for immediate response.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#2d3e5f]/50 backdrop-blur-sm p-8 rounded-xl border border-white/10"
            >
              <Map className="w-12 h-12 text-[#dc143c] mb-4" />
              <h3 className="text-xl mb-3 text-white">Predictive Analytics</h3>
              <p className="text-[#94a3b8]">
                AI-powered heat maps and trend analysis to identify high-risk areas and allocate
                resources effectively.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-[#2d3e5f]/50 backdrop-blur-sm p-8 rounded-xl border border-white/10"
            >
              <AlertCircle className="w-12 h-12 text-[#dc143c] mb-4" />
              <h3 className="text-xl mb-3 text-white">Proximity Alerts</h3>
              <p className="text-[#94a3b8]">
                Stay informed about incidents in your vicinity with real-time notifications and
                safety updates.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section className="py-24 px-12 bg-[#1a2744]">
        <div className="text-center">
          <h2 className="text-4xl mb-6 text-white">Get Started Today</h2>
          <p className="text-[#94a3b8] mb-8 max-w-2xl mx-auto">
            Join thousands of citizens contributing to national stability and public safety.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-[#dc143c] text-white px-8 py-4 rounded-lg hover:bg-[#c41236] transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1729] py-8 px-12 border-t border-white/10">
        <div className="text-center text-[#64748b]">
          <p>للأمان.... كُن العين</p>
        </div>
      </footer>
    </div>
  );
}