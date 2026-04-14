import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Shield, ArrowLeft, ArrowRight, MapPin, Upload, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

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

const lebaneseRegions = [
  "Batroun - Center",
  "Beirut - Achrafieh",
  "Beirut - Hamra",
  "Beirut - Ramlet el Bayda",
  "Byblos - Center",
  "Jounieh - Center",
  "Koura - Amioun",
  "Koura - Anfeh",
  "Koura - Kousba",
  "Saida - Center",
  "Tripoli - Abi Samra",
  "Tripoli - Azmi",
  "Tripoli - Bab al-Raml",
  "Tripoli - Bab al-Tabbaneh",
  "Tripoli - Bahsas",
  "Tripoli - Basateen",
  "Tripoli - Dam w Farz",
  "Tripoli - El Mina",
  "Tripoli - El Tell",
  "Tripoli - Haddadine",
  "Tripoli - Jabal Mohsen",
  "Tripoli - Maarad",
  "Tripoli - Qalamoun",
  "Tripoli - Qoubbeh",
  "Tripoli - Zahrieh",
  "Tyre - Center",
  "Zahle - Center",
  "Zgharta - Center",
  "Zgharta - Ehden",
  "Zgharta - Mejdlaya",
];

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const CrimeReport = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Defaulting values to match your SQL schema (Numbers for IDs)
  const [formData, setFormData] = useState({
    crimedate: new Date().toISOString().split('T')[0], 
    crimetime: new Date().toTimeString().slice(0, 5),
    reportdate: new Date().toISOString().split('T')[0],
    description: '',
    status: 'Pending',
    image_url: '',
    userid: user?.userid ? Number(user.userid) : 0,
    regionid: 18, // Default: Tripoli - El Mina
    hadasid: 1   // Default: Theft
  });

  // Sync userid if auth state loads late
  useEffect(() => {
    if (user?.userid) {
      setFormData(prev => ({ ...prev, userid: Number(user.userid) }));
    }
  }, [user]);

  const steps = ['Details', 'Location', 'Media'];

  const handleImageFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file only.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setError("Image is too large. Maximum allowed size is 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const imageDataUrl = reader.result;
        setFormData((prev) => ({ ...prev, image_url: imageDataUrl }));
      }
    };
    reader.onerror = () => setError("Failed to read the selected image.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!token) return setError("Authentication required. Please log in.");
    if (!formData.description.trim()) return setError("Please provide a description of the incident.");
    if (!formData.crimedate) return setError("Crime date is required.");
    if (!formData.crimetime) return setError("Crime time is required.");
    if (!formData.status.trim()) return setError("Status is required.");
    if (!formData.userid || formData.userid <= 0) return setError("User information is missing. Please log in again.");
    if (!formData.regionid || formData.regionid <= 0) return setError("Region is required.");
    if (!formData.hadasid || formData.hadasid <= 0) return setError("Category is required.");
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/report`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          reportdate: new Date().toISOString().split('T')[0],
          status: "Pending",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => navigate('/dashboard/citizen'), 2500);
      } else {
        // Handles express-validator arrays or standard message strings
        const errorMsg = result.errors ? result.errors[0].msg : result.message || "Submission failed";
        setError(errorMsg);
      }
    } catch (err) {
      setError("Unable to connect to Tripoli safety servers. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Report Submitted</h2>
          <p className="text-slate-400">Thank you for helping keep our community safe.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1729] text-white pb-12">
      <header className="bg-[#1a2744] border-b border-white/10 p-4 mb-8 sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-[#dc143c]" />
            <h1 className="text-xl font-bold tracking-tight">Enta el Ein <span className="text-slate-500 font-normal">| Report</span></h1>
          </div>
          <Link to="/dashboard/citizen" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="text-slate-400" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Stepper Logic */}
        <div className="flex justify-between mb-10 relative px-2">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-col items-center z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all duration-300 ${
                step >= i ? "bg-[#dc143c] text-white shadow-[0_0_20px_rgba(220,20,60,0.3)]" : "bg-slate-800 text-slate-500"
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-tighter ${step >= i ? "text-white" : "text-slate-500"}`}>{label}</span>
            </div>
          ))}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-800 -z-0">
             <div className="bg-[#dc143c] h-full transition-all duration-500" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className="bg-[#1a2744] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="details" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-200">
                  <FileText size={20} className="text-[#dc143c]" /> 1. Incident Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                    <select 
                      className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-3 text-white focus:border-[#dc143c] outline-none transition-all appearance-none cursor-pointer"
                      value={formData.hadasid}
                      onChange={(e) => setFormData({...formData, hadasid: Number(e.target.value)})}
                    >
                      {incidentCategories.map((category, index) => (
                        <option key={category} value={index + 1}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                    <input
                      type="text"
                      value="Pending"
                      readOnly
                      className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-3 text-slate-300 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Occurrence Date</label>
                    <input 
                      type="date"
                      className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-3 text-white focus:border-[#dc143c] outline-none"
                      value={formData.crimedate}
                      onChange={(e) => setFormData({...formData, crimedate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Occurrence Time</label>
                    <input
                      type="time"
                      className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-3 text-white focus:border-[#dc143c] outline-none"
                      value={formData.crimetime}
                      onChange={(e) => setFormData({ ...formData, crimetime: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Describe what happened</label>
                    <textarea 
                      rows={5}
                      className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-4 text-white focus:border-[#dc143c] outline-none resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Include details like time, people involved, or specific landmarks..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="location" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-200">
                  <MapPin size={20} className="text-[#dc143c]" /> 2. Location
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Specific Region</label>
                    <select 
                      className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-3 text-white focus:border-[#dc143c] outline-none appearance-none"
                      value={formData.regionid}
                      onChange={(e) => setFormData({...formData, regionid: Number(e.target.value)})}
                    >
                      {lebaneseRegions.map((region, index) => (
                        <option key={region} value={index + 1}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="aspect-video bg-[#0f1729] rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center p-6 text-center">
                    <MapPin size={32} className="text-slate-600 mb-2" />
                    <p className="text-slate-500 text-sm">Map module will automatically detect coordinates based on region selection.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="media" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-200">
                  <Upload size={20} className="text-[#dc143c]" /> 3. Evidence
                </h3>
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Upload Evidence Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-3 text-white focus:border-[#dc143c] outline-none"
                    onChange={(e) => {
                      setError(null);
                      handleImageFileChange(e.target.files?.[0] || null);
                    }}
                  />
                  <p className="text-xs text-slate-400">Accepted: image files up to 5MB.</p>

                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Or Paste Image URL</label>
                  <input 
                    type="url"
                    className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-3 text-white focus:border-[#dc143c] outline-none"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://imgur.com/your-image.jpg"
                  />
                  {formData.image_url && (
                    <div className="bg-[#0f1729] p-3 rounded-xl border border-white/10">
                      <p className="text-xs text-slate-400 mb-2">Image Preview</p>
                      <img
                        src={formData.image_url}
                        alt="Evidence preview"
                        className="w-full max-h-72 object-cover rounded-lg border border-white/10"
                      />
                    </div>
                  )}
                  <div className="bg-[#0f1729] p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong>Privacy Note:</strong> Uploaded images are encrypted and only accessible by authorized regional security officers.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className={`px-8 py-3 rounded-xl font-bold border border-white/10 transition-all ${
              step === 0 ? "opacity-20 cursor-not-allowed" : "hover:bg-white/5 active:scale-95 text-slate-300"
            }`}
          >
            Previous
          </button>
          
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-10 py-3 rounded-xl font-bold bg-[#dc143c] hover:bg-[#c41236] flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-900/30"
            >
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : "Log Report"}
            </button>
          )}
        </div>
      </main>

      <footer className="bg-[#0f1729] py-6 px-12 border-t border-white/10 mt-10">
        <div className="text-center text-[#64748b]">
          <p>للأمان.... كُن العين</p>
        </div>
      </footer>
    </div>
  );
};

export default CrimeReport;