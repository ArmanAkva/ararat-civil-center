"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { defaultForumContent } from "@/lib/defaultSiteContent";
import { ForumPageContent, ForumOrganizer } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import { useAuth } from "@/context/AuthContext";
import ForumOwnerModal from "@/components/forum/ForumOwnerModal";
import ForumOrganizerModal from "@/components/forum/ForumOrganizerModal";

export default function ForumOrganizersPage() {
  const [content, setContent] = useState<ForumPageContent>(defaultForumContent);
  const { isEditMode, savePageField } = useEditMode();
  const { isAdmin } = useAuth();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Modals state
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [organizerModalState, setOrganizerModalState] = useState<{
    isOpen: boolean;
    organizer?: ForumOrganizer | null;
  }>({ isOpen: false, organizer: null });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let isMounted = true;
    getPageContent<ForumPageContent>("forum", defaultForumContent).then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const owner = content.organizerOwner || defaultForumContent.organizerOwner;
  const organizersList = content.organizers || defaultForumContent.organizers || [];

  // Save Owner
  const handleSaveOwner = async (newOwner: ForumOrganizer) => {
    setContent((prev) => ({ ...prev, organizerOwner: newOwner }));
    await savePageField("forum", "organizerOwner", newOwner);

    const existingList = content.organizers || defaultForumContent.organizers || [];
    const index = existingList.findIndex((o) => o.id === newOwner.id || o.isOwner);
    let updatedList: ForumOrganizer[];
    if (index !== -1) {
      updatedList = [...existingList];
      updatedList[index] = { ...newOwner, isOwner: true };
    } else {
      updatedList = [{ ...newOwner, isOwner: true }, ...existingList];
    }
    setContent((prev) => ({ ...prev, organizers: updatedList }));
    await savePageField("forum", "organizers", updatedList);
    showToast("Ֆորումի ղեկավարի տվյալները հաջողությամբ պահպանվեցին:");
  };

  // Save Organizer member (add or update)
  const handleSaveOrganizer = async (member: ForumOrganizer) => {
    const list = [...(content.organizers || defaultForumContent.organizers || [])];
    const index = list.findIndex((o) => o.id === member.id);

    let updatedList: ForumOrganizer[];
    if (index !== -1) {
      updatedList = [...list];
      updatedList[index] = member;
    } else {
      updatedList = [...list, member];
    }

    if (member.isOwner) {
      setContent((prev) => ({ ...prev, organizerOwner: member, organizers: updatedList }));
      await savePageField("forum", "organizerOwner", member);
    } else {
      setContent((prev) => ({ ...prev, organizers: updatedList }));
    }

    await savePageField("forum", "organizers", updatedList);
    showToast(index !== -1 ? "Անդամի տվյալները նորացվեցին:" : "Նոր անդամն ավելացվեց կազմկոմիտեում:");
  };

  // Delete Organizer member
  const handleDeleteOrganizer = async (id: string) => {
    const list = (content.organizers || defaultForumContent.organizers || []).filter(
      (o) => o.id !== id
    );
    setContent((prev) => ({ ...prev, organizers: list }));
    await savePageField("forum", "organizers", list);
    showToast("Անդամը հեռացվեց կազմկոմիտեից:");
  };

  // Filtered members list
  const filteredOrganizers = organizersList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.affiliation.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (departmentFilter === "leadership") return m.isOwner || m.role.includes("Ղեկավար") || m.role.includes("Համակարգող");
    if (departmentFilter === "academic") return m.role.includes("Գիտական") || m.affiliation.includes("Մատենադարան") || m.affiliation.includes("ԳԱԱ");
    if (departmentFilter === "international") return m.role.includes("Միջազգային") || m.affiliation.includes("CASS");
    if (departmentFilter === "operations") return m.role.includes("Լոգիստիկ") || m.role.includes("Կապեր") || m.role.includes("Պլատֆորմ");

    return true;
  });

  return (
    <main className="container" style={{ paddingBottom: "6rem", paddingTop: "2rem" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="forum-organizers-toast"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--gold-accent)",
            color: "var(--text-primary)",
            padding: "1rem 1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.95rem",
          }}
        >
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Nav */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Link
          href="/forum"
          id="link-back-to-forum"
          className="back-link"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span>←</span> Վերադառնալ Ֆորումի Գլխավոր Էջ
        </Link>

        {(isEditMode || isAdmin) && (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              id="btn-page-edit-owner"
              onClick={() => setIsOwnerModalOpen(true)}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--gold-accent)",
                background: "rgba(212, 175, 55, 0.15)",
                color: "var(--gold-accent)",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              👑 Սահմանել Ղեկավարին
            </button>

            <button
              type="button"
              id="btn-page-add-organizer"
              onClick={() => setOrganizerModalState({ isOpen: true, organizer: null })}
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.5rem 1.1rem" }}
            >
              + Ավելացնել Կազմկոմիտեի Անդամ
            </button>
          </div>
        )}
      </div>

      {/* Page Header Header */}
      <div style={{ marginBottom: "3.5rem" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(212, 175, 55, 0.12)",
            border: "1px solid var(--gold-accent)",
            color: "var(--gold-accent)",
            padding: "0.25rem 0.85rem",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.75rem",
          }}
        >
          Արարատյան Քաղաքակրթական Ֆորում 2027
        </div>

        <h1
          id="page-heading-organizers"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2.8rem",
            color: "var(--gold-accent)",
            margin: "0 0 0.8rem 0",
            lineHeight: 1.2,
          }}
        >
          Ֆորումի Ղեկավարություն և Կազմկոմիտե
        </h1>

        <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", margin: 0, maxWidth: "850px", lineHeight: "1.7" }}>
          Արարատյան Ֆորումի գլխավոր համակարգողը, գիտական քարտուղարությունը և կազմկոմիտեի անդամները, ովքեր համակարգում են քաղաքակրթական երկխոսության նախապատրաստական աշխատանքները, ակադեմիական պանելները և լոգիստիկ ենթակառուցվածքները։
        </p>
      </div>

      {/* =========================================================
          HERO: Forum Owner / Chief Coordinator
          ========================================================= */}
      {owner && (
        <div
          className="forum-owner-hero"
          id="page-forum-owner-card"
          style={{ marginBottom: "4rem" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <div style={{ display: "flex", gap: "1.75rem", alignItems: "center", flexWrap: "wrap" }}>
              <div
                className="forum-organizer-avatar"
                style={{ width: "95px", height: "95px", fontSize: "2.2rem" }}
              >
                {owner.photoURL ? (
                  <img
                    src={owner.photoURL}
                    alt={owner.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span>👑</span>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "rgba(212, 175, 55, 0.22)",
                    border: "1px solid var(--gold-accent)",
                    color: "var(--gold-accent)",
                    padding: "0.25rem 0.85rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "0.5rem",
                  }}
                >
                  👑 ՖՈՐՈՒՄԻ ԳԼԽԱՎՈՐ ՀԱՄԱԿԱՐԳՈՂ & ՂԵԿԱՎԱՐ
                </div>

                <h2
                  id="page-owner-name"
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif)",
                    fontSize: "2.2rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {owner.name}
                </h2>

                <div
                  style={{
                    color: "var(--gold-accent)",
                    fontSize: "1.15rem",
                    fontWeight: "500",
                    marginTop: "0.3rem",
                  }}
                >
                  {owner.role} •{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{owner.affiliation}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    marginTop: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    flexWrap: "wrap",
                  }}
                >
                  {owner.email && (
                    <div>
                      ✉️{" "}
                      <a href={`mailto:${owner.email}`} style={{ color: "var(--gold-accent)" }}>
                        {owner.email}
                      </a>
                    </div>
                  )}
                  {owner.phone && <div>📞 {owner.phone}</div>}
                </div>
              </div>
            </div>

            {(isEditMode || isAdmin) && (
              <button
                type="button"
                id="btn-edit-owner-main"
                onClick={() => setIsOwnerModalOpen(true)}
                style={{
                  background: "rgba(212, 175, 55, 0.2)",
                  color: "var(--gold-accent)",
                  border: "1px solid var(--gold-accent)",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                ✎ Խմբագրել Ղեկավարին
              </button>
            )}
          </div>

          {owner.bio && (
            <div
              style={{
                marginTop: "1.8rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--card-border)",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  color: "var(--gold-accent)",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  marginBottom: "0.4rem",
                }}
              >
                Ռազմավարական Տեսլական & Պատասխանատվություն
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "var(--text-primary)",
                  maxWidth: "960px",
                }}
              >
                «{owner.bio}»
              </p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SECTION: Organizing Committee Team
          ========================================================= */}
      <div style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--card-border)",
            paddingBottom: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--gold-accent)",
                margin: 0,
                fontSize: "1.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
              }}
            >
              <span>Կազմկոմիտեի Անդամներ</span>
              <span
                style={{
                  fontSize: "0.85rem",
                  padding: "0.15rem 0.7rem",
                  borderRadius: "999px",
                  background: "rgba(212, 175, 55, 0.15)",
                  color: "var(--gold-accent)",
                  fontWeight: "bold",
                }}
              >
                {filteredOrganizers.length} անդամ
              </span>
            </h2>
            <p style={{ margin: "0.2rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Գիտական, միջազգային, գործառնական և թվային հանձնախմբեր
            </p>
          </div>

          {/* Search Box */}
          <div style={{ minWidth: "260px" }}>
            <input
              type="text"
              id="input-search-organizers"
              placeholder="Փնտրել ըստ անվան, դերի կամ կենտրոնի..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--card-border)",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Department Filter Pills */}
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button
            type="button"
            id="dept-filter-all"
            onClick={() => setDepartmentFilter("all")}
            className={`forum-pill-btn ${departmentFilter === "all" ? "active" : ""}`}
          >
            Բոլոր Հանձնախմբերը ({organizersList.length})
          </button>
          <button
            type="button"
            id="dept-filter-leadership"
            onClick={() => setDepartmentFilter("leadership")}
            className={`forum-pill-btn ${departmentFilter === "leadership" ? "active" : ""}`}
          >
            👑 Ղեկավարություն
          </button>
          <button
            type="button"
            id="dept-filter-academic"
            onClick={() => setDepartmentFilter("academic")}
            className={`forum-pill-btn ${departmentFilter === "academic" ? "active" : ""}`}
          >
            📚 Գիտական Քարտուղարություն
          </button>
          <button
            type="button"
            id="dept-filter-international"
            onClick={() => setDepartmentFilter("international")}
            className={`forum-pill-btn ${departmentFilter === "international" ? "active" : ""}`}
          >
            🌐 Միջազգային Համագործակցություն
          </button>
          <button
            type="button"
            id="dept-filter-operations"
            onClick={() => setDepartmentFilter("operations")}
            className={`forum-pill-btn ${departmentFilter === "operations" ? "active" : ""}`}
          >
            ⚙️ Լոգիստիկա & Թվային Մեդիա
          </button>
        </div>

        {/* Organizers Grid */}
        {filteredOrganizers.length === 0 ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              background: "var(--card-bg)",
              borderRadius: "1rem",
              border: "1px dashed var(--card-border)",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>👥</div>
            Տվյալ որոնմամբ անդամներ չեն գտնվել։
          </div>
        ) : (
          <div className="forum-organizer-grid" id="page-organizers-grid">
            {filteredOrganizers.map((member) => (
              <div key={member.id} className="forum-organizer-card" id={`page-organizer-card-${member.id}`}>
                {(isEditMode || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => setOrganizerModalState({ isOpen: true, organizer: member })}
                    style={{
                      position: "absolute",
                      top: "0.85rem",
                      right: "0.85rem",
                      background: "rgba(212, 175, 55, 0.15)",
                      color: "var(--gold-accent)",
                      border: "1px solid var(--gold-accent)",
                      borderRadius: "0.4rem",
                      padding: "0.25rem 0.6rem",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    ✎ Խմբագրել
                  </button>
                )}

                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                  <div className="forum-organizer-avatar">
                    {member.photoURL ? (
                      <img
                        src={member.photoURL}
                        alt={member.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      member.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                    )}
                  </div>

                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.15rem", color: "var(--text-primary)" }}>
                      {member.name}
                    </h3>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--gold-accent)",
                        fontWeight: "600",
                        marginTop: "0.2rem",
                      }}
                    >
                      {member.role}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-secondary)",
                    marginBottom: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <span>🏛️</span> {member.affiliation}
                </div>

                {member.bio && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      margin: "0 0 1rem 0",
                      flex: 1,
                    }}
                  >
                    {member.bio}
                  </p>
                )}

                {member.email && (
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--card-border)",
                      fontSize: "0.85rem",
                    }}
                  >
                    <a
                      href={`mailto:${member.email}`}
                      style={{
                        color: "var(--gold-accent)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <span>✉️</span> {member.email}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          MODALS
          ========================================================= */}
      {/* Forum Owner Modal */}
      <ForumOwnerModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        currentOwner={owner}
        onSave={handleSaveOwner}
      />

      {/* Forum Organizer Modal */}
      <ForumOrganizerModal
        isOpen={organizerModalState.isOpen}
        onClose={() => setOrganizerModalState({ isOpen: false, organizer: null })}
        organizer={organizerModalState.organizer}
        onSave={handleSaveOrganizer}
        onDelete={handleDeleteOrganizer}
      />
    </main>
  );
}
