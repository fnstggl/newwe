
import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/a6fe229c-4441-4de6-9f2d-2953b380f517.png" 
              alt="Realer Estate Logo" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/search" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all hover:text-blue-400 hover:bg-blue-500/10 ${
                location.pathname === '/search' ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="tracking-tight">Search</span>
            </Link>
            <Link 
              to="/neighborhoods" 
              className={`px-3 py-2 rounded-md transition-all hover:text-blue-400 hover:bg-blue-500/10 tracking-tight ${
                location.pathname === '/neighborhoods' ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              Neighborhoods
            </Link>
            <Link 
              to="/manifesto" 
              className={`px-3 py-2 rounded-md transition-all hover:text-blue-400 hover:bg-blue-500/10 tracking-tight ${
                location.pathname === '/manifesto' ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              Manifesto
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-300 hover:text-white transition-colors tracking-tight"
            >
              Log in
            </Link>
            <Link 
              to="/join" 
              className="bg-white text-black px-6 py-2 rounded-full font-medium tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
