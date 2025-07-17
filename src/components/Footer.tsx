
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 px-4 relative overflow-hidden">
      {/* Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-blue-800/40"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-blue-600/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-[600px] h-[400px] bg-gradient-to-tl from-purple-500/30 via-blue-400/20 to-cyan-500/40 rounded-full blur-2xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-center space-x-8 text-sm text-gray-400">
          <Link to="/privacy" className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-gray-300 transition-colors">
            Terms of Service
          </Link>
          <Link to="/press" className="hover:text-gray-300 transition-colors">
            Press
          </Link>
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
          © 2025 Realer Estate. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
