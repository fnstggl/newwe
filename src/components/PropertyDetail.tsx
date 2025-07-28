import React, { useState, useEffect, useRef } from 'react';
import { UndervaluedSales, UndervaluedRentals } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Home, DollarSign, ChevronDown, ExternalLink } from 'lucide-react';
import BookmarkButton from './BookmarkButton';
import TourRequestForm from './TourRequestForm';
import QuestionForm from './QuestionForm';
import { getNeighborhoodInfo, capitalizeNeighborhood } from '@/data/neighborhoodData';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HoverButton } from '@/components/ui/hover-button';

interface PropertyDetailProps {
  property: UndervaluedSales | UndervaluedRentals;
  isRental?: boolean;
  onClose: () => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, isRental = false, onClose }) => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showTourRequest, setShowTourRequest] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const [animatedSavings, setAnimatedSavings] = useState(0);
  const savingsRef = useRef<HTMLSpanElement | null>(null);
const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
      }
    },
    { threshold: 0.6 }
  );

  if (savingsRef.current) {
    observer.observe(savingsRef.current);
  }

  return () => {
    if (savingsRef.current) {
      observer.unobserve(savingsRef.current);
    }
  };
}, [hasAnimated]);

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

  // Get discount percent and annual savings based on property type
  const getDiscountPercent = () => {
    if (isRentStabilized) {
      return (property as any).undervaluation_percent;
    } else if (isRental) {
      return (property as UndervaluedRentals).discount_percent;
    } else {
      return (property as UndervaluedSales).discount_percent;
    }
  };

  const getAnnualSavings = () => {
    if (isRentStabilized) {
      return (property as any).potential_annual_savings;
    } else if (isRental) {
      return (property as UndervaluedRentals).annual_savings;
    } else {
      return (property as any).potential_savings || 0;
    }
  };

  const discountPercent = getDiscountPercent();
  const annualSavings = getAnnualSavings();
  useEffect(() => {
  if (!hasAnimated || !annualSavings || animatedSavings >= annualSavings) return;

  let frameId: number;
  const duration = 1200;
  const start = performance.now();

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = Math.pow(progress, 0.75);
    const value = Math.floor(eased * annualSavings);
    setAnimatedSavings(value);

    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
    }
  };

  frameId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frameId);
}, [hasAnimated, annualSavings]);

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xl z-50 overflow-y-auto">
        <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-black/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/15">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-6">
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
  className="absolute left-4 top-1/2 transform -translate-y-1/2
             bg-white/20 text-white rounded-full
             border border-white/20 shadow-xl backdrop-blur-md
             transition duration-200 ease-in-out hover:bg-white/30
             hover:scale-105 hover:shadow-2xl"
  onClick={prevImage}
>
  <ChevronLeft className="w-5 h-5 stroke-white" />
</Button>
                      <Button
  variant="ghost"
  size="icon"
  className="absolute right-4 top-1/2 transform -translate-y-1/2
             bg-white/20 text-white rounded-full
             border border-white/20 shadow-xl backdrop-blur-md
             transition duration-200 ease-in-out hover:bg-white/30
             hover:scale-105 hover:shadow-2xl"
  onClick={nextImage}
>
  <ChevronRight className="w-5 h-5 stroke-white" />
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
                  {/* Address and Price */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-2">{property.address}</h2>
                      <div className="flex items-center text-gray-400 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        {property.neighborhood && `${capitalizeNeighborhood(property.neighborhood)}, `}
                        {capitalizeNeighborhood(property.borough)}
                      </div>
                      {/* Price */}
                      <div className="text-3xl font-bold text-white mb-2">
                        {formatPrice(price)}{isRental ? '/mo' : ''}
                      </div>
                      {pricePerSqft && (
                        <div className="text-gray-300 mb-4">
                          {formatPrice(pricePerSqft)}/sqft
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Property Details - Updated to show "Studio" for 0 bedrooms and change null value color */}
                  <Card className="bg-black border-gray-700">
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
  <span className="text-gray-400">Bedrooms:</span>
  {property.bedrooms === 0 ? (
    <span className="text-white/60">Studio</span>
  ) : property.bedrooms > 0 ? (
    <span className="text-white/80">
  {String(property.bedrooms)
    .split(' ')
    .map((part, i) =>
      part === '0' || part === '00' ? (
        <span key={i} style={{ color: '#19202D' }}>0</span>
      ) : (
        <span key={i}>{part}</span>
      )
    )}
</span>
  ) : (
    <span style={{ color: '#19202D' }}>N/A</span>
  )}
</div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Bathrooms:</span>
                            <span className="text-white">
                              {property.bathrooms && property.bathrooms > 0 
                                ? property.bathrooms 
                                : <span style={{ color: '#19202D' }}>N/A</span>
                              }
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {property.sqft && property.sqft > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Square Feet:</span>
                              <span className="text-white">{property.sqft}</span>
                            </div>
                          )}
                          {property.days_on_market && property.days_on_market > 0 && (
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
                          {property.built_in && property.built_in > 0 && (
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
                  <Card className={`bg-black ${gradeTheme.borderColor} ${gradeTheme.marketGlow} border-2`}>
                    <CardHeader>
                      <CardTitle className="text-white">Market Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user ? (
                        <>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${gradeTheme.textColor} mb-1`}>
                              {Math.round(discountPercent)}%
                            </div>
                            <div className="text-sm text-gray-400">Below Market Value</div>
                          </div>
                          
                          {getMarketAnalysisText() && (
                            <div className="text-sm text-gray-300 leading-relaxed">
                              {getMarketAnalysisText()}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="relative">
                          <div className="blur-sm">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${gradeTheme.textColor} mb-1`}>
                                {Math.round(discountPercent)}%
                              </div>
                              <div className="text-sm text-gray-400">Below Market Value</div>
                            </div>
                            
                            {getMarketAnalysisText() && (
                              <div className="text-sm text-gray-300 leading-relaxed">
                                {getMarketAnalysisText()}
                              </div>
                            )}
                          </div>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-lg">
                            <div className="text-center">
                              <p className="text-white text-sm mb-3 font-medium">
                                Want to unlock the full analysis?
                              </p>
                              <Button
                                onClick={() => navigate('/join')}
                                className="bg-white text-black hover:bg-gray-200 rounded-full font-semibold px-6 py-2 text-sm"
                              >
                                Create free account
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rent-Stabilized Analysis Section */}
                  {isRentStabilized && (property as any).rent_stabilization_analysis && (
                    <Card className="bg-black border-gray-700">
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
                    <Card className="bg-black border-gray-700">
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
                    <Card className="bg-black border-gray-700">
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

                {/* Sidebar - Grade/Deal Score + About the Neighborhood + Stats */}
                <div className="space-y-6 mt-9">
                  {/* Grade and Deal Score moved to top of sidebar */}
                  <div className="flex flex-col items-end space-y-3">
                    <Badge className="bg-white/20 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] border-2 px-4 py-2 text-lg font-bold">
                      {displayGrade}
                    </Badge>
                    <div className={`${gradeTheme.bgColor} ${gradeTheme.borderColor} ${gradeTheme.glowColor} border rounded-full px-3 py-1 flex items-center space-x-1`}>
                      <span className={`text-xs ${gradeTheme.textColor} font-medium`}>Deal Score:</span>
                      <span className={`text-sm font-bold ${gradeTheme.textColor}`}>{property.score}</span>
                    </div>
                  </div>

                  {/* About the Neighborhood - now aligned with property details */}
                  {neighborhoodInfo && (
                    <Card className="bg-black border-gray-700">
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
                            <p className="text-xs text-gray-400">{neighborhoodInfo.pros[1] || neighborhoodInfo.pros[0]}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-red-400 mb-1">Not ideal for:</h4>
                            <p className="text-xs text-gray-400">{neighborhoodInfo.cons[0]}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Annual Savings + Monthly Tax/HOA for Sales */}
                  <Card className="bg-black border-gray-700">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {annualSavings && (
                          <div className="flex justify-between items-center">
                            <div className="flex justify-between items-center">
 <div className="text-sm text-gray-400 flex items-baseline gap-1">
  <span>{isRental ? 'Est Annual Savings:' : 'Est Savings:'}</span>
  <span 
    className="text-lg font-bold text-white" 
    ref={savingsRef}
  >
    {formatPrice(animatedSavings || 0)}
  </span>
</div>
                          </div>
                        )}
                        
                        {/* Monthly HOA and Tax for Sales Properties */}
                        {!isRental && (
                          <>
                            {(property as UndervaluedSales).monthly_hoa && (property as UndervaluedSales).monthly_hoa > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Monthly HOA:</span>
                                <span className="text-sm font-medium text-white">
                                  {formatPrice((property as UndervaluedSales).monthly_hoa)}
                                </span>
                              </div>
                            )}
                            {(property as UndervaluedSales).monthly_tax && (property as UndervaluedSales).monthly_tax > 0 && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Monthly Tax:</span>
                                <span className="text-sm font-medium text-white">
                                  {formatPrice((property as UndervaluedSales).monthly_tax)}
                                </span>
                              </div>
                            )}
                             {((property as UndervaluedSales).monthly_hoa && (property as UndervaluedSales).monthly_hoa > 0) && 
                              ((property as UndervaluedSales).monthly_tax && (property as UndervaluedSales).monthly_tax > 0) && (
                              <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                                <span className="text-sm text-gray-400 font-semibold">Total Monthly:</span>
                                <span className="text-sm font-bold text-white">
                                  {formatPrice(
                                    ((property as UndervaluedSales).monthly_hoa || 0) + 
                                    ((property as UndervaluedSales).monthly_tax || 0)
                                  )}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Request Tour Button for Rentals - opens StreetEasy */}
                  {isRental && (
                    <Button
                      onClick={() => window.open(`https://www.streeteasy.com/rental/${(property as any).listing_id}`, '_blank')}
                      className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-semibold px-6 py-3 flex items-center justify-center"
                    >
                      Request Tour
                      <ExternalLink className="h-4 w-4 ml-2 text-black" />
                    </Button>
                  )}
                  
                  {/* Early Access CTA Box for Rentals - positioned below Request Tour */}
                  {isRental && userProfile?.subscription_plan !== 'unlimited' && (
                    <div 
                      className="rounded-2xl border-2 p-6 text-center space-y-3"
                      style={{
                        backgroundColor: '#000f3b',
                        borderColor: '#0040ff'
                      }}
                    >
                      <h3 className="text-white text-lg font-semibold">
                        Want alerts on more deals like these?
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Be the first to know via email
                      </p>
                      <HoverButton
                        onClick={() => navigate('/pricing')}
                        className="bg-gray-800 text-white hover:bg-gray-700 rounded-full font-semibold px-6 py-2 border border-gray-600"
                      >
                        Early Access
                      </HoverButton>
                    </div>
                  )}
                  
                  {/* Request Tour Button for Sales Properties Only */}
                  {!isRental && (
                    <Button
                      onClick={() => setShowTourRequest(true)}
                      className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-semibold px-6 py-3"
                    >
                      Request Tour
                    </Button>
                  )}

                  {/* Ask a Question Button for Sales Properties Only */}
                  {!isRental && (
                    <Button
                      onClick={() => setShowQuestionForm(true)}
                      className="w-full bg-[#494e52] text-white hover:bg-[#3a3f42] rounded-full font-semibold px-6 py-3 border border-white"
                    >
                      Ask a Question
                    </Button>
                  )}

                  {/* Early Access CTA Box for Sales - positioned below Ask a Question */}
                  {!isRental && userProfile?.subscription_plan !== 'unlimited' && (
                    <div 
                      className="rounded-2xl border-2 p-6 text-center space-y-3"
                      style={{
                        backgroundColor: '#000f3b',
                        borderColor: '#0040ff'
                      }}
                    >
                      <h3 className="text-white text-lg font-semibold">
                        Want alerts on more deals like these?
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Be the first to know via email
                      </p>
                      <HoverButton
                        onClick={() => navigate('/pricing')}
                        className="bg-gray-800 text-white hover:bg-gray-700 rounded-full font-semibold px-6 py-2 border border-gray-600"
                      >
                        Early Access
                      </HoverButton>
                    </div>
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
          propertyType={isRental ? 'rental' : 'sale'}
          onClose={() => setShowTourRequest(false)}
        />
      )}

      {/* Question Form Modal */}
      {showQuestionForm && (
        <QuestionForm
          propertyId={property.id}
          propertyAddress={property.address}
          propertyType={isRental ? 'rental' : 'sale'}
          onClose={() => setShowQuestionForm(false)}
        />
      )}
    </>
  );
};

export default PropertyDetail;
