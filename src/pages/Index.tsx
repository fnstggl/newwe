import { Link } from "react-router-dom";
import { ArrowDown, TrendingUp, MapPin, DollarSign, Home, ChevronRight, Search, Zap, Database, Target } from "lucide-react";
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
    <div className="bg-black text-white min-h-screen font-inter relative overflow-hidden">
      {/* Glassmorphic Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Realer Estate</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm">
            <Link to="/rent" className="text-gray-300 hover:text-white transition-all hover:scale-105">Browse Deals</Link>
            <Link to="/press" className="text-gray-300 hover:text-white transition-all hover:scale-105">Success Stories</Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-all hover:scale-105">Pricing</Link>
          </div>
          <Link 
            to="/join" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105"
          >
            Get Access
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
          
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Data visualization overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(59,130,246,0.05)_50%,transparent_100%)] animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          {/* Hero Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live scanning {scanningCount.toLocaleString()} listings</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-none">
              We cracked the
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                NYC housing code
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Advanced algorithms analyze thousands of listings every hour to find properties priced <span className="text-blue-400 font-semibold">below market value</span>. Stop overpaying for rent in NYC.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link 
                to="/join" 
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2"
              >
                <span>Find My Deal</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/rent" 
                className="group bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:bg-white/10 flex items-center space-x-2"
              >
                <span>See Live Deals</span>
                <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Live Deal Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Live Deal Found</span>
                </div>
                <div className="text-sm text-gray-400">2 minutes ago</div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-2xl font-bold text-white mb-2">{featuredDeals[currentDeal].ourPrice}</div>
                  <div className="text-sm text-gray-400">{featuredDeals[currentDeal].address}</div>
                  <div className="text-sm text-blue-400">{featuredDeals[currentDeal].type}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg text-gray-300 line-through mb-1">{featuredDeals[currentDeal].marketPrice}</div>
                  <div className="text-2xl font-bold text-green-400">Save {featuredDeals[currentDeal].savings}</div>
                  <div className="text-sm text-gray-400">vs market rate</div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-400 mb-1">{featuredDeals[currentDeal].confidence} confidence</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-green-400 h-2 rounded-full transition-all duration-1000" style={{width: featuredDeals[currentDeal].confidence}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ArrowDown className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </section>

      {/* Data Visualization Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              How we find
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                hidden deals
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI scans every listing, analyzes comparable sales, and identifies pricing anomalies in real-time.
            </p>
          </div>

          {/* Data Flow Visualization */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Data Ingestion</h3>
                <p className="text-gray-300 mb-6">Continuously scan 50+ listing sources across all NYC boroughs</p>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-400">{scanningCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Listings scanned today</div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
                <p className="text-gray-300 mb-6">Compare against 2M+ historical transactions to identify undervalued properties</p>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-purple-400">97.3%</div>
                  <div className="text-sm text-gray-400">Prediction accuracy</div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Deal Discovery</h3>
                <p className="text-gray-300 mb-6">Surface only properties priced 15%+ below market value</p>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-green-400">{dealsFound}</div>
                  <div className="text-sm text-gray-400">Deals found this week</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Live Market Intelligence</h3>
                <p className="text-gray-300">Real-time view of our scanning engine in action</p>
              </div>
              
              {/* Dashboard mockup */}
              <div className="bg-black/60 rounded-2xl p-6">
                <img 
                  src="/lovable-uploads/0b38338f-4c89-4881-80ff-5d26234b31cc.png" 
                  alt="Realer Estate dashboard showing live deal scanning" 
                  className="w-full rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-900/50 to-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-16 tracking-tight">
            The real estate game is rigged.
            <br />
            <span className="text-blue-400">Now you can win.</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">We analyze the data</h3>
              <p className="text-gray-300">Real-time scraping of listings and analysis of comps, market trends to identify true value.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">We find the hidden gems</h3>
              <p className="text-gray-300">Advanced algorithms identify undervalued properties you'd never find on your own.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">You save thousands</h3>
              <p className="text-gray-300">Skip overpriced listings and only see the best deals the market has to offer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-blue-800/40"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[800px] md:h-[600px] bg-gradient-to-br from-blue-500/40 via-purple-400/30 to-blue-600/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-64 h-64 md:w-[600px] md:h-[400px] bg-gradient-to-tl from-purple-500/30 via-blue-400/20 to-blue-500/40 rounded-full blur-2xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Stop overpaying.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Start saving.
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of New Yorkers who found their perfect apartment for less.
          </p>
          
          <Link 
            to="/join" 
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
          >
            <span>Find My Deal Now</span>
            <ChevronRight className="w-6 h-6" />
          </Link>
          
          <div className="mt-16 mb-8">
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
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