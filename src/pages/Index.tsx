import { Link } from "react-router-dom";
import { ArrowDown, TrendingUp, MapPin, DollarSign, Home, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  const [currentListingIndex, setCurrentListingIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update meta tags for SEO - Home page
    document.title = "Realer Estate - Your Unfair Advantage in NYC Real Estate | Find Undervalued Properties";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent.');
    
    setIsVisible(true);
    
    // Rotate listings every 3 seconds
    const interval = setInterval(() => {
      setCurrentListingIndex((prevIndex) => (prevIndex + 1) % featuredListings.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Featured listings data for rotation
  const featuredListings = [
    {
      address: "125 E 23rd St, Gramercy",
      price: "$3,200",
      originalPrice: "$4,100",
      savings: "$900",
      beds: "1",
      grade: "A+",
      neighborhood: "Gramercy"
    },
    {
      address: "456 W 19th St, Chelsea", 
      price: "$2,850",
      originalPrice: "$3,650",
      savings: "$800",
      beds: "Studio",
      grade: "A",
      neighborhood: "Chelsea"
    },
    {
      address: "789 Kent Ave, Williamsburg",
      price: "$2,400",
      originalPrice: "$3,200", 
      savings: "$800",
      beds: "1",
      grade: "A-",
      neighborhood: "Williamsburg"
    },
    {
      address: "321 E 14th St, East Village",
      price: "$2,950",
      originalPrice: "$3,800",
      savings: "$850",
      beds: "1",
      grade: "A+",
      neighborhood: "East Village"
    }
  ];

  const neighborhoodIcons = [
    { symbol: "M", name: "Manhattan" },
    { symbol: "B", name: "Brooklyn" },
    { symbol: "Q", name: "Queens" },
    { symbol: "X", name: "Bronx" },
    { symbol: "S", name: "Staten Island" },
    { symbol: "LES", name: "Lower East Side" },
    { symbol: "W", name: "Williamsburg" },
    { symbol: "CH", name: "Chelsea" },
    { symbol: "SO", name: "SoHo" }
  ];

  const currentListing = featuredListings[currentListingIndex];

  return (
    <div className="bg-black text-white min-h-screen font-inter">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background with geometric elements and glowing effects */}
        <div className="absolute inset-0">
          {/* Main dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          
          {/* Blue accent gradients */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[800px] md:h-[600px] bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-blue-600/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-64 h-64 md:w-[600px] md:h-[400px] bg-gradient-to-tl from-blue-500/15 via-cyan-400/10 to-blue-600/20 rounded-full blur-2xl"></div>
          
          {/* Floating geometric elements - hidden on mobile */}
          <div className="hidden lg:block">
            <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500/30 rounded-xl transform rotate-12 hover:rotate-45 transition-transform duration-500 animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-32 left-32 w-40 h-40 border border-cyan-400/20 rounded-2xl transform -rotate-12 animate-pulse"></div>
          </div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Realer Estate</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <Link to="/rent" className="text-gray-300 hover:text-white transition-colors">Infrastructure</Link>
              <Link to="/press" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">About us</Link>
              <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            </div>
            <Link 
              to="/join" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Start Trading
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
              Step into the Future
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                of Real Estate Trading
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 tracking-tight max-w-3xl mx-auto">
              Maximize your potential with a powerful platform built to shape the future of property investment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                to="/join" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg tracking-tight transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transform hover:scale-105"
              >
                Sign Up for Free
              </Link>
              <Link 
                to="/rent" 
                className="border border-gray-600 hover:border-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg tracking-tight transition-all hover:bg-blue-500/10"
              >
                Live Demo
              </Link>
            </div>
          </div>

          {/* 3D Property Elements */}
          <div className="relative">
            {/* Central glowing property icon */}
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl animate-pulse shadow-[0_0_50px_rgba(59,130,246,0.5)]"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center">
                <Home className="w-16 h-16 text-white" />
              </div>
            </div>
            
            {/* Floating property cards - hidden on mobile */}
            <div className="hidden lg:block">
              <div className="absolute left-0 top-0 transform -translate-x-32 -translate-y-16 animate-pulse">
                <div className="bg-black/50 border border-blue-500/30 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-blue-400">$</div>
                  <div className="text-sm text-gray-300">NYC Average</div>
                </div>
              </div>
              
              <div className="absolute right-0 top-0 transform translate-x-32 -translate-y-8 animate-pulse">
                <div className="bg-black/50 border border-cyan-500/30 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-blue-400" />
        </div>
      </section>

      {/* Property Universe Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-4 text-blue-400 font-semibold tracking-wide uppercase text-sm">
            400 NEIGHBORHOODS
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">
            Entire NYC Real Estate Universe
          </h2>
          
          {/* Crypto-style icons representing neighborhoods */}
          <div className="flex justify-center items-center mb-12 flex-wrap gap-6">
            {neighborhoodIcons.map((neighborhood, index) => (
              <div key={index} className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 text-xs font-bold text-gray-300 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-400 hover:scale-110 transition-all">
                  {neighborhood.symbol}
                </div>
              </div>
            ))}
          </div>
          
          {/* Central highlighted property card */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/80 border border-blue-500/50 rounded-3xl p-8 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-pulse">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">Undervalued Properties</div>
                <div className="text-blue-400">Found Daily</div>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-300 mt-12 max-w-3xl mx-auto tracking-tight">
            Experience a comprehensive selection of properties available on our platform. Manage your investments with confidence and enhance your returns with meticulous precision.
          </p>
        </div>
      </section>

      {/* Rotating Listings Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Setting a New Standard
              <br />
              <span className="text-blue-400">in Property Investment</span>
            </h2>
            <p className="text-xl text-gray-300 tracking-tight max-w-3xl mx-auto">
              Our innovative analysis technology delivers unmatched performance, making property investment more effective.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Live Data Panel */}
            <div className="space-y-6">
              <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-white">Live Property Prices</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Manhattan</div>
                        <div className="text-sm text-gray-400">AVG - $3,200/mo</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">0.289472</div>
                      <div className="text-sm text-green-400">+10.55% ↗</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Brooklyn</div>
                        <div className="text-sm text-gray-400">AVG - $2,100/mo</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">857.56283</div>
                      <div className="text-sm text-green-400">+8.67% ↗</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Live Data.</span>
                </div>
                <span>Access up-to-date property prices</span>
              </div>
            </div>

            {/* Featured Property Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-black/80 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Featured Property</h3>
                  <div className="text-sm text-gray-400">Last 28 days ⌄</div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-blue-400">
                    {currentListing.price}
                    <span className="text-lg text-gray-400 ml-2">
                      /month
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-green-400 font-semibold">
                      ↗ {currentListing.savings} saved 
                    </div>
                    <div className="text-sm text-gray-400">
                      (vs market {currentListing.originalPrice})
                    </div>
                  </div>
                  
                  <div className="text-gray-300">
                    {currentListing.address}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">
                      {currentListing.beds} bed • Grade {currentListing.grade}
                    </div>
                    <div className="text-blue-400">
                      {currentListing.neighborhood}
                    </div>
                  </div>

                  {/* Mini chart visualization */}
                  <div className="h-20 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-xl flex items-end justify-center space-x-1 p-2">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="bg-blue-400 w-2 rounded-t transition-all duration-500"
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 text-sm text-gray-400 mt-12">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Advanced Analytics.</span>
            </div>
            <span>Leverage our advanced market analysis</span>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-4">
              DYNAMIC DASHBOARD
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Unlock Revolutionary
              <br />
              <span className="text-blue-400">Trading Technology</span>
            </h2>
            <p className="text-xl text-gray-300 tracking-tight max-w-3xl mx-auto">
              Experience seamless property hunting with our advanced dashboard, designed to provide real-time insights and intuitive control over your portfolio.
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-400/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-black/80 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-sm">
              <img 
                src="/lovable-uploads/0b38338f-4c89-4881-80ff-5d26234b31cc.png" 
                alt="Realer Estate platform showing rental listings" 
                className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tighter">
            The real estate game is rigged. Now you can win.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We analyze the data</h3>
              <p className="text-gray-400 tracking-tight">Real-time scraping of listings and analysis of comps, market trends to identify true value.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We find the hidden gems</h3>
              <p className="text-gray-400 tracking-tight">Advanced algorithms identify undervalued properties you'd never find.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">You save thousands</h3>
              <p className="text-gray-400 tracking-tight">Skip overpriced listings and only see the best deals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Neighborhoods */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Stop overpaying in every neighborhood.
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30 hover:border-blue-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">SoHo</h3>
              <p className="text-gray-400 tracking-tight">Avg $2,100/sqft → Deals from $1,350</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30 hover:border-blue-500/50 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">Bushwick</h3>
              <p className="text-gray-400 tracking-tight">Avg $930/sqft → Deals from $690</p>
            </div>
          </div>
          <Link 
            to="/rent"
            className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold tracking-tight transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          >
            <span>Explore Homes</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="py-20 pb-0 px-4 relative overflow-hidden">
        {/* Blue Gradient Blob Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-600/30 to-blue-800/40"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[800px] md:h-[600px] bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-blue-600/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-64 h-64 md:w-[600px] md:h-[400px] bg-gradient-to-tl from-cyan-500/30 via-blue-400/20 to-blue-500/40 rounded-full blur-2xl"></div>        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Let the house hunt end here.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          <Link 
            to="/join" 
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-xl"
          >
            Join now.
          </Link>
          
          {/* Footer Links */}
          <div className="mt-16 mb-2">
            <div className="flex justify-center space-x-8 text-xs text-gray-400">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;