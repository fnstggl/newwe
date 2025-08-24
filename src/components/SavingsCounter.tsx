import { useState, useEffect } from 'react';

const SavingsCounter = () => {
  const [totalSaved, setTotalSaved] = useState(39,847,293);

  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 400) + 200;
      setTotalSaved(prev => prev + increment);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-black/60 backdrop-blur-md border border-gray-700/50 rounded-full px-6 py-3 shadow-lg">
        <p className="text-white text-sm font-medium tracking-tight">
          ${totalSaved.toLocaleString()} savings found this month
        </p>
      </div>
    </div>
  );
};

export default SavingsCounter;
