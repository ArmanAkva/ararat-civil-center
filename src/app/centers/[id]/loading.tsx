import { Skeleton } from "@/components/ui/Skeleton";

export default function CenterLoading() {
  return (
    <main className="container" style={{ paddingBottom: "5rem", maxWidth: "1100px" }}>
      {/* Back link */}
      <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <Skeleton width="220px" height="2rem" borderRadius="0.4rem" />
      </div>

      {/* Hero card */}
      <div className="skeleton-card" style={{ padding: "3rem 2.5rem", marginBottom: "3rem" }}>
        <Skeleton width="140px" height="1.2rem" borderRadius="999px" style={{ marginBottom: "1rem" }} />
        <Skeleton width="70%" height="2.8rem" borderRadius="0.5rem" style={{ marginBottom: "1rem" }} />
        <Skeleton width="100%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.5rem" }} />
        <Skeleton width="90%" height="1rem" borderRadius="0.3rem" />
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        <div className="skeleton-card" style={{ padding: "1.75rem", minHeight: "180px" }}>
          <Skeleton width="60%" height="1.4rem" borderRadius="0.3rem" style={{ marginBottom: "0.75rem" }} />
          <Skeleton width="100%" height="0.9rem" borderRadius="0.25rem" style={{ marginBottom: "0.4rem" }} />
          <Skeleton width="80%" height="0.9rem" borderRadius="0.25rem" />
        </div>
        <div className="skeleton-card" style={{ padding: "1.75rem", minHeight: "180px" }}>
          <Skeleton width="60%" height="1.4rem" borderRadius="0.3rem" style={{ marginBottom: "0.75rem" }} />
          <Skeleton width="100%" height="0.9rem" borderRadius="0.25rem" style={{ marginBottom: "0.4rem" }} />
          <Skeleton width="80%" height="0.9rem" borderRadius="0.25rem" />
        </div>
      </div>
    </main>
  );
}
