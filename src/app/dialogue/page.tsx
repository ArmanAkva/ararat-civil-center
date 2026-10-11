export default function Dialogue() {
  return (
    <main className="container">
      {/* Block 1. Active Topic Banner */}
      <div style={{
        background: "linear-gradient(135deg, var(--gradient-overlay-1) 0%, var(--bg-color) 100%)",
        border: "1px solid var(--gold-accent)",
        borderRadius: "1rem",
        padding: "3rem",
        textAlign: "center",
        marginBottom: "4rem"
      }}>
        <div style={{ color: "var(--gold-accent)", letterSpacing: "0.1em", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: "bold" }}>
          ՀԱՐՑԱԴՐՈՒՄ #12 | 2026թ. ԱՇՈՒՆ
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", margin: "0 0 1.5rem 0" }}>
          Թվային անթրոպոցիդ. Ինչպե՞ս պաշտպանել ավանդական արժեքները AI դարաշրջանում
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "800px", margin: "0 auto 2.5rem", lineHeight: "1.6" }}>
          Արհեստական բանականության սրընթաց զարգացումը ստեղծում է մարդակենտրոն արժեքների ոչնչացման վտանգ։ Կազմկոմիտեն հրավիրում է մտածողներին գտնել հավասարակշռության նոր բանաձևեր։
        </p>
        <button className="btn-primary">Ներկայացնել Տեսակետ</button>
      </div>

      {/* Block 2. Expert Insights */}
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", marginBottom: "2rem" }}>
        Հրավիրյալ Մտածողների Պատասխանները
      </h2>
      <div className="cards-grid" style={{ marginBottom: "4rem" }}>
        <div className="glass-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: "50px", height: "50px", background: "var(--card-border)", borderRadius: "50%" }}></div>
            <div>
              <h4 style={{ margin: "0" }}>Ալեն դը Բենուա</h4>
              <small style={{ color: "var(--text-secondary)" }}>Եվրոպական քաղաքակրթություն</small>
            </div>
          </div>
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>«Տեխնոլոգիան չի կարող փոխարինել մշակութային արմատներին...»</p>
        </div>
        <div className="glass-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ width: "50px", height: "50px", background: "var(--card-border)", borderRadius: "50%" }}></div>
            <div>
              <h4 style={{ margin: "0" }}>Ժաո Տինյան</h4>
              <small style={{ color: "var(--text-secondary)" }}>Չինական քաղաքակրթություն</small>
            </div>
          </div>
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>«Տյանսյա հայեցակարգը որպես զսպիչ ուժ...»</p>
        </div>
      </div>

      {/* Block 3. Community Feed */}
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", marginBottom: "2rem" }}>
        Հանրային Երկխոսություն
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "4rem" }}>
        <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "0.5rem", borderLeft: "3px solid var(--gold-accent)" }}>
          <strong style={{ display: "block", marginBottom: "0.5rem" }}>Դոկտոր Ա. Գրիգորյան (ԵՊՀ)</strong>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>Կարևոր է ձևավորել ազգային AI էթիկայի չափորոշիչներ...</p>
        </div>
      </div>

      {/* Block 4. Archive */}
      <h3 style={{ color: "var(--text-secondary)" }}>Հարցադրումների Արխիվ</h3>
      <ul style={{ color: "var(--text-secondary)", lineHeight: "2" }}>
        <li>Հարցադրում #11 | Բազմաբևեռ աշխարհի ճարտարապետությունը</li>
        <li>Հարցադրում #10 | Ավանդույթ և Մոդեռնիզմ</li>
      </ul>
    </main>
  );
}
