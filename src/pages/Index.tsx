import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HoverButton } from "@/components/ui/hover-button";
import { useEffect, useRef, useState } from "react"; // You might already have some of these
import TestimonialsSection from "@/components/TestimonialsSection";
import { useAuth } from "@/contexts/AuthContext";
import { useScroll, useTransform, motion } from 'framer-motion';

const ScrollJackedSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Create scroll-controlled opacity values that fade through black
  const text1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.35], [1, 1, 0, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.55, 0.6], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.65, 0.7, 1], [0, 1, 1]);

  const textContent = [
    {
      title: "We scan 30,000+ listings a week",
      subtitle: "Real-time analysis of thousands of data points to identify true value of each listing.",
      opacity: text1Opacity
    },
    {
      title: "We flag listings up to 60% below-market", 
      subtitle: "We only show you the best below-market & rent-stabilized listings, so you never overpay again.",
      opacity: text2Opacity
    },
    {
      title: "Save $925/mo on rent, $103k when buying",
      subtitle: "Based on average savings data. Join 6000+ New Yorkers finding the best deals in the city.",
      opacity: text3Opacity
    }
  ];

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col">
        
        {/* Header - Above everything, centered */}
        <div className="w-full text-center py-8 px-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white">
            The real estate market is rigged. Now you can win.
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center px-8">
          <div className="w-full max-w-none mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center h-full">
              
              {/* Left Side - Fixed Image */}
              <div className="relative order-2 lg:order-1">
                <img 
                  src="/lovable-uploads/desk3.png" 
                  alt="Realer Estate desktop platform showing NYC property scan" 
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>

              {/* Right Side - Scroll-Controlled Text */}
              <div className="order-1 lg:order-2 relative min-h-[300px]">
                {textContent.map((content, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ opacity: content.opacity }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-3xl md:text-4xl font-inter font-semibold tracking-tighter text-white">
                        {content.title}
                      </h3>
                      <p className="text-xl text-gray-300 font-inter tracking-tight leading-relaxed">
                        {content.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Update meta tags for SEO - Home page
    document.title = "Realer Estate - Your Unfair Advantage in NYC Real Estate | Find Undervalued Properties";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent. Get your unfair advantage in the NYC real estate market.');
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://realerestate.org');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', 'Realer Estate - Your Unfair Advantage in NYC Real Estate');
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', 'Stop overpaying for NYC real estate. Our advanced algorithms find undervalued properties for sale and rent.');
    
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', 'https://realerestate.org');

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://realerestate.org');
  }, []);

  return <div className="font-inter">
      {/* Hero Section */}
<section className="relative min-h-[600px] flex items-center justify-center overflow-hidden px-0 pt-0">        {/* Background Image with Full Width */}
        <div className="absolute inset-0 w-full h-full">
          {/* Background Image with Fade-in Effect */}
          <div 
            className="bg-cover bg-center bg-no-repeat min-h-[600px] absolute inset-0 animate-fade-in w-full h-full"
            style={{
              backgroundImage: `url('/lovable-uploads/2ff24928-306a-4305-9c27-9594098a543d.png')`,
              animationDuration: '3s',
              animationDelay: '0s',
              animationFillMode: 'both'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30"></div>
          </div>
        </div>
          
          {/* Hero Content - Always Visible */}
          <div className="relative z-10 min-h-[600px] flex items-center justify-center">
            <div className="text-center px-4 py-20 max-w-none">
              <h1 className="text-5xl md:text-6xl font-inter font-semibold mb-4 tracking-[-0.075em] transform translate-y-[130px] text-white">
                Find your dream home. And actually afford it.
              </h1>
              <p className="text-lg md:text-xl mb-16 text-white opacity-80 font-inter font-medium transform translate-y-[130px] tracking-[-0.075em]">
                Your unfair advantage in finding below-market & rent-stabilized homes.
              </p>
              <Link to={user ? "/rent" : "/rent"} className="inline-block bg-white font-inter text-black px-10 py-4 rounded-full font-bold text-xl tracking-tighter transform translate-y-[110px] hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-xl">
                {user ? "See Deals" : "See Deals"}
              </Link>
            </div>
          </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          
        </div>
      </section>


<section className="pt-4 pb-0 px-4 max-w-6xl mx-auto">
  <div className="text-center">
    <Link to="/press" className="inline-block hover:opacity-80 transition-opacity duration-300">
      <img 
        src="/lovable-uploads/ccb3bd82-5c57-4ba0-80af-4d8ce8d9306a.png" 
        alt="As seen on CBS, ABC, AP News" 
        className="h-10 mx-auto"
      />
    </Link>
  </div>
</section>

  {/* Product Mockup Section */}
      <section className="pt-6 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center">
          <img 
            src="/lovable-uploads/0b38338f-4c89-4881-80ff-5d26234b31cc.png" 
            alt="Realer Estate platform showing rental listings" 
            className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl"
          />
        </div>
      </section>
    
      {/* Problem Section */}
      <section className="pt-10 pb-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            It shouldn't be this hard to find a home in the city.
          </h2>
          <p className="text-xl text-gray-400 tracking-tight max-w-3xl mx-auto">
          Using AI algorithms trained on market data to find you the best undervalued & rent-stabilized deals, saving you thousands.
          </p>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent my-8"></div>
      </section>

     {/* How It Works - Scroll Jacked Version */}
<ScrollJackedSection />

      {/* Featured Neighborhoods */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Stop overpaying in every neighborhood.
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">SoHo</h3>
              <p className="text-gray-400 tracking-tight">Avg $2,100/sqft → Deals from $1,350/sqft</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">Bushwick</h3>
              <p className="text-gray-400 tracking-tight">Avg $930/sqft → Deals from $690/sqft</p>
            </div>
          </div>
          <Link to="/rent">
            <HoverButton className="text-white font-semibold tracking-tight hover:shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-300">
              Explore Homes
            </HoverButton>
          </Link>
        </div>
      </section>
    
      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Final CTA */}
      <section className="py-20 pb-0 px-4 relative overflow-hidden">
        {/* Blue Gradient Blob Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-blue-800/40"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/40 via-cyan-400/30 to-blue-600/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 w-[600px] h-[400px] bg-gradient-to-tl from-purple-500/30 via-blue-400/20 to-cyan-500/40 rounded-full blur-2xl"></div>        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Let the house hunt end here.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          <Link to="/join" className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg tracking-tight hover:shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 shadow-xl">
            Join now.
          </Link>
          
          {/* Footer Links */}
          <div className="mt-16 mb-2">
            <div className="flex justify-center space-x-8 text-xs text-gray-400">
              <Link to="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gray-300 transition-colors">
                Terms of Service
              </Link>
              <Link to="/press" className="hover:text-gray-300 transition-colors">
                Press
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>;
};

export default Index;
