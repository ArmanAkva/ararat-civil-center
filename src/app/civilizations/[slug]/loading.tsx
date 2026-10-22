import { Skeleton } from "@/components/ui/Skeleton";

export default function SingleCivilizationLoading() {
  return (
    <main className="container" style={{ paddingBottom: "5rem", maxWidth: "1100px" }}>
      {/* Back button */}
      <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <Skeleton width="220px" height="2rem" borderRadius="0.4rem" />
      </div>

      {/* Hero Banner */}
      <div className="skeleton-card" style={{ padding: "3.5rem 2.5rem", marginBottom: "3rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.5rem" }}>
          <Skeleton width="72px" height="72px" borderRadius="1rem" />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Skeleton width="120px" height="1.1rem" borderRadius="999px" />
            <Skeleton width="260px" height="2.4rem" borderRadius="0.5rem" />
          </div>
        </div>
        <Skeleton width="85%" height="1.2rem" borderRadius="0.3rem" style={{ marginBottom: "1rem" }} />
        <Skeleton width="100%" height="0.95rem" borderRadius="0.3rem" style={{ marginBottom: "0.5rem" }} />
        <Skeleton width="92%" height="0.95rem" borderRadius="0.3rem" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Skeleton width="140px" height="2.5rem" borderRadius="0.5rem" />
        <Skeleton width="140px" height="2.5rem" borderRadius="0.5rem" />
        <Skeleton width="140px" height="2.5rem" borderRadius="0.5rem" />
      </div>

      {/* Grid of Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-card" style={{ padding: "1.75rem", minHeight: "180px" }}>
            <Skeleton width="60%" height="1.4rem" borderRadius="0.3rem" style={{ marginBottom: "0.75rem" }} />
            <Skeleton width="100%" height="0.9rem" borderRadius="0.25rem" style={{ marginBottom: "0.4rem" }} />
            <Skeleton width="80%" height="0.9rem" borderRadius="0.25rem" />
          </div>
        ))}
      </div>
    </main>
  );
}
