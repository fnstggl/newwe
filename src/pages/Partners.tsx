import React, { useEffect } from 'react';
import { ExternalLink, ArrowRight, Phone, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block border border-blue-500/30 bg-blue-500/10 px-4 py-2 rounded-full text-sm font-medium text-blue-400 tracking-wide mb-8">
              Community Resources
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif mb-8 tracking-tight leading-[0.9] text-white" style={{fontFamily: 'Playfair Display, serif'}}>
              Affordable Housing
              <br />
              <span className="text-gray-400 italic">Resource Directory</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light" style={{fontFamily: 'Georgia, serif'}}>
              Beyond market listings—trusted organizations helping New Yorkers 
              access stable housing, comprehensive services, and pathways to opportunity.
            </p>
            
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/30 to-black/30 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-serif mb-6 text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                A Curated Directory
              </h2>
              <p className="text-lg leading-relaxed text-gray-300 font-light" style={{fontFamily: 'Georgia, serif'}}>
                Finding affordable housing in New York City requires more than browsing listings. 
                It demands community, advocacy, and organizations that understand the unique challenges 
                facing working families, individuals experiencing homelessness, and those seeking 
                stability in an increasingly expensive city.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-serif mb-6 text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                Trusted Partners
              </h2>
              <p className="text-lg leading-relaxed text-gray-300 font-light" style={{fontFamily: 'Georgia, serif'}}>
                These are the partners we trust—organizations doing the essential work of creating 
                pathways to housing, providing wraparound services, and building stronger communities 
                across all five boroughs.
              </p>
            </div>
          </div>
        </div>
      </section>

 {/* Featured Partner: Project Renewal */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900/40 to-black/40 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-12 md:p-16">
              {/* Partner Header */}
              <div className="flex items-start justify-between mb-12 pb-8 border-b border-gray-700">
                <div>
                  <div className="inline-block border border-orange-500/30 bg-orange-500/10 px-4 py-2 rounded-full text-sm font-medium text-orange-400 tracking-wide uppercase mb-6">
                    Featured Partner
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src="/lovable-uploads/projectrenewal2.png" 
                      alt="Project Renewal Logo" 
                      className="h-16 w-auto"
                    />
                    <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                      Project Renewal
                    </h2>
                  </div>
                  <p className="text-2xl text-gray-400 italic font-light" style={{fontFamily: 'Georgia, serif'}}>
                    Renewing lives. Reclaiming hope.
                  </p>
                </div>
                <a  
                  href="https://www.projectrenewal.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors group bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full"
                >
                  <span className="text-sm font-medium">Visit Site</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Impact Stats */}
              <div className="grid md:grid-cols-3 gap-12 mb-16">
                <div className="text-center">
                  <div className="text-6xl font-serif font-bold text-white mb-3" style={{fontFamily: 'Playfair Display, serif'}}>9,796</div>
                  <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">People received services in 2023</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-serif font-bold text-white mb-3" style={{fontFamily: 'Playfair Display, serif'}}>98%</div>
                  <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">Remained housed after one year</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-serif font-bold text-white mb-3" style={{fontFamily: 'Playfair Display, serif'}}>4,000</div>
                  <div className="text-sm text-gray-400 uppercase tracking-widest font-medium">New Yorkers housed annually</div>
                </div>
              </div>

              {/* Editorial Content */}
              <div className="mb-16 space-y-8">
                <p className="text-xl leading-relaxed text-gray-200 font-light first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-white first-letter:mr-4 first-letter:float-left first-letter:leading-none first-letter:mt-2" style={{fontFamily: 'Georgia, serif'}}>
                  For over five decades, Project Renewal has stood as one of New York City's most 
                  trusted providers of comprehensive services to individuals experiencing homelessness. 
                  What sets them apart isn't just their scale—they're among the largest providers 
                  of health services to homeless individuals in the city—but their integrated approach 
                  to human dignity and long-term stability.
                </p>
                
                <p className="text-xl leading-relaxed text-gray-300 font-light" style={{fontFamily: 'Georgia, serif'}}>
                  Their model recognizes what housing advocates have long known: stable housing alone 
                  isn't enough. People need healthcare, employment opportunities, and community support 
                  to thrive. Project Renewal delivers all three through their comprehensive programs 
                  spanning emergency housing, transitional services, permanent supportive housing, 
                  and their innovative job training initiatives.
                </p>
                
                <p className="text-xl leading-relaxed text-gray-300 font-light" style={{fontFamily: 'Georgia, serif'}}>
                  In a city where single adult homelessness continues to grow by 1,000 people each year, 
                  Project Renewal's work represents both immediate relief and systemic change—providing 
                  award-winning housing programs while advocating for the policy changes needed to 
                  address root causes of housing instability.
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-3 gap-12 mb-12">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-serif font-semibold mb-4 tracking-tight text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                    Housing Programs
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-light" style={{fontFamily: 'Georgia, serif'}}>
                    Emergency, transitional, and permanent supportive housing serving nearly 4,000 New Yorkers annually
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-serif font-semibold mb-4 tracking-tight text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                    Healthcare Services
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-light" style={{fontFamily: 'Georgia, serif'}}>
                    Comprehensive medical care, substance use treatment, and psychiatric services
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-serif font-semibold mb-4 tracking-tight text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                    Employment Training
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-light" style={{fontFamily: 'Georgia, serif'}}>
                    Job training integrated across programs, including their social enterprise City Beet Kitchens
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-700 pt-12">
                <h3 className="text-3xl font-serif font-semibold mb-8 tracking-tight text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-lg text-gray-300 font-light leading-relaxed" style={{fontFamily: 'Georgia, serif'}}>
                      Project Renewal offers multiple pathways to support, whether you're seeking housing, 
                      healthcare, employment services, or looking to get involved as a volunteer or donor.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-blue-400" />
                        <a 
                          href="tel:+12126200340"
                          className="text-white hover:text-blue-300 transition-colors text-lg"
                        >
                          (212) 620-0340
                        </a>
                      </div>
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                        <span className="text-gray-400 text-lg">200 Varick Street, 9th Floor<br />New York, NY 10014</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <a 
                      href="https://www.projectrenewal.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 group justify-center"
                    >
                      Learn More
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Partners Coming Soon */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-900/30 to-black border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block border border-gray-500/30 bg-gray-500/10 px-4 py-2 rounded-full text-sm font-medium text-gray-400 tracking-wide uppercase mb-8">
            Expanding Directory
          </div>
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 tracking-tight text-white" style={{fontFamily: 'Playfair Display, serif'}}>
            More Partners Coming Soon
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-3xl mx-auto font-light" style={{fontFamily: 'Georgia, serif'}}>
            We're building relationships with organizations across NYC that share our commitment 
            to housing justice and community empowerment. Know an organization that should be featured here?
          </p>
          
          <a 
            href="mailto:info@realerestate.org" 
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 group"
          >
            Suggest a Partner
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/be3adab5-6cb0-457c-8fc5-22c457e9c7c9.png" 
                alt="Realer Estate Logo" 
                className="h-8 w-auto"
              />
              <span className="font-serif font-semibold text-xl tracking-tight" style={{fontFamily: 'Playfair Display, serif'}}>Realer Estate</span>
            </div>
            <div className="flex space-x-8 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/press" className="hover:text-white transition-colors">Press</a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400 font-light" style={{fontFamily: 'Georgia, serif'}}>
              © 2025 Realer Estate. Building community through housing access.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Partners;