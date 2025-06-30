import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HoverButton } from "@/components/ui/hover-button";

interface JoinProps {
  onShowOnboarding: () => void;
}

const Join = ({ onShowOnboarding }: JoinProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });

      // Show onboarding popup after successful signup
      onShowOnboarding();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-inter">
      <div className="w-full max-w-md p-6 bg-gray-900/50 rounded-lg shadow-md border border-gray-800">
        <h1 className="text-3xl font-semibold text-center mb-4 tracking-tight">
          Join Realer Estate
        </h1>
        <p className="text-gray-400 text-center mb-6 tracking-tight">
          Get early access to the best NYC real estate deals.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus-visible:ring-blue-500"
            />
          </div>
          <Button
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg tracking-tight disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-400 tracking-tight">
            Already have an account?{" "}
            <HoverButton onClick={() => navigate("/login")} className="text-blue-500">
              Log In
            </HoverButton>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Join;
