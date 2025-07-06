import React, { useState, useEffect } from "react";
import { X, MapPin, Calendar, Users, Square, Home, Hammer, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import TourRequestForm from "./TourRequestForm";
import PropertyImage from "./PropertyImage";

interface PropertyDetailProps {
  property: any;
  isRental: boolean;
  onClose: () => void;
}

const PropertyDetail = ({ property, isRental, onClose }: PropertyDetailProps) => {
  const [showTourForm, setShowTourForm] = useState(false);
  const [neighborhood, setNeighborhood] = useState<any>(null);

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      try {
        const { data, error } = await supabase
          .from('neighborhood_stats')
          .select('*')
          .ilike('neighborhood', property.neighborhood)
          .single();

        if (data && !error) {
          setNeighborhood(data);
        }
      } catch (error) {
        console.log('No neighborhood data found');
      }
    };

    if (property.neighborhood) {
      fetchNeighborhoodData();
    }
  }, [property.neighborhood]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDiscountPercent = () => {
    if (property.isRentStabilized) {
      return property.undervaluation_percent;
    } else if (isRental) {
      return property.discount_percent;
    } else {
      return property.discount_percent;
    }
  };

  const getAnnualSavings = () => {
    if (property.isRentStabilized) {
      return property.potential_annual_savings;
    } else if (isRental) {
      return property.annual_savings;
    } else {
      return property.annual_savings; // Changed from potential_savings to annual_savings
    }
  };

  const getSavingsLabel = () => {
    return isRental ? "Est Annual Savings" : "Est Savings";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{property.address}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Images and Details */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <PropertyImage 
                images={property.images} 
                address={property.address}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {property.bedrooms || property.bedrooms === 0 ? property.bedrooms : ''}
                </div>
                <div className="text-sm text-gray-600">
                  {property.bedrooms === 0 ? 'Studio' : property.bedrooms === 1 ? 'Bed' : 'Beds'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="h-6 w-6 mx-auto mb-2 bg-gray-600 rounded-full"></div>
                <div className="text-2xl font-bold text-gray-900">
                  {property.bathrooms || ''}
                </div>
                <div className="text-sm text-gray-600">
                  {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Square className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {property.sqft ? property.sqft.toLocaleString() : ''}
                </div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Home className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {property.property_type || property.building_type || ''}
                </div>
                <div className="text-sm text-gray-600">Type</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Hammer className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {property.built_in || property.year_built || ''}
                </div>
                <div className="text-sm text-gray-600">Built</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {property.days_on_market || ''}
                </div>
                <div className="text-sm text-gray-600">Days</div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Pricing and Actions */}
          <div className="space-y-6">
            {/* Price and Key Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {isRental 
                  ? formatCurrency(property.monthly_rent)
                  : formatCurrency(property.price)
                }
                {isRental && <span className="text-lg font-normal text-gray-600">/month</span>}
              </div>
              
              {property.rent_per_sqft && (
                <div className="text-sm text-gray-600 mb-4">
                  {formatCurrency(property.rent_per_sqft)}/sqft
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <Badge 
                  className={`${
                    property.grade === 'A+' ? 'bg-yellow-500 text-white' :
                    property.grade?.startsWith('A') ? 'bg-purple-500 text-white' :
                    property.grade?.startsWith('B') ? 'bg-blue-500 text-white' :
                    property.isRentStabilized ? 'bg-green-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}
                >
                  Grade: {property.isRentStabilized ? 'RS' : property.grade}
                </Badge>
                
                <div className="text-sm text-gray-600">
                  Score: {property.score || property.rent_stabilized_confidence || 'N/A'}
                </div>
              </div>

              <Button 
                onClick={() => setShowTourForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                Request Tour
              </Button>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </h3>
              <div className="space-y-2 text-gray-700">
                <div>{property.address}</div>
                <div>{property.neighborhood}</div>
                <div>{property.zipcode || property.zip_code}</div>
              </div>
            </div>

            {/* About the Neighborhood */}
            {neighborhood && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Neighborhood</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Median {isRental ? 'Rent' : 'Price'}</div>
                      <div className="font-semibold">
                        {formatCurrency(isRental ? neighborhood.median_rent : neighborhood.median_price)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Walk Score</div>
                      <div className="font-semibold">{neighborhood.walk_score || 'N/A'}</div>
                    </div>
                  </div>
                  {neighborhood.description && (
                    <p className="text-sm leading-relaxed">{neighborhood.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Below Market and Annual Savings */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="space-y-2">
                {getDiscountPercent() && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Below Market:</span>
                    <span className="text-lg font-bold text-green-600">{getDiscountPercent()}%</span>
                  </div>
                )}
                {getAnnualSavings() && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{getSavingsLabel()}:</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(getAnnualSavings())}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Listing Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Listing Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {property.listed_at && (
                  <div className="flex justify-between">
                    <span>Listed:</span>
                    <span>{formatDate(property.listed_at)}</span>
                  </div>
                )}
                
                {property.listing_url && (
                  <div className="mt-4">
                    <a 
                      href={property.listing_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Original Listing
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tour Request Form Modal */}
        {showTourForm && (
          <TourRequestForm
            property={property}
            onClose={() => setShowTourForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
