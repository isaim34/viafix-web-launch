
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Mechanics from "./pages/Mechanics";
import MechanicProfile from "./pages/MechanicProfile";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import MechanicDashboard from "./pages/MechanicDashboard";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import CustomerProfile from "./pages/CustomerProfile";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mechanics" element={<Mechanics />} />
                <Route path="/mechanics/:id" element={<MechanicProfile />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
                <Route path="/two-factor-auth" element={<TwoFactorAuth />} />
                <Route path="/customer/profile" element={<CustomerProfile />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </TooltipProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
