import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Mic,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import girlAgent from "../assets/ai-agent-girl-nobg.png";

const PERKS = [
  "Free forever plan — no credit card needed",
  "Browser access by voice from day one",
  "Unlimited public searches & research",
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Registration failed");
      sessionStorage.setItem("browseai_pending_email", form.email);
      setLocation("/verify-otp");
    } catch (err: unknown) {
      toast({
        title: "Registration failed",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Left: image + brand panel */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden items-center justify-center flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/15 to-background" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px]" />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <motion.img
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            src={girlAgent}
            alt="BrowseAI Assistant"
            className="w-72 max-w-full object-contain drop-shadow-[0_0_60px_rgba(139,92,246,0.5)] mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Join the future of
            <br />
            <span className="text-gradient">browser automation</span>
          </h2>
          <p className="text-white/35 text-sm leading-relaxed max-w-xs mb-8">
            Set up your co-pilot in 60 seconds and start commanding the web by
            voice today.
          </p>
          <div className="flex flex-col gap-3 text-left w-full max-w-xs">
            {PERKS.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="text-white/45 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 lg:hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
        </div>

        <button
          onClick={() => setLocation("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/45 hover:text-white transition-colors"
          data-testid="link-back-home"
        >
          <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center">
            <Mic className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold">BrowseAI</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
              Create account
            </h1>
            <p className="text-white/35 text-sm">
              Your AI co-pilot is ready to activate
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            data-testid="button-google-signup"
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/8 hover:border-white/20 text-white text-sm font-medium transition-all mb-5"
          >
            <SiGoogle className="w-4 h-4 text-white/60" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[11px] text-white/22 font-medium">
              or register with email
            </span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="name"
                className="text-white/50 text-[11px] font-semibold uppercase tracking-wider"
              >
                Full name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Alex Johnson"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                data-testid="input-name"
                className="bg-white/[0.04] border-white/8 text-white placeholder:text-white/18 focus:border-primary/50 h-11 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="email"
                className="text-white/50 text-[11px] font-semibold uppercase tracking-wider"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="alex@gmail.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                data-testid="input-email"
                className="bg-white/[0.04] border-white/8 text-white placeholder:text-white/18 focus:border-primary/50 h-11 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="password"
                className="text-white/50 text-[11px] font-semibold uppercase tracking-wider"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  data-testid="input-password"
                  className="bg-white/[0.04] border-white/8 text-white placeholder:text-white/18 focus:border-primary/50 h-11 rounded-xl pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/28 hover:text-white/60 transition-colors"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-white/50 text-[11px] font-semibold uppercase tracking-wider"
              >
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  data-testid="input-confirm-password"
                  className="bg-white/[0.04] border-white/8 text-white placeholder:text-white/18 focus:border-primary/50 h-11 rounded-xl pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/28 hover:text-white/60 transition-colors"
                  data-testid="button-toggle-confirm"
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              data-testid="button-submit"
              className="h-11 mt-1 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl gap-2 group shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating
                  account...
                </>
              ) : (
                <>
                  Create account{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-white/18 mt-0.5">
              By signing up you agree to our Terms and Privacy Policy.
            </p>
          </form>

          <p className="text-center mt-6 text-sm text-white/28">
            Have an account?{" "}
            <button
              onClick={() => setLocation("/sign-in")}
              className="text-primary hover:text-primary/70 font-semibold transition-colors cursor-pointer"
              data-testid="link-sign-in"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
