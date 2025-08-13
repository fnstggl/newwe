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
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Press from "./pages/Press";
import NotFound from "./pages/NotFound";
import CancelSubscription from "./pages/CancelSubscription";
import ManageSubscription from "./pages/ManageSubscription";
import OpenDoor from "./pages/OpenDoor";
import Navbar from "./components/Navbar";
import MobileNavigation from "./components/MobileNavigation";
import OnboardingPopup from "./components/OnboardingPopup";
import { useState } from "react";
import Checkout from "./pages/Checkout";
import ForYou from "./pages/ForYou";
import NewJoin from "./pages/NewJoin";

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
        <Route path="/buy/:listingId" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/rent/:listingId" element={<Rent />} />
        <Route path="/saved" element={<SavedProperties />} />
        <Route path="/foryou" element={<ForYou />} />
        <Route path="/mission" element={<Manifesto />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cancel-subscription" element={<CancelSubscription />} />
        <Route path="/manage-subscription" element={<ManageSubscription />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/press" element={<Press />} />
        <Route path="/housingaccess" element={<OpenDoor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
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
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
