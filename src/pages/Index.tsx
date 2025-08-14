import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import AISearch from "@/components/AISearch";
import TestimonialsSection from "@/components/TestimonialsSection";
import { supabase } from "@/integrations/supabase/client";

/* ============== Mobile (kept untouched) ============== */
/** Replace this stub with your existing MobileLanding code.
 *  Leaving the stub prevents build errors if you paste just this file.
 */
const MobileLanding: React.FC = () => {
  return <div className="min-h-screen bg-black text-white">/* your existing MobileLanding goes here */</div>;
};

/* ============== ScrollJackedSection (unchanged logic) ============== */
const ScrollJackedSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const text1Y = useTransform(scrollYProgress, [0, 0.33], [0, -100]);
  const text2Y = useTransform(scrollYProgress, [0, 0.33, 0.66], [100, 0, -100]);
  const text3Y = useTransform(scrollYProgress, [0.33, 0.66, 1], [200, 100, 0]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.58, 0.66], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.58, 0.75, 1], [0, 1, 1]);

  const textContent = [
    {
      title: "We scan 30,000+ listings a week",
      subtitle:
        "Real-time analysis of thousands of data points to identify true value of each listing.",
      opacity: text1Opacity,
      y: text1Y,
    },
    {
      title: "We flag listings up to 60% below-market",
      subtitle:
        "We only show you the best below-market & rent-stabilized listings, so you never overpay again.",
      opacity: text2Opacity,
      y: text2Y,
    },
    {
      title: "Save $925/mo on rent, $101k when buying",
      subtitle:
        "Based on average savings data. Join 6000+ New Yorkers finding the best deals in the city.",
      opacity: text3Opacity,
      y: text3Y,
    },
  ];

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="w-full text-center py-8 px-4">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white">
            The real estate market in NYC is rigged. Now you can win.
          </h2>
        </div>

        <div className="flex-1 flex items-center px-8">
          <div className="w-full max-w-none mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center h-full">
              <div className="relative order-2 lg:order-1">
                <img
                  src="/lovable-uploads/desk5.png"
                  alt="Realer Estate desktop platform showing NYC property scan"
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>

              <div className="order-1 lg:order-2 relative min-h-[300px] overflow-hidden">
                {textContent.map((content, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ opacity: content.opacity, y: content.y }}
                  >
                    <div className="space-y-6">
                      <h3 className="text-3xl md:text-4xl font-inter font-semibold tracking-tighter text-white">
                        {content.title}
                      </h3>
                      <p className="text-xl text-gray-300 font-inter tracking-tight leading-relaxed">
                        {content.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============== FeaturedDeals (safe types) ============== */
type Deal = {
  id?: string | number;
  listing_id?: string;
  images?: string[];
  address?: string;
  neighborhood?: string;
  monthly_rent?: number;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  baths?: number;
  discount_percent?: number;
  undervaluation_percent?: number;
  grade?: string;
};

const money = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "--");

const DealCard: React.FC<{ deal: Deal; mode: "rent" | "buy" }> = ({ deal, mode }) => {
  const discount = Math.round(
    Math.max(
      deal.discount_percent || 0,
      deal.undervaluation_percent || 0,
      deal.grade === "A+" ? 15 : 0
    )
  );

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/[0.07] transition-all duration-300 shadow-[0_0_1px_rgba(255,255,255,0.15)]">
      <div className="aspect-[4/3] relative overflow-hidden">
        {deal.images?.[0] ? (
          <img
            src={deal.images[0]}
            alt={deal.address || "Listing"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}

        {deal.grade && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white/90 bg-black/40 backdrop-blur-md border border-white/10">
            {deal.grade}
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-md">
            {discount}% Below Market
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-white text-xl font-bold tracking-tight">
          {mode === "rent" ? `$${money(deal.monthly_rent)}/mo` : `$${money(deal.price)}`}
        </div>
        <div className="text-sm text-white/70">
          {deal.bedrooms ?? "-"} bed • {deal.bathrooms ?? deal.baths ?? "-"} bath
        </div>
        <div className="text-xs text-white/60 mt-1 truncate">{deal.neighborhood || ""}</div>
      </div>
    </div>
  );
};

const FeaturedDealsCarousel: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [rentalsQ, stabilizedQ] = await Promise.all([
          supabase
            .from("undervalued_rentals")
            .select("*")
            .eq("status", "active")
            .eq("likely_rented", false)
            .in("grade", ["A+", "A", "A-"])
            .order("score", { ascending: false })
            .limit(6),
          supabase
            .from("undervalued_rent_stabilized")
            .select("*")
            .eq("display_status", "active")
            .eq("likely_rented", false)
            .order("created_at", { ascending: false })
            .limit(3),
        ]);

        const rentals: Deal[] = (rentalsQ.data as any[])?.map((p) => ({
          ...p,
          images: Array.isArray(p.images)
            ? p.images
            : typeof p.images === "string"
            ? (() => {
                try {
                  return JSON.parse(p.images);
                } catch {
                  return [];
                }
              })()
            : [],
          listing_id: p.listing_id || p.id,
        })) || [];

        const stabilized: Deal[] =
          (stabilizedQ.data as any[])?.map((p) => ({
            ...p,
            images: p.images || [],
            listing_id: p.listing_id || p.id,
            discount_percent: p.undervaluation_percent,
            grade: "A+",
          })) || [];

        const mixed = [...rentals.slice(0, 5), ...stabilized.slice(0, 2)].slice(0, 7);
        setDeals(mixed.slice(0, 3));
      } catch (e) {
        console.error("Failed to load featured deals", e);
      }
    })();
  }, []);

  useEffect(() => {
    if (deals.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % deals.length), 4000);
    return () => clearInterval(t);
  }, [deals.length]);

  const current = (i: number) => (deals.length ? deals[(index + i) % deals.length] : undefined);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map((offset) => {
          const d = current(offset);
          return (
            <motion.div
              key={offset}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer"
              onClick={() => d?.listing_id && navigate(`/rent/${d.listing_id}`)}
            >
              {d ? <DealCard deal={d} mode="rent" /> : <div className="h-[260px] rounded-2xl bg-white/5 border border-white/10" />}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-3 text-right text-xs text-white/50">Live sample deals • auto-rotates</div>
    </div>
  );
};

/* ============== Desktop (new dark/blue) ============== */
const DesktopIndex: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Realer Estate — NYC Apartments Up to 60% Below Market";
  }, []);

  return (
    <div className="bg-[#04060A] text-white font-inter overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,_rgba(0,168,255,0.10),_transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-300px] right-[-200px] w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.10),_transparent_60%)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070D]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-bold tracking-tight text-white">
            RealerEstate
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <Link to="/for-you" className="hover:text-white">For You</Link>
            <Link to="/buy" className="hover:text-white">Buy</Link>
            <Link to="/rent" className="hover:text-white">Rent</Link>
            <Link to="/upgrade" className="hover:text-white">Upgrade</Link>
            <Link to="/mission" className="hover:text-white">Mission</Link>
          </nav>
          <Link
            to="/rent"
            className="rounded-full px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-indigo-500/30 transition-colors"
          >
            See Deals
          </Link>
        </div>
      </header>

      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-[-0.04em]"
              >
                NYC Apartments Up to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300">
                  60% Below Market
                </span>
                .
                <br />
                Before Anyone Else.
              </motion.h1>

              <p className="mt-4 text-white/70 text-lg max-w-xl">
                We scan 30,000+ listings a week and surface the real deals — below-market and rent-stabilized — in one place.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-2 shadow-[0_0_1px_rgba(255,255,255,0.15)]">
                <AISearch
                  onResults={() => {}}
                  placeholder="Try: 1BR West Village under $2,400 • A+ Park Slope"
                  className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-white/40 px-2 py-3"
                  showSuggestions={false}
                  hideInterpretation={true}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <Link to="/rent" className="rounded-full px-6 py-3 bg-white text-black font-semibold hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-shadow">
                  Find My First Deal
                </Link>
                <Link to="/buy" className="rounded-full px-6 py-3 border border-cyan-400/40 text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors">
                  See Buyer Deals
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[28px] bg-[radial-gradient(100%_100%_at_50%_0%,rgba(59,130,246,0.15),rgba(59,130,246,0)_70%)] blur-2xl -z-10" />
              <FeaturedDealsCarousel />
              <div className="mt-3 text-right text-xs text-white/50">Live sample deals • auto-rotates</div>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "Scan & score", d: "We analyze 30k+ listings/week and compute true market value." },
            { t: "Flag the winners", d: "Only real below-market and rent-stabilized deals make the cut." },
            { t: "You act first", d: "Alerts & filters so you beat the crowd." },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-6 border border-white/10 bg-white/[0.05] backdrop-blur-xl">
              <div className="text-xl font-semibold mb-2">{item.t}</div>
              <div className="text-white/70 text-sm leading-relaxed">{item.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-8">
        <TestimonialsSection />
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(14,165,233,0.12),transparent)]" />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center relative">
          <h3 className="text-4xl md:text-5xl font-semibold tracking-tight">Let the apartment hunt end here.</h3>
          <p className="mt-3 text-white/70">Join 6,000+ New Yorkers finding better homes for less.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/join" className="rounded-full px-8 py-3 bg-white text-black font-semibold hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-shadow">
              Create Free Account
            </Link>
            <Link to="/pricing" className="rounded-full px-8 py-3 border border-cyan-400/40 text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors">
              Try Unlimited
            </Link>
          </div>

          <div className="mt-10 text-xs text-white/50">
            <Link to="/privacy" className="hover:text-white/70">Privacy</Link> ·{" "}
            <Link to="/terms" className="hover:text-white/70">Terms</Link> ·{" "}
            <Link to="/press" className="hover:text-white/70">Press</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============== Entry switch ============== */
const Index: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile ? <MobileLanding /> : <DesktopIndex />;
};

export default Index;