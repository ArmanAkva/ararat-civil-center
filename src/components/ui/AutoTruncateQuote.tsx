"use client";

import React, { useRef, useState, useEffect } from "react";

export interface AutoTruncateQuoteProps {
  quote: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  tag?: "div" | "p" | "blockquote";
  title?: string;
  minLines?: number;
  maxLines?: number;
  defaultLines?: number;
  lineHeightPx?: number;
}

/**
 * AutoTruncateQuote dynamically fills all available vertical height in a flex card
 * before truncating with an ellipsis (...), avoiding empty gaps in cards.
 */
export function AutoTruncateQuote({
  quote,
  className = "",
  containerStyle = {},
  textStyle = {},
  tag: Tag = "blockquote",
  title,
  minLines = 2,
  maxLines = 10,
  defaultLines = 4,
  lineHeightPx = 22,
}: AutoTruncateQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clampedLines, setClampedLines] = useState<number>(defaultLines);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const computed = window.getComputedStyle(container);
        const pt = parseFloat(computed.paddingTop) || 0;
        const pb = parseFloat(computed.paddingBottom) || 0;
        const lh = parseFloat(computed.lineHeight) || lineHeightPx;
        const available = container.clientHeight - pt - pb;

        if (available > 20 && lh > 0) {
          const fitting = Math.floor(available / lh);
          const chosen = Math.max(minLines, Math.min(maxLines, fitting));
          setClampedLines((prev) => (prev !== chosen ? chosen : prev));
        }
      });
    };

    measure();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        measure();
      });
      ro.observe(el);
    }

    window.addEventListener("resize", measure);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [minLines, maxLines, lineHeightPx]);

  if (!quote) return null;

  return (
    <div
      ref={containerRef}
      className={className}
      title={title || quote}
      style={{
        flex: "1 1 auto",
        minHeight: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        overflow: "hidden",
        ...containerStyle,
      }}
    >
      <Tag
        style={{
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: clampedLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-word",
          lineHeight: `${lineHeightPx}px`,
          ...textStyle,
        }}
      >
        {quote}
      </Tag>
    </div>
  );
}
