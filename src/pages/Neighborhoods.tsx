
import { Link } from "react-router-dom";

const Neighborhoods = () => {
  const neighborhoods = [
    { 
      name: "DUMBO", 
      borough: "BROOKLYN",
      zipCode: "11201", 
      avgPrice: "$1,850", 
      dealPrice: "$1,200",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop"
    },
    { 
      name: "East Village", 
      borough: "MANHATTAN",
      zipCode: "10009", 
      avgPrice: "$1,650", 
      dealPrice: "$1,100",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop"
    },
    { 
      name: "Bushwick", 
      borough: "BROOKLYN",
      zipCode: "11237", 
      avgPrice: "$930", 
      dealPrice: "$690",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"
    },
    { 
      name: "Crown Heights", 
      borough: "BROOKLYN",
      zipCode: "11238", 
      avgPrice: "$1,100", 
      dealPrice: "$780",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop"
    },
    { 
      name: "SoHo", 
      borough: "MANHATTAN",
      zipCode: "10012", 
      avgPrice: "$2,100", 
      dealPrice: "$1,350",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop"
    },
    { 
      name: "Fort Greene", 
      borough: "BROOKLYN",
      zipCode: "11205", 
      avgPrice: "$1,250", 
      dealPrice: "$950",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop"
    },
    { 
      name: "Williamsburg", 
      borough: "BROOKLYN",
      zipCode: "11249", 
      avgPrice: "$1,400", 
      dealPrice: "$950",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"
    },
    { 
      name: "Park Slope", 
      borough: "BROOKLYN",
      zipCode: "11215", 
      avgPrice: "$1,300", 
      dealPrice: "$980",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop"
    },
    { 
      name: "Greenpoint", 
      borough: "BROOKLYN",
      zipCode: "11222", 
      avgPrice: "$1,200", 
      dealPrice: "$850",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop"
    },
    { 
      name: "Red Hook", 
      borough: "BROOKLYN",
      zipCode: "11231", 
      avgPrice: "$980", 
      dealPrice: "$720",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop"
    },
    { 
      name: "Bed-Stuy", 
      borough: "BROOKLYN",
      zipCode: "11216", 
      avgPrice: "$950", 
      dealPrice: "$680",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"
    },
    { 
      name: "Astoria", 
      borough: "QUEENS",
      zipCode: "11106", 
      avgPrice: "$800", 
      dealPrice: "$580",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop"
    },
    { 
      name: "LIC", 
      borough: "QUEENS",
      zipCode: "11101", 
      avgPrice: "$1,100", 
      dealPrice: "$850",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop"
    },
    { 
      name: "Ridgewood", 
      borough: "QUEENS",
      zipCode: "11385", 
      avgPrice: "$750", 
      dealPrice: "$520",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop"
    },
    { 
      name: "Prospect Heights", 
      borough: "BROOKLYN",
      zipCode: "11238", 
      avgPrice: "$1,150", 
      dealPrice: "$820",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"
    },
    { 
      name: "Carroll Gardens", 
      borough: "BROOKLYN",
      zipCode: "11231", 
      avgPrice: "$1,350", 
      dealPrice: "$980",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop"
    },
    { 
      name: "Gowanus", 
      borough: "BROOKLYN",
      zipCode: "11215", 
      avgPrice: "$1,050", 
      dealPrice: "$750",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop"
    },
    { 
      name: "Cobble Hill", 
      borough: "BROOKLYN",
      zipCode: "11201", 
      avgPrice: "$1,400", 
      dealPrice: "$1,050",
      image: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?w=400&h=300&fit=crop"
    },
    { 
      name: "Boerum Hill", 
      borough: "BROOKLYN",
      zipCode: "11201", 
      avgPrice: "$1,250", 
      dealPrice: "$900",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"
    },
    { 
      name: "Downtown Brooklyn", 
      borough: "BROOKLYN",
      zipCode: "11201", 
      avgPrice: "$1,180", 
      dealPrice: "$850",
      image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {neighborhoods.map((neighborhood) => (
            <Link 
              key={`${neighborhood.name}-${neighborhood.zipCode}`}
              to={`/search?neighborhood=${neighborhood.name}`}
              className="group cursor-pointer"
            >
              <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 hover:shadow-xl">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={neighborhood.image} 
                    alt={neighborhood.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 tracking-tight text-blue-400">
                    {neighborhood.name}
                  </h3>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
                    {neighborhood.borough}
                  </p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 tracking-tight">Market</span>
                      <span className="text-gray-300 tracking-tight">{neighborhood.avgPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400 tracking-tight">Deals</span>
                      <span className="text-green-400 font-bold tracking-tight">{neighborhood.dealPrice}</span>
                    </div>
                  </div>
                </div>
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
