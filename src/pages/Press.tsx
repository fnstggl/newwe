
import { Link } from "react-router-dom";
import { Download, Brain, Home, DollarSign, MapPin, Bot, CheckCircle, Quote } from "lucide-react";
import { useEffect } from "react";

const Press = () => {
  useEffect(() => {
    // Update meta tags for SEO - Press page
    document.title = "Press & Media Kit - Realer Estate | NYC Real Estate Press Coverage";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Press kit and media assets for Realer Estate - the AI tool helping New Yorkers find undervalued and rent-stabilized apartments.');
    }
  }, []);

  const handleDownloadAssets = () => {
    // Create a simple download for the brand assets
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'realer-estate-brand-assets.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    { icon: Brain, number: "16-year-old", description: "solo founder" },
    { icon: Home, number: "6,000+", description: "users served" },
    { icon: DollarSign, number: "$500K+", description: "rent savings surfaced" },
    { icon: MapPin, number: "170+", description: "NYC zip codes" },
    { icon: Bot, number: "Real-time", description: "AI deal + rent stabilization detection" },
    { icon: CheckCircle, number: "100%", description: "free to find undervalued homes" }
  ];

  const reviews = [
    "Thank you so much for making this, I just joined and am loving the smooth interface!",
    "I love this tool & what you're doing to help bc it's a real struggle out here",
    "I will definitely be using this as I plan my move in the future.",
    "Hi! This is a really great tool, thanks for sharing and creating this."
  ];

  return (
    <div className="font-inter">
      {/* Hero Section */}
      <section className="min-h-[600px] flex items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
        {/* Background with glow lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black">
          {/* Blue glow lines */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tighter">
            Press & Media Kit
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 tracking-tight max-w-3xl mx-auto">
            Everything you need to cover Realer Estate—the AI tool helping New Yorkers find the rent-stabilized and undervalued homes the city missed.
          </p>
          <p className="text-lg text-gray-400 tracking-tight">
            Reach out at <a href="mailto:press@realerestate.org" className="text-blue-400 hover:text-blue-300 transition-colors">press@realerestate.org</a> for interviews, data, or quotes.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative">
        {/* Blue glow line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40"></div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-12 tracking-tighter">
            Our Story
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl leading-relaxed text-gray-300 mb-6 tracking-tight">
              We're two high schoolers from Brooklyn who grew up watching friends, family, and neighbors get priced out of the city we love.
            </p>
            <p className="text-xl leading-relaxed text-gray-300 mb-6 tracking-tight">
              After seeing first-hand how we were losing our community to rising rents, we built something we wished had existed sooner.
            </p>
            <p className="text-xl leading-relaxed text-gray-300 tracking-tight">
              Realer Estate is an AI-powered platform that scans NYC listings in real time to surface rent-stabilized and undervalued apartments—before they disappear. It's already helped over 6,000 New Yorkers save thousands on rent, and we're just getting started.
            </p>
          </div>
        </div>

        {/* Founder Photo */}
        <div className="flex justify-center mb-12">
          <img 
            src="/lovable-uploads/b9ac9e86-7b02-4ad3-8d9d-64edd91399e5.png" 
            alt="Founders of Realer Estate" 
            className="w-96 h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* At a Glance Section */}
      <section className="py-20 px-4 bg-gray-900/30 relative">
        {/* Blue glow lines */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-25"></div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tighter">
            At a Glance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl bg-black/30 border border-gray-800 hover:border-blue-500/30 transition-all">
                  <Icon className="h-8 w-8 mx-auto mb-4 text-blue-400" />
                  <div className="text-3xl font-bold mb-2 tracking-tight">{stat.number}</div>
                  <div className="text-gray-400 tracking-tight">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Real User Reviews Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative">
        {/* Blue glow line */}
        <div className="absolute bottom-1/4 right-0 w-2/3 h-px bg-gradient-to-l from-transparent via-blue-500 to-transparent opacity-30"></div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Real User Reviews
          </h2>
          <p className="text-lg text-gray-400 tracking-tight">From our Reddit</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="p-6 rounded-xl bg-black/40 border border-gray-800 relative">
              <Quote className="h-6 w-6 text-white/60 mb-4" />
              <p className="text-lg text-gray-300 tracking-tight italic">"{review}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Media Assets Section */}
      <section className="py-20 px-4 bg-gray-900/50 relative">
        {/* Blue glow lines */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-35"></div>
        
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tighter">
            Media Kit
          </h2>
          
          {/* Brand Assets Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
              <img 
                src="/lovable-uploads/aebcde43-52df-45f0-b99c-e9c4055a6fbd.png" 
                alt="Realer Estate Logo - Light" 
                className="w-full h-24 object-contain mb-4"
              />
              <p className="text-sm text-gray-400 text-center">Logo - Light Version</p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl border border-gray-800">
              <img 
                src="/lovable-uploads/1f25f950-2ecf-4369-8e1a-b89d1440ce9b.png" 
                alt="Realer Estate Logo - Dark" 
                className="w-full h-24 object-contain mb-4"
              />
              <p className="text-sm text-gray-400 text-center">Logo - Dark Version</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
              <img 
                src="/lovable-uploads/ab92e7b1-d0b8-43cc-a546-7bc2c185208a.png" 
                alt="Realer Estate Platform Screenshot" 
                className="w-full h-24 object-cover rounded mb-4"
              />
              <p className="text-sm text-gray-400 text-center">Platform Screenshot</p>
            </div>
            <div className="bg-black/40 p-6 rounded-xl border border-gray-800">
              <img 
                src="/lovable-uploads/cb9f8199-60df-47bd-9358-5b7a49890a14.png" 
                alt="Realer Estate Marketing Asset" 
                className="w-full h-24 object-cover rounded mb-4"
              />
              <p className="text-sm text-gray-400 text-center">Marketing Asset</p>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={handleDownloadAssets}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              Download All Assets
            </button>
          </div>
        </div>
      </section>

      {/* Press Coverage Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto relative">
        {/* Blue glow line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-25"></div>
        
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-12 tracking-tighter">
            Press Coverage
          </h2>
          
          <div className="max-w-2xl mx-auto p-8 rounded-xl bg-black/30 border border-gray-800">
            <p className="text-xl text-gray-300 mb-6 tracking-tight">
              Want to break the story? We're happy to give you a first look.
            </p>
            <p className="text-lg tracking-tight">
              Reach out to: <a href="mailto:press@realerestate.org" className="text-blue-400 hover:text-blue-300 transition-colors">press@realerestate.org</a>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background with glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/20 to-blue-800/30"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-blue-600/40 rounded-full blur-3xl"></div>
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="p-8 rounded-xl bg-black/40 border border-gray-800">
            <h3 className="text-2xl font-semibold mb-4 tracking-tight">Press Inquiries</h3>
            <p className="text-xl mb-2 tracking-tight">Beckett Zahedi</p>
            <p className="text-lg text-blue-400 mb-4">
              <a href="mailto:press@realerestate.org" className="hover:text-blue-300 transition-colors">press@realerestate.org</a>
            </p>
            <p className="text-gray-400 tracking-tight">Available for interviews, founder quotes, and custom data.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
