
import { Download, Brain, Home, DollarSign, MapPin, Bot, CheckCircle, Quote } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-button";

const Press = () => {
  const handleDownloadAsset = (assetName: string, imagePath: string) => {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = assetName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllAssets = () => {
    const assets = [
      { name: 'founders-photo.png', path: '/lovable-uploads/597ec888-0d60-4237-b3ad-e13e0b23b4a2.png' },
      { name: 'logo-dark.png', path: '/lovable-uploads/6ab83bc7-31b9-438f-8bf5-ff1ea140706e.png' },
      { name: 'logo-light.png', path: '/lovable-uploads/d7690d75-4cf8-41a1-94ca-0f6327993316.png' },
      { name: 'app-screenshot.png', path: '/lovable-uploads/4172c0c9-1daf-43b3-9922-0bf102f857d3.png' },
      { name: 'brand-tagline.png', path: '/lovable-uploads/a0d7d359-2bb1-4ff0-a7e2-9be36a76ca53.png' }
    ];

    assets.forEach((asset, index) => {
      setTimeout(() => {
        handleDownloadAsset(asset.name, asset.path);
      }, index * 100);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tighter">
            Press & Media Kit
          </h1>
          <p className="text-xl text-gray-300 mb-6 tracking-tight max-w-4xl mx-auto">
            Everything you need to cover Realer Estate—the AI tool helping New Yorkers find the rent-stabilized and undervalued homes the city missed.
          </p>
          <p className="text-gray-400 tracking-tight">
            Reach out at <a href="mailto:press@realerestate.org" className="text-blue-400 hover:text-blue-300 transition-colors">press@realerestate.org</a> for interviews, data, or quotes.
          </p>
        </div>
        
        {/* Featured Image - Smaller */}
        <div className="mb-16 flex justify-center">
          <img 
            src="/lovable-uploads/597ec888-0d60-4237-b3ad-e13e0b23b4a2.png" 
            alt="Realer Estate Founders" 
            className="w-full max-w-2xl rounded-2xl"
          />
        </div>
      </section>

      {/* Clean Blue Gradient Line */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-20"></div>
      </div>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-8 tracking-tight">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            <p>
              We're two high schoolers from Brooklyn who grew up watching friends, family, and neighbors get priced out of the city we love.
            </p>
            <p>
              After seeing first-hand how we were losing the community we knew to rising rents, and watching helplessly for years, we built something we wished had existed sooner.
            </p>
            <p>
              Realer Estate is an AI-powered platform that scans NYC listings in real time to surface rent-stabilized and undervalued apartments—before they disappear. It's already helped over 6,000 New Yorkers save thousands on rent, and we're just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Clean Blue Gradient Line */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-20"></div>
      </div>

      {/* At a Glance Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold mb-12 tracking-tight text-center">At a Glance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-3xl font-bold mb-2">16</div>
            <div className="text-gray-400 text-sm">Built by a 16-year-old solo founder</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold mb-2">6,000+</div>
            <div className="text-gray-400 text-sm">users served</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold mb-2">$500K+</div>
            <div className="text-gray-400 text-sm">in estimated rent savings surfaced</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold mb-2">170+</div>
            <div className="text-gray-400 text-sm">NYC zip codes covered</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold mb-2">Real-time</div>
            <div className="text-gray-400 text-sm">AI deal analysis + rent stabilization detection</div>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-gray-400 text-sm">free to find undervalued homes</div>
          </div>
        </div>
      </section>

      {/* App Screenshot */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <img 
          src="/lovable-uploads/4172c0c9-1daf-43b3-9922-0bf102f857d3.png" 
          alt="Realer Estate App Interface" 
          className="w-full rounded-2xl"
        />
      </section>

      {/* Clean Blue Gradient Line */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-20"></div>
      </div>

      {/* Real User Reviews Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold mb-4 tracking-tight text-center">Real User Reviews</h2>
          <p className="text-gray-400 text-center mb-12">From our reddit</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-black/50 p-6 rounded-xl border border-gray-800">
              <Quote className="w-6 h-6 text-blue-400 mb-4" />
              <p className="text-gray-300 mb-4">"Thank you so much for making this, I just joined and am loving the smooth interface!"</p>
            </div>
            <div className="bg-black/50 p-6 rounded-xl border border-gray-800">
              <Quote className="w-6 h-6 text-blue-400 mb-4" />
              <p className="text-gray-300 mb-4">"I love this tool & what you're doing to help bc it's a real struggle out here"</p>
            </div>
            <div className="bg-black/50 p-6 rounded-xl border border-gray-800">
              <Quote className="w-6 h-6 text-blue-400 mb-4" />
              <p className="text-gray-300 mb-4">"I will definitely be using this as I plan my move in the future."</p>
            </div>
            <div className="bg-black/50 p-6 rounded-xl border border-gray-800">
              <Quote className="w-6 h-6 text-blue-400 mb-4" />
              <p className="text-gray-300 mb-4">"Hi! This is a really great tool, thanks for sharing and creating this."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Tagline Image */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <img 
          src="/lovable-uploads/a0d7d359-2bb1-4ff0-a7e2-9be36a76ca53.png" 
          alt="Never overpay in NYC again" 
          className="w-full max-w-4xl mx-auto"
        />
      </section>

      {/* Clean Blue Gradient Line */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-20"></div>
      </div>

      {/* Media Assets Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold mb-12 tracking-tight text-center">Media Assets</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <img 
              src="/lovable-uploads/597ec888-0d60-4237-b3ad-e13e0b23b4a2.png" 
              alt="Founders Photo" 
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold mb-2">Founders Photo</h3>
            <button 
              onClick={() => handleDownloadAsset('founders-photo.png', '/lovable-uploads/597ec888-0d60-4237-b3ad-e13e0b23b4a2.png')}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <img 
              src="/lovable-uploads/6ab83bc7-31b9-438f-8bf5-ff1ea140706e.png" 
              alt="Logo Dark" 
              className="w-full h-32 object-contain rounded-lg mb-4 bg-gray-800"
            />
            <h3 className="font-semibold mb-2">Logo (Dark)</h3>
            <button 
              onClick={() => handleDownloadAsset('logo-dark.png', '/lovable-uploads/6ab83bc7-31b9-438f-8bf5-ff1ea140706e.png')}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <img 
              src="/lovable-uploads/d7690d75-4cf8-41a1-94ca-0f6327993316.png" 
              alt="Logo Light" 
              className="w-full h-32 object-contain rounded-lg mb-4 bg-white"
            />
            <h3 className="font-semibold mb-2">Logo (Light)</h3>
            <button 
              onClick={() => handleDownloadAsset('logo-light.png', '/lovable-uploads/d7690d75-4cf8-41a1-94ca-0f6327993316.png')}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <img 
              src="/lovable-uploads/4172c0c9-1daf-43b3-9922-0bf102f857d3.png" 
              alt="App Screenshot" 
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold mb-2">App Screenshot</h3>
            <button 
              onClick={() => handleDownloadAsset('app-screenshot.png', '/lovable-uploads/4172c0c9-1daf-43b3-9922-0bf102f857d3.png')}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <img 
              src="/lovable-uploads/a0d7d359-2bb1-4ff0-a7e2-9be36a76ca53.png" 
              alt="Brand Tagline" 
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold mb-2">Brand Tagline</h3>
            <button 
              onClick={() => handleDownloadAsset('brand-tagline.png', '/lovable-uploads/a0d7d359-2bb1-4ff0-a7e2-9be36a76ca53.png')}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>

        <div className="text-center">
          <HoverButton 
            onClick={handleDownloadAllAssets}
            className="text-white font-semibold tracking-tight inline-flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download All Assets
          </HoverButton>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4 tracking-tight">Press Inquiries</h3>
          <p className="text-xl mb-2">Beckett Zahedi</p>
          <p className="text-blue-400 mb-4">
            <a href="mailto:press@realerestate.org" className="hover:text-blue-300 transition-colors">
              press@realerestate.org
            </a>
          </p>
          <p className="text-gray-400 text-sm">
            Available for interviews, founder quotes, and custom data.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Press;
