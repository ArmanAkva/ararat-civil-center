"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Civilization,
  ThinkTank,
  Thinker,
  Publication,
  civilizationsData,
} from "@/lib/civilizationsData";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import EditCardModal from "@/components/cms/EditCardModal";
import { getCivilizationContent } from "@/lib/contentService";

interface Props {
  civilization: Civilization;
}

export default function CivilizationView({ civilization: initialCiv }: Props) {
  const [civ, setCiv] = useState<Civilization>(initialCiv);
  const {
    isEditMode,
    saveCivilizationField,
    saveCenter,
    deleteCenter,
    saveAuthor,
    deleteAuthor,
  } = useEditMode();

  // SPA Tab State: "centers" | "authors"
  const [activeTab, setActiveTab] = useState<"centers" | "authors">("centers");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCredo, setCopiedCredo] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<{
    pub: Publication;
    authorName: string;
  } | null>(null);

  // Modal editing states
  const [editingCenter, setEditingCenter] = useState<{ center: ThinkTank; isNew: boolean } | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<{ author: Thinker; isNew: boolean } | null>(null);

  // Sync latest from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    getCivilizationContent(initialCiv.id).then((data) => {
      if (isMounted && data) {
        setCiv(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [initialCiv.id]);

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

  // Center CRUD via Subcollections
  const handleSaveCenter = async (updated: ThinkTank) => {
    let newCenters: ThinkTank[];
    if (editingCenter?.isNew) {
      newCenters = [updated, ...civ.centers];
    } else {
      newCenters = civ.centers.map((c) => (c.id === updated.id ? updated : c));
    }
    setCiv((prev) => ({ ...prev, centers: newCenters }));
    await saveCenter(civ.id, updated);
  };

  const handleDeleteCenter = async (centerId: string) => {
    const newCenters = civ.centers.filter((c) => c.id !== centerId);
    setCiv((prev) => ({ ...prev, centers: newCenters }));
    await deleteCenter(civ.id, centerId);
  };

  // Author CRUD via Subcollections
  const handleSaveAuthor = async (updated: Thinker) => {
    let newAuthors: Thinker[];
    if (editingAuthor?.isNew) {
      newAuthors = [updated, ...civ.authors];
    } else {
      newAuthors = civ.authors.map((a) => (a.id === updated.id ? updated : a));
    }
    setCiv((prev) => ({ ...prev, authors: newAuthors }));
    await saveAuthor(civ.id, updated);
  };

  const handleDeleteAuthor = async (authorId: string) => {
    const newAuthors = civ.authors.filter((a) => a.id !== authorId);
    setCiv((prev) => ({ ...prev, authors: newAuthors }));
    await deleteAuthor(civ.id, authorId);
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
            <EditableText
              value={civ.symbol}
              label="Խորհրդանիշ (Symbol)"
              tag="span"
              onSave={async (val) => {
                setCiv((prev) => ({ ...prev, symbol: val }));
                await saveCivilizationField(civ.id, "symbol", val);
              }}
            />
          </div>
        </div>

        <div className="civ-title-meta">
          <span className="civ-badge-pill">
            <EditableText
              value={civ.badge}
              label="Տարբերանշան (Badge)"
              tag="span"
              onSave={async (val) => {
                setCiv((prev) => ({ ...prev, badge: val }));
                await saveCivilizationField(civ.id, "badge", val);
              }}
            />
          </span>
        </div>

        <h1 id="civ-heading" className="civ-main-title">
          <EditableText
            value={civ.nameHy}
            label="Անվանում (Հայերեն)"
            tag="span"
            onSave={async (val) => {
              setCiv((prev) => ({ ...prev, nameHy: val }));
              await saveCivilizationField(civ.id, "nameHy", val);
            }}
          />
        </h1>

        <p className="civ-en-title">
          <EditableText
            value={civ.nameEn}
            label="Անվանում (Անգլերեն)"
            tag="span"
            onSave={async (val) => {
              setCiv((prev) => ({ ...prev, nameEn: val }));
              await saveCivilizationField(civ.id, "nameEn", val);
            }}
          />
        </p>
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
          <EditableText
            value={civ.credo}
            label="Գլխավոր Ասելիք (Core Credo Quote)"
            tag="span"
            multiline
            onSave={async (val) => {
              setCiv((prev) => ({ ...prev, credo: val }));
              await saveCivilizationField(civ.id, "credo", val);
            }}
          />
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

          {/* Action buttons in Edit Mode */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            {isEditMode && activeTab === "centers" && (
              <button
                type="button"
                onClick={() =>
                  setEditingCenter({
                    center: {
                      id: "center-" + Date.now(),
                      name: "Նոր Գիտական Կենտրոն",
                      originalName: "New Think Tank",
                      city: "Երևան",
                      country: "Հայաստան",
                      description: "Կենտրոնի հետազոտական առաքելությունը...",
                      focusAreas: ["Փիլիսոփայություն", "Քաղաքակրթական երկխոսություն"],
                      website: "",
                    },
                    isNew: true,
                  })
                }
                className="btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                + Ավելացնել Կենտրոն
              </button>
            )}

            {isEditMode && activeTab === "authors" && (
              <button
                type="button"
                onClick={() =>
                  setEditingAuthor({
                    author: {
                      id: "author-" + Date.now(),
                      name: "Նոր Մտածող",
                      nameOriginal: "New Thinker",
                      title: "Փիլիսոփա, Հետազոտող",
                      bio: "Հեղինակի կենսագրությունը և գիտական ժառանգությունը...",
                      quote: "«Մարդկության ապագան հիմնված է արժեքների ներդաշնակման վրա։»",
                      publications: [],
                    },
                    isNew: true,
                  })
                }
                className="btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
              >
                + Ավելացնել Հեղինակ
              </button>
            )}

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
                  border: "1px dashed var(--card-border)",
                }}
              >
                Որոնմանը համապատասխանող կենտրոն չգտնվեց:
              </div>
            ) : (
              <div className="cards-grid-subpage">
                {filteredCenters.map((center) => (
                  <article key={center.id} className="center-card" style={{ position: "relative" }}>
                    {isEditMode && (
                      <div
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          display: "flex",
                          gap: "0.5rem",
                          zIndex: 10,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setEditingCenter({ center, isNew: false })}
                          className="credo-action-btn"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "var(--bg-secondary)" }}
                          title="Խմբագրել կենտրոնի տվյալները"
                        >
                          ✏️ Խմբագրել
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCenter(center.id)}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            padding: "0.3rem 0.5rem",
                            borderRadius: "0.4rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                          title="Հեռացնել կենտրոնը"
                        >
                          🗑
                        </button>
                      </div>
                    )}

                    <div>
                      <div className="center-card-header" style={{ paddingRight: isEditMode ? "100px" : "0" }}>
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
                  border: "1px dashed var(--card-border)",
                }}
              >
                Որոնմանը համապատասխանող մտածող չգտնվեց:
              </div>
            ) : (
              <div className="cards-grid-subpage">
                {filteredAuthors.map((author) => (
                  <article key={author.id} className="author-card" style={{ position: "relative" }}>
                    {isEditMode && (
                      <div
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          display: "flex",
                          gap: "0.5rem",
                          zIndex: 10,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setEditingAuthor({ author, isNew: false })}
                          className="credo-action-btn"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "var(--bg-secondary)" }}
                          title="Խմբագրել հեղինակի տվյալները"
                        >
                          ✏️ Խմբագրել
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAuthor(author.id)}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            padding: "0.3rem 0.5rem",
                            borderRadius: "0.4rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                          title="Հեռացնել հեղինակին"
                        >
                          🗑
                        </button>
                      </div>
                    )}

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
          Edit Center Modal
          ========================================================= */}
      {editingCenter && (
        <EditCardModal
          title={editingCenter.isNew ? "Ավելացնել Նոր Կենտրոն" : `Խմբագրել՝ ${editingCenter.center.name}`}
          initialData={editingCenter.center}
          fields={[
            { key: "name", label: "Կենտրոնի Անվանում (Հայերեն)", placeholder: "օրինակ՝ Մատենադարան" },
            { key: "originalName", label: "Բնօրինակ / Անգլերեն Անվանում", placeholder: "e.g. Mesrop Mashtots Institute" },
            { key: "city", label: "Քաղաք", placeholder: "օրինակ՝ Երևան" },
            { key: "country", label: "Երկիր", placeholder: "օրինակ՝ Հայաստան" },
            { key: "foundedYear", label: "Հիմնադրման Տարեթիվ", placeholder: "օրինակ՝ 1959" },
            { key: "description", label: "Գործունեության և Առաքելության Նկարագրություն", type: "textarea" },
            { key: "focusAreas", label: "Գիտական Ուղղություններ (#tags բաժանված ստորակետով)", type: "tags" },
            { key: "website", label: "Պաշտոնական Կայքի Հղում (URL)", placeholder: "https://..." },
          ]}
          onSave={handleSaveCenter}
          onClose={() => setEditingCenter(null)}
          onDelete={!editingCenter.isNew ? () => handleDeleteCenter(editingCenter.center.id) : undefined}
        />
      )}

      {/* =========================================================
          Edit Author Modal
          ========================================================= */}
      {editingAuthor && (
        <EditCardModal
          title={editingAuthor.isNew ? "Ավելացնել Նոր Հեղինակ" : `Խմբագրել՝ ${editingAuthor.author.name}`}
          initialData={editingAuthor.author}
          fields={[
            { key: "name", label: "Անուն Ազգանուն (Հայերեն)", placeholder: "օրինակ՝ Վարդան Գրիգորյան" },
            { key: "nameOriginal", label: "Բնօրինակ / Լատիներեն Անուն", placeholder: "e.g. Vartan Gregorian" },
            { key: "title", label: "Գիտական Կոչում / Դեր", placeholder: "օրինակ՝ Պատմաբան, Փիլիսոփա" },
            { key: "bio", label: "Կենսագրություն և Նշանակություն", type: "textarea" },
            { key: "quote", label: "Նշանավոր Մեջբերում", type: "textarea", placeholder: "«...»" },
          ]}
          onSave={handleSaveAuthor}
          onClose={() => setEditingAuthor(null)}
          onDelete={!editingAuthor.isNew ? () => handleDeleteAuthor(editingAuthor.author.id) : undefined}
        />
      )}

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
