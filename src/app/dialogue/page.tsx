"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DialogueTopicItem } from "@/types/dialogue";
import { getAllCivilCenters } from "@/lib/civilizationsData";
import {
  getDialogueTopics,
  createDialogueTopic,
  updateDialogueTopic,
  deleteDialogueTopic,
  approveDialogueTopic,
  rejectDialogueTopic,
} from "@/lib/dialogueService";
import PersonWithLoupeIcon from "@/components/icons/PersonWithLoupeIcon";
import TopicStatusIconBadge from "@/components/dialogue/TopicStatusIconBadge";
function DialogueHubContent() {
  const router = useRouter();

  const { user, profile, role, isAdmin, isSuperAdmin } = useAuth();

  // Civil Centers List for optional selection
  const civilCenters = useMemo(() => getAllCivilCenters(), []);

  // Topics State
  const [topics, setTopics] = useState<DialogueTopicItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived" | "pending" | "my_pending">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recent" | "comments" | "oldest">("recent");

  // Suggest / Create Topic Modal (Accessible to all users!)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [topicFormNumber, setTopicFormNumber] = useState("");
  const [topicFormTitle, setTopicFormTitle] = useState("");
  const [topicFormDescription, setTopicFormDescription] = useState("");
  const [topicFormTag, setTopicFormTag] = useState("Ընդհանուր Քաղաքակրթական");
  const [topicFormCenterId, setTopicFormCenterId] = useState("");
  const [topicFormDate, setTopicFormDate] = useState("2026թ. ԱՇՈՒՆ");
  const [topicFormStatus, setTopicFormStatus] = useState<"active" | "archived" | "closed" | "pending">("active");
  const [guestAuthorName, setGuestAuthorName] = useState("");
  const [guestAuthorEmail, setGuestAuthorEmail] = useState("");
  const [savingTopic, setSavingTopic] = useState(false);

  // Admin Quick Edit Modal
  const [editingTopic, setEditingTopic] = useState<DialogueTopicItem | null>(null);

  // Toast Notifications
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch topics on mount
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const list = await getDialogueTopics();
      setTopics(list);
    } catch (err) {
      console.error("Error loading dialogue topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Extract unique category tags
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    topics.forEach((t) => {
      if (t.civilizationTag && t.civilizationTag.trim()) {
        set.add(t.civilizationTag.trim());
      }
    });
    return Array.from(set);
  }, [topics]);

  // Pending topics counts
  const pendingCount = useMemo(
    () => topics.filter((t) => t.status === "pending").length,
    [topics]
  );

  const myPendingCount = useMemo(() => {
    if (!user?.uid) return 0;
    return topics.filter((t) => t.status === "pending" && t.authorUid === user.uid).length;
  }, [topics, user?.uid]);

  // Filter & Search Topics
  const filteredTopics = useMemo(() => {
    let result = [...topics];

    // Visibility rules:
    // - Admins see all topics (including pending & rejected)
    // - Regular logged-in users see active & archived topics, PLUS their own pending/rejected topics
    // - Guests see active & archived topics
    if (!isAdmin) {
      result = result.filter(
        (t) =>
          t.status === "active" ||
          t.status === "archived" ||
          (user?.uid && t.authorUid === user.uid)
      );
    }

    // Status filter
    if (statusFilter === "my_pending") {
      result = result.filter((t) => t.status === "pending" && user?.uid && t.authorUid === user.uid);
    } else if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Tag filter
    if (selectedTag !== "all") {
      result = result.filter((t) => t.civilizationTag === selectedTag);
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(q);
        const descMatch = t.description.toLowerCase().includes(q);
        const numberMatch = t.number.toLowerCase().includes(q);
        const tagMatch = t.civilizationTag?.toLowerCase().includes(q);
        const authorMatch = t.authorName?.toLowerCase().includes(q);
        return titleMatch || descMatch || numberMatch || tagMatch || authorMatch;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "comments") {
        return (b.commentsCount || 0) - (a.commentsCount || 0);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // default: "recent"
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [topics, statusFilter, selectedTag, searchQuery, sortBy, isAdmin, user?.uid]);

  // Aggregate stats
  const totalComments = useMemo(
    () => topics.reduce((acc, t) => acc + (t.commentsCount || 0), 0),
    [topics]
  );
  const activeCount = useMemo(
    () => topics.filter((t) => t.status === "active").length,
    [topics]
  );
  const archivedCount = useMemo(
    () => topics.filter((t) => t.status === "archived").length,
    [topics]
  );

  // Reset Create Form
  const resetCreateForm = () => {
    setTopicFormNumber(`ՀԱՐՑԱԴՐՈՒՄ #${topics.length + 1}`);
    setTopicFormTitle("");
    setTopicFormDescription("");
    setTopicFormTag("Ընդհանուր Քաղաքակրթական");
    setTopicFormCenterId("");
    setTopicFormDate("2026թ. ԱՇՈՒՆ");
    setTopicFormStatus(isAdmin ? "active" : "pending");
    setGuestAuthorName("");
    setGuestAuthorEmail("");
  };

  const handleOpenCreateModal = () => {
    resetCreateForm();
    setIsCreateModalOpen(true);
  };

  // Submit New Topic (by regular user or admin)
  const handleSaveNewTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicFormTitle.trim() || !topicFormDescription.trim()) return;

    setSavingTopic(true);
    try {
      const authorName = user
        ? profile?.displayName || user.displayName || user.email?.split("@")[0] || "Անդամ"
        : guestAuthorName.trim() || "Հյուր";

      const authorEmail = user?.email || (guestAuthorEmail.trim() || undefined);

      // Regular users always create topic with status="pending" (awaiting admin confirmation)
      const statusToSet: "active" | "archived" | "closed" | "pending" = isAdmin
        ? topicFormStatus
        : "pending";

      const selectedCenter = topicFormCenterId
        ? civilCenters.find((c) => c.id === topicFormCenterId)
        : undefined;

      const created = await createDialogueTopic({
        number: topicFormNumber.trim() || `ՀԱՐՑԱԴՐՈՒՄ #${topics.length + 1}`,
        title: topicFormTitle.trim(),
        description: topicFormDescription.trim(),
        civilizationTag: topicFormTag.trim() || "Ընդհանուր",
        centerId: selectedCenter ? selectedCenter.id : undefined,
        centerName: selectedCenter ? selectedCenter.name : undefined,
        date: topicFormDate.trim() || new Date().toLocaleDateString("hy-AM"),
        status: statusToSet,
        authorUid: user?.uid,
        authorName,
        authorEmail,
        authorRole: role || "guest",
      });

      setTopics((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);

      if (isAdmin && statusToSet === "active") {
        showToast("success", "✓ Նոր հարցադրումը հաջողությամբ առաջարկվեց և հրապարակվեց:");
        router.push(`/dialogue/${created.id}`);
      } else {
        showToast(
          "success",
          "✓ Շնորհակալություն։ Ձեր հարցադրումն ուղարկվեց։ Ադմինիստրատորի հաստատումից հետո այն կհրապարակվի հարթակում։"
        );
      }
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ հարցադրումը ստեղծելիս. ${err.message || err}`);
    } finally {
      setSavingTopic(false);
    }
  };

  // Approve Pending Topic (Admin only)
  const handleApproveTopic = async (topicId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const adminName = profile?.displayName || user?.displayName || "Ադմինիստրատոր";
      await approveDialogueTopic(topicId, adminName);
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, status: "active" } : t))
      );
      showToast("success", "✓ Հարցադրումը հաստատվեց և հրապարակվեց հարթակում:");
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ հաստատելիս. ${err.message || err}`);
    }
  };

  // Reject Pending Topic (Admin only)
  const handleRejectTopic = async (topicId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const reason = prompt("Նշեք մերժման պատճառը (կամ թողեք դատարկ).") || undefined;
    try {
      const adminName = profile?.displayName || user?.displayName || "Ադմինիստրատոր";
      await rejectDialogueTopic(topicId, reason, adminName);
      setTopics((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, status: "rejected" } : t))
      );
      showToast("success", "✓ Հարցադրումը մերժվեց:");
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ մերժելիս. ${err.message || err}`);
    }
  };

  // Quick Edit Topic (Admin only)
  const handleOpenEditModal = (t: DialogueTopicItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingTopic(t);
    setTopicFormNumber(t.number);
    setTopicFormTitle(t.title);
    setTopicFormDescription(t.description);
    setTopicFormTag(t.civilizationTag || "Ընդհանուր");
    setTopicFormCenterId(t.centerId || "");
    setTopicFormDate(t.date);
    setTopicFormStatus(t.status as any);
  };

  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;

    setSavingTopic(true);
    try {
      const selectedCenter = topicFormCenterId
        ? civilCenters.find((c) => c.id === topicFormCenterId)
        : undefined;

      const partial: Partial<DialogueTopicItem> = {
        number: topicFormNumber.trim(),
        title: topicFormTitle.trim(),
        description: topicFormDescription.trim(),
        civilizationTag: topicFormTag.trim(),
        centerId: selectedCenter ? selectedCenter.id : "",
        centerName: selectedCenter ? selectedCenter.name : "",
        date: topicFormDate.trim(),
        status: topicFormStatus,
      };

      await updateDialogueTopic(editingTopic.id, partial);
      setTopics((prev) =>
        prev.map((t) => (t.id === editingTopic.id ? { ...t, ...partial } : t))
      );
      setEditingTopic(null);
      showToast("success", "✓ Հարցադրումը հաջողությամբ թարմացվեց:");
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ թարմացնելիս. ${err.message || err}`);
    } finally {
      setSavingTopic(false);
    }
  };

  // Quick Delete Topic (Admin only)
  const handleDeleteTopic = async (topicId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Իսկապե՞ս ցանկանում եք ջնջել այս հարցադրումը և նրա քննարկումները:")) return;

    try {
      await deleteDialogueTopic(topicId);
      setTopics((prev) => prev.filter((t) => t.id !== topicId));
      showToast("success", "✓ Հարցադրումը հեռացվեց:");
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ. ${err.message || err}`);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSelectedTag("all");
    setSortBy("recent");
  };

  return (
    <main className="container" style={{ paddingBottom: "6rem", maxWidth: "1200px" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 9999,
            background: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "#ffffff",
            padding: "0.9rem 1.5rem",
            borderRadius: "0.6rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontSize: "0.92rem",
            fontWeight: "600",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <span>{toast.type === "success" ? "✓" : "⚠️"}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Hero Header */}
      <div
        style={{
          textAlign: "center",
          padding: "3.5rem 1rem 2rem 1rem",
          maxWidth: "880px",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "0.85rem",
            fontWeight: "700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--gold-accent)",
            marginBottom: "0.75rem",
          }}
        >
          Արարատյան Կենտրոն · Փիլիսոփայական Ֆորում
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: "700",
            lineHeight: "1.25",
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          Քաղաքակրթական Երկխոսություն & Հարցադրումներ
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: "1.7",
            color: "var(--text-secondary)",
            margin: "0 auto 2rem auto",
            maxWidth: "760px",
          }}
        >
          Բաց փիլիսոփայական հարթակ արդի մարտահրավերների, արժեքային համակարգերի և
          քաղաքակրթական ինքնության շուրջ։ Յուրաքանչյուր հարցադրում ունի իր առանձին քննարկման էջը,
          որտեղ ներկայացված են փորձագիտական դիրքորոշումները և բաց երկխոսությունը։
        </p>

        {/* Stats KPI Cards Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            className="glass-card"
            style={{
              padding: "1.25rem 1rem",
              textAlign: "center",
              borderRadius: "0.75rem",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "var(--gold-accent)",
                fontFamily: "var(--font-serif)",
              }}
            >
              {topics.filter((t) => t.status === "active" || t.status === "archived").length}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Հրապարակված Հարցադրումներ
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: "1.25rem 1rem",
              textAlign: "center",
              borderRadius: "0.75rem",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "#10b981",
                fontFamily: "var(--font-serif)",
              }}
            >
              {activeCount}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Ակտիվ Բանավեճեր
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: "1.25rem 1rem",
              textAlign: "center",
              borderRadius: "0.75rem",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "var(--gold-accent)",
                fontFamily: "var(--font-serif)",
              }}
            >
              {totalComments}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Գրանցված Կարծիքներ
            </div>
          </div>

          <div
            className="glass-card"
            style={{
              padding: "1.25rem 1rem",
              textAlign: "center",
              borderRadius: "0.75rem",
            }}
          >
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                color: "var(--text-primary)",
                fontFamily: "var(--font-serif)",
              }}
            >
              {topics.reduce((acc, t) => acc + (t.expertOpinionsCount ?? t.expertResponses?.length ?? 0), 0)}
            </div>

            <div
              style={{
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                marginTop: "0.25rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <PersonWithLoupeIcon size={14} color="var(--gold-accent)" />
              <span>Փորձագիտական Կարծիքներ</span>
            </div>
          </div>
        </div>

        {/* Action Button: Accessible to regular users and admins! */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "0.5rem",
          }}
        >
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="btn-primary"
            style={{
              padding: "0.75rem 1.6rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
              fontWeight: "600",
              borderRadius: "0.5rem",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(183, 121, 31, 0.25)",
            }}
          >
            <span>{isAdmin ? "⚡️" : "💡"}</span>
            <span>
              {isAdmin ? "Առաջարկել / Ստեղծել Հարցադրում (Admin)" : "Առաջարկել Նոր Հարցադրում"}
            </span>
          </button>
        </div>
      </div>

      {/* Admin Pending Review Banner */}
      {isAdmin && pendingCount > 0 && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(183, 121, 31, 0.08) 100%)",
            border: "1px solid #f59e0b",
            borderRadius: "0.85rem",
            padding: "1rem 1.5rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 4px 14px rgba(245, 158, 11, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.4rem" }}>⏳</span>
            <div>
              <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.98rem" }}>
                Առկա է <strong>{pendingCount}</strong> նոր առաջարկված հարցադրում, որը սպասում է Ձեր հաստատմանը
              </div>
              <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Օգտատերերի կողմից առաջարկված հարցադրումները հասանելի կդառնան հարթակում Ձեր հաստատումից հետո։
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            style={{
              background: "#f59e0b",
              color: "#ffffff",
              border: "none",
              padding: "0.5rem 1.2rem",
              borderRadius: "0.5rem",
              fontSize: "0.88rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
            }}
          >
            Դիտել Հերթը ({pendingCount}) →
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* SEARCH & FILTER CONTROLS BAR */}
      {/* ============================================================== */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem 1.75rem",
          marginBottom: "2.5rem",
          borderRadius: "1rem",
        }}
      >
        {/* Row 1: Search Input */}
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <div
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gold-accent)",
              fontSize: "1.1rem",
              pointerEvents: "none",
            }}
          >
            🔍
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Որոնել ըստ վերնագրի, բովանդակության, թեմայի (#12) կամ հեղինակի..."
            style={{
              width: "100%",
              padding: "0.85rem 2.8rem 0.85rem 3rem",
              background: "var(--input-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "0.6rem",
              color: "var(--text-primary)",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--gold-accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--card-border)")}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                fontSize: "1.1rem",
                cursor: "pointer",
                padding: "0.2rem",
                lineHeight: 1,
              }}
              title="Մաքրել որոնումը"
            >
              ✕
            </button>
          )}
        </div>

        {/* Row 2: Filter Pills & Dropdowns */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Status Pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                background: statusFilter === "all" ? "var(--gold-accent)" : "transparent",
                color: statusFilter === "all" ? "#ffffff" : "var(--text-secondary)",
                border: "1px solid var(--card-border)",
                transition: "all 0.2s ease",
              }}
            >
              Բոլորը ({topics.filter((t) => isAdmin || t.status === "active" || t.status === "archived" || (user?.uid && t.authorUid === user.uid)).length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                background: statusFilter === "active" ? "#10b981" : "transparent",
                color: statusFilter === "active" ? "#ffffff" : "var(--text-secondary)",
                border: "1px solid var(--card-border)",
                transition: "all 0.2s ease",
              }}
            >
              🟢 Ակտիվ ({activeCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("archived")}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                background: statusFilter === "archived" ? "var(--gold-accent)" : "transparent",
                color: statusFilter === "archived" ? "#ffffff" : "var(--text-secondary)",
                border: "1px solid var(--card-border)",
                transition: "all 0.2s ease",
              }}
            >
              📁 Արխիվ ({archivedCount})
            </button>

            {/* Admin: Pending Tab */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: statusFilter === "pending" ? "#f59e0b" : "rgba(245, 158, 11, 0.12)",
                  color: statusFilter === "pending" ? "#ffffff" : "#d97706",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>⏳ Հաստատման Սպասող</span>
                <span
                  style={{
                    background: statusFilter === "pending" ? "#ffffff" : "#f59e0b",
                    color: statusFilter === "pending" ? "#b45309" : "#ffffff",
                    fontSize: "0.72rem",
                    padding: "0.1rem 0.45rem",
                    borderRadius: "999px",
                    fontWeight: "700",
                  }}
                >
                  {pendingCount}
                </span>
              </button>
            )}

            {/* Regular User: My Pending Proposals Tab */}
            {!isAdmin && user && myPendingCount > 0 && (
              <button
                type="button"
                onClick={() => setStatusFilter("my_pending")}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: statusFilter === "my_pending" ? "#f59e0b" : "rgba(245, 158, 11, 0.12)",
                  color: statusFilter === "my_pending" ? "#ffffff" : "#d97706",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                ⏳ Իմ Առաջարկները ({myPendingCount})
              </button>
            )}
          </div>

          {/* Tag & Sort Selectors */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* Tag Filter */}
            {availableTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                style={{
                  padding: "0.45rem 0.9rem",
                  background: "var(--input-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.5rem",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="all">🏷️ Բոլոր Ուղղությունները</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: "0.45rem 0.9rem",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "0.5rem",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="recent">⚡️ Նորագույն</option>
              <option value="comments">💬 Ամենաշատ քննարկված</option>
              <option value="oldest">🕰 Ամենահին</option>
            </select>
          </div>
        </div>

        {/* Results Counter / Filter Feedback */}
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--card-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
          }}
        >
          <span>
            Ցուցադրված է <strong>{filteredTopics.length}</strong> հարցադրում
          </span>
          {(searchQuery || statusFilter !== "all" || selectedTag !== "all" || sortBy !== "recent") && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--gold-accent)",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              Մաքրել ֆիլտրերը
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TOPIC CARDS GRID */}
      {/* ============================================================== */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 0",
            color: "var(--text-secondary)",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
              animation: "pulse 1.5s infinite",
            }}
          >
            🏛
          </div>
          <p>Բեռնվում են հարցադրումները...</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            borderRadius: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.35rem",
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Համապատասխան հարցադրում չի գտնվել
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              marginBottom: "1.5rem",
              lineHeight: "1.6",
            }}
          >
            {statusFilter === "pending"
              ? "Այս պահին հաստատման սպասող նոր հարցադրումներ չկան։"
              : "Փորձեք փոխել որոնման բառերը կամ մաքրել ֆիլտրերը՝ բոլոր հարցադրումները դիտելու համար։"}
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn-primary"
            style={{ padding: "0.6rem 1.5rem", borderRadius: "0.5rem", cursor: "pointer" }}
          >
            Մաքրել Բոլոր Ֆիլտրերը
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {filteredTopics.map((topic) => {
            const commentCount = topic.commentsCount || 0;
            const expertCount = topic.expertOpinionsCount ?? topic.expertResponses?.length ?? 0;
            const isPending = topic.status === "pending";

            const isAuthor = user?.uid && topic.authorUid === user.uid;

            return (
              <div
                key={topic.id}
                className="glass-card"
                style={{
                  padding: "1.75rem",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  border: isPending
                    ? "1px solid rgba(245, 158, 11, 0.5)"
                    : "1px solid var(--card-border)",
                  background: isPending
                    ? "linear-gradient(145deg, rgba(245, 158, 11, 0.05) 0%, var(--card-bg) 100%)"
                    : "var(--card-bg)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Pinned Always to Top Right Corner */}
                <div
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.25rem",
                    zIndex: 10,
                  }}
                >
                  <TopicStatusIconBadge status={topic.status} />
                </div>

                <div>
                  {/* Category Tags & Civil Center */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginBottom: "0.85rem",
                      paddingRight: "2.75rem",
                      minHeight: "28px",
                    }}
                  >
                    {topic.civilizationTag && (
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                          background: "var(--input-bg)",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "0.3rem",
                          border: "1px solid var(--card-border)",
                        }}
                      >
                        🏷️ {topic.civilizationTag}
                      </span>
                    )}

                    {topic.centerName && (
                      <Link
                        href={topic.centerId ? `/centers/${topic.centerId}` : "#"}
                        onClick={(e) => {
                          if (!topic.centerId) e.preventDefault();
                          e.stopPropagation();
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "var(--gold-accent)",
                          background: "rgba(183, 121, 31, 0.12)",
                          padding: "0.2rem 0.65rem",
                          borderRadius: "0.3rem",
                          border: "1px solid rgba(183, 121, 31, 0.28)",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        title={`Ուղեղային Կենտրոն՝ ${topic.centerName}`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(183, 121, 31, 0.22)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(183, 121, 31, 0.12)";
                        }}
                      >
                        <span>🏛️</span>
                        <span>{topic.centerName}</span>
                      </Link>
                    )}
                  </div>




                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      lineHeight: "1.4",
                      color: "var(--text-primary)",
                      marginBottom: "0.75rem",
                      marginTop: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    <Link
                      href={`/dialogue/${topic.id}`}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                    >
                      {topic.title}
                    </Link>
                  </h3>

                  {/* Description preview */}
                  <p
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                      color: "var(--text-secondary)",
                      marginBottom: "1.25rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {topic.description}
                  </p>
                </div>

                {/* Details / Stats Bar */}
                <div>
                  {/* Author pending alert */}
                  {isPending && isAuthor && !isAdmin && (
                    <div
                      style={{
                        background: "rgba(245, 158, 11, 0.12)",
                        border: "1px dashed rgba(245, 158, 11, 0.4)",
                        borderRadius: "0.4rem",
                        padding: "0.4rem 0.6rem",
                        fontSize: "0.75rem",
                        color: "#b45309",
                        marginBottom: "0.75rem",
                      }}
                    >
                      ⏳ Ձեր առաջարկն ուղարկված է կազմկոմիտեի հաստատմանը
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.6rem",
                      padding: "0.75rem 0",
                      borderTop: "1px solid var(--card-border)",
                      borderBottom: "1px solid var(--card-border)",
                      marginBottom: "1rem",
                      fontSize: "0.82rem",
                    }}
                  >
                    {/* Comments Badge */}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "999px",
                        background:
                          commentCount > 0
                            ? "rgba(183, 121, 31, 0.12)"
                            : "var(--input-bg)",
                        color:
                          commentCount > 0
                            ? "var(--gold-accent)"
                            : "var(--text-secondary)",
                        fontWeight: "600",
                      }}
                      title="Գրանցված մեկնաբանությունների թիվը"
                    >
                      <span>💬</span>
                      <span>{commentCount} կարծիք</span>
                    </span>

                    {/* Expert opinions */}
                    {expertCount > 0 && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "999px",
                          background: "var(--input-bg)",
                          color: "var(--text-secondary)",
                          fontWeight: "500",
                        }}
                        title="Հրապարակված փորձագիտական դիրքորոշումներ"
                      >
                        <PersonWithLoupeIcon size={15} color="var(--gold-accent)" />
                        <span>{expertCount} փորձագետ</span>
                      </span>
                    )}

                    {/* Date */}
                    {topic.date && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "var(--text-secondary)",
                          padding: "0.25rem 0.4rem",
                        }}
                      >
                        <span>📅</span>
                        <span>{topic.date}</span>
                      </span>
                    )}

                    {/* Author */}
                    {topic.authorName && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "var(--text-secondary)",
                          padding: "0.25rem 0.4rem",
                        }}
                      >
                        <span>👤</span>
                        <span>{topic.authorName}</span>
                      </span>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <Link
                      href={`/dialogue/${topic.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        color: "var(--gold-accent)",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        textDecoration: "none",
                        transition: "gap 0.2s ease, color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.gap = "0.75rem";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.gap = "0.45rem";
                      }}
                    >
                      <span>
                        {topic.status === "active"
                          ? "Մասնակցել Քննարկմանը"
                          : topic.status === "pending"
                          ? "Դիտել Առաջարկը"
                          : "Դիտել Քննարկումը"}
                      </span>
                      <span>→</span>
                    </Link>

                    {/* Admin Action Buttons (Approve, Reject, Edit, Delete) */}
                    {isAdmin && (
                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                        {/* Approve button for pending topics */}
                        {isPending && (
                          <button
                            type="button"
                            onClick={(e) => handleApproveTopic(topic.id, e)}
                            style={{
                              background: "#10b981",
                              color: "#ffffff",
                              border: "none",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "0.35rem",
                              cursor: "pointer",
                              fontSize: "0.78rem",
                              fontWeight: "700",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
                            }}
                            title="Հաստատել և հրապարակել"
                          >
                            <span>✓</span>
                            <span>Հաստատել</span>
                          </button>
                        )}

                        {/* Reject button for pending topics */}
                        {isPending && (
                          <button
                            type="button"
                            onClick={(e) => handleRejectTopic(topic.id, e)}
                            style={{
                              background: "transparent",
                              color: "#ef4444",
                              border: "1px solid #ef4444",
                              padding: "0.35rem 0.6rem",
                              borderRadius: "0.35rem",
                              cursor: "pointer",
                              fontSize: "0.78rem",
                              fontWeight: "600",
                            }}
                            title="Մերժել հարցադրումը"
                          >
                            ✕
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleOpenEditModal(topic, e)}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--card-border)",
                            color: "var(--text-secondary)",
                            padding: "0.3rem 0.55rem",
                            borderRadius: "0.35rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                          title="Խմբագրել հարցադրումը"
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteTopic(topic.id, e)}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            padding: "0.3rem 0.55rem",
                            borderRadius: "0.35rem",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                          }}
                          title="Ջնջել հարցադրումը"
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: SUGGEST / CREATE NEW TOPIC (Regular users + Admins) */}
      {/* ============================================================== */}
      {isCreateModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            boxSizing: "border-box",
          }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem 2rem",
              background: "var(--bg-secondary)",
              borderRadius: "1rem",
              border: "1px solid var(--gold-accent)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.4rem",
                color: "var(--gold-accent)",
                marginTop: 0,
                marginBottom: "0.5rem",
              }}
            >
              {isAdmin
                ? "+ Առաջարկել Նոր Հարցադրում (Admin)"
                : "💡 Առաջարկել Հարցադրում Քննարկման Համար"}
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
                lineHeight: "1.5",
              }}
            >
              {isAdmin
                ? "Ադմինիստրատորի կողմից ստեղծված հարցադրումը կարող է միանգամից հրապարակվել կամ պահպանվել արխիվում։"
                : "Ներկայացրեք Ձեր հարցադրումը կամ փիլիսոփայական թեման։ Ադմինիստրատորի կողմից հաստատվելուց հետո այն կհրապարակվի հարթակում և կբացվի համընդհանուր քննարկման համար։"}
            </p>

            <form onSubmit={handleSaveNewTopic} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* If guest: ask for name & email */}
              {!user && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Ձեր Անունը / Կոչումը
                    </label>
                    <input
                      type="text"
                      required
                      value={guestAuthorName}
                      onChange={(e) => setGuestAuthorName(e.target.value)}
                      placeholder="Օրինակ՝ Արմեն Մնացականյան"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "var(--input-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "0.5rem",
                        color: "var(--text-primary)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Էլ․ հասցե (ծանուցման համար)
                    </label>
                    <input
                      type="email"
                      value={guestAuthorEmail}
                      onChange={(e) => setGuestAuthorEmail(e.target.value)}
                      placeholder="user@example.com"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background: "var(--input-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "0.5rem",
                        color: "var(--text-primary)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  Հարցադրման Համար
                </label>
                <input
                  type="text"
                  required
                  value={topicFormNumber}
                  onChange={(e) => setTopicFormNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  Հարցադրման Վերնագիր
                </label>
                <input
                  type="text"
                  required
                  value={topicFormTitle}
                  onChange={(e) => setTopicFormTitle(e.target.value)}
                  placeholder="Օրինակ՝ Թվային անթրոպոցիդ և մարդկային ինքնություն..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Քաղաքակրթական Ուղղություն / Թեգ
                  </label>
                  <input
                    type="text"
                    required
                    value={topicFormTag}
                    onChange={(e) => setTopicFormTag(e.target.value)}
                    placeholder="Օրինակ՝ Էթիկա & AI"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem",
                      color: "var(--text-primary)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Ժամանակաշրջան / Ամսաթիվ
                  </label>
                  <input
                    type="text"
                    required
                    value={topicFormDate}
                    onChange={(e) => setTopicFormDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem",
                      color: "var(--text-primary)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  🏛️ Քաղաքակրթական / Ուղեղային Կենտրոն (Կամընտրական)
                </label>
                <select
                  value={topicFormCenterId}
                  onChange={(e) => setTopicFormCenterId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">— Չընտրել (առանց կենտրոնի) —</option>
                  {civilCenters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.civSymbol} {c.name} ({c.civName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  Հարցադրման Խնդիրը և Նկարագրությունը
                </label>
                <textarea
                  required
                  rows={5}
                  value={topicFormDescription}
                  onChange={(e) => setTopicFormDescription(e.target.value)}
                  placeholder="Ներկայացրեք խնդրի հիմնական դրույթները, որոնց շուրջ պետք է ծավալվի քննարկումը..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    fontFamily: "inherit",
                    lineHeight: "1.6",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Status Select: Only Admins can set status directly; for regular users it is fixed as Pending */}
              {isAdmin ? (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Կարգավիճակ (Admin)
                  </label>
                  <select
                    value={topicFormStatus}
                    onChange={(e) => setTopicFormStatus(e.target.value as any)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="active">🟢 Ակտիվ (Բաց քննարկման համար)</option>
                    <option value="pending">⏳ Հաստատման սպասող</option>
                    <option value="archived">📁 Արխիվացված (Միայն դիտման համար)</option>
                  </select>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.82rem",
                    color: "#b45309",
                  }}
                >
                  ⏳ <strong>Հաստատման գործընթաց՝</strong> Ձեր առաջարկը կուղարկվի կազմկոմիտեի դիտարկմանը և
                  հարթակում կհրապարակվի ադմինիստրատորի հաստատումից հետո։
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "transparent",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-secondary)",
                    borderRadius: "0.4rem",
                    cursor: "pointer",
                  }}
                >
                  Չեղարկել
                </button>
                <button
                  type="submit"
                  disabled={savingTopic}
                  className="btn-primary"
                  style={{ padding: "0.6rem 1.5rem" }}
                >
                  {savingTopic
                    ? "Ուղարկվում է..."
                    : isAdmin
                    ? "✓ Հրապարակել Հարցադրումը"
                    : "📤 Ուղարկել Հաստատման"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADMIN MODAL: EDIT TOPIC */}
      {/* ============================================================== */}
      {editingTopic && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            boxSizing: "border-box",
          }}
          onClick={() => setEditingTopic(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem 2rem",
              background: "var(--bg-secondary)",
              borderRadius: "1rem",
              border: "1px solid var(--gold-accent)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.4rem",
                color: "var(--gold-accent)",
                marginTop: 0,
                marginBottom: "0.5rem",
              }}
            >
              Խմբագրել Հարցադրումը (Admin)
            </h3>

            <form onSubmit={handleUpdateTopic} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  Հարցադրման Համար
                </label>
                <input
                  type="text"
                  required
                  value={topicFormNumber}
                  onChange={(e) => setTopicFormNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  Հարցադրման Վերնագիր
                </label>
                <input
                  type="text"
                  required
                  value={topicFormTitle}
                  onChange={(e) => setTopicFormTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Քաղաքակրթական Ուղղություն
                  </label>
                  <input
                    type="text"
                    required
                    value={topicFormTag}
                    onChange={(e) => setTopicFormTag(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem",
                      color: "var(--text-primary)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "0.35rem",
                    }}
                  >
                    Ամսաթիվ
                  </label>
                  <input
                    type="text"
                    required
                    value={topicFormDate}
                    onChange={(e) => setTopicFormDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "var(--input-bg)",
                      border: "1px solid var(--card-border)",
                      borderRadius: "0.5rem",
                      color: "var(--text-primary)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  🏛️ Քաղաքակրթական / Ուղեղային Կենտրոն (Կամընտրական)
                </label>
                <select
                  value={topicFormCenterId}
                  onChange={(e) => setTopicFormCenterId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">— Չընտրել (առանց կենտրոնի) —</option>
                  {civilCenters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.civSymbol} {c.name} ({c.civName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  Նկարագրություն
                </label>
                <textarea
                  required
                  rows={5}
                  value={topicFormDescription}
                  onChange={(e) => setTopicFormDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    fontFamily: "inherit",
                    lineHeight: "1.6",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                  }}
                >
                  Կարգավիճակ
                </label>
                <select
                  value={topicFormStatus}
                  onChange={(e) => setTopicFormStatus(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="active">🟢 Ակտիվ (Բաց քննարկում)</option>
                  <option value="pending">⏳ Հաստատման Սպասող</option>
                  <option value="archived">📁 Արխիվացված</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setEditingTopic(null)}
                  style={{
                    padding: "0.6rem 1.25rem",
                    background: "transparent",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-secondary)",
                    borderRadius: "0.4rem",
                    cursor: "pointer",
                  }}
                >
                  Չեղարկել
                </button>
                <button
                  type="submit"
                  disabled={savingTopic}
                  className="btn-primary"
                  style={{ padding: "0.6rem 1.5rem" }}
                >
                  {savingTopic ? "Պահպանվում է..." : "✓ Պահպանել Փոփոխությունները"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function DialogueHubPage() {
  return (
    <Suspense
      fallback={
        <main className="container" style={{ textAlign: "center", padding: "5rem 0" }}>
          <p style={{ color: "var(--text-secondary)" }}>Բեռնվում է երկխոսության հարթակը...</p>
        </main>
      }
    >
      <DialogueHubContent />
    </Suspense>
  );
}
