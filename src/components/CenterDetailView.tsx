"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Civilization, ThinkTank, Publication, Thinker } from "@/lib/civilizationsData";
import { useAuth } from "@/context/AuthContext";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import EditCardModal from "@/components/cms/EditCardModal";
import { getCenterContent } from "@/lib/contentService";
import CenterLoading from "@/app/centers/[id]/loading";
import { MemberAvatar } from "@/components/ui/MemberCard";
import { AutoTruncateQuote } from "@/components/ui/AutoTruncateQuote";
import PdfViewerModal from "@/components/publications/PdfViewerModal";
import PdfUploadField from "@/components/publications/PdfUploadField";

interface Props {
  initialCenter: ThinkTank;
  initialCiv: Civilization;
}

export default function CenterDetailView({ initialCenter, initialCiv }: Props) {
  const [center, setCenter] = useState<ThinkTank>(initialCenter);
  const [civ, setCiv] = useState<Civilization>(initialCiv);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { isEditMode, toggleEditMode, saveCenter, saveAuthor, savePublication, deletePublication } = useEditMode();

  // Publications state
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [pubModalTab, setPubModalTab] = useState<"select" | "create">("select");
  const [pubSearchQuery, setPubSearchQuery] = useState("");
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [isEditingCenterProfile, setIsEditingCenterProfile] = useState(false);
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
    type: "Զեկույց",
    pages: "",
    downloadUrl: "",
    fileName: "",
    fileSizeBytes: undefined as number | undefined,
    description: "",
    authorId: "",
  });

  // Author Linking & Creation Modal state
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [authorModalTab, setAuthorModalTab] = useState<"select" | "create">("select");
  const [authorSearchQuery, setAuthorSearchQuery] = useState("");
  const [editingAuthor, setEditingAuthor] = useState<Thinker | null>(null);

  // New Author form state
  const [newAuthorData, setNewAuthorData] = useState({
    name: "",
    nameOriginal: "",
    title: "Կենտրոնի Փորձագետ / Հետազոտող",
    quote: "",
    bio: "",
  });

  useEffect(() => {
    let isMounted = true;
    getCenterContent(initialCenter.id)
      .then((res) => {
        if (isMounted) {
          if (res) {
            setCenter(res.center);
            setCiv(res.civ);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading center:", err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [initialCenter.id]);

  const handleSaveField = async (field: keyof ThinkTank, val: any) => {
    const updated = { ...center, [field]: val };
    setCenter(updated);
    await saveCenter(civ.id, updated);
  };

  // Compute resolved publications associated with this center:
  const centerPublications: Publication[] = (() => {
    const list: Publication[] = [];
    const seen = new Set<string>();

    // 1. From civ.publications (subcollection):
    if (civ.publications && Array.isArray(civ.publications)) {
      for (const p of civ.publications) {
        const isLinked =
          (p.centerIds && p.centerIds.includes(center.id)) ||
          (center.publicationIds && p.id && center.publicationIds.includes(p.id));
        if (isLinked) {
          const key = p.id || p.title;
          if (!seen.has(key)) {
            list.push(p);
            seen.add(key);
          }
        }
      }
    }

    // 2. From center.publications (local/direct entries):
    if (center.publications && Array.isArray(center.publications)) {
      for (const p of center.publications) {
        const key = p.id || p.title;
        if (!seen.has(key)) {
          list.push(p);
          seen.add(key);
        }
      }
    }

    return list;
  })();

  // Toggle link between a publication and this center
  const handleToggleLinkPublication = async (pub: Publication) => {
    const isCurrentlyLinked =
      (pub.centerIds && pub.centerIds.includes(center.id)) ||
      (center.publicationIds && pub.id && center.publicationIds.includes(pub.id)) ||
      (center.publications || []).some((p) => (p.id && p.id === pub.id) || p.title === pub.title);

    let nextCenterIds: string[];
    let nextPublicationIds: string[];

    if (isCurrentlyLinked) {
      nextCenterIds = (pub.centerIds || []).filter((id) => id !== center.id);
      nextPublicationIds = (center.publicationIds || []).filter((id) => id !== pub.id);
    } else {
      nextCenterIds = Array.from(new Set([...(pub.centerIds || []), center.id]));
      nextPublicationIds = pub.id
        ? Array.from(new Set([...(center.publicationIds || []), pub.id]))
        : (center.publicationIds || []);
    }

    const updatedPub: Publication = {
      ...pub,
      centerIds: nextCenterIds,
    };

    // Update in civ.publications
    const updatedCivPubs = (civ.publications || []).map((p) =>
      p.id === pub.id ? updatedPub : p
    );
    setCiv({ ...civ, publications: updatedCivPubs });
    await savePublication(civ.id, updatedPub);

    // Update center
    const updatedCenter: ThinkTank = {
      ...center,
      publicationIds: nextPublicationIds,
      publications: (center.publications || []).filter((p) => p.title !== pub.title),
    };
    setCenter(updatedCenter);
    await saveCenter(civ.id, updatedCenter);
  };

  // Unlink publication directly from card
  const handleUnlinkPublication = async (pub: Publication) => {
    if (
      !confirm(
        `Իսկապե՞ս ցանկանում եք անջատել «${pub.title}» աշխատությունը այս կենտրոնից:\n(Աշխատությունը կպահպանվի քաղաքակրթության գրադարանում):`
      )
    )
      return;
    await handleToggleLinkPublication(pub);
  };

  // Create brand new publication: saves to civ.publications AND links to this center!
  const handleCreateAndLinkPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubData.title.trim()) {
      alert("Խնդրում ենք լրացնել աշխատության վերնագիրը:");
      return;
    }

    const newPubId = `pub-${Date.now()}`;
    const authorIds = newPubData.authorId ? [newPubData.authorId] : [];

    const newPub: Publication = {
      id: newPubId,
      civId: civ.id,
      title: newPubData.title.trim(),
      type: newPubData.type || "Զեկույց",
      centerIds: [center.id],
      authorIds,
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

    // 3. Update center state and save
    const nextPubIds = Array.from(new Set([...(center.publicationIds || []), newPubId]));
    const updatedCenter: ThinkTank = {
      ...center,
      publicationIds: nextPubIds,
    };
    setCenter(updatedCenter);
    await saveCenter(civ.id, updatedCenter);

    // Reset and close
    setNewPubData({
      title: "",
      year: String(new Date().getFullYear()),
      type: "Զեկույց",
      pages: "",
      downloadUrl: "",
      fileName: "",
      fileSizeBytes: undefined,
      description: "",
      authorId: "",
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

  // Compute resolved authors associated with this center:
  const centerAuthors: Thinker[] = (() => {
    const list: Thinker[] = [];
    const seen = new Set<string>();

    // 1. Authors linked via center.authorIds from civ.authors
    if (center.authorIds && Array.isArray(center.authorIds)) {
      for (const id of center.authorIds) {
        const found = civ.authors?.find((a) => a.id.toLowerCase() === id.toLowerCase());
        if (found && !seen.has(found.id)) {
          list.push(found);
          seen.add(found.id);
        }
      }
    }

    // 2. Authors directly stored in center.authors (for legacy or direct entries)
    if (center.authors && Array.isArray(center.authors)) {
      for (const a of center.authors) {
        if (!seen.has(a.id)) {
          list.push(a);
          seen.add(a.id);
        }
      }
    }

    return list;
  })();

  // Toggle link between an author and this center
  const handleToggleLinkAuthor = async (author: Thinker) => {
    const isCurrentlyLinked = (center.authorIds || []).includes(author.id) ||
      (center.authors || []).some((a) => a.id === author.id);

    let nextAuthorIds: string[];
    let nextAuthors: Thinker[];

    if (isCurrentlyLinked) {
      // Unlink
      nextAuthorIds = (center.authorIds || []).filter((id) => id !== author.id);
      nextAuthors = (center.authors || []).filter((a) => a.id !== author.id);
    } else {
      // Link
      nextAuthorIds = Array.from(new Set([...(center.authorIds || []), author.id]));
      nextAuthors = (center.authors || []).filter((a) => a.id !== author.id);
      nextAuthors.push(author);
    }

    const updatedCenter: ThinkTank = {
      ...center,
      authorIds: nextAuthorIds,
      authors: nextAuthors,
    };

    setCenter(updatedCenter);
    await saveCenter(civ.id, updatedCenter);
  };

  // Unlink an author directly from the center card
  const handleUnlinkAuthor = async (authorId: string, authorName: string) => {
    if (
      !confirm(
        `Իսկապե՞ս ցանկանում եք անջատել «${authorName}» հեղինակին այս կենտրոնից:\n(Հեղինակը կպահպանվի քաղաքակրթության հեղինակների ցանկում):`
      )
    )
      return;

    const nextAuthorIds = (center.authorIds || []).filter((id) => id !== authorId);
    const nextAuthors = (center.authors || []).filter((a) => a.id !== authorId);

    const updatedCenter: ThinkTank = {
      ...center,
      authorIds: nextAuthorIds,
      authors: nextAuthors,
    };

    setCenter(updatedCenter);
    await saveCenter(civ.id, updatedCenter);
  };

  // Create brand new author: automatically adds to civ.authors AND links to this center!
  const handleCreateAndLinkAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorData.name.trim()) {
      alert("Խնդրում ենք լրացնել հեղինակի անունը:");
      return;
    }

    const newAuthorId = newAuthorData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `author-${Date.now()}`;

    const newAuthor: Thinker = {
      id: newAuthorId,
      name: newAuthorData.name.trim(),
      title: newAuthorData.title.trim() || "Կենտրոնի Փորձագետ / Հետազոտող",
      bio: newAuthorData.bio.trim() || "",
      publications: [],
      ...(newAuthorData.nameOriginal.trim() ? { nameOriginal: newAuthorData.nameOriginal.trim() } : {}),
      ...(newAuthorData.quote.trim() ? { quote: newAuthorData.quote.trim() } : {}),
    };

    // 1. Save author into Civilization Authors pool:
    await saveAuthor(civ.id, newAuthor);

    // 2. Update local civ.authors state:
    const updatedCivAuthors = [...(civ.authors || []), newAuthor];
    setCiv({ ...civ, authors: updatedCivAuthors });

    // 3. Link this author to the current center:
    const nextAuthorIds = Array.from(new Set([...(center.authorIds || []), newAuthor.id]));
    const nextAuthors = [...(center.authors || []).filter((a) => a.id !== newAuthor.id), newAuthor];

    const updatedCenter: ThinkTank = {
      ...center,
      authorIds: nextAuthorIds,
      authors: nextAuthors,
    };

    setCenter(updatedCenter);
    await saveCenter(civ.id, updatedCenter);

    // Reset form and close modal
    setNewAuthorData({
      name: "",
      nameOriginal: "",
      title: "Կենտրոնի Փորձագետ / Հետազոտող",
      quote: "",
      bio: "",
    });
    setIsAuthorModalOpen(false);
  };

  // Edit existing author details
  const handleSaveEditedAuthor = async (data: any) => {
    if (!editingAuthor) return;

    const updatedAuthor: Thinker = {
      ...editingAuthor,
      name: data.name?.trim() || editingAuthor.name,
      nameOriginal: data.nameOriginal ? data.nameOriginal.trim() : "",
      title: data.title?.trim() || editingAuthor.title,
      bio: data.bio ? data.bio.trim() : "",
      quote: data.quote ? data.quote.trim() : "",
    };

    // 1. Update in civilization authors
    await saveAuthor(civ.id, updatedAuthor);

    // 2. Update in civ.authors state
    const updatedCivAuthors = (civ.authors || []).map((a) =>
      a.id === updatedAuthor.id ? updatedAuthor : a
    );
    setCiv({ ...civ, authors: updatedCivAuthors });

    // 3. Update in center.authors if present
    const updatedCenterAuthors = (center.authors || []).map((a) =>
      a.id === updatedAuthor.id ? updatedAuthor : a
    );
    const updatedCenter = { ...center, authors: updatedCenterAuthors };
    setCenter(updatedCenter);
    await saveCenter(civ.id, updatedCenter);

    setEditingAuthor(null);
  };

  if (loading) {
    return <CenterLoading />;
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
                onClick={() => setIsEditingCenterProfile(true)}
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
                <span>Խմբագրել Կենտրոնը</span>
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

      {/* Main Hero Card for Center */}
      <div
        className="glass-card"
        style={{
          padding: "3.5rem 3rem",
          marginBottom: "3.5rem",
          borderLeft: "5px solid var(--gold-accent)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "1.4rem" }}>📍</span>
          <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            <EditableText
              tag="span"
              label="Քաղաք"
              value={center.city}
              onSave={(val) => handleSaveField("city", val)}
            />
            <span>,</span>
            <EditableText
              tag="span"
              label="Երկիր"
              value={center.country}
              onSave={(val) => handleSaveField("country", val)}
            />
            {center.foundedYear && (
              <>
                <span style={{ margin: "0 0.3rem" }}>•</span>
                <span>հիմնադրված</span>
                <EditableText
                  tag="span"
                  label="Հիմնադրման տարեթիվ"
                  value={center.foundedYear}
                  onSave={(val) => handleSaveField("foundedYear", val)}
                />
                <span>թ.</span>
              </>
            )}
          </div>
        </div>

        <EditableText
          tag="h1"
          label="Կենտրոնի Անվանում (Հայերեն)"
          value={center.name}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            color: "var(--text-primary)",
            margin: "0 0 0.5rem 0",
            lineHeight: "1.2",
          }}
          onSave={(val) => handleSaveField("name", val)}
        />

        {center.originalName && (
          <EditableText
            tag="h2"
            label="Բնօրինակ / Անգլերեն Անվանում"
            value={center.originalName}
            style={{
              fontSize: "1.1rem",
              color: "var(--gold-accent)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              margin: "0 0 2rem 0",
              fontWeight: "500",
            }}
            onSave={(val) => handleSaveField("originalName", val)}
          />
        )}

        <div style={{ marginTop: "2rem", borderTop: "1px solid var(--card-border)", paddingTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", color: "var(--gold-accent)", marginBottom: "1rem", fontFamily: "var(--font-serif)" }}>
            Գիտահետազոտական Առաքելություն և Գործունեություն
          </h3>
          <EditableText
            tag="p"
            multiline
            label="Առաքելության նկարագրություն"
            value={center.description}
            style={{
              fontSize: "1.15rem",
              lineHeight: "1.85",
              color: "var(--text-secondary)",
              margin: 0,
            }}
            onSave={(val) => handleSaveField("description", val)}
          />
        </div>

        {/* Focus Areas Tags */}
        {center.focusAreas && center.focusAreas.length > 0 && (
          <div style={{ marginTop: "2.5rem" }}>
            <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Հետազոտական Ուղղություններ
            </h4>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {center.focusAreas.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "0.4rem 0.9rem",
                    borderRadius: "999px",
                    background: "rgba(183, 121, 31, 0.12)",
                    color: "var(--gold-accent)",
                    border: "1px solid var(--card-border)",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Website link */}
        {center.website && (
          <div style={{ marginTop: "2.5rem" }}>
            <a
              href={center.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
            >
              <span>Այցելել Պաշտոնական Կայք</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>

      {/* Section 1: Center's Scientific Works & Research Reports */}
      <section style={{ marginTop: "4rem", marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 0.25rem 0", fontSize: "1.8rem" }}>
              Գիտական Աշխատություններ և Զեկույցներ ({centerPublications.length})
            </h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              Կենտրոնի հետազոտական հրապարակումները, քաղաքականության զեկույցները և մենագրությունները
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

        {centerPublications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              color: "var(--text-secondary)",
              background: "var(--card-bg)",
              borderRadius: "1rem",
              border: "1px dashed var(--card-border)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
            <p style={{ margin: "0 0 1rem 0" }}>Այս կենտրոնի համար գիտական աշխատություններ դեռ ավելացված չեն:</p>
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
            {centerPublications.map((pub, idx) => (
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
                    <span className="pub-tag-badge">📄 {pub.type || "Զեկույց"}</span>
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
                  <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--text-primary)", fontSize: "1.2rem", fontFamily: "var(--font-serif)" }}>
                    <Link href={`/publications/${pub.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {pub.title}
                    </Link>
                  </h3>
                  {pub.description && (
                    <p style={{ margin: "0 0 0.6rem 0", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                      {pub.description}
                    </p>
                  )}

                  {/* Attached Authors Tags */}
                  {pub.authorIds && pub.authorIds.length > 0 && (
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Հեղինակ՝</span>
                      {pub.authorIds.map((aId) => {
                        const authorObj = (civ.authors || []).find((a) => a.id === aId);
                        return (
                          <Link
                            key={aId}
                            href={`/authors/${aId}`}
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
                            <span>🖋</span>
                            <span>{authorObj?.name || aId}</span>
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
                            authorName: center.name,
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
                        title="Անջատել այս կենտրոնից"
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
                <span>Կցել կամ ավելացնել աշխատություն այս կենտրոնին</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Section 2: Center's Authors & Scholars (Linked from Civilization) */}
      <section style={{ marginTop: "4rem", marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 0.25rem 0", fontSize: "1.8rem" }}>
              Կենտրոնի Գիտաշխատողներ և Հեղինակներ ({centerAuthors.length})
            </h2>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              Կենտրոնի առաջատար հետազոտողները, վերլուծաբանները և գիտական մտածողները
            </p>
          </div>
          {(isEditMode || isAdmin) && (
            <button
              type="button"
              onClick={() => {
                setAuthorModalTab("select");
                setIsAuthorModalOpen(true);
              }}
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.55rem 1.15rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span>👥＋</span>
              <span>Կցել / Ավելացնել Հեղինակ</span>
            </button>
          )}
        </div>

        {centerAuthors.length === 0 ? (
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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🖋</div>
            <p style={{ margin: "0 0 1rem 0" }}>Այս կենտրոնին դեռևս կցված չեն գիտաշխատողներ կամ հեղինակներ:</p>
            {(isEditMode || isAdmin) && (
              <button
                type="button"
                onClick={() => {
                  setAuthorModalTab("select");
                  setIsAuthorModalOpen(true);
                }}
                className="btn-primary"
                style={{ fontSize: "0.85rem" }}
              >
                + Կցել Քաղաքակրթության Հեղինակներից կամ Ստեղծել Նորը
              </button>
            )}
          </div>
        ) : (
          <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {centerAuthors.map((author) => (
              <div
                key={author.id}
                className="glass-card"
                style={{
                  padding: "1.8rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                {(isEditMode || isAdmin) && (
                  <div style={{ position: "absolute", top: "0.8rem", right: "0.8rem", display: "flex", gap: "0.4rem", zIndex: 10 }}>
                    <button
                      type="button"
                      onClick={() => setEditingAuthor(author)}
                      style={{
                        background: "rgba(183, 121, 31, 0.15)",
                        border: "1px solid var(--gold-accent)",
                        color: "var(--gold-accent)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.35rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                      title="Խմբագրել հեղինակի տվյալները"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnlinkAuthor(author.id, author.name)}
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#ef4444",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.35rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                      title="Անջատել հեղինակին այս կենտրոնից"
                    >
                      🔗✕
                    </button>
                  </div>
                )}

                <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <MemberAvatar name={author.name} size={54} glow />
                    <div>
                      <h3 style={{ margin: "0 0 0.2rem 0", color: "var(--text-primary)", fontSize: "1.15rem" }}>
                        {author.name}
                      </h3>
                      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {author.title}
                      </p>
                    </div>
                  </div>
                  {author.quote && (
                    <AutoTruncateQuote
                      quote={author.quote}
                      containerStyle={{
                        margin: "0 0 0.8rem 0",
                        padding: "0.6rem 0.9rem",
                        background: "rgba(183, 121, 31, 0.08)",
                        borderLeft: "2px solid var(--gold-accent)",
                        borderRadius: "0.25rem",
                      }}
                      textStyle={{
                        fontSize: "0.85rem",
                        fontStyle: "italic",
                        color: "var(--text-primary)",
                      }}
                      lineHeightPx={20}
                    />
                  )}
                  {author.bio && (
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
                      {author.bio}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: "1.2rem", paddingTop: "0.8rem", borderTop: "1px solid var(--card-border)" }}>
                  <Link
                    href={`/authors/${author.id}`}
                    style={{
                      color: "var(--gold-accent)",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <span>Դիտել հեղինակի պրոֆիլը</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}

            {(isEditMode || isAdmin) && (
              <button
                type="button"
                onClick={() => {
                  setAuthorModalTab("select");
                  setIsAuthorModalOpen(true);
                }}
                style={{
                  border: "2px dashed var(--gold-accent)",
                  borderRadius: "1rem",
                  padding: "2rem",
                  background: "rgba(183, 121, 31, 0.04)",
                  color: "var(--gold-accent)",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.95rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  minHeight: "200px",
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>👥＋</span>
                <span>Կցել կամ ստեղծել հեղինակ</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Section 3: Associated Civilization Thinkers */}
      {civ.authors && civ.authors.length > 0 && (
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
            Հարակից Մտածողներ ({civ.nameHy})
          </h2>

          <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {civ.authors.map((author) => (
              <Link
                key={author.id}
                href={`/authors/${author.id}`}
                className="glass-card"
                style={{
                  padding: "1.8rem",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <MemberAvatar name={author.name} size={54} glow />
                    <div>
                      <h3 style={{ margin: "0 0 0.2rem 0", color: "var(--text-primary)", fontSize: "1.15rem" }}>
                        {author.name}
                      </h3>
                      <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        {author.title}
                      </p>
                    </div>
                  </div>
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
                    {author.bio}
                  </p>
                </div>
                <div style={{ marginTop: "1.2rem", paddingTop: "0.8rem", borderTop: "1px solid var(--card-border)", color: "var(--gold-accent)", fontSize: "0.85rem", fontWeight: "600" }}>
                  Դիտել հեղինակի էջը →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Add / Link Author Modal with Tabs */}
      {isAuthorModalOpen && (
        <div
          className="civ-modal-overlay"
          onClick={() => setIsAuthorModalOpen(false)}
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
              onClick={() => setIsAuthorModalOpen(false)}
              aria-label="Փակել"
            >
              ✕
            </button>

            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 0.5rem 0", fontSize: "1.6rem" }}>
                Կցել կամ Ստեղծել Հեղինակ
              </h2>
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Կենտրոն՝ <strong style={{ color: "var(--text-primary)" }}>{center.name}</strong> ({civ.nameHy})
              </p>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--card-border)", marginBottom: "1.5rem", paddingBottom: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setAuthorModalTab("select")}
                style={{
                  background: authorModalTab === "select" ? "var(--gold-accent)" : "transparent",
                  color: authorModalTab === "select" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
              >
                👥 Ընտրել Քաղաքակրթության Հեղինակներից ({civ.authors?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setAuthorModalTab("create")}
                style={{
                  background: authorModalTab === "create" ? "var(--gold-accent)" : "transparent",
                  color: authorModalTab === "create" ? "#ffffff" : "var(--text-secondary)",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
              >
                ＋ Ստեղծել Նոր Հեղինակ
              </button>
            </div>

            {/* Tab 1: Select from Civilization Authors */}
            {authorModalTab === "select" && (
              <div>
                <div style={{ marginBottom: "1.2rem" }}>
                  <input
                    type="text"
                    placeholder="Որոնել հեղինակին ըստ անվան..."
                    value={authorSearchQuery}
                    onChange={(e) => setAuthorSearchQuery(e.target.value)}
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
                    💡 Մեկ հեղինակը կարող է միաժամանակ կցված լինել մի քանի տարբեր կենտրոնների:
                  </div>
                </div>

                <div style={{ display: "grid", gap: "0.8rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.3rem" }}>
                  {(!civ.authors || civ.authors.length === 0) ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                      Այս քաղաքակրթությունում դեռևս հեղինակներ չկան: Օգտվեք «Ստեղծել Նոր Հեղինակ» ներդիրից:
                    </div>
                  ) : (
                    civ.authors
                      .filter((a) =>
                        authorSearchQuery.trim() === ""
                          ? true
                          : a.name.toLowerCase().includes(authorSearchQuery.toLowerCase()) ||
                            (a.title && a.title.toLowerCase().includes(authorSearchQuery.toLowerCase()))
                      )
                      .map((author) => {
                        const isLinked = (center.authorIds || []).includes(author.id) ||
                          (center.authors || []).some((ca) => ca.id === author.id);

                        return (
                          <div
                            key={author.id}
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
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flex: 1, minWidth: "220px" }}>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "var(--gold-accent)",
                                  color: "#ffffff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "700",
                                  fontSize: "1rem",
                                  flexShrink: 0,
                                }}
                              >
                                {author.name ? author.name.charAt(0) : "M"}
                              </div>
                              <div>
                                <h4 style={{ margin: "0 0 0.2rem 0", color: "var(--text-primary)", fontSize: "0.95rem" }}>
                                  {author.name}
                                </h4>
                                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                                  {author.title}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleLinkAuthor(author)}
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
                              {isLinked ? "✓ Կցված է (Անջատել)" : "＋ Կցել Կենտրոնին"}
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Create New Author */}
            {authorModalTab === "create" && (
              <form onSubmit={handleCreateAndLinkAuthor} style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Հեղինակի Անուն Ազգանուն *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="օրինակ՝ Դոկտոր Արմեն Սարգսյան"
                    value={newAuthorData.name}
                    onChange={(e) => setNewAuthorData({ ...newAuthorData, name: e.target.value })}
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
                    Բնօրինակ / Լատիներեն Անուն (ընտրովի)
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Armen Sargsyan"
                    value={newAuthorData.nameOriginal}
                    onChange={(e) => setNewAuthorData({ ...newAuthorData, nameOriginal: e.target.value })}
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
                    Գիտական Կոչում / Դեր կենտրոնում
                  </label>
                  <input
                    type="text"
                    placeholder="Տնօրեն, Ավագ Վերլուծաբան"
                    value={newAuthorData.title}
                    onChange={(e) => setNewAuthorData({ ...newAuthorData, title: e.target.value })}
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
                    Մեջբերում / Գիտական Կրեդո (ընտրովի)
                  </label>
                  <input
                    type="text"
                    placeholder="«Գիտելիքը լույս է, որը ցրում է անտարբերության խավարը...»"
                    value={newAuthorData.quote}
                    onChange={(e) => setNewAuthorData({ ...newAuthorData, quote: e.target.value })}
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
                    Կենսագրություն և Գիտական Գործունեություն
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Հեղինակի գիտական հետազոտությունները, ներդրումը և ուղղությունները..."
                    value={newAuthorData.bio}
                    onChange={(e) => setNewAuthorData({ ...newAuthorData, bio: e.target.value })}
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

                <div style={{ background: "rgba(183, 121, 31, 0.08)", padding: "0.85rem 1rem", borderRadius: "0.5rem", borderLeft: "3px solid var(--gold-accent)", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  ✓ Այս հեղինակն ավտոմատ կավելացվի <strong>«{civ.nameHy}»</strong> քաղաքակրթության հեղինակների ընդհանուր ցանկում և կկցվի <strong>«{center.name}»</strong> կենտրոնին:
                </div>

                <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    className="credo-action-btn"
                    onClick={() => setIsAuthorModalOpen(false)}
                  >
                    Չեղարկել
                  </button>
                  <button type="submit" className="btn-primary">
                    <span>Ստեղծել և Կցել Կենտրոնին</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Author Modal */}
      {editingAuthor && (
        <EditCardModal
          title={`Խմբագրել Հեղինակի Տվյալները՝ ${editingAuthor.name}`}
          initialData={{
            name: editingAuthor.name || "",
            nameOriginal: editingAuthor.nameOriginal || "",
            title: editingAuthor.title || "",
            quote: editingAuthor.quote || "",
            bio: editingAuthor.bio || "",
          }}
          fields={[
            { key: "name", label: "Անուն Ազգանուն", placeholder: "Հեղինակի անուն" },
            { key: "nameOriginal", label: "Բնօրինակ / Լատիներեն Անուն", placeholder: "Original Name" },
            { key: "title", label: "Գիտական Կոչում / Դեր", placeholder: "Կոչում կամ պաշտոն" },
            { key: "quote", label: "Մեջբերում / Գիտական Կրեդո", placeholder: "Գաղափարական պատգամ..." },
            { key: "bio", label: "Կենսագրություն", type: "textarea", placeholder: "Կենսագրական տվյալներ..." },
          ]}
          onSave={handleSaveEditedAuthor}
          onClose={() => setEditingAuthor(null)}
        />
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
                Կենտրոն՝ <strong style={{ color: "var(--text-primary)" }}>{center.name}</strong> ({civ.nameHy})
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
                    💡 Մեկ գիտական աշխատությունը կարող է միաժամանակ պատկանել հեղինակին և մեկ կամ մի քանի կենտրոնների:
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
                          (pub.centerIds && pub.centerIds.includes(center.id)) ||
                          (center.publicationIds && pub.id && center.publicationIds.includes(pub.id));

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
                                <span className="pub-tag-badge">📄 {pub.type || "Զեկույց"}</span>
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
                              {isLinked ? "✓ Կցված է (Անջատել)" : "＋ Կցել Կենտրոնին"}
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
                    placeholder="օրինակ՝ Ռազմավարական Անվտանգության Զեկույց 2026"
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
                      <option value="Զեկույց">Զեկույց</option>
                      <option value="Մենագրություն">Մենագրություն</option>
                      <option value="Հոդված">Հոդված</option>
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
                      placeholder="120"
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
                      Հեղինակ (ընտրովի կցում)
                    </label>
                    <select
                      value={newPubData.authorId}
                      onChange={(e) => setNewPubData({ ...newPubData, authorId: e.target.value })}
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
                      <option value="">-- Առանց կոնկրետ հեղինակի --</option>
                      {centerAuthors.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                    Ամփոփագիր / Հիմնադրույթներ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Աշխատության գիտական դրույթները, եզրակացությունները..."
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
                  ✓ Այս աշխատությունն ավտոմատ կավելացվի <strong>«{civ.nameHy}»</strong> քաղաքակրթության գրադարանում և կկցվի <strong>«{center.name}»</strong> կենտրոնին:
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
                    <span>Ստեղծել և Կցել Կենտրոնին</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Publication Details Modal */}
      {/* Edit Publication Details Modal */}
      {editingPub && (
        <EditCardModal
          title={`Խմբագրել Աշխատությունը՝ ${editingPub.title}`}
          initialData={{
            title: editingPub.title || "",
            year: editingPub.year || "",
            type: editingPub.type || "Զեկույց",
            pages: editingPub.pages || "",
            downloadUrl: editingPub.downloadUrl || "",
            fileName: editingPub.fileName || "",
            fileSizeBytes: editingPub.fileSizeBytes,
            description: editingPub.description || "",
          }}
          civId={civ.id}
          fields={[
            { key: "title", label: "Աշխատության Վերնագիր", placeholder: "Վերնագիր" },
            { key: "type", label: "Տեսակ (Զեկույց / Մենագրություն / Հոդված / PDF)", placeholder: "Զեկույց" },
            { key: "year", label: "Հրատարակման Տարեթիվ", placeholder: "2026" },
            { key: "pages", label: "Էջերի Քանակ", placeholder: "100" },
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
              <span>{selectedPublication.type || "Զեկույց"} • {selectedPublication.year || "Հրատարակված"}</span>
            </div>

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", color: "var(--text-primary)", margin: "0 0 0.5rem 0", lineHeight: "1.3" }}>
              {selectedPublication.title}
            </h2>

            <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Կենտրոն՝ <strong style={{ color: "var(--gold-accent)" }}>{center.name}</strong>
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
                        authorName: center.name,
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

      {/* Edit Center Profile Modal */}
      {isEditingCenterProfile && (
        <EditCardModal
          title={`Խմբագրել Կենտրոնը՝ ${center.name}`}
          initialData={{
            name: center.name || "",
            originalName: center.originalName || "",
            city: center.city || "",
            country: center.country || "",
            foundedYear: center.foundedYear || "",
            description: center.description || "",
            focusAreas: center.focusAreas || [],
            website: center.website || "",
          }}
          fields={[
            { key: "name", label: "Կենտրոնի Անվանում (հայերեն)", placeholder: "Անվանում" },
            { key: "originalName", label: "Բնօրինակ / Լատիներեն Անվանում", placeholder: "Original Name" },
            { key: "city", label: "Քաղաք", placeholder: "Երևան" },
            { key: "country", label: "Երկիր", placeholder: "Հայաստան" },
            { key: "foundedYear", label: "Հիմնադրման Տարեթիվ", placeholder: "2015" },
            { key: "focusAreas", label: "Հետազոտական Ուղղություններ (բաժանեք ստորակետով)", type: "tags" },
            { key: "website", label: "Պաշտոնական Կայք", placeholder: "https://..." },
            { key: "description", label: "Կենտրոնի Մանրամասն Նկարագրություն", type: "textarea", placeholder: "Նկարագիր..." },
          ]}
          onSave={async (data) => {
            const updated: ThinkTank = {
              ...center,
              name: data.name.trim(),
              originalName: data.originalName.trim(),
              city: data.city.trim(),
              country: data.country.trim(),
              description: data.description.trim(),
              focusAreas: Array.isArray(data.focusAreas) ? data.focusAreas : [],
              ...(data.foundedYear ? { foundedYear: String(data.foundedYear).trim() } : {}),
              ...(data.website ? { website: data.website.trim() } : {}),
            };
            setCenter(updated);
            await saveCenter(civ.id, updated);
          }}
          onClose={() => setIsEditingCenterProfile(false)}
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
