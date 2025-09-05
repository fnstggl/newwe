import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ExternalLink, ArrowRight, Phone, Mail } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 transition-all duration-300 ${
      isScrolled ? 'mx-6 mt-3 rounded-full border border-gray-800' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-12' : 'h-16'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/be3adab5-6cb0-457c-8fc5-22c457e9c7c9.png" 
              alt="Realer Estate Logo" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* For You Tab - now always visible for all users */}
            <Link 
              to="/foryou" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/foryou' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/foryou' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/foryou') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/foryou') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              For You
            </Link>

            <Link 
              to="/buy"
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/buy' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/buy' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/buy') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/buy') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Buy
            </Link>
                
            <Link
              to="/rent" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/rent' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/rent' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/rent') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/rent') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Rent
            </Link>
            <Link 
              to="/saved" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/saved' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/saved' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/saved') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/saved') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Saved
            </Link>
            <Link 
              to="/pricing" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/pricing' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/pricing' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/pricing') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/pricing') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Upgrade
            </Link>
            <Link 
              to="/mission" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/mission' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/mission' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/mission') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/mission') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Mission
            </Link>
            <Link 
              to="/partners" 
              className={`px-3 py-2 rounded-md transition-all hover:text-white text-xs tracking-tight ${
                location.pathname === '/partners' ? 'text-white' : 'text-gray-300'
              }`}
              style={{
                textShadow: location.pathname === '/partners' ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/partners') {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/partners') {
                  e.currentTarget.style.textShadow = 'none';
                }
              }}
            >
              Partners
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Link 
                to="/profile"
                className="text-white hover:text-gray-300 transition-colors text-xs tracking-tight"
              >
                {userProfile?.name || 'Profile'}
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors text-xs tracking-tight"
                  style={{
                    textShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
                  }}
                >
                  Log in
                </Link>
                <Link 
                  to="/join" 
                  className="bg-white text-black px-6 py-2 rounded-full font-medium text-xs tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Partners: React.FC = () => {
  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Affordable Housing Resource Directory - Realer Estate Partners";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Trusted partners helping New Yorkers find affordable housing beyond market listings. Community resources for stable housing, healthcare, and employment support.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-block border border-gray-700 bg-gray-900/30 px-3 py-1 rounded text-xs font-medium text-gray-300 tracking-wide uppercase mb-6">
              Community Resources
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1] text-white">
              Affordable Housing
              <br />
              <span className="text-gray-400">Resource Directory</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
              Beyond market listings—trusted organizations helping New Yorkers 
              access stable housing, comprehensive services, and pathways to opportunity.
            </p>
            
            <div className="w-24 h-px bg-gray-600 mt-8"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg leading-relaxed text-gray-300 mb-6">
                Finding affordable housing in New York City requires more than browsing listings. 
                It demands community, advocacy, and organizations that understand the unique challenges 
                facing working families, individuals experiencing homelessness, and those seeking 
                stability in an increasingly expensive city.
              </p>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-gray-300">
                These are the partners we trust—organizations doing the essential work of creating 
                pathways to housing, providing wraparound services, and building stronger communities 
                across all five boroughs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Partner: Project Renewal */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="border border-gray-800 bg-gray-900/20 overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Partner Header */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-800">
                <div>
                  <div className="inline-block border border-gray-700 bg-gray-800/50 px-2 py-1 rounded text-xs font-medium text-gray-300 tracking-wide uppercase mb-4">
                    Featured Partner
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white">Project Renewal</h2>
                  <p className="text-xl text-gray-400 italic">Renewing lives. Reclaiming hope.</p>
                </div>
                <a 
                  href="https://www.projectrenewal.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Impact Stats */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">9,796</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">People received services in 2023</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">98%</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">Remained housed after one year</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">4,000</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">New Yorkers housed annually</div>
                </div>
              </div>

              {/* Editorial Content */}
              <div className="mb-12 space-y-6">
                <p className="text-lg leading-relaxed text-gray-200 first-letter:text-5xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:mt-2">
                  For over five decades, Project Renewal has stood as one of New York City's most 
                  trusted providers of comprehensive services to individuals experiencing homelessness. 
                  What sets them apart isn't just their scale—they're among the largest providers 
                  of health services to homeless individuals in the city—but their integrated approach 
                  to human dignity and long-term stability.
                </p>
                
                <p className="text-lg leading-relaxed text-gray-300">
                  Their model recognizes what housing advocates have long known: stable housing alone 
                  isn't enough. People need healthcare, employment opportunities, and community support 
                  to thrive. Project Renewal delivers all three through their comprehensive programs 
                  spanning emergency housing, transitional services, permanent supportive housing, 
                  and their innovative job training initiatives.
                </p>
                
                <p className="text-lg leading-relaxed text-gray-300">
                  In a city where single adult homelessness continues to grow by 1,000 people each year, 
                  Project Renewal's work represents both immediate relief and systemic change—providing 
                  award-winning housing programs while advocating for the policy changes needed to 
                  address root causes of housing instability.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="border-l-2 border-gray-600 pl-6">
                  <h3 className="text-lg font-semibold mb-3 tracking-tight text-white">Housing Programs</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Emergency, transitional, and permanent supportive housing serving nearly 4,000 New Yorkers annually
                  </p>
                </div>
                
                <div className="border-l-2 border-gray-600 pl-6">
                  <h3 className="text-lg font-semibold mb-3 tracking-tight text-white">Healthcare Services</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Comprehensive medical care, substance use treatment, and psychiatric services
                  </p>
                </div>
                
                <div className="border-l-2 border-gray-600 pl-6">
                  <h3 className="text-lg font-semibold mb-3 tracking-tight text-white">Employment Training</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Job training integrated across programs, including their social enterprise City Beet Kitchens
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-800 pt-8">
                <h3 className="text-lg font-semibold mb-4 tracking-tight text-white">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Project Renewal offers multiple pathways to support, whether you're seeking housing, 
                      healthcare, employment services, or looking to get involved as a volunteer or donor.
                    </p>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a 
                        href="tel:+12126200340"
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        (212) 620-0340
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">200 Varick Street, 9th Floor, New York, NY 10014</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <a 
                      href="https://www.projectrenewal.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium text-sm transition-colors hover:bg-gray-100 group"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Partners Coming Soon */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block border border-gray-700 bg-gray-900/30 px-3 py-1 rounded text-xs font-medium text-gray-300 tracking-wide uppercase mb-6">
            Expanding Directory
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white">More Partners Coming Soon</h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            We're building relationships with organizations across NYC that share our commitment 
            to housing justice and community empowerment. Know an organization that should be featured here?
          </p>
          
          <a 
            href="mailto:partners@realerestate.org" 
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium transition-colors hover:bg-gray-100 group"
          >
            Suggest a Partner
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/be3adab5-6cb0-457c-8fc5-22c457e9c7c9.png" 
                alt="Realer Estate Logo" 
                className="h-6 w-auto"
              />
              <span className="font-semibold tracking-tight">Realer Estate</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/press" className="hover:text-white transition-colors">Press</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Realer Estate. Building community through housing access.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Partners;