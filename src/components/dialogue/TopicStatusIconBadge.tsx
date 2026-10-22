"use client";

import { useState } from "react";

export interface TopicStatusIconBadgeProps {
  status: "active" | "archived" | "closed" | "pending" | "rejected";
  size?: number;
}

export default function TopicStatusIconBadge({
  status,
  size = 28,
}: TopicStatusIconBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  let label = "Ակտիվ Քննարկում";
  let bg = "rgba(16, 185, 129, 0.12)";
  let border = "rgba(16, 185, 129, 0.35)";
  let color = "#10b981";
  let glow = "0 0 12px rgba(16, 185, 129, 0.35)";

  let icon = (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {/* Dialogue / Discussion bubble icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      {/* Live active beacon */}
      <span
        style={{
          position: "absolute",
          top: "-2px",
          right: "-2px",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#10b981",
          boxShadow: "0 0 6px #10b981",
        }}
      />
    </span>
  );

  if (status === "pending") {
    label = "Սպասում է Հաստատման";
    bg = "rgba(245, 158, 11, 0.15)";
    border = "rgba(245, 158, 11, 0.4)";
    color = "#d97706";
    glow = "0 0 12px rgba(245, 158, 11, 0.3)";
    icon = (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  } else if (status === "rejected") {
    label = "Մերժված";
    bg = "rgba(239, 68, 68, 0.12)";
    border = "rgba(239, 68, 68, 0.35)";
    color = "#ef4444";
    glow = "0 0 12px rgba(239, 68, 68, 0.25)";
    icon = (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  } else if (status === "archived" || status === "closed") {
    label = "Արխիվացված";
    bg = "rgba(148, 163, 184, 0.12)";
    border = "rgba(148, 163, 184, 0.28)";
    color = "#94a3b8";
    glow = "0 0 8px rgba(148, 163, 184, 0.2)";
    icon = (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    );
  }

  return (
    <div
      title={label}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        aria-label={label}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          border: `1px solid ${border}`,
          color,
          boxShadow: isHovered ? glow : "none",
          transform: isHovered ? "scale(1.12)" : "scale(1)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: "pointer",
        }}
      >
        {icon}
      </div>

      {/* Floating Tooltip on Hover with Full Light/Dark Mode Compatibility */}
      {isHovered && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            top: "50%",
            right: "calc(100% + 8px)",
            transform: "translateY(-50%)",
            background: "var(--bg-secondary)",
            border: `1px solid ${border}`,
            color: "var(--text-primary)",
            padding: "0.32rem 0.65rem",
            borderRadius: "0.45rem",
            fontSize: "0.75rem",
            fontWeight: "600",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.12)",
            pointerEvents: "none",
            zIndex: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "var(--text-primary)" }}>{label}</span>
        </div>
      )}
    </div>
  );
}
