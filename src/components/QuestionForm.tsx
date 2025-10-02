
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuestionFormProps {
  propertyId: string;
  propertyAddress: string;
  propertyType?: 'sale' | 'rental';
  onClose: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ propertyId, propertyAddress, propertyType, onClose }) => {
  const { user, userProfile } = useAuth();
  const [useProfileInfo, setUseProfileInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to ask a question');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalName = useProfileInfo ? userProfile?.name || '' : formData.name;
      const finalEmail = useProfileInfo ? user.email || '' : formData.email;
      const finalPhone = useProfileInfo ? '' : formData.phone; // Profile doesn't have phone

      if (!finalName || !finalEmail || !formData.message) {
        toast.error('Name, email, and message are required');
        setIsSubmitting(false);
        return;
      }

      const questionData = {
        user_id: user.id,
        property_id: propertyId,
        name: finalName,
        email: finalEmail,
        phone: finalPhone || null,
        message: formData.message,
        property_address: propertyAddress,
        date_1: null, // No dates for questions
        date_2: null,
        date_3: null,
      };

      const { error } = await supabase
        .from('requested_tours')
        .insert([questionData]);

      if (error) {
        console.error('Error submitting question:', error);
        toast.error('Failed to submit question');
      } else {
        toast.success('Question submitted successfully!');
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
            <h2 className="text-xl font-semibold text-white">Ask a Question</h2>
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

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-white text-sm">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="mt-1 bg-gray-800 border-gray-600 text-white rounded-md px-4 min-h-[100px]"
                  placeholder="Enter your question about this property..."
                />
              </div>

              {/* Tiger Liu Realtor Profile - Only for sales listings */}
              {propertyType === 'sale' && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src="/lovable-uploads/bd686247-be03-4fec-a000-cc7f3233f81a.png"
                        alt="Tiger Liu"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm">Tiger Liu</h3>
                      <p className="text-gray-300 text-xs">Licensed Real Estate Salesperson</p>
                      <p className="text-gray-400 text-xs">Compass</p>
                      <p className="text-blue-400 text-xs font-medium"> </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 text-center">
                Your question will be sent to our team for review. Our buyer representation is 100% free-no fees, no cost to you.
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-gray-200 rounded-full font-semibold"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionForm;
