
import { Download, Brain, Home, DollarSign, MapPin, Bot, CheckCircle, Quote } from "lucide-react";
import { useEffect } from "react";

const Press = () => {
  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Press & Media Kit - Realer Estate";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Press kit for Realer Estate - the AI tool helping New Yorkers find rent-stabilized and undervalued homes. Media assets, founder story, and press inquiries.');
    }
  }, []);

  const downloadAsset = (imagePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAssets = () => {
    const assets = [
      { path: '/lovable-uploads/519cb6ae-15cc-487d-9d5d-4df52618a8a0.png', name: 'founders-photo.png' },
      { path: '/lovable-uploads/fb04262f-6d9a-4714-afd1-28d0844df009.png', name: 'logo-white-on-dark.png' },
      { path: '/lovable-uploads/5a914ef9-ce26-4150-8d2d-2cff2b472587.png', name: 'logo-black-on-white.png' },
      { path: '/lovable-uploads/01a1349a-6921-4419-b7bf-834b8e2cbd1c.png', name: 'product-screenshot.png' },
      { path: '/lovable-uploads/8985583a-f4a4-44c8-83fd-752e42cbcb88.png', name: 'brand-tagline.png' }
    ];

    assets.forEach(asset => {
      setTimeout(() => downloadAsset(asset.path, asset.name), 100);
    });
  };

  const stats = [
    { icon: Brain, number: "16-year-old", description: "solo founder" },
    { icon: Home, number: "6,000+", description: "users served" },
    { icon: DollarSign, number: "$500K+", description: "in estimated rent savings surfaced" },
    { icon: MapPin, number: "170+", description: "NYC zip codes covered" },
    { icon: Bot, number: "Real-time", description: "AI deal analysis + rent stabilization detection" },
    { icon: CheckCircle, number: "Completely free", description: "to find undervalued homes" }
  ];

  const reviews = [
    "Thank you so much for making this, I just joined and am loving the smooth interface!",
    "I love this tool & what you're doing to help bc it's a real struggle out here",
    "I will definitely be using this as I plan my move in the future.",
    "Hi! This is a really great tool, thanks for sharing and creating this."
  ];

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Hero Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tighter">
            Press & Media Kit
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto tracking-tight">
            Everything you need to cover Realer Estate—the AI tool helping New Yorkers find the rent-stabilized and undervalued homes the city missed.
          </p>
          <p className="text-lg text-gray-400 tracking-tight">
            Reach out at <a href="mailto:press@realerestate.org" className="text-blue-400 hover:text-blue-300 transition-colors">press@realerestate.org</a> for interviews, data, or quotes.
          </p>
        </div>
      </section>

      {/* Founder Photo */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/519cb6ae-15cc-487d-9d5d-4df52618a8a0.png" 
            alt="Realer Estate Founders" 
            className="rounded-2xl max-w-2xl w-full shadow-2xl"
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold mb-12 tracking-tighter text-center">
            Our Story
          </h2>
          <div className="text-xl leading-relaxed text-gray-300 space-y-6">
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

      {/* At a Glance Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tighter">
            At a Glance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-black/50 border border-gray-800">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-blue-400" />
                <div className="text-2xl font-bold mb-2 tracking-tight">{stat.number}</div>
                <div className="text-gray-400 tracking-tight">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real User Reviews */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tighter">
            Real User Reviews
          </h2>
          <p className="text-gray-400 tracking-tight">From our reddit</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="p-6 rounded-xl bg-gray-900/50 border border-gray-700">
              <Quote className="w-5 h-5 text-blue-400 mb-3" />
              <p className="text-gray-300 italic tracking-tight">{review}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Screenshot */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/01a1349a-6921-4419-b7bf-834b8e2cbd1c.png" 
            alt="Realer Estate Product Screenshot" 
            className="rounded-2xl max-w-4xl w-full shadow-2xl"
          />
        </div>
      </section>

      {/* Media Assets Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tighter">
            Media Assets
          </h2>
          
          <div className="text-center mb-12">
            <button
              onClick={downloadAllAssets}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download All Assets
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-black rounded-lg p-4 mb-4">
                <img 
                  src="/lovable-uploads/fb04262f-6d9a-4714-afd1-28d0844df009.png" 
                  alt="Logo - White on Dark" 
                  className="w-full"
                />
              </div>
              <button
                onClick={() => downloadAsset('/lovable-uploads/fb04262f-6d9a-4714-afd1-28d0844df009.png', 'logo-white-on-dark.png')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Logo - White on Dark
              </button>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-lg p-4 mb-4">
                <img 
                  src="/lovable-uploads/5a914ef9-ce26-4150-8d2d-2cff2b472587.png" 
                  alt="Logo - Black on White" 
                  className="w-full"
                />
              </div>
              <button
                onClick={() => downloadAsset('/lovable-uploads/5a914ef9-ce26-4150-8d2d-2cff2b472587.png', 'logo-black-on-white.png')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Logo - Black on White
              </button>
            </div>

            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <img 
                  src="/lovable-uploads/519cb6ae-15cc-487d-9d5d-4df52618a8a0.png" 
                  alt="Founders Photo" 
                  className="w-full rounded"
                />
              </div>
              <button
                onClick={() => downloadAsset('/lovable-uploads/519cb6ae-15cc-487d-9d5d-4df52618a8a0.png', 'founders-photo.png')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Founders Photo
              </button>
            </div>

            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <img 
                  src="/lovable-uploads/8985583a-f4a4-44c8-83fd-752e42cbcb88.png" 
                  alt="Brand Tagline" 
                  className="w-full"
                />
              </div>
              <button
                onClick={() => downloadAsset('/lovable-uploads/8985583a-f4a4-44c8-83fd-752e42cbcb88.png', 'brand-tagline.png')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Brand Tagline
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Press Coverage Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-12 tracking-tighter">
            Press Coverage
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-300 mb-6">
              Want to break the story? We're happy to give you a first look.
            </p>
            <p className="text-lg text-gray-400">
              Reach out to: <a href="mailto:press@realerestate.org" className="text-blue-400 hover:text-blue-300 transition-colors">press@realerestate.org</a>
            </p>
          </div>
          {/* Space reserved for future press logos and coverage */}
          <div className="mt-16 h-32 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Press coverage will appear here</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-black/50 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Press Inquiries</h3>
            <p className="text-xl text-gray-300 mb-2">Beckett Zahedi</p>
            <a 
              href="mailto:press@realerestate.org" 
              className="text-blue-400 hover:text-blue-300 text-lg mb-4 inline-block transition-colors"
            >
              press@realerestate.org
            </a>
            <p className="text-gray-400 tracking-tight">
              Available for interviews, founder quotes, and custom data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
