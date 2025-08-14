import { Link } from "react-router-dom";
import { ArrowDown, TrendingUp, MapPin, DollarSign, Home, ChevronRight, Search, Zap, Database, Target, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import TestimonialsSection from "@/components/TestimonialsSection";

const Index = () => {
  const [scanningCount, setScanningCount] = useState(47832);
  const [dealsFound, setDealsFound] = useState(127);
  const [isVisible, setIsVisible] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(0);

  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Realer Estate - Your Unfair Advantage in NYC Real Estate | Find Undervalued Properties";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org');

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent.');
    
    setIsVisible(true);
    
    // Animate scanning counter
    const scanInterval = setInterval(() => {
      setScanningCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);

    // Animate deals counter  
    const dealInterval = setInterval(() => {
      setDealsFound(prev => prev + Math.floor(Math.random() * 2));
    }, 4000);

    // Rotate featured deals
    const dealRotation = setInterval(() => {
      setCurrentDeal(prev => (prev + 1) % 3);
    }, 5000);

    return () => {
      clearInterval(scanInterval);
      clearInterval(dealInterval);
      clearInterval(dealRotation);
    };
  }, []);

  const featuredDeals = [
    {
      address: "456 E 14th St, East Village",
      marketPrice: "$4,200",
      ourPrice: "$3,100",
      savings: "$1,100",
      confidence: "96%",
      type: "1BR"
    },
    {
      address: "89 Mott St, NoLita", 
      marketPrice: "$3,800",
      ourPrice: "$2,950",
      savings: "$850",
      confidence: "94%",
      type: "Studio"
    },
    {
      address: "234 Grand St, LES",
      marketPrice: "$4,500", 
      ourPrice: "$3,400",
      savings: "$1,100",
      confidence: "97%",
      type: "1BR"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-inter">
      {/* Clean Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold">Realer Estate</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link to="/rent" className="text-gray-300 hover:text-white transition-colors">Browse Deals</Link>
            <Link to="/press" className="text-gray-300 hover:text-white transition-colors">Success Stories</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
          </div>
          <Link 
            to="/join" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition-all"
          >
            Get Access
          </Link>
        </div>
      </nav>

      {/* Hero Section - Clean & Minimal */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Subtle background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/20"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Status indicator */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-300 mb-12">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Live scanning {scanningCount.toLocaleString()} listings</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
              We cracked the
              <br />
              <span className="text-blue-500">NYC housing code</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed">
              Advanced algorithms analyze thousands of listings every hour to find properties priced <span className="text-white font-medium">below market value</span>. Stop overpaying for rent in NYC.
            </p>

            {/* Clean CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link 
                to="/join" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center space-x-2"
              >
                <span>Find My Deal</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/rent" 
                className="border border-gray-700 hover:border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:bg-gray-900"
              >
                See Live Deals
              </Link>
            </div>
          </div>

          {/* Clean deal preview */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium">Live Deal Found</span>
                </div>
                <div className="text-sm text-gray-400">2 minutes ago</div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">{featuredDeals[currentDeal].ourPrice}</div>
                  <div className="text-gray-400 mb-1">{featuredDeals[currentDeal].address}</div>
                  <div className="text-blue-400 text-sm">{featuredDeals[currentDeal].type}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-gray-400 line-through mb-1">{featuredDeals[currentDeal].marketPrice}</div>
                  <div className="text-2xl font-bold text-green-400">Save {featuredDeals[currentDeal].savings}</div>
                  <div className="text-gray-500 text-sm">vs market rate</div>
                </div>
                
                <div className="text-right">
                  <div className="text-blue-400 font-medium mb-2">{featuredDeals[currentDeal].confidence} confidence</div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{width: featuredDeals[currentDeal].confidence}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ArrowDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* How It Works - Ultra Clean */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              How we find
              <br />
              <span className="text-blue-500">hidden deals</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI scans every listing, analyzes comparable sales, and identifies pricing anomalies in real-time.
            </p>
          </div>

          {/* Clean 3-step process */}
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Data Ingestion</h3>
              <p className="text-gray-400 mb-6">Continuously scan 50+ listing sources across all NYC boroughs</p>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">{scanningCount.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Listings scanned today</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
              <p className="text-gray-400 mb-6">Compare against 2M+ historical transactions to identify undervalued properties</p>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">97.3%</div>
                <div className="text-sm text-gray-500">Prediction accuracy</div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Deal Discovery</h3>
              <p className="text-gray-400 mb-6">Surface only properties priced 15%+ below market value</p>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">{dealsFound}</div>
                <div className="text-sm text-gray-500">Deals found this week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Dashboard Section */}
      <section className="py-32 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Live Market Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time view of our scanning engine in action
            </p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
            <img 
              src="/lovable-uploads/0b38338f-4c89-4881-80ff-5d26234b31cc.png" 
              alt="Realer Estate dashboard showing live deal scanning" 
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Clean Benefits Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-8">
              The real estate game is rigged.
              <br />
              <span className="text-blue-500">Now you can win.</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <TrendingUp className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">We analyze the data</h3>
              <p className="text-gray-400">Real-time scraping of listings and analysis of comps, market trends to identify true value.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <Search className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">We find the hidden gems</h3>
              <p className="text-gray-400">Advanced algorithms identify undervalued properties you'd never find on your own.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
              <DollarSign className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">You save thousands</h3>
              <p className="text-gray-400">Skip overpriced listings and only see the best deals the market has to offer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA - Clean */}
      <section className="py-32 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-8">
            Stop overpaying.
            <br />
            <span className="text-blue-500">Start saving.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of New Yorkers who found their perfect apartment for less.
          </p>
          
          <Link 
            to="/join" 
            className="inline-flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white px-12 py-5 rounded-xl font-semibold text-xl transition-all"
          >
            <span>Find My Deal Now</span>
            <ChevronRight className="w-6 h-6" />
          </Link>
          
          <div className="mt-16">
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link to="/press" className="hover:text-gray-300 transition-colors">Press</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;