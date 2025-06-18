
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { HoverButton } from "../components/ui/hover-button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login here
    console.log("Login attempt:", email);
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tighter">
            Already got access?
          </h1>
          <p className="text-gray-400 text-lg tracking-tight">
            Welcome back to your unfair advantage.
          </p>
        </div>

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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-4 pr-12 bg-gray-900/50 border-2 border-gray-700 rounded-full text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <HoverButton
            type="submit"
            className="w-full py-4 text-lg font-semibold tracking-tight text-white"
          >
            Log In
          </HoverButton>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 tracking-tight">
            No account yet?{" "}
            <Link 
              to="/join" 
              className="text-white hover:text-white transition-colors"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
              }}
            >
              Join now →
            </Link>
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/search" 
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm tracking-tight"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
