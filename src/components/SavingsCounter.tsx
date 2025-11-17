import { useState, useEffect } from 'react';

const SavingsCounter = () => {
  const [totalSaved, setTotalSaved] = useState(52715226);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Savings counter logic
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 800) + 500;
      setTotalSaved(prev => prev + increment);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (isMobile) {
    // Mobile version - use bottom-28 to clear mobile nav + much wider for single line
    return (
      <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-40 px-2">
        <div className="bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-full px-12 py-3 shadow-lg whitespace-nowrap max-w-none">
          <p className="text-white text-sm font-medium tracking-tight">
            ${totalSaved.toLocaleString()} savings found this month
          </p>
        </div>
      </div>
    );
  }

  // Desktop version - keep original bottom-6 positioning
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-full px-6 py-3 shadow-lg">
        <p className="text-white text-sm font-medium tracking-tight">
          ${totalSaved.toLocaleString()} in savings found this month
        </p>
      </div>
    </div>
  );
};

export default SavingsCounter;
