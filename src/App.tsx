import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Members from "./pages/Members";
import Publications from "./pages/Publications";
import Accommodations from "./pages/Accommodations";
import AuthCallback from "./pages/AuthCallback";
import MemberCard from "./pages/MemberCard";
import IosMemberCard from "./pages/IosMemberCard";
import PublicMemberCard from "./pages/PublicMemberCard";
import QrCodes from "./pages/QrCodes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/members" element={<Members />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/accommodations" element={<Accommodations />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/member-card" element={<MemberCard />} />
          <Route path="/ios-member-card" element={<IosMemberCard />} />
          <Route path="/public-card/:id" element={<PublicMemberCard />} />
          <Route path="/qr-codes" element={<QrCodes />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;