import { useState, useEffect } from "react";
import {
  Switch,
  Route,
  Router as WouterRouter,
  useLocation,
  Redirect,
} from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ScrollProgress } from "./components/scroll-progress";
import { PageLoader } from "./components/page-loader";

import Home from "./pages/home";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up.jsx";
import VerifyOtp from "./pages/verify-otp";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0.95 },
  animate: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
};



// Shows PageLoader while auth check is in flight.

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!accessToken) return <Redirect to="/sign-in" />;
  return <>{children}</>;
}

// Public-only Route
// Bounces already-logged-in users to dashboard.

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (accessToken) return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence>
      <motion.div
        key={location}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        style={{ minHeight: "100vh" }}
      >
        <Switch>
          <Route path="/" component={Home} />

          <Route path="/sign-in">
            <PublicOnlyRoute>
              <SignIn />
            </PublicOnlyRoute>
          </Route>

          <Route path="/sign-up">
            <PublicOnlyRoute>
              <SignUp />
            </PublicOnlyRoute>
          </Route>

          <Route path="/verify-otp">
            <PublicOnlyRoute>
              <VerifyOtp />
            </PublicOnlyRoute>
          </Route>

          <Route path="/dashboard">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [loaderDone, setLoaderDone] = useState(false);

  // Show page loader only on first visit per session
  const [showLoader] = useState(() => {
    if (typeof window === "undefined") return false;
    const seen = sessionStorage.getItem("browseai_loaded");
    if (!seen) {
      sessionStorage.setItem("browseai_loaded", "1");
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (!showLoader) setLoaderDone(true);
  }, [showLoader]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {showLoader && !loaderDone && (
            <PageLoader onComplete={() => setLoaderDone(true)} />
          )}
          <ScrollProgress />
          <WouterRouter
            base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}
          >
            <AnimatedRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;