import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Mic } from "lucide-react";

interface PageLoaderProps {
  onComplete?: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const topSliceRef = useRef<HTMLDivElement>(null);
  const bottomSliceRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        },
      });

      // Logo entrance
      tl.fromTo(
        logoRef.current,
        { scale: 0, opacity: 0, rotate: -20 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.4, ease: "back.out(1.7)" }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: "power2.inOut" },
          "-=0.15"
        )
        .fromTo(
          dotsRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
          "-=0.3"
        )
        // Hold briefly
        .to({}, { duration: 0.15 })
        // Split exit — top goes up, bottom goes down
        .to(
          topSliceRef.current,
          { yPercent: -100, duration: 0.5, ease: "power3.inOut" },
          "exit"
        )
        .to(
          bottomSliceRef.current,
          { yPercent: 100, duration: 0.5, ease: "power3.inOut" },
          "exit"
        );
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[200] pointer-events-none">
      {/* Top slice */}
      <div
        ref={topSliceRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#06030f] flex items-end justify-center pb-2"
      >
        <div className="flex flex-col items-center gap-4 pb-4">
          <div className="flex items-center gap-3">
            <div
              ref={logoRef}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/40"
            >
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span ref={textRef} className="text-3xl font-black text-white tracking-tight">
              BrowseAI
            </span>
          </div>

          {/* Progress line */}
          <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={lineRef}
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full origin-left"
            />
          </div>

          {/* Animated dots */}
          <div ref={dotsRef} className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-primary/60 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom slice */}
      <div
        ref={bottomSliceRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#06030f]"
      />
    </div>
  );
}
