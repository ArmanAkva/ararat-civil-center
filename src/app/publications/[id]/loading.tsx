export default function PublicationDetailLoading() {
  return (
    <div className="pdf-reader-container" style={{ minHeight: "80vh" }}>
      {/* Top skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div style={{ width: "240px", height: "24px", background: "var(--card-border)", borderRadius: "0.4rem", opacity: 0.4 }} />
        <div style={{ width: "160px", height: "36px", background: "var(--card-border)", borderRadius: "0.5rem", opacity: 0.4 }} />
      </div>

      {/* Header skeleton */}
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "1.25rem",
          padding: "2.5rem",
          marginBottom: "2rem",
          opacity: 0.5,
        }}
      >
        <div style={{ width: "180px", height: "26px", background: "var(--card-border)", borderRadius: "999px", marginBottom: "1rem" }} />
        <div style={{ width: "80%", height: "40px", background: "var(--card-border)", borderRadius: "0.5rem", marginBottom: "1.5rem" }} />
        <div style={{ width: "260px", height: "48px", background: "var(--card-border)", borderRadius: "0.5rem" }} />
      </div>

      {/* Frame skeleton */}
      <div
        style={{
          height: "600px",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "1rem",
          opacity: 0.4,
        }}
      />
    </div>
  );
}
