
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Update meta tags for SEO
    document.title = "Page Not Found - Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'The page you are looking for could not be found. Return to Realer Estate to find undervalued NYC properties.');
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/404');
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold mb-6 text-white">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-white">Page Not Found</h2>
        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-gray-100 shadow-lg"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
