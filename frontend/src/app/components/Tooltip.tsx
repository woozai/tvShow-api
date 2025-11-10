import {  useEffect, useRef, useState, type ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldShow, setShouldShow] = useState(false);

  // ✅ Detect if text is truncated
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setShouldShow(el.scrollWidth > el.clientWidth);
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="relative group inline-block w-full"
      title={shouldShow ? undefined : text}
      // if no tooltip, fallback to native title
    >
      {children}

      {/* ✅ Modern tooltip – only show when truncated */}
      {shouldShow && (
        <div
          className="
            absolute left-0 mt-1 hidden group-hover:flex
            bg-black/70 backdrop-blur-md text-white 
            text-xs px-3 py-1.5 rounded-md shadow-xl 
            whitespace-nowrap z-20
            opacity-0 group-hover:opacity-100 
            scale-95 group-hover:scale-100
            transition-all duration-200
          "
        >
          {text}
        </div>
      )}
    </div>
  );
}
