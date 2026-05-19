import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { Button } from "../components/ui/button";
import {
  GsapFadeUp,
  GsapSlideIn,
  GsapScale,
  GsapStagger,
} from "../components/gsap-reveal";
import {
  Mic,
  ArrowRight,
  Globe,
  Video,
  Mail,
  ChevronDown,
  Star,
  Zap,
  Brain,
  Clock,
  CheckCircle2,
  Play,
  X,
  MessageSquare,
  MousePointer2,
  Keyboard,
  Eye,
  Search,
} from "lucide-react";
import VoiceOrb from "../components/voice-orb";
import girlAgent from "../assets/ai-agent-girl-nobg.png";
import demoBrowser from "../assets/browser-demo.png";
import demoEmail from "../assets/email-demo.png";
import demoInterface from "../assets/demo-interface.png";
import voiceToAction from "../assets/voice-to-action.png";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = ["Features", "How it works", "Pricing"];

const COMMANDS = [
  "Research what's happening in Pakistan right now...",
  "Find me the latest iPhone review on YouTube...",
  "Write an email to my client about the project update...",
  "Search for top 5 AI tools of 2026...",
  "Create a Gmail account for my new business...",
  "Summarize this article and give me key points...",
];

const STATS = [
  { value: 10, suffix: "x", label: "Faster research" },
  { value: 96, suffix: "%", label: "Task success rate" },
  { value: 2, suffix: "M+", label: "Commands executed" },
  { value: 0, suffix: "", label: "Typing required" },
];

const HOW_STEPS = [
  {
    number: "01",
    icon: <Mic className="w-6 h-6" />,
    title: "You speak a command",
    desc: "Just say what you want in plain language — no special syntax, no typing. BrowseAI listens and understands your full intent.",
    color: "violet",
    image: voiceToAction,
    tag: "Voice Input",
    detail:
      "Works with any microphone. Understands natural speech, accents, and context.",
  },
  {
    number: "02",
    icon: <Brain className="w-6 h-6" />,
    title: "Agent takes over the browser",
    desc: "BrowseAI opens tabs, searches Google, reads articles, clicks buttons, fills forms — autonomously executing your intent.",
    color: "indigo",
    image: demoBrowser,
    tag: "Browser Control",
    detail:
      "Clicks, scrolls, navigates, and reads live web content in real time.",
  },
  {
    number: "03",
    icon: <Mail className="w-6 h-6" />,
    title: "Tasks completed & explained",
    desc: "Emails sent, accounts created, research summarized — then BrowseAI tells you exactly what it did using voice.",
    color: "fuchsia",
    image: demoEmail,
    tag: "Task Execution",
    detail: "Results narrated back to you. Ask follow-up questions hands-free.",
  },
];

const CANT_DO = [
  {
    icon: <MousePointer2 className="w-5 h-5" />,
    title: "Click anything on screen",
    desc: "Generic AI can only chat. BrowseAI actually clicks, scrolls, and navigates like a real human.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Browse live websites",
    desc: "ChatGPT's knowledge is frozen. BrowseAI visits real websites right now and reads live content.",
  },
  {
    icon: <Keyboard className="w-5 h-5" />,
    title: "Fill forms & create accounts",
    desc: "No AI chatbot can register you on websites. BrowseAI types, submits, and completes forms for you.",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Send real emails",
    desc: "Others draft text. BrowseAI opens Gmail, writes, and sends your email — while you do something else.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "See your screen in real time",
    desc: "Generic AI is blind to your browser. BrowseAI watches your screen and reacts to what it sees.",
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "Find YouTube clips",
    desc: "No chatbot can play a video. BrowseAI navigates to exact timestamps and summarizes what it watched.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    text: "I researched an entire market in 20 minutes. BrowseAI navigated, read, and summarized everything while I had my coffee.",
    stars: 5,
    avatar: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Developer",
    text: "I said 'write a follow-up email' and it opened Gmail and drafted the perfect reply. Done.",
    stars: 5,
    avatar: "MR",
  },
  {
    name: "Priya Nair",
    role: "Content Creator",
    text: "Finding clips used to take hours. Now I describe the moment and BrowseAI finds the exact YouTube timestamp.",
    stars: 5,
    avatar: "PN",
  },
];

export default function Home() {
  const { token, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [commandIdx, setCommandIdx] = useState(0);
  const heroRef = useRef(null);
  const headlineRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (token && !isLoading) setLocation("/dashboard");
  }, [token, isLoading, setLocation]);

  // Rotate commands
  useEffect(() => {
    const t = setInterval(
      () => setCommandIdx((i) => (i + 1) % COMMANDS.length),
      3200,
    );
    return () => clearInterval(t);
  }, []);

  // ── HERO GSAP ANIMATION (FIXED) ──────────────────────────────
  // Problem was: on navigate-back, GSAP re-ran but elements were already
  // visible from previous run. Fix: gsap.set() resets to hidden BEFORE
  // animating, and cleanup kills all tweens on unmount.
  useEffect(() => {
    if (!heroRef.current) return;

    // Kill any leftover tweens/triggers from a previous mount
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.killTweensOf(
      ".hero-word, .hero-badge, .hero-sub, .hero-cta, .hero-bar, .hero-trust",
    );

    // Force reset to hidden — this is the critical fix
    gsap.set(".hero-word", { opacity: 0, y: 60, skewY: 6 });
    gsap.set(".hero-badge", { opacity: 0, y: 25 });
    gsap.set(".hero-sub", { opacity: 0, y: 30 });
    gsap.set(".hero-cta", { opacity: 0, y: 25 });
    gsap.set(".hero-bar", { opacity: 0, y: 35, scale: 0.92 });
    gsap.set(".hero-trust", { opacity: 0, y: 20 });

    let ctx;

    const runAnimation = () => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.1 });

        tl.to(".hero-badge", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        })
          .to(
            ".hero-word",
            {
              opacity: 1,
              y: 0,
              skewY: 0,
              duration: 0.85,
              stagger: 0.09,
              ease: "power3.out",
            },
            "-=0.35",
          )
          .to(
            ".hero-sub",
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            "-=0.4",
          )
          .to(
            ".hero-cta",
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.4",
          )
          .to(
            ".hero-bar",
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.4)",
            },
            "-=0.3",
          )
          .to(".hero-trust", { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
      }, heroRef.current);
    };

    const timeoutId = setTimeout(runAnimation, 100);

    return () => {
      clearTimeout(timeoutId);
      if (ctx) ctx.revert();
      // Kill on unmount so next mount starts clean
      gsap.killTweensOf(
        ".hero-word, .hero-badge, .hero-sub, .hero-cta, .hero-bar, .hero-trust",
      );
    };
  }, []); // empty — runs once per mount, cleanup handles the rest

  // ── STAT COUNTERS ────────────────────────────────────────────
  // ── ADD THIS useEffect right after your existing hero useEffect ──
  // It forces ScrollTrigger to recalculate all positions after
  // navigation causes the page to re-mount at a stale scroll state

  useEffect(() => {
    // Small delay lets the DOM fully paint before ScrollTrigger measures
    const id = setTimeout(() => {
      ScrollTrigger.refresh(true); // true = force recalculate all triggers
    }, 200);

    return () => clearTimeout(id);
  }, []);

  // ── ALSO fix your stat counter useEffect — replace it with this ──
  useEffect(() => {
    const triggers = [];

    // Wait for ScrollTrigger.refresh() above to complete first
    const id = setTimeout(() => {
      const ctx = gsap.context(() => {
        document.querySelectorAll(".stat-number").forEach((el, i) => {
          const stat = STATS[i];
          const obj = { val: 0 };

          // Reset text to dash in case of stale value from prev mount
          el.textContent = "—";

          const trigger = ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(obj, {
                val: stat.value,
                duration: 2,
                delay: i * 0.15,
                ease: "power2.out",
                onUpdate: () => {
                  el.textContent =
                    (stat.value < 5
                      ? Math.floor(obj.val)
                      : Math.round(obj.val).toLocaleString()) + stat.suffix;
                },
                onComplete: () => {
                  el.textContent = stat.value + stat.suffix;
                },
              });
            },
          });
          triggers.push(trigger);
        });
      });

      return () => {
        triggers.forEach((t) => t.kill());
        ctx.revert();
      };
    }, 250); // slightly after the refresh() above

    return () => {
      clearTimeout(id);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  if (isLoading) return null;

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-4 border-b border-white/[0.06] backdrop-blur-2xl bg-background/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            BrowseAI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <button
              key={l}
              className="text-sm text-white/45 hover:text-white transition-colors font-medium"
            >
              {l}
            </button>
          ))}
        </div>
        <Button
          onClick={() => setLocation("/sign-in")}
          className="rounded-full bg-primary hover:bg-primary/90 text-white text-sm px-5 h-9 shadow-lg shadow-primary/25 font-semibold"
        >
          Get started free
        </Button>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      >
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/14 rounded-full blur-[280px] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[200px] -translate-x-1/4" />
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "65px 65px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-14 w-full grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 items-center py-16 lg:py-24">
          {/* ── Left: copy ── */}
          <div className="relative z-10 flex flex-col">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary mb-7">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="text-xs font-semibold tracking-widest uppercase">
                AI Agent Online — v2.0
              </span>
            </div>

            {/* Headline — hero-word spans are what GSAP animates */}
            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black tracking-tight leading-[1.03] mb-6"
            >
              {["Your browser,", "commanded", "by voice."].map((line, li) => (
                <div key={li} className="overflow-hidden">
                  <span
                    className={`hero-word block ${li === 1 ? "text-gradient" : "text-white"}`}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </h1>

            <p className="hero-sub text-base md:text-lg text-white/45 max-w-lg mb-6 leading-relaxed">
              BrowseAI is your AI co-pilot that watches your screen, navigates
              the web, writes emails, and executes real tasks — through your
              voice alone.
            </p>
            <p className="hero-sub text-sm md:text-base text-white/55 max-w-lg mb-10 leading-relaxed">
              Turn a single spoken instruction into a completed workflow:
              research fast, book meetings, fill forms, and summarize content
              without touching the keyboard.
            </p>

            {/* Feature pills */}
            <div className="grid gap-3 sm:grid-cols-3 mb-10">
              {[
                "Voice-first automation",
                "Live browser control",
                "Instant task results",
              ].map((t) => (
                <div
                  key={t}
                  className="hero-cta rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
                >
                  {t}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Button
                size="lg"
                onClick={() => setLocation("/sign-up")}
                className="hero-cta h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-base gap-2 shadow-2xl shadow-primary/30 group"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button className="hero-cta flex items-center gap-2.5 text-white/50 hover:text-white transition-colors font-medium text-sm group">
                <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center group-hover:border-primary/50 transition-all bg-white/[0.04] group-hover:bg-primary/10">
                  <Play className="w-3.5 h-3.5 ml-0.5 text-white" />
                </div>
                Watch 90s demo
              </button>
            </div>

            {/* Live command bar */}
            <div className="hero-bar glass-panel rounded-2xl px-4 py-3.5 flex items-center gap-4 max-w-xl">
              <VoiceOrb size="sm" state="listening" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5 font-semibold">
                  Listening
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={commandIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35 }}
                    className="text-white/70 text-sm font-mono truncate"
                  >
                    "{COMMANDS[commandIdx]}"
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex items-end gap-[2px] h-5 shrink-0">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.2, 1, 0.3, 0.8, 0.2] }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.12,
                      repeat: Infinity,
                    }}
                    className="w-[3px] bg-primary rounded-full"
                    style={{ height: "100%", transformOrigin: "bottom" }}
                  />
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="hero-trust flex items-center gap-6 mt-8 text-xs text-white/25">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Free forever plan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Setup in 60s
              </span>
            </div>
          </div>

          {/* ── Right: Girl agent ── */}
          <div className="relative flex items-center justify-center w-full mx-auto min-h-[420px]">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/25 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-[60px]" />

            {/* Floating cards */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-6 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0 glass-panel px-4 py-3 rounded-2xl z-20 border-white/10 shadow-xl"
            >
              <p className="text-xs text-white/40 mb-0.5">Task completed</p>
              <p className="text-sm font-bold text-white">
                Email sent to client
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">
                  Success
                </span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 right-1/2 translate-x-1/2 sm:right-4 sm:translate-x-0 glass-panel px-4 py-3 rounded-2xl z-20 border-white/10 shadow-xl"
            >
              <p className="text-xs text-white/40 mb-1">Now browsing</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-bold text-white">
                  youtube.com
                </span>
              </div>
              <p className="text-[10px] text-white/30 mt-1">
                Searching for clips…
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 glass-panel px-3.5 py-3 rounded-2xl z-20 border-white/10"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex items-end gap-0.5 h-5">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scaleY: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 0.9,
                        delay: i * 0.15,
                        repeat: Infinity,
                      }}
                      className="w-1 bg-primary/80 rounded-full h-full"
                      style={{ transformOrigin: "bottom" }}
                    />
                  ))}
                </div>
                <span className="text-xs text-white/55 font-medium">
                  Speaking results…
                </span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-6 right-1/2 translate-x-1/2 sm:right-2 sm:translate-x-0 glass-panel px-3 py-2 rounded-xl z-20 border-white/10"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-white/60">Searching web…</span>
              </div>
            </motion.div>

            {/* Girl image */}
            <div
              className="relative z-10 flex items-end justify-center w-full max-w-[320px] sm:max-w-[380px] md:max-w-[520px]"
              style={{ minHeight: 420 }}
            >
              <img
                src={girlAgent}
                alt="BrowseAI AI Agent"
                className="w-full h-auto object-contain object-bottom select-none"
                style={{
                  filter:
                    "drop-shadow(0 0 60px rgba(139,92,246,0.55)) drop-shadow(0 20px 80px rgba(99,60,180,0.35))",
                }}
                draggable={false}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-[10px] tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section className="border-y border-white/[0.06] bg-white/[0.015] py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <GsapFadeUp key={s.label} delay={i * 0.1} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-gradient mb-1">
                <span className="stat-number">—</span>
              </p>
              <p className="text-sm text-white/35 font-medium">{s.label}</p>
            </GsapFadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[250px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <GsapFadeUp className="text-center mb-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
              How it works
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              From voice command
              <br />
              <span className="text-gradient">to completed task</span>
            </h2>
            <p className="text-white/35 text-base max-w-2xl mx-auto mt-4">
              Watch BrowseAI handle complex multi-step tasks from a single
              spoken sentence.
            </p>
          </GsapFadeUp>

          <div className="flex flex-col gap-24">
            {HOW_STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
              >
                <GsapSlideIn
                  direction={i % 2 === 0 ? "left" : "right"}
                  className="[direction:ltr]"
                >
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10 pointer-events-none" />
                    <img
                      src={step.image}
                      alt={step.tag}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-5 left-5 z-20">
                      <div className="flex items-center gap-2 glass-panel px-3 py-2 rounded-xl border-white/10">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-semibold text-white">
                          {step.tag}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 z-20 text-[64px] font-black text-white/[0.07] leading-none select-none">
                      {step.number}
                    </div>
                  </div>
                </GsapSlideIn>

                <GsapSlideIn
                  direction={i % 2 === 0 ? "right" : "left"}
                  delay={0.1}
                  className="[direction:ltr] flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/40 text-base leading-relaxed mb-6">
                    {step.desc}
                  </p>
                  <div className="flex items-start gap-3 glass-panel rounded-2xl p-4 border-white/8 max-w-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-white/55 text-sm leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                  {i < HOW_STEPS.length - 1 && (
                    <div className="flex items-center gap-2 mt-8 text-white/20 text-xs">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <div
                            key={d}
                            className="w-1 h-1 rounded-full bg-white/20"
                            style={{ opacity: 1 - d * 0.25 }}
                          />
                        ))}
                      </div>
                      <span>then →</span>
                    </div>
                  )}
                </GsapSlideIn>
              </div>
            ))}
          </div>

          <GsapScale className="mt-24" delay={0.05}>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent z-10 pointer-events-none" />
              <img
                src={demoInterface}
                alt="BrowseAI full interface demo"
                className="w-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-end p-8 md:p-12">
                <div className="max-w-lg">
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                    Live dashboard
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-3">
                    Watch every action in real time
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">
                    See exactly what BrowseAI is doing — tabs opening, pages
                    loading, text being typed — all narrated in your ear.
                  </p>
                </div>
              </div>
            </div>
          </GsapScale>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHAT GENERIC AI CAN'T DO
      ══════════════════════════════════════ */}
      <section className="py-24 px-4 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[200px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <GsapFadeUp className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
              The real difference
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Impossible for generic AI.
              <br />
              <span className="text-gradient">Trivial for BrowseAI.</span>
            </h2>
            <p className="text-white/35 max-w-xl mx-auto text-base">
              ChatGPT, Claude, Gemini — they're all just text boxes. BrowseAI
              has hands.
            </p>
          </GsapFadeUp>

          <GsapStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CANT_DO.map((item) => (
              <div
                key={item.title}
                className="glass-panel rounded-2xl p-6 group hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                    <X className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400 font-semibold">
                      Generic AI: Cannot
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-semibold">
                      BrowseAI: Yes
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </GsapStagger>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-24 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <GsapFadeUp className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">
              Social proof
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              People who speak,{" "}
              <span className="text-gradient">don't go back</span>
            </h2>
          </GsapFadeUp>

          <GsapStagger className="grid md:grid-cols-3 gap-6" stagger={0.13}>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="glass-panel rounded-2xl p-7 flex flex-col gap-5 hover:border-white/15 transition-colors"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-white/65 text-sm leading-relaxed flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center text-white text-xs font-bold border border-white/10">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </GsapStagger>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section className="py-28 px-4 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/8 rounded-full blur-[250px]" />
        </div>
        <GsapScale className="max-w-4xl mx-auto relative z-10">
          <div className="glass-panel rounded-3xl p-12 md:p-16 relative overflow-hidden border border-white/8 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <VoiceOrb size="md" state="idle" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Ready to stop typing?
              </h2>
              <p className="text-white/35 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of professionals who browse, research, and work
                10x faster — with nothing but their voice.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setLocation("/sign-up")}
                  className="h-13 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-base gap-2 shadow-2xl shadow-primary/30 group"
                >
                  Activate your co-pilot
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button
                  onClick={() => setLocation("/sign-in")}
                  className="text-sm text-white/35 hover:text-white transition-colors font-medium"
                >
                  Already have an account? Log in
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-white/20">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Free forever plan
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Setup in 60 seconds
                </span>
              </div>
            </div>
          </div>
        </GsapScale>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-16">
          <GsapFadeUp>
            <div className="grid md:grid-cols-4 gap-10 mb-14">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg text-white">BrowseAI</span>
                </div>
                <p className="text-white/35 text-sm leading-relaxed max-w-xs">
                  The AI co-pilot that navigates the web, executes tasks, and
                  explains results — all through your voice alone.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  {[MessageSquare, Globe].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 cursor-pointer transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
                  Product
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "Features",
                    "How it works",
                    "Pricing",
                    "Changelog",
                    "Roadmap",
                  ].map((l) => (
                    <button
                      key={l}
                      className="text-sm text-white/40 hover:text-white transition-colors text-left"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
                  Company
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "About",
                    "Blog",
                    "Privacy Policy",
                    "Terms of Service",
                    "Contact",
                  ].map((l) => (
                    <button
                      key={l}
                      className="text-sm text-white/40 hover:text-white transition-colors text-left"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GsapFadeUp>
          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs">
              © 2026 BrowseAI Technologies, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
