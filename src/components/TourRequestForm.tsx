
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, CalendarIcon, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TourRequestFormProps {
  propertyId: string;
  propertyAddress: string;
  onClose: () => void;
}

const TourRequestForm: React.FC<TourRequestFormProps> = ({ propertyId, propertyAddress, onClose }) => {
  const { user, userProfile } = useAuth();
  const [useProfileInfo, setUseProfileInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [dates, setDates] = useState<(Date | undefined)[]>([undefined]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addDate = () => {
    if (dates.length < 3) {
      setDates([...dates, undefined]);
    }
  };

  const removeDate = (index: number) => {
    if (dates.length > 1) {
      setDates(dates.filter((_, i) => i !== index));
    }
  };

  const updateDate = (index: number, date: Date | undefined) => {
    const newDates = [...dates];
    newDates[index] = date;
    setDates(newDates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to request a tour');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalName = useProfileInfo ? userProfile?.name || '' : formData.name;
      const finalEmail = useProfileInfo ? user.email || '' : formData.email;
      const finalPhone = useProfileInfo ? '' : formData.phone; // Profile doesn't have phone

      if (!finalName || !finalEmail) {
        toast.error('Name and email are required');
        setIsSubmitting(false);
        return;
      }

      const tourData = {
        user_id: user.id,
        property_id: propertyId,
        name: finalName,
        email: finalEmail,
        phone: finalPhone || null,
        date_1: dates[0] ? dates[0].toISOString() : null,
        date_2: dates[1] ? dates[1].toISOString() : null,
        date_3: dates[2] ? dates[2].toISOString() : null,
        property_address: propertyAddress,
      };

      const { error } = await supabase
        .from('requested_tours')
        .insert([tourData]);

      if (error) {
        console.error('Error submitting tour request:', error);
        toast.error('Failed to submit tour request');
      } else {
        toast.success('Tour request submitted successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-900/95 backdrop-blur-md border-gray-700">
          <div className="flex justify-between items-center p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Request Tour</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Use Profile Info Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useProfile"
                  checked={useProfileInfo}
                  onCheckedChange={(checked) => setUseProfileInfo(checked as boolean)}
                  className="border-gray-600"
                />
                <Label htmlFor="useProfile" className="text-white text-sm">
                  Use profile name & email
                </Label>
              </div>

              {/* Contact Information */}
              {!useProfileInfo && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white text-sm">Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-1 bg-gray-800 border-gray-600 text-white rounded-full px-4"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white text-sm">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-1 bg-gray-800 border-gray-600 text-white rounded-full px-4"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="phone" className="text-white text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 bg-gray-800 border-gray-600 text-white rounded-full px-4"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Date Selection */}
              <div>
                <Label className="text-white text-sm mb-2 block">Preferred Tour Dates & Times</Label>
                <div className="space-y-3">
                  {dates.map((date, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "flex-1 justify-start text-left font-normal bg-gray-800 border-gray-600 text-white rounded-full px-4 hover:bg-gray-700",
                              !date && "text-gray-400"
                            )}
                          >
                            {date ? format(date, "MM/dd/yyyy") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => updateDate(index, selectedDate)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="bg-gray-800 text-white border-gray-600 rounded-lg p-3 pointer-events-auto"
                            classNames={{
                              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                              month: "space-y-4",
                              caption: "flex justify-center pt-1 relative items-center text-white",
                              caption_label: "text-sm font-medium text-white",
                              nav: "space-x-1 flex items-center",
                              nav_button: "h-7 w-7 bg-transparent p-0 text-gray-400 hover:text-white hover:bg-gray-700 rounded",
                              nav_button_previous: "absolute left-1",
                              nav_button_next: "absolute right-1",
                              table: "w-full border-collapse space-y-1",
                              head_row: "flex",
                              head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                              row: "flex w-full mt-2",
                              cell: "h-9 w-9 text-center text-sm p-0 relative text-white hover:bg-gray-700 rounded-md",
                              day: "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 rounded-md",
                              day_selected: "bg-white text-black hover:bg-gray-200",
                              day_today: "bg-gray-700 text-white",
                              day_outside: "text-gray-500 opacity-50",
                              day_disabled: "text-gray-600 opacity-50",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {dates.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDate(index)}
                          className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {dates.length < 3 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={addDate}
                      className="w-full text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-600 rounded-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add another date
                    </Button>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 text-center">
                Requesting a tour doesn't guarantee availability
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Request Tour'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourRequestForm;
