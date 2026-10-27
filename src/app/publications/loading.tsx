export default function PublicationsLoading() {
  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 1.5rem", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div
          style={{
            width: "160px",
            height: "28px",
            background: "var(--card-border)",
            borderRadius: "999px",
            margin: "0 auto 1rem",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            width: "380px",
            height: "44px",
            background: "var(--card-border)",
            borderRadius: "0.5rem",
            margin: "0 auto 1rem",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            width: "550px",
            height: "20px",
            background: "var(--card-border)",
            borderRadius: "0.4rem",
            margin: "0 auto",
            opacity: 0.3,
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "1.75rem",
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: "480px",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "1rem",
              padding: "1.75rem",
              opacity: 0.5,
              animation: "pulse 1.5s infinite",
            }}
          />
        ))}
      </div>
    </div>
  );
}
