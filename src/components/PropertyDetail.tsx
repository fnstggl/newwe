
import React, { useState } from 'react';
import { UndervaluedSales, UndervaluedRentals } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Home, DollarSign, ChevronDown } from 'lucide-react';
import BookmarkButton from './BookmarkButton';
import TourRequestForm from './TourRequestForm';

interface PropertyDetailProps {
  property: UndervaluedSales | UndervaluedRentals;
  isRental?: boolean;
  onClose: () => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, isRental = false, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showTourRequest, setShowTourRequest] = useState(false);

  // Calculate grade from score for rent-stabilized properties
  const calculateGradeFromScore = (score: number): string => {
    if (score >= 98) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 88) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 79) return 'B-';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'C-';
    return 'D';
  };

  // Process images to handle different formats
  const processImages = () => {
    if (!property.images || property.images.length === 0) {
      return [];
    }

    return property.images.map((img: any) => {
      if (typeof img === 'string') {
        return img;
      }
      if (typeof img === 'object' && img !== null) {
        return img.url || img.image_url || '/placeholder.svg';
      }
      return '/placeholder.svg';
    });
  };

  const images = processImages();
  const hasImages = images.length > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const getGradeTheme = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
        return {
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-500',
          glowColor: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
          marketGlow: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]'
        };
      case 'A':
      case 'A-':
        return {
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-500',
          textColor: 'text-purple-500',
          glowColor: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
          marketGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]'
        };
      case 'B+':
      case 'B':
      case 'B-':
        return {
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-500',
          glowColor: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          marketGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]'
        };
      default:
        return {
          bgColor: 'bg-white/20',
          borderColor: 'border-white',
          textColor: 'text-white',
          glowColor: 'shadow-[0_0_20px_rgba(255,255,255,0.3)]',
          marketGlow: 'shadow-[0_0_30px_rgba(255,255,255,0.4)]'
        };
    }
  };

  // Get neighborhood description and details
  const getNeighborhoodInfo = (neighborhood: string | null) => {
    if (!neighborhood) return null;
    
    const neighborhoodData: { [key: string]: { description: string; pros: string[]; cons: string[] } } = {
      'Upper East Side': {
        description: 'A sophisticated and upscale neighborhood known for its luxury shopping, world-class museums, and elegant pre-war buildings. Home to Museum Mile and Central Park\'s eastern border.',
        pros: ['Great for families', 'Excellent schools', 'Beautiful architecture'],
        cons: ['Limited nightlife', 'More expensive', 'Less diverse dining']
      },
      'Upper West Side': {
        description: 'A cultural hub with a neighborhood feel, featuring tree-lined streets, historic brownstones, and proximity to Central Park and Lincoln Center.',
        pros: ['Family-friendly', 'Great culture scene', 'Good restaurants'],
        cons: ['Can be quiet at night', 'Limited shopping', 'Tourist crowds']
      },
      'Lower East Side': {
        description: 'A vibrant and eclectic neighborhood that blends historic immigrant culture with modern hipster appeal, known for its nightlife and diverse food scene.',
        pros: ['Great nightlife', 'Excellent food scene', 'Rich history'],
        cons: ['Can be noisy', 'Limited green space', 'Crowded on weekends']
      },
      'SoHo': {
        description: 'A trendy shopping district with cobblestone streets and cast-iron architecture, famous for high-end boutiques, art galleries, and loft-style living.',
        pros: ['Amazing shopping', 'Beautiful architecture', 'Great for art lovers'],
        cons: ['Very expensive', 'Tourist heavy', 'Limited local amenities']
      },
      'Chelsea': {
        description: 'A dynamic neighborhood known for its art galleries, the High Line park, and vibrant nightlife scene, with a mix of modern and historic architecture.',
        pros: ['Great art scene', 'Excellent nightlife', 'Good transportation'],
        cons: ['Can be expensive', 'Crowded streets', 'Limited parking']
      },
      'Greenwich Village': {
        description: 'A charming bohemian neighborhood with tree-lined streets, historic townhouses, and a rich artistic heritage, known for its cozy cafes and intimate venues.',
        pros: ['Charming atmosphere', 'Great cafes', 'Rich history'],
        cons: ['Very expensive', 'Limited space', 'Tourist crowds']
      },
      'East Village': {
        description: 'A gritty and artistic neighborhood with a punk rock heritage, known for its dive bars, experimental restaurants, and young creative community.',
        pros: ['Great nightlife', 'Diverse food scene', 'Artistic community'],
        cons: ['Can be noisy', 'Less family-friendly', 'Limited green space']
      },
      'Tribeca': {
        description: 'An upscale neighborhood with cobblestone streets and converted industrial buildings, known for its celebrity residents and high-end dining scene.',
        pros: ['Luxury living', 'Excellent restaurants', 'Quiet streets'],
        cons: ['Very expensive', 'Limited nightlife', 'Can feel isolated']
      },
      'Williamsburg': {
        description: 'A trendy Brooklyn neighborhood across the East River, known for its hipster culture, artisanal food scene, and stunning Manhattan skyline views.',
        pros: ['Great food scene', 'Vibrant nightlife', 'Beautiful waterfront'],
        cons: ['Can be pretentious', 'Expensive for Brooklyn', 'Limited subway access']
      },
      'Park Slope': {
        description: 'A family-friendly Brooklyn neighborhood with tree-lined streets, Victorian brownstones, and proximity to Prospect Park, known for its community feel.',
        pros: ['Very family-friendly', 'Beautiful architecture', 'Great parks'],
        cons: ['Can be quiet', 'Limited nightlife', 'Expensive for families']
      }
    };

    return neighborhoodData[neighborhood] || {
      description: `${neighborhood} is a distinctive New York neighborhood with its own unique character and charm, offering residents a blend of urban convenience and local community feel.`,
      pros: ['Good transportation', 'Local character', 'Urban convenience'],
      cons: ['Varies by location', 'City noise', 'Parking challenges']
    };
  };

  // Check if this is a rent-stabilized property
  const isRentStabilized = (property as any).isRentStabilized;
  
  // Determine the display grade
  const displayGrade = isRentStabilized 
    ? calculateGradeFromScore(Number(property.score))
    : String(property.grade);

  const gradeTheme = getGradeTheme(displayGrade);

  const price = isRental 
    ? (property as UndervaluedRentals).monthly_rent 
    : (property as UndervaluedSales).price;

  const pricePerSqft = isRental
    ? (property as UndervaluedRentals).rent_per_sqft
    : (property as UndervaluedSales).price_per_sqft;

  const currentImageUrl = hasImages ? images[currentImageIndex] : '/placeholder.svg';

  // Truncate description for preview
  const truncateDescription = (text: string, wordLimit: number = 35) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const shouldShowReadMore = property.description && property.description.split(' ').length > 35;

  // Get the market analysis text for rent-stabilized properties
  const getMarketAnalysisText = () => {
    if (isRentStabilized && (property as any).undervaluation_analysis) {
      const analysis = (property as any).undervaluation_analysis;
      
      // If it's a string, return it directly
      if (typeof analysis === 'string') {
        return analysis;
      }
      
      // If it's an object, try to extract the explanation or methodology
      if (typeof analysis === 'object' && analysis !== null) {
        return analysis.explanation || analysis.methodology || analysis.summary || 
               (typeof analysis === 'object' ? JSON.stringify(analysis) : '');
      }
    }
    
    // Fallback to existing reasoning for non-rent-stabilized properties
    return property.reasoning || '';
  };

  const neighborhoodInfo = getNeighborhoodInfo(property.neighborhood);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-6xl mx-auto bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-700/50">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
              <h1 className="text-2xl font-bold text-white tracking-tight">Property Details</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-6">
              {hasImages && (
                <div className="relative mb-8">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-800">
                    <img
                      src={currentImageUrl}
                      alt={property.address}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  {/* Bookmark button in top right of image */}
                  <div className="absolute top-4 right-4 z-30">
                    <BookmarkButton 
                      propertyId={property.id}
                      propertyType={isRental ? 'rental' : 'sale'}
                    />
                  </div>
                  
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Address, Price and Score */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{property.address}</h2>
                      <div className="flex items-center text-gray-400 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        {property.neighborhood && `${property.neighborhood}, `}
                        {property.borough}
                      </div>
                      {/* Price moved here */}
                      <div className="text-3xl font-bold text-white mb-2">
                        {formatPrice(price)}{isRental ? '/mo' : ''}
                      </div>
                      {pricePerSqft && (
                        <div className="text-gray-300 mb-4">
                          {formatPrice(pricePerSqft)}/sqft
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <Badge className="bg-white/20 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] border-2 px-4 py-2 text-lg font-bold">
                        {displayGrade}
                      </Badge>
                      <div className={`${gradeTheme.bgColor} ${gradeTheme.borderColor} ${gradeTheme.glowColor} border rounded-full px-3 py-1 flex items-center space-x-1`}>
                        <span className={`text-xs ${gradeTheme.textColor} font-medium`}>Deal Score:</span>
                        <span className={`text-sm font-bold ${gradeTheme.textColor}`}>{property.score}</span>
                      </div>

                      {/* Tour Request Button for Sales Properties Only */}
                      {!isRental && (
                        <Button
                          onClick={() => setShowTourRequest(true)}
                          className="bg-white text-black hover:bg-gray-200 rounded-full font-semibold px-6 py-2 mt-2"
                        >
                          Request Tour
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Property Details - Updated to include Built year */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Bedrooms:</span>
                            <span className="text-white">{property.bedrooms || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Bathrooms:</span>
                            <span className="text-white">{property.bathrooms || 0}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {property.sqft && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Square Feet:</span>
                              <span className="text-white">{property.sqft}</span>
                            </div>
                          )}
                          {property.days_on_market && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Days on Market:</span>
                              <span className="text-white">{property.days_on_market}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {property.property_type && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Type:</span>
                              <span className="text-white capitalize">{property.property_type}</span>
                            </div>
                          )}
                          {property.built_in && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Built:</span>
                              <span className="text-white">{property.built_in}</span>
                            </div>
                          )}
                          {isRental && (property as UndervaluedRentals).no_fee && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Broker Fee:</span>
                              <span className="text-green-400">No Fee</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Market Analysis */}
                  <Card className={`bg-gray-900/95 ${gradeTheme.borderColor} ${gradeTheme.marketGlow} border-2`}>
                    <CardHeader>
                      <CardTitle className="text-white">Market Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${gradeTheme.textColor} mb-1`}>
                          {Math.round(property.discount_percent)}%
                        </div>
                        <div className="text-sm text-gray-400">Below Market Value</div>
                      </div>
                      
                      {getMarketAnalysisText() && (
                        <div className="text-sm text-gray-300 leading-relaxed">
                          {getMarketAnalysisText()}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rent-Stabilized Analysis Section */}
                  {isRentStabilized && (property as any).rent_stabilization_analysis && (
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          Rent-Stabilized Analysis
                          <Badge variant="outline" className="ml-2 text-xs border-green-600 text-green-400">
                            Rent-stabilized
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(property as any).rent_stabilization_analysis?.explanation && (
                          <div className="text-sm text-gray-300 leading-relaxed">
                            <strong>Analysis:</strong> {(property as any).rent_stabilization_analysis.explanation}
                          </div>
                        )}
                        
                        {(property as any).rent_stabilization_analysis?.key_factors && 
                         (property as any).rent_stabilization_analysis.key_factors.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Key Factors:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                              {(property as any).rent_stabilization_analysis.key_factors.map((factor: string, index: number) => (
                                <li key={index}>{factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {(property as any).rent_stabilized_confidence && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Confidence Level:</span>
                            <span className="text-green-400">{(property as any).rent_stabilized_confidence}%</span>
                          </div>
                        )}
                        
                        {(property as any).potential_monthly_savings && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Potential Monthly Savings:</span>
                            <span className="text-green-400">{formatPrice((property as any).potential_monthly_savings)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Description with collapsible */}
                  {property.description && (
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {shouldShowReadMore ? (
                          <Collapsible open={isDescriptionExpanded} onOpenChange={setIsDescriptionExpanded}>
                            <div className="text-gray-300 leading-relaxed">
                              {isDescriptionExpanded ? property.description : truncateDescription(property.description)}
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-3 text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                              >
                                <span className="flex items-center">
                                  {isDescriptionExpanded ? 'Show less' : 'Show more'}
                                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
                                </span>
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        ) : (
                          <p className="text-gray-300 leading-relaxed">{property.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Amenities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                              {amenity.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar - About the Neighborhood */}
                <div className="space-y-6">
                  {neighborhoodInfo && (
                    <Card className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">About the Neighborhood</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {neighborhoodInfo.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-green-400 mb-1">Great for:</h4>
                            <p className="text-xs text-gray-400">{neighborhoodInfo.pros[0]}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-yellow-400 mb-1">Good for:</h4>
                            <p className="text-xs text-gray-400">{neighborhoodInfo.pros[1]}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-red-400 mb-1">Not ideal for:</h4>
                            <p className="text-xs text-gray-400">{neighborhoodInfo.cons[0]}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Request Form Modal */}
      {showTourRequest && (
        <TourRequestForm
          propertyId={property.id}
          propertyAddress={property.address}
          onClose={() => setShowTourRequest(false)}
        />
      )}
    </>
  );
};

export default PropertyDetail;
