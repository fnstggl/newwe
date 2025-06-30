import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import SavedProperties from "./pages/SavedProperties";
import Manifesto from "./pages/Manifesto";
import Pricing from "./pages/Pricing";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import MobileNavigation from "./components/MobileNavigation";
import OnboardingPopup from "./components/OnboardingPopup";
import { useState } from "react";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/saved" element={<SavedProperties />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/join" element={<Join setShowOnboarding={setShowOnboarding} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNavigation />
      
      <OnboardingPopup 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SubscriptionProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SubscriptionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
