"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { civilizationsData, Civilization } from "@/lib/civilizationsData";
import { getAllCivilizationsContent, getPageContent } from "@/lib/contentService";
import { defaultCivilizationsContent } from "@/lib/defaultSiteContent";
import { CivilizationsPageContent } from "@/types/content";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import EditCardModal from "@/components/cms/EditCardModal";
import { PageHeaderSkeleton, CivilizationsGridSkeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

export default function Civilizations() {
  const [civilizations, setCivilizations] = useState<Civilization[]>(civilizationsData);
  const [content, setContent] = useState<CivilizationsPageContent>(defaultCivilizationsContent);
  const [editingCiv, setEditingCiv] = useState<Civilization | null>(null);
  const [loading, setLoading] = useState(true);

  const { isEditMode, savePageField, saveCivilizationField, saveCivilizationFull } = useEditMode();

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getPageContent<CivilizationsPageContent>("civilizations", defaultCivilizationsContent),
      getAllCivilizationsContent(),
    ])
      .then(([contentData, civsData]) => {
        if (isMounted) {
          setContent(contentData || defaultCivilizationsContent);
          setCivilizations(civsData && civsData.length > 0 ? civsData : civilizationsData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading civilizations:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="container" style={{ paddingBottom: "5rem" }}>
        <PageHeaderSkeleton hasBadge maxWidth="760px" />
        <CivilizationsGridSkeleton count={8} />
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingBottom: "5rem" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "4rem", marginTop: "1rem" }}>
        <div style={{ display: "inline-block", marginBottom: "0.75rem" }}>
          <EditableText
            tag="div"
            label="Էջի Տիտղոս / Բեյջ (Eyebrow)"
            value={content.badge}
            style={{
              color: "var(--gold-accent)",
              fontSize: "0.85rem",
              fontWeight: "700",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, badge: val }));
              await savePageField("civilizations", "badge", val);
            }}
          />
        </div>
        <EditableText
          tag="h1"
          label="Էջի Գլխավոր Վերնագիր"
          value={content.title}
          style={{
            fontSize: "clamp(2.2rem, 4vw, 3rem)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-serif)",
            margin: "0 0 1rem 0",
          }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, title: val }));
            await savePageField("civilizations", "title", val);
          }}
        />
        <EditableText
          tag="p"
          multiline
          label="Էջի Նկարագրություն"
          value={content.description}
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.15rem",
            maxWidth: "750px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, description: val }));
            await savePageField("civilizations", "description", val);
          }}
        />
      </div>

      {/* 8 Civilization Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "2rem",
        }}
      >
        {civilizations.map((civ) => {
          const cardContent = (
            <>
              {/* Card Edit Button in Edit Mode */}
              {isEditMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingCiv(civ);
                  }}
                  style={{
                    position: "absolute",
                    top: "0.85rem",
                    right: "0.85rem",
                    background: "rgba(183, 121, 31, 0.15)",
                    color: "var(--gold-accent)",
                    border: "1px solid var(--gold-accent)",
                    borderRadius: "0.4rem",
                    padding: "0.3rem 0.65rem",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    zIndex: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                  title={`Խմբագրել «${civ.nameHy}» քարտը`}
                >
                  ✎ Խմբագրել
                </button>
              )}

              <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
                {/* Symbol / Icon with glowing backdrop & Badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.25rem",
                    paddingRight: isEditMode ? "6rem" : "0",
                  }}
                >
                  <EditableText
                    tag="div"
                    label={`«${civ.nameHy}» Սիմվոլ`}
                    value={civ.symbol}
                    style={{
                      fontSize: "2.8rem",
                      color: "var(--gold-accent)",
                      lineHeight: "1",
                      filter: "drop-shadow(0 2px 8px rgba(183, 121, 31, 0.2))",
                    }}
                    onSave={async (val) => {
                      setCivilizations((prev) =>
                        prev.map((c) => (c.id === civ.id ? { ...c, symbol: val } : c))
                      );
                      await saveCivilizationField(civ.id, "symbol", val);
                    }}
                  />
                  <EditableText
                    tag="span"
                    label={`«${civ.nameHy}» Բեյջ`}
                    value={civ.badge}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      background: "rgba(183, 121, 31, 0.12)",
                      color: "var(--gold-accent)",
                      border: "1px solid var(--card-border)",
                    }}
                    onSave={async (val) => {
                      setCivilizations((prev) =>
                        prev.map((c) => (c.id === civ.id ? { ...c, badge: val } : c))
                      );
                      await saveCivilizationField(civ.id, "badge", val);
                    }}
                  />
                </div>

                {/* Title & Subtitle */}
                <EditableText
                  tag="h3"
                  label={`«${civ.nameHy}» Անվանում (Հայերեն)`}
                  value={civ.nameHy}
                  style={{
                    fontSize: "1.35rem",
                    margin: "0 0 0.35rem 0",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-serif)",
                  }}
                  onSave={async (val) => {
                    setCivilizations((prev) =>
                      prev.map((c) => (c.id === civ.id ? { ...c, nameHy: val } : c))
                    );
                    await saveCivilizationField(civ.id, "nameHy", val);
                  }}
                />
                <EditableText
                  tag="div"
                  label={`«${civ.nameHy}» Անվանում (Անգլերեն)`}
                  value={civ.nameEn}
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--gold-accent)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: "1.25rem",
                    fontWeight: "500",
                  }}
                  onSave={async (val) => {
                    setCivilizations((prev) =>
                      prev.map((c) => (c.id === civ.id ? { ...c, nameEn: val } : c))
                    );
                    await saveCivilizationField(civ.id, "nameEn", val);
                  }}
                />

                {/* Credo snippet */}
                <EditableText
                  tag="p"
                  multiline
                  label={`«${civ.nameHy}» Կրեդո`}
                  value={civ.credo}
                  title={civ.credo}
                  style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: "1.65",
                    margin: "0 0 1.5rem 0",
                    fontStyle: "italic",
                    flex: "1 1 auto",
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                  }}
                  onSave={async (val) => {
                    setCivilizations((prev) =>
                      prev.map((c) => (c.id === civ.id ? { ...c, credo: val } : c))
                    );
                    await saveCivilizationField(civ.id, "credo", val);
                  }}
                />
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
                  <span>🏛 {civ.centers?.length || 0} կենտրոն</span>
                  <span>🖋 {civ.authors?.length || 0} հեղինակ</span>
                </div>
                {isEditMode ? (
                  <Link
                    href={`/hubs/${civ.slug}`}
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--gold-accent)",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      textDecoration: "none",
                    }}
                  >
                    Բացել էջը →
                  </Link>
                ) : (
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
                )}
              </div>
            </>
          );

          const cardStyle: React.CSSProperties = {
            padding: "2.25rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            textDecoration: "none",
          };

          return isEditMode ? (
            <div key={civ.id} className="glass-card" style={cardStyle}>
              {cardContent}
            </div>
          ) : (
            <Link
              key={civ.id}
              href={`/hubs/${civ.slug}`}
              className="glass-card"
              style={cardStyle}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>

      {/* Modal Dialog for Editing a Civilization Card */}
      {editingCiv && (
        <EditCardModal
          title={`Խմբագրել՝ «${editingCiv.nameHy}»`}
          initialData={{
            symbol: editingCiv.symbol,
            badge: editingCiv.badge,
            nameHy: editingCiv.nameHy,
            nameEn: editingCiv.nameEn,
            credo: editingCiv.credo,
          }}
          fields={[
            { key: "symbol", label: "Սիմվոլ / Էմոջի (օր.՝ ☩, ☯, ☸)" },
            { key: "badge", label: "Բեյջ / Տիտղոս (օր.՝ Սուրբ Լեռան Ուխտ)" },
            { key: "nameHy", label: "Անվանում (Հայերեն)" },
            { key: "nameEn", label: "Անվանում (Անգլերեն)" },
            { key: "credo", label: "Հիմնական Կրեդո (Core Credo)", type: "textarea" },
          ]}
          onClose={() => setEditingCiv(null)}
          onSave={async (data) => {
            setCivilizations((prev) =>
              prev.map((c) => (c.id === editingCiv.id ? { ...c, ...data } : c))
            );
            await saveCivilizationFull(editingCiv.id, data);
          }}
        />
      )}
    </main>
  );
}
