
import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    // Update meta tags for SEO - Terms of Service page
    document.title = "Terms of Service - Realer Estate";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms of Service for Realer Estate - Read our terms and conditions for using our real estate platform.');
    }
  }, []);

  return (
    <div className="font-inter min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tighter">
          Terms of Service
        </h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using Realer Estate, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Use License
            </h2>
            <p className="mb-4">
              Permission is granted to temporarily access and use Realer Estate for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a 
              transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Service Description
            </h2>
            <p>
              Realer Estate provides real estate analysis and property discovery services. We use 
              algorithms to identify potentially undervalued properties based on market data. Our 
              service is for informational purposes only and does not constitute financial or 
              investment advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              User Accounts
            </h2>
            <p className="mb-4">
              When you create an account with us, you must provide information that is accurate, 
              complete, and current at all times. You are responsible for safeguarding the password 
              and for all activities that occur under your account.
            </p>
            <p>
              You agree not to disclose your password to any third party and to take sole 
              responsibility for any activities or actions under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Disclaimer
            </h2>
            <p className="mb-4">
              The information on this website is provided on an 'as is' basis. To the fullest 
              extent permitted by law, Realer Estate excludes all representations, warranties, 
              conditions and terms relating to our website and the use of this website.
            </p>
            <p>
              Real estate investments carry risks, and past performance does not guarantee future 
              results. Always conduct your own due diligence and consult with qualified professionals 
              before making investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Limitations
            </h2>
            <p>
              In no event shall Realer Estate or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use the materials on Realer Estate's website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Accuracy of Materials
            </h2>
            <p>
              The materials appearing on Realer Estate's website could include technical, typographical, 
              or photographic errors. Realer Estate does not warrant that any of the materials on its 
              website are accurate, complete, or current.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Privacy Policy
            </h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the website, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws 
              of New York and you irrevocably submit to the exclusive jurisdiction of the courts 
              in that State or location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">
              Contact Information
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              Email: legal@realerestate.org
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
