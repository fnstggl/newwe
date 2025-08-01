import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 transition-all duration-300 ${
      isScrolled ? 'mx-6 mt-3 rounded-full border border-gray-800' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/be3adab5-6cb0-457c-8fc5-22c457e9c7c9.png" 
              alt="Realer Estate Logo" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* For You Tab - only show for authenticated users who completed onboarding */}
            {user && userProfile?.onboarding_completed && (
              <Link 
                to="/foryou" 
                className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                  location.pathname === '/foryou' ? 'text-white' : 'text-gray-300'
                }`}
                style={{
                  textShadow: location.pathname === '/foryou' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/foryou') {
                    e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/foryou') {
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
              >
                For You
              </Link>
            )}
            
            <Link 
              to="/buy" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/buy' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/buy' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/buy') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/buy') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Buy
            </Link>
            <Link 
              to="/rent" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/rent' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/rent' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/rent') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/rent') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Rent
            </Link>
            <Link 
              to="/saved" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/saved' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/saved' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/saved') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/saved') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Saved
            </Link>
            <Link 
              to="/pricing" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/pricing' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/pricing' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/pricing') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/pricing') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Upgrade
            </Link>
            <Link 
              to="/manifesto" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/manifesto' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/manifesto' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/manifesto') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/manifesto') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Mission
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                to="/profile"
                className="text-white hover:text-gray-300 transition-colors text-xs tracking-tight"
              >
                {userProfile?.name || 'Profile'}
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
