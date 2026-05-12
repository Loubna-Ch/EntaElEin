import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-[#dc143c] mx-auto mb-6" />
        <h1 className="text-4xl mb-4 text-white">404 - Page Not Found</h1>
        <p className="text-[#94a3b8] mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block bg-[#dc143c] text-white px-6 py-3 rounded-lg hover:bg-[#c41236] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
