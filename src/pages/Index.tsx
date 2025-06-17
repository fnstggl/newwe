import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
const Index = () => {
  return <div className="font-inter">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden p-8">
        {/* Background Image with Rounded Border */}
        <div className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden">
          <div className="bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center" style={{
          backgroundImage: `url('/lovable-uploads/2ff24928-306a-4305-9c27-9594098a543d.png')`
        }}>
            <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
            
            {/* Hero Content */}
            <div className="relative z-10 text-left px-12 py-20 max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-semibold mb-4 tracking-tighter text-white my-0 -bottom-40 ">
                get the best deal in the city.
              </h1>
              <p className="text-4xl md:text-5xl mb-16 text-white font-playfair italic font-medium tracking-tighter">
                actually.
              </p>
              <Link to="/search" className="inline-block bg-white text-black px-6 py-3 rounded-full font-semibold-bottom-40 hover:-bottom-40 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                Start Searching
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-white/60" />
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            It shouln't be this hard to find a home in New York.
          </h2>
          <p className="text-xl text-gray-400 tracking-tight max-w-3xl mx-auto">
            We use advanced algorithms based on market data to find you the hidden gems. Save your time, money and peace of mind.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tighter">
            Using comprehensive data to find you the <em>best </em> home. 
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800 hover:border-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:ring-2 hover:ring-blue-500/30">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We analyze the data</h3>
              <p className="text-gray-400 tracking-tight">Real-time scraping of listings with price history and market trends.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800 hover:border-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:ring-2 hover:ring-blue-500/30">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">We flag the real deals</h3>
              <p className="text-gray-400 tracking-tight">Advanced algorithms identify undervalued properties you'd never find.</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-black/50 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-800 hover:border-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:ring-2 hover:ring-blue-500/30">
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
          <Link to="/neighborhoods" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold tracking-tight hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-300 shadow-xl">
            Explore Neighborhoods
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
              Real estate is all about speed.
            </h2>
            <p className="text-xl text-gray-400 tracking-tight">
              The best deals disappear in minutes. Get notified first.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-black/50 rounded-2xl p-8 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">Free</h3>
              <p className="text-4xl font-semibold mb-6 tracking-tight">$0</p>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  See all listings
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  Basic deal scores
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  Neighborhood data
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  Search and filter
                </li>
              </ul>
              <button className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium tracking-tight hover:bg-gray-700 transition-all">
                Get Started
              </button>
            </div>

            {/* Early Bird Plan */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium tracking-tight">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">Early Bird</h3>
              <p className="text-4xl font-semibold mb-6 tracking-tight">$29<span className="text-lg text-gray-400">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  Everything in Free
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  <strong className="text-white">INSTANT email alerts</strong>
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  New deals within 60 seconds
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  Advanced deal analysis
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-green-400 mr-3">•</span>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium tracking-tight hover:from-blue-500 hover:to-purple-500 transition-all">
                Start Early Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Don't overpay. Ever again.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          <Link to="/join" className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl">
            Join now.
          </Link>
        </div>
      </section>
    </div>;
};
export default Index;