import { cn } from "@/lib/utils";

interface SvgProps {
  className?: string;
}

export function FloralCorner({ className }: SvgProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-40 w-40 text-gold/60", className)}
      viewBox="0 0 200 200"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 160c22-8 38-24 52-44 10-16 18-34 34-48 18-15 40-20 70-10" />
        <path d="M38 146c10-22 22-40 40-58 18-18 36-26 64-22" />
        <path d="M26 118c10 4 20 4 28-2 10-8 16-20 20-32" />
        <path d="M74 98c4 10 14 14 24 10 10-4 18-12 22-22" />
        <path d="M118 68c6 8 16 10 26 4 8-4 14-10 18-18" />
        <path d="M46 130c4 8 12 12 22 10" />
        <path d="M104 88c6 6 12 8 20 8" />
        <path d="M146 50c4 6 10 8 18 6" />
        <circle cx="38" cy="122" r="5" />
        <circle cx="82" cy="94" r="6" />
        <circle cx="126" cy="62" r="5" />
      </g>
    </svg>
  );
}

export function OrnamentalDivider({ className }: SvgProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-6 w-40 text-gold/70", className)}
      viewBox="0 0 320 40"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 20h80" />
        <path d="M230 20h80" />
        <path d="M120 20c10-10 30-10 40 0 10 10 30 10 40 0" />
        <path d="M160 12c8 0 14 6 14 14" />
        <path d="M160 28c8 0 14-6 14-14" />
        <circle cx="110" cy="20" r="4" />
        <circle cx="210" cy="20" r="4" />
      </g>
    </svg>
  );
}

export function WaveIllustration({ className }: SvgProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-16 w-full text-gold/50", className)}
      viewBox="0 0 320 80"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path d="M10 50c30-22 60-22 90 0s60 22 90 0 60-22 120 0" />
        <path d="M10 65c24-16 48-16 72 0s48 16 72 0 48-16 72 0 48 16 72 0" />
      </g>
    </svg>
  );
}
