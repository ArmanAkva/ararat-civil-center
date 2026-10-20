"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { defaultForumContent } from "@/lib/defaultSiteContent";
import {
  ForumPageContent,
  ForumAgendaItem,
  ForumMessageItem,
  ForumOrganizer,
  ForumSuggestion,
} from "@/types/content";
import { USER_ROLES } from "@/types/auth";
import { getPageContent } from "@/lib/contentService";
import {
  getForumSuggestions,
  createForumSuggestion,
  toggleLikeSuggestion,
  addSuggestionReply,
  deleteForumSuggestion,
} from "@/lib/forumService";
import { useEditMode } from "@/context/EditModeContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/cms/EditableText";
import EditCardModal from "@/components/cms/EditCardModal";

// Forum Modals
import ForumDateProposalModal from "@/components/forum/ForumDateProposalModal";
import ForumManifestoProposalModal from "@/components/forum/ForumManifestoProposalModal";
import ForumCommentModal from "@/components/forum/ForumCommentModal";
import ForumOwnerModal from "@/components/forum/ForumOwnerModal";
import ForumOrganizerModal from "@/components/forum/ForumOrganizerModal";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return dateStr || "";
  }
}

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
}

function calculateCountdown(targetDateStr: string = "2027-01-22T12:00:00"): CountdownValues {
  const target = new Date(targetDateStr).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const dStr = String(days).padStart(3, "0");
  const hStr = String(hours).padStart(2, "0");
  const mStr = String(minutes).padStart(2, "0");
  const sStr = String(seconds).padStart(2, "0");

  return {
    days,
    hours,
    minutes,
    seconds,
    formatted: `${dStr} : ${hStr} : ${mStr} : ${sStr}`,
  };
}

const STATIC_INITIAL_COUNTDOWN: CountdownValues = {
  days: 277,
  hours: 0,
  minutes: 0,
  seconds: 0,
  formatted: "277 : 00 : 00 : 00",
};

export default function Forum() {
  const [content, setContent] = useState<ForumPageContent>(defaultForumContent);
  const [suggestions, setSuggestions] = useState<ForumSuggestion[]>(
    defaultForumContent.suggestions || []
  );

  const [mounted, setMounted] = useState(false);
  const [countdownState, setCountdownState] = useState<CountdownValues>(STATIC_INITIAL_COUNTDOWN);

  useEffect(() => {
    setMounted(true);
    const target = content.targetDateTime || "2027-01-22T12:00:00";
    const update = () => {
      setCountdownState(calculateCountdown(target));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [content.targetDateTime]);

  const { isEditMode, savePageField } = useEditMode();
  const { user, profile, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState(1);
  const [manifestoLikeCount, setManifestoLikeCount] = useState(142);
  const [hasLikedManifesto, setHasLikedManifesto] = useState(false);

  // Filter for public suggestions section
  const [suggestionFilter, setSuggestionFilter] = useState<
    "all" | "manifesto" | "message" | "agenda" | "date_location"
  >("all");

  // Inline comment state for active message
  const [quickCommentText, setQuickCommentText] = useState("");
  const [sendingQuickComment, setSendingQuickComment] = useState(false);

  // Reply inline box state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Modals state
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isManifestoModalOpen, setIsManifestoModalOpen] = useState(false);
  const [commentModalState, setCommentModalState] = useState<{
    isOpen: boolean;
    initialTarget?: {
      type: "message" | "agenda" | "manifesto" | "date_location" | "general";
      targetId?: string | number;
      targetTitle?: string;
    };
  }>({ isOpen: false });

  // Organizer & Owner Modals
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [organizerModalState, setOrganizerModalState] = useState<{
    isOpen: boolean;
    organizer?: ForumOrganizer | null;
  }>({ isOpen: false, organizer: null });

  // Agenda Modals
  const [editingAgenda, setEditingAgenda] = useState<{
    index: number;
    data: ForumAgendaItem;
  } | null>(null);
  const [isAddingAgenda, setIsAddingAgenda] = useState(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let isMounted = true;

    // Load page content
    getPageContent<ForumPageContent>("forum", defaultForumContent).then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    });

    // Load forum suggestions
    getForumSuggestions().then((items) => {
      if (isMounted && items && items.length > 0) {
        setSuggestions(items);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Manifesto like toggle
  const handleManifestoLike = () => {
    if (!hasLikedManifesto) {
      setManifestoLikeCount((prev) => prev + 1);
      setHasLikedManifesto(true);
    } else {
      setManifestoLikeCount((prev) => prev - 1);
      setHasLikedManifesto(false);
    }
  };

  // Submit suggestion from Date/RSVP modal
  const handleDateProposalSubmit = async (
    data: Omit<ForumSuggestion, "id" | "createdAt" | "likesCount" | "likedBy" | "replies">
  ) => {
    const newSugg = await createForumSuggestion(data);
    setSuggestions((prev) => [newSugg, ...prev]);
    showToast("Ձեր առաջարկը / մասնակցության հայտը հաջողությամբ գրանցվեց:");
  };

  // Submit proposal from Manifesto modal
  const handleManifestoProposalSubmit = async (
    data: Omit<ForumSuggestion, "id" | "createdAt" | "likesCount" | "likedBy" | "replies">
  ) => {
    const newSugg = await createForumSuggestion(data);
    setSuggestions((prev) => [newSugg, ...prev]);
    showToast("Մանիֆեստի առաջարկն ուղարկվեց խմբագրական խորհրդին:");
  };

  // Submit from Comment/Suggestion modal
  const handleCommentModalSubmit = async (
    data: Omit<ForumSuggestion, "id" | "createdAt" | "likesCount" | "likedBy" | "replies">
  ) => {
    const newSugg = await createForumSuggestion(data);
    setSuggestions((prev) => [newSugg, ...prev]);
    showToast("Առաջարկը / մեկնաբանությունը հաջողությամբ ավելացվեց:");
  };

  // Quick comment under current message
  const handleSendQuickComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCommentText.trim()) return;

    setSendingQuickComment(true);
    try {
      const activeMsg = content.messages.find((m) => m.id === activeTab);
      const newSugg = await createForumSuggestion({
        type: "message",
        targetId: activeTab,
        targetTitle: activeMsg ? `${activeMsg.title}` : `Ուղերձ #${activeTab}`,
        category: "suggestion",
        authorName: profile?.displayName || user?.displayName || "Հետազոտող",
        authorEmail: user?.email || undefined,
        authorAffiliation: profile?.civilizationAffiliation || "Արարատյան Կենտրոն",
        authorRole: profile?.role || "member",
        authorUid: user?.uid,
        title: `Դիտարկում «${activeMsg?.title || "Ուղերձ"}»-ի վերաբերյալ`,
        content: quickCommentText.trim(),
        status: "approved",
      });

      setSuggestions((prev) => [newSugg, ...prev]);
      setQuickCommentText("");
      showToast("Ձեր առաջարկը գրանցվեց ուղերձի քննարկումներում:");
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ:");
    } finally {
      setSendingQuickComment(false);
    }
  };

  // Upvote/Like suggestion
  const handleToggleLikeSuggestion = async (suggestionId: string) => {
    const userIdentifier = user?.uid || "guest-user";
    const result = await toggleLikeSuggestion(suggestionId, userIdentifier);

    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id !== suggestionId) return s;
        const likedBy = s.likedBy || [];
        const isLiked = likedBy.includes(userIdentifier);
        const newLikedBy = isLiked
          ? likedBy.filter((id) => id !== userIdentifier)
          : [...likedBy, userIdentifier];
        return {
          ...s,
          likesCount: result.likesCount,
          likedBy: newLikedBy,
        };
      })
    );
  };

  // Add reply to suggestion
  const handleSendReply = async (suggestionId: string) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const replyData = {
        authorName: profile?.displayName || user?.displayName || "Հետազոտող",
        authorRole: profile?.role || "member",
        content: replyText.trim(),
      };
      await addSuggestionReply(suggestionId, replyData);

      setSuggestions((prev) =>
        prev.map((s) => {
          if (s.id !== suggestionId) return s;
          return {
            ...s,
            replies: [
              ...(s.replies || []),
              {
                id: `rep-${Date.now()}`,
                ...replyData,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        })
      );

      setReplyText("");
      setReplyingToId(null);
      showToast("Պատասխանը հաջողությամբ ավելացվեց:");
    } catch (err) {
      console.error(err);
      alert("Չհաջողվեց ավելացնել պատասխանը:");
    } finally {
      setSendingReply(false);
    }
  };

  // Delete suggestion
  const handleDeleteSuggestion = async (id: string) => {
    if (!confirm("Իսկապե՞ս ցանկանում եք հեռացնել այս առաջարկը:")) return;
    await deleteForumSuggestion(id);
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    showToast("Առաջարկը հեռացվեց:");
  };

  // Save Owner
  const handleSaveOwner = async (owner: ForumOrganizer) => {
    setContent((prev) => ({ ...prev, organizerOwner: owner }));
    await savePageField("forum", "organizerOwner", owner);

    // Also update this organizer inside organizers list if exists, or prepend
    const existingList = content.organizers || defaultForumContent.organizers || [];
    const index = existingList.findIndex((o) => o.id === owner.id || o.isOwner);
    let updatedList: ForumOrganizer[];
    if (index !== -1) {
      updatedList = [...existingList];
      updatedList[index] = { ...owner, isOwner: true };
    } else {
      updatedList = [{ ...owner, isOwner: true }, ...existingList];
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

    // If marked as owner, also update organizerOwner
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

  const activeMessageIndex = content.messages.findIndex((m) => m.id === activeTab);
  const currentMessage =
    activeMessageIndex !== -1 ? content.messages[activeMessageIndex] : content.messages[0];

  // Suggestions for active message tab
  const activeMessageSuggestions = suggestions.filter(
    (s) => s.type === "message" && String(s.targetId) === String(activeTab)
  );

  // Filtered list for public suggestions block
  const filteredSuggestions = suggestions.filter((s) => {
    if (suggestionFilter === "all") return true;
    return s.type === suggestionFilter;
  });

  const owner = content.organizerOwner || defaultForumContent.organizerOwner;
  const organizersList = content.organizers || defaultForumContent.organizers || [];

  return (
    <main className="container" style={{ paddingBottom: "6rem" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="forum-toast-notification"
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
            animation: "modalFadeIn 0.3s ease",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subnav switcher */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid var(--card-border)",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <span
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: "999px",
              background: "var(--gold-accent)",
              color: "#000",
              fontWeight: "600",
              fontSize: "0.85rem",
            }}
          >
            🏛️ Ֆորումի Ծրագիր և Օրակարգ
          </span>
          <Link
            href="/forum/organizers"
            id="subnav-link-organizers"
            className="forum-pill-btn"
            style={{ textDecoration: "none" }}
          >
            👥 Կազմկոմիտե և Թիմ →
          </Link>
        </div>
      </div>

      {/* =========================================================
          BLOCK 1: Countdown & Dates
          ========================================================= */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "4.5rem",
          marginTop: "1.5rem",
          padding: "4.5rem 2rem",
          background:
            "linear-gradient(135deg, rgba(212, 175, 55, 0.09) 0%, rgba(10, 14, 26, 0.88) 100%)",
          borderRadius: "1.25rem",
          border: "1px solid var(--gold-accent)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 15px 45px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(212, 175, 55, 0.15)",
              border: "1px solid var(--gold-accent)",
              color: "var(--gold-accent)",
              padding: "0.3rem 1rem",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: "600",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1.2rem",
            }}
          >
            Քաղաքակրթությունների Համաշխարհային Հանդիպում
          </div>

          <EditableText
            tag="h1"
            label="Ֆորումի Ժամկետներ"
            value={content.datesTitle}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "3.2rem",
              color: "var(--gold-accent)",
              margin: "0 0 1rem 0",
              lineHeight: 1.2,
            }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, datesTitle: val }));
              await savePageField("forum", "datesTitle", val);
            }}
          />

          <EditableText
            tag="h2"
            label="Անցկացման Վայրեր"
            value={content.locationTitle}
            style={{
              fontSize: "1.45rem",
              fontWeight: "400",
              marginBottom: "2rem",
              color: "var(--text-secondary)",
            }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, locationTitle: val }));
              await savePageField("forum", "locationTitle", val);
            }}
          />

          {/* Live Countdown Display */}
          <div
            id="forum-live-countdown"
            suppressHydrationWarning
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.85rem",
              marginBottom: "1.2rem",
              flexWrap: "wrap",
            }}
          >
            {/* Days Block */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid var(--gold-accent)",
                borderRadius: "0.75rem",
                padding: "0.85rem 1.4rem",
                minWidth: "90px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                suppressHydrationWarning
                style={{
                  fontSize: "2.6rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-mono)",
                  color: "var(--gold-accent)",
                  lineHeight: 1.1,
                }}
              >
                {String(countdownState.days).padStart(3, "0")}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                  fontWeight: "600",
                }}
              >
                ՕՐ
              </div>
            </div>

            <span style={{ fontSize: "2rem", color: "var(--gold-accent)", fontWeight: "bold" }}>:</span>

            {/* Hours Block */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid var(--gold-accent)",
                borderRadius: "0.75rem",
                padding: "0.85rem 1.4rem",
                minWidth: "90px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                suppressHydrationWarning
                style={{
                  fontSize: "2.6rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-mono)",
                  color: "var(--gold-accent)",
                  lineHeight: 1.1,
                }}
              >
                {String(countdownState.hours).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                  fontWeight: "600",
                }}
              >
                ԺԱՄ
              </div>
            </div>

            <span style={{ fontSize: "2rem", color: "var(--gold-accent)", fontWeight: "bold" }}>:</span>

            {/* Minutes Block */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid var(--gold-accent)",
                borderRadius: "0.75rem",
                padding: "0.85rem 1.4rem",
                minWidth: "90px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                suppressHydrationWarning
                style={{
                  fontSize: "2.6rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-mono)",
                  color: "var(--gold-accent)",
                  lineHeight: 1.1,
                }}
              >
                {String(countdownState.minutes).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                  fontWeight: "600",
                }}
              >
                ՐՈՊԵ
              </div>
            </div>

            <span style={{ fontSize: "2rem", color: "var(--gold-accent)", fontWeight: "bold" }}>:</span>

            {/* Seconds Block */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                border: "1px solid var(--gold-accent)",
                borderRadius: "0.75rem",
                padding: "0.85rem 1.4rem",
                minWidth: "90px",
                textAlign: "center",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                suppressHydrationWarning
                style={{
                  fontSize: "2.6rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-mono)",
                  color: "var(--gold-accent)",
                  lineHeight: 1.1,
                }}
              >
                {String(countdownState.seconds).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.12em",
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                  fontWeight: "600",
                }}
              >
                ՎԱՅՐԿՅԱՆ
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              marginBottom: "2.2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            <span>⏰ Մեկնարկ՝ <strong>22 Հունվարի, 2027թ. ժամը 12:00-ին</strong></span>
            {isEditMode && (
              <button
                type="button"
                id="btn-edit-target-datetime"
                onClick={async () => {
                  const current = content.targetDateTime || "2027-01-22T12:00:00";
                  const input = prompt(
                    "Մուտքագրեք մեկնարկի ամսաթիվն ու ժամը (ISO ձևաչափով՝ YYYY-MM-DDTHH:mm:ss):",
                    current
                  );
                  if (input && input.trim()) {
                    setContent((prev) => ({ ...prev, targetDateTime: input.trim() }));
                    await savePageField("forum", "targetDateTime", input.trim());
                  }
                }}
                style={{
                  background: "rgba(212, 175, 55, 0.15)",
                  color: "var(--gold-accent)",
                  border: "1px solid var(--gold-accent)",
                  borderRadius: "0.4rem",
                  padding: "0.2rem 0.5rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                ✎ Փոխել Ժամը
              </button>
            )}
          </div>

          {/* Trigger Date / RSVP Modal */}
          <button
            id="btn-open-date-modal"
            type="button"
            onClick={() => setIsDateModalOpen(true)}
            className="btn-primary"
            style={{
              background: "transparent",
              border: "1.5px solid var(--gold-accent)",
              color: "var(--gold-accent)",
              padding: "0.85rem 2.2rem",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              transition: "all 0.25s ease",
            }}
          >
            <span>🗓️</span> Առաջարկել այլընտրանքային ժամկետ / Հաստատել մասնակցությունը
          </button>
        </div>
      </div>

      {/* =========================================================
          BLOCK 2: Interactive Manifesto
          ========================================================= */}
      <EditableText
        tag="h2"
        label="Մանիֆեստի Բաժնի Վերնագիր"
        value={content.manifestoTitle}
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--gold-accent)",
          borderBottom: "1px solid var(--card-border)",
          paddingBottom: "1rem",
          marginBottom: "1.8rem",
          fontSize: "1.9rem",
        }}
        onSave={async (val) => {
          setContent((prev) => ({ ...prev, manifestoTitle: val }));
          await savePageField("forum", "manifestoTitle", val);
        }}
      />

      <div
        style={{
          background: "var(--card-bg)",
          padding: "2.5rem",
          borderRadius: "1rem",
          border: "1px solid var(--card-border)",
          marginBottom: "4.5rem",
          boxShadow: "0 6px 25px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            marginBottom: "1rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "290px" }}>
            <span
              style={{
                fontWeight: "bold",
                color: "var(--gold-accent)",
                marginRight: "0.5rem",
                fontSize: "1.15rem",
              }}
            >
              Ի՞նչ.
            </span>
            <EditableText
              tag="span"
              multiline
              label="Մանիֆեստի Նկարագրություն"
              value={content.manifestoWhat}
              style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "var(--text-secondary)" }}
              onSave={async (val) => {
                setContent((prev) => ({ ...prev, manifestoWhat: val }));
                await savePageField("forum", "manifestoWhat", val);
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              id="btn-manifesto-like"
              onClick={handleManifestoLike}
              style={{
                background: hasLikedManifesto ? "rgba(212, 175, 55, 0.22)" : "var(--input-bg)",
                border: "1px solid var(--gold-accent)",
                color: "var(--gold-accent)",
                padding: "0.55rem 1.2rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
              }}
            >
              <span>👍</span> {manifestoLikeCount}
            </button>

            {/* Trigger Manifesto Proposal Modal */}
            <button
              id="btn-open-manifesto-modal"
              onClick={() => setIsManifestoModalOpen(true)}
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-primary)",
                padding: "0.55rem 1.2rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
              }}
            >
              <span>📝</span> Առաջարկ
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          BLOCK 3: 3 Core Messages & Dedicated Comments
          ========================================================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--card-border)",
          paddingBottom: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--gold-accent)",
            margin: 0,
            fontSize: "1.9rem",
          }}
        >
          Օրակարգային 3 Ուղերձներ և Քննարկում
        </h2>
        <button
          id="btn-open-message-comment-modal"
          type="button"
          onClick={() =>
            setCommentModalState({
              isOpen: true,
              initialTarget: {
                type: "message",
                targetId: activeTab,
                targetTitle: currentMessage?.title,
              },
            })
          }
          className="btn-primary"
          style={{ fontSize: "0.88rem", padding: "0.5rem 1.1rem" }}
        >
          + Ավելացնել Առաջարկ / Դիտարկում
        </button>
      </div>

      <div style={{ marginBottom: "4.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {content.messages.map((msg, idx) => {
            const count = suggestions.filter(
              (s) => s.type === "message" && String(s.targetId) === String(msg.id)
            ).length;

            return (
              <button
                key={msg.id || idx}
                id={`tab-message-${msg.id}`}
                onClick={() => setActiveTab(msg.id)}
                style={{
                  background: activeTab === msg.id ? "var(--gold-accent)" : "var(--card-bg)",
                  color: activeTab === msg.id ? "#000" : "var(--text-primary)",
                  border: "1px solid var(--card-border)",
                  padding: "0.85rem 1.6rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: activeTab === msg.id ? "bold" : "normal",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <EditableText
                  tag="span"
                  label={`Ուղերձ ${idx + 1} Կոճակ`}
                  value={msg.title}
                  onSave={async (val) => {
                    const updated = [...content.messages];
                    updated[idx] = { ...updated[idx], title: val };
                    setContent((prev) => ({ ...prev, messages: updated }));
                    await savePageField("forum", "messages", updated);
                  }}
                />
                {count > 0 && (
                  <span
                    style={{
                      background: activeTab === msg.id ? "#000" : "rgba(212, 175, 55, 0.2)",
                      color: activeTab === msg.id ? "var(--gold-accent)" : "var(--gold-accent)",
                      fontSize: "0.75rem",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "999px",
                      fontWeight: "bold",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          style={{
            background: "var(--card-bg)",
            padding: "2.5rem",
            borderRadius: "1rem",
            border: "1px solid var(--card-border)",
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.05)",
          }}
        >
          {currentMessage && (
            <div style={{ marginBottom: "2.5rem" }}>
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
                Հիմնական Դրույթ
              </div>
              <EditableText
                tag="p"
                multiline
                label={`Ուղերձ #${currentMessage.id} Բովանդակություն`}
                value={currentMessage.content}
                style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "var(--text-primary)", margin: 0 }}
                onSave={async (val) => {
                  const updated = [...content.messages];
                  const index = updated.findIndex((m) => m.id === currentMessage.id);
                  if (index !== -1) {
                    updated[index] = { ...updated[index], content: val };
                    setContent((prev) => ({ ...prev, messages: updated }));
                    await savePageField("forum", "messages", updated);
                  }
                }}
              />
            </div>
          )}

          {/* Quick Comment submission box */}
          <form
            id="form-quick-message-comment"
            onSubmit={handleSendQuickComment}
            style={{
              background: "var(--input-bg)",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--card-border)",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "var(--text-primary)",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>💬</span> Ավելացնել առաջարկ «{currentMessage?.title}»-ի շուրջ
            </div>
            <textarea
              id="input-quick-comment-text"
              placeholder={`Ձեր առաջարկը կամ դիտարկումը «${currentMessage?.title}»-ի վերաբերյալ...`}
              value={quickCommentText}
              onChange={(e) => setQuickCommentText(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--card-border)",
                color: "var(--text-primary)",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                boxSizing: "border-box",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
              rows={3}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                Հեղինակ՝ {profile?.displayName || user?.displayName || "Հետազոտող"} •{" "}
                {profile?.civilizationAffiliation || "Արարատյան Կենտրոն"}
              </span>
              <button
                type="submit"
                id="btn-submit-quick-comment"
                disabled={sendingQuickComment || !quickCommentText.trim()}
                className="btn-primary"
                style={{ padding: "0.6rem 1.8rem", fontSize: "0.9rem" }}
              >
                {sendingQuickComment ? "Ուղարկվում է..." : "Ուղարկել Առաջարկը"}
              </button>
            </div>
          </form>

          {/* List of comments for this message */}
          <div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "var(--gold-accent)",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--card-border)",
                paddingBottom: "0.5rem",
              }}
            >
              Քննարկումներ և Առաջարկներ ({activeMessageSuggestions.length})
            </div>

            {activeMessageSuggestions.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", fontStyle: "italic" }}>
                Այս ուղերձի շուրջ դեռ առաջարկներ չեն գրանցվել։ Եղեք առաջինը։
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeMessageSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="forum-suggestion-card"
                    style={{ background: "var(--input-bg)", padding: "1.25rem" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                          {item.authorName}
                        </span>
                        {item.authorRole && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "999px",
                              background: USER_ROLES[item.authorRole as keyof typeof USER_ROLES]?.badgeBg || "rgba(212, 175, 55, 0.15)",
                              color: USER_ROLES[item.authorRole as keyof typeof USER_ROLES]?.badgeColor || "var(--gold-accent)",
                              border: `1px solid ${USER_ROLES[item.authorRole as keyof typeof USER_ROLES]?.badgeBorder || "var(--card-border)"}`,
                            }}
                          >
                            {USER_ROLES[item.authorRole as keyof typeof USER_ROLES]?.labelHy || item.authorRole}
                          </span>
                        )}
                        {item.authorAffiliation && (
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            • {item.authorAffiliation}
                          </span>
                        )}
                      </div>
                      <span suppressHydrationWarning style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <p style={{ margin: "0.4rem 0 0.8rem", color: "var(--text-primary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                      {item.content}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleLikeSuggestion(item.id)}
                        className={`forum-like-btn ${item.likedBy?.includes(user?.uid || "guest-user") ? "liked" : ""}`}
                      >
                        👍 {item.likesCount || 0}
                      </button>

                      <button
                        type="button"
                        onClick={() => setReplyingToId(replyingToId === item.id ? null : item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--gold-accent)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        💬 Պատասխանել
                      </button>

                      {(isAdmin || item.authorUid === user?.uid) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSuggestion(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            marginLeft: "auto",
                          }}
                        >
                          Ջնջել
                        </button>
                      )}
                    </div>

                    {/* Replies */}
                    {item.replies && item.replies.length > 0 && (
                      <div
                        style={{
                          marginTop: "0.85rem",
                          paddingLeft: "1rem",
                          borderLeft: "2px solid var(--gold-accent)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {item.replies.map((rep) => (
                          <div key={rep.id} style={{ fontSize: "0.88rem" }}>
                            <strong style={{ color: "var(--gold-accent)" }}>{rep.authorName}: </strong>
                            <span style={{ color: "var(--text-secondary)" }}>{rep.content}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline reply box */}
                    {replyingToId === item.id && (
                      <div style={{ marginTop: "0.85rem", display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          placeholder="Գրեք Ձեր պատասխանը..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "0.45rem 0.75rem",
                            borderRadius: "0.4rem",
                            border: "1px solid var(--card-border)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            fontSize: "0.88rem",
                          }}
                        />
                        <button
                          type="button"
                          disabled={sendingReply}
                          onClick={() => handleSendReply(item.id)}
                          className="btn-primary"
                          style={{ padding: "0.45rem 1rem", fontSize: "0.85rem" }}
                        >
                          Ուղարկել
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          BLOCK 4: 3-Day Agenda & Suggestions
          ========================================================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          borderBottom: "1px solid var(--card-border)",
          paddingBottom: "1rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--gold-accent)",
              margin: 0,
              fontSize: "1.9rem",
            }}
          >
            3-Օրյա Օրակարգ (Նախնական)
          </h2>
          <p style={{ margin: "0.2rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Ծրագրային հիմնական հանգրվանները և քննարկումների վայրերը
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            id="btn-propose-agenda-change"
            onClick={() =>
              setCommentModalState({
                isOpen: true,
                initialTarget: { type: "agenda", targetTitle: "3-Օրյա Օրակարգ" },
              })
            }
            className="forum-pill-btn"
          >
            💡 Առաջարկել Լրացում Օրակարգում
          </button>

          {isEditMode && (
            <button
              type="button"
              id="btn-add-agenda-item"
              onClick={() => setIsAddingAgenda(true)}
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }}
            >
              + Ավելացնել Օրակարգ
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gap: "1.5rem", marginBottom: "4.5rem" }}>
        {content.agenda.map((item, idx) => (
          <div key={item.id || idx} className="glass-card" style={{ padding: "1.8rem", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              {/* Suggestion for this specific day */}
              <button
                type="button"
                id={`btn-suggest-day-${idx}`}
                onClick={() =>
                  setCommentModalState({
                    isOpen: true,
                    initialTarget: {
                      type: "agenda",
                      targetId: item.id,
                      targetTitle: `${item.day} (${item.title})`,
                    },
                  })
                }
                style={{
                  background: "var(--input-bg)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.4rem",
                  padding: "0.3rem 0.65rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                💡 Առաջարկ
              </button>

              {isEditMode && (
                <button
                  type="button"
                  id={`btn-edit-day-${idx}`}
                  onClick={() => setEditingAgenda({ index: idx, data: item })}
                  style={{
                    background: "rgba(212, 175, 55, 0.2)",
                    color: "var(--gold-accent)",
                    border: "1px solid var(--gold-accent)",
                    borderRadius: "0.4rem",
                    padding: "0.3rem 0.65rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  ✎ Խմբագրել
                </button>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
                paddingRight: "8rem",
              }}
            >
              <EditableText
                tag="span"
                label="Օրվա Անվանում"
                value={item.day}
                style={{ fontWeight: "bold", color: "var(--gold-accent)", fontSize: "1.1rem" }}
                onSave={async (val) => {
                  const updated = [...content.agenda];
                  updated[idx] = { ...updated[idx], day: val };
                  setContent((prev) => ({ ...prev, agenda: updated }));
                  await savePageField("forum", "agenda", updated);
                }}
              />
              <span style={{ color: "var(--text-secondary)" }}>|</span>
              <EditableText
                tag="h3"
                label="Օրվա Վայր / Վերնագիր"
                value={item.title}
                style={{ margin: 0, fontSize: "1.1rem" }}
                onSave={async (val) => {
                  const updated = [...content.agenda];
                  updated[idx] = { ...updated[idx], title: val };
                  setContent((prev) => ({ ...prev, agenda: updated }));
                  await savePageField("forum", "agenda", updated);
                }}
              />
            </div>

            <EditableText
              tag="p"
              multiline
              label="Օրվա Ծրագրի Նկարագրություն"
              value={item.description}
              style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0, lineHeight: "1.6" }}
              onSave={async (val) => {
                const updated = [...content.agenda];
                updated[idx] = { ...updated[idx], description: val };
                setContent((prev) => ({ ...prev, agenda: updated }));
                await savePageField("forum", "agenda", updated);
              }}
            />
          </div>
        ))}
      </div>

      {/* =========================================================
          BLOCK 5: Leadership & Organizers (Compact Preview)
          ========================================================= */}
      <div
        id="forum-organizers-compact-preview"
        style={{
          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(10, 14, 26, 0.7) 100%)",
          border: "1px solid var(--gold-accent)",
          borderRadius: "1rem",
          padding: "2rem 2.5rem",
          marginBottom: "4.5rem",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(212, 175, 55, 0.15)",
                border: "1px solid var(--gold-accent)",
                color: "var(--gold-accent)",
                padding: "0.2rem 0.7rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.6rem",
              }}
            >
              👑 ՖՈՐՈՒՄԻ ՂԵԿԱՎԱՐՈՒԹՅՈՒՆ
            </div>

            <h2
              id="forum-organizers-section-title"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--text-primary)",
                margin: "0 0 0.5rem 0",
                fontSize: "1.65rem",
              }}
            >
              Ֆորումի Ղեկավարություն և Կազմկոմիտե
            </h2>

            {owner && (
              <p style={{ margin: "0 0 0.4rem 0", fontSize: "1.05rem", color: "var(--gold-accent)", fontWeight: "500" }}>
                <strong>{owner.name}</strong> — {owner.role} <span style={{ color: "var(--text-secondary)" }}>({owner.affiliation})</span>
              </p>
            )}

            <p style={{ margin: 0, fontSize: "0.92rem", color: "var(--text-secondary)" }}>
              Կազմկոմիտեն ներառում է {organizersList.length} անդամներ (գիտական քարտուղարություն, միջազգային հարաբերություններ, լոգիստիկա և թվային հարթակ)։
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/forum/organizers"
              id="btn-navigate-to-organizers-page"
              className="btn-primary"
              style={{
                textDecoration: "none",
                fontSize: "0.95rem",
                padding: "0.75rem 1.8rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 15px rgba(212, 175, 55, 0.25)",
              }}
            >
              <span>👥</span> Դիտել Կազմկոմիտեի Ամբողջ Թիմը →
            </Link>

            {(isEditMode || isAdmin) && (
              <button
                type="button"
                id="btn-edit-forum-owner"
                onClick={() => setIsOwnerModalOpen(true)}
                style={{
                  padding: "0.7rem 1.1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--gold-accent)",
                  background: "rgba(212, 175, 55, 0.15)",
                  color: "var(--gold-accent)",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                ✎ Փոխել Ղեկավարին
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          BLOCK 6: Public Proposals, Suggestions & Community Dialogue
          ========================================================= */}
      <div style={{ marginBottom: "5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--card-border)",
            paddingBottom: "1rem",
            marginBottom: "1.8rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              id="forum-suggestions-section-title"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--gold-accent)",
                margin: 0,
                fontSize: "1.9rem",
              }}
            >
              Ֆորումի Հանրային Առաջարկներ և Քննարկումներ
            </h2>
            <p style={{ margin: "0.2rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Գիտնականների, մտածողների և մասնակիցների առաջարկները Մանիֆեստի, ուղերձների և օրակարգի շուրջ
            </p>
          </div>

          <button
            type="button"
            id="btn-open-general-comment-modal"
            onClick={() =>
              setCommentModalState({
                isOpen: true,
                initialTarget: { type: "general", targetTitle: "Ընդհանուր Ֆորումի Հարցեր" },
              })
            }
            className="btn-primary"
            style={{ fontSize: "0.88rem", padding: "0.55rem 1.25rem" }}
          >
            + Ավելացնել Նոր Առաջարկ
          </button>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            gap: "0.6rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            id="filter-suggestions-all"
            onClick={() => setSuggestionFilter("all")}
            className={`forum-pill-btn ${suggestionFilter === "all" ? "active" : ""}`}
          >
            Բոլորը ({suggestions.length})
          </button>
          <button
            type="button"
            id="filter-suggestions-manifesto"
            onClick={() => setSuggestionFilter("manifesto")}
            className={`forum-pill-btn ${suggestionFilter === "manifesto" ? "active" : ""}`}
          >
            📜 Մանիֆեստ ({suggestions.filter((s) => s.type === "manifesto").length})
          </button>
          <button
            type="button"
            id="filter-suggestions-message"
            onClick={() => setSuggestionFilter("message")}
            className={`forum-pill-btn ${suggestionFilter === "message" ? "active" : ""}`}
          >
            💬 Ուղերձներ ({suggestions.filter((s) => s.type === "message").length})
          </button>
          <button
            type="button"
            id="filter-suggestions-agenda"
            onClick={() => setSuggestionFilter("agenda")}
            className={`forum-pill-btn ${suggestionFilter === "agenda" ? "active" : ""}`}
          >
            🗓️ Օրակարգ ({suggestions.filter((s) => s.type === "agenda").length})
          </button>
          <button
            type="button"
            id="filter-suggestions-date"
            onClick={() => setSuggestionFilter("date_location")}
            className={`forum-pill-btn ${suggestionFilter === "date_location" ? "active" : ""}`}
          >
            📍 Ժամկետներ & Վայր ({suggestions.filter((s) => s.type === "date_location").length})
          </button>
        </div>

        {/* Suggestions List */}
        {filteredSuggestions.length === 0 ? (
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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
            Այս բաժնում դեռևս առաջարկներ չկան։ Սեղմեք «+ Ավելացնել Նոր Առաջարկ» առաջինը ներկայացնելու համար։
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {filteredSuggestions.map((item) => {
              const isLiked = item.likedBy?.includes(user?.uid || "guest-user");

              return (
                <div key={item.id} className="forum-suggestion-card" id={`suggestion-card-${item.id}`}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          background:
                            item.category === "amendment"
                              ? "rgba(168, 85, 247, 0.18)"
                              : item.category === "attendance"
                              ? "rgba(16, 185, 129, 0.18)"
                              : "rgba(212, 175, 55, 0.18)",
                          color:
                            item.category === "amendment"
                              ? "#c084fc"
                              : item.category === "attendance"
                              ? "#34d399"
                              : "var(--gold-accent)",
                          border: "1px solid var(--card-border)",
                        }}
                      >
                        {item.category === "amendment"
                          ? "✍️ Փոփոխություն"
                          : item.category === "attendance"
                          ? "✓ Մասնակցություն"
                          : item.category === "comment"
                          ? "💬 Դիտարկում"
                          : "💡 Առաջարկ"}
                      </span>

                      {item.targetTitle && (
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                            background: "var(--input-bg)",
                            padding: "0.15rem 0.6rem",
                            borderRadius: "0.35rem",
                            border: "1px solid var(--card-border)",
                          }}
                        >
                          Թեմա՝ {item.targetTitle}
                        </span>
                      )}

                      {item.status && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "0.1rem 0.45rem",
                            borderRadius: "999px",
                            background:
                              item.status === "implemented"
                                ? "rgba(16, 185, 129, 0.15)"
                                : item.status === "approved"
                                ? "rgba(59, 130, 246, 0.15)"
                                : "rgba(212, 175, 55, 0.1)",
                            color:
                              item.status === "implemented"
                                ? "#10b981"
                                : item.status === "approved"
                                ? "#3b82f6"
                                : "var(--gold-accent)",
                          }}
                        >
                          {item.status === "implemented"
                            ? "✓ Ընդունված է"
                            : item.status === "approved"
                            ? "✓ Հաստատված"
                            : item.status === "reviewed"
                            ? "Ուսումնասիրվում է"
                            : "Նոր առաջարկ"}
                        </span>
                      )}
                    </div>

                    <span suppressHydrationWarning style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {item.title && (
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.1rem",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-serif)",
                      }}
                    >
                      {item.title}
                    </h4>
                  )}

                  <p
                    style={{
                      margin: "0 0 1rem 0",
                      fontSize: "0.98rem",
                      lineHeight: "1.7",
                      color: "var(--text-primary)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.content}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid var(--card-border)",
                      paddingTop: "0.75rem",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontWeight: "600", fontSize: "0.88rem", color: "var(--text-primary)" }}>
                        {item.authorName}
                      </span>
                      {item.authorRole && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            padding: "0.1rem 0.45rem",
                            borderRadius: "999px",
                            background:
                              USER_ROLES[item.authorRole as keyof typeof USER_ROLES]?.badgeBg ||
                              "rgba(212, 175, 55, 0.15)",
                            color:
                              USER_ROLES[item.authorRole as keyof typeof USER_ROLES]?.badgeColor ||
                              "var(--gold-accent)",
                          }}
                        >
                          {USER_ROLES[item.authorRole as keyof typeof USER_ROLES]?.labelHy || item.authorRole}
                        </span>
                      )}
                      {item.authorAffiliation && (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          • {item.authorAffiliation}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <button
                        type="button"
                        onClick={() => handleToggleLikeSuggestion(item.id)}
                        className={`forum-like-btn ${isLiked ? "liked" : ""}`}
                      >
                        👍 {item.likesCount || 0}
                      </button>

                      <button
                        type="button"
                        onClick={() => setReplyingToId(replyingToId === item.id ? null : item.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--gold-accent)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        💬 Պատասխանել ({item.replies?.length || 0})
                      </button>

                      {(isAdmin || item.authorUid === user?.uid) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSuggestion(item.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                          }}
                        >
                          🗑️ Ջնջել
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Replies thread */}
                  {item.replies && item.replies.length > 0 && (
                    <div
                      style={{
                        marginTop: "1rem",
                        paddingLeft: "1.2rem",
                        borderLeft: "2px solid var(--gold-accent)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                        background: "var(--input-bg)",
                        padding: "0.85rem 1rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {item.replies.map((rep) => (
                        <div key={rep.id} style={{ fontSize: "0.9rem" }}>
                          <span style={{ fontWeight: "600", color: "var(--gold-accent)" }}>
                            {rep.authorName}:{" "}
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>{rep.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inline reply box */}
                  {replyingToId === item.id && (
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Գրեք Ձեր պատասխանը այս առաջարկին..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "0.5rem 0.85rem",
                          borderRadius: "0.5rem",
                          border: "1px solid var(--card-border)",
                          background: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                          fontSize: "0.9rem",
                        }}
                      />
                      <button
                        type="button"
                        disabled={sendingReply}
                        onClick={() => handleSendReply(item.id)}
                        className="btn-primary"
                        style={{ padding: "0.5rem 1.2rem", fontSize: "0.88rem" }}
                      >
                        {sendingReply ? "Ուղարկվում է..." : "Պատասխանել"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================
          BLOCK 7: Consensus Dashboard
          ========================================================= */}
      <div
        style={{
          background: "linear-gradient(90deg, var(--bg-color) 0%, var(--gradient-overlay-1) 100%)",
          padding: "2.5rem",
          borderRadius: "1rem",
          border: "1px solid var(--card-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div>
          <EditableText
            tag="h3"
            label="Ցուցիչի Վերնագիր"
            value={content.consensusTitle}
            style={{ margin: "0 0 0.5rem 0", fontFamily: "var(--font-serif)", fontSize: "1.45rem" }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, consensusTitle: val }));
              await savePageField("forum", "consensusTitle", val);
            }}
          />
          <EditableText
            tag="p"
            label="Ցուցիչի Ենթավերնագիր"
            value={content.consensusSubtitle}
            style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, consensusSubtitle: val }));
              await savePageField("forum", "consensusSubtitle", val);
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "3.4rem", color: "var(--gold-accent)", fontWeight: "bold" }}>
            {content.consensusPercent}%
          </div>
          {isEditMode && (
            <button
              type="button"
              id="btn-edit-consensus-percent"
              onClick={async () => {
                const input = prompt(
                  "Մուտքագրեք կոնսենսուսի տոկոսը (0-100):",
                  String(content.consensusPercent)
                );
                if (input !== null) {
                  const num = parseInt(input, 10);
                  if (!isNaN(num) && num >= 0 && num <= 100) {
                    setContent((prev) => ({ ...prev, consensusPercent: num }));
                    await savePageField("forum", "consensusPercent", num);
                  }
                }
              }}
              style={{
                background: "rgba(212, 175, 55, 0.15)",
                color: "var(--gold-accent)",
                border: "1px solid var(--gold-accent)",
                borderRadius: "0.4rem",
                padding: "0.35rem 0.75rem",
                cursor: "pointer",
                fontSize: "0.82rem",
              }}
            >
              Փոխել %
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          MODALS
          ========================================================= */}

      {/* 1. Date & Location Proposal / RSVP Modal */}
      <ForumDateProposalModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        currentDates={content.datesTitle}
        currentLocation={content.locationTitle}
        onSubmit={handleDateProposalSubmit}
      />

      {/* 2. Manifesto Proposal Modal */}
      <ForumManifestoProposalModal
        isOpen={isManifestoModalOpen}
        onClose={() => setIsManifestoModalOpen(false)}
        manifestoTitle={content.manifestoTitle}
        manifestoCurrentText={content.manifestoWhat}
        onSubmit={handleManifestoProposalSubmit}
      />

      {/* 3. Targeted Suggestion & Comment Modal */}
      <ForumCommentModal
        isOpen={commentModalState.isOpen}
        onClose={() => setCommentModalState({ isOpen: false })}
        messages={content.messages}
        agenda={content.agenda}
        initialTarget={commentModalState.initialTarget}
        onSubmit={handleCommentModalSubmit}
      />

      {/* 4. Forum Owner / Chief Coordinator Modal */}
      <ForumOwnerModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        currentOwner={owner}
        onSave={handleSaveOwner}
      />

      {/* 5. Forum Organizer Team Member Modal */}
      <ForumOrganizerModal
        isOpen={organizerModalState.isOpen}
        onClose={() => setOrganizerModalState({ isOpen: false, organizer: null })}
        organizer={organizerModalState.organizer}
        onSave={handleSaveOrganizer}
        onDelete={handleDeleteOrganizer}
      />

      {/* 6. Edit Agenda Modal */}
      {editingAgenda && (
        <EditCardModal
          title="Խմբագրել Օրակարգի Կետը"
          initialData={editingAgenda.data}
          fields={[
            { key: "day", label: "Օր / Վայր (Օր.՝ ՕՐ 1. ԳՅՈՒՄՐԻ)" },
            { key: "title", label: "Վայր / Շենք (Օր.՝ «Black Fortress»)" },
            { key: "description", label: "Նկարագրություն", type: "textarea" },
          ]}
          onSave={async (updated) => {
            const list = [...content.agenda];
            list[editingAgenda.index] = updated;
            setContent((prev) => ({ ...prev, agenda: list }));
            await savePageField("forum", "agenda", list);
          }}
          onDelete={async () => {
            const list = content.agenda.filter((_, i) => i !== editingAgenda.index);
            setContent((prev) => ({ ...prev, agenda: list }));
            await savePageField("forum", "agenda", list);
          }}
          onClose={() => setEditingAgenda(null)}
        />
      )}

      {/* 7. Add Agenda Modal */}
      {isAddingAgenda && (
        <EditCardModal
          title="Ավելացնել Օրակարգի Կետ"
          initialData={{
            id: `day-${Date.now()}`,
            day: "ՕՐ 4",
            title: "",
            description: "",
          }}
          fields={[
            { key: "day", label: "Օր / Քաղաք", placeholder: "Օր.՝ ՕՐ 4. ԴԻԼԻՋԱՆ" },
            { key: "title", label: "Վայր / Կենտրոն", placeholder: "Օր.՝ Ուսումնական Կենտրոն" },
            { key: "description", label: "Ծրագրի Նկարագրություն", type: "textarea" },
          ]}
          onSave={async (newDay) => {
            const list = [...content.agenda, newDay];
            setContent((prev) => ({ ...prev, agenda: list }));
            await savePageField("forum", "agenda", list);
          }}
          onClose={() => setIsAddingAgenda(false)}
        />
      )}
    </main>
  );
}
