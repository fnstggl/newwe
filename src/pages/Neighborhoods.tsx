
import { Link } from "react-router-dom";

const Neighborhoods = () => {
  const neighborhoods = [
    { name: "DUMBO", zipCode: "11201", avgPrice: "$1,850", dealPrice: "$1,200" },
    { name: "East Village", zipCode: "10009", avgPrice: "$1,650", dealPrice: "$1,100" },
    { name: "Bushwick", zipCode: "11237", avgPrice: "$930", dealPrice: "$690" },
    { name: "Crown Heights", zipCode: "11238", avgPrice: "$1,100", dealPrice: "$780" },
    { name: "SoHo", zipCode: "10012", avgPrice: "$2,100", dealPrice: "$1,350" },
    { name: "Fort Greene", zipCode: "11205", avgPrice: "$1,250", dealPrice: "$950" },
    { name: "Williamsburg", zipCode: "11249", avgPrice: "$1,400", dealPrice: "$950" },
    { name: "Park Slope", zipCode: "11215", avgPrice: "$1,300", dealPrice: "$980" },
    { name: "Greenpoint", zipCode: "11222", avgPrice: "$1,200", dealPrice: "$850" },
    { name: "Red Hook", zipCode: "11231", avgPrice: "$980", dealPrice: "$720" },
    { name: "Bed-Stuy", zipCode: "11216", avgPrice: "$950", dealPrice: "$680" },
    { name: "Astoria", zipCode: "11106", avgPrice: "$800", dealPrice: "$580" },
    { name: "LIC", zipCode: "11101", avgPrice: "$1,100", dealPrice: "$850" },
    { name: "Ridgewood", zipCode: "11385", avgPrice: "$750", dealPrice: "$520" },
    { name: "Prospect Heights", zipCode: "11238", avgPrice: "$1,150", dealPrice: "$820" },
    { name: "Carroll Gardens", zipCode: "11231", avgPrice: "$1,350", dealPrice: "$980" },
    { name: "Gowanus", zipCode: "11215", avgPrice: "$1,050", dealPrice: "$750" },
    { name: "Cobble Hill", zipCode: "11201", avgPrice: "$1,400", dealPrice: "$1,050" },
    { name: "Boerum Hill", zipCode: "11201", avgPrice: "$1,250", dealPrice: "$900" },
    { name: "Downtown Brooklyn", zipCode: "11201", avgPrice: "$1,180", dealPrice: "$850" }
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

        {/* Neighborhoods Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {neighborhoods.map((neighborhood) => (
            <div 
              key={`${neighborhood.name}-${neighborhood.zipCode}`}
              className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className="mb-3">
                <h3 className="text-lg font-bold mb-1 tracking-tight">
                  {neighborhood.name}
                </h3>
                <p className="text-gray-400 text-xs tracking-tight">
                  {neighborhood.zipCode}
                </p>
              </div>
              
              <div className="mb-4 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 tracking-tight">Market</span>
                  <span className="text-gray-300 tracking-tight">{neighborhood.avgPrice}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 tracking-tight">Deals</span>
                  <span className="text-green-400 font-bold tracking-tight">{neighborhood.dealPrice}</span>
                </div>
              </div>

              <Link 
                to={`/search?neighborhood=${neighborhood.name}`}
                className="block w-full text-center py-2 rounded-lg font-medium tracking-tight border-2 border-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-border hover:border-blue-500 hover:bg-transparent hover:text-blue-400 transition-all duration-300 text-sm"
                style={{
                  background: 'linear-gradient(black, black) padding-box, linear-gradient(90deg, #2563eb, #7c3aed) border-box'
                }}
              >
                View Deals
              </Link>
            </div>
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
