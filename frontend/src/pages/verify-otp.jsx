import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Mic, Loader2, RotateCcw, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

export default function VerifyOtp() {
  const { setAccessToken } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const email = sessionStorage.getItem("browseai_pending_email") || "";

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({ title: "Enter the full 6-digit code", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email, otp
      });
      toast({
        title: "Success",

        description: res.data.message,
      });
      // You store in sessionStorage but never update context
      
      // Fix — add this:
 
      // ...
      setAccessToken(res.data.accessToken); // ← syncs context so ProtectedRoute sees it
      


      // In handleVerify, after successful response:
      sessionStorage.setItem("browseai_access_token", res.data.accessToken);
      sessionStorage.removeItem("browseai_pending_email");
      setLocation("/dashboard");

    } catch (err) {
      toast({
        title: "Verification failed",
        description: err instanceof Error ? err.message : "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await axios.post("/api/auth/resend-otp", {
        email,
      });
      if (!res.data.success) throw new Error(res.data.message || "Failed to resend");
      toast({ title: "New code sent", description: "Check your inbox." });
      setResendCountdown(60);
    } catch (err) {
      toast({
        title: "Could not resend",
        description: err instanceof Error ? err.message : "Try again shortly",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/12 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Logo */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/45 hover:text-white transition-colors" data-testid="link-back-home">
        <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center">
          <Mic className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold">BrowseAI</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Icon */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
            className="relative mb-7"
          >
            <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-2xl scale-110" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center shadow-xl shadow-primary/20">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-white tracking-tight mb-3"
          >
            Check your email
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-white/40 text-sm text-center max-w-xs leading-relaxed">
              We sent a 6-digit verification code to
            </p>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="text-white text-sm font-semibold">{email || "your email"}</span>
            </div>
          </motion.div>
        </div>

        {/* OTP Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel rounded-3xl p-8 flex flex-col items-center gap-8"
        >
          {/* OTP input */}
          <div className="flex flex-col items-center gap-4 w-full">
            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Enter 6-digit code</p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp} data-testid="input-otp">
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="w-12 h-14 text-xl font-black border-white/[0.08] bg-white/[0.04] text-white rounded-xl transition-all data-[active]:border-primary/60 data-[active]:bg-primary/10 data-[active]:shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleVerify}
            disabled={isLoading || otp.length < 6}
            data-testid="button-verify"
            className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white font-bold rounded-2xl gap-2 shadow-lg shadow-primary/25 text-base"
          >
            {isLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
              : "Verify and continue"}
          </Button>

          {/* Resend */}
          <div className="flex flex-col items-center gap-2 pt-2 border-t border-white/[0.06] w-full">
            <p className="text-sm text-white/30">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={isResending || resendCountdown > 0}
              data-testid="button-resend"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/75 disabled:text-white/25 disabled:cursor-not-allowed transition-colors"
            >
              {isResending
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
                : resendCountdown > 0
                  ? <span className="tabular-nums">Resend in {resendCountdown}s</span>
                  : <><RotateCcw className="w-3.5 h-3.5" /> Resend code</>}
            </button>
          </div>
        </motion.div>

        <p className="text-center mt-6 text-sm text-white/25">
          Wrong email?{" "}
          <Link href="/sign-up" className="text-primary hover:text-primary/70 font-semibold transition-colors" data-testid="link-back-signup">
            Go back
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
