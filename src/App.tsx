
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

import Index from "./pages/Index";
import Navbar from "./components/Navbar";

// Lazy load components
const Buy = lazy(() => import("./pages/Buy"));
const Rent = lazy(() => import("./pages/Rent"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Manifesto = lazy(() => import("./pages/Manifesto"));
const Join = lazy(() => import("./pages/Join"));
const NewJoin = lazy(() => import("./pages/NewJoin"));
const ForYou = lazy(() => import("./pages/ForYou"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const Neighborhoods = lazy(() => import("./pages/Neighborhoods"));
const Search = lazy(() => import("./pages/Search"));
const OpenDoor = lazy(() => import("./pages/OpenDoor"));
const Press = lazy(() => import("./pages/Press"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ManageSubscription = lazy(() => import("./pages/ManageSubscription"));
const CancelSubscription = lazy(() => import("./pages/CancelSubscription"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Navbar />
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/buy" element={<Buy />} />
                  <Route path="/rent" element={<Rent />} />
                  <Route path="/saved" element={<SavedProperties />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/manifesto" element={<Manifesto />} />
                  <Route path="/join" element={<NewJoin />} />
                  <Route path="/old-join" element={<Join />} />
                  <Route path="/foryou" element={<ForYou />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/neighborhoods" element={<Neighborhoods />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/open-door" element={<OpenDoor />} />
                  <Route path="/press" element={<Press />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/manage-subscription" element={<ManageSubscription />} />
                  <Route path="/cancel-subscription" element={<CancelSubscription />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
