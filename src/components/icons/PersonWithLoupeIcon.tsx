import React from "react";

interface PersonWithLoupeIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Person with Loupe / Magnifying Glass Icon (Expert/Researcher)
 */
export default function PersonWithLoupeIcon({
  size = 16,
  color = "currentColor",
  className,
  style,
}: PersonWithLoupeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      {/* Person Head */}
      <circle cx="8" cy="5.5" r="3" />
      {/* Person Shoulders / Body */}
      <path d="M2.5 16a5.5 5.5 0 0 1 10.3-2.5" />
      {/* Loupe (Magnifying Glass) Lens */}
      <circle cx="14" cy="13" r="3" />
      {/* Loupe Handle */}
      <path d="m16.2 15.2 2.3 2.3" strokeWidth="2.2" />
    </svg>
  );
}
