import Link from "next/link";
import { civilizationsData } from "@/lib/civilizationsData";

export const metadata = {
  title: "8 Քաղաքակրթական Բևեռներ և Մտածողներ | Արարատյան Ֆորում",
  description:
    "Բացահայտեք 8 քաղաքակրթական բևեռների հոգևոր կոդերը, գլխավոր ասելիքը, առաջատար գիտահետազոտական կենտրոններն ու մտածողներին։",
};

export default function Civilizations() {
  return (
    <main className="container" style={{ paddingBottom: "5rem" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem", marginTop: "1rem" }}>
        <div
          style={{
            display: "inline-block",
            color: "var(--gold-accent)",
            fontSize: "0.85rem",
            fontWeight: "700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          Քաղաքակրթական Համարարչություն
        </div>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 4vw, 3rem)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
            margin: "0 0 1rem 0",
          }}
        >
          8 Քաղաքակրթական Բևեռներ և Մտածողներ
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.15rem",
            maxWidth: "750px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
        >
          Ընտրեք 8 ավանդական քաղաքակրթություններից որևէ մեկը՝ ծանոթանալու նրանց
          գաղափարական կոդին (Core Credo), առաջատար ուղեղային կենտրոններին և մեծագույն մտածողների ժառանգությանը։
        </p>
      </div>

      {/* 8 Civilization Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "2rem",
        }}
      >
        {civilizationsData.map((civ) => (
          <Link
            key={civ.id}
            href={`/hubs/${civ.slug}`}
            className="glass-card"
            style={{
              padding: "2.25rem 2rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>
              {/* Symbol / Icon with glowing backdrop */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2.8rem",
                    color: "var(--gold-accent)",
                    lineHeight: "1",
                    filter: "drop-shadow(0 2px 8px rgba(183, 121, 31, 0.2))",
                  }}
                >
                  {civ.symbol}
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    background: "rgba(183, 121, 31, 0.12)",
                    color: "var(--gold-accent)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  {civ.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3
                style={{
                  fontSize: "1.35rem",
                  margin: "0 0 0.35rem 0",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {civ.nameHy}
              </h3>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--gold-accent)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                  fontWeight: "500",
                }}
              >
                {civ.nameEn}
              </div>

              {/* Credo snippet */}
              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--text-secondary)",
                  lineHeight: "1.65",
                  margin: "0 0 1.5rem 0",
                  fontStyle: "italic",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {civ.credo}
              </p>
            </div>

            {/* Footer with stats & action */}
            <div
              style={{
                borderTop: "1px solid var(--card-border)",
                paddingTop: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  gap: "0.75rem",
                }}
              >
                <span>🏛 {civ.centers.length} կենտրոն</span>
                <span>🖋 {civ.authors.length} հեղինակ</span>
              </div>
              <span
                style={{
                  fontSize: "0.88rem",
                  color: "var(--gold-accent)",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                Բացել էջը →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
