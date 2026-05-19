import { useRef, useEffect, ReactNode } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

// ── Switched from GSAP ScrollTrigger to Framer Motion useInView ──
// Reason: GSAP ScrollTrigger has stale position bugs on SPA navigation.
// Framer Motion useInView recalculates correctly every mount.

interface BaseProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// ── GsapFadeUp ──────────────────────────────────────────────
export function GsapFadeUp({
  children,
  className = "",
  delay = 0,
  y = 50,
}: BaseProps & { y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ── GsapSlideIn ─────────────────────────────────────────────
export function GsapSlideIn({
  children,
  className = "",
  direction = "left",
  delay = 0,
}: BaseProps & { direction?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const x = direction === "left" ? -70 : 70;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.75, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ── GsapScale ───────────────────────────────────────────────
export function GsapScale({ children, className = "", delay = 0 }: BaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={
        inView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.88, y: 20 }
      }
      transition={{ duration: 0.65, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── GsapStagger ─────────────────────────────────────────────
export function GsapStagger({
  children,
  className = "",
  stagger = 0.1,
  delay = 0,
}: BaseProps & { stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.96 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
