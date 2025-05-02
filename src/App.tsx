import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { AIProvider } from "@/context/AIContext";
import { lazy, Suspense } from "react";
import * as syncService from "@/services/syncService";

// Lazy-loaded components
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const JoinWaitlist = lazy(() => import("./pages/JoinWaitlist"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Timesheet = lazy(() => import("./pages/Timesheet"));
const KanbanBoard = lazy(() => import("./pages/KanbanBoard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const Schedule = lazy(() => import("./pages/Schedule"));

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
};

// Sync service setup component
const SyncManager = () => {
  const { user } = useUser();
  const userId = user?.id || '';

  useEffect(() => {
    if (userId) {
      // Register device
      syncService.registerDevice(userId);
      
      // Set up periodic sync
      const cleanup = syncService.setupPeriodicSync(userId, 5); // Sync every 5 minutes
      
      // Set up connectivity handlers
      const connCleanup = syncService.setupSyncConnectivityHandlers(userId);
      
      return () => {
        cleanup();
        connCleanup();
      };
    }
  }, [userId]);

  return null;
};

const App = () => {
  // Get Clerk publishable key from environment
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk Publishable Key");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          elements: {
            formButtonPrimary: "neema-button py-2 px-4",
            card: "bg-white border border-neema-secondary/20 rounded-xl shadow-md",
            formFieldInput: "border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 rounded-md",
            formFieldLabel: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
          }
        }}
        signInUrl="/login"
        signUpUrl="/joinwaitlist"
        waitlistUrl="/joinwaitlist"
        fallbackRedirectUrl="/dashboard"
        afterSignUpUrl="/joinwaitlist"
      >
        <AIProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SignedIn>
                <SyncManager />
              </SignedIn>
              <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/joinwaitlist" element={<JoinWaitlist />} />
                  
                  {/* Protected routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="/schedule"
                    element={
                      <ProtectedRoute>
                        <Schedule />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/timesheet" 
                    element={
                      <ProtectedRoute>
                        <Timesheet />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/kanban" 
                    element={
                      <ProtectedRoute>
                        <KanbanBoard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Not found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AIProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
};

export default App;
