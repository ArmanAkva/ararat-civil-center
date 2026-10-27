"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Publication, PublicationWithDetails, Thinker, ThinkTank, Civilization } from "@/lib/civilizationsData";
import { useAuth } from "@/context/AuthContext";
import { useEditMode } from "@/context/EditModeContext";
import { formatFileSize, uploadPublicationPdf } from "@/lib/storageService";
import { savePublicationDoc } from "@/lib/contentService";
import { MemberAvatar } from "@/components/ui/MemberCard";
import EditCardModal from "@/components/cms/EditCardModal";

interface Props {
  initialPublication: PublicationWithDetails;
  relatedPublications?: Publication[];
}

export default function PublicationDetailView({ initialPublication, relatedPublications = [] }: Props) {
  const [data, setData] = useState<PublicationWithDetails>(initialPublication);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [directUploading, setDirectUploading] = useState(false);
  const [directProgress, setDirectProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  const { user, isAdmin } = useAuth();
  const { isEditMode, savePublication } = useEditMode();
  const canEdit = Boolean(isAdmin || isEditMode || user);

  const { pub, civ, author, center } = data;

  // Direct upload from page
  const handleDirectPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setDirectUploading(true);
    setDirectProgress(0);

    try {
      const res = await uploadPublicationPdf(file, civ.id, (p) => {
        setDirectProgress(p);
      });
      const updatedPub: Publication = {
        ...pub,
        downloadUrl: res.downloadUrl,
        fileName: res.fileName,
        fileSizeBytes: res.fileSizeBytes,
      };
      await savePublicationDoc(civ.id, updatedPub);
      await savePublication(civ.id, updatedPub);
      setData((prev) => ({ ...prev, pub: updatedPub }));
    } catch (err: any) {
      console.error("Direct PDF upload error:", err);
      setUploadError(err.message || "Ֆայլի վերբեռնումը ձախողվեց:");
    } finally {
      setDirectUploading(false);
      if (directFileInputRef.current) {
        directFileInputRef.current.value = "";
      }
    }
  };

  // Handle Edit Publication
  const handleSaveEdited = async (form: any) => {
    const updatedPub: Publication = {
      ...pub,
      title: form.title?.trim() || pub.title,
      type: form.type || pub.type,
      ...(form.year !== undefined ? (form.year ? { year: String(form.year).trim() } : { year: "" }) : (pub.year ? { year: pub.year } : {})),
      ...(form.pages !== undefined ? (form.pages ? { pages: Number(form.pages) } : {}) : (pub.pages ? { pages: pub.pages } : {})),
      ...(form.downloadUrl !== undefined ? (form.downloadUrl ? { downloadUrl: form.downloadUrl.trim() } : { downloadUrl: "" }) : (pub.downloadUrl ? { downloadUrl: pub.downloadUrl } : {})),
      ...(form.fileName !== undefined ? { fileName: form.fileName } : (pub.fileName ? { fileName: pub.fileName } : {})),
      ...(form.fileSizeBytes !== undefined ? { fileSizeBytes: form.fileSizeBytes } : (pub.fileSizeBytes ? { fileSizeBytes: pub.fileSizeBytes } : {})),
      ...(form.description !== undefined ? (form.description ? { description: form.description.trim() } : { description: "" }) : (pub.description ? { description: pub.description } : {})),
    };

    try {
      await savePublicationDoc(civ.id, updatedPub);
      await savePublication(civ.id, updatedPub);
    } catch (err: any) {
      console.error("Publication save error:", err);
      alert(`Սխալ աշխատությունը պահպանելիս. ${err.message || err}`);
    }
    setData((prev) => ({ ...prev, pub: updatedPub }));
    setIsEditing(false);
  };

  return (
    <main className="pdf-reader-container">
      {/* Breadcrumb & Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Գլխավոր
          </Link>
          <span>/</span>
          <Link href="/publications" style={{ color: "var(--gold-accent)", textDecoration: "none", fontWeight: "600" }}>
            Գրադարան
          </Link>
          <span>/</span>
          <Link href={`/civilizations/${civ.slug || civ.id}`} style={{ color: "inherit", textDecoration: "none" }}>
            {civ.nameHy}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{pub.title}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link
            href="/publications"
            className="credo-action-btn"
            style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <span>←</span> <span>Վերադառնալ Գրադարան</span>
          </Link>

          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="credo-action-btn"
              style={{
                padding: "0.45rem 0.9rem",
                fontSize: "0.85rem",
                background: "rgba(183, 121, 31, 0.15)",
                color: "var(--gold-accent)",
                border: "1px solid var(--gold-accent)",
              }}
            >
              ✏️ Խմբագրել
            </button>
          )}

          {pub.downloadUrl && (
            <>
              <a
                href={pub.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="credo-action-btn"
                style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem", textDecoration: "none" }}
                title="Բացել առանձին ներդիրում"
              >
                ↗ Բացել
              </a>
              <a
                href={pub.downloadUrl}
                download={pub.fileName || `${pub.title}.pdf`}
                className="btn-primary"
                style={{
                  padding: "0.45rem 1.1rem",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>⬇️ Ներբեռնել PDF</span>
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Header Publication Overview Card */}
      <section
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "1.25rem",
          padding: "2.25rem",
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
          marginBottom: "2rem",
        }}
      >
        {/* Meta badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <Link
            href={`/civilizations/${civ.slug || civ.id}`}
            style={{
              background: "rgba(183, 121, 31, 0.15)",
              color: "var(--gold-accent)",
              border: "1px solid var(--card-border)",
              padding: "0.25rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.82rem",
              fontWeight: "700",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <span>{civ.symbol}</span>
            <span>{civ.nameHy} Քաղաքակրթություն</span>
          </Link>

          <span className="pub-tag-badge">📄 {pub.type || "Զեկույց"}</span>

          {pub.year && (
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" }}>
              🗓 {pub.year} թվական
            </span>
          )}

          {pub.pages && (
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "600" }}>
              📖 {pub.pages} էջ
            </span>
          )}

          {pub.downloadUrl ? (
            <span
              style={{
                fontSize: "0.78rem",
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.12)",
                padding: "0.2rem 0.65rem",
                borderRadius: "999px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: "600",
              }}
            >
              ✓ Թվային PDF {pub.fileSizeBytes ? `(${formatFileSize(pub.fileSizeBytes)})` : ""}
            </span>
          ) : (
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-secondary)",
                background: "var(--input-bg)",
                padding: "0.2rem 0.65rem",
                borderRadius: "999px",
                border: "1px solid var(--card-border)",
              }}
            >
              Թվային արխիվ (պատրաստվում է)
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.75rem, 3.2vw, 2.6rem)",
            color: "var(--text-primary)",
            lineHeight: "1.3",
            margin: "0 0 1.5rem 0",
            fontWeight: "700",
          }}
        >
          {pub.title}
        </h1>

        {/* Affiliations: Author & Center */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--card-border)",
          }}
        >
          {/* Author info */}
          {author ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <MemberAvatar name={author.name} size={48} />
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Հեղինակ
                </div>
                <Link
                  href={`/authors/${author.id}`}
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: "700",
                    color: "var(--gold-accent)",
                    textDecoration: "none",
                  }}
                >
                  {author.name}
                </Link>
                {author.title && (
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {author.title}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "1.8rem" }}>🖋</div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Հեղինակ</div>
                <div style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  {civ.nameHy} Գիտական Խորհուրդ
                </div>
              </div>
            </div>
          )}

          {/* Center info */}
          {center ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(183, 121, 31, 0.12)",
                  border: "1.5px solid var(--gold-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  flexShrink: 0,
                }}
              >
                🏛
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Գիտական Կենտրոն
                </div>
                <Link
                  href={`/centers/${center.id}`}
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: "700",
                    color: "var(--gold-accent)",
                    textDecoration: "none",
                  }}
                >
                  {center.name}
                </Link>
                <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  {center.city}, {center.country}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ fontSize: "1.8rem" }}>🏛</div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Քաղաքակրթություն</div>
                <div style={{ fontSize: "1rem", color: "var(--text-primary)", fontWeight: "600" }}>
                  {civ.nameHy}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          ABSTRACT AND KEY THESES SECTION
          ========================================================= */}
      <section
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "1.25rem",
          padding: "2rem",
          backdropFilter: "blur(10px)",
          marginBottom: "2.5rem",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.35rem",
            color: "var(--gold-accent)",
            margin: "0 0 1rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>📑</span>
          <span>Ամփոփագիր և Գիտական Հիմնադրույթներ</span>
        </h3>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--text-primary)",
            lineHeight: "1.8",
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {pub.description ||
            `Այս աշխատությունը ներկայացնում է «${civ.nameHy}» քաղաքակրթական ռազմավարության հիմնարար դոկտրինը, գիտական հետազոտությունները և արդի փիլիսոփայական հայեցակարգերը։`}
        </p>
      </section>

      {/* =========================================================
          ON-SCREEN PDF VIEWER SECTION
          Fulfills: "display pdf on screan to open it in page"
          ========================================================= */}
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.4rem",
              color: "var(--text-primary)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>📄</span>
            <span>Էկրանային Դիտարկիչ (PDF On-Screen Reader)</span>
          </h2>

          {pub.downloadUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="credo-action-btn"
                style={{
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.82rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>{isFullscreen ? "✕ Ելք լիաէկրանից" : "⛶ Լիաէկրան դիտում"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Embedded PDF Screen Reader */}
        {pub.downloadUrl ? (
          <div className={`pdf-screen-reader-wrapper ${isFullscreen ? "is-fullscreen" : ""}`}>
            {/* Toolbar */}
            <div className="pdf-screen-reader-toolbar">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--gold-accent)" }}>
                  📄 {pub.fileName || `${pub.title}.pdf`}
                </span>
                {pub.fileSizeBytes && (
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    ({formatFileSize(pub.fileSizeBytes)})
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <a
                  href={pub.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credo-action-btn"
                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", textDecoration: "none" }}
                  title="Բացել նոր պատուհանում"
                >
                  ↗ Նոր պատուհան
                </a>
                <a
                  href={pub.downloadUrl}
                  download={pub.fileName || `${pub.title}.pdf`}
                  className="btn-primary"
                  style={{
                    padding: "0.35rem 0.9rem",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <span>⬇️ Ներբեռնել</span>
                </a>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => directFileInputRef.current?.click()}
                    className="credo-action-btn"
                    style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                    title="Փոխարինել PDF փաստաթուղթը նոր ֆայլով"
                  >
                    📎 Փոխել PDF
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="credo-action-btn"
                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                  title={isFullscreen ? "Ելք լիաէկրանից" : "Լիաէկրան դիտում"}
                >
                  {isFullscreen ? "✕" : "⛶"}
                </button>
              </div>
            </div>

            {/* In-Page PDF Frame */}
            <iframe
              src={`${pub.downloadUrl}#toolbar=1&navpanes=1&zoom=page-width`}
              className="pdf-screen-reader-frame"
              title={pub.title}
            />
          </div>
        ) : (
          /* Fallback when no PDF attached yet */
          <div
            style={{
              background: "var(--card-bg)",
              border: "1px dashed var(--gold-accent)",
              borderRadius: "1rem",
              padding: "3.5rem 2rem",
              textAlign: "center",
              backdropFilter: "blur(10px)",
              marginTop: "1rem",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏛📖</div>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              Թվային Փաստաթուղթը Պատրաստվում է Ներբեռնման
            </h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "520px", margin: "0 auto 1.5rem", lineHeight: "1.6" }}>
              Այս աշխատության թվային բնօրինակը ներկայումս թվայնացման և արխիվացման գործընթացում է Արարատյան Կենտրոնի գրադարանում:
            </p>

            {/* Hidden file input for direct one-click upload */}
            <input
              ref={directFileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleDirectPdfUpload}
              style={{ display: "none" }}
            />

            {directUploading ? (
              <div
                style={{
                  maxWidth: "400px",
                  margin: "0 auto",
                  padding: "1.25rem",
                  background: "var(--input-bg)",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--gold-accent)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.6rem" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Վերբեռնվում է Storage և պահպանվում...</span>
                  <span style={{ fontWeight: 700, color: "var(--gold-accent)" }}>{directProgress}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.1)", borderRadius: "999px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${directProgress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #b7791f, #d4af37)",
                      transition: "width 0.2s ease",
                    }}
                  />
                </div>
              </div>
            ) : uploadError ? (
              <div style={{ marginBottom: "1.25rem" }}>
                <p style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{uploadError}</p>
                <button
                  type="button"
                  onClick={() => directFileInputRef.current?.click()}
                  className="btn-primary"
                  style={{ padding: "0.55rem 1.2rem", fontSize: "0.85rem" }}
                >
                  🔄 Կրկնել վերբեռնումը
                </button>
              </div>
            ) : canEdit ? (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => directFileInputRef.current?.click()}
                  className="btn-primary"
                  style={{
                    padding: "0.7rem 1.6rem",
                    fontSize: "0.95rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    boxShadow: "0 4px 15px rgba(183, 121, 31, 0.3)",
                  }}
                >
                  <span>📎</span>
                  <span>Ընտրել և Վերբեռնել PDF Ֆայլ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="credo-action-btn"
                  style={{ padding: "0.7rem 1.4rem", fontSize: "0.95rem" }}
                >
                  <span>✏️ Խմբագրել Տվյալները</span>
                </button>
              </div>
            ) : null}
          </div>
        )}
      </section>

      {/* Admin Edit Modal */}
      {isEditing && (
        <EditCardModal
          title={`Խմբագրել՝ ${pub.title}`}
          initialData={pub}
          civId={civ.id}
          fields={[
            { key: "title", label: "Աշխատության Վերնագիր", placeholder: "Վերնագիր..." },
            { key: "type", label: "Տեսակ (Զեկույց / Մենագրություն / Հոդված / PDF / Գիրք)", placeholder: "Զեկույց" },
            { key: "year", label: "Հրատարակման Տարեթիվ", placeholder: "2026" },
            { key: "pages", label: "Էջերի Քանակ", placeholder: "120" },
            { key: "description", label: "Ամփոփագիր և Գիտական Թեզիսներ", type: "textarea", placeholder: "Հիմնական դրույթները..." },
            { key: "downloadUrl", label: "PDF Փաստաթուղթ (Storage / URL)", type: "pdf" },
          ]}
          onSave={handleSaveEdited}
          onClose={() => setIsEditing(false)}
        />
      )}
    </main>
  );
}
