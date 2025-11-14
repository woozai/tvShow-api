import { useEffect, useRef, useState, type CSSProperties } from "react";

interface ExpandableTextProps {
  text: string;
  maxLines: number;
  className?: string;
  buttonClassName?: string;
  moreLabel?: string;
  lessLabel?: string;
}

export function ExpandableText({
  text,
  maxLines,
  className = "",
  buttonClassName = "",
  moreLabel = "Show more",
  lessLabel = "Show less",
}: ExpandableTextProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  // If text needs expansion
  const [canExpand, setCanExpand] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Reset expansion for a clean measurement
    setExpanded(false);

    // Wait one frame so browser can lay out natural height
    requestAnimationFrame(() => {
      const elem = contentRef.current;
      if (!elem) return;

      // How tall the text is normally?
      const fullHeight = elem.scrollHeight;

      // Apply clamp to measure collapsed height. How tall it is when limited to X lines?
      elem.style.display = "-webkit-box";
      elem.style.webkitLineClamp = String(maxLines);
      elem.style.webkitBoxOrient = "vertical";
      elem.style.overflow = "hidden";

      requestAnimationFrame(() => {
        const collapsedHeight = elem.clientHeight;

        // If full height > collapsed height → overflow exists
        const textContent = elem.textContent?.trim() || "";

        // Check if we see ellipsis in collapsed mode (visual truncation)
        const visuallyTruncated = textContent.endsWith("…");

        const hasOverflow =
          fullHeight > collapsedHeight + 1 || visuallyTruncated;

        setCanExpand(hasOverflow);
      });
    });
  }, [text, maxLines]);

  const collapsedStyle: CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: maxLines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };

  const fullStyle: CSSProperties = {
    overflow: "visible",
  };

  return (
    <div>
      <div
        ref={contentRef}
        className={className}
        style={expanded ? fullStyle : collapsedStyle}
      >
        {text}
      </div>

      {canExpand && (
        <button
          type="button"
          className={
            buttonClassName ||
            "text-xs sm:text-sm text-blue-400 hover:underline mt-1"
          }
          onClick={(e) => {
            e.stopPropagation(); //prevent click on parent
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
