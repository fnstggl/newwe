
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    // Update meta tags for SEO - Terms of Service page
    document.title = "Terms of Service - Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms of Service for Realer Estate - Understand the terms and conditions for using our real estate platform.');
    }
  }, []);

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="mb-8">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-white transition-colors tracking-tight"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tighter">
          Terms of Service
        </h1>

        <div className="space-y-8 text-gray-300 tracking-tight">
          <section>
            <p className="text-sm text-gray-400 mb-6">Last updated: January 1, 2025</p>
            
            <p className="mb-6">
              Welcome to Realer Estate. These Terms of Service ("Terms") govern your use of our website, services, and applications (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Acceptance of Terms</h2>
            <p className="mb-6">
              By creating an account or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Description of Service</h2>
            <p className="mb-6">
              Realer Estate is a real estate platform that uses advanced algorithms to identify undervalued properties in New York City. We provide property search, analysis, and comparison tools to help users make informed real estate decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">User Accounts</h2>
            <p className="mb-4">To access certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Subscription and Payment</h2>
            <p className="mb-4">Our Service offers both free and paid subscription tiers:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Free accounts have limited access to property data and features</li>
              <li>Paid subscriptions provide full access to our property database and analysis tools</li>
              <li>Subscription fees are billed in advance and are non-refundable</li>
              <li>You may cancel your subscription at any time</li>
              <li>We reserve the right to modify pricing with reasonable notice</li>
            </ul>
          </section>

<section>
  <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Refund Policy</h2>
  <p className="mb-6">
    We want you to feel confident using Realer Estate. If you are not satisfied with your paid subscription, you may
    request a refund within 30 days of your initial purchase by emailing us at 
    <a href="mailto:info@realerestate.org" className="text-white underline"> info@realerestate.org</a>.  
  </p>
  <p className="mb-6">
    Refunds are subject to the following conditions:
  </p>
  <ul className="list-disc pl-6 mb-6 space-y-2">
    <li>Refunds apply only to first-time subscription purchases, not renewals or upgrades.</li>
    <li>Refund requests must be made within 30 calendar days of your original purchase date.</li>
    <li>We reserve the right to deny refunds in cases of suspected abuse, misuse of the Service, or violation of these Terms.</li>
    <li>Approved refunds will be credited to your original payment method within a reasonable timeframe.</li>
  </ul>
</section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Acceptable Use</h2>
            <p className="mb-4">You agree not to use our Service to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or collect data</li>
              <li>Interfere with the normal operation of our Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Property Information Disclaimer</h2>
            <p className="mb-6">
              The property information, valuations, and market analysis provided through our Service are for informational purposes only. We make no guarantees about the accuracy, completeness, or timeliness of this information. You should conduct your own due diligence and consult with qualified professionals before making any real estate decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Intellectual Property</h2>
            <p className="mb-6">
              The Service and its content, including but not limited to algorithms, data analysis, design, and software, are owned by Realer Estate and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Limitation of Liability</h2>
            <p className="mb-6">
              To the maximum extent permitted by law, Realer Estate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Termination</h2>
            <p className="mb-6">
              We may suspend or terminate your account at any time for violation of these Terms or for any other reason. Upon termination, your right to use the Service will cease immediately, and we may delete your account and data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Governing Law</h2>
            <p className="mb-6">
              These Terms are governed by and construed in accordance with the laws of the State of New York, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on our website. Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
