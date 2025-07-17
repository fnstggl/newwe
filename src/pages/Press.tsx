
import { useEffect } from 'react';
import { Download, Mail, Users, Home, DollarSign, MapPin, Bot, CheckCircle } from 'lucide-react';

const Press = () => {
  useEffect(() => {
    document.title = "Press & Media Kit | Realer Estate";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Press & Media Kit for Realer Estate - AI tool helping New Yorkers find rent-stabilized and undervalued homes.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Press & Media Kit for Realer Estate - AI tool helping New Yorkers find rent-stabilized and undervalued homes.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleDownloadAssets = () => {
    // Create a download for the brand assets
    const link = document.createElement('a');
    link.href = '#'; // This would be replaced with actual ZIP file URL
    link.download = 'realer-estate-brand-assets.zip';
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">
            Press & Media Kit
          </h1>
          <p className="text-xl text-gray-400 mb-6 max-w-4xl mx-auto tracking-tight">
            Everything you need to cover Realer Estate—the AI tool helping New Yorkers find the rent-stabilized and undervalued homes the city missed.
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-6"></div>
          <p className="text-gray-500 text-sm tracking-tight">
            Reach out at <span className="text-blue-400">press@realerestate.org</span> for interviews, data, or quotes.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16 rounded-2xl overflow-hidden">
          <img 
            src="/lovable-uploads/f1b244cd-0b50-4ecb-9d0f-72edabf4fc37.png" 
            alt="Realer Estate founders in NYC" 
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Our Story Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 tracking-tighter">Our Story</h2>
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            <p className="text-lg text-gray-300 leading-relaxed mb-6 tracking-tight">
              We're two high schoolers from Brooklyn who grew up watching friends, family, and neighbors get priced out of the city we love.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-6 tracking-tight">
              After seeing first-hand how we were losing the community we knew to rising rents, and watching helplessly for years, we built something we wished had existed sooner.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed tracking-tight">
              Realer Estate is an AI-powered platform that scans NYC listings in real time to surface rent-stabilized and undervalued apartments—before they disappear. It's already helped over 6,000 New Yorkers save thousands on rent, and we're just getting started.
            </p>
          </div>
        </div>

        {/* At a Glance Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 tracking-tighter">At a Glance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">16</div>
              <div className="text-gray-400 text-sm tracking-tight">Built by a 16-year-old solo founder</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <Home className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">6,000+</div>
              <div className="text-gray-400 text-sm tracking-tight">users served</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <DollarSign className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">$500K+</div>
              <div className="text-gray-400 text-sm tracking-tight">in estimated rent savings surfaced</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">170+</div>
              <div className="text-gray-400 text-sm tracking-tight">NYC zip codes covered</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <Bot className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Real-time</div>
              <div className="text-gray-400 text-sm tracking-tight">AI deal analysis + rent stabilization detection</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 text-center">
              <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">Free</div>
              <div className="text-gray-400 text-sm tracking-tight">Completely free to find undervalued homes</div>
            </div>
          </div>
        </div>

        {/* Real User Reviews Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4 tracking-tighter">Real User Reviews</h2>
          <p className="text-gray-500 text-sm mb-8 tracking-tight">From our reddit</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-300 italic tracking-tight">
                "Thank you so much for making this, I just joined and am loving the smooth interface!"
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-300 italic tracking-tight">
                "I love this tool & what you're doing to help bc it's a real struggle out here"
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-300 italic tracking-tight">
                "I will definitely be using this as I plan my move in the future."
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <p className="text-gray-300 italic tracking-tight">
                "Hi! This is a really great tool, thanks for sharing and creating this."
              </p>
            </div>
          </div>
        </div>

        {/* Media Assets Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 tracking-tighter">Media Assets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <img 
                src="/lovable-uploads/1a2f7e13-9c35-49c1-8304-5b0b1f268378.png" 
                alt="Realer Estate Logo Light" 
                className="w-full h-32 object-contain bg-white rounded-lg mb-4"
              />
              <p className="text-gray-400 text-sm text-center tracking-tight">Logo - Light Background</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <img 
                src="/lovable-uploads/1f9c424f-4f78-4bde-9d22-e39f7d1e36e9.png" 
                alt="Realer Estate Logo Dark" 
                className="w-full h-32 object-contain bg-black rounded-lg mb-4"
              />
              <p className="text-gray-400 text-sm text-center tracking-tight">Logo - Dark Background</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <img 
                src="/lovable-uploads/458c73a5-3438-4f51-9bbd-9e5e23ef6a76.png" 
                alt="Realer Estate App Screenshot" 
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-400 text-sm text-center tracking-tight">App Screenshot</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <img 
                src="/lovable-uploads/f463b4f2-f74d-4d64-bcfc-9cb26e870dc6.png" 
                alt="Realer Estate Brand" 
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-400 text-sm text-center tracking-tight">Brand Asset</p>
            </div>
          </div>
          <div className="text-center">
            <button 
              onClick={handleDownloadAssets}
              className="bg-white text-black px-8 py-4 rounded-full font-semibold tracking-tight transition-all duration-500 ease-out shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download All Assets
            </button>
          </div>
        </div>

        {/* Press Coverage Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 tracking-tighter">Press Coverage</h2>
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800 text-center">
            <p className="text-lg text-gray-300 mb-4 tracking-tight">
              Want to break the story? We're happy to give you a first look.
            </p>
            <p className="text-blue-400 tracking-tight">
              Reach out to: press@realerestate.org
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/20">
          <h2 className="text-2xl font-bold mb-6 tracking-tighter">Press Inquiries</h2>
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-blue-400 mt-1" />
            <div>
              <p className="text-lg font-semibold tracking-tight">Beckett Zahedi</p>
              <p className="text-blue-400 mb-2 tracking-tight">press@realerestate.org</p>
              <p className="text-gray-400 text-sm tracking-tight">
                Available for interviews, founder quotes, and custom data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Press;
