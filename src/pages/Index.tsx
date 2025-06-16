
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";

const Index = () => {
  return (
    <div className="font-inter">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/5e42fa10-5e18-49d7-9f0c-e0a532d07973.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter">
            your unfair advantage.
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 tracking-tight">
            know you're getting the best deal in the city—always.
          </p>
          <Link 
            to="/search"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Start Searching
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-white/60" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
            New York is broken.
          </h2>
          <p className="text-xl text-gray-400 tracking-tight max-w-3xl mx-auto">
            We scrape it, rank it, and show you what's actually a deal.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tighter">
            Using advanced algorithms to find you the BEST home.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We analyze the data</h3>
              <p className="text-gray-400 tracking-tight">Real-time scraping of listings with price history and market trends.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We flag the real deals</h3>
              <p className="text-gray-400 tracking-tight">Advanced algorithms identify undervalued properties you'd never find.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">You buy smarter</h3>
              <p className="text-gray-400 tracking-tight">Skip overpriced listings and focus on real opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Neighborhoods */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
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
          <Link 
            to="/neighborhoods"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold tracking-tight hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Explore Neighborhoods
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
            Don't overpay. Ever again.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          <Link 
            to="/join"
            className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl animate-pulse-glow"
          >
            Join the Waitlist
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
