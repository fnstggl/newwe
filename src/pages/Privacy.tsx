
import { Link } from "react-router-dom";
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
        <div className="mb-8">
          <Link 
            to="/" 
            className="text-gray-400 hover:text-white transition-colors tracking-tight"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tighter">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-300 tracking-tight">
          <section>
            <p className="text-sm text-gray-400 mb-6">Last updated: January 1, 2025</p>
            
            <p className="mb-6">
              At Realer Estate ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 tracking-tight text-white">Personal Information</h3>
            <p className="mb-4">We may collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Name and contact information (email address, phone number)</li>
              <li>Account credentials and profile information</li>
              <li>Payment and billing information</li>
              <li>Property preferences and search history</li>
              <li>Communications with our support team</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 tracking-tight text-white">Automatically Collected Information</h3>
            <p className="mb-4">We automatically collect certain information when you use our services:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, click patterns)</li>
              <li>Location data (when permitted)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">How We Use Your Information</h2>
            <p className="mb-4">We use collected information for the following purposes:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide and maintain our real estate search services</li>
              <li>Process transactions and manage your account</li>
              <li>Personalize your experience and property recommendations</li>
              <li>Communicate with you about our services</li>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Information Sharing</h2>
            <p className="mb-4">We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>With your consent or at your direction</li>
              <li>With service providers who assist in our operations</li>
              <li>For legal compliance or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
              <li>With real estate professionals when you express interest in properties</li>
            </ul>
            <p className="mb-6">
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Data Security</h2>
            <p className="mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Data portability</li>
              <li>Opt-out of certain processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Cookies and Tracking</h2>
            <p className="mb-6">
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mb-2">Email: privacy@realerestate.org</p>
            <p className="mb-6">Address: New York, NY</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 tracking-tight text-white">Updates to This Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
