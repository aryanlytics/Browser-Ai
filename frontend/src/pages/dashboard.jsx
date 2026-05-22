import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  LogOut,
  Clock,
  Globe,
  Search,
  Mail,
  User,
  Settings,
  ChevronRight,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import VoiceOrb from "@/components/voice-orb";

const MOCK_TASKS = [
  {
    id: "1",
    type: "research",
    label: "Researched history of quantum computing",
    time: "2 min ago",
    status: "done",
  },
  {
    id: "2",
    type: "search",
    label: "Searched YouTube for React tutorials",
    time: "8 min ago",
    status: "done",
  },
  {
    id: "3",
    type: "email",
    label: "Drafted reply to client proposal",
    time: "24 min ago",
    status: "done",
  },
  {
    id: "4",
    type: "browse",
    label: "Opened GitHub repository for Next.js",
    time: "1 hr ago",
    status: "done",
  },
];

const taskIcons = {
  search: Search,
  email: Mail,
  browse: Globe,
  research: Zap,
};

export default function Dashboard() {
  const { token, user, logout, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [agentState, setAgentState] = useState("idle");
  const [isListening, setIsListening] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");

  useEffect(() => {
    if (!isLoading && !token) {
      setLocation("/sign-in");
    }
  }, [token, isLoading, setLocation]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setAgentState("thinking");
      setTranscript("What's currently happening in Pakistan?");
      setTimeout(() => {
        setAgentState("speaking");
        setAgentResponse("Searching the web for latest news about Pakistan...");
        setTimeout(() => {
          setAgentState("idle");
          setTranscript("");
          setAgentResponse("");
        }, 4000);
      }, 2000);
    } else {
      setIsListening(true);
      setAgentState("listening");
      setTranscript("");
      setAgentResponse("");
    }
  };

  const toggleScreenShare = async () => {
    if (screenSharing) {
      setScreenSharing(false);
    } else {
      try {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenSharing(true);
      } catch {
        setScreenSharing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/6 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 backdrop-blur-md bg-background/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            BrowseAI
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            data-testid="button-settings"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/80 hidden sm:block">
              {user?.name || "User"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            data-testid="button-logout"
            className="text-white/50 hover:text-white hover:bg-white/5 gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Logout</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col p-4 gap-4 bg-background/30 backdrop-blur-sm">
          {/* Screen share control */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Browser Access
              </span>
            </div>
            <button
              onClick={toggleScreenShare}
              data-testid="button-screen-share"
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                screenSharing
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              {screenSharing ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <MonitorOff className="w-4 h-4" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium leading-none mb-0.5">
                  {screenSharing ? "Screen shared" : "Share screen"}
                </p>
                <p className="text-xs opacity-60">
                  {screenSharing
                    ? "Agent can see your browser"
                    : "Let the agent navigate for you"}
                </p>
              </div>
            </button>
          </div>

          {/* Recent tasks */}
          <div className="glass-panel rounded-xl p-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Recent Tasks
              </span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto flex-1">
              {MOCK_TASKS.map((task, i) => {
                const Icon = taskIcons[task.type];
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    data-testid={`task-entry-${task.id}`}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/80 leading-snug truncate group-hover:text-white transition-colors">
                        {task.label}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">
                        {task.time}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 shrink-0 mt-0.5 transition-colors" />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="glass-panel rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
              Quick commands
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                "Search YouTube for...",
                "Write an email to...",
                "Research topic...",
              ].map((cmd, i) => (
                <button
                  key={i}
                  data-testid={`quick-command-${i}`}
                  className="text-left text-xs text-white/50 hover:text-white/80 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <span className="text-primary/60">›</span>
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Agent workspace */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
          {/* Agent orb + state label */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={
                agentState === "listening" ? { scale: [1, 1.05, 1] } : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              <VoiceOrb size="lg" state={agentState} />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={agentState}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center"
              >
                <p className="text-sm font-medium text-white/60">
                  {agentState === "idle" && "Tap the mic to wake the agent"}
                  {agentState === "listening" && (
                    <span className="text-primary">Listening...</span>
                  )}
                  {agentState === "thinking" && (
                    <span className="text-accent">
                      Processing your request...
                    </span>
                  )}
                  {agentState === "speaking" && (
                    <span className="text-emerald-400">Speaking...</span>
                  )}
                </p>
                {transcript && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-base text-white mt-2 max-w-md italic"
                  >
                    "{transcript}"
                  </motion.p>
                )}
                {agentResponse && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-white/70 mt-2 max-w-md"
                  >
                    {agentResponse}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleListening}
              data-testid="button-mic-toggle"
              className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all shadow-lg ${
                isListening
                  ? "bg-primary border-primary/50 text-white shadow-primary/30"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isListening ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </motion.button>

            <button
              onClick={toggleScreenShare}
              data-testid="button-screen-share-mobile"
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                screenSharing
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              {screenSharing ? (
                <Monitor className="w-4 h-4" />
              ) : (
                <MonitorOff className="w-4 h-4" />
              )}
              {screenSharing ? "Sharing" : "Share screen"}
            </button>
          </div>

          {/* Input bar */}
          <div className="w-full max-w-2xl">
            <div className="glass-panel rounded-2xl p-2 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4 text-primary" />
              </div>
              <input
                type="text"
                placeholder="Or type a command: 'Find the latest news about AI...'"
                data-testid="input-command"
                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/25 font-mono py-2 px-2"
              />
              <Button
                size="sm"
                data-testid="button-send-command"
                className="rounded-xl bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 gap-1.5 shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                Ask agent
              </Button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Agent online
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Web access enabled
            </span>
            {screenSharing && (
              <span className="flex items-center gap-1.5 text-emerald-400/60">
                <Monitor className="w-3 h-3" />
                Screen shared
              </span>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
