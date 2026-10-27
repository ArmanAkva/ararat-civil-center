"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Civilization, Thinker, Publication, ThinkTank } from "@/lib/civilizationsData";
import { useAuth } from "@/context/AuthContext";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import EditCardModal from "@/components/cms/EditCardModal";
import { getAuthorContent } from "@/lib/contentService";
import AuthorLoading from "@/app/authors/[id]/loading";
import PdfViewerModal from "@/components/publications/PdfViewerModal";
import PdfUploadField from "@/components/publications/PdfUploadField";

interface Props {
  initialAuthor: Thinker;
  initialCiv: Civilization;
}

export default function AuthorDetailView({ initialAuthor, initialCiv }: Props) {
  const [author, setAuthor] = useState<Thinker>(initialAuthor);
  const [civ, setCiv] = useState<Civilization>(initialCiv);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { isEditMode, toggleEditMode, saveAuthor, saveCenter, savePublication, deletePublication } = useEditMode();

  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [pubModalTab, setPubModalTab] = useState<"select" | "create">("select");
  const [pubSearchQuery, setPubSearchQuery] = useState("");
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{
    url: string;
    title: string;
    authorName?: string;
    year?: string;
    pages?: number;
    fileName?: string;
    fileSizeBytes?: number;
  } | null>(null);

  // New Publication form state
  const [newPubData, setNewPubData] = useState({
    title: "",
    year: String(new Date().getFullYear()),
    type: "Հոդված",
    pages: "",
    downloadUrl: "",
    fileName: "",
    fileSizeBytes: undefined as number | undefined,
    description: "",
    centerId: "",
  });

  useEffect(() => {
    let isMounted = true;
    getAuthorContent(initialAuthor.id)
      .then((res) => {
        if (isMounted) {
          if (res) {
            setAuthor(res.author);
            setCiv(res.civ);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading author:", err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [initialAuthor.id]);

  const handleSaveField = async (field: keyof Thinker, val: any) => {
    const updated = { ...author, [field]: val };
    setAuthor(updated);
    await saveAuthor(civ.id, updated);
  };

  // Compute resolved publications associated with this author:
  const authorPublications: Publication[] = (() => {
    const list: Publication[] = [];
    const seen = new Set<string>();

    // 1. From civ.publications (subcollection):
    if (civ.publications && Array.isArray(civ.publications)) {
      for (const p of civ.publications) {
        const isLinked =
          (p.authorIds && p.authorIds.includes(author.id)) ||
          (author.publicationIds && p.id && author.publicationIds.includes(p.id));
        if (isLinked) {
          const key = p.id || p.title;
          if (!seen.has(key)) {
            list.push(p);
            seen.add(key);
          }
        }
      }
    }

    // 2. From author.publications (local/direct entries):
    if (author.publications && Array.isArray(author.publications)) {
      for (const p of author.publications) {
        const key = p.id || p.title;
        if (!seen.has(key)) {
          list.push(p);
          seen.add(key);
        }
      }
    }

    return list;
  })();

  // Toggle link between a publication and this author
  const handleToggleLinkPublication = async (pub: Publication) => {
    const isCurrentlyLinked =
      (pub.authorIds && pub.authorIds.includes(author.id)) ||
      (author.publicationIds && pub.id && author.publicationIds.includes(pub.id)) ||
      (author.publications || []).some((p) => (p.id && p.id === pub.id) || p.title === pub.title);

    let nextAuthorIds: string[];
    let nextPublicationIds: string[];

    if (isCurrentlyLinked) {
      // Unlink
      nextAuthorIds = (pub.authorIds || []).filter((id) => id !== author.id);
      nextPublicationIds = (author.publicationIds || []).filter((id) => id !== pub.id);
    } else {
      // Link
      nextAuthorIds = Array.from(new Set([...(pub.authorIds || []), author.id]));
      nextPublicationIds = pub.id
        ? Array.from(new Set([...(author.publicationIds || []), pub.id]))
        : (author.publicationIds || []);
    }

    const updatedPub: Publication = {
      ...pub,
      authorIds: nextAuthorIds,
    };

    // Update in civ.publications
    const updatedCivPubs = (civ.publications || []).map((p) =>
      p.id === pub.id ? updatedPub : p
    );
    setCiv({ ...civ, publications: updatedCivPubs });
    await savePublication(civ.id, updatedPub);

    // Update author
    const updatedAuthor: Thinker = {
      ...author,
      publicationIds: nextPublicationIds,
      publications: (author.publications || []).filter((p) => p.title !== pub.title),
    };
    setAuthor(updatedAuthor);
    await saveAuthor(civ.id, updatedAuthor);
  };

  // Unlink publication directly from card
  const handleUnlinkPublication = async (pub: Publication) => {
    if (
      !confirm(
        `Իսկապե՞ս ցանկանում եք անջատել «${pub.title}» աշխատությունը այս հեղինակից:\n(Աշխատությունը կպահպանվի քաղաքակրթության գրադարանում):`
      )
    )
      return;
    await handleToggleLinkPublication(pub);
  };

  // Create brand new publication: saves to civ.publications AND links to this author!
  const handleCreateAndLinkPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubData.title.trim()) {
      alert("Խնդրում ենք լրացնել աշխատության վերնագիրը:");
      return;
    }

    const newPubId = `pub-${Date.now()}`;
    const centerIds = newPubData.centerId ? [newPubData.centerId] : [];

    const newPub: Publication = {
      id: newPubId,
      civId: civ.id,
      title: newPubData.title.trim(),
      type: newPubData.type || "Հոդված",
      authorIds: [author.id],
      centerIds,
      createdAt: new Date().toISOString(),
      ...(newPubData.year?.trim() ? { year: newPubData.year.trim() } : {}),
      ...(newPubData.pages ? { pages: Number(newPubData.pages) } : {}),
      ...(newPubData.downloadUrl?.trim() ? { downloadUrl: newPubData.downloadUrl.trim() } : {}),
      ...(newPubData.fileName?.trim() ? { fileName: newPubData.fileName.trim() } : {}),
      ...(newPubData.fileSizeBytes ? { fileSizeBytes: newPubData.fileSizeBytes } : {}),
      ...(newPubData.description?.trim() ? { description: newPubData.description.trim() } : {}),
    };

    // 1. Save in civilization publications subcollection
    await savePublication(civ.id, newPub);

    // 2. Update civ state
    const updatedCivPubs = [...(civ.publications || []), newPub];
    setCiv({ ...civ, publications: updatedCivPubs });

    // 3. Update author state and save
    const nextPubIds = Array.from(new Set([...(author.publicationIds || []), newPubId]));
    const updatedAuthor: Thinker = {
      ...author,
      publicationIds: nextPubIds,
    };
    setAuthor(updatedAuthor);
    await saveAuthor(civ.id, updatedAuthor);

    // Reset and close
    setNewPubData({
      title: "",
      year: String(new Date().getFullYear()),
      type: "Հոդված",
      pages: "",
      downloadUrl: "",
      fileName: "",
      fileSizeBytes: undefined,
      description: "",
      centerId: "",
    });
    setIsPubModalOpen(false);
  };

  // Save edited publication details
  const handleSaveEditedPublication = async (data: any) => {
    if (!editingPub) return;
    const updatedPub: Publication = {
      ...editingPub,
      title: data.title?.trim() || editingPub.title,
      type: data.type || editingPub.type,
      ...(data.year !== undefined ? (data.year ? { year: String(data.year).trim() } : { year: "" }) : (editingPub.year ? { year: editingPub.year } : {})),
      ...(data.pages !== undefined ? (data.pages ? { pages: Number(data.pages) } : {}) : (editingPub.pages ? { pages: editingPub.pages } : {})),
      ...(data.downloadUrl !== undefined ? (data.downloadUrl ? { downloadUrl: data.downloadUrl.trim() } : { downloadUrl: "" }) : (editingPub.downloadUrl ? { downloadUrl: editingPub.downloadUrl } : {})),
      ...(data.fileName !== undefined ? { fileName: data.fileName } : (editingPub.fileName ? { fileName: editingPub.fileName } : {})),
      ...(data.fileSizeBytes !== undefined ? { fileSizeBytes: data.fileSizeBytes } : (editingPub.fileSizeBytes ? { fileSizeBytes: editingPub.fileSizeBytes } : {})),
      ...(data.description !== undefined ? (data.description ? { description: data.description.trim() } : { description: "" }) : (editingPub.description ? { description: editingPub.description } : {})),
    };

    await savePublication(civ.id, updatedPub);
    const updatedCivPubs = (civ.publications || []).map((p) =>
      p.id === updatedPub.id ? updatedPub : p
    );
    setCiv({ ...civ, publications: updatedCivPubs });
    setEditingPub(null);
  };

  const handleToggleCenterAffiliation = async (targetCenter: ThinkTank) => {
    const isCurrentlyLinked =
      (targetCenter.authorIds || []).includes(author.id) ||
      (targetCenter.authors || []).some((a) => a.id === author.id);

    let nextAuthorIds: string[];
    let nextAuthors: Thinker[];

    if (isCurrentlyLinked) {
      nextAuthorIds = (targetCenter.authorIds || []).filter((id) => id !== author.id);
      nextAuthors = (targetCenter.authors || []).filter((a) => a.id !== author.id);
    } else {
      nextAuthorIds = Array.from(new Set([...(targetCenter.authorIds || []), author.id]));
      nextAuthors = [...(targetCenter.authors || []).filter((a) => a.id !== author.id), author];
    }

    const updatedCenter: ThinkTank = {
      ...targetCenter,
      authorIds: nextAuthorIds,
      authors: nextAuthors,
    };

    const updatedCivCenters = (civ.centers || []).map((c) =>
      c.id === targetCenter.id ? updatedCenter : c
    );
    setCiv({ ...civ, centers: updatedCivCenters });
    await saveCenter(civ.id, updatedCenter);
  };

  if (loading) {
    return <AuthorLoading />;
  }

  return (
    <main className="container" style={{ paddingBottom: "5rem", maxWidth: "1000px" }}>
      {/* Top Breadcrumb Nav */}
      <nav style={{ margin: "2rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <Link
          href={`/hubs/${civ.slug}`}
          className="back-link"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span>←</span> Դեպի {civ.nameHy}
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
          {isAdmin && (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                style={{
                  background: "rgba(183, 121, 31, 0.15)",
                  color: "var(--gold-accent)",
                  border: "1px solid var(--gold-accent)",
                  padding: "0.4rem 0.95rem",
                  borderRadius: "999px",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s ease",
                }}
              >
                <span>✏️</span>
                <span>Խմբագրել Պրոֆիլը</span>
              </button>

              <button
                type="button"
                onClick={toggleEditMode}
                style={{
                  background: isEditMode ? "var(--gold-accent)" : "rgba(255, 255, 255, 0.05)",
                  color: isEditMode ? "#ffffff" : "var(--text-secondary)",
                  border: "1px solid var(--card-border)",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "999px",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "all 0.2s ease",
                }}
                title="Խմբագրման ռեժիմի միացում"
              >
                <span>{isEditMode ? "✓" : "👁"}</span>
                <span>{isEditMode ? "Խմբագրումը՝ ԱԿՏԻՎ" : "Խմբագրման Ռեժիմ"}</span>
              </button>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>{civ.symbol}</span>
            <span style={{ fontSize: "0.9rem", color: "var(--gold-accent)", fontWeight: "600" }}>
              {civ.nameHy}
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div
        className="glass-card"
        style={{
          padding: "3.5rem 3rem",
          marginBottom: "3.5rem",
          borderLeft: "5px solid var(--gold-accent)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold-accent) 0%, rgba(183, 121, 31, 0.2) 100%)",
              border: "2px solid var(--gold-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.8rem",
              color: "#ffffff",
              fontFamily: "var(--font-serif)",
              boxShadow: "0 8px 25px rgba(183, 121, 31, 0.25)",
              flexShrink: 0,
            }}
          >
            {author.name ? author.name.charAt(0) : "M"}
          </div>

          <div style={{ flex: 1, minWidth: "260px" }}>
            <EditableText
              tag="h1"
              label="Հեղինակի Անուն"
              value={author.name}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                color: "var(--text-primary)",
                margin: "0 0 0.35rem 0",
                lineHeight: "1.2",
              }}
              onSave={(val) => handleSaveField("name", val)}
            />

            {author.nameOriginal && (
              <EditableText
                tag="h2"
                label="Բնօրինակ / Լատիներեն Անուն"
                value={author.nameOriginal}
                style={{
                  fontSize: "1.05rem",
                  color: "var(--gold-accent)",
                  letterSpacing: "0.05em",
                  margin: "0 0 0.8rem 0",
                  fontWeight: "500",
                }}
                onSave={(val) => handleSaveField("nameOriginal", val)}
              />
            )}

            <EditableText
              tag="p"
              label="Գիտական Կոչում / Դեր"
              value={author.title}
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                margin: "0 0 1.5rem 0",
              }}
              onSave={(val) => handleSaveField("title", val)}
            />
          </div>
        </div>

        {/* Famous Quote block */}
        {author.quote && (
          <div
            style={{
              marginTop: "2.5rem",
              background: "rgba(183, 121, 31, 0.08)",
              borderLeft: "3px solid var(--gold-accent)",
              padding: "1.5rem 2rem",
              borderRadius: "0.5rem",
              position: "relative",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "var(--gold-accent)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              ✧ Գաղափարական Պատգամ / Մեջբերում
            </div>
            <EditableText
              tag="blockquote"
              multiline
              label="Նշանավոր Մեջբերում"
              value={author.quote}
              style={{
                fontSize: "1.2rem",
                fontStyle: "italic",
                color: "var(--text-primary)",
                lineHeight: "1.7",
                margin: 0,
                fontFamily: "var(--font-serif)",
              }}
              onSave={(val) => handleSaveField("quote", val)}
            />
          </div>
        )}

        {/* Biography */}
        <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--card-border)", paddingTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", color: "var(--gold-accent)", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
            Կենսագրություն և Գիտական Նշանակություն
          </h3>
          <EditableText
            tag="p"
            multiline
            label="Կենսագրություն"
            value={author.bio}
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.85",
              color: "var(--text-secondary)",
              margin: 0,
            }}
            onSave={(val) => handleSaveField("bio", val)}
          />
        </div>
      </div>

      {/* Bibliography & Publications */}
      <section style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 0.25rem 0", fontSize: "1.8rem" }}>
              Գիտական Աշխատություններ և Հոդվածներ ({authorPublications.length})
            </h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              Հեղինակի գրքերը, մենագրությունները, վերլուծական հոդվածները և զեկույցները
            </p>
          </div>
          {(isEditMode || isAdmin) && (
            <button
              type="button"
              onClick={() => {
                setPubModalTab("select");
                setIsPubModalOpen(true);
              }}
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.55rem 1.15rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span>📚＋</span>
              <span>Կցել / Ավելացնել Աշխատություն</span>
            </button>
          )}
        </div>

        {authorPublications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 2rem",
              color: "var(--text-secondary)",
              background: "var(--card-bg)",
              borderRadius: "1rem",
              border: "1px dashed var(--card-border)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
            <p style={{ margin: "0 0 1rem 0" }}>Աշխատություններ կամ հոդվածներ դեռ ավելացված չեն:</p>
            {(isEditMode || isAdmin) && (
              <button
                type="button"
                onClick={() => {
                  setPubModalTab("select");
                  setIsPubModalOpen(true);
                }}
                className="btn-primary"
                style={{ fontSize: "0.85rem" }}
              >
                + Կցել Քաղաքակրթության Գրադարանից կամ Ստեղծել Նորը
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.2rem" }}>
            {authorPublications.map((pub, idx) => (
              <div
                key={pub.id || idx}
                className="glass-card"
                style={{
                  padding: "1.8rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.2rem",
                  position: "relative",
                }}
              >
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                    <span className="pub-tag-badge">📄 {pub.type || "Հոդված"}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--gold-accent)", fontWeight: "600" }}>
                      {pub.year && `${pub.year}թ.`}
                      {pub.pages && ` • ${pub.pages} էջ`}
                    </span>
                    {pub.downloadUrl && (
                      <span style={{ fontSize: "0.78rem", color: "#10b981", background: "rgba(16, 185, 129, 0.12)", padding: "0.15rem 0.5rem", borderRadius: "999px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                        ✓ Առցանց հասանելի
                      </span>
                    )}
                  </div>

                  <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--text-primary)", fontSize: "1.25rem", fontFamily: "var(--font-serif)" }}>
                    <Link href={`/publications/${pub.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {pub.title}
                    </Link>
                  </h3>

                  {pub.description && (
                    <p style={{ margin: "0 0 0.6rem 0", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                      {pub.description}
                    </p>
                  )}

                  {/* Attached Centers Tags */}
                  {pub.centerIds && pub.centerIds.length > 0 && (
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Կենտրոն՝</span>
                      {pub.centerIds.map((cId) => {
                        const centerObj = (civ.centers || []).find((c) => c.id === cId);
                        return (
                          <Link
                            key={cId}
                            href={`/centers/${cId}`}
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--gold-accent)",
                              background: "rgba(183, 121, 31, 0.1)",
                              padding: "0.15rem 0.55rem",
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

                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                  <Link
                    href={`/publications/${pub.id}`}
                    className="credo-action-btn"
                    style={{ padding: "0.5rem 0.9rem", fontSize: "0.85rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    📖 Բացել էջում
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedPublication(pub)}
                    className="credo-action-btn"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                  >
                    Մանրամասն
                  </button>

                  {pub.downloadUrl && (
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() =>
                          setViewingPdf({
                            url: pub.downloadUrl!,
                            title: pub.title,
                            authorName: author.name,
                            year: pub.year,
                            pages: pub.pages,
                            fileName: pub.fileName,
                            fileSizeBytes: pub.fileSizeBytes,
                          })
                        }
                        className="credo-action-btn"
                        style={{
                          padding: "0.5rem 0.85rem",
                          fontSize: "0.85rem",
                          background: "rgba(183, 121, 31, 0.15)",
                          color: "var(--gold-accent)",
                        }}
                      >
                        👁 Դիտել PDF
                      </button>
                      <a
                        href={pub.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={pub.fileName || `${pub.title}.pdf`}
                        className="credo-action-btn"
                        style={{ padding: "0.5rem 0.85rem", fontSize: "0.85rem", textDecoration: "none" }}
                        title="Ներբեռնել PDF"
                      >
                        ⬇️ Ներբեռնել
                      </a>
                    </div>
                  )}

                  {(isEditMode || isAdmin) && (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingPub(pub)}
                        style={{
                          background: "rgba(183, 121, 31, 0.15)",
                          border: "1px solid var(--gold-accent)",
                          color: "var(--gold-accent)",
                          padding: "0.5rem 0.85rem",
                          borderRadius: "0.4rem",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                        title="Խմբագրել աշխատությունը"
                      >
                        <span>✏️</span>
                        <span>Խմբագրել</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnlinkPublication(pub)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          color: "#ef4444",
                          padding: "0.5rem 0.8rem",
                          borderRadius: "0.4rem",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                        title="Անջատել այս հեղինակից"
                      >
                        🔗✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            {(isEditMode || isAdmin) && (
              <button
                type="button"
                onClick={() => {
                  setPubModalTab("select");
                  setIsPubModalOpen(true);
                }}
                style={{
                  width: "100%",
                  padding: "1.4rem",
                  borderRadius: "0.75rem",
                  border: "2px dashed var(--gold-accent)",
                  background: "rgba(183, 121, 31, 0.05)",
                  color: "var(--gold-accent)",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s ease",
                }}
              >
                <span>📚＋</span>
                <span>Կցել կամ ավելացնել աշխատություն այս հեղինակին</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Associated Centers from this Civilization */}
      {civ.centers && civ.centers.length > 0 && (
        <section style={{ marginTop: "4rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--gold-accent)",
              borderBottom: "1px solid var(--card-border)",
              paddingBottom: "1rem",
              marginBottom: "2rem",
              fontSize: "1.8rem",
            }}
          >
            Հարակից Ուղեղային Կենտրոններ ({civ.nameHy})
          </h2>

          <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {civ.centers.map((center) => {
              const isAffiliated =
                (center.authorIds || []).includes(author.id) ||
                (center.authors || []).some((a) => a.id === author.id);

              return (
                <div
                  key={center.id}
                  className="glass-card"
                  style={{
                    padding: "1.8rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderLeft: isAffiliated ? "4px solid var(--gold-accent)" : undefined,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ color: "var(--gold-accent)", fontSize: "0.85rem" }}>
                        📍 {center.city}, {center.country}
                      </div>
                      {isAffiliated && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            background: "rgba(183, 121, 31, 0.18)",
                            color: "var(--gold-accent)",
                            border: "1px solid var(--card-border)",
                            padding: "0.2rem 0.55rem",
                            borderRadius: "999px",
                          }}
                        >
                          🏛 Գիտաշխատող / Անդամ
                        </span>
                      )}
                    </div>
                    <h3 style={{ margin: "0 0 0.4rem 0", color: "var(--text-primary)", fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>
                      <Link href={`/centers/${center.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {center.name}
                      </Link>
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.92rem",
                        lineHeight: "1.6",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {center.description}
                    </p>
                  </div>

                  <div style={{ marginTop: "1.2rem", paddingTop: "0.8rem", borderTop: "1px solid var(--card-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                      <Link
                        href={`/centers/${center.id}`}
                        style={{ color: "var(--gold-accent)", fontSize: "0.85rem", fontWeight: "600", textDecoration: "none" }}
                      >
                        Դիտել կենտրոնի էջը →
                      </Link>

                      {(isEditMode || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleToggleCenterAffiliation(center)}
                          style={{
                            padding: "0.35rem 0.75rem",
                            borderRadius: "0.35rem",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            background: isAffiliated ? "rgba(239, 68, 68, 0.15)" : "var(--gold-accent)",
                            color: isAffiliated ? "#ef4444" : "#ffffff",
                            border: isAffiliated ? "1px solid rgba(239, 68, 68, 0.4)" : "none",
                          }}
                        >
                          {isAffiliated ? "✓ Կցված է (Անջատել)" : "＋ Կցել այս կենտրոնին"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Add / Link Publication Modal with Tabs */}
      {isPubModalOpen && (
        <div
          className="civ-modal-overlay"
          onClick={() => setIsPubModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="civ-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "680px", width: "95%" }}
          >
            <button
              type="button"
              className="civ-modal-close"
              onClick={() => setIsPubModalOpen(false)}
              aria-label="Փակել"
            >
              ✕
            </button>

            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 0.5rem 0", fontSize: "1.6rem" }}>
                Կցել կամ Ստեղծել Գիտական Աշխատություն
              </h2>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Հեղինակ՝ <strong style={{ color: "var(--text-primary)" }}>{author.name}</strong> ({civ.nameHy})
              </p>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--card-border)", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setPubModalTab("select")}
                style={{
                  background: pubModalTab === "select" ? "var(--gold-accent)" : "transparent",
                  color: pubModalTab === "select" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
              >
                📚 Ընտրել Քաղաքակրթության Գրադարանից ({civ.publications?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setPubModalTab("create")}
                style={{
                  background: pubModalTab === "create" ? "var(--gold-accent)" : "transparent",
                  color: pubModalTab === "create" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
              >
                ＋ Ստեղծել Նոր Աշխատություն
              </button>
            </div>

            {/* Tab 1: Select from Civilization Publications */}
            {pubModalTab === "select" && (
              <div>
                <div style={{ marginBottom: "1.2rem" }}>
                  <input
                    type="text"
                    placeholder="Որոնել աշխատությունը ըստ վերնագրի կամ տեսակի..."
                    value={pubSearchQuery}
                    onChange={(e) => setPubSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.65rem 1rem",
                      borderRadius: "0.5rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                    }}
                  />
                  <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--gold-accent)", opacity: 0.9 }}>
                    💡 Կարող եք կցել արդեն իսկ քաղաքակրթության գրադարանում առկա աշխատությունները:
                  </div>
                </div>

                <div style={{ display: "grid", gap: "0.8rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.3rem" }}>
                  {(!civ.publications || civ.publications.length === 0) ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                      Այս քաղաքակրթությունում դեռևս առանձին աշխատություններ չկան: Օգտվեք «Ստեղծել Նոր Աշխատություն» ներդիրից:
                    </div>
                  ) : (
                    civ.publications
                      .filter((p) =>
                        pubSearchQuery.trim() === ""
                          ? true
                          : p.title.toLowerCase().includes(pubSearchQuery.toLowerCase()) ||
                            (p.type && p.type.toLowerCase().includes(pubSearchQuery.toLowerCase()))
                      )
                      .map((pub) => {
                        const isLinked =
                          (pub.authorIds && pub.authorIds.includes(author.id)) ||
                          (author.publicationIds && pub.id && author.publicationIds.includes(pub.id));

                        return (
                          <div
                            key={pub.id || pub.title}
                            style={{
                              padding: "0.85rem 1rem",
                              borderRadius: "0.6rem",
                              background: isLinked ? "rgba(183, 121, 31, 0.12)" : "rgba(255, 255, 255, 0.03)",
                              border: isLinked ? "1px solid var(--gold-accent)" : "1px solid var(--card-border)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "1rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ flex: 1, minWidth: "220px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                                <span className="pub-tag-badge">📄 {pub.type || "Հոդված"}</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--gold-accent)", fontWeight: "600" }}>
                                  {pub.year && `${pub.year}թ.`}
                                </span>
                              </div>
                              <h4 style={{ margin: "0 0 0.2rem 0", color: "var(--text-primary)", fontSize: "0.95rem" }}>
                                {pub.title}
                              </h4>
                              {pub.description && (
                                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                  {pub.description}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleLinkPublication(pub)}
                              style={{
                                padding: "0.45rem 0.9rem",
                                borderRadius: "0.4rem",
                                fontSize: "0.82rem",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                background: isLinked ? "rgba(239, 68, 68, 0.15)" : "var(--gold-accent)",
                                color: isLinked ? "#ef4444" : "#ffffff",
                                border: isLinked ? "1px solid rgba(239, 68, 68, 0.4)" : "none",
                              }}
                            >
                              {isLinked ? "✓ Կցված է (Անջատել)" : "＋ Կցել Հեղինակին"}
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Create New Publication */}
            {pubModalTab === "create" && (
              <form onSubmit={handleCreateAndLinkPublication} style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Աշխատության Վերնագիր *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="օրինակ՝ Քաղաքակրթական Ինքնություն և Գոյաբանություն"
                    value={newPubData.title}
                    onChange={(e) => setNewPubData({ ...newPubData, title: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.5rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Տեսակ
                    </label>
                    <select
                      value={newPubData.type}
                      onChange={(e) => setNewPubData({ ...newPubData, type: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "0.5rem",
                        background: "var(--input-bg)",
                        border: "1px solid var(--card-border)",
                        color: "var(--text-primary)",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Հոդված">Հոդված</option>
                      <option value="Մենագրություն">Մենագրություն</option>
                      <option value="Զեկույց">Զեկույց</option>
                      <option value="PDF">PDF Փաստաթուղթ</option>
                      <option value="Գիրք">Գիրք</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Հրատարակման Տարեթիվ
                    </label>
                    <input
                      type="text"
                      placeholder="2026"
                      value={newPubData.year}
                      onChange={(e) => setNewPubData({ ...newPubData, year: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "0.5rem",
                        background: "var(--input-bg)",
                        border: "1px solid var(--card-border)",
                        color: "var(--text-primary)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Էջերի Քանակ (ընտրովի)
                    </label>
                    <input
                      type="number"
                      placeholder="65"
                      value={newPubData.pages}
                      onChange={(e) => setNewPubData({ ...newPubData, pages: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "0.5rem",
                        background: "var(--input-bg)",
                        border: "1px solid var(--card-border)",
                        color: "var(--text-primary)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                      Կից Ուղեղային Կենտրոն (ընտրովի)
                    </label>
                    <select
                      value={newPubData.centerId}
                      onChange={(e) => setNewPubData({ ...newPubData, centerId: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "0.5rem",
                        background: "var(--input-bg)",
                        border: "1px solid var(--card-border)",
                        color: "var(--text-primary)",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="">-- Առանց կոնկրետ կենտրոնի --</option>
                      {(civ.centers || []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Ամփոփագիր / Գիտական Թեզիսներ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Աշխատության հիմնական դրույթները, եզրակացությունները..."
                    value={newPubData.description}
                    onChange={(e) => setNewPubData({ ...newPubData, description: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.5rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <PdfUploadField
                  civId={civ.id}
                  downloadUrl={newPubData.downloadUrl}
                  fileName={newPubData.fileName}
                  fileSizeBytes={newPubData.fileSizeBytes}
                  label="PDF Փաստաթուղթ (Storage / URL)"
                  onChange={(res) => {
                    setNewPubData({
                      ...newPubData,
                      downloadUrl: res.downloadUrl,
                      fileName: res.fileName || "",
                      fileSizeBytes: res.fileSizeBytes,
                    });
                  }}
                />

                <div style={{ background: "rgba(183, 121, 31, 0.08)", padding: "0.85rem 1rem", borderRadius: "0.5rem", borderLeft: "3px solid var(--gold-accent)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  ✓ Այս աշխատությունն ավտոմատ կավելացվի <strong>«{civ.nameHy}»</strong> քաղաքակրթության գրադարանում և կկցվի <strong>«{author.name}»</strong> հեղինակին:
                </div>

                <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="credo-action-btn"
                    onClick={() => setIsPubModalOpen(false)}
                  >
                    Չեղարկել
                  </button>
                  <button type="submit" className="btn-primary">
                    <span>Ստեղծել և Կցել Հեղինակին</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Publication Details Modal */}
      {editingPub && (
        <EditCardModal
          title={`Խմբագրել Աշխատությունը՝ ${editingPub.title}`}
          initialData={{
            title: editingPub.title || "",
            year: editingPub.year || "",
            type: editingPub.type || "Հոդված",
            pages: editingPub.pages || "",
            downloadUrl: editingPub.downloadUrl || "",
            fileName: editingPub.fileName || "",
            fileSizeBytes: editingPub.fileSizeBytes,
            description: editingPub.description || "",
          }}
          civId={civ.id}
          fields={[
            { key: "title", label: "Աշխատության Վերնագիր", placeholder: "Վերնագիր" },
            { key: "type", label: "Տեսակ (Հոդված / Մենագրություն / Զեկույց / PDF)", placeholder: "Հոդված" },
            { key: "year", label: "Հրատարակման Տարեթիվ", placeholder: "2026" },
            { key: "pages", label: "Էջերի Քանակ", placeholder: "60" },
            { key: "description", label: "Ամփոփագիր", type: "textarea", placeholder: "Հիմնական դրույթները..." },
            { key: "downloadUrl", label: "PDF Փաստաթուղթ (Storage / URL)", type: "pdf" },
          ]}
          onSave={handleSaveEditedPublication}
          onClose={() => setEditingPub(null)}
        />
      )}

      {/* Publication Preview Modal */}
      {selectedPublication && (
        <div
          className="civ-modal-overlay"
          onClick={() => setSelectedPublication(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="civ-modal-box" onClick={(e) => e.stopPropagation()}>
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
              <span>{selectedPublication.type} • {selectedPublication.year || "Հրատարակված"}</span>
            </div>

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", color: "var(--text-primary)", margin: "0 0 0.5rem 0", lineHeight: "1.3" }}>
              {selectedPublication.title}
            </h2>

            <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Հեղինակ՝ <strong style={{ color: "var(--gold-accent)" }}>{author.name}</strong>
              {selectedPublication.pages && ` (${selectedPublication.pages} էջ)`}
            </div>

            <div style={{ background: "var(--input-bg)", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid var(--card-border)", marginBottom: "2rem" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                Ամփոփագիր և Գիտական Նկարագիր
              </h4>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "0.95rem" }}>
                {selectedPublication.description ||
                  "Այս աշխատությունը ներկայացնում է քաղաքակրթական հիմնարար դոկտրինը, գիտական հետազոտությունները և արդի փիլիսոփայական հայեցակարգերը։"}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                className="credo-action-btn"
                onClick={() => setSelectedPublication(null)}
              >
                Փակել
              </button>
              {selectedPublication.downloadUrl ? (
                <>
                  <button
                    type="button"
                    className="credo-action-btn"
                    onClick={() => {
                      const p = selectedPublication;
                      setSelectedPublication(null);
                      setViewingPdf({
                        url: p.downloadUrl!,
                        title: p.title,
                        authorName: author.name,
                        year: p.year,
                        pages: p.pages,
                        fileName: p.fileName,
                        fileSizeBytes: p.fileSizeBytes,
                      });
                    }}
                    style={{ padding: "0.55rem 1.1rem", fontSize: "0.88rem" }}
                  >
                    👁 Դիտել PDF-ը
                  </button>
                  <a
                    href={selectedPublication.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={selectedPublication.fileName || `${selectedPublication.title}.pdf`}
                    className="btn-primary"
                    style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <span>⬇️ Ներբեռնել PDF</span>
                  </a>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    alert(`«${selectedPublication.title}» աշխատության թվային տարբերակը պատրաստվում է ներբեռնման (Արարատյան Գրադարան)։`);
                  }}
                >
                  <span>Ներբեռնել PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Author Profile Modal */}
      {isEditingProfile && (
        <EditCardModal
          title={`Խմբագրել Հեղինակի Պրոֆիլը՝ ${author.name}`}
          initialData={{
            name: author.name || "",
            nameOriginal: author.nameOriginal || "",
            title: author.title || "",
            quote: author.quote || "",
            bio: author.bio || "",
          }}
          fields={[
            { key: "name", label: "Հեղինակի Անուն", placeholder: "օրինակ՝ Հայկ Նահապետ" },
            { key: "nameOriginal", label: "Բնօրինակ / Լատիներեն Անուն (ընտրովի)", placeholder: "Hayk Nahapet" },
            { key: "title", label: "Գիտական Կոչում / Դեր", placeholder: "Փիլիսոփա, Հիմնադիր" },
            { key: "quote", label: "Հիմնական Քաղվածք", type: "textarea", placeholder: "Մեջբերում..." },
            { key: "bio", label: "Կենսագրություն / Մանրամասն Նկարագիր", type: "textarea", placeholder: "Հեղինակի կենսագրությունը..." },
          ]}
          onSave={async (data) => {
            const updated: Thinker = {
              ...author,
              name: data.name.trim(),
              title: data.title.trim(),
              bio: data.bio.trim(),
              ...(data.nameOriginal?.trim() ? { nameOriginal: data.nameOriginal.trim() } : { nameOriginal: "" }),
              ...(data.quote?.trim() ? { quote: data.quote.trim() } : { quote: "" }),
            };
            setAuthor(updated);
            await saveAuthor(civ.id, updated);
          }}
          onClose={() => setIsEditingProfile(false)}
        />
      )}

      {/* PDF Full-Screen Viewer Modal */}
      {viewingPdf && (
        <PdfViewerModal
          url={viewingPdf.url}
          title={viewingPdf.title}
          authorName={viewingPdf.authorName}
          year={viewingPdf.year}
          pages={viewingPdf.pages}
          fileName={viewingPdf.fileName}
          fileSizeBytes={viewingPdf.fileSizeBytes}
          onClose={() => setViewingPdf(null)}
        />
      )}
    </main>
  );
}
