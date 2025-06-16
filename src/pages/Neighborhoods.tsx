
import { Link } from "react-router-dom";

const Neighborhoods = () => {
  const neighborhoods = [
    {
      name: "DUMBO",
      zipCode: "11201",
      avgPrice: "$1,850",
      dealPrice: "$1,200",
      description: "Waterfront views, tech hub"
    },
    {
      name: "East Village",
      zipCode: "10009",
      avgPrice: "$1,650",
      dealPrice: "$1,100",
      description: "Nightlife, culture, walkable"
    },
    {
      name: "Bushwick",
      zipCode: "11237",
      avgPrice: "$930",
      dealPrice: "$690",
      description: "Art scene, emerging market"
    },
    {
      name: "Crown Heights",
      zipCode: "11238",
      avgPrice: "$1,100",
      dealPrice: "$780",
      description: "Family-friendly, transit access"
    },
    {
      name: "SoHo",
      zipCode: "10012",
      avgPrice: "$2,100",
      dealPrice: "$1,350",
      description: "Luxury, shopping, historic"
    },
    {
      name: "Fort Greene",
      zipCode: "11205",
      avgPrice: "$1,250",
      dealPrice: "$950",
      description: "Historic, parks, culture"
    }
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood) => (
            <div 
              key={neighborhood.zipCode}
              className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-1 tracking-tight">
                  {neighborhood.name}
                </h3>
                <p className="text-gray-400 text-sm tracking-tight">
                  {neighborhood.zipCode} • {neighborhood.description}
                </p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 tracking-tight">Market Avg</span>
                  <span className="text-gray-300 tracking-tight">{neighborhood.avgPrice}/sqft</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 tracking-tight">Our Deals From</span>
                  <span className="text-green-400 font-bold tracking-tight">{neighborhood.dealPrice}/sqft</span>
                </div>
              </div>

              <Link 
                to={`/search?neighborhood=${neighborhood.name}`}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-xl font-medium tracking-tight hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
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
