import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthorLoading() {
  return (
    <main className="container" style={{ paddingBottom: "5rem", maxWidth: "1000px" }}>
      {/* Back link */}
      <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <Skeleton width="220px" height="2rem" borderRadius="0.4rem" />
      </div>

      {/* Author profile card */}
      <div
        className="skeleton-card"
        style={{
          padding: "3rem 2.5rem",
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "3rem",
        }}
      >
        <Skeleton width="120px" height="120px" borderRadius="50%" />
        <div style={{ flex: 1, minWidth: "260px" }}>
          <Skeleton width="140px" height="1.2rem" borderRadius="999px" style={{ marginBottom: "0.75rem" }} />
          <Skeleton width="60%" height="2.2rem" borderRadius="0.4rem" style={{ marginBottom: "0.75rem" }} />
          <Skeleton width="90%" height="1rem" borderRadius="0.3rem" style={{ marginBottom: "0.4rem" }} />
          <Skeleton width="75%" height="1rem" borderRadius="0.3rem" />
        </div>
      </div>
    </main>
  );
}
