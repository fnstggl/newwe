
// Neighborhood data for NYC boroughs and their respective neighborhoods

export interface NeighborhoodInfo {
  name: string;
  borough: string;
  description: string;
  averageRent: string;
  walkScore: number;
  transitScore: number;
  highlights: string[];
  pros: string[];
  cons: string[];
}

export const neighborhoods: Record<string, NeighborhoodInfo> = {
  // Existing neighborhoods
  'astoria': {
    name: 'Astoria',
    borough: 'Queens',
    description: 'A diverse neighborhood known for its authentic Greek food, waterfront parks, and growing arts scene.',
    averageRent: '$2,800',
    walkScore: 89,
    transitScore: 78,
    highlights: ['Museum of the Moving Image', 'Astoria Park', 'Greek food scene'],
    pros: ['Great restaurants', 'Waterfront access', 'Diverse community'],
    cons: ['Limited subway lines', 'Can be noisy']
  },
  'williamsburg': {
    name: 'Williamsburg',
    borough: 'Brooklyn',
    description: 'Hip neighborhood with trendy restaurants, boutique shopping, and stunning Manhattan skyline views.',
    averageRent: '$4,200',
    walkScore: 94,
    transitScore: 85,
    highlights: ['Brooklyn Bridge views', 'Trendy dining scene', 'Artisanal markets'],
    pros: ['Vibrant nightlife', 'Great views', 'Easy Manhattan access'],
    cons: ['Very expensive', 'Overcrowded weekends']
  },
  'east-village': {
    name: 'East Village',
    borough: 'Manhattan',
    description: 'Historic bohemian neighborhood with eclectic dining, vintage shops, and vibrant nightlife.',
    averageRent: '$4,500',
    walkScore: 98,
    transitScore: 92,
    highlights: ['St. Marks Place', 'Tompkins Square Park', 'Historic venues'],
    pros: ['Rich history', 'Great nightlife', 'Central location'],
    cons: ['Very expensive', 'Can be loud at night']
  },

  // Manhattan neighborhoods
  'carroll-gardens': {
    name: 'Carroll Gardens',
    borough: 'Brooklyn',
    description: 'Charming Italian-American neighborhood with tree-lined streets, family-owned restaurants, and beautiful brownstones.',
    averageRent: '$3,800',
    walkScore: 92,
    transitScore: 88,
    highlights: ['Smith Street dining', 'Carroll Park', 'Historic brownstones'],
    pros: ['Family-friendly', 'Great Italian food', 'Beautiful architecture'],
    cons: ['Limited nightlife', 'Expensive']
  },
  'bed-stuy': {
    name: 'Bedford-Stuyvesant',
    borough: 'Brooklyn',
    description: 'Historic neighborhood with stunning Victorian architecture, rich cultural heritage, and growing arts scene.',
    averageRent: '$2,900',
    walkScore: 88,
    transitScore: 84,
    highlights: ['Restoration Hardware District', 'Herbert Von King Park', 'Historic architecture'],
    pros: ['Beautiful brownstones', 'Cultural diversity', 'Growing food scene'],
    cons: ['Some areas still developing', 'Limited subway access']
  },
  'long-island-city': {
    name: 'Long Island City',
    borough: 'Queens',
    description: 'Rapidly developing waterfront neighborhood with modern high-rises and spectacular Manhattan views.',
    averageRent: '$3,200',
    walkScore: 85,
    transitScore: 91,
    highlights: ['Gantry Plaza State Park', 'MoMA PS1', 'Skyline views'],
    pros: ['Great views', 'Easy commute', 'Modern amenities'],
    cons: ['Still developing', 'Limited character']
  },
  'park-slope': {
    name: 'Park Slope',
    borough: 'Brooklyn',
    description: 'Family-friendly neighborhood known for Prospect Park proximity, excellent schools, and Victorian architecture.',
    averageRent: '$4,100',
    walkScore: 96,
    transitScore: 89,
    highlights: ['Prospect Park', 'Park Slope Food Coop', 'Victorian homes'],
    pros: ['Great for families', 'Beautiful park', 'Excellent schools'],
    cons: ['Very expensive', 'Can feel exclusive']
  },
  'greenpoint': {
    name: 'Greenpoint',
    borough: 'Brooklyn',
    description: 'Waterfront neighborhood with a strong Polish heritage, trendy restaurants, and Manhattan skyline views.',
    averageRent: '$3,500',
    walkScore: 89,
    transitScore: 78,
    highlights: ['East River State Park', 'Polish heritage', 'Rooftop bars'],
    pros: ['Great views', 'Authentic culture', 'Growing food scene'],
    cons: ['Limited subway access', 'Industrial areas']
  },
  'bushwick': {
    name: 'Bushwick',
    borough: 'Brooklyn',
    description: 'Creative hub known for its vibrant street art, innovative dining scene, and lively nightlife.',
    averageRent: '$2,700',
    walkScore: 87,
    transitScore: 81,
    highlights: ['Street art scene', 'Creative venues', 'Diverse nightlife'],
    pros: ['Artistic community', 'Affordable options', 'Great nightlife'],
    cons: ['Some areas still rough', 'Limited amenities']
  },
  'crown-heights': {
    name: 'Crown Heights',
    borough: 'Brooklyn',
    description: 'Diverse neighborhood with rich Caribbean culture, historic architecture, and the Brooklyn Botanic Garden.',
    averageRent: '$2,600',
    walkScore: 86,
    transitScore: 88,
    highlights: ['Brooklyn Botanic Garden', 'West Indian culture', 'Historic homes'],
    pros: ['Cultural diversity', 'Good transportation', 'Affordable'],
    cons: ['Some areas developing', 'Limited dining options']
  },
  'sunset-park': {
    name: 'Sunset Park',
    borough: 'Brooklyn',
    description: 'Diverse working-class neighborhood with amazing views, authentic Asian and Latin food, and growing arts scene.',
    averageRent: '$2,400',
    walkScore: 84,
    transitScore: 82,
    highlights: ['Sunset Park views', 'Chinatown', '8th Avenue corridor'],
    pros: ['Affordable', 'Authentic food', 'Great views'],
    cons: ['Limited nightlife', 'Industrial areas']
  },
  'red-hook': {
    name: 'Red Hook',
    borough: 'Brooklyn',
    description: 'Waterfront neighborhood with cobblestone streets, artisanal food vendors, and a maritime atmosphere.',
    averageRent: '$3,000',
    walkScore: 72,
    transitScore: 65,
    highlights: ['Red Hook Lobster Pound', 'Waterfront views', 'Art galleries'],
    pros: ['Unique character', 'Waterfront access', 'Creative community'],
    cons: ['Limited transportation', 'Hurricane risk']
  },
  'dumbo': {
    name: 'DUMBO',
    borough: 'Brooklyn',
    description: 'Trendy waterfront neighborhood with cobblestone streets, tech companies, and iconic bridge views.',
    averageRent: '$5,200',
    walkScore: 91,
    transitScore: 86,
    highlights: ['Brooklyn Bridge Park', 'Time Out Market', 'Bridge views'],
    pros: ['Stunning views', 'Modern amenities', 'Great dining'],
    cons: ['Very expensive', 'Tourist crowds']
  },
  'fort-greene': {
    name: 'Fort Greene',
    borough: 'Brooklyn',
    description: 'Historic neighborhood with beautiful brownstones, Fort Greene Park, and a thriving cultural scene.',
    averageRent: '$3,400',
    walkScore: 93,
    transitScore: 90,
    highlights: ['Fort Greene Park', 'BAM Cultural District', 'Historic architecture'],
    pros: ['Rich history', 'Cultural venues', 'Great transportation'],
    cons: ['Gentrification concerns', 'Expensive']
  },
  'prospect-heights': {
    name: 'Prospect Heights',
    borough: 'Brooklyn',
    description: 'Charming neighborhood adjacent to Prospect Park with diverse dining and the Brooklyn Museum.',
    averageRent: '$3,600',
    walkScore: 94,
    transitScore: 91,
    highlights: ['Brooklyn Museum', 'Prospect Park', 'Vanderbilt Avenue'],
    pros: ['Great location', 'Cultural attractions', 'Diverse community'],
    cons: ['Expensive', 'Limited parking']
  },
  'chelsea': {
    name: 'Chelsea',
    borough: 'Manhattan',
    description: 'Trendy neighborhood known for art galleries, the High Line, and vibrant nightlife scene.',
    averageRent: '$5,500',
    walkScore: 97,
    transitScore: 94,
    highlights: ['High Line', 'Chelsea Market', 'Art galleries'],
    pros: ['Great dining', 'Art scene', 'Central location'],
    cons: ['Very expensive', 'Crowded']
  },
  'soho': {
    name: 'SoHo',
    borough: 'Manhattan',
    description: 'Upscale shopping district with cast-iron architecture, high-end boutiques, and art galleries.',
    averageRent: '$6,500',
    walkScore: 96,
    transitScore: 89,
    highlights: ['Cast-iron buildings', 'Designer shopping', 'Art galleries'],
    pros: ['Beautiful architecture', 'World-class shopping', 'Central location'],
    cons: ['Extremely expensive', 'Tourist crowds']
  },
  'west-village': {
    name: 'West Village',
    borough: 'Manhattan',
    description: 'Charming historic neighborhood with tree-lined streets, cozy cafes, and intimate restaurants.',
    averageRent: '$6,200',
    walkScore: 95,
    transitScore: 87,
    highlights: ['Washington Square Park', 'Historic streets', 'Intimate dining'],
    pros: ['Beautiful streets', 'Great restaurants', 'Historic charm'],
    cons: ['Very expensive', 'Limited subway access']
  },
  'lower-east-side': {
    name: 'Lower East Side',
    borough: 'Manhattan',
    description: 'Historic immigrant neighborhood with trendy bars, vintage shops, and rich cultural heritage.',
    averageRent: '$4,800',
    walkScore: 97,
    transitScore: 91,
    highlights: ['Tenement Museum', 'Orchard Street', 'Historic venues'],
    pros: ['Rich history', 'Great nightlife', 'Diverse dining'],
    cons: ['Can be loud', 'Expensive']
  },
  'tribeca': {
    name: 'Tribeca',
    borough: 'Manhattan',
    description: 'Upscale neighborhood with converted warehouses, celebrity residents, and high-end dining.',
    averageRent: '$7,500',
    walkScore: 94,
    transitScore: 88,
    highlights: ['Tribeca Film Festival', 'High-end dining', 'Converted lofts'],
    pros: ['Luxury living', 'Great restaurants', 'Family-friendly'],
    cons: ['Extremely expensive', 'Limited nightlife']
  },
  'financial-district': {
    name: 'Financial District',
    borough: 'Manhattan',
    description: 'Historic business district with Wall Street, One World Trade Center, and waterfront views.',
    averageRent: '$4,200',
    walkScore: 91,
    transitScore: 95,
    highlights: ['Wall Street', 'One World Trade', 'Stone Street'],
    pros: ['Historic significance', 'Great transportation', 'Waterfront access'],
    cons: ['Quiet on weekends', 'Business-focused']
  },
  'midtown': {
    name: 'Midtown',
    borough: 'Manhattan',
    description: 'Bustling commercial hub with Times Square, Broadway theaters, and world-class shopping.',
    averageRent: '$5,200',
    walkScore: 96,
    transitScore: 98,
    highlights: ['Times Square', 'Broadway theaters', 'Empire State Building'],
    pros: ['Central location', 'Great transportation', 'Entertainment'],
    cons: ['Very crowded', 'Tourist heavy']
  },
  'upper-east-side': {
    name: 'Upper East Side',
    borough: 'Manhattan',
    description: 'Upscale residential neighborhood with Museum Mile, Central Park access, and elegant architecture.',
    averageRent: '$5,800',
    walkScore: 94,
    transitScore: 89,
    highlights: ['Museum Mile', 'Central Park', 'Madison Avenue'],
    pros: ['Cultural attractions', 'Great schools', 'Upscale living'],
    cons: ['Very expensive', 'Can feel stuffy']
  },
  'upper-west-side': {
    name: 'Upper West Side',
    borough: 'Manhattan',
    description: 'Family-friendly neighborhood with Lincoln Center, Central Park, and excellent schools.',
    averageRent: '$5,400',
    walkScore: 95,
    transitScore: 92,
    highlights: ['Lincoln Center', 'Central Park', 'Columbia University'],
    pros: ['Great for families', 'Cultural venues', 'Park access'],
    cons: ['Expensive', 'Can be quiet']
  },
  'harlem': {
    name: 'Harlem',
    borough: 'Manhattan',
    description: 'Historic neighborhood with rich African-American culture, jazz heritage, and beautiful brownstones.',
    averageRent: '$2,800',
    walkScore: 89,
    transitScore: 86,
    highlights: ['Apollo Theater', 'Marcus Garvey Park', 'Jazz history'],
    pros: ['Rich culture', 'Historic architecture', 'Affordable'],
    cons: ['Some areas developing', 'Limited amenities']
  },
  'washington-heights': {
    name: 'Washington Heights',
    borough: 'Manhattan',
    description: 'Diverse hilltop neighborhood with Fort Tryon Park, affordable housing, and strong Dominican culture.',
    averageRent: '$2,200',
    walkScore: 86,
    transitScore: 83,
    highlights: ['Fort Tryon Park', 'The Cloisters', 'Dominican culture'],
    pros: ['Affordable', 'Great parks', 'Cultural diversity'],
    cons: ['Far from Midtown', 'Hilly terrain']
  },
  'inwood': {
    name: 'Inwood',
    borough: 'Manhattan',
    description: 'Northernmost Manhattan neighborhood with Inwood Hill Park, affordable rents, and diverse community.',
    averageRent: '$2,000',
    walkScore: 84,
    transitScore: 81,
    highlights: ['Inwood Hill Park', 'Dyckman Street', 'Last natural forest'],
    pros: ['Very affordable', 'Great parks', 'Quiet'],
    cons: ['Far from center', 'Limited dining']
  },
  'jackson-heights': {
    name: 'Jackson Heights',
    borough: 'Queens',
    description: 'Diverse neighborhood known as the most ethnically diverse area in the world with authentic international food.',
    averageRent: '$2,400',
    walkScore: 87,
    transitScore: 84,
    highlights: ['Diversity Plaza', 'International food', '74th Street'],
    pros: ['Cultural diversity', 'Authentic cuisine', 'Affordable'],
    cons: ['Can be crowded', 'Language barriers']
  },
  'elmhurst': {
    name: 'Elmhurst',
    borough: 'Queens',
    description: 'Diverse neighborhood with excellent Asian and Latin American food, and good transportation.',
    averageRent: '$2,300',
    walkScore: 85,
    transitScore: 82,
    highlights: ['Queens Center Mall', 'Diverse dining', 'Elmhurst Park'],
    pros: ['Great food', 'Affordable', 'Good transit'],
    cons: ['Can be busy', 'Limited nightlife']
  },
  'forest-hills': {
    name: 'Forest Hills',
    borough: 'Queens',
    description: 'Suburban-feeling neighborhood with tree-lined streets, Tudor-style homes, and the US Open tennis venue.',
    averageRent: '$2,600',
    walkScore: 82,
    transitScore: 85,
    highlights: ['Forest Hills Gardens', 'US Open', 'Austin Street'],
    pros: ['Quiet residential', 'Good schools', 'Tennis venue'],
    cons: ['Less urban feel', 'Limited nightlife']
  },
  'flushing': {
    name: 'Flushing',
    borough: 'Queens',
    description: 'Major Chinatown with authentic Asian cuisine, bustling markets, and diverse Asian communities.',
    averageRent: '$2,200',
    walkScore: 83,
    transitScore: 79,
    highlights: ['Flushing Chinatown', 'Queens Botanical Garden', 'Asian markets'],
    pros: ['Authentic Asian food', 'Affordable', 'Cultural immersion'],
    cons: ['Language barriers', 'Very crowded']
  },

  // NEW MANHATTAN NEIGHBORHOODS
  'kips-bay': {
    name: 'Kips Bay',
    borough: 'Manhattan',
    description: 'Residential neighborhood with modern high-rises, convenient location, and proximity to medical centers.',
    averageRent: '$4,800',
    walkScore: 92,
    transitScore: 90,
    highlights: ['NYU Medical Center', 'Modern buildings', 'Central location'],
    pros: ['Great transportation', 'Modern amenities', 'Central location'],
    cons: ['Lacks character', 'Can be sterile']
  },
  'midtown-east': {
    name: 'Midtown East',
    borough: 'Manhattan',
    description: 'Business district with Grand Central Terminal, luxury shopping, and corporate headquarters.',
    averageRent: '$5,400',
    walkScore: 95,
    transitScore: 96,
    highlights: ['Grand Central', 'Chrysler Building', 'Corporate offices'],
    pros: ['Excellent transit', 'Central location', 'Business amenities'],
    cons: ['Expensive', 'Business-focused']
  },
  'midtown-west': {
    name: 'Midtown West',
    borough: 'Manhattan',
    description: 'Theater district with Broadway shows, Penn Station, and vibrant entertainment scene.',
    averageRent: '$5,600',
    walkScore: 96,
    transitScore: 97,
    highlights: ['Broadway theaters', 'Penn Station', 'Madison Square Garden'],
    pros: ['Entertainment hub', 'Great transit', 'Dining options'],
    cons: ['Very crowded', 'Tourist heavy']
  },
  'hells-kitchen': {
    name: "Hell's Kitchen",
    borough: 'Manhattan',
    description: 'Former rough neighborhood now trendy with diverse restaurants, theaters, and young professionals.',
    averageRent: '$4,900',
    walkScore: 95,
    transitScore: 93,
    highlights: ['Restaurant Row', 'Intrepid Museum', 'Theater district'],
    pros: ['Great dining', 'Central location', 'Vibrant nightlife'],
    cons: ['Can be loud', 'Expensive']
  },
  'morningside-heights': {
    name: 'Morningside Heights',
    borough: 'Manhattan',
    description: 'Academic neighborhood home to Columbia University with beautiful cathedral and diverse community.',
    averageRent: '$3,200',
    walkScore: 91,
    transitScore: 88,
    highlights: ['Columbia University', 'Cathedral of St. John', 'Morningside Park'],
    pros: ['Academic atmosphere', 'Beautiful architecture', 'Diverse dining'],
    cons: ['Student-heavy', 'Can be transient']
  },
  'hamilton-heights': {
    name: 'Hamilton Heights',
    borough: 'Manhattan',
    description: 'Historic neighborhood with beautiful brownstones, Hamilton Grange, and growing arts scene.',
    averageRent: '$2,400',
    walkScore: 87,
    transitScore: 84,
    highlights: ['Hamilton Grange', 'Historic brownstones', 'Sugar Hill'],
    pros: ['Historic architecture', 'Affordable', 'Cultural heritage'],
    cons: ['Still developing', 'Limited amenities']
  },
  'greenwich-village': {
    name: 'Greenwich Village',
    borough: 'Manhattan',
    description: 'Historic bohemian neighborhood with Washington Square Park, NYU campus, and artistic heritage.',
    averageRent: '$6,000',
    walkScore: 96,
    transitScore: 89,
    highlights: ['Washington Square Park', 'NYU campus', 'Historic streets'],
    pros: ['Rich history', 'Beautiful streets', 'Cultural venues'],
    cons: ['Very expensive', 'Student crowds']
  },
  'noho': {
    name: 'NoHo',
    borough: 'Manhattan',
    description: 'Small upscale neighborhood with cast-iron architecture, high-end shopping, and historic buildings.',
    averageRent: '$6,800',
    walkScore: 95,
    transitScore: 91,
    highlights: ['Cast-iron buildings', 'Boutique shopping', 'Historic architecture'],
    pros: ['Beautiful architecture', 'Upscale shopping', 'Central location'],
    cons: ['Extremely expensive', 'Very small area']
  },
  'civic-center': {
    name: 'Civic Center',
    borough: 'Manhattan',
    description: 'Government district with City Hall, courthouses, and historic buildings.',
    averageRent: '$4,000',
    walkScore: 89,
    transitScore: 93,
    highlights: ['City Hall', 'Brooklyn Bridge', 'Federal buildings'],
    pros: ['Historic significance', 'Great transportation', 'Central location'],
    cons: ['Quiet after hours', 'Limited residential'],
  },
  'hudson-square': {
    name: 'Hudson Square',
    borough: 'Manhattan',
    description: 'Former printing district now home to tech companies, modern buildings, and growing dining scene.',
    averageRent: '$5,800',
    walkScore: 94,
    transitScore: 87,
    highlights: ['Tech companies', 'Modern architecture', 'Hudson River Park'],
    pros: ['Modern amenities', 'Growing scene', 'River access'],
    cons: ['Still developing', 'Expensive']
  },
  'roosevelt-island': {
    name: 'Roosevelt Island',
    borough: 'Manhattan',
    description: 'Unique island community with tram transportation, waterfront views, and planned development.',
    averageRent: '$3,800',
    walkScore: 85,
    transitScore: 75,
    highlights: ['Roosevelt Island Tram', 'Waterfront views', 'Planned community'],
    pros: ['Unique location', 'Great views', 'Quiet'],
    cons: ['Limited transportation', 'Isolated feel']
  },
  'hudson-yards': {
    name: 'Hudson Yards',
    borough: 'Manhattan',
    description: 'Ultra-modern development with luxury high-rises, shopping, and the Vessel landmark.',
    averageRent: '$6,200',
    walkScore: 88,
    transitScore: 89,
    highlights: ['The Vessel', 'Hudson Yards Mall', 'High Line'],
    pros: ['Ultra-modern', 'Luxury amenities', 'Great shopping'],
    cons: ['Very expensive', 'Lacks character']
  },
  'nomad': {
    name: 'NoMad',
    borough: 'Manhattan',
    description: 'Trendy neighborhood north of Madison Square Park with upscale dining and hotels.',
    averageRent: '$5,200',
    walkScore: 96,
    transitScore: 92,
    highlights: ['Madison Square Park', 'Upscale dining', 'Boutique hotels'],
    pros: ['Great location', 'Excellent dining', 'Beautiful park'],
    cons: ['Very expensive', 'Can be crowded']
  },
  'manhattan-valley': {
    name: 'Manhattan Valley',
    borough: 'Manhattan',
    description: 'Upper West Side sub-neighborhood with affordable options, diverse community, and Columbia proximity.',
    averageRent: '$3,400',
    walkScore: 93,
    transitScore: 90,
    highlights: ['Columbia proximity', 'Affordable UWS', 'Diverse community'],
    pros: ['More affordable', 'Good transportation', 'Diverse'],
    cons: ['Still developing', 'Can be transient']
  },
  'central-harlem': {
    name: 'Central Harlem',
    borough: 'Manhattan',
    description: 'Historic heart of Harlem with Apollo Theater, rich jazz heritage, and beautiful brownstones.',
    averageRent: '$2,600',
    walkScore: 90,
    transitScore: 87,
    highlights: ['Apollo Theater', 'Jazz history', 'Marcus Garvey Park'],
    pros: ['Rich culture', 'Historic significance', 'Growing scene'],
    cons: ['Some areas developing', 'Limited amenities']
  },
  'little-italy': {
    name: 'Little Italy',
    borough: 'Manhattan',
    description: 'Historic Italian neighborhood with traditional restaurants, annual festivals, and European charm.',
    averageRent: '$5,200',
    walkScore: 95,
    transitScore: 91,
    highlights: ['Mulberry Street', 'Italian restaurants', 'San Gennaro Festival'],
    pros: ['Historic charm', 'Great Italian food', 'Central location'],
    cons: ['Tourist-heavy', 'Expensive']
  },
  'nolita': {
    name: 'NoLita',
    borough: 'Manhattan',
    description: 'Trendy neighborhood with boutique shopping, upscale dining, and cobblestone streets.',
    averageRent: '$5,800',
    walkScore: 96,
    transitScore: 90,
    highlights: ['Boutique shopping', 'Cobblestone streets', 'Trendy cafes'],
    pros: ['Beautiful streets', 'Great shopping', 'Central location'],
    cons: ['Very expensive', 'Can be crowded']
  },
  'two-bridges': {
    name: 'Two Bridges',
    borough: 'Manhattan',
    description: 'Diverse waterfront neighborhood between Manhattan and Brooklyn bridges with growing development.',
    averageRent: '$4,200',
    walkScore: 91,
    transitScore: 88,
    highlights: ['Bridge views', 'Waterfront access', 'Diverse community'],
    pros: ['Great views', 'Diverse culture', 'Developing area'],
    cons: ['Still developing', 'Limited amenities']
  },
  'murray-hill': {
    name: 'Murray Hill',
    borough: 'Manhattan',
    description: 'Residential neighborhood popular with young professionals, bars, and convenient location.',
    averageRent: '$4,600',
    walkScore: 93,
    transitScore: 91,
    highlights: ['Young professional scene', 'Bar culture', 'Central location'],
    pros: ['Social scene', 'Great transportation', 'Central location'],
    cons: ['Can be rowdy', 'Expensive']
  },
  'battery-park-city': {
    name: 'Battery Park City',
    borough: 'Manhattan',
    description: 'Planned waterfront community with parks, family-friendly atmosphere, and harbor views.',
    averageRent: '$5,400',
    walkScore: 88,
    transitScore: 82,
    highlights: ['Waterfront parks', 'Family-friendly', 'Harbor views'],
    pros: ['Great for families', 'Beautiful parks', 'Safe'],
    cons: ['Can feel isolated', 'Expensive']
  },

  // NEW BROOKLYN NEIGHBORHOODS
  'prospect-lefferts-gardens': {
    name: 'Prospect Lefferts Gardens',
    borough: 'Brooklyn',
    description: 'Diverse neighborhood with beautiful Victorian homes, Prospect Park access, and Caribbean culture.',
    averageRent: '$2,800',
    walkScore: 87,
    transitScore: 85,
    highlights: ['Victorian architecture', 'Prospect Park', 'Caribbean culture'],
    pros: ['Beautiful homes', 'Cultural diversity', 'Park access'],
    cons: ['Some areas developing', 'Limited nightlife']
  },
  'vinegar-hill': {
    name: 'Vinegar Hill',
    borough: 'Brooklyn',
    description: 'Small historic neighborhood with cobblestone streets, industrial charm, and waterfront views.',
    averageRent: '$3,800',
    walkScore: 85,
    transitScore: 78,
    highlights: ['Cobblestone streets', 'Historic charm', 'Waterfront'],
    pros: ['Unique character', 'Historic architecture', 'Quiet'],
    cons: ['Very small', 'Limited amenities']
  },
  'windsor-terrace': {
    name: 'Windsor Terrace',
    borough: 'Brooklyn',
    description: 'Quiet family-friendly neighborhood bordering Prospect Park with small-town feel.',
    averageRent: '$3,200',
    walkScore: 88,
    transitScore: 82,
    highlights: ['Prospect Park border', 'Family-friendly', 'Quiet streets'],
    pros: ['Great for families', 'Park access', 'Quiet'],
    cons: ['Limited nightlife', 'Few restaurants']
  },
  'cobble-hill': {
    name: 'Cobble Hill',
    borough: 'Brooklyn',
    description: 'Charming neighborhood with historic brownstones, boutique shopping, and family-friendly atmosphere.',
    averageRent: '$3,900',
    walkScore: 91,
    transitScore: 86,
    highlights: ['Historic brownstones', 'Court Street shops', 'Cobble Hill Park'],
    pros: ['Beautiful architecture', 'Family-friendly', 'Great shopping'],
    cons: ['Expensive', 'Limited nightlife']
  },
  'boerum-hill': {
    name: 'Boerum Hill',
    borough: 'Brooklyn',
    description: 'Historic neighborhood with beautiful brownstones, diverse dining, and proximity to downtown Brooklyn.',
    averageRent: '$3,600',
    walkScore: 92,
    transitScore: 89,
    highlights: ['Historic brownstones', 'Smith Street', 'Atlantic Avenue'],
    pros: ['Beautiful architecture', 'Great dining', 'Central location'],
    cons: ['Expensive', 'Can be busy']
  },
  'gowanus': {
    name: 'Gowanus',
    borough: 'Brooklyn',
    description: 'Industrial neighborhood undergoing rapid development with art galleries, breweries, and waterfront.',
    averageRent: '$3,400',
    walkScore: 84,
    transitScore: 79,
    highlights: ['Art galleries', 'Breweries', 'Industrial character'],
    pros: ['Artistic community', 'Growing scene', 'Unique character'],
    cons: ['Still developing', 'Industrial pollution']
  },
  'clinton-hill': {
    name: 'Clinton Hill',
    borough: 'Brooklyn',
    description: 'Historic neighborhood with beautiful brownstones, Pratt Institute, and growing arts scene.',
    averageRent: '$3,100',
    walkScore: 91,
    transitScore: 87,
    highlights: ['Pratt Institute', 'Historic architecture', 'Arts scene'],
    pros: ['Beautiful brownstones', 'Cultural scene', 'Good transportation'],
    cons: ['Some areas developing', 'Can be transitional']
  },
  'downtown-brooklyn': {
    name: 'Downtown Brooklyn',
    borough: 'Brooklyn',
    description: 'Business and cultural hub with modern high-rises, shopping, and cultural institutions.',
    averageRent: '$3,800',
    walkScore: 94,
    transitScore: 95,
    highlights: ['BAM Cultural District', 'Shopping centers', 'Modern towers'],
    pros: ['Great transportation', 'Cultural venues', 'Modern amenities'],
    cons: ['Can feel impersonal', 'Busy traffic']
  },
'columbia-st-waterfront-district': {
   name: 'Columbia Street Waterfront District',
   borough: 'Brooklyn',
   description: 'Small waterfront neighborhood with harbor views, quiet streets, and maritime history.',
   averageRent: '$3,600',
   walkScore: 82,
   transitScore: 75,
   highlights: ['Harbor views', 'Maritime history', 'Quiet streets'],
   pros: ['Waterfront access', 'Quiet', 'Historic charm'],
   cons: ['Limited amenities', 'Small area']
 },
 'brooklyn-heights': {
   name: 'Brooklyn Heights',
   borough: 'Brooklyn',
   description: 'Historic neighborhood with stunning Manhattan views, beautiful brownstones, and the Brooklyn Promenade.',
   averageRent: '$4,800',
   walkScore: 94,
   transitScore: 91,
   highlights: ['Brooklyn Promenade', 'Historic brownstones', 'Manhattan views'],
   pros: ['Stunning views', 'Historic charm', 'Great transportation'],
   cons: ['Very expensive', 'Tourist crowds']
 },
 'ditmas-park': {
   name: 'Ditmas Park',
   borough: 'Brooklyn',
   description: 'Victorian neighborhood with large freestanding houses, tree-lined streets, and diverse community.',
   averageRent: '$2,900',
   walkScore: 83,
   transitScore: 78,
   highlights: ['Victorian houses', 'Tree-lined streets', 'Diverse dining'],
   pros: ['Beautiful houses', 'Suburban feel', 'Diverse community'],
   cons: ['Limited subway access', 'Some areas developing']
 },

 // NEW QUEENS NEIGHBORHOODS
 'corona': {
   name: 'Corona',
   borough: 'Queens',
   description: 'Diverse working-class neighborhood with authentic Latin American food and Citi Field nearby.',
   averageRent: '$2,200',
   walkScore: 82,
   transitScore: 80,
   highlights: ['Citi Field', 'Latin American culture', 'Diverse dining'],
   pros: ['Authentic culture', 'Affordable', 'Sports venue'],
   cons: ['Can be crowded', 'Limited amenities']
 },
 'ridgewood': {
   name: 'Ridgewood',
   borough: 'Queens',
   description: 'Emerging neighborhood with artistic community, historic architecture, and affordable rents.',
   averageRent: '$2,400',
   walkScore: 85,
   transitScore: 82,
   highlights: ['Historic architecture', 'Arts scene', 'Affordable'],
   pros: ['Growing arts scene', 'Affordable', 'Good transit'],
   cons: ['Still developing', 'Limited dining']
 },
 'maspeth': {
   name: 'Maspeth',
   borough: 'Queens',
   description: 'Quiet residential neighborhood with suburban feel, good schools, and family-friendly atmosphere.',
   averageRent: '$2,300',
   walkScore: 78,
   transitScore: 75,
   highlights: ['Suburban feel', 'Good schools', 'Family-friendly'],
   pros: ['Quiet', 'Good for families', 'Affordable'],
   cons: ['Limited nightlife', 'Car-dependent']
 },
 'rego-park': {
   name: 'Rego Park',
   borough: 'Queens',
   description: 'Diverse neighborhood with excellent shopping, good transportation, and multicultural dining.',
   averageRent: '$2,500',
   walkScore: 84,
   transitScore: 83,
   highlights: ['Queens Center Mall', 'Diverse community', 'Good transit'],
   pros: ['Great shopping', 'Diverse dining', 'Good transportation'],
   cons: ['Can be busy', 'Limited character']
 },
 'bayside': {
   name: 'Bayside',
   borough: 'Queens',
   description: 'Suburban neighborhood with single-family homes, good schools, and waterfront access.',
   averageRent: '$2,600',
   walkScore: 75,
   transitScore: 72,
   highlights: ['Single-family homes', 'Good schools', 'Waterfront'],
   pros: ['Suburban feel', 'Great schools', 'Safe'],
   cons: ['Car-dependent', 'Limited nightlife']
 },
 'ditmars-steinway': {
   name: 'Ditmars Steinway',
   borough: 'Queens',
   description: 'Northern Astoria area with authentic Greek culture, affordable dining, and community feel.',
   averageRent: '$2,700',
   walkScore: 86,
   transitScore: 76,
   highlights: ['Greek culture', 'Authentic dining', 'Community feel'],
   pros: ['Authentic culture', 'Good food', 'Community oriented'],
   cons: ['Limited subway', 'Can be quiet']
 },
 'sunnyside': {
   name: 'Sunnyside',
   borough: 'Queens',
   description: 'Historic planned community with garden apartments, diverse dining, and strong neighborhood feel.',
   averageRent: '$2,800',
   walkScore: 87,
   transitScore: 84,
   highlights: ['Garden apartments', 'Historic planning', 'Diverse dining'],
   pros: ['Unique architecture', 'Good transit', 'Community feel'],
   cons: ['Limited nightlife', 'Can be quiet']
 },
 'woodside': {
   name: 'Woodside',
   borough: 'Queens',
   description: 'Diverse neighborhood with excellent transportation, authentic international food, and affordable rents.',
   averageRent: '$2,600',
   walkScore: 85,
   transitScore: 86,
   highlights: ['International food', 'Great transit', 'Diverse community'],
   pros: ['Excellent transportation', 'Authentic cuisine', 'Affordable'],
   cons: ['Can be noisy', 'Limited character']
 },
 'briarwood': {
   name: 'Briarwood',
   borough: 'Queens',
   description: 'Quiet residential neighborhood with suburban feel, good schools, and family-oriented community.',
   averageRent: '$2,400',
   walkScore: 79,
   transitScore: 78,
   highlights: ['Suburban feel', 'Good schools', 'Family-oriented'],
   pros: ['Quiet', 'Good for families', 'Affordable'],
   cons: ['Limited dining', 'Car-dependent']
 },
 'fresh-meadows': {
   name: 'Fresh Meadows',
   borough: 'Queens',
   description: 'Suburban neighborhood with garden apartments, good schools, and family-friendly atmosphere.',
   averageRent: '$2,500',
   walkScore: 76,
   transitScore: 74,
   highlights: ['Garden apartments', 'Good schools', 'Suburban feel'],
   pros: ['Great for families', 'Good schools', 'Quiet'],
   cons: ['Car-dependent', 'Limited nightlife']
 },

 // NEW BRONX NEIGHBORHOODS
 'kingsbridge': {
   name: 'Kingsbridge',
   borough: 'Bronx',
   description: 'Historic neighborhood with affordable housing, good transportation, and diverse community.',
   averageRent: '$1,800',
   walkScore: 82,
   transitScore: 79,
   highlights: ['Historic area', 'Affordable housing', 'Good transit'],
   pros: ['Very affordable', 'Good transportation', 'Historic character'],
   cons: ['Some areas developing', 'Limited amenities']
 },
 'norwood': {
   name: 'Norwood',
   borough: 'Bronx',
   description: 'Residential neighborhood with affordable housing, parks, and strong community feel.',
   averageRent: '$1,700',
   walkScore: 80,
   transitScore: 76,
   highlights: ['Affordable housing', 'Community feel', 'Parks'],
   pros: ['Very affordable', 'Community oriented', 'Green spaces'],
   cons: ['Limited dining', 'Far from Manhattan']
 },
 'mott-haven': {
   name: 'Mott Haven',
   borough: 'Bronx',
   description: 'Emerging neighborhood with growing arts scene, waterfront development, and affordable housing.',
   averageRent: '$2,000',
   walkScore: 84,
   transitScore: 82,
   highlights: ['Arts scene', 'Waterfront development', 'Historic district'],
   pros: ['Growing arts scene', 'Affordable', 'Waterfront access'],
   cons: ['Still developing', 'Some areas rough']
 },
 'melrose': {
   name: 'Melrose',
   borough: 'Bronx',
   description: 'Diverse neighborhood with affordable housing, good transportation, and growing cultural scene.',
   averageRent: '$1,900',
   walkScore: 83,
   transitScore: 81,
   highlights: ['Diverse community', 'Good transit', 'Cultural venues'],
   pros: ['Very affordable', 'Good transportation', 'Cultural diversity'],
   cons: ['Some areas developing', 'Limited amenities']
 },
 'south-bronx': {
   name: 'South Bronx',
   borough: 'Bronx',
   description: 'Historic area known for hip-hop culture, growing arts scene, and affordable housing.',
   averageRent: '$1,800',
   walkScore: 81,
   transitScore: 83,
   highlights: ['Hip-hop history', 'Arts scene', 'Cultural significance'],
   pros: ['Rich culture', 'Affordable', 'Historic significance'],
   cons: ['Some areas developing', 'Limited amenities']
 },
 'concourse': {
   name: 'Concourse',
   borough: 'Bronx',
   description: 'Central Bronx neighborhood with Yankee Stadium, good transportation, and diverse community.',
   averageRent: '$1,900',
   walkScore: 85,
   transitScore: 86,
   highlights: ['Yankee Stadium', 'Good transit', 'Grand Concourse'],
   pros: ['Sports venue', 'Good transportation', 'Historic boulevard'],
   cons: ['Can be crowded on game days', 'Some areas developing']
 }
};


export const capitalizeNeighborhood = (neighborhood: string): string => {
  return neighborhood
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getNeighborhoodInfo = (neighborhoodSlug: string): NeighborhoodInfo | null => {
  return neighborhoods[neighborhoodSlug] || null;
};
