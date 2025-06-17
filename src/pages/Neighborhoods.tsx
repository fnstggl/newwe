
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Neighborhoods = () => {
  const neighborhoods = [
    { name: "DUMBO", zipCode: "11201", avgPrice: "$1,850", dealPrice: "$1,200", color: "bg-blue-500" },
    { name: "East Village", zipCode: "10009", avgPrice: "$1,650", dealPrice: "$1,100", color: "bg-purple-500" },
    { name: "Bushwick", zipCode: "11237", avgPrice: "$930", dealPrice: "$690", color: "bg-green-500" },
    { name: "Crown Heights", zipCode: "11238", avgPrice: "$1,100", dealPrice: "$780", color: "bg-red-500" },
    { name: "SoHo", zipCode: "10012", avgPrice: "$2,100", dealPrice: "$1,350", color: "bg-yellow-500" },
    { name: "Fort Greene", zipCode: "11205", avgPrice: "$1,250", dealPrice: "$950", color: "bg-indigo-500" },
    { name: "Williamsburg", zipCode: "11249", avgPrice: "$1,400", dealPrice: "$950", color: "bg-pink-500" },
    { name: "Park Slope", zipCode: "11215", avgPrice: "$1,300", dealPrice: "$980", color: "bg-teal-500" },
    { name: "Greenpoint", zipCode: "11222", avgPrice: "$1,200", dealPrice: "$850", color: "bg-orange-500" },
    { name: "Red Hook", zipCode: "11231", avgPrice: "$980", dealPrice: "$720", color: "bg-cyan-500" },
    { name: "Bed-Stuy", zipCode: "11216", avgPrice: "$950", dealPrice: "$680", color: "bg-emerald-500" },
    { name: "Astoria", zipCode: "11106", avgPrice: "$800", dealPrice: "$580", color: "bg-violet-500" },
    { name: "LIC", zipCode: "11101", avgPrice: "$1,100", dealPrice: "$850", color: "bg-rose-500" },
    { name: "Ridgewood", zipCode: "11385", avgPrice: "$750", dealPrice: "$520", color: "bg-lime-500" },
    { name: "Prospect Heights", zipCode: "11238", avgPrice: "$1,150", dealPrice: "$820", color: "bg-amber-500" },
    { name: "Carroll Gardens", zipCode: "11231", avgPrice: "$1,350", dealPrice: "$980", color: "bg-sky-500" },
    { name: "Gowanus", zipCode: "11215", avgPrice: "$1,050", dealPrice: "$750", color: "bg-fuchsia-500" },
    { name: "Cobble Hill", zipCode: "11201", avgPrice: "$1,400", dealPrice: "$1,050", color: "bg-slate-500" },
    { name: "Boerum Hill", zipCode: "11201", avgPrice: "$1,250", dealPrice: "$900", color: "bg-zinc-500" },
    { name: "Downtown Brooklyn", zipCode: "11201", avgPrice: "$1,180", dealPrice: "$850", color: "bg-neutral-500" }
  ];

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

        {/* Horizontal Scrollable Neighborhood Pills */}
        <div className="mb-16">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
              {neighborhoods.map((neighborhood, index) => (
                <Link
                  key={`${neighborhood.name}-${neighborhood.zipCode}`}
                  to={`/search?neighborhood=${neighborhood.name}`}
                  className={`
                    ${neighborhood.color}
                    inline-flex items-center justify-center
                    px-6 py-3 
                    rounded-full
                    font-semibold text-white text-sm
                    cursor-pointer
                    transition-all duration-300 ease-out
                    hover:scale-105
                    hover:shadow-lg hover:shadow-white/20
                    hover:brightness-110
                    transform
                    whitespace-nowrap
                    min-w-fit
                    group
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-medium tracking-tight">
                      {neighborhood.name}
                    </span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1">
                      {neighborhood.dealPrice}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
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
