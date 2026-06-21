import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Impact from "./pages/Impact";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Learn from "./pages/Learn";
import About from "./pages/About";
import FarmerDashboard from "./pages/FarmerDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/about" element={<About />} />
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/investor" element={<InvestorDashboard />} />
          <Route path="/collector" element={<CollectorDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
