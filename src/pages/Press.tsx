import { useEffect } from "react";
import { Download, Mail, Calendar, Phone, MapPin, ExternalLink } from "lucide-react";
import JSZip from "jszip";

const Press = () => {
  useEffect(() => {
    document.title = "Press & Media Kit - Realer Estate";
  }, []);

  const downloadMediaKit = async () => {
    const zip = new JSZip();
    
    const assets = [
      { url: '/lovable-uploads/3accba2a-bd3d-4027-9758-2462e4b30865.png', name: 'realer-estate-founders.png' },
      { url: '/lovable-uploads/84439388-74a7-4c6d-8fe8-d5cb5f0108e0.png', name: 'realer-estate-platform-screenshot.png' },
      { url: '/lovable-uploads/81dfa622-d136-49f1-bfa2-6cf1e63ee82d.png', name: 'realer-estate-never-overpay.png' },
      { url: '/lovable-uploads/e0856c30-f6b7-49d8-a596-88bdb09cc616.png', name: 'realer-estate-nyc-broken-game.png' },
      { url: '/lovable-uploads/a16979a1-3495-4871-ae83-39233e3ff855.png', name: 'realer-estate-logo-black.png' },
      { url: '/lovable-uploads/af9d7567-403c-454c-b80e-18f8ac3dcd74.png', name: 'realer-estate-logo-white.png' },
      { url: '/lovable-uploads/7a974d99-4ed9-4a37-a0b2-fb6e93c98b41.png', name: 'realer-estate-logo-gradient.png' },
      { url: '/lovable-uploads/1f741d6d-8992-412b-b8d1-e78eb5a8434b.png', name: 'realer-estate-never-overpay-text.png' },
      { url: '/lovable-uploads/bbc73f16-b007-4cb7-be6b-c38f863b85d0.png', name: 'realer-estate-circle-logo-black.png' },
      { url: '/lovable-uploads/80f5f787-48b0-48d6-b1cf-11b051ff1254.png', name: 'realer-estate-circle-logo-white.png' }
    ];

    try {
      // Fetch all images and add to ZIP
      for (const asset of assets) {
        try {
          const response = await fetch(asset.url);
          if (response.ok) {
            const blob = await response.blob();
            zip.file(asset.name, blob);
          }
        } catch (error) {
          console.warn(`Failed to fetch ${asset.name}:`, error);
        }
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'realer-estate-media-kit.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="border-b border-gray-800 pb-8">
            <div className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-6 font-medium">
              Press & Media
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tight leading-none text-white" style={{fontFamily: 'Playfair Display, serif'}}>
              Media Kit
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed max-w-4xl font-light" style={{fontFamily: 'Georgia, serif'}}>
              Comprehensive resources for reporting on the teen-built affordable housing discovery tool reshaping how New Yorkers find housing
            </p>
          </div>
        </div>
      </header>

      {/* Key Information */}
      <section className="py-16 px-4 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-8 font-medium">
            Key Information
          </h2>
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="text-4xl font-serif mb-3 text-white" style={{fontFamily: 'Playfair Display, serif'}}>25,000+</div>
              <div className="text-sm text-gray-400 leading-relaxed">Active users searching for affordable housing</div>
            </div>
            <div>
              <div className="text-4xl font-serif mb-3 text-white" style={{fontFamily: 'Playfair Display, serif'}}>$98M+</div>
              <div className="text-sm text-gray-400 leading-relaxed">In total savings calculated for users</div>
            </div>
            <div>
              <div className="text-4xl font-serif mb-3 text-white" style={{fontFamily: 'Playfair Display, serif'}}>170+</div>
              <div className="text-sm text-gray-400 leading-relaxed">NYC zip codes covered by platform</div>
            </div>
            <div>
              <div className="text-4xl font-serif mb-3 text-white" style={{fontFamily: 'Playfair Display, serif'}}>Real-time</div>
              <div className="text-sm text-gray-400 leading-relaxed">AI-powered listing analysis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-20 px-4 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-12 font-medium">
            Company Profile
          </h2>
          <div className="space-y-8">
            <p className="text-xl leading-relaxed text-gray-200 font-light first-letter:text-7xl first-letter:font-serif first-letter:text-white first-letter:mr-4 first-letter:float-left first-letter:leading-none first-letter:mt-2" style={{fontFamily: 'Georgia, serif'}}>
              Realer Estate was founded by two Brooklyn natives who witnessed firsthand the systematic displacement of working families from their communities. Combining expertise in real estate and software development, they created an AI-powered platform that democratizes access to affordable housing information.
            </p>
            <p className="text-xl leading-relaxed text-gray-300 font-light" style={{fontFamily: 'Georgia, serif'}}>
              The platform employs machine learning algorithms to analyze New York City rental listings in real-time, identifying rent-stabilized apartments and undervalued properties that traditional search methods often miss. This technology-driven approach has surfaced over $98,000,000 in total calculated savings for New Yorkers across 170+ zip codes.
            </p>
            <p className="text-xl leading-relaxed text-gray-300 font-light" style={{fontFamily: 'Georgia, serif'}}>
              Beyond individual savings, Realer Estate represents a fundamental shift in how housing information is accessed and distributed—placing sophisticated market analysis tools directly in the hands of renters who need them most.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-4 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-12 font-medium">
            Leadership
          </h2>
          <div className="bg-gray-900/30 border border-gray-800 p-12 rounded-sm">
            <h3 className="text-3xl font-serif mb-4 text-white" style={{fontFamily: 'Playfair Display, serif'}}>
              Founding Team
            </h3>
            <p className="text-lg text-gray-300 mb-6 font-light leading-relaxed" style={{fontFamily: 'Georgia, serif'}}>
              Two young entrepreneurs from Brooklyn with complementary backgrounds in real estate and software development. Both founders are available for interviews and expert commentary on housing affordability, technology in real estate, and urban displacement.
            </p>
            <div className="text-sm text-gray-400">
              Media availability: Typically respond within 24 hours
            </div>
          </div>
        </div>
      </section>

      {/* Visual Assets */}
      <section className="py-20 px-4 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-12 font-medium">
            Visual Assets
          </h2>
          
          {/* Photography */}
          <div className="mb-16">
            <h3 className="text-lg font-serif mb-8 text-white" style={{fontFamily: 'Playfair Display, serif'}}>
              Photography
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <figure className="group">
                <div className="aspect-[4/3] bg-gray-900 border border-gray-800 rounded-sm overflow-hidden mb-3">
                  <img 
                    src="/lovable-uploads/3accba2a-bd3d-4027-9758-2462e4b30865.png" 
                    alt="Realer Estate Founders" 
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <figcaption className="text-sm text-gray-400">Company founders</figcaption>
              </figure>
              <figure className="group">
                <div className="aspect-[4/3] bg-gray-900 border border-gray-800 rounded-sm overflow-hidden mb-3">
                  <img 
                    src="/lovable-uploads/84439388-74a7-4c6d-8fe8-d5cb5f0108e0.png" 
                    alt="Realer Estate Platform" 
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <figcaption className="text-sm text-gray-400">Platform interface</figcaption>
              </figure>
              <figure className="group">
                <div className="aspect-[4/3] bg-gray-900 border border-gray-800 rounded-sm overflow-hidden mb-3">
                  <img 
                    src="/lovable-uploads/e0856c30-f6b7-49d8-a596-88bdb09cc616.png" 
                    alt="NYC Housing Market" 
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                </div>
                <figcaption className="text-sm text-gray-400">Market analysis visualization</figcaption>
              </figure>
            </div>
          </div>

          {/* Brand Elements */}
          <div className="mb-12">
            <h3 className="text-lg font-serif mb-8 text-white" style={{fontFamily: 'Playfair Display, serif'}}>
              Brand Elements
            </h3>
            <div className="grid grid-cols-3 gap-6 max-w-2xl">
              <figure>
                <div className="aspect-square bg-white border border-gray-800 rounded-sm p-6">
                  <img 
                    src="/lovable-uploads/a16979a1-3495-4871-ae83-39233e3ff855.png" 
                    alt="Logo - Black" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <figcaption className="text-xs text-gray-400 mt-2 text-center">Logo - Black</figcaption>
              </figure>
              <figure>
                <div className="aspect-square bg-black border border-gray-800 rounded-sm p-6">
                  <img 
                    src="/lovable-uploads/af9d7567-403c-454c-b80e-18f8ac3dcd74.png" 
                    alt="Logo - White" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <figcaption className="text-xs text-gray-400 mt-2 text-center">Logo - White</figcaption>
              </figure>
              <figure>
                <div className="aspect-square border border-gray-800 rounded-sm">
                  <img 
                    src="/lovable-uploads/7a974d99-4ed9-4a37-a0b2-fb6e93c98b41.png" 
                    alt="Logo - Gradient" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <figcaption className="text-xs text-gray-400 mt-2 text-center">Logo - Gradient</figcaption>
              </figure>
            </div>
          </div>
          
          <button 
            onClick={downloadMediaKit}
            className="inline-flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
          >
            <Download size={16} />
            Download Media Kit
          </button>
          <p className="text-xs text-gray-500 mt-3">High-resolution assets in ZIP format</p>
        </div>
      </section>

      {/* User Quotes */}
      <section className="py-20 px-4 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-12 font-medium">
            User Perspectives
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <blockquote className="border-l border-gray-600 pl-6">
                <p className="text-lg font-light italic text-gray-300 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                  "This is great. In my dreams I am able to move back to NYC and keep checking all the time as rents keep hiking in Philly."
                </p>
                <cite className="text-sm text-gray-500">Reddit user</cite>
              </blockquote>
              <blockquote className="border-l border-gray-600 pl-6">
                <p className="text-lg font-light italic text-gray-300 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                  "I will definitely be using this as I plan my move in the future."
                </p>
                <cite className="text-sm text-gray-500">Reddit user</cite>
              </blockquote>
            </div>
            <div className="space-y-8">
              <blockquote className="border-l border-gray-600 pl-6">
                <p className="text-lg font-light italic text-gray-300 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                  "I love this tool & what you're doing to help bc it's a real struggle out here"
                </p>
                <cite className="text-sm text-gray-500">Reddit user</cite>
              </blockquote>
              <blockquote className="border-l border-gray-600 pl-6">
                <p className="text-lg font-light italic text-gray-300 mb-4" style={{fontFamily: 'Georgia, serif'}}>
                  "Hi! This is a really great tool, thanks for sharing and creating this."
                </p>
                <cite className="text-sm text-gray-500">Reddit user</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-12 font-medium">
            Press Contact
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-serif mb-6 text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                Media Inquiries
              </h3>
              <p className="text-lg text-gray-300 mb-8 font-light leading-relaxed" style={{fontFamily: 'Georgia, serif'}}>
                For interviews, expert commentary, data analysis, or story development assistance.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a 
                    href="mailto:info@realerestate.org" 
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    info@realerestate.org
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Response time: Within 24 hours</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/30 border border-gray-800 p-8 rounded-sm">
              <h3 className="text-2xl font-serif mb-4 text-white" style={{fontFamily: 'Playfair Display, serif'}}>
                Story Angles
              </h3>
              <ul className="space-y-3 text-gray-300 font-light" style={{fontFamily: 'Georgia, serif'}}>
                <li>• AI applications in affordable housing</li>
                <li>• NYC housing affordability crisis</li>
                <li>• Technology democratizing market access</li>
                <li>• Young entrepreneurs tackling urban displacement</li>
                <li>• Data-driven approaches to rent stabilization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Press;
