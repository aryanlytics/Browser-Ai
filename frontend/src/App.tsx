import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ScrollProgress } from "@/components/scroll-progress";
import { PageLoader } from "@/components/page-loader";

import Home from "@/pages/home";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import VerifyOtp from "@/pages/verify-otp";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0, y: -8, filter: "blur(3px)",
    transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] },
  },
};

function AnimatedRoutes() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location} variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ minHeight: "100vh" }}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/verify-otp" component={VerifyOtp} />
          <Route path="/dashboard" component={Dashboard} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [loaderDone, setLoaderDone] = useState(false);

  // Only show loader on first visit (not on every route change)
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
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
            <AnimatedRoutes />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
