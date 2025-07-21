
import { useEffect } from "react";
import { Download } from "lucide-react";

const Press = () => {
  useEffect(() => {
    document.title = "Press & Media Kit - Realer Estate";
  }, []);

  const downloadMediaKit = () => {
    // Download individual assets since ZIP wasn't working
    const assets = [
      '/lovable-uploads/5bd91eba-07b5-420f-9c56-19a7fc519ef1.png',
      '/lovable-uploads/14a45727-4f05-4b01-b610-9d59c0c8b88b.png',
      '/lovable-uploads/882a1425-67b1-4f1e-873e-5986b3fc6a34.png',
      '/lovable-uploads/8496bb74-c4bc-498a-b89b-80b944a6c7fa.png',
      '/lovable-uploads/a16979a1-3495-4871-ae83-39233e3ff855.png',
      '/lovable-uploads/af9d7567-403c-454c-b80e-18f8ac3dcd74.png'
    ];
    
    assets.forEach((asset, index) => {
      const link = document.createElement('a');
      link.href = asset;
      link.download = `realer-estate-asset-${index + 1}.png`;
      link.click();
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tighter">
            Press & Media Kit
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto tracking-tight">
            Everything you need to cover Realer Estate—the AI tool helping New Yorkers find the rent-stabilized and undervalued homes the city missed.
          </p>
          <p className="text-gray-400 text-sm tracking-tight">
            Reach out at <a href="mailto:press@realerestate.org" className="text-blue-400 hover:text-blue-300">press@realerestate.org</a> for interviews, data, or quotes.
          </p>
        </div>
        
        {/* Blue Gradient Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 tracking-tighter text-center">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              We're two high schoolers from Brooklyn who grew up watching friends, family, and neighbors get priced out of the city we love.
            </p>
            <p>
              After seeing first-hand how we were losing our community to rising rents, we built something we wished had existed sooner.
            </p>
            <p>
              Realer Estate is an AI-powered platform that scans NYC listings in real time to surface rent-stabilized and undervalued apartments—before they disappear. It's already helped over 6,000 New Yorkers save thousands on rent, and we're just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* At a Glance Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 tracking-tighter text-center">
          At a Glance
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-black/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <div className="text-2xl font-bold mb-2">16-year-old solo founder</div>
            <div className="text-gray-400 text-sm">Building the future of real estate</div>
          </div>
          <div className="p-6 rounded-xl bg-black/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <div className="text-2xl font-bold mb-2">6,000+ users served</div>
            <div className="text-gray-400 text-sm">And growing every day</div>
          </div>
          <div className="p-6 rounded-xl bg-black/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <div className="text-2xl font-bold mb-2">$500K+ rent savings surfaced</div>
            <div className="text-gray-400 text-sm">Real money back in pockets</div>
          </div>
          <div className="p-6 rounded-xl bg-black/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <div className="text-2xl font-bold mb-2">170+ NYC zip codes</div>
            <div className="text-gray-400 text-sm">Comprehensive city coverage</div>
          </div>
          <div className="p-6 rounded-xl bg-black/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <div className="text-2xl font-bold mb-2">Real-time AI detection</div>
            <div className="text-gray-400 text-sm">Deal & rent stabilization analysis</div>
          </div>
          <div className="p-6 rounded-xl bg-black/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <div className="text-2xl font-bold mb-2">100% free to find homes</div>
            <div className="text-gray-400 text-sm">No hidden costs or barriers</div>
          </div>
        </div>
      </section>

      {/* Real User Reviews Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tighter text-center">
            Real User Reviews
          </h2>
          <p className="text-gray-400 text-center mb-12">From our Reddit</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-black/50 border border-gray-800">
              <p className="text-gray-300 italic">
                "Thank you so much for making this, I just joined and am loving the smooth interface!"
              </p>
            </div>
            <div className="p-6 rounded-xl bg-black/50 border border-gray-800">
              <p className="text-gray-300 italic">
                "I love this tool & what you're doing to help bc it's a real struggle out here"
              </p>
            </div>
            <div className="p-6 rounded-xl bg-black/50 border border-gray-800">
              <p className="text-gray-300 italic">
                "I will definitely be using this as I plan my move in the future."
              </p>
            </div>
            <div className="p-6 rounded-xl bg-black/50 border border-gray-800">
              <p className="text-gray-300 italic">
                "Hi! This is a really great tool, thanks for sharing and creating this."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Assets Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12 tracking-tighter text-center">
          Media Kit
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Founder Photo - rectangular */}
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-800">
            <img 
              src="/lovable-uploads/5bd91eba-07b5-420f-9c56-19a7fc519ef1.png" 
              alt="Realer Estate Founders" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Platform Screenshot - rectangular */}
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-800">
            <img 
              src="/lovable-uploads/882a1425-67b1-4f1e-873e-5986b3fc6a34.png" 
              alt="Realer Estate Platform" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Tagline Image - rectangular */}
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-800">
            <img 
              src="/lovable-uploads/8496bb74-c4bc-498a-b89b-80b944a6c7fa.png" 
              alt="Realer Estate Tagline" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Logo - square */}
          <div className="aspect-square rounded-xl overflow-hidden border border-gray-800">
            <img 
              src="/lovable-uploads/14a45727-4f05-4b01-b610-9d59c0c8b88b.png" 
              alt="Realer Estate Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Black Logo - square */}
          <div className="aspect-square rounded-xl overflow-hidden border border-gray-800 bg-white p-8">
            <img 
              src="/lovable-uploads/a16979a1-3495-4871-ae83-39233e3ff855.png" 
              alt="Realer Estate Black Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {/* White Logo - square */}
          <div className="aspect-square rounded-xl overflow-hidden border border-gray-800 bg-black p-8">
            <img 
              src="/lovable-uploads/af9d7567-403c-454c-b80e-18f8ac3dcd74.png" 
              alt="Realer Estate White Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="text-center">
          <button 
            onClick={downloadMediaKit}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold tracking-tight transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            <Download size={20} />
            Download All Assets
          </button>
        </div>
      </section>

      {/* Press Coverage Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 tracking-tighter">
            Press Coverage
          </h2>
          <div className="p-12 rounded-xl bg-black/50 border border-gray-800">
            <p className="text-xl text-gray-300 mb-4">
              Want to break the story? We're happy to give you a first look.
            </p>
            <p className="text-gray-400">
              Reach out to: <a href="mailto:press@realerestate.org" className="text-blue-400 hover:text-blue-300">press@realerestate.org</a>
            </p>
          </div>
        </div>
      </section>

      {/* Blue Gradient Line at bottom */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8"></div>
    </div>
  );
};

export default Press;
