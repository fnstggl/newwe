import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface CheckoutFormProps {
  clientSecret: string;
  priceId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, priceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      name: user?.user_metadata?.name || '',
    },
  });

  const handleSubmit = async (values: FormData) => {
    if (!stripe || !elements || !clientSecret) {
      // Stripe.js hasn't loaded yet.
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        name: values.name,
      })
      .eq('id', user?.id);

    if (updateError) {
      toast.error('Failed to update profile. Please try again.');
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/account`,
        receipt_email: values.email,
      },
    });

    if (error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(error.message);
      toast.error(error.message || 'Payment failed. Please try again.');
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      toast.success('Payment successful! Redirecting to your account...');
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your-email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PaymentElement />
        <Button disabled={isLoading} className="w-full mt-4">
          {isLoading ? 'Processing...' : 'Submit Payment'}
        </Button>
      </form>
    </Form>
  );
};

export default CheckoutForm;
