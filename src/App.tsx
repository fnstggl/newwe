
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Neighborhoods from "./pages/Neighborhoods";
import Manifesto from "./pages/Manifesto";
import Pricing from "./pages/Pricing";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import MobileNavigation from "./components/MobileNavigation";
import OnboardingPopup from "./components/OnboardingPopup";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, userProfile, updateOnboardingStatus } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding for authenticated users who haven't completed it
    if (user && userProfile && !userProfile.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [user, userProfile]);

  const handleOnboardingComplete = async (data: any) => {
    console.log('Onboarding data:', data);
    await updateOnboardingStatus(true);
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/neighborhoods" element={<Neighborhoods />} />
        <Route path="/manifesto" element={<Manifesto />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNavigation />
      
      <OnboardingPopup
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
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
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
