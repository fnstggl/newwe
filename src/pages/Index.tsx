import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"

const Index = () => {
  return (
    <>
      <div className="min-h-screen bg-black text-white font-inter">
        {/* Hero Section */}
        <section className="bg-gray-900 py-24">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-8 tracking-tighter">
              Discover Undervalued Real Estate in NYC
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Find hidden gems and rent-stabilized apartments before anyone else.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild><Link to="/rent">Find Rentals</Link></Button>
              <Button variant="outline" size="lg" asChild><Link to="/buy">Find Sales</Link></Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Rent-Stabilized Listings</h3>
                <p className="text-gray-400">
                  Unlock access to exclusive rent-stabilized apartments, saving you thousands.
                </p>
              </div>

              {/* Feature 2 */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Below Market Deals</h3>
                <p className="text-gray-400">
                  Identify properties selling or renting below their true market value.
                </p>
              </div>

              {/* Feature 3 */}
              <div>
                <h3 className="text-2xl font-semibold mb-4">Advanced Search Tools</h3>
                <p className="text-gray-400">
                  Filter by neighborhood, price, size, and more to find your perfect home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-900 py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="p-6 bg-gray-800 rounded-lg">
                <p className="text-gray-300 italic mb-4">
                  "I found an amazing rent-stabilized apartment through Realer Estate that I wouldn't have found otherwise!"
                </p>
                <p className="text-gray-400">- Sarah J.</p>
              </div>

              {/* Testimonial 2 */}
              <div className="p-6 bg-gray-800 rounded-lg">
                <p className="text-gray-300 italic mb-4">
                  "Realer Estate helped me identify a property selling way below market value. It was a game-changer."
                </p>
                <p className="text-gray-400">- Michael K.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-semibold mb-8 tracking-tighter">
              Start Your Search Today
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Don't miss out on the best real estate deals in NYC.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild><Link to="/rent">Find Rentals</Link></Button>
              <Button variant="outline" size="lg" asChild><Link to="/buy">Find Sales</Link></Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Realer Estate</h3>
                <p className="text-gray-400 mb-4">
                  Finding affordable apartments and rent-stabilized homes in NYC.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="/rent" className="text-gray-400 hover:text-white transition-colors">Find Rentals</a></li>
                  <li><a href="/buy" className="text-gray-400 hover:text-white transition-colors">Find Sales</a></li>
                  <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/mission" className="text-gray-400 hover:text-white transition-colors">Our Mission</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="/housingaccess" className="text-gray-400 hover:text-white transition-colors">Housing Access</a></li>
                  <li><a href="/press" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Affordable NYC Homes: 2025 Guide</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Realer Estate. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
