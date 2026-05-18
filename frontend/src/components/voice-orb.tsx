import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

interface VoiceOrbProps {
  size?: "sm" | "md" | "lg";
  state?: "idle" | "listening" | "speaking" | "thinking";
  className?: string;
}

const IDLE: { animate: object; transition: Transition } = {
  animate: { scale: [1, 1.02, 1], opacity: [0.6, 0.8, 0.6] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
};

const LISTENING: { animate: object; transition: Transition } = {
  animate: { scale: [1, 1.1, 0.95, 1.05, 1], opacity: [0.8, 1, 0.8, 1, 0.8] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
};

const SPEAKING: { animate: object; transition: Transition } = {
  animate: { scale: [1, 1.2, 1, 1.3, 1.1, 1] },
  transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
};

const THINKING: { animate: object; transition: Transition } = {
  animate: { rotate: [0, 360], scale: [1, 0.9, 1] },
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "linear",
  },
};

export default function VoiceOrb({ size = "md", state = "idle", className = "" }: VoiceOrbProps) {
  const dimensions = { sm: "w-10 h-10", md: "w-32 h-32", lg: "w-48 h-48" };

  const preset =
    state === "listening" ? LISTENING
    : state === "speaking" ? SPEAKING
    : state === "thinking" ? THINKING
    : IDLE;

  return (
    <div className={`relative flex items-center justify-center ${dimensions[size]} ${className}`}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
        animate={preset.animate}
        transition={preset.transition}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full bg-accent/40 blur-md"
        animate={state !== "idle" ? preset.animate : { opacity: 0.4 }}
        transition={preset.transition}
      />
      {/* Core */}
      <motion.div
        className="relative z-10 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-primary to-accent shadow-[0_0_20px_rgba(139,92,246,0.8)]"
        animate={preset.animate}
        transition={preset.transition}
      />
    </div>
  );
}
