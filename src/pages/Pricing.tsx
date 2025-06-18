
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
              <button className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium tracking-tight hover:bg-gray-700 transition-all mt-auto">
                Current Plan
              </button>
            </div>

            {/* Early Bird Plan */}
            <div className="relative flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium tracking-tight">
                  Most popular
                </span>
              </div>
              
              {/* Rainbow border container with slower animation */}
              <div className="relative overflow-hidden rounded-2xl p-[3px] bg-gradient-to-r from-red-500 via-purple-500 via-blue-500 via-cyan-500 to-green-500 bg-[length:200%] animate-[rainbow_6s_infinite_linear]">
                {/* Card content with black background */}
                <div className="bg-black rounded-2xl p-8 flex flex-col h-full">
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
                  <button className="w-full bg-white text-black py-3 rounded-xl font-medium tracking-tight transition-all mt-auto hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:border hover:border-blue-400">
                    Join Pro
                  </button>
                </div>
              </div>
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
