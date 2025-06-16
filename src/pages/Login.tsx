
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
              className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2 tracking-tight">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all tracking-tight text-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-4 rounded-xl font-semibold text-lg tracking-tight hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Log In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 tracking-tight">
            No account yet?{" "}
            <Link to="/join" className="text-blue-400 hover:text-blue-300 transition-colors">
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
