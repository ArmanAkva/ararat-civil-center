import { Skeleton } from "@/components/ui/Skeleton";

export default function ForumLoading() {
  return (
    <main className="container" style={{ paddingBottom: "6rem", maxWidth: "1200px" }}>
      {/* Hero Header Skeleton */}
      <div
        style={{
          textAlign: "center",
          padding: "3.5rem 1rem 2rem 1rem",
          maxWidth: "880px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Skeleton width="280px" height="1.25rem" borderRadius="999px" style={{ marginBottom: "1rem" }} />
        <Skeleton width="min(90%, 520px)" height="3.2rem" borderRadius="0.6rem" style={{ marginBottom: "1rem" }} />
        <Skeleton width="min(85%, 440px)" height="1.45rem" borderRadius="0.4rem" style={{ marginBottom: "2rem" }} />

        {/* Countdown Timer Skeleton */}
        <div
          className="skeleton-card"
          style={{
            padding: "1.25rem 2.5rem",
            display: "inline-flex",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <Skeleton width="60px" height="2.5rem" borderRadius="0.4rem" />
          <Skeleton width="60px" height="2.5rem" borderRadius="0.4rem" />
          <Skeleton width="60px" height="2.5rem" borderRadius="0.4rem" />
          <Skeleton width="60px" height="2.5rem" borderRadius="0.4rem" />
        </div>
      </div>

      {/* Manifesto / Message Section Skeleton */}
      <div className="skeleton-card" style={{ padding: "2.5rem", marginBottom: "3rem" }}>
        <Skeleton width="240px" height="1.8rem" borderRadius="0.4rem" style={{ marginBottom: "1rem" }} />
        <Skeleton width="100%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.5rem" }} />
        <Skeleton width="94%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.5rem" }} />
        <Skeleton width="70%" height="1rem" borderRadius="0.3rem" />
      </div>
    </main>
  );
}
