import { useEffect } from "react";
import { Download, Mail, Calendar, Users, DollarSign, MapPin, Clock, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-light mb-4 tracking-tight">
              Press &amp; Media Kit
            </h1>
            <div className="w-24 h-px bg-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
              AI-powered platform helping New Yorkers find rent-stabilized and undervalued homes
            </p>
          </div>
        </div>
      </header>

      {/* Quick Facts */}
      <section className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-light mb-12 text-center tracking-wide text-gray-200">
            QUICK FACTS
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-light mb-2">21,000+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-light mb-2">$500K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Rent Savings Surfaced</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-light mb-2">170+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">NYC Zip Codes</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 mb-4">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-3xl font-light mb-2">Real-time</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">AI Detection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-center tracking-wide">
            COMPANY OVERVIEW
          </h2>
          <div className="space-y-8 text-lg leading-relaxed text-gray-300">
            <p className="text-xl font-light text-white first-letter:text-6xl first-letter:font-thin first-letter:text-blue-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              ounded by two Brooklyn natives, Realer Estate emerged from a personal mission to combat NYC's housing affordability crisis. After witnessing friends, family, and neighbors systematically priced out of their communities, the founders leveraged their backgrounds in real estate and software development to create a solution.
            </p>
            <p>
              The platform employs advanced AI algorithms to scan New York City rental listings in real-time, identifying rent-stabilized apartments and undervalued properties before they disappear from the market. This technology-driven approach has already facilitated over $500,000 in rent savings for New Yorkers.
            </p>
            <p>
              With comprehensive coverage across 170+ NYC zip codes and a growing user base of 21,000+ New Yorkers, Realer Estate represents a new paradigm in affordable housing discovery—one that puts sophisticated market analysis tools directly in the hands of everyday renters.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-center tracking-wide">
            LEADERSHIP
          </h2>
          <div className="text-center">
            <div className="inline-block p-8 rounded-2xl bg-black/50 border border-gray-800">
              <div className="text-2xl font-light mb-2">Two Young Founders</div>
              <div className="text-gray-400 font-light">Brooklyn natives with backgrounds in real estate and software development</div>
              <div className="mt-4 text-sm text-gray-500">Available for interviews and commentary</div>
            </div>
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-center tracking-wide">
            MEDIA ASSETS
          </h2>
          
          {/* High-res Images */}
          <div className="mb-12">
            <h3 className="text-xl font-light mb-6 text-gray-300 uppercase tracking-wider">High-Resolution Images</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="relative group">
                <div className="aspect-[16/10] rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
                  <img 
                    src="/lovable-uploads/3accba2a-bd3d-4027-9758-2462e4b30865.png" 
                    alt="Realer Estate Founders" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">Company Founders</p>
              </div>
              <div className="relative group">
                <div className="aspect-[16/10] rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
                  <img 
                    src="/lovable-uploads/84439388-74a7-4c6d-8fe8-d5cb5f0108e0.png" 
                    alt="Realer Estate Platform" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">Platform Interface</p>
              </div>
              <div className="relative group">
                <div className="aspect-[16/10] rounded-lg overflow-hidden border border-gray-800 bg-gray-900">
                  <img 
                    src="/lovable-uploads/e0856c30-f6b7-49d8-a596-88bdb09cc616.png" 
                    alt="NYC Housing Market Analysis" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">Market Analysis</p>
              </div>
            </div>
          </div>

          {/* Brand Assets */}
          <div className="mb-12">
            <h3 className="text-xl font-light mb-6 text-gray-300 uppercase tracking-wider">Brand Assets</h3>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-800 bg-white p-4">
                <img 
                  src="/lovable-uploads/a16979a1-3495-4871-ae83-39233e3ff855.png" 
                  alt="Logo - Black" 
                  className="w-full h-full object-contain"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">Black Logo</p>
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-800 bg-black p-4">
                <img 
                  src="/lovable-uploads/af9d7567-403c-454c-b80e-18f8ac3dcd74.png" 
                  alt="Logo - White" 
                  className="w-full h-full object-contain"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">White Logo</p>
              </div>
              <div className="aspect-square">
                <img 
                  src="/lovable-uploads/7a974d99-4ed9-4a37-a0b2-fb6e93c98b41.png" 
                  alt="Logo - Gradient" 
                  className="w-full h-full object-contain rounded-lg"
                />
                <p className="text-xs text-gray-400 mt-2 text-center">Gradient Logo</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={downloadMediaKit}
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-light tracking-wide transition-all uppercase text-sm"
            >
              <Download size={18} />
              Download Complete Media Kit
            </button>
            <p className="text-xs text-gray-500 mt-3">ZIP file includes all logos, images, and brand assets in high resolution</p>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-center tracking-wide">
            USER TESTIMONIALS
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="p-6 border-l-4 border-blue-500 bg-black/30">
              <p className="text-lg font-light italic text-gray-300 mb-4">
                "This is great. In my dreams I am able to move back to NYC and keep checking all the time as rents keep hiking in Philly."
              </p>
              <cite className="text-sm text-gray-500">— Reddit User</cite>
            </blockquote>
            <blockquote className="p-6 border-l-4 border-blue-500 bg-black/30">
              <p className="text-lg font-light italic text-gray-300 mb-4">
                "I love this tool &amp; what you're doing to help bc it's a real struggle out here"
              </p>
              <cite className="text-sm text-gray-500">— Reddit User</cite>
            </blockquote>
            <blockquote className="p-6 border-l-4 border-blue-500 bg-black/30">
              <p className="text-lg font-light italic text-gray-300 mb-4">
                "I will definitely be using this as I plan my move in the future."
              </p>
              <cite className="text-sm text-gray-500">— Reddit User</cite>
            </blockquote>
            <blockquote className="p-6 border-l-4 border-blue-500 bg-black/30">
              <p className="text-lg font-light italic text-gray-300 mb-4">
                "Hi! This is a really great tool, thanks for sharing and creating this."
              </p>
              <cite className="text-sm text-gray-500">— Reddit User</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-center tracking-wide">
            PRESS CONTACT
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-6">
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-light mb-2">Media Inquiries</h3>
              <p className="text-gray-400 mb-4">For interviews, quotes, and story development</p>
              <a 
                href="mailto:info@realerestate.org" 
                className="inline-block text-blue-400 hover:text-blue-300 font-light tracking-wide"
              >
                info@realerestate.org
              </a>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-light mb-2">Interview Availability</h3>
              <p className="text-gray-400 mb-4">Founders available for interviews and expert commentary</p>
              <p className="text-green-400 font-light">Usually respond within 24 hours</p>
            </div>
          </div>
          
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-800">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-light mb-4">Breaking News Opportunity</h3>
              <p className="text-lg text-gray-300 font-light leading-relaxed">
                Be the first to cover how AI is revolutionizing affordable housing discovery in NYC. 
                We're ready to provide exclusive access, data insights, and founder interviews.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
