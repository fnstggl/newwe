
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Profile from "./pages/Profile";
import Rent from "./pages/Rent";
import Buy from "./pages/Buy";
import Search from "./pages/Search";
import SavedProperties from "./pages/SavedProperties";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import ManageSubscription from "./pages/ManageSubscription";
import CancelSubscription from "./pages/CancelSubscription";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Manifesto from "./pages/Manifesto";
import Neighborhoods from "./pages/Neighborhoods";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import MobileNavigation from "./components/MobileNavigation";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 pb-16 md:pb-0">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/join" element={<Join />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/rent" element={<Rent />} />
                  <Route path="/rent/:listingId" element={<Rent />} />
                  <Route path="/buy" element={<Buy />} />
                  <Route path="/buy/:listingId" element={<Buy />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/saved-properties" element={<SavedProperties />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/manage-subscription" element={<ManageSubscription />} />
                  <Route path="/cancel-subscription" element={<CancelSubscription />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/manifesto" element={<Manifesto />} />
                  <Route path="/neighborhoods" element={<Neighborhoods />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <MobileNavigation />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
