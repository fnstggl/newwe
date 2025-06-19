
import React, { useState } from 'react';
import { UndervaluedSales, UndervaluedRentals } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Home, DollarSign } from 'lucide-react';

interface PropertyDetailProps {
  property: UndervaluedSales | UndervaluedRentals;
  isRental?: boolean;
  onClose: () => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ property, isRental = false, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images || [];
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

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A+':
      case 'A':
        return 'bg-green-600';
      case 'A-':
      case 'B+':
        return 'bg-green-500';
      case 'B':
      case 'B-':
        return 'bg-yellow-500';
      case 'C+':
      case 'C':
        return 'bg-orange-500';
      case 'C-':
      case 'D':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const price = isRental 
    ? (property as UndervaluedRentals).monthly_rent 
    : (property as UndervaluedSales).price;

  const pricePerSqft = isRental
    ? (property as UndervaluedRentals).rent_per_sqft
    : (property as UndervaluedSales).price_per_sqft;

  const currentImage = hasImages ? images[currentImageIndex] : null;
  const imageUrl = currentImage?.url || currentImage?.image_url || '/placeholder.svg';

  return (
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
            {/* Image Gallery */}
            {hasImages && (
              <div className="relative mb-8">
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-800">
                  <img
                    src={imageUrl}
                    alt={property.address}
                    className="w-full h-full object-cover"
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
                {/* Address and Score */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{property.address}</h2>
                    <div className="flex items-center text-gray-400 mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      {property.neighborhood && `${property.neighborhood}, `}
                      {property.borough}
                    </div>
                  </div>
                  <Badge className={`${getGradeColor(property.grade)} text-white px-4 py-2 text-lg font-bold`}>
                    {property.grade}
                  </Badge>
                </div>

                {/* Price and Details */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          {formatPrice(price)}{isRental ? '/mo' : ''}
                        </div>
                        {pricePerSqft && (
                          <div className="text-gray-300">
                            {formatPrice(pricePerSqft)}/sqft
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Bedrooms:</span>
                          <span className="text-white">{property.bedrooms || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Bathrooms:</span>
                          <span className="text-white">{property.bathrooms || 0}</span>
                        </div>
                        {property.sqft && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Square Feet:</span>
                            <span className="text-white">{property.sqft}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Deal Score:</span>
                          <span className="text-white">{property.score}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                {property.description && (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed">{property.description}</p>
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
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Market Analysis */}
                <Card className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Market Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {Math.round(property.discount_percent)}%
                      </div>
                      <div className="text-sm text-gray-400">Below Market Value</div>
                    </div>
                    
                    {property.reasoning && (
                      <div className="text-sm text-gray-300 leading-relaxed">
                        {property.reasoning}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Property Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                    {property.days_on_market && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Days on Market:</span>
                        <span className="text-white">{property.days_on_market}</span>
                      </div>
                    )}
                    {isRental && (property as UndervaluedRentals).no_fee && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Broker Fee:</span>
                        <span className="text-green-400">No Fee</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
