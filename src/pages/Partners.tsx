import React, { useEffect } from 'react';
import { ExternalLink, Home, Users, Briefcase, Heart } from 'lucide-react';

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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-black" />
              </div>
              <span className="font-semibold text-lg tracking-tight">Realer Estate</span>
            </a>
            <div className="hidden md:flex space-x-8">
              <a href="/rent" className="text-gray-300 hover:text-white transition-colors tracking-tight">Rent</a>
              <a href="/buy" className="text-gray-300 hover:text-white transition-colors tracking-tight">Buy</a>
              <a href="/pricing" className="text-gray-300 hover:text-white transition-colors tracking-tight">Pricing</a>
              <a href="/partners" className="text-white font-medium tracking-tight">Partners</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-400 text-sm font-medium tracking-tight">Community Resources</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter leading-[1.1]">
            Affordable Housing
            <br />
            <span className="text-gray-400">Resource Directory</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed font-light">
            Beyond market listings—trusted organizations helping New Yorkers 
            access stable housing, comprehensive services, and pathways to opportunity.
          </p>
          
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 px-4 bg-gray-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-300 font-light mb-6">
              Finding affordable housing in New York City requires more than browsing listings. 
              It demands community, advocacy, and organizations that understand the unique challenges 
              facing working families, individuals experiencing homelessness, and those seeking 
              stability in an increasingly expensive city.
            </p>
            <p className="text-lg leading-relaxed text-gray-300 font-light">
              These are the partners we trust—organizations doing the essential work of creating 
              pathways to housing, providing wraparound services, and building stronger communities 
              across all five boroughs.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Partner: Project Renewal */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Partner Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-4">
                    <span className="text-orange-400 text-xs font-medium tracking-tight uppercase">Featured Partner</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tighter">Project Renewal</h2>
                  <p className="text-xl text-gray-400 font-light italic">Renewing lives. Reclaiming hope.</p>
                </div>
                <a 
                  href="https://www.projectrenewal.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span className="text-sm">Visit Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Impact Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 rounded-xl bg-black/30 border border-gray-800">
                  <div className="text-2xl font-bold text-white mb-1">9,796</div>
                  <div className="text-sm text-gray-400">People received services in 2023</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-black/30 border border-gray-800">
                  <div className="text-2xl font-bold text-white mb-1">98%</div>
                  <div className="text-sm text-gray-400">Remained housed after one year</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-black/30 border border-gray-800">
                  <div className="text-2xl font-bold text-white mb-1">4,000</div>
                  <div className="text-sm text-gray-400">New Yorkers housed annually</div>
                </div>
              </div>

              {/* Editorial Content */}
              <div className="prose prose-lg prose-invert max-w-none mb-8">
                <p className="text-lg leading-relaxed text-gray-300 font-light mb-6">
                  For over five decades, Project Renewal has stood as one of New York City's most 
                  trusted providers of comprehensive services to individuals experiencing homelessness. 
                  What sets them apart isn't just their scale—they're among the largest providers 
                  of health services to homeless individuals in the city—but their integrated approach 
                  to human dignity and long-term stability.
                </p>
                
                <p className="text-lg leading-relaxed text-gray-300 font-light mb-6">
                  Their model recognizes what housing advocates have long known: stable housing alone 
                  isn't enough. People need healthcare, employment opportunities, and community support 
                  to thrive. Project Renewal delivers all three through their comprehensive programs 
                  spanning emergency housing, transitional services, permanent supportive housing, 
                  and their innovative job training initiatives.
                </p>
                
                <p className="text-lg leading-relaxed text-gray-300 font-light">
                  In a city where single adult homelessness continues to grow by 1,000 people each year, 
                  Project Renewal's work represents both immediate relief and systemic change—providing 
                  award-winning housing programs while advocating for the policy changes needed to 
                  address root causes of housing instability.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <Home className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">Housing Programs</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Emergency, transitional, and permanent supportive housing serving nearly 4,000 New Yorkers annually
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <Heart className="w-8 h-8 text-green-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">Healthcare Services</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Comprehensive medical care, substance use treatment, and psychiatric services
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20">
                  <Briefcase className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 tracking-tight">Employment Training</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Job training integrated across programs, including their social enterprise City Beet Kitchens
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <h3 className="text-lg font-semibold mb-2 tracking-tight">How to Connect</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Project Renewal offers multiple pathways to support, whether you're seeking housing, 
                  healthcare, employment services, or looking to get involved as a volunteer or donor.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://www.projectrenewal.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a 
                    href="tel:+12126200340"
                    className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Call: (212) 620-0340
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Partners Coming Soon */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gray-700/50 border border-gray-600 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm font-medium tracking-tight">Expanding Network</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tighter">More Partners Coming Soon</h2>
          <p className="text-lg text-gray-400 leading-relaxed font-light mb-8">
            We're building relationships with organizations across NYC that share our commitment 
            to housing justice and community empowerment. Know an organization that should be featured here?
          </p>
          
          <a 
            href="mailto:partners@realerestate.org" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Suggest a Partner
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Home className="w-4 h-4 text-black" />
              </div>
              <span className="font-semibold tracking-tight">Realer Estate</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
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
