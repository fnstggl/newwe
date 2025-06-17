
import { Link } from "react-router-dom";

const Neighborhoods = () => {
  const neighborhoods = [
    { name: "DUMBO", zipCode: "11201", avgPrice: "$1,850", dealPrice: "$1,200", size: "large", color: "bg-blue-500" },
    { name: "East Village", zipCode: "10009", avgPrice: "$1,650", dealPrice: "$1,100", size: "medium", color: "bg-purple-500" },
    { name: "Bushwick", zipCode: "11237", avgPrice: "$930", dealPrice: "$690", size: "small", color: "bg-green-500" },
    { name: "Crown Heights", zipCode: "11238", avgPrice: "$1,100", dealPrice: "$780", size: "medium", color: "bg-red-500" },
    { name: "SoHo", zipCode: "10012", avgPrice: "$2,100", dealPrice: "$1,350", size: "large", color: "bg-yellow-500" },
    { name: "Fort Greene", zipCode: "11205", avgPrice: "$1,250", dealPrice: "$950", size: "small", color: "bg-indigo-500" },
    { name: "Williamsburg", zipCode: "11249", avgPrice: "$1,400", dealPrice: "$950", size: "large", color: "bg-pink-500" },
    { name: "Park Slope", zipCode: "11215", avgPrice: "$1,300", dealPrice: "$980", size: "medium", color: "bg-teal-500" },
    { name: "Greenpoint", zipCode: "11222", avgPrice: "$1,200", dealPrice: "$850", size: "small", color: "bg-orange-500" },
    { name: "Red Hook", zipCode: "11231", avgPrice: "$980", dealPrice: "$720", size: "small", color: "bg-cyan-500" },
    { name: "Bed-Stuy", zipCode: "11216", avgPrice: "$950", dealPrice: "$680", size: "medium", color: "bg-emerald-500" },
    { name: "Astoria", zipCode: "11106", avgPrice: "$800", dealPrice: "$580", size: "small", color: "bg-violet-500" },
    { name: "LIC", zipCode: "11101", avgPrice: "$1,100", dealPrice: "$850", size: "medium", color: "bg-rose-500" },
    { name: "Ridgewood", zipCode: "11385", avgPrice: "$750", dealPrice: "$520", size: "small", color: "bg-lime-500" },
    { name: "Prospect Heights", zipCode: "11238", avgPrice: "$1,150", dealPrice: "$820", size: "medium", color: "bg-amber-500" },
    { name: "Carroll Gardens", zipCode: "11231", avgPrice: "$1,350", dealPrice: "$980", size: "medium", color: "bg-sky-500" },
    { name: "Gowanus", zipCode: "11215", avgPrice: "$1,050", dealPrice: "$750", size: "small", color: "bg-fuchsia-500" },
    { name: "Cobble Hill", zipCode: "11201", avgPrice: "$1,400", dealPrice: "$1,050", size: "medium", color: "bg-slate-500" },
    { name: "Boerum Hill", zipCode: "11201", avgPrice: "$1,250", dealPrice: "$900", size: "small", color: "bg-zinc-500" },
    { name: "Downtown Brooklyn", zipCode: "11201", avgPrice: "$1,180", dealPrice: "$850", size: "large", color: "bg-neutral-500" }
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'w-32 h-32 md:w-40 md:h-40 text-sm md:text-base hover:w-36 hover:h-36 md:hover:w-44 md:hover:h-44';
      case 'medium':
        return 'w-24 h-24 md:w-28 md:h-28 text-xs md:text-sm hover:w-28 hover:h-28 md:hover:w-32 md:hover:h-32';
      case 'small':
        return 'w-16 h-16 md:w-20 md:h-20 text-xs hover:w-20 hover:h-20 md:hover:w-24 md:hover:h-24';
      default:
        return 'w-24 h-24 md:w-28 md:h-28 text-xs md:text-sm hover:w-28 hover:h-28 md:hover:w-32 md:hover:h-32';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            Every neighborhood has hidden gems.
          </h1>
          <p className="text-xl text-gray-400 tracking-tight">
            We find the undervalued deals in NYC's best areas.
          </p>
        </div>

        {/* Neighborhoods Circular Layout */}
        <div className="relative min-h-[600px] flex flex-wrap items-center justify-center gap-4 md:gap-8 p-8">
          {neighborhoods.map((neighborhood, index) => (
            <Link
              key={`${neighborhood.name}-${neighborhood.zipCode}`}
              to={`/search?neighborhood=${neighborhood.name}`}
              className={`
                ${getSizeClasses(neighborhood.size)}
                ${neighborhood.color}
                rounded-full
                flex items-center justify-center
                cursor-pointer
                transition-all duration-300 ease-in-out
                hover:scale-110
                hover:shadow-2xl
                hover:shadow-white/20
                hover:brightness-110
                transform
                relative
                group
                font-bold
                text-white
                text-center
                p-2
              `}
              style={{
                transform: `rotate(${Math.random() * 360}deg)`,
                position: index < 8 ? 'relative' : 'relative',
              }}
            >
              <div className="flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="leading-tight font-semibold tracking-tight">
                  {neighborhood.name}
                </span>
                <span className="text-xs opacity-80 mt-1 hidden group-hover:block">
                  {neighborhood.dealPrice}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-4 tracking-tighter">
            Don't see your neighborhood?
          </h2>
          <p className="text-gray-400 mb-6 tracking-tight">
            We're constantly expanding our coverage across all five boroughs.
          </p>
          <Link 
            to="/join"
            className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300"
          >
            Get Early Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Neighborhoods;
