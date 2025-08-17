
import React, { useState, useEffect } from 'react';

interface Testimonial {
  quote: string;
  username: string;
  screenshot: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "This is great. In my dreams I am able to move back to NYC and keep checking all the time as rents keep hiking in Philly.",
    username: "u/2aware1",
    screenshot: "/lovable-uploads/143f695e-a777-4d57-a284-417c6f0efb94.png"
  },
  {
    quote: "I love this tool & what you're doing to help bc it's a real struggle out here.",
    username: "u/strawberrireshi",
    screenshot: "/lovable-uploads/fb5e4af1-f65a-4694-aae3-ad460c7f78d5.png"
  },
  {
    quote: "I will definitely be using this as I plan my move in the future.",
    username: "u/helpmychangedmind",
    screenshot: "/lovable-uploads/861876d5-0d36-4037-aaa8-e29b80645c0c.png"
  },
  {
    quote: "Thank you so much for making this, I just joined and am loving the smooth interface!",
    username: "u/diahdem",
    screenshot: "/lovable-uploads/276eb725-b35b-4b39-9393-8988406c56f7.png"
  },
  {
    quote: "Hi! This is a really great tool, thanks for sharing and creating this.",
    username: "u/helpmychangedmind",
    screenshot: "/lovable-uploads/7902b592-4299-45ab-9a3d-15c739b5afe2.png"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScreenshot, setShowScreenshot] = useState(false);

  useEffect(() => {
  if (!showScreenshot) {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }
}, [showScreenshot]);

  const currentTestimonial = testimonials[currentIndex];

  const handleScreenshotToggle = () => {
    setShowScreenshot(!showScreenshot);
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background with gradient and glowing orbs */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-white/5 to-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-semibold mb-16 tracking-tighter text-white">
          10,000+ New Yorkers already saving thousands.
        </h2>
        
        <div className="relative min-h-[300px] flex items-center justify-center">
          <div className="w-full max-w-3xl">
            {/* Glassmorphic card */}
            <div className="relative p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-[1.02]">
              {!showScreenshot ? (
                <>
                  <blockquote className="text-xl md:text-2xl font-light italic text-white mb-6 leading-relaxed">
                    "{currentTestimonial.quote}"
                  </blockquote>
                  <p className="text-gray-400 text-sm md:text-base mb-6">
                    — {currentTestimonial.username}
                  </p>
                  <button
                    onClick={handleScreenshotToggle}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                  >
                    Don't just take our word for it
                  </button>
                </>
              ) : (
                <div className="relative">
                  <img
                    src={currentTestimonial.screenshot}
                    alt={`Reddit screenshot from ${currentTestimonial.username}`}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  {/* Desktop button - top right */}
                  <button
                    onClick={handleScreenshotToggle}
                    className="hidden md:block absolute top-4 right-4 text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                  >
                    Back to text view
                  </button>
                  {/* Mobile button - centered below screenshot */}
                  <div className="md:hidden mt-4 text-center">
                    <button
                      onClick={handleScreenshotToggle}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                    >
                      Back to text view
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setShowScreenshot(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
