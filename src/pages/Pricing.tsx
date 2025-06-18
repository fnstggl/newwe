
import { Link } from "react-router-dom";
import { RainbowButton } from "@/components/ui/rainbow-button";

const Pricing = () => {
  return (
    <div className="font-inter min-h-screen bg-black text-white">
      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
              Real estate is all about being early.
            </h1>
            <p className="text-xl text-gray-400 tracking-tight">
              The best deals disappear in days. Get notified first.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-black/50 rounded-2xl p-8 border border-gray-800 flex flex-col">
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">Free</h3>
              <p className="text-4xl font-semibold mb-6 tracking-tight">$0</p>
              <ul className="space-y-3 mb-8 text-gray-300 flex-grow">
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  See all listings
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Basic deal scores
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Neighborhood data
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Search and filter
                </li>
              </ul>
              <button className="w-full bg-gray-800 text-white py-3 rounded-full font-medium tracking-tight hover:bg-gray-700 transition-all mt-auto">
                Current Plan
              </button>
            </div>

            {/* Early Bird Plan */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/30 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium tracking-tight">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 tracking-tight">Early Bird</h3>
              <p className="text-4xl font-semibold mb-6 tracking-tight">$29<span className="text-lg text-gray-400">/mo</span></p>
              <ul className="space-y-3 mb-8 text-gray-300 flex-grow">
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Everything in Free
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  <strong className="text-white">INSTANT email alerts</strong>
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  New deals within 60 seconds
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Advanced deal analysis
                </li>
                <li className="flex items-center tracking-tight">
                  <span className="text-blue-400 mr-3">•</span>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-medium tracking-tight hover:from-blue-500 hover:to-purple-500 transition-all mt-auto">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter">
            Don't overpay. Ever again.
          </h2>
          <p className="text-xl text-gray-300 mb-12 tracking-tight">
            Join the platform that actually works for buyers.
          </p>
          <Link to="/join">
            <RainbowButton className="font-semibold tracking-tight">
              Join now.
            </RainbowButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
