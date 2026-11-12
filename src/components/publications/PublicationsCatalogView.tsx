"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Civilization, Publication, PublicationWithDetails, Thinker, ThinkTank, civilizationsData } from "@/lib/civilizationsData";
import { useAuth } from "@/context/AuthContext";
import { useEditMode } from "@/context/EditModeContext";
import PdfViewerModal from "./PdfViewerModal";
import EditCardModal from "@/components/cms/EditCardModal";
import PdfUploadField from "./PdfUploadField";
import { savePublicationDoc } from "@/lib/contentService";
import { useLanguage } from "@/context/LanguageContext";
import { applyLocale, t, getCivilizationName } from "@/lib/i18n";

interface Props {
  initialPublications: PublicationWithDetails[];
  civilizations: Civilization[];
}

export default function PublicationsCatalogView({ initialPublications, civilizations }: Props) {
  const [publications, setPublications] = useState<PublicationWithDetails[]>(initialPublications);
  const { user, isAdmin } = useAuth();
  const { isEditMode, savePublication, deletePublication } = useEditMode();
  const { locale } = useLanguage();
  const canEdit = Boolean(isAdmin || isEditMode || user);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCiv, setSelectedCiv] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [onlyWithPdf, setOnlyWithPdf] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "title" | "pages">("newest");

  // Modals state
  const [viewingPdf, setViewingPdf] = useState<{
    url: string;
    title: string;
    authorName?: string;
    year?: string;
    pages?: number;
    fileName?: string;
    fileSizeBytes?: number;
  } | null>(null);

  const [editingPub, setEditingPub] = useState<{
    pub: Publication;
    civId: string;
    isNew: boolean;
  } | null>(null);

  // New Publication state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCivId, setNewCivId] = useState<string>(civilizations[0]?.id || "arm");
  const [newPubForm, setNewPubForm] = useState({
    title: "",
    type: "Զեկույց",
    year: String(new Date().getFullYear()),
    pages: "",
    authorId: "",
    centerId: "",
    downloadUrl: "",
    fileName: "",
    fileSizeBytes: undefined as number | undefined,
    description: "",
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = publications.length;
    const withPdf = publications.filter((p) => Boolean(p.pub.downloadUrl)).length;
    const authorsCount = new Set(
      publications.map((p) => p.author?.id || p.pub.authorIds?.[0]).filter(Boolean)
    ).size;
    const centersCount = new Set(
      publications.map((p) => p.center?.id || p.pub.centerIds?.[0]).filter(Boolean)
    ).size;
    return { total, withPdf, authorsCount, centersCount };
  }, [publications]);

  // Unique types from publications
  const publicationTypes = useMemo(() => {
    const set = new Set<string>();
    publications.forEach((p) => {
      if (p.pub.type) set.add(p.pub.type);
    });
    return Array.from(set);
  }, [publications]);

  // Current selected civ authors and centers for creation form
  const currentCivData = useMemo(() => {
    return civilizations.find((c) => c.id.toLowerCase() === newCivId.toLowerCase()) || civilizations[0];
  }, [civilizations, newCivId]);

  // Filtered & Sorted Publications
  const filteredPublications = useMemo(() => {
    let result = publications.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.pub.title?.toLowerCase().includes(q);
        const matchesDesc = item.pub.description?.toLowerCase().includes(q);
        const matchesAuthor = item.author?.name?.toLowerCase().includes(q);
        const matchesCenter = item.center?.name?.toLowerCase().includes(q);
        const matchesCiv = item.civ.nameHy?.toLowerCase().includes(q) || item.civ.nameEn?.toLowerCase().includes(q);
        const matchesYear = item.pub.year?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesCenter && !matchesCiv && !matchesYear) {
          return false;
        }
      }

      // 2. Civ filter
      if (selectedCiv !== "all" && item.civ.id.toLowerCase() !== selectedCiv.toLowerCase()) {
        return false;
      }

      // 3. Type filter
      if (selectedType !== "all" && item.pub.type !== selectedType) {
        return false;
      }

      // 4. Only with PDF
      if (onlyWithPdf && !item.pub.downloadUrl) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "title") {
        return a.pub.title.localeCompare(b.pub.title, "hy");
      }
      if (sortBy === "pages") {
        return (b.pub.pages || 0) - (a.pub.pages || 0);
      }
      // "newest" by default: year desc or id desc
      const yearA = parseInt(a.pub.year || "0", 10);
      const yearB = parseInt(b.pub.year || "0", 10);
      if (yearA !== yearB) return yearB - yearA;
      return (b.pub.id || "").localeCompare(a.pub.id || "");
    });

    return result;
  }, [publications, searchQuery, selectedCiv, selectedType, onlyWithPdf, sortBy]);

  // Handle Save New Publication
  const handleCreatePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubForm.title.trim()) {
      alert("Խնդրում ենք լրացնել աշխատության վերնագիրը:");
      return;
    }

    const newPubId = `pub-${Date.now()}`;
    const authorIds = newPubForm.authorId ? [newPubForm.authorId] : [];
    const centerIds = newPubForm.centerId ? [newPubForm.centerId] : [];

    const newPub: Publication = {
      id: newPubId,
      civId: newCivId,
      title: newPubForm.title.trim(),
      type: newPubForm.type || "Զեկույց",
      authorIds,
      centerIds,
      createdAt: new Date().toISOString(),
      ...(newPubForm.year?.trim() ? { year: newPubForm.year.trim() } : {}),
      ...(newPubForm.pages ? { pages: Number(newPubForm.pages) } : {}),
      ...(newPubForm.downloadUrl?.trim() ? { downloadUrl: newPubForm.downloadUrl.trim() } : {}),
      ...(newPubForm.fileName?.trim() ? { fileName: newPubForm.fileName.trim() } : {}),
      ...(newPubForm.fileSizeBytes ? { fileSizeBytes: newPubForm.fileSizeBytes } : {}),
      ...(newPubForm.description?.trim() ? { description: newPubForm.description.trim() } : {}),
    };

    try {
      await savePublicationDoc(newCivId, newPub);
      await savePublication(newCivId, newPub);

      const resolvedAuthor = newPubForm.authorId
        ? (currentCivData?.authors || []).find((a) => a.id === newPubForm.authorId)
        : undefined;
      const resolvedCenter = newPubForm.centerId
        ? (currentCivData?.centers || []).find((c) => c.id === newPubForm.centerId)
        : undefined;

      const newWithDetails: PublicationWithDetails = {
        pub: newPub,
        civ: currentCivData || civilizations[0],
        author: resolvedAuthor,
        center: resolvedCenter,
      };

      setPublications([newWithDetails, ...publications]);
      setIsCreateModalOpen(false);
      setNewPubForm({
        title: "",
        type: "Զեկույց",
        year: String(new Date().getFullYear()),
        pages: "",
        authorId: "",
        centerId: "",
        downloadUrl: "",
        fileName: "",
        fileSizeBytes: undefined,
        description: "",
      });
    } catch (err: any) {
      console.error(err);
      alert(`Սխալ աշխատությունը պահպանելիս. ${err.message || err}`);
    }
  };

  // Handle Edit Publication
  const handleSaveEditedPublication = async (data: any) => {
    if (!editingPub) return;
    const targetCivId = editingPub.civId;
    const updatedPub: Publication = {
      ...editingPub.pub,
      title: data.title?.trim() || editingPub.pub.title,
      type: data.type || editingPub.pub.type,
      ...(data.year !== undefined ? (data.year ? { year: String(data.year).trim() } : { year: "" }) : (editingPub.pub.year ? { year: editingPub.pub.year } : {})),
      ...(data.pages !== undefined ? (data.pages ? { pages: Number(data.pages) } : {}) : (editingPub.pub.pages ? { pages: editingPub.pub.pages } : {})),
      ...(data.downloadUrl !== undefined ? (data.downloadUrl ? { downloadUrl: data.downloadUrl.trim() } : { downloadUrl: "" }) : (editingPub.pub.downloadUrl ? { downloadUrl: editingPub.pub.downloadUrl } : {})),
      ...(data.fileName !== undefined ? { fileName: data.fileName } : (editingPub.pub.fileName ? { fileName: editingPub.pub.fileName } : {})),
      ...(data.fileSizeBytes !== undefined ? { fileSizeBytes: data.fileSizeBytes } : (editingPub.pub.fileSizeBytes ? { fileSizeBytes: editingPub.pub.fileSizeBytes } : {})),
      ...(data.description !== undefined ? (data.description ? { description: data.description.trim() } : { description: "" }) : (editingPub.pub.description ? { description: editingPub.pub.description } : {})),
    };

    try {
      await savePublicationDoc(targetCivId, updatedPub);
      await savePublication(targetCivId, updatedPub);
      setPublications((prev) =>
        prev.map((item) =>
          item.pub.id === updatedPub.id
            ? { ...item, pub: updatedPub }
            : item
        )
      );
      setEditingPub(null);
    } catch (err: any) {
      console.error(err);
      alert(`Սխալ աշխատությունը պահպանելիս. ${err.message || err}`);
    }
  };

  // Handle Delete Publication
  const handleDeletePublication = async (item: PublicationWithDetails) => {
    if (!confirm(`Իսկապե՞ս ցանկանում եք հեռացնել «${item.pub.title}» աշխատությունը:`)) return;
    if (!item.pub.id) return;
    try {
      await deletePublication(item.civ.id, item.pub.id);
      setPublications((prev) => prev.filter((p) => p.pub.id !== item.pub.id));
    } catch (err) {
      console.error(err);
      alert("Սխալ աշխատությունը հեռացնելիս:");
    }
  };

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* Hero Header */}
      <section
        style={{
          background: "linear-gradient(180deg, var(--gradient-overlay-1) 0%, transparent 100%)",
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(183, 121, 31, 0.12)",
              color: "var(--gold-accent)",
              border: "1px solid var(--card-border)",
              padding: "0.35rem 0.9rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: "600",
              letterSpacing: "0.5px",
              marginBottom: "1.2rem",
            }}
          >
            <span>📚</span>
            <span>{locale === "en" ? "Ararat Library • Scientific Archive" : locale === "ru" ? "Араратская Библиотека • Научный Архив" : "Արարատյան Գրադարան • Գիտական Արխիվ"}</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              color: "var(--text-primary)",
              margin: "0 0 1rem 0",
              lineHeight: "1.2",
              fontWeight: "700",
            }}
          >
            {t("pub.title", locale)}
          </h1>

          <p
            style={{
              maxWidth: "750px",
              margin: "0 auto 2.5rem",
              fontSize: "1.1rem",
              color: "var(--text-secondary)",
              lineHeight: "1.7",
            }}
          >
            {t("pub.subtitle", locale)}
          </p>

          {/* Quick Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "1rem",
              maxWidth: "850px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                padding: "1.2rem 1rem",
                borderRadius: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--gold-accent)", marginBottom: "0.2rem" }}>
                {stats.total}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {locale === "en" ? "Total Publications" : locale === "ru" ? "Всего публикаций" : "Ընդհանուր Աշխատություն"}
              </div>
            </div>

            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                padding: "1.2rem 1rem",
                borderRadius: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#10b981", marginBottom: "0.2rem" }}>
                {stats.withPdf}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {locale === "en" ? "Digital PDF Documents" : locale === "ru" ? "Цифровые документы PDF" : "Թվային PDF Փաստաթուղթ"}
              </div>
            </div>

            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                padding: "1.2rem 1rem",
                borderRadius: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--gold-accent)", marginBottom: "0.2rem" }}>
                {stats.centersCount}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {locale === "en" ? "Research Centers" : locale === "ru" ? "Научные центры" : "Գիտական Կենտրոններ"}
              </div>
            </div>

            <div
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                padding: "1.2rem 1rem",
                borderRadius: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--gold-accent)", marginBottom: "0.2rem" }}>
                {stats.authorsCount}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {locale === "en" ? "Scholars & Thinkers" : locale === "ru" ? "Мыслители и авторы" : "Մտածողներ և Հեղինակներ"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem 0" }}>
        {/* Filters and Controls Bar */}
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2.5rem",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Top Search & Actions Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            {/* Search Input */}
            <div style={{ flex: "1 1 320px", position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1rem",
                  opacity: 0.6,
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder={t("pub.searchPlaceholder", locale)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.8rem",
                  borderRadius: "0.6rem",
                  background: "var(--input-bg)",
                  border: "1px solid var(--card-border)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Admin Add Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.6rem",
                  background: "var(--input-bg)",
                  border: "1px solid var(--card-border)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                <option value="newest">🕒 {t("pub.sortNewest", locale)}</option>
                <option value="title">🔤 {t("pub.sortTitle", locale)}</option>
                <option value="pages">📄 {t("pub.sortPages", locale)}</option>
              </select>

              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.7rem 0.9rem",
                  borderRadius: "0.6rem",
                  background: onlyWithPdf ? "rgba(16, 185, 129, 0.15)" : "var(--input-bg)",
                  border: onlyWithPdf ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid var(--card-border)",
                  color: onlyWithPdf ? "#10b981" : "var(--text-secondary)",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={onlyWithPdf}
                  onChange={(e) => setOnlyWithPdf(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <span>✓ {t("pub.onlyPdf", locale)}</span>
              </label>

              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                  style={{
                    padding: "0.7rem 1.25rem",
                    fontSize: "0.88rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span>{t("btn.addPublication", locale)}</span>
                </button>
              )}
            </div>
          </div>

          {/* Civilization Filter Pills */}
          <div className="pub-filter-bar" style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginRight: "0.4rem", flexShrink: 0 }}>
              {t("label.civilizationLabel", locale)}
            </span>
            <button
              type="button"
              onClick={() => setSelectedCiv("all")}
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: selectedCiv === "all" ? "var(--gold-accent)" : "var(--input-bg)",
                color: selectedCiv === "all" ? "#ffffff" : "var(--text-primary)",
                border: selectedCiv === "all" ? "1px solid var(--gold-accent)" : "1px solid var(--card-border)",
                flexShrink: 0,
              }}
            >
              {t("label.all", locale)} ({publications.length})
            </button>
            {civilizations.map((civ) => {
              const count = publications.filter((p) => p.civ.id.toLowerCase() === civ.id.toLowerCase()).length;
              if (count === 0) return null;
              const isSelected = selectedCiv.toLowerCase() === civ.id.toLowerCase();
              return (
                <button
                  key={civ.id}
                  type="button"
                  onClick={() => setSelectedCiv(civ.id)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isSelected ? "var(--gold-accent)" : "var(--input-bg)",
                    color: isSelected ? "#ffffff" : "var(--text-primary)",
                    border: isSelected ? "1px solid var(--gold-accent)" : "1px solid var(--card-border)",
                    flexShrink: 0,
                  }}
                >
                  <span>{civ.symbol}</span> <span>{getCivilizationName(civ, locale, true)} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Document Type Pills */}
          {publicationTypes.length > 0 && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center", marginTop: "0.85rem" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginRight: "0.4rem" }}>
                {t("label.typeLabel", locale)}
              </span>
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                style={{
                  padding: "0.25rem 0.7rem",
                  borderRadius: "0.4rem",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: selectedType === "all" ? "rgba(183, 121, 31, 0.2)" : "transparent",
                  color: selectedType === "all" ? "var(--gold-accent)" : "var(--text-secondary)",
                  border: selectedType === "all" ? "1px solid var(--gold-accent)" : "1px solid transparent",
                }}
              >
                {t("label.all", locale)}
              </button>
              {publicationTypes.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    style={{
                      padding: "0.25rem 0.7rem",
                      borderRadius: "0.4rem",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      background: isSelected ? "rgba(183, 121, 31, 0.2)" : "transparent",
                      color: isSelected ? "var(--gold-accent)" : "var(--text-secondary)",
                      border: isSelected ? "1px solid var(--gold-accent)" : "1px solid transparent",
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            {locale === "en" ? (
              <>Showing <strong>{filteredPublications.length}</strong> publications</>
            ) : locale === "ru" ? (
              <>Отображено <strong>{filteredPublications.length}</strong> публикаций</>
            ) : (
              <>Ցուցադրված է <strong>{filteredPublications.length}</strong> աշխատություն</>
            )}
          </div>
          {(selectedCiv !== "all" || selectedType !== "all" || searchQuery || onlyWithPdf) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCiv("all");
                setSelectedType("all");
                setSearchQuery("");
                setOnlyWithPdf(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--gold-accent)",
                cursor: "pointer",
                fontSize: "0.85rem",
                textDecoration: "underline",
              }}
            >
              {t("btn.clearFilters", locale)}
            </button>
          )}
        </div>

        {/* Publications Grid with UNIFORM FIXED HEIGHT Cards */}
        {filteredPublications.length > 0 ? (
          <div className="cards-grid-subpage">
            {filteredPublications.map((item, idx) => {
              const { pub, civ, author, center } = item;
              const localizedPub = applyLocale(pub, locale);
              const localizedCiv = applyLocale(civ, locale);
              const localizedAuthor = author ? applyLocale(author, locale) : undefined;
              const localizedCenter = center ? applyLocale(center, locale) : undefined;
              return (
                <article key={pub.id || idx} className="publication-card">
                  {/* Admin Quick Action Controls */}
                  {canEdit && (
                    <div
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        display: "flex",
                        gap: "0.4rem",
                        zIndex: 10,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setEditingPub({ pub, civId: civ.id, isNew: false })}
                        className="credo-action-btn"
                        style={{ padding: "0.25rem 0.55rem", fontSize: "0.75rem", background: "var(--bg-secondary)" }}
                        title="Խմբագրել աշխատությունը"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePublication(item)}
                        style={{
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          color: "#ef4444",
                          padding: "0.25rem 0.55rem",
                          borderRadius: "0.4rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                        title="Հեռացնել աշխատությունը"
                      >
                        🗑
                      </button>
                    </div>
                  )}

                  {/* Card Main Body */}
                  <div className="pub-card-body">
                    {/* Top Badges */}
                    <div className="pub-card-top-badges">
                      <Link
                        href={`/civilizations/${civ.slug || civ.id}`}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          background: "rgba(183, 121, 31, 0.15)",
                          color: "var(--gold-accent)",
                          fontWeight: "700",
                          textDecoration: "none",
                          border: "1px solid var(--card-border)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <span>{civ.symbol}</span>
                        <span>{getCivilizationName(civ, locale, false)}</span>
                      </Link>

                      <span className="pub-tag-badge">📄 {localizedPub.type || "Զեկույց"}</span>

                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                        {pub.year && (locale === "hy" ? `${pub.year}թ.` : pub.year)}
                        {pub.pages && ` • ${pub.pages} ${t("pub.pagesCount", locale)}`}
                      </span>

                      {pub.downloadUrl && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            color: "#10b981",
                            background: "rgba(16, 185, 129, 0.12)",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "999px",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            fontWeight: "600",
                          }}
                        >
                          ✓ PDF {locale === "en" ? "Available" : locale === "ru" ? "Есть" : "առկա"}
                        </span>
                      )}
                    </div>

                    {/* Title linking to dedicated On-Screen Reader Page */}
                    <h3 className="pub-card-title" style={{ paddingRight: canEdit ? "60px" : "0" }}>
                      <Link href={`/publications/${pub.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {localizedPub.title}
                      </Link>
                    </h3>

                    {/* Abstract / Description (Clamped to 3 lines) */}
                    {localizedPub.description ? (
                      <p className="pub-card-desc">{localizedPub.description}</p>
                    ) : (
                      <p className="pub-card-desc" style={{ fontStyle: "italic", opacity: 0.6 }}>
                        {locale === "en" ? "Foundational civilizational research and strategic analysis." : locale === "ru" ? "Фундаментальное цивилизационное исследование и стратегический анализ." : "Քաղաքակրթական հիմնարար հետազոտություն և ռազմավարական վերլուծություն։"}
                      </p>
                    )}

                    {/* Affiliations (Author & Center) */}
                    <div className="pub-card-affiliations">
                      {localizedAuthor ? (
                        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>{t("pub.author", locale)}՝</span>
                          <Link
                            href={`/authors/${localizedAuthor.id}`}
                            style={{
                              fontSize: "0.74rem",
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
                            <span>🖋</span>
                            <span>{localizedAuthor.name}</span>
                          </Link>
                        </div>
                      ) : pub.authorIds && pub.authorIds.length > 0 ? (
                        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>{t("pub.author", locale)}՝</span>
                          <span style={{ fontSize: "0.74rem", color: "var(--text-primary)", fontWeight: "600" }}>
                            {pub.authorIds[0]}
                          </span>
                        </div>
                      ) : null}

                      {localizedCenter ? (
                        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>{t("pub.center", locale)}՝</span>
                          <Link
                            href={`/centers/${localizedCenter.id}`}
                            style={{
                              fontSize: "0.74rem",
                              color: "var(--gold-accent)",
                              background: "rgba(183, 121, 31, 0.08)",
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
                            <span>{localizedCenter.name}</span>
                          </Link>
                        </div>
                      ) : pub.centerIds && pub.centerIds.length > 0 ? (
                        <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                          <span style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>{t("pub.center", locale)}՝</span>
                          <span style={{ fontSize: "0.74rem", color: "var(--text-primary)", fontWeight: "600" }}>
                            {pub.centerIds[0]}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Pinned Card Footer */}
                  <div className="pub-card-footer">
                    {/* Primary Button: Open On-Screen in Dedicated Page */}
                    <Link
                      href={`/publications/${pub.id}`}
                      className="credo-action-btn"
                      style={{
                        padding: "0.45rem 0.85rem",
                        fontSize: "0.82rem",
                        textDecoration: "none",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <span>📖</span>
                      <span>{t("pub.readOnline", locale)}</span>
                    </Link>

                    {/* PDF Actions */}
                    {pub.downloadUrl ? (
                      <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
                        <button
                          type="button"
                          onClick={() =>
                            setViewingPdf({
                              url: pub.downloadUrl!,
                              title: localizedPub.title,
                              authorName: localizedAuthor?.name || localizedCiv.nameHy,
                              year: pub.year,
                              pages: pub.pages,
                              fileName: pub.fileName,
                              fileSizeBytes: pub.fileSizeBytes,
                            })
                          }
                          className="credo-action-btn"
                          style={{
                            padding: "0.45rem 0.75rem",
                            fontSize: "0.8rem",
                            background: "rgba(183, 121, 31, 0.15)",
                            color: "var(--gold-accent)",
                          }}
                          title={locale === "en" ? "Preview PDF" : locale === "ru" ? "Просмотр PDF" : "Արագ դիտել PDF-ը"}
                        >
                          👁 PDF
                        </button>

                        <a
                          href={pub.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={pub.fileName || `${localizedPub.title}.pdf`}
                          className="credo-action-btn"
                          style={{
                            padding: "0.45rem 0.75rem",
                            fontSize: "0.8rem",
                            textDecoration: "none",
                          }}
                          title={t("pub.downloadPdf", locale)}
                        >
                          ⬇️
                        </a>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                        {locale === "en" ? "Digital archive" : locale === "ru" ? "Цифровой архив" : "Թվային արխիվ"}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--card-bg)",
              borderRadius: "1rem",
              border: "1px dashed var(--card-border)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📖</div>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              {t("pub.notFound", locale)}
            </h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "450px", margin: "0 auto 1.5rem" }}>
              {locale === "en" ? "Try adjusting your search terms or clearing filters to see all publications." : locale === "ru" ? "Попробуйте изменить поисковый запрос или сбросить фильтры." : "Փորձեք փոխել որոնման բառերը կամ վերականգնել ֆիլտրերը՝ բոլոր աշխատությունները տեսնելու համար:"}
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSearchQuery("");
                setSelectedCiv("all");
                setSelectedType("all");
                setOnlyWithPdf(false);
              }}
            >
              <span>{t("btn.showAllPubs", locale)}</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin: Add New Publication Modal */}
      {isCreateModalOpen && (
        <div className="civ-modal-overlay" onClick={() => setIsCreateModalOpen(false)} role="dialog" aria-modal="true">
          <div className="civ-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px" }}>
            <button
              type="button"
              className="civ-modal-close"
              onClick={() => setIsCreateModalOpen(false)}
              aria-label={t("btn.close", locale)}
            >
              ✕
            </button>

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--gold-accent)", margin: "0 0 1.25rem 0" }}>
              {t("label.createNewPub", locale)}
            </h2>

            <form onSubmit={handleCreatePublication} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {t("label.civilization", locale)} *
                </label>
                <select
                  value={newCivId}
                  onChange={(e) => setNewCivId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.5rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-primary)",
                  }}
                >
                  {civilizations.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.symbol} {c.nameHy} ({c.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {t("label.pubTitle", locale)} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="օրինակ՝ Ռազմավարական Ինքնիշխանության Հիմունքները"
                  value={newPubForm.title}
                  onChange={(e) => setNewPubForm({ ...newPubForm, title: e.target.value })}
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
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                    {t("label.pubType", locale)}
                  </label>
                  <select
                    value={newPubForm.type}
                    onChange={(e) => setNewPubForm({ ...newPubForm, type: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.5rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
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
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                    {t("label.pubYear", locale)}
                  </label>
                  <input
                    type="text"
                    placeholder="2026"
                    value={newPubForm.year}
                    onChange={(e) => setNewPubForm({ ...newPubForm, year: e.target.value })}
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
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                    {t("label.attachedAuthorOptional", locale)}
                  </label>
                  <select
                    value={newPubForm.authorId}
                    onChange={(e) => setNewPubForm({ ...newPubForm, authorId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.5rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="">-- {t("label.noSpecificAuthor", locale)} --</option>
                    {(currentCivData?.authors || []).map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                    {t("label.attachedCenterOptional", locale)}
                  </label>
                  <select
                    value={newPubForm.centerId}
                    onChange={(e) => setNewPubForm({ ...newPubForm, centerId: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "0.5rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="">-- {t("label.noSpecificCenter", locale)} --</option>
                    {(currentCivData?.centers || []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {t("label.pubPages", locale)}
                </label>
                <input
                  type="number"
                  placeholder="120"
                  value={newPubForm.pages}
                  onChange={(e) => setNewPubForm({ ...newPubForm, pages: e.target.value })}
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
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                  {t("label.summaryAbstract", locale)}
                </label>
                <textarea
                  rows={3}
                  placeholder="Աշխատության հիմնարար դրույթները, եզրակացությունները..."
                  value={newPubForm.description}
                  onChange={(e) => setNewPubForm({ ...newPubForm, description: e.target.value })}
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

              {/* PDF Upload to Firebase Storage */}
              <PdfUploadField
                civId={newCivId}
                downloadUrl={newPubForm.downloadUrl}
                fileName={newPubForm.fileName}
                fileSizeBytes={newPubForm.fileSizeBytes}
                label="PDF Փաստաթուղթ (Storage / URL)"
                onChange={(res) => {
                  setNewPubForm({
                    ...newPubForm,
                    downloadUrl: res.downloadUrl,
                    fileName: res.fileName || "",
                    fileSizeBytes: res.fileSizeBytes,
                  });
                }}
              />

              <div style={{ display: "flex", gap: "0.8rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="credo-action-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  {t("btn.cancel", locale)}
                </button>
                <button type="submit" className="btn-primary">
                  <span>{t("btn.save", locale)}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin: Edit Publication Details Modal */}
      {editingPub && (
        <EditCardModal
          title={`Խմբագրել՝ ${editingPub.pub.title}`}
          initialData={editingPub.pub}
          civId={editingPub.civId}
          fields={[
            { key: "title", label: "Աշխատության Վերնագիր", placeholder: "Վերնագիր..." },
            { key: "type", label: "Տեսակ (Զեկույց / Մենագրություն / Հոդված / PDF / Գիրք)", placeholder: "Զեկույց" },
            { key: "year", label: "Հրատարակման Տարեթիվ", placeholder: "2026" },
            { key: "pages", label: "Էջերի Քանակ", placeholder: "120" },
            { key: "description", label: "Ամփոփագիր և Գիտական Թեզիսներ", type: "textarea", placeholder: "Հիմնական դրույթները..." },
            { key: "downloadUrl", label: "PDF Փաստաթուղթ (Storage / URL)", type: "pdf" },
          ]}
          onSave={handleSaveEditedPublication}
          onClose={() => setEditingPub(null)}
        />
      )}

      {/* Instant PDF Preview Modal */}
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
