export interface NeighborhoodInfo {
  description: string;
  pros: string[];
  cons: string[];
}

export const getNeighborhoodInfo = (neighborhood: string): NeighborhoodInfo | null => {
  const normalizedNeighborhood = neighborhood?.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return neighborhoodData[normalizedNeighborhood] || null;
};

export const capitalizeNeighborhood = (neighborhood: string): string => {
  if (!neighborhood) return '';
  return neighborhood
    .split(/[-\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\bNyc\b/g, 'NYC');
};

const neighborhoodData: Record<string, NeighborhoodInfo> = {
  // Manhattan
  "upper-east-side": {
    description: "An affluent neighborhood known for its luxury shopping, museums, and classic pre-war buildings. Home to Central Park's east side and Museum Mile.",
    pros: [
      "Prestigious location with excellent schools",
      "Close to Central Park and world-class museums",
      "Safe, well-maintained streets with doorman buildings"
    ],
    cons: [
      "Very expensive with limited nightlife",
      "Can feel stuffy and less diverse"
    ]
  },
  "upper-west-side": {
    description: "A family-friendly neighborhood with tree-lined streets, pre-war architecture, and proximity to Central Park and Lincoln Center.",
    pros: [
      "Great for families with excellent schools",
      "Cultural attractions like Lincoln Center",
      "Beautiful architecture and Central Park access"
    ],
    cons: [
      "Expensive with limited late-night dining",
      "Can be quiet for young professionals"
    ]
  },
  "midtown-east": {
    description: "The business heart of Manhattan, featuring skyscrapers, corporate headquarters, and convenient transportation hubs.",
    pros: [
      "Excellent transportation connections",
      "Close to major business centers",
      "Convenient for commuting professionals"
    ],
    cons: [
      "Very expensive and crowded during business hours",
      "Limited residential feel and community atmosphere"
    ]
  },
  "midtown-west": {
    description: "Home to Times Square, Broadway theaters, and Hell's Kitchen. A bustling area with entertainment and dining options.",
    pros: [
      "Vibrant nightlife and entertainment scene",
      "Excellent restaurants and Broadway shows",
      "Great transportation access"
    ],
    cons: [
      "Very touristy and crowded",
      "Expensive with noise and congestion"
    ]
  },
  "chelsea": {
    description: "A trendy neighborhood known for art galleries, the High Line park, and a vibrant LGBTQ+ community.",
    pros: [
      "Trendy area with great art scene",
      "The High Line and Chelsea Market",
      "Excellent restaurants and nightlife"
    ],
    cons: [
      "Very expensive real estate",
      "Can be crowded with tourists"
    ]
  },
  "greenwich-village": {
    description: "A historic bohemian neighborhood with tree-lined streets, Washington Square Park, and a rich cultural heritage.",
    pros: [
      "Charming historic character and walkability",
      "Great restaurants and cultural attractions",
      "Strong sense of community"
    ],
    cons: [
      "Very expensive with limited parking",
      "Can be crowded and noisy"
    ]
  },
  "east-village": {
    description: "A vibrant, eclectic neighborhood known for its nightlife, diverse dining scene, and artistic community.",
    pros: [
      "Excellent nightlife and restaurant scene",
      "Diverse, artistic community",
      "More affordable than other Manhattan areas"
    ],
    cons: [
      "Can be noisy and gritty",
      "Limited family-friendly amenities"
    ]
  },
  "lower-east-side": {
    description: "A historically immigrant neighborhood now known for trendy bars, vintage shopping, and a mix of old and new culture.",
    pros: [
      "Great nightlife and trendy restaurant scene",
      "Rich cultural history and diversity",
      "More affordable than other Manhattan neighborhoods"
    ],
    cons: [
      "Can be noisy and crowded on weekends",
      "Limited green space and family amenities"
    ]
  },
  "soho": {
    description: "An upscale shopping and arts district known for cast-iron architecture, high-end boutiques, and art galleries.",
    pros: [
      "World-class shopping and dining",
      "Beautiful cast-iron architecture",
      "Central location with great walkability"
    ],
    cons: [
      "Extremely expensive real estate",
      "Very crowded with tourists and shoppers"
    ]
  },
  "tribeca": {
    description: "An exclusive neighborhood known for luxury living, cobblestone streets, and celebrity residents.",
    pros: [
      "Luxury living with excellent restaurants",
      "Quiet, family-friendly atmosphere",
      "Beautiful historic architecture"
    ],
    cons: [
      "Extremely expensive with limited nightlife",
      "Can feel isolated from other neighborhoods"
    ]
  },
  "financial-district": {
    description: "The historic financial center of NYC, featuring Wall Street, historic sites, and waterfront views.",
    pros: [
      "Historic significance and waterfront access",
      "Good transportation connections",
      "Growing residential community"
    ],
    cons: [
      "Quiet on weekends with limited nightlife",
      "Can feel corporate and less residential"
    ]
  },
  "chinatown": {
    description: "A vibrant ethnic enclave known for authentic Chinese cuisine, markets, and cultural experiences.",
    pros: [
      "Authentic cuisine and cultural experiences",
      "Affordable dining and shopping options",
      "Rich cultural heritage and community"
    ],
    cons: [
      "Can be crowded and chaotic",
      "Language barriers and limited English signage"
    ]
  },
  "little-italy": {
    description: "A historic Italian-American neighborhood known for traditional restaurants and cultural festivals.",
    pros: [
      "Rich Italian-American culture and history",
      "Excellent traditional Italian restaurants",
      "Charming neighborhood festivals"
    ],
    cons: [
      "Very touristy with inflated prices",
      "Limited authentic local community"
    ]
  },
  "nolita": {
    description: "North of Little Italy - a trendy neighborhood with boutique shopping, cafes, and a village-like feel.",
    pros: [
      "Trendy boutique shopping and cafes",
      "Charming, village-like atmosphere",
      "Great restaurants and nightlife"
    ],
    cons: [
      "Very expensive real estate",
      "Can be crowded with shoppers and tourists"
    ]
  },
  "west-village": {
    description: "A picturesque neighborhood with tree-lined streets, historic brownstones, and a strong community feel.",
    pros: [
      "Beautiful tree-lined streets and architecture",
      "Strong sense of community",
      "Excellent restaurants and local charm"
    ],
    cons: [
      "Extremely expensive real estate",
      "Limited nightlife for younger crowds"
    ]
  },
  "meatpacking-district": {
    description: "A transformed industrial area now known for trendy nightlife, the High Line, and upscale dining.",
    pros: [
      "Trendy nightlife and upscale dining",
      "The High Line and Whitney Museum",
      "Modern luxury developments"
    ],
    cons: [
      "Very expensive and can be pretentious",
      "Limited community feel and daytime activity"
    ]
  },
  "flatiron": {
    description: "A bustling commercial district centered around the iconic Flatiron Building, with tech companies and dining.",
    pros: [
      "Central location with excellent transportation",
      "Growing tech scene and business opportunities",
      "Great restaurants and Union Square nearby"
    ],
    cons: [
      "Very expensive and crowded",
      "More commercial than residential feel"
    ]
  },
  "gramercy": {
    description: "An elegant neighborhood known for Gramercy Park, historic architecture, and a quiet residential feel.",
    pros: [
      "Quiet, elegant residential atmosphere",
      "Beautiful historic architecture",
      "Central location with good transportation"
    ],
    cons: [
      "Very expensive with limited nightlife",
      "Can feel exclusive and less diverse"
    ]
  },
  "murray-hill": {
    description: "A residential neighborhood popular with young professionals, offering a mix of high-rises and brownstones.",
    pros: [
      "Popular with young professionals",
      "Good restaurant and bar scene",
      "More affordable than other Manhattan areas"
    ],
    cons: [
      "Can feel generic and lacking character",
      "Crowded with recent college graduates"
    ]
  },
  "kips-bay": {
    description: "A residential neighborhood with modern high-rises, medical facilities, and convenient Midtown access.",
    pros: [
      "Modern amenities and high-rise living",
      "Good transportation to Midtown",
      "Growing restaurant and bar scene"
    ],
    cons: [
      "Lacks distinct character and charm",
      "Can feel sterile and overly commercial"
    ]
  },
  "stuyvesant-town": {
    description: "A large residential complex offering affordable housing with parks, playgrounds, and community amenities.",
    pros: [
      "Affordable housing with community amenities",
      "Family-friendly with parks and playgrounds",
      "Good transportation access"
    ],
    cons: [
      "Can feel isolated from the rest of Manhattan",
      "Limited dining and entertainment options nearby"
    ]
  },
  "alphabet-city": {
    description: "The easternmost part of the East Village, known for its diverse community, affordable options, and local bars.",
    pros: [
      "More affordable than other Manhattan areas",
      "Diverse, artistic community",
      "Good local bars and restaurants"
    ],
    cons: [
      "Can feel rough around the edges",
      "Limited upscale amenities and services"
    ]
  },
  "two-bridges": {
    description: "A small neighborhood between the Manhattan and Brooklyn Bridges, offering waterfront views and growing development.",
    pros: [
      "Waterfront location with bridge views",
      "Growing development and investment",
      "More affordable than other Lower Manhattan areas"
    ],
    cons: [
      "Limited amenities and dining options",
      "Can feel isolated from other neighborhoods"
    ]
  },
  "battery-park-city": {
    description: "A planned waterfront community with parks, family amenities, and stunning harbor views.",
    pros: [
      "Beautiful waterfront parks and views",
      "Family-friendly with excellent schools",
      "Modern, well-planned community"
    ],
    cons: [
      "Can feel sterile and lacking character",
      "Limited nightlife and cultural attractions"
    ]
  },
  "inwood": {
    description: "The northernmost Manhattan neighborhood offering affordable housing, parks, and a strong Dominican community.",
    pros: [
      "Most affordable Manhattan neighborhood",
      "Large parks and green spaces",
      "Strong sense of community"
    ],
    cons: [
      "Far from Midtown and other attractions",
      "Limited dining and entertainment options"
    ]
  },
  "washington-heights": {
    description: "A diverse, hilly neighborhood known for Fort Tryon Park, affordable housing, and Dominican culture.",
    pros: [
      "Affordable housing with park access",
      "Rich Dominican culture and community",
      "The Cloisters museum and Fort Tryon Park"
    ],
    cons: [
      "Far from Midtown Manhattan",
      "Limited upscale dining and shopping"
    ]
  },
  "hamilton-heights": {
    description: "A historic Harlem neighborhood with beautiful architecture, cultural sites, and a growing arts scene.",
    pros: [
      "Beautiful historic architecture",
      "Growing arts and cultural scene",
      "More affordable than other Manhattan areas"
    ],
    cons: [
      "Still developing amenities and services",
      "Can feel disconnected from other neighborhoods"
    ]
  },
  "morningside-heights": {
    description: "Home to Columbia University, featuring academic atmosphere, affordable dining, and Morningside Park.",
    pros: [
      "Academic atmosphere with cultural events",
      "Affordable dining and student-friendly options",
      "Access to Morningside and Riverside Parks"
    ],
    cons: [
      "Can feel too student-oriented for families",
      "Limited upscale amenities and nightlife"
    ]
  },
  "harlem": {
    description: "A historic neighborhood known for its rich African-American culture, jazz heritage, and ongoing gentrification.",
    pros: [
      "Rich cultural history and community",
      "Growing restaurant and arts scene",
      "More affordable than other Manhattan areas"
    ],
    cons: [
      "Ongoing gentrification concerns",
      "Some areas still developing safety and amenities"
    ]
  },
  "east-harlem": {
    description: "Also known as El Barrio, a predominantly Latino neighborhood with authentic culture and affordable housing.",
    pros: [
      "Authentic Latino culture and community",
      "Affordable housing options",
      "Growing arts and cultural scene"
    ],
    cons: [
      "Some areas have safety concerns",
      "Limited upscale amenities and services"
    ]
  },
  "yorkville": {
    description: "Part of the Upper East Side with a more relaxed feel, good restaurants, and proximity to Central Park.",
    pros: [
      "More relaxed than other UES areas",
      "Good restaurants and local bars",
      "Close to Central Park and museums"
    ],
    cons: [
      "Still expensive like other UES areas",
      "Can feel quiet for younger residents"
    ]
  },
  "lenox-hill": {
    description: "An upscale Upper East Side neighborhood with luxury shopping, fine dining, and prestigious addresses.",
    pros: [
      "Luxury shopping and fine dining",
      "Prestigious addresses and doorman buildings",
      "Excellent schools and family amenities"
    ],
    cons: [
      "Very expensive real estate",
      "Can feel stuffy and less diverse"
    ]
  },
  "carnegie-hill": {
    description: "An affluent Upper East Side area near Central Park, known for museums, schools, and family-friendly atmosphere.",
    pros: [
      "Excellent schools and family amenities",
      "Close to museums and Central Park",
      "Safe, well-maintained neighborhood"
    ],
    cons: [
      "Very expensive with limited nightlife",
      "Can feel exclusive and less diverse"
    ]
  },

  // Brooklyn
  "williamsburg": {
    description: "A trendy neighborhood known for its hipster culture, artisanal food scene, and waterfront views of Manhattan.",
    pros: [
      "Vibrant arts and music scene",
      "Excellent restaurants and craft breweries",
      "Beautiful waterfront parks with Manhattan views"
    ],
    cons: [
      "Very expensive and increasingly gentrified",
      "Can feel pretentious and overcrowded"
    ]
  },
  "dumbo": {
    description: "Down Under the Manhattan Bridge Overpass - a waterfront neighborhood with cobblestone streets and stunning views.",
    pros: [
      "Stunning Manhattan skyline views",
      "Beautiful waterfront parks and walkways",
      "Unique historic architecture"
    ],
    cons: [
      "Extremely expensive real estate",
      "Limited nightlife and can feel touristy"
    ]
  },
  "brooklyn-heights": {
    description: "A historic, affluent neighborhood with tree-lined streets, brownstones, and the famous Promenade.",
    pros: [
      "Historic charm with beautiful architecture",
      "The Promenade with incredible views",
      "Quiet, family-friendly atmosphere"
    ],
    cons: [
      "Very expensive and can feel stuffy",
      "Limited nightlife and younger crowd"
    ]
  },
  "park-slope": {
    description: "A family-friendly neighborhood known for Prospect Park, Victorian architecture, and excellent schools.",
    pros: [
      "Excellent schools and family amenities",
      "Beautiful Victorian architecture",
      "Prospect Park and great local businesses"
    ],
    cons: [
      "Very expensive and competitive housing market",
      "Can feel overly family-oriented for singles"
    ]
  },
  "fort-greene": {
    description: "A historic neighborhood with beautiful architecture, Fort Greene Park, and a strong arts community.",
    pros: [
      "Rich history and beautiful architecture",
      "Strong arts and cultural community",
      "Fort Greene Park and good restaurants"
    ],
    cons: [
      "Rapidly gentrifying with rising prices",
      "Some areas still developing amenities"
    ]
  },
  "boerum-hill": {
    description: "A charming neighborhood with tree-lined streets, historic brownstones, and a village-like feel.",
    pros: [
      "Charming, village-like atmosphere",
      "Beautiful historic brownstones",
      "Good restaurants and local shops"
    ],
    cons: [
      "Very expensive real estate",
      "Limited nightlife and entertainment"
    ]
  },
  "carroll-gardens": {
    description: "A family-friendly neighborhood known for its Italian-American heritage, gardens, and brownstones.",
    pros: [
      "Family-friendly with great schools",
      "Beautiful brownstones with front gardens",
      "Strong sense of community"
    ],
    cons: [
      "Very expensive and competitive market",
      "Limited nightlife for younger residents"
    ]
  },
  "cobble-hill": {
    description: "A small, upscale neighborhood with cobblestone streets, historic charm, and boutique shopping.",
    pros: [
      "Historic charm with cobblestone streets",
      "Boutique shopping and dining",
      "Close to Brooklyn Bridge Park"
    ],
    cons: [
      "Very expensive and limited inventory",
      "Can feel small and lacking in amenities"
    ]
  },
  "red-hook": {
    description: "A waterfront neighborhood with industrial charm, art studios, and growing food scene.",
    pros: [
      "Unique industrial charm and waterfront access",
      "Growing arts and food scene",
      "More affordable than other Brooklyn areas"
    ],
    cons: [
      "Limited subway access and transportation",
      "Can feel isolated and industrial"
    ]
  },
  "gowanus": {
    description: "An industrial neighborhood undergoing rapid development, known for art spaces and new construction.",
    pros: [
      "Rapidly developing with new amenities",
      "Growing arts and cultural scene",
      "More affordable than nearby neighborhoods"
    ],
    cons: [
      "Industrial area with environmental concerns",
      "Limited established amenities and services"
    ]
  },
  "prospect-heights": {
    description: "A diverse neighborhood near Prospect Park and the Brooklyn Museum, with good dining and cultural attractions.",
    pros: [
      "Close to Prospect Park and cultural attractions",
      "Diverse community with good restaurants",
      "Good transportation connections"
    ],
    cons: [
      "Rapidly gentrifying with rising prices",
      "Can feel transitional in some areas"
    ]
  },
  "crown-heights": {
    description: "A diverse neighborhood with Caribbean culture, historic architecture, and growing arts scene.",
    pros: [
      "Rich Caribbean culture and community",
      "More affordable than other Brooklyn areas",
      "Growing arts and restaurant scene"
    ],
    cons: [
      "Some areas have safety concerns",
      "Ongoing gentrification tensions"
    ]
  },
  "bedford-stuyvesant": {
    description: "A historic African-American neighborhood with beautiful brownstones, cultural heritage, and ongoing gentrification.",
    pros: [
      "Beautiful historic brownstones",
      "Rich cultural heritage and community",
      "More affordable than other Brooklyn areas"
    ],
    cons: [
      "Rapid gentrification and displacement concerns",
      "Some areas still developing amenities"
    ]
  },
  "bushwick": {
    description: "An industrial neighborhood known for its street art, music venues, and young creative community.",
    pros: [
      "Vibrant arts and music scene",
      "More affordable with creative community",
      "Great street art and nightlife"
    ],
    cons: [
      "Can feel gritty and industrial",
      "Limited family amenities and services"
    ]
  },
  "greenpoint": {
    description: "A Polish-American neighborhood with waterfront views, local character, and growing food scene.",
    pros: [
      "Strong Polish-American community and culture",
      "Waterfront access with Manhattan views",
      "Growing restaurant and bar scene"
    ],
    cons: [
      "Industrial pollution and environmental concerns",
      "Limited subway access in some areas"
    ]
  },
  "sunset-park": {
    description: "A diverse neighborhood with a large Latino and Asian population, affordable housing, and great food.",
    pros: [
      "Very diverse with authentic international food",
      "More affordable housing options",
      "Growing arts scene and waterfront access"
    ],
    cons: [
      "Limited subway access in some areas",
      "Some areas still developing amenities"
    ]
  },
  "bay-ridge": {
    description: "A family-friendly neighborhood with a strong Italian-American community, good schools, and affordable housing.",
    pros: [
      "Family-friendly with good schools",
      "Strong sense of community",
      "More affordable than other Brooklyn areas"
    ],
    cons: [
      "Far from Manhattan and limited nightlife",
      "Can feel suburban and less diverse"
    ]
  },
  "dyker-heights": {
    description: "A residential neighborhood known for its Christmas lights display, family homes, and quiet atmosphere.",
    pros: [
      "Quiet, family-oriented neighborhood",
      "Beautiful homes and Christmas displays",
      "Good schools and community feel"
    ],
    cons: [
      "Very far from Manhattan",
      "Limited dining and entertainment options"
    ]
  },
  "bensonhurst": {
    description: "A diverse neighborhood with a large Italian and Chinese population, affordable housing, and authentic food.",
    pros: [
      "Very diverse with authentic ethnic food",
      "Affordable housing options",
      "Strong community feel"
    ],
    cons: [
      "Far from Manhattan with limited nightlife",
      "Some areas lack modern amenities"
    ]
  },
  "sheepshead-bay": {
    description: "A waterfront neighborhood known for its fishing boats, seafood restaurants, and Russian community.",
    pros: [
      "Waterfront location with fishing culture",
      "Great seafood restaurants",
      "More affordable housing"
    ],
    cons: [
      "Very far from Manhattan",
      "Limited cultural attractions and nightlife"
    ]
  },
  "coney-island": {
    description: "Famous for its boardwalk, amusement park, and beach, offering a unique seaside experience in NYC.",
    pros: [
      "Beach access and boardwalk",
      "Historic amusement park and attractions",
      "Affordable housing near the water"
    ],
    cons: [
      "Can feel run-down and touristy",
      "Limited year-round amenities and services"
    ]
  },
  "brighton-beach": {
    description: "Known as 'Little Odessa' for its large Russian and Ukrainian community, beachfront location, and authentic cuisine.",
    pros: [
      "Beach access and boardwalk",
      "Authentic Russian and Ukrainian culture",
      "Affordable housing near the water"
    ],
    cons: [
      "Very far from Manhattan",
      "Language barriers and limited English services"
    ]
  },

  // Queens
  "long-island-city": {
    description: "A rapidly developing neighborhood with modern high-rises, art museums, and stunning Manhattan views.",
    pros: [
      "Modern amenities and luxury buildings",
      "Excellent transportation to Manhattan",
      "Growing arts scene and waterfront parks"
    ],
    cons: [
      "Rapidly gentrifying with rising prices",
      "Can feel sterile and lacking character"
    ]
  },
  "astoria": {
    description: "A diverse neighborhood known for its Greek heritage, excellent food scene, and young professional population.",
    pros: [
      "Excellent international food scene",
      "More affordable than Manhattan",
      "Good nightlife and young professional community"
    ],
    cons: [
      "Can be crowded and noisy",
      "Some areas lack green space"
    ]
  },
  "sunnyside": {
    description: "A quiet, residential neighborhood with garden apartments, diverse community, and good transportation.",
    pros: [
      "Quiet, residential feel with garden apartments",
      "Diverse, family-friendly community",
      "Good transportation to Manhattan"
    ],
    cons: [
      "Limited nightlife and entertainment",
      "Can feel suburban for some tastes"
    ]
  },
  "woodside": {
    description: "A diverse, family-friendly neighborhood in Queens known for its affordable housing options and strong sense of community.",
    pros: [
      "Affordable housing with good value",
      "Diverse, welcoming community atmosphere",
      "Convenient transportation to Manhattan"
    ],
    cons: [
      "Limited nightlife and entertainment options",
      "Can feel residential and quiet for some"
    ]
  }
};
