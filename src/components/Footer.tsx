
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
