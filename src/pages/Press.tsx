
import { useEffect } from "react";
import { Download } from "lucide-react";
import JSZip from "jszip";

const Press = () => {
  useEffect(() => {
    document.title = "Press & Media Kit - Realer Estate";
  }, []);

  const downloadMediaKit = async () => {
    const zip = new JSZip();
    
    const assets = [
      { url: '/lovable-uploads/3accba2a-bd3d-4027-9758-2462e4b30865.png', name: 'realer-estate-founders.png' },
      { url: '/lovable-uploads/84439388-74a7-4c6d-8fe8-d5cb5f0108e0.png', name: 'realer-estate-platform-screenshot.png' },
      { url: '/lovable-uploads/81dfa622-d136-49f1-bfa2-6cf1e63ee82d.png', name: 'realer-estate-never-overpay.png' },
      { url: '/lovable-uploads/e0856c30-f6b7-49d8-a596-88bdb09cc616.png', name: 'realer-estate-nyc-broken-game.png' },
      { url: '/lovable-uploads/a16979a1-3495-4871-ae83-39233e3ff855.png', name: 'realer-estate-logo-black.png' },
      { url: '/lovable-uploads/af9d7567-403c-454c-b80e-18f8ac3dcd74.png', name: 'realer-estate-logo-white.png' },
      { url: '/lovable-uploads/7a974d99-4ed9-4a37-a0b2-fb6e93c98b41.png', name: 'realer-estate-logo-gradient.png' },
      { url: '/lovable-uploads/1f741d6d-8992-412b-b8d1-e78eb5a8434b.png', name: 'realer-estate-never-overpay-text.png' },
      { url: '/lovable-uploads/bbc73f16-b007-4cb7-be6b-c38f863b85d0.png', name: 'realer-estate-circle-logo-black.png' },
      { url: '/lovable-uploads/80f5f787-48b0-48d6-b1cf-11b051ff1254.png', name: 'realer-estate-circle-logo-white.png' }
    ];

    try {
      // Fetch all images and add to ZIP
      for (const asset of assets) {
        try {
          const response = await fetch(asset.url);
          if (response.ok) {
            const blob = await response.blob();
            zip.file(asset.name, blob);
          }
        } catch (error) {
          console.warn(`Failed to fetch ${asset.name}:`, error);
        }
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'realer-estate-media-kit.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
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
            Reach out at <a href="mailto:info@realerestate.org" className="text-blue-400 hover:text-blue-300">info@realerestate.org</a> for interviews, data, or quotes.
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
              We're two students from Brooklyn who grew up watching friends, family, and neighbors get priced out of the city we love.
            </p>
            <p>
              After seeing first-hand how we were losing our community to rising rents, and a background in real estate & software-dev we built something we wished had existed sooner.
            </p>
            <p>
              Realer Estate is an AI-powered platform that scans NYC listings in real time to surface rent-stabilized and undervalued apartments—before they disappear. It's already helped over 6,000 New Yorkers search for more affordable homes, and we're just getting started.
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
            <div className="text-2xl font-bold mb-2">2 Young founders</div>
            <div className="text-gray-400 text-sm">Redefining the NYC real estate market</div>
          </div>
          <div className="p-6 rounded-xl bg-black/50 border border-gray-800 hover:border-blue-500/40 transition-all">
            <div className="text-2xl font-bold mb-2">6000+ New Yorkers</div>
            <div className="text-gray-400 text-sm">Finding more affordable homes</div>
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
            <div className="text-2xl font-bold mb-2">Free to start</div>
            <div className="text-gray-400 text-sm">Explore deals before paying a dollar</div>
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
                "This is great. In my dreams I am able to move back to NYC and keep checking all the time as rents keep hiking in Philly."
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
        
        {/* Top row - Rectangular images */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="aspect-[16/10] rounded-xl overflow-hidden border border-gray-800">
            <img 
              src="/lovable-uploads/3accba2a-bd3d-4027-9758-2462e4b30865.png" 
              alt="Realer Estate Founders" 
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="aspect-[16/10] rounded-xl overflow-hidden border border-gray-800">
            <img 
              src="/lovable-uploads/84439388-74a7-4c6d-8fe8-d5cb5f0108e0.png" 
              alt="Realer Estate Platform" 
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="aspect-[16/10] rounded-xl overflow-hidden border border-gray-800">
            <img 
              src="/lovable-uploads/e0856c30-f6b7-49d8-a596-88bdb09cc616.png" 
              alt="The NYC real estate game is broken" 
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
        
        {/* Bottom row - Square logos */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          <div className="aspect-square rounded-xl overflow-hidden border border-gray-800 bg-white p-4">
            <img 
              src="/lovable-uploads/a16979a1-3495-4871-ae83-39233e3ff855.png" 
              alt="Realer Estate Black Logo" 
              className="w-full h-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden border border-gray-800 bg-black p-4">
            <img 
              src="/lovable-uploads/af9d7567-403c-454c-b80e-18f8ac3dcd74.png" 
              alt="Realer Estate White Logo" 
              className="w-full h-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="aspect-square">
            <img 
              src="/lovable-uploads/7a974d99-4ed9-4a37-a0b2-fb6e93c98b41.png" 
              alt="Realer Estate Gradient Logo" 
              className="w-full h-full object-contain rounded-xl"
              loading="eager"
              decoding="async"
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
              Reach out to: <a href="mailto:info@realerestate.org" className="text-blue-400 hover:text-blue-300">info@realerestate.org</a>
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
