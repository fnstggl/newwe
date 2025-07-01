
import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    // Update meta tags for SEO - Privacy Policy page
    document.title = "Privacy Policy - Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Privacy Policy for Realer Estate - Learn how we collect, use, and protect your personal information.');
    }
  }, []);

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tighter">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us. This may include your name, email address, phone number, 
              and property preferences.
            </p>
            <p>
              We also automatically collect certain information about your device and usage of our 
              services, including IP address, browser type, operating system, and pages visited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our real estate analysis services</li>
              <li>Send you property recommendations and market updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Information Sharing
            </h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
            <p>
              We may share your information with trusted service providers who assist us in operating 
              our website and conducting our business, provided they agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Data Security
            </h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Your Rights
            </h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Cookies
            </h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and assist in our marketing efforts. You can control cookie settings through your 
              browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email: privacy@realerestate.org
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
