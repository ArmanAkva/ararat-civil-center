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
import SingleCivilizationLoading from "@/app/civilizations/[slug]/loading";
import { MemberAvatarStack, MemberChip, MemberAvatar } from "@/components/ui/MemberCard";
import { AutoTruncateQuote } from "@/components/ui/AutoTruncateQuote";

interface Props {
  civilization: Civilization;
}

export default function CivilizationView({ civilization: initialCiv }: Props) {
  const [civ, setCiv] = useState<Civilization>(initialCiv);
  const [loading, setLoading] = useState(true);
  const {
    isEditMode,
    toggleEditMode,
    canEdit,
    saveCivilizationField,
    saveCenter,
    deleteCenter,
    saveAuthor,
    deleteAuthor,
    savePublication,
    deletePublication,
  } = useEditMode();

  // SPA Tab State: "centers" | "authors" | "publications"
  const [activeTab, setActiveTab] = useState<"centers" | "authors" | "publications">("centers");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCredo, setCopiedCredo] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<{
    pub: Publication;
    authorName: string;
  } | null>(null);

  // Modal editing states
  const [editingCenter, setEditingCenter] = useState<{ center: ThinkTank; isNew: boolean } | null>(null);
  const [editingAuthor, setEditingAuthor] = useState<{ author: Thinker; isNew: boolean } | null>(null);
  const [editingLibraryPub, setEditingLibraryPub] = useState<{ pub: Publication; isNew: boolean } | null>(null);
  const [addingPubAuthor, setAddingPubAuthor] = useState<Thinker | null>(null);

  // Sync latest from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    getCivilizationContent(initialCiv.id)
      .then((data) => {
        if (isMounted) {
          if (data) setCiv(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading civilization from Firestore:", err);
        if (isMounted) setLoading(false);
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

  const handleDeleteCenter = async (center: ThinkTank) => {
    const name = center.name || center.originalName || "այս կենտրոնը";
    if (!confirm(`Իսկապե՞ս ցանկանում եք հեռացնել «${name}» կենտրոնը:`)) return;
    const newCenters = civ.centers.filter((c) => c.id !== center.id);
    setCiv((prev) => ({ ...prev, centers: newCenters }));
    await deleteCenter(civ.id, center.id);
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

  const handleDeleteAuthor = async (author: Thinker) => {
    const name = author.name || author.nameOriginal || "այս հեղինակին";
    if (!confirm(`Իսկապե՞ս ցանկանում եք հեռացնել «${name}» հեղինակին:`)) return;
    const newAuthors = civ.authors.filter((a) => a.id !== author.id);
    setCiv((prev) => ({ ...prev, authors: newAuthors }));
    await deleteAuthor(civ.id, author.id);
  };

  // Publication CRUD inside an Author
  const handleDeletePublication = async (author: Thinker, pubIndex: number) => {
    const pub = author.publications[pubIndex];
    if (!confirm(`Իսկապե՞ս ցանկանում եք հեռացնել «${pub.title}» աշխատությունը:`)) return;
    const updatedPubs = author.publications.filter((_, i) => i !== pubIndex);
    const updatedAuthor = { ...author, publications: updatedPubs };
    const newAuthors = civ.authors.map((a) => (a.id === author.id ? updatedAuthor : a));
    setCiv((prev) => ({ ...prev, authors: newAuthors }));
    await saveAuthor(civ.id, updatedAuthor);
  };

  const handleSaveNewPublication = async (pub: Publication) => {
    if (!addingPubAuthor) return;
    const updatedPubs = [...(addingPubAuthor.publications || []), pub];
    const updatedAuthor = { ...addingPubAuthor, publications: updatedPubs };
    const newAuthors = civ.authors.map((a) => (a.id === addingPubAuthor.id ? updatedAuthor : a));
    setCiv((prev) => ({ ...prev, authors: newAuthors }));
    await saveAuthor(civ.id, updatedAuthor);
    setAddingPubAuthor(null);
  };

  // Publication CRUD via Subcollection
  const handleSaveLibraryPub = async (updated: Publication) => {
    let newPubs: Publication[];
    if (editingLibraryPub?.isNew) {
      newPubs = [updated, ...(civ.publications || [])];
    } else {
      newPubs = (civ.publications || []).map((p) => (p.id === updated.id ? updated : p));
    }
    setCiv((prev) => ({ ...prev, publications: newPubs }));
    await savePublication(civ.id, updated);
    setEditingLibraryPub(null);
  };

  const handleDeleteLibraryPub = async (pub: Publication) => {
    if (!confirm(`Իսկապե՞ս ցանկանում եք հեռացնել «${pub.title}» աշխատությունը քաղաքակրթության գրադարանից:`)) return;
    const newPubs = (civ.publications || []).filter((p) => p.id !== pub.id);
    setCiv((prev) => ({ ...prev, publications: newPubs }));
    if (pub.id) {
      await deletePublication(civ.id, pub.id);
    }
    setEditingLibraryPub(null);
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

  // Filter publications based on query
  const filteredPublications = (civ.publications || []).filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.type && p.type.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.year && String(p.year).includes(q))
    );
  });

  if (loading) {
    return <SingleCivilizationLoading />;
  }

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

        <div className="civ-en-title">
          <EditableText
            value={civ.nameEn}
            label="Անվանում (Անգլերեն)"
            tag="span"
            onSave={async (val) => {
              setCiv((prev) => ({ ...prev, nameEn: val }));
              await saveCivilizationField(civ.id, "nameEn", val);
            }}
          />
        </div>
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

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "publications"}
              onClick={() => setActiveTab("publications")}
              className={`tab-nav-btn ${activeTab === "publications" ? "active" : ""}`}
            >
              <span>📚</span>
              <span>Գիտական Աշխատություններ</span>
              <span className="tab-counter">{civ.publications?.length || 0}</span>
            </button>
          </div>

          {/* Action buttons: Quick Toggle, Add Center, Add Author, Add Publication, Search */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            {/* Quick Edit Toggle for Admins */}
            {canEdit && !isEditMode && (
              <button
                type="button"
                onClick={toggleEditMode}
                className="credo-action-btn"
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  background: "rgba(183, 121, 31, 0.12)",
                  border: "1px solid var(--gold-accent)",
                  color: "var(--gold-accent)",
                }}
                title="Ակտիվացնել Խմբագրման ռեժիմը՝ նոր կենտրոններ կամ հեղինակներ ավելացնելու համար"
              >
                <span>✏️ Միացնել Խմբագրումը</span>
              </button>
            )}

            {/* Add Center Button */}
            {isEditMode && activeTab === "centers" && (
              <button
                type="button"
                onClick={() =>
                  setEditingCenter({
                    center: {
                      id: "center-" + Date.now(),
                      name: "",
                      originalName: "",
                      city: "Երևան",
                      country: "Հայաստան",
                      foundedYear: "",
                      description: "",
                      focusAreas: [],
                      website: "",
                    },
                    isNew: true,
                  })
                }
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.2rem",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>🏛➕</span>
                <span>Ավելացնել Կենտրոն</span>
              </button>
            )}

            {/* Add Author Button */}
            {isEditMode && activeTab === "authors" && (
              <button
                type="button"
                onClick={() =>
                  setEditingAuthor({
                    author: {
                      id: "author-" + Date.now(),
                      name: "",
                      nameOriginal: "",
                      title: "",
                      bio: "",
                      quote: "",
                      publications: [],
                    },
                    isNew: true,
                  })
                }
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.2rem",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>🖋➕</span>
                <span>Ավելացնել Հեղինակ</span>
              </button>
            )}

            {/* Add Publication Button */}
            {isEditMode && activeTab === "publications" && (
              <button
                type="button"
                onClick={() =>
                  setEditingLibraryPub({
                    pub: {
                      id: "pub-" + Date.now(),
                      civId: civ.id,
                      title: "",
                      year: String(new Date().getFullYear()),
                      type: "Զեկույց",
                      pages: 100,
                      description: "",
                      downloadUrl: "",
                      authorIds: [],
                      centerIds: [],
                    },
                    isNew: true,
                  })
                }
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.2rem",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span>📚➕</span>
                <span>Ավելացնել Աշխատություն</span>
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
                    : activeTab === "authors"
                    ? "Որոնել հեղինակ, աշխատություն..."
                    : "Որոնել աշխատություն, տեսակ, թեմա..."
                }
              />
            </div>
          </div>
        </div>

        {/* Tab 1 Content: [Կենտրոններ] */}
        {activeTab === "centers" && (
          <div className="tab-content-panel" role="tabpanel" aria-label="Կենտրոններ">
            <div className="cards-grid-subpage">
              {/* Dashed Add Card when in Edit Mode */}
              {isEditMode && (
                <div
                  onClick={() =>
                    setEditingCenter({
                      center: {
                        id: "center-" + Date.now(),
                        name: "",
                        originalName: "",
                        city: "Երևան",
                        country: "Հայաստան",
                        foundedYear: "",
                        description: "",
                        focusAreas: [],
                        website: "",
                      },
                      isNew: true,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  style={{
                    border: "2px dashed var(--gold-accent)",
                    borderRadius: "1.25rem",
                    padding: "2.5rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "rgba(183, 121, 31, 0.04)",
                    transition: "all 0.25s ease",
                    minHeight: "280px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(183, 121, 31, 0.1)";
                    e.currentTarget.style.borderColor = "var(--gold-accent)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(183, 121, 31, 0.04)";
                    e.currentTarget.style.borderColor = "var(--gold-accent)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem", color: "var(--gold-accent)" }}>
                    🏛➕
                  </div>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "var(--gold-accent)",
                      fontSize: "1.2rem",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    + Ավելացնել Նոր Կենտրոն
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "240px" }}>
                    Սեղմեք՝ նոր գիտահետազոտական կամ ուղեղային կենտրոն ավելացնելու համար
                  </p>
                </div>
              )}

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
                        onClick={() => handleDeleteCenter(center)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          color: "#ef4444",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "0.4rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                        title="Հեռացնել կենտրոնը"
                      >
                        🗑 Ջնջել
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="center-card-header" style={{ paddingRight: isEditMode ? "140px" : "0" }}>
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
                      <h3 className="center-card-title">
                        <Link href={`/centers/${center.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {center.name}
                        </Link>
                      </h3>
                      {center.originalName && <p className="center-card-origin">{center.originalName}</p>}
                    </div>

                    <p className="center-card-desc">{center.description}</p>
                  </div>

                  <div>
                    {center.focusAreas && center.focusAreas.length > 0 && (
                      <div className="center-tags">
                        {center.focusAreas.map((tag, idx) => (
                          <span key={idx} className="center-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {(() => {
                      const pubCount = center.publications?.length || 0;
                      // Resolve actual author objects
                      const authorMap = new Map<string, Thinker>();
                      (center.authors || []).forEach((a) => {
                        if (a && a.name) authorMap.set(a.id, a);
                      });
                      (center.authorIds || []).forEach((id) => {
                        const found = (civ.authors || []).find((a) => a.id.toLowerCase() === id.toLowerCase());
                        if (found) authorMap.set(found.id, found);
                      });
                      const centerAuthors = Array.from(authorMap.values());

                      if (pubCount === 0 && centerAuthors.length === 0) return null;

                      return (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0.8rem",
                            marginBottom: "1rem",
                            paddingTop: "0.6rem",
                            borderTop: "1px solid var(--card-border)",
                            flexWrap: "wrap",
                          }}
                        >
                          {centerAuthors.length > 0 ? (
                            <MemberAvatarStack
                              members={centerAuthors}
                              max={3}
                              size={28}
                              showLabel={true}
                              labelSingular="գիտաշխատող"
                              labelPlural="գիտաշխատողներ"
                            />
                          ) : (
                            <div />
                          )}

                          {pubCount > 0 && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                fontSize: "0.78rem",
                                color: "var(--text-secondary)",
                                background: "var(--input-bg)",
                                padding: "0.2rem 0.55rem",
                                borderRadius: "999px",
                                border: "1px solid var(--card-border)",
                              }}
                            >
                              <span>📄</span>
                              <span>{pubCount} աշխատություն</span>
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    <div className="center-card-footer">
                      <Link
                        href={`/centers/${center.id}`}
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--gold-accent)",
                          fontWeight: "600",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <span>Մանրամասն էջը →</span>
                      </Link>
                      {center.website ? (
                        <a
                          href={center.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="center-link-btn"
                        >
                          <span>Պաշտոնական կայք ↗</span>
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

            {filteredCenters.length === 0 && !isEditMode && (
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
            )}
          </div>
        )}

        {/* Tab 2 Content: [Հեղինակներ] */}
        {activeTab === "authors" && (
          <div className="tab-content-panel" role="tabpanel" aria-label="Հեղինակներ">
            <div className="cards-grid-subpage">
              {/* Dashed Add Card when in Edit Mode */}
              {isEditMode && (
                <div
                  onClick={() =>
                    setEditingAuthor({
                      author: {
                        id: "author-" + Date.now(),
                        name: "",
                        nameOriginal: "",
                        title: "",
                        bio: "",
                        quote: "",
                        publications: [],
                      },
                      isNew: true,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  style={{
                    border: "2px dashed var(--gold-accent)",
                    borderRadius: "1.25rem",
                    padding: "2.5rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "rgba(183, 121, 31, 0.04)",
                    transition: "all 0.25s ease",
                    minHeight: "280px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(183, 121, 31, 0.1)";
                    e.currentTarget.style.borderColor = "var(--gold-accent)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(183, 121, 31, 0.04)";
                    e.currentTarget.style.borderColor = "var(--gold-accent)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem", color: "var(--gold-accent)" }}>
                    🖋➕
                  </div>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "var(--gold-accent)",
                      fontSize: "1.2rem",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    + Ավելացնել Նոր Հեղինակ
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "240px" }}>
                    Սեղմեք՝ նոր մտածող, փիլիսոփա կամ գիտնական ավելացնելու համար
                  </p>
                </div>
              )}

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
                        onClick={() => handleDeleteAuthor(author)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          color: "#ef4444",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "0.4rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                        title="Հեռացնել հեղինակին"
                      >
                        🗑 Ջնջել
                      </button>
                    </div>
                  )}

                  <div className="author-header-flex">
                    <MemberAvatar name={author.name} size={64} glow />
                    <div style={{ paddingRight: isEditMode ? "140px" : "0" }}>
                      <h3 className="author-name">
                        <Link href={`/authors/${author.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                          {author.name || "Անանուն հեղինակ"}
                        </Link>
                      </h3>
                      {author.nameOriginal && (
                        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
                          {author.nameOriginal}
                        </div>
                      )}
                      <p className="author-title">{author.title}</p>
                      {(() => {
                        const affiliatedCenters = (civ.centers || []).filter(
                          (c) =>
                            (c.authorIds || []).includes(author.id) ||
                            (c.authors || []).some((a) => a.id === author.id)
                        );
                        if (affiliatedCenters.length === 0) return null;
                        return (
                          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                            {affiliatedCenters.map((c) => (
                              <Link
                                key={c.id}
                                href={`/centers/${c.id}`}
                                style={{
                                  fontSize: "0.72rem",
                                  color: "var(--gold-accent)",
                                  background: "rgba(183, 121, 31, 0.12)",
                                  border: "1px solid var(--card-border)",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "999px",
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  fontWeight: "600",
                                }}
                                title={`Կենտրոն՝ ${c.name}`}
                              >
                                <span>🏛</span>
                                <span>{c.name}</span>
                              </Link>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <p className="author-bio">{author.bio}</p>

                  {author.quote && (
                    <AutoTruncateQuote
                      quote={author.quote}
                      className="author-quote-box"
                      lineHeightPx={22}
                    />
                  )}

                  {/* Publications section: Show only 1 key work */}
                  <div className="author-publications-section">
                    <div className="publications-header-title">
                      <span>Առանցքային Աշխատություն</span>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--gold-accent)" }}>
                          {author.publications ? author.publications.length : 0} նյութ
                        </span>
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAddingPubAuthor(author);
                            }}
                            style={{
                              background: "rgba(183, 121, 31, 0.15)",
                              border: "1px solid var(--gold-accent)",
                              color: "var(--gold-accent)",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "0.35rem",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                            title="Ավելացնել աշխատություն այս հեղինակին"
                          >
                            + Աշխատություն
                          </button>
                        )}
                      </div>
                    </div>

                    {author.publications && author.publications.length > 0 ? (
                      <>
                        {author.publications.slice(0, 1).map((pub, idx) => (
                          <div key={idx} style={{ position: "relative" }}>
                            <div
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

                            {isEditMode && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePublication(author, 0);
                                }}
                                style={{
                                  position: "absolute",
                                  right: "0.5rem",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  background: "rgba(239, 68, 68, 0.15)",
                                  color: "#ef4444",
                                  border: "1px solid rgba(239, 68, 68, 0.4)",
                                  borderRadius: "0.35rem",
                                  padding: "0.25rem 0.5rem",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  zIndex: 5,
                                }}
                                title="Ջնջել այս աշխատությունը"
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        ))}

                        {author.publications.length > 1 && (
                          <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
                            <Link
                              href={`/authors/${author.id}`}
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--gold-accent)",
                                textDecoration: "none",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                            >
                              <span>+ ևս {author.publications.length - 1} աշխատություն հեղինակի էջում</span>
                              <span>→</span>
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic", padding: "0.5rem 0" }}>
                        Առանցքային աշխատություն նշված չէ
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: "1.2rem", paddingTop: "0.8rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "flex-end" }}>
                    <Link
                      href={`/authors/${author.id}`}
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--gold-accent)",
                        fontWeight: "600",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span>Մանրամասն հեղինակի էջը →</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {filteredAuthors.length === 0 && !isEditMode && (
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
            )}
          </div>
        )}

        {/* Tab 3 Content: [Գիտական Աշխատություններ] */}
        {activeTab === "publications" && (
          <div className="tab-content-panel" role="tabpanel" aria-label="Գիտական Աշխատություններ">
            <div className="cards-grid-subpage">
              {/* Dashed Add Card when in Edit Mode */}
              {isEditMode && (
                <div
                  onClick={() =>
                    setEditingLibraryPub({
                      pub: {
                        id: "pub-" + Date.now(),
                        civId: civ.id,
                        title: "",
                        year: String(new Date().getFullYear()),
                        type: "Զեկույց",
                        pages: 100,
                        description: "",
                        downloadUrl: "",
                        authorIds: [],
                        centerIds: [],
                      },
                      isNew: true,
                    })
                  }
                  role="button"
                  tabIndex={0}
                  style={{
                    border: "2px dashed var(--gold-accent)",
                    borderRadius: "1.25rem",
                    padding: "2.5rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "rgba(183, 121, 31, 0.04)",
                    transition: "all 0.25s ease",
                    minHeight: "280px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(183, 121, 31, 0.1)";
                    e.currentTarget.style.borderColor = "var(--gold-accent)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(183, 121, 31, 0.04)";
                    e.currentTarget.style.borderColor = "var(--gold-accent)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem", color: "var(--gold-accent)" }}>
                    📚➕
                  </div>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "var(--gold-accent)",
                      fontSize: "1.2rem",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    + Ավելացնել Նոր Աշխատություն
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "240px" }}>
                    Սեղմեք՝ քաղաքակրթության գրադարանում նոր զեկույց, մենագրություն կամ հոդված ավելացնելու համար
                  </p>
                </div>
              )}

              {filteredPublications.map((pub, idx) => (
                <article
                  key={pub.id || idx}
                  className="glass-card"
                  style={{
                    padding: "1.8rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
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
                        onClick={() => setEditingLibraryPub({ pub, isNew: false })}
                        className="credo-action-btn"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "var(--bg-secondary)" }}
                        title="Խմբագրել աշխատությունը"
                      >
                        ✏️ Խմբագրել
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLibraryPub(pub)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          color: "#ef4444",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "0.4rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                        title="Հեռացնել աշխատությունը"
                      >
                        🗑 Ջնջել
                      </button>
                    </div>
                  )}

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                      <span className="pub-tag-badge">📄 {pub.type || "Զեկույց"}</span>
                      <span style={{ fontSize: "0.85rem", color: "var(--gold-accent)", fontWeight: "600" }}>
                        {pub.year && `${pub.year}թ.`}
                        {pub.pages && ` • ${pub.pages} էջ`}
                      </span>
                      {pub.downloadUrl && (
                        <span style={{ fontSize: "0.78rem", color: "#10b981", background: "rgba(16, 185, 129, 0.12)", padding: "0.15rem 0.5rem", borderRadius: "999px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                          ✓ Առցանց
                        </span>
                      )}
                    </div>

                    <h3 style={{ margin: "0 0 0.6rem 0", color: "var(--text-primary)", fontSize: "1.2rem", fontFamily: "var(--font-serif)", lineHeight: "1.35", paddingRight: isEditMode ? "140px" : "0" }}>
                      {pub.title}
                    </h3>

                    {pub.description && (
                      <p style={{ margin: "0 0 1rem 0", color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.6" }}>
                        {pub.description}
                      </p>
                    )}

                    {/* Attached Authors and Centers */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" }}>
                      {pub.authorIds && pub.authorIds.length > 0 && (
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Հեղինակ՝</span>
                          {pub.authorIds.map((aId) => {
                            const authorObj = (civ.authors || []).find((a) => a.id === aId);
                            return (
                              <Link
                                key={aId}
                                href={`/authors/${aId}`}
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--gold-accent)",
                                  background: "rgba(183, 121, 31, 0.12)",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "999px",
                                  border: "1px solid var(--card-border)",
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  fontWeight: "600",
                                }}
                              >
                                <span>🖋</span>
                                <span>{authorObj?.name || aId}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}

                      {pub.centerIds && pub.centerIds.length > 0 && (
                        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Կենտրոն՝</span>
                          {pub.centerIds.map((cId) => {
                            const centerObj = (civ.centers || []).find((c) => c.id === cId);
                            return (
                              <Link
                                key={cId}
                                href={`/centers/${cId}`}
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--gold-accent)",
                                  background: "rgba(183, 121, 31, 0.1)",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "999px",
                                  border: "1px solid var(--card-border)",
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  fontWeight: "600",
                                }}
                              >
                                <span>🏛</span>
                                <span>{centerObj?.name || cId}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ paddingTop: "0.8rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setSelectedPublication({ pub, authorName: civ.nameHy })}
                      className="credo-action-btn"
                      style={{ padding: "0.45rem 0.9rem", fontSize: "0.82rem" }}
                    >
                      Դիտել Մանրամասն
                    </button>

                    {pub.downloadUrl && (
                      <a
                        href={pub.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--gold-accent)", fontSize: "0.82rem", fontWeight: "600", textDecoration: "none" }}
                      >
                        Բացել Հղումը ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {filteredPublications.length === 0 && !isEditMode && (
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
                Որոնմանը համապատասխանող գիտական աշխատություն չգտնվեց:
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================
          Edit / Add Center Modal
          ========================================================= */}
      {editingCenter && (
        <EditCardModal
          title={editingCenter.isNew ? "Ավելացնել Նոր Ուղեղային Կենտրոն" : `Խմբագրել՝ ${editingCenter.center.name || "Կենտրոն"}`}
          initialData={editingCenter.center}
          fields={[
            { key: "name", label: "Կենտրոնի Անվանում (Հայերեն)", placeholder: "օրինակ՝ ԳԱԱ Փիլիսոփայության ինստիտուտ" },
            { key: "originalName", label: "Բնօրինակ / Անգլերեն Անվանում", placeholder: "e.g. Institute of Philosophy" },
            { key: "city", label: "Քաղաք", placeholder: "օրինակ՝ Երևան" },
            { key: "country", label: "Երկիր", placeholder: "օրինակ՝ Հայաստան" },
            { key: "foundedYear", label: "Հիմնադրման Տարեթիվ", placeholder: "օրինակ՝ 1969" },
            { key: "description", label: "Գործունեության և Առաքելության Նկարագրություն", type: "textarea", placeholder: "Կենտրոնի հետազոտական ուղղությունները..." },
            { key: "focusAreas", label: "Գիտական Ուղղություններ (#tags բաժանված ստորակետով)", type: "tags", placeholder: "Փիլիսոփայություն, Քաղաքակրթական երկխոսություն..." },
            { key: "website", label: "Պաշտոնական Կայքի Հղում (URL)", placeholder: "https://..." },
          ]}
          onSave={handleSaveCenter}
          onClose={() => setEditingCenter(null)}
          onDelete={!editingCenter.isNew ? () => handleDeleteCenter(editingCenter.center) : undefined}
        />
      )}

      {/* =========================================================
          Edit / Add Author Modal
          ========================================================= */}
      {editingAuthor && (
        <EditCardModal
          title={editingAuthor.isNew ? "Ավելացնել Նոր Մտածող / Հեղինակ" : `Խմբագրել՝ ${editingAuthor.author.name || "Հեղինակ"}`}
          initialData={editingAuthor.author}
          fields={[
            { key: "name", label: "Անուն Ազգանուն (Հայերեն)", placeholder: "օրինակ՝ Շանթ Մկրտչյան" },
            { key: "nameOriginal", label: "Բնօրինակ / Լատիներեն Անուն", placeholder: "e.g. Shant Mkrtchyan" },
            { key: "title", label: "Գիտական Կոչում / Դեր", placeholder: "օրինակ՝ Փիլիսոփա, Քաղաքագետ" },
            { key: "bio", label: "Կենսագրություն և Նշանակություն", type: "textarea", placeholder: "Հեղինակի գիտական ավանդը և ուսումնասիրությունները..." },
            { key: "quote", label: "Նշանավոր Մեջբերում", type: "textarea", placeholder: "«...»" },
          ]}
          onSave={handleSaveAuthor}
          onClose={() => setEditingAuthor(null)}
          onDelete={!editingAuthor.isNew ? () => handleDeleteAuthor(editingAuthor.author) : undefined}
        />
      )}

      {/* =========================================================
          Edit / Add Publication Modal (Library)
          ========================================================= */}
      {editingLibraryPub && (
        <EditCardModal
          title={
            editingLibraryPub.isNew
              ? `Ավելացնել Նոր Գիտական Աշխատություն (${civ.nameHy})`
              : `Խմբագրել՝ ${editingLibraryPub.pub.title || "Աշխատություն"}`
          }
          initialData={editingLibraryPub.pub}
          fields={[
            { key: "title", label: "Աշխատության Վերնագիր", placeholder: "օրինակ՝ Ռազմավարական Ինքնիշխանության Հիմունքները" },
            { key: "type", label: "Տեսակ (Զեկույց / Մենագրություն / Հոդված / PDF / Գիրք)", placeholder: "Զեկույց" },
            { key: "year", label: "Հրատարակման Տարեթիվ", placeholder: "2026" },
            { key: "pages", label: "Էջերի Քանակ", placeholder: "120" },
            { key: "downloadUrl", label: "Առցանց Հղում / PDF URL", placeholder: "https://..." },
            { key: "description", label: "Ամփոփագիր և Գիտական Թեզիսներ", type: "textarea", placeholder: "Հիմնական դրույթները..." },
          ]}
          onSave={handleSaveLibraryPub}
          onClose={() => setEditingLibraryPub(null)}
          onDelete={!editingLibraryPub.isNew ? () => handleDeleteLibraryPub(editingLibraryPub.pub) : undefined}
        />
      )}

      {/* =========================================================
          Add Publication Modal
          ========================================================= */}
      {addingPubAuthor && (
        <EditCardModal
          title={`Ավելացնել Աշխատություն՝ ${addingPubAuthor.name}`}
          initialData={{
            title: "",
            year: String(new Date().getFullYear()),
            type: "PDF",
            pages: 100,
            description: "",
          }}
          fields={[
            { key: "title", label: "Աշխատության Վերնագիր", placeholder: "օրինակ՝ Քաղաքակրթությունների Համարարչություն" },
            { key: "year", label: "Հրատարակման Տարեթիվ", placeholder: "2026" },
            { key: "type", label: "Տեսակ (PDF / Մենագրություն / Հոդված / Զեկույց)", placeholder: "PDF" },
            { key: "pages", label: "Էջերի Քանակ", placeholder: "150" },
            { key: "description", label: "Ամփոփագիր և Նկարագրություն", type: "textarea", placeholder: "Աշխատության հիմնական դրույթները..." },
          ]}
          onSave={handleSaveNewPublication}
          onClose={() => setAddingPubAuthor(null)}
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
