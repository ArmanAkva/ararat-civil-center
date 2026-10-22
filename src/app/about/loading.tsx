import { Skeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <main className="container" style={{ paddingBottom: "5rem", maxWidth: "1000px" }}>
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "4rem", marginTop: "2rem" }}>
        <Skeleton
          width="min(90%, 420px)"
          height="2.75rem"
          borderRadius="0.6rem"
          style={{ margin: "0 auto 1rem auto" }}
        />
        <Skeleton
          width="min(95%, 600px)"
          height="1.2rem"
          borderRadius="0.4rem"
          style={{ margin: "0 auto" }}
        />
      </div>

      {/* Mission Glass Card Skeleton */}
      <div
        className="skeleton-card"
        style={{ padding: "2.5rem 2rem", marginBottom: "3rem" }}
      >
        <Skeleton width="280px" height="1.8rem" borderRadius="0.4rem" style={{ marginBottom: "1.5rem" }} />
        <Skeleton width="100%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.6rem" }} />
        <Skeleton width="98%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.6rem" }} />
        <Skeleton width="92%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "1.2rem" }} />
        <Skeleton width="96%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.6rem" }} />
        <Skeleton width="85%" height="1rem" borderRadius="0.3rem" />
      </div>

      {/* Tools Section Grid Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        <div className="skeleton-card" style={{ padding: "2rem" }}>
          <Skeleton width="60px" height="60px" borderRadius="50%" style={{ marginBottom: "1rem" }} />
          <Skeleton width="180px" height="1.4rem" borderRadius="0.3rem" style={{ marginBottom: "0.75rem" }} />
          <Skeleton width="100%" height="0.85rem" borderRadius="0.25rem" style={{ marginBottom: "0.4rem" }} />
          <Skeleton width="90%" height="0.85rem" borderRadius="0.25rem" />
        </div>
        <div className="skeleton-card" style={{ padding: "2rem" }}>
          <Skeleton width="60px" height="60px" borderRadius="50%" style={{ marginBottom: "1rem" }} />
          <Skeleton width="180px" height="1.4rem" borderRadius="0.3rem" style={{ marginBottom: "0.75rem" }} />
          <Skeleton width="100%" height="0.85rem" borderRadius="0.25rem" style={{ marginBottom: "0.4rem" }} />
          <Skeleton width="90%" height="0.85rem" borderRadius="0.25rem" />
        </div>
      </div>
    </main>
  );
}
