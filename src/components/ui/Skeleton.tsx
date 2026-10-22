"use client";

import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "0.4rem",
  style = {},
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        display: "block",
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Standard Page Header Skeleton (Eyebrow Badge, Main Title, Subtitle paragraph)
 */
export function PageHeaderSkeleton({
  hasBadge = true,
  maxWidth = "760px",
}: {
  hasBadge?: boolean;
  maxWidth?: string;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3.5rem 1rem 2rem 1rem",
        maxWidth,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {hasBadge && (
        <Skeleton
          width="220px"
          height="1.25rem"
          borderRadius="999px"
          style={{ marginBottom: "1rem" }}
        />
      )}
      <Skeleton
        width="min(90%, 540px)"
        height="2.75rem"
        borderRadius="0.6rem"
        style={{ marginBottom: "1rem" }}
      />
      <Skeleton
        width="min(95%, 680px)"
        height="1.15rem"
        borderRadius="0.4rem"
        style={{ marginBottom: "0.5rem" }}
      />
      <Skeleton
        width="min(80%, 460px)"
        height="1.15rem"
        borderRadius="0.4rem"
        style={{ marginBottom: "1.5rem" }}
      />
    </div>
  );
}

/**
 * KPI / Stats Bar Skeleton (4 Cards in a row)
 */
export function StatsBarSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        gap: "1rem",
        marginBottom: "2.5rem",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-card"
          style={{
            padding: "1.25rem 1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Skeleton width="48px" height="2rem" borderRadius="0.4rem" />
          <Skeleton width="120px" height="0.85rem" borderRadius="0.3rem" />
        </div>
      ))}
    </div>
  );
}

/**
 * Filter Bar Skeleton
 */
export function FilterBarSkeleton() {
  return (
    <div
      className="skeleton-card"
      style={{
        padding: "1.5rem 1.75rem",
        marginBottom: "2.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <Skeleton width="100%" height="2.8rem" borderRadius="0.6rem" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Skeleton width="80px" height="2rem" borderRadius="999px" />
          <Skeleton width="90px" height="2rem" borderRadius="999px" />
          <Skeleton width="85px" height="2rem" borderRadius="999px" />
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Skeleton width="140px" height="2rem" borderRadius="0.5rem" />
          <Skeleton width="110px" height="2rem" borderRadius="0.5rem" />
        </div>
      </div>
    </div>
  );
}

/**
 * Topic Card Skeleton
 */
export function TopicCardSkeleton() {
  return (
    <div
      className="skeleton-card"
      style={{
        padding: "1.75rem",
        minHeight: "310px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Top Badges & Status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Skeleton width="95px" height="1.4rem" borderRadius="0.3rem" />
            <Skeleton width="110px" height="1.4rem" borderRadius="0.3rem" />
          </div>
          <Skeleton width="28px" height="28px" borderRadius="50%" />
        </div>

        {/* Title Lines */}
        <Skeleton
          width="92%"
          height="1.4rem"
          borderRadius="0.4rem"
          style={{ marginBottom: "0.5rem" }}
        />
        <Skeleton
          width="65%"
          height="1.4rem"
          borderRadius="0.4rem"
          style={{ marginBottom: "1rem" }}
        />

        {/* Description Lines */}
        <Skeleton
          width="100%"
          height="0.9rem"
          borderRadius="0.3rem"
          style={{ marginBottom: "0.4rem" }}
        />
        <Skeleton
          width="96%"
          height="0.9rem"
          borderRadius="0.3rem"
          style={{ marginBottom: "0.4rem" }}
        />
        <Skeleton width="75%" height="0.9rem" borderRadius="0.3rem" />
      </div>

      {/* Footer Meta Row */}
      <div
        style={{
          borderTop: "1px solid var(--card-border)",
          paddingTop: "1rem",
          marginTop: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <Skeleton width="75px" height="1.5rem" borderRadius="999px" />
          <Skeleton width="90px" height="1.5rem" borderRadius="999px" />
        </div>
        <Skeleton width="85px" height="1rem" borderRadius="0.3rem" />
      </div>
    </div>
  );
}

/**
 * Topic Grid Skeleton
 */
export function TopicGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "1.75rem",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <TopicCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Civilization Card Skeleton
 */
export function CivilizationCardSkeleton() {
  return (
    <div
      className="skeleton-card"
      style={{
        padding: "2rem 1.75rem",
        minHeight: "360px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {/* Symbol & Badge Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <Skeleton width="54px" height="54px" borderRadius="0.75rem" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <Skeleton width="90px" height="0.8rem" borderRadius="0.25rem" />
            <Skeleton width="140px" height="1.3rem" borderRadius="0.35rem" />
          </div>
        </div>

        {/* Tagline */}
        <Skeleton
          width="85%"
          height="1rem"
          borderRadius="0.3rem"
          style={{ marginBottom: "0.9rem" }}
        />

        {/* Overview lines */}
        <Skeleton
          width="100%"
          height="0.85rem"
          borderRadius="0.25rem"
          style={{ marginBottom: "0.4rem" }}
        />
        <Skeleton
          width="95%"
          height="0.85rem"
          borderRadius="0.25rem"
          style={{ marginBottom: "0.4rem" }}
        />
        <Skeleton width="70%" height="0.85rem" borderRadius="0.25rem" />
      </div>

      {/* Centers & Authors counter pill row */}
      <div
        style={{
          borderTop: "1px solid var(--card-border)",
          paddingTop: "1rem",
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Skeleton width="100px" height="1.6rem" borderRadius="999px" />
        <Skeleton width="100px" height="1.6rem" borderRadius="999px" />
      </div>
    </div>
  );
}

/**
 * Civilizations Grid Skeleton (8 Cards)
 */
export function CivilizationsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
        gap: "2rem",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CivilizationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Full Page Topic Detail View Skeleton
 */
export function TopicDetailSkeleton() {
  return (
    <main className="container" style={{ paddingBottom: "6rem", maxWidth: "980px" }}>
      {/* Back link */}
      <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <Skeleton width="220px" height="2rem" borderRadius="0.4rem" />
      </div>

      {/* Hero Banner Skeleton */}
      <div
        className="skeleton-card"
        style={{
          padding: "3.5rem 2.5rem",
          marginBottom: "3.5rem",
          border: "1px solid var(--gold-accent)",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <Skeleton width="110px" height="1.2rem" borderRadius="999px" />
          <Skeleton width="130px" height="1.2rem" borderRadius="999px" />
        </div>
        <Skeleton
          width="90%"
          height="2.5rem"
          borderRadius="0.5rem"
          style={{ marginBottom: "0.75rem" }}
        />
        <Skeleton
          width="60%"
          height="2.5rem"
          borderRadius="0.5rem"
          style={{ marginBottom: "1.5rem" }}
        />
        <Skeleton
          width="100%"
          height="1.1rem"
          borderRadius="0.3rem"
          style={{ marginBottom: "0.5rem" }}
        />
        <Skeleton
          width="95%"
          height="1.1rem"
          borderRadius="0.3rem"
          style={{ marginBottom: "0.5rem" }}
        />
        <Skeleton width="80%" height="1.1rem" borderRadius="0.3rem" />
      </div>

      {/* Expert Opinions Section */}
      <div style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <Skeleton width="340px" height="2rem" borderRadius="0.4rem" />
          <Skeleton width="180px" height="2.2rem" borderRadius="0.5rem" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="skeleton-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <Skeleton width="48px" height="48px" borderRadius="50%" />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <Skeleton width="160px" height="1.1rem" borderRadius="0.3rem" />
                <Skeleton width="120px" height="0.8rem" borderRadius="0.25rem" />
              </div>
            </div>
            <Skeleton width="95%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.4rem" }} />
            <Skeleton width="80%" height="1rem" borderRadius="0.3rem" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Skeleton;
