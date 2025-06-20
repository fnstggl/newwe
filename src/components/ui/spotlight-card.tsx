
import React, { useRef, useCallback, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "#0ea5e9",
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const style = target.style as CSSProperties & {
      '--mouse-x': string;
      '--mouse-y': string;
    };

    style.setProperty('--mouse-x', `${x}px`);
    style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const cardStyle: CSSProperties & {
    '--base': number;
    '--spread': number;
    '--radius': string;
    '--border': string;
    '--backdrop': string;
    '--backup-border': string;
    '--size': string;
    '--outer': string;
    '--border-size': string;
    '--spotlight-size': string;
    '--spotlight-color': string;
    '--backdrop-filter': string;
    touchAction: "none";
    width?: string;
    height?: string;
  } = {
    '--base': 80,
    '--spread': 125,
    '--radius': '12px',
    '--border': '1px',
    '--backdrop': 'hsl(var(--card))',
    '--backup-border': 'hsl(var(--border))',
    '--size': '200px',
    '--outer': '1px',
    '--border-size': '1px',
    '--spotlight-size': '200px',
    '--spotlight-color': spotlightColor,
    '--backdrop-filter': 'blur(4px)',
    touchAction: "none",
    width: '100%',
    height: '100%',
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative h-full w-full rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl",
        className
      )}
      style={cardStyle}
    >
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background: `radial-gradient(var(--spotlight-size) circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}15, transparent 50%)`,
        }}
      />
    </div>
  );
}
