import { Activity, HeartPulse, Droplet, Plus, Pill, Stethoscope } from "lucide-react";

const floatIcons = [
  { Icon: HeartPulse, className: "left-[8%] top-[18%]", delay: "0s", size: "h-8 w-8", mobile: true },
  { Icon: Droplet, className: "left-[85%] top-[22%]", delay: "1.5s", size: "h-6 w-6", mobile: true },
  { Icon: Plus, className: "left-[15%] top-[70%]", delay: "0.8s", size: "h-7 w-7", mobile: false },
  { Icon: Pill, className: "left-[78%] top-[68%]", delay: "2.2s", size: "h-6 w-6", mobile: false },
  { Icon: Activity, className: "left-[45%] top-[12%]", delay: "1.1s", size: "h-7 w-7", mobile: false },
  { Icon: Stethoscope, className: "left-[92%] top-[50%]", delay: "0.4s", size: "h-6 w-6", mobile: false },
];

/**
 * Animated healthcare-themed background: drifting blobs, moving grid,
 * an ECG heartbeat line and gently floating medical icons.
 *
 * Performance: heavy effects (extra blobs, most floating icons, grid drift)
 * are hidden on small screens, and all motion is disabled for users with
 * `prefers-reduced-motion`, keeping mobile CPU/GPU usage low while preserving
 * the medical theme.
 */
export function MedicalBackground({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {/* Animated grid — static on mobile & reduced-motion, drifts on desktop */}
      <div className="absolute inset-0 bg-medical-grid opacity-50 motion-reduce:animate-none max-sm:animate-none" />

      {/* Drifting gradient blobs — one on mobile, three on desktop */}
      <div className="animate-blob motion-reduce:animate-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl sm:h-72 sm:w-72 sm:bg-primary/25" />
      <div className="animate-blob motion-reduce:animate-none absolute right-0 top-1/3 hidden h-80 w-80 rounded-full bg-secondary/25 blur-3xl sm:block" style={{ animationDelay: "3s" }} />
      <div className="animate-blob motion-reduce:animate-none absolute bottom-0 left-1/3 hidden h-64 w-64 rounded-full bg-primary/20 blur-3xl sm:block" style={{ animationDelay: "6s" }} />

      {/* ECG heartbeat line — desktop only (svg stroke animation is costly on mobile) */}
      <svg className="absolute inset-x-0 top-1/2 hidden h-24 w-full -translate-y-1/2 opacity-30 sm:block" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path
          className="animate-ecg motion-reduce:animate-none"
          d="M0 50 H200 l20 -30 l20 60 l20 -50 l15 20 H520 l20 -34 l22 68 l18 -34 H900 l20 -24 l18 48 l16 -24 H1200"
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* Pulse rings — desktop only */}
      <span className="absolute left-[20%] top-[40%] hidden h-10 w-10 rounded-full border border-primary/40 animate-pulse-ring motion-reduce:animate-none sm:block" />
      <span className="absolute left-[70%] top-[30%] hidden h-8 w-8 rounded-full border border-secondary/40 animate-pulse-ring motion-reduce:animate-none sm:block" style={{ animationDelay: "1.2s" }} />

      {/* Floating medical icons — two on mobile, all on desktop */}
      {floatIcons.map(({ Icon, className: pos, delay, size, mobile }, i) => (
        <span
          key={i}
          className={`animate-float motion-reduce:animate-none absolute text-primary/25 ${pos} ${mobile ? "" : "hidden sm:inline"}`}
          style={{ animationDelay: delay }}
        >
          <Icon className={size} />
        </span>
      ))}
    </div>
  );
}
