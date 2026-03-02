import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { JourneyProvider } from "@/context/JourneyContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import DayPage from "./pages/DayPage";
import DayJournalPage from "./pages/DayJournalPage";
import JourneyPage from "./pages/JourneyPage";
import JournalPage from "./pages/JournalPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/journey" element={<ProtectedRoute><JourneyPage /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/day/:dayNumber" element={<ProtectedRoute><DayPage /></ProtectedRoute>} />
        <Route path="/day/:dayNumber/journal" element={<ProtectedRoute><DayJournalPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {user && <BottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <JourneyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </JourneyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
