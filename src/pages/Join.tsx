import { useState } from "react";
import { HoverButton } from "../components/ui/hover-button";

const Join = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Email submitted:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">
            NYC's best deals don't stay online for long.
          </h1>
          <p className="text-gray-400 text-lg tracking-tight">
            Get exclusive access to undervalued listings before they hit the market.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@domain.com"
                className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
              />
            </div>

            <HoverButton
              type="submit"
              className="w-full py-4 text-lg font-semibold tracking-tight bg-white text-black hover:bg-gray-100"
            >
              Give me the deals.
            </HoverButton>

            <p className="text-center text-gray-500 text-sm tracking-tight">
              Early access. Zero spam. Unsubscribe anytime.
            </p>
          </form>
        ) : (
          <div className="text-center bg-gray-900/50 rounded-2xl p-8 border border-green-500/20">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-4 text-green-400 tracking-tight">
              You're on the list!
            </h2>
            <p className="text-gray-400 tracking-tight">
              We'll notify you when the platform launches with exclusive deals.
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4 tracking-tight">
            What you'll get:
          </h3>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-blue-400">•</span>
              <span className="tracking-tight">First access to undervalued listings</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-blue-400">•</span>
              <span className="tracking-tight">Real-time deal alerts</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-blue-400">•</span>
              <span className="tracking-tight">Market insights and data</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-blue-400">•</span>
              <span className="tracking-tight">No broker fees or commissions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
