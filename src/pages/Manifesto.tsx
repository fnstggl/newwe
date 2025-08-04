import { useEffect } from 'react';

const Manifesto = () => {
  useEffect(() => {
    // Update meta tags for SEO
    document.title = "The Real Estate Game is Rigged - Our Manifesto | Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'The NYC real estate game is rigged. Learn how Realer Estate uses advanced algorithms to give buyers an unfair advantage and stop overpaying.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'The NYC real estate game is rigged. Learn how Realer Estate uses advanced algorithms to give buyers an unfair advantage and stop overpaying.';
      document.head.appendChild(meta);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'The Real Estate Game is Rigged - Our Manifesto | Realer Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'The NYC real estate game is rigged. Now you can win with advanced algorithms that find undervalued properties.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org/manifesto');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'The Real Estate Game is Rigged - Our Manifesto | Realer Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'The NYC real estate game is rigged. Now you can win with advanced algorithms that find undervalued properties.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org/manifesto');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org/manifesto');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">
            Finding a home in NYC is rigged.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Now you can win.
            </span>
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            Only see below-market & rent stabilized apartments.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="mb-12">
            <p className="text-xl leading-relaxed mb-6 text-gray-300 tracking-tight">
              New York real estate is broken. Listing prices are inflated. Neighborhood data is hidden. 
              And too many tools were built for brokers—not buyers.
            </p>
            
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8"></div>
            
            <p className="text-xl leading-relaxed mb-6 text-gray-300 tracking-tight">
              Rent is up. Inventory is down. And the platforms built to help you? 
              Weren't built for you. They were built for agents who want to extract maximum commission from every deal.
            </p>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 mb-12 border border-gray-800">
            <h2 className="text-3xl font-bold mb-6 tracking-tighter">
              Using advanced algorithms to find you the best deals in the city.
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed tracking-tight">
              Realer Estate runs advanced models on real listings to find what's undervalued, 
              overlooked, or underpriced. We analyze price per square foot, days on market, 
              comparable sales, and dozens of other data points that brokers don't want you to see.
            </p>
          </div>

          <blockquote className="border-l-4 border-blue-500 pl-8 py-4 mb-12 bg-blue-500/5 rounded-r-xl">
            <p className="text-2xl font-semibold text-blue-400 mb-2 tracking-tight">
              "Finally, a platform that works for buyers, not agents."
            </p>
            <p className="text-gray-400 tracking-tight">
              This isn't guesswork. It's your unfair advantage.
            </p>
          </blockquote>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-3 tracking-tight">The Problem</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="tracking-tight">• Brokers hide the best deals</li>
                <li className="tracking-tight">• Platforms favor sellers over buyers</li>
                <li className="tracking-tight">• Market data is fragmented and biased</li>
                <li className="tracking-tight">• You overpay because you don't know better</li>
              </ul>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-3 tracking-tight">Our Solution</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="tracking-tight">• Real-time market analysis</li>
                <li className="tracking-tight">• Algorithmic deal scoring</li>
                <li className="tracking-tight">• Transparent pricing data</li>
                <li className="tracking-tight">• Built for buyers, not brokers</li>
              </ul>
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/20 mb-12">
            <h2 className="text-3xl font-bold mb-4 tracking-tighter">
              It's time buyers had the edge.
            </h2>
            <p className="text-lg text-gray-300 mb-6 tracking-tight">
              Stop playing a rigged game. Start living affordably with data.
            </p>
            <a 
              href="/join"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight transition-all duration-500 ease-out shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            >
              Join the Movement
            </a>
          </div>

          {/* Disclaimer */}
          <div className="text-center mt-16 pt-8 border-t border-gray-800">
            <p className="text-xs text-gray-500 leading-relaxed">
              Realer Estate is an independent housing search tool. We are not affiliated with or endorsed by StreetEasy, Zillow, or any other listing platform. Our goal is to surface below-market opportunities for NYC renters by analyzing publicly accessible listings and government data sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
