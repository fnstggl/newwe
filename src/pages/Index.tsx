import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HoverButton } from "@/components/ui/hover-button";
import { useEffect } from "react";

const Index = () => {
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
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org');
  }, []);

  return <div className="font-inter">
      {/* Hero Section */}
<section className="relative min-h-[600px] flex items-center justify-center overflow-hidden px-0 pt-0">        {/* Background Image with Full Width */}
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image with Fade-in Effect */}
          <div 
            className="bg-cover bg-center bg-no-repeat min-h-[600px] absolute inset-0 animate-fade-in w-full h-full"
            style={{
              backgroundImage: `url('/lovable-uploads/2ff24928-306a-4305-9c27-9594098a543d.png')`,
              animationDuration: '3s',
              animationDelay: '0s',
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30"></div>
          </div>
        </div>
          
          {/* Hero Content - Always Visible */}
          <div className="relative z-10 min-h-[600px] flex items-center justify-center">
            <div className="text-center px-4 py-20 max-w-5xl">
              <h1 className="text-5xl md:text-6xl font-inter font-semibold mb-4 tracking-[-0.075em] transform translate-y-[150px] text-white">
                Your unfair advantage in real estate.
              </h1>
              <p className="text-lg md:text-xl mb-16 text-white opacity-80 font-inter font-medium transform translate-y-[150px] tracking-[-0.075em]">
                The best deals in the city—found for you.
              </p>
              <Link to="/rent" className="inline-block bg-white font-inter text-black px-6 py-3 rounded-full font-semibold tracking-tighter transform translate-y-[130px] hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300">
                Start Searching
              </Link>
            </div>
          </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          
        </div>
      </section>

      {/* As Seen On Section */}
   <section className="pt-4 pb-0 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <Link to="/press" className="inline-block hover:opacity-80 transition-opacity duration-300">
            <img 
              src="/lovable-uploads/027a7b47-dd06-44bc-8986-fd48b89c4b6a.png" 
              alt="As seen on CBS, ABC, AP News" 
              className="h-10 mx-auto"
            />
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            It shouldn't be this hard to find a home in NYC.
          </h2>
          <p className="text-xl text-gray-400 tracking-tight max-w-3xl mx-auto">
          Using advanced algorithms based on market data to find you the best undervalued properties in the city.
          </p>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8"></div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tighter">
            The real estate game is rigged. Now you can win. 
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 border border-gray-800 hover:border-transparent hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:ring-2 hover:ring-blue-500/30">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We analyze the data</h3>
              <p className="text-gray-400 tracking-tight">Real-time scraping of listings and analysis of comps, market trends to identify true value.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 border border-gray-800 hover:border-transparent hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:ring-2 hover:ring-blue-500/30">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We find the hidden gems</h3>
              <p className="text-gray-400 tracking-tight">Advanced algorithms identify undervalued properties you'd never find.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 border border-gray-800 hover:border-transparent hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:ring-2 hover:ring-blue-500/30">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">You buy smarter</h3>
              <p className="text-gray-400 tracking-tight">Skip overpriced listings and focus on real opportunities.</p>
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
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">SoHo</h3>
              <p className="text-gray-400 tracking-tight">Avg $2,100/sqft → Deals from $1,350</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">Bushwick</h3>
              <p className="text-gray-400 tracking-tight">Avg $930/sqft → Deals from $690</p>
            </div>
          </div>
          <Link to="/rent">
            <HoverButton className="text-white font-semibold tracking-tight hover:shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-300">
              Explore Homes
            </HoverButton>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 pb-0 px-4 relative overflow-hidden">
        {/* Blue Gradient Blob Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-blue-800/40"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-blue-600/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-[600px] h-[400px] bg-gradient-to-tl from-purple-500/30 via-blue-400/20 to-cyan-500/40 rounded-full blur-2xl"></div>        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Let the house hunt end here.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          <Link to="/join" className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-xl">
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
    </div>;
};

export default Index;
