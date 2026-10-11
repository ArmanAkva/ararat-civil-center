"use client";
import { useState } from "react";

export default function Forum() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <main className="container">
      {/* Block 1. Countdown & Dates */}
      <div style={{ textAlign: "center", marginBottom: "5rem", padding: "4rem 0", background: "url('/mountain-bg.jpg') center/cover", borderRadius: "1rem", border: "1px solid var(--card-border)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "var(--header-bg)", borderRadius: "1rem" }}></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3rem", color: "var(--gold-accent)", margin: "0 0 1rem 0" }}>
            22-24 Հունվարի, 2027
          </h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "400", marginBottom: "2rem" }}>
            Հայաստան (Գյումրի - Էջմիածին - Երևան)
          </h2>
          <div style={{ fontSize: "2.5rem", fontFamily: "var(--font-mono)", marginBottom: "2rem", letterSpacing: "0.2em", color: "var(--text-primary)" }}>
            845 : 12 : 30 : 45
          </div>
          <button className="btn-primary" style={{ background: "transparent", border: "1px solid var(--gold-accent)", color: "var(--gold-accent)" }}>
            Առաջարկել այլընտրանքային ժամկետ / Հաստատել համաձայնությունը
          </button>
        </div>
      </div>

      {/* Block 2. Interactive Manifesto */}
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", marginBottom: "2rem" }}>
        Արարատյան Մանիֆեստ
      </h2>
      <div style={{ background: "var(--card-bg)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)", marginBottom: "4rem" }}>
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", alignItems: "flex-start" }}>
          <p style={{ flex: 1, fontSize: "1.15rem", lineHeight: "1.8", margin: 0, color: "var(--text-secondary)" }}>
            <strong>Ի՞նչ.</strong> Սա նոր ձևաչափ է, որը նպատակ ունի վերականգնել կորսված երկխոսությունը տարբեր ավանդույթների միջև։
          </p>
          <div style={{ display: "flex", gap: "1rem", minWidth: "120px" }}>
            <button style={{ background: "none", border: "none", color: "var(--gold-accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>👍</span> 142
            </button>
            <button style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>📝</span> Առաջարկ
            </button>
          </div>
        </div>
      </div>

      {/* Block 3. Core Messages */}
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", marginBottom: "2rem" }}>
        Օրակարգային 3 Ուղերձներ
      </h2>
      <div style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          {[1,2,3].map(num => (
            <button key={num} onClick={() => setActiveTab(num)} style={{
              background: activeTab === num ? "var(--gold-accent)" : "var(--card-bg)",
              color: activeTab === num ? "#fff" : "var(--text-primary)",
              border: "1px solid var(--card-border)",
              padding: "0.8rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: activeTab === num ? "bold" : "normal"
            }}>
              Ուղերձ {num}
            </button>
          ))}
        </div>
        <div style={{ background: "var(--card-bg)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            {activeTab === 1 && "Քաղաքակրթական ժամանակակից ճգնաժամ․ Հաղթահարման ուղիները։"}
            {activeTab === 2 && "Քաղաքակրթական կոդեր և արժեքներ․ համադրում։"}
            {activeTab === 3 && "Քաղաքակրթական ստեղծարար համագործակցություն՝ Համարարչություն։"}
          </p>
          <textarea placeholder="Ավելացնել առաջարկ..." style={{ width: "100%", padding: "1rem", background: "var(--input-bg)", border: "1px solid var(--card-border)", color: "var(--text-primary)", borderRadius: "0.5rem", marginBottom: "1rem", boxSizing: "border-box" }} rows={3}></textarea>
          <button className="btn-primary" style={{ padding: "0.5rem 1.5rem", fontSize: "0.9rem" }}>Ուղարկել</button>
        </div>
      </div>

      {/* Block 4. 3-Day Agenda */}
      <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", marginBottom: "2rem" }}>
        3-Օրյա Օրակարգ (Նախնական)
      </h2>
      <div style={{ display: "grid", gap: "1.5rem", marginBottom: "4rem" }}>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>ՕՐ 1. ԳՅՈՒՄՐԻ | «Black Fortress» (Սև բերդ)</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Բացման արարողություն և առաջին պանելային քննարկում։</p>
        </div>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>ՕՐ 2. ԷՋՄԻԱԾԻՆ | Մայր Աթոռ Սուրբ Էջմիածնի Մատենադարան</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Հոգևոր ժառանգություն և քաղաքակրթական կոդեր։ <span style={{ color: "var(--gold-accent)", cursor: "pointer", fontWeight: "bold" }}>+ Առաջարկել լրացում</span></p>
        </div>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>ՕՐ 3. ԵՐԵՎԱՆ | Գիտությունների Ազգային Ակադեմիա</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>Ակադեմիական ամփոփում և Հռչակագրի ընդունում։</p>
        </div>
      </div>

      {/* Block 5. Consensus Dashboard */}
      <div style={{ background: "linear-gradient(90deg, var(--bg-color) 0%, var(--gradient-overlay-1) 100%)", padding: "2rem", borderRadius: "1rem", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontFamily: "var(--font-serif)" }}>Կոնսենսուսի Ցուցիչ (Consensus Dashboard)</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>Արարատյան Հռչակագրի լեգիտիմության կենդանի ցուցիչ</p>
        </div>
        <div style={{ fontSize: "3rem", color: "var(--gold-accent)", fontWeight: "bold" }}>
          78%
        </div>
      </div>
    </main>
  );
}
