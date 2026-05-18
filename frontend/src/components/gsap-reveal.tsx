import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── fade-up on scroll ─── */
interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
  selector?: string;
}

export function GsapFadeUp({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  y = 50,
  stagger = 0,
  selector,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const target = selector ? ref.current.querySelectorAll(selector) : ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger || undefined,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, duration, y, stagger, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ─── slide in from side ─── */
interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  delay?: number;
  duration?: number;
}

export function GsapSlideIn({
  children,
  className = "",
  direction = "left",
  delay = 0,
  duration = 0.8,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const x = direction === "left" ? -70 : 70;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, x },
        {
          opacity: 1,
          x: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [direction, delay, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ─── scale pop ─── */
export function GsapScale({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.88, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ─── staggered children ─── */
export function GsapStagger({
  children,
  className = "",
  childSelector = ":scope > *",
  stagger = 0.1,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  childSelector?: string;
  stagger?: number;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll(childSelector);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [childSelector, stagger, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ─── counter number animation ─── */
export function GsapCounter({
  to,
  suffix = "",
  className = "",
  duration = 2,
}: {
  to: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obj = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;
        gsap.to(obj, {
          val: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              (to < 10
                ? obj.val.toFixed(1)
                : Math.round(obj.val).toLocaleString()) + suffix;
          },
        });
      },
    });

    return () => trigger.kill();
  }, [to, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
