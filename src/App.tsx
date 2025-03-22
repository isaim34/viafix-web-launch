
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Mechanics from "./pages/Mechanics";
import MechanicProfile from "./pages/MechanicProfile";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import MechanicDashboard from "./pages/MechanicDashboard";

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
              <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
