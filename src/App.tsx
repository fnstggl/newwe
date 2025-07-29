
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Rent from "./pages/Rent";
import Buy from "./pages/Buy";
import SavedProperties from "./pages/SavedProperties";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import ManageSubscription from "./pages/ManageSubscription";
import CancelSubscription from "./pages/CancelSubscription";
import Manifesto from "./pages/Manifesto";
import Neighborhoods from "./pages/Neighborhoods";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Press from "./pages/Press";
import NotFound from "./pages/NotFound";
import OpenDoor from "./pages/OpenDoor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/saved" element={<SavedProperties />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/manage-subscription" element={<ManageSubscription />} />
            <Route path="/cancel-subscription" element={<CancelSubscription />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/neighborhoods" element={<Neighborhoods />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/press" element={<Press />} />
            <Route path="/open-door" element={<OpenDoor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
