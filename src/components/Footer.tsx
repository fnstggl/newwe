
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/be3adab5-6cb0-457c-8fc5-22c457e9c7c9.png" 
              alt="Realer Estate Logo" 
              className="h-6 w-auto"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/press" 
              className="text-gray-400 hover:text-white transition-colors text-sm tracking-tight"
            >
              Press
            </Link>
            <Link 
              to="/privacy" 
              className="text-gray-400 hover:text-white transition-colors text-sm tracking-tight"
            >
              Privacy
            </Link>
            <Link 
              to="/terms" 
              className="text-gray-400 hover:text-white transition-colors text-sm tracking-tight"
            >
              Terms
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm tracking-tight">
            © {new Date().getFullYear()} Realer Estate. Built to help New Yorkers find better homes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
