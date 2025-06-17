
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActivePage = (path: string) => location.pathname === path;

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
              className={`px-3 py-2 rounded-md transition-all text-xs tracking-tight ${
                isActivePage('/search') 
                  ? 'text-white font-playfair italic' 
                  : 'text-gray-300 hover:text-white hover:font-playfair hover:italic'
              }`}
            >
              Search
            </Link>
            <Link 
              to="/neighborhoods" 
              className={`px-3 py-2 rounded-md transition-all text-xs tracking-tight ${
                isActivePage('/neighborhoods') 
                  ? 'text-white font-playfair italic' 
                  : 'text-gray-300 hover:text-white hover:font-playfair hover:italic'
              }`}
            >
              Neighborhoods
            </Link>
            <Link 
              to="/pricing" 
              className={`px-3 py-2 rounded-md transition-all text-xs tracking-tight ${
                isActivePage('/pricing') 
                  ? 'text-white font-playfair italic' 
                  : 'text-gray-300 hover:text-white hover:font-playfair hover:italic'
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/manifesto" 
              className={`px-3 py-2 rounded-md transition-all text-xs tracking-tight ${
                isActivePage('/manifesto') 
                  ? 'text-white font-playfair italic' 
                  : 'text-gray-300 hover:text-white hover:font-playfair hover:italic'
              }`}
            >
              Manifesto
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-300 hover:text-white transition-colors text-xs tracking-tight"
              style={{
                textShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
              }}
            >
              Log in
            </Link>
            <Link 
              to="/join" 
              className="bg-white text-black px-6 py-2 rounded-full font-medium text-xs tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
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
