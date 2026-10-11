"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Civilization,
  ThinkTank,
  Thinker,
  Publication,
  civilizationsData
} from "@/lib/civilizationsData";

interface Props {
  civilization: Civilization;
}

export default function CivilizationView({ civilization: civ }: Props) {
  // SPA Tab State: "centers" | "authors"
  const [activeTab, setActiveTab] = useState<"centers" | "authors">("centers");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCredo, setCopiedCredo] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<{
    pub: Publication;
    authorName: string;
  } | null>(null);

  // Copy credo text to clipboard
  const handleCopyCredo = async () => {
    try {
      await navigator.clipboard.writeText(civ.credo);
      setCopiedCredo(true);
      setTimeout(() => setCopiedCredo(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Filter centers based on query
  const filteredCenters = civ.centers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.originalName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.focusAreas.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  // Filter authors based on query
  const filteredAuthors = civ.authors.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      (a.nameOriginal && a.nameOriginal.toLowerCase().includes(q)) ||
      a.title.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q) ||
      a.publications.some((p) => p.title.toLowerCase().includes(q))
    );
  });

  return (
    <main className="subpage-container">
      {/* Top Bar: Back to Civilizations & Quick Switcher */}
      <nav className="subpage-top-nav" aria-label="Քաղաքակրթությունների նավիգացիա">
        <Link href="/civilizations" className="back-link">
          <span>←</span> Բոլոր քաղաքակրթությունները
        </Link>
        <div className="civ-quick-pills">
          {civilizationsData.map((c) => (
            <Link
              key={c.id}
              href={`/hubs/${c.slug}`}
              className={`civ-pill ${c.id === civ.id ? "active" : ""}`}
              title={c.nameHy}
            >
              <span>{c.symbol}</span>
              <span>{c.nameHy.replace(" քաղաքակրթություն", "")}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* =========================================================
          ԲԼՈԿ Ա (Header & Title)
          Քաղաքակրթության անունը և պատկերակը (Icon)
          ========================================================= */}
      <section className="block-header" aria-labelledby="civ-heading">
        <div className="civ-icon-wrapper">
          <div className="civ-icon-glow"></div>
          <div className="civ-icon-badge" aria-hidden="true">
            {civ.symbol}
          </div>
        </div>

        <div className="civ-title-meta">
          <span className="civ-badge-pill">{civ.badge}</span>
        </div>

        <h1 id="civ-heading" className="civ-main-title">
          {civ.nameHy}
        </h1>

        <p className="civ-en-title">{civ.nameEn}</p>
      </section>

      {/* =========================================================
          ԲԼՈԿ Բ (Core Credo)
          Տվյալ քաղաքակրթության հիմնական գաղափարական ասելիքը մեծ,
          էսթետիկ մեջբերման (Quote) ոճով
          ========================================================= */}
      <section className="block-credo" aria-label="Քաղաքակրթական Գլխավոր Ասելիք">
        <div className="credo-watermark" aria-hidden="true">
          “
        </div>

        <div className="credo-header-label">
          <span>✧</span> Քաղաքակրթական Կոդ և Գլխավոր Ասելիք (Core Credo)
        </div>

        <blockquote className="credo-quote-text">
          {civ.credo}
        </blockquote>

        <div className="credo-footer">
          <div className="credo-author-sign">
            <span>⚜️</span>
            <span>
              <strong>Արարատյան Ֆորում</strong> | {civ.nameHy}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCredo}
            className="credo-action-btn"
            title="Պատճենել մեջբերումը"
          >
            {copiedCredo ? (
              <>
                <span style={{ color: "var(--gold-accent)" }}>✓</span>
                <span>Պատճենված է</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Պատճենել Ասելիքը</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* =========================================================
          ԲԼՈԿ Գ (Navigation Tabs - SPA logic)
          Երկու ակտիվ կոճակ/տաբ (Tabs)՝ [Կենտրոններ] և [Հեղինակներ],
          որոնք փոխվում են առանց էջի վերաբեռնման
          ========================================================= */}
      <section className="block-tabs-section" aria-label="Քաղաքակրթության ներքին բաժիններ">
        <div className="tabs-header-bar">
          {/* Active Navigation Tabs */}
          <div className="tabs-nav-group" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "centers"}
              onClick={() => setActiveTab("centers")}
              className={`tab-nav-btn ${activeTab === "centers" ? "active" : ""}`}
            >
              <span>🏛</span>
              <span>Կենտրոններ</span>
              <span className="tab-counter">{civ.centers.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "authors"}
              onClick={() => setActiveTab("authors")}
              className={`tab-nav-btn ${activeTab === "authors" ? "active" : ""}`}
            >
              <span>🖋</span>
              <span>Հեղինակներ</span>
              <span className="tab-counter">{civ.authors.length}</span>
            </button>
          </div>

          {/* Real-time search filter */}
          <div className="tab-search-wrapper">
            <span className="tab-search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="text"
              className="tab-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "centers"
                  ? "Որոնել կենտրոններ, քաղաք, ոլորտ..."
                  : "Որոնել հեղինակ, աշխատություն..."
              }
            />
          </div>
        </div>

        {/* Tab 1 Content: [Կենտրոններ] */}
        {activeTab === "centers" && (
          <div className="tab-content-panel" role="tabpanel" aria-label="Կենտրոններ">
            {filteredCenters.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "var(--text-secondary)",
                  background: "var(--card-bg)",
                  borderRadius: "1rem",
                  border: "1px dashed var(--card-border)"
                }}
              >
                Որոնմանը համապատասխանող կենտրոն չգտնվեց:
              </div>
            ) : (
              <div className="cards-grid-subpage">
                {filteredCenters.map((center) => (
                  <article key={center.id} className="center-card">
                    <div>
                      <div className="center-card-header">
                        <div className="center-location-tag">
                          <span>📍</span>
                          <span>
                            {center.city}, {center.country}
                          </span>
                          {center.foundedYear && (
                            <span style={{ opacity: 0.7, marginLeft: "0.25rem" }}>
                              • հիմնադրված {center.foundedYear}թ.
                            </span>
                          )}
                        </div>
                        <h3 className="center-card-title">{center.name}</h3>
                        <p className="center-card-origin">{center.originalName}</p>
                      </div>

                      <p className="center-card-desc">{center.description}</p>
                    </div>

                    <div>
                      <div className="center-tags">
                        {center.focusAreas.map((tag, idx) => (
                          <span key={idx} className="center-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="center-card-footer">
                        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                          Գիտական հենք
                        </span>
                        {center.website ? (
                          <a
                            href={center.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="center-link-btn"
                          >
                            <span>Պաշտոնական կայք</span>
                            <span>↗</span>
                          </a>
                        ) : (
                          <span className="center-link-btn" style={{ cursor: "default" }}>
                            Գործընկեր ինստիտուտ
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2 Content: [Հեղինակներ] */}
        {activeTab === "authors" && (
          <div className="tab-content-panel" role="tabpanel" aria-label="Հեղինակներ">
            {filteredAuthors.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "var(--text-secondary)",
                  background: "var(--card-bg)",
                  borderRadius: "1rem",
                  border: "1px dashed var(--card-border)"
                }}
              >
                Որոնմանը համապատասխանող մտածող չգտնվեց:
              </div>
            ) : (
              <div className="cards-grid-subpage">
                {filteredAuthors.map((author) => (
                  <article key={author.id} className="author-card">
                    <div className="author-header-flex">
                      <div className="author-avatar" aria-hidden="true">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="author-name">{author.name}</h3>
                        {author.nameOriginal && (
                          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                            {author.nameOriginal}
                          </div>
                        )}
                        <p className="author-title">{author.title}</p>
                      </div>
                    </div>

                    <p className="author-bio">{author.bio}</p>

                    {author.quote && (
                      <div className="author-quote-box">
                        {author.quote}
                      </div>
                    )}

                    {author.publications && author.publications.length > 0 && (
                      <div className="author-publications-section">
                        <div className="publications-header-title">
                          <span>Առանցքային Աշխատություններ</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--gold-accent)" }}>
                            {author.publications.length} նյութ
                          </span>
                        </div>

                        {author.publications.map((pub, idx) => (
                          <div
                            key={idx}
                            className="publication-card-item"
                            onClick={() =>
                              setSelectedPublication({ pub, authorName: author.name })
                            }
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedPublication({ pub, authorName: author.name });
                              }
                            }}
                          >
                            <div className="pub-title-col">
                              <h4 className="pub-title-text">{pub.title}</h4>
                              <p className="pub-meta-text">
                                {pub.year && `${pub.year}թ.`}
                                {pub.pages && ` • ${pub.pages} էջ`}
                              </p>
                            </div>
                            <span className="pub-tag-badge">
                              📄 {pub.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================
          Publication Details Modal (Preview / Download)
          ========================================================= */}
      {selectedPublication && (
        <div
          className="civ-modal-overlay"
          onClick={() => setSelectedPublication(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="civ-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="civ-modal-close"
              onClick={() => setSelectedPublication(null)}
              aria-label="Փակել"
            >
              ✕
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gold-accent)", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              <span>📄</span>
              <span>{selectedPublication.pub.type} • {selectedPublication.pub.year || "Հրատարակված"}</span>
            </div>

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", color: "var(--text-primary)", margin: "0 0 0.5rem 0", lineHeight: "1.3" }}>
              {selectedPublication.pub.title}
            </h2>

            <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Հեղինակ՝ <strong style={{ color: "var(--gold-accent)" }}>{selectedPublication.authorName}</strong>
              {selectedPublication.pub.pages && ` (${selectedPublication.pub.pages} էջ)`}
            </div>

            <div style={{ background: "var(--input-bg)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--card-border)", marginBottom: "2rem" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Ամփոփագիր և Գիտական Նկարագիր
              </h4>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "0.95rem" }}>
                {selectedPublication.pub.description ||
                  "Այս աշխատությունը ներկայացնում է քաղաքակրթական հիմնարար դոկտրինը, գիտական հետազոտությունները և արդի փիլիսոփայական հայեցակարգերը։"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                type="button"
                className="credo-action-btn"
                onClick={() => setSelectedPublication(null)}
              >
                Փակել
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  alert(`«${selectedPublication.pub.title}» աշխատության թվային տարբերակը պատրաստվում է ներբեռնման (Արարատյան Գրադարան)։`);
                }}
              >
                <span>Ներբեռնել PDF (Թվային արխիվ)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
