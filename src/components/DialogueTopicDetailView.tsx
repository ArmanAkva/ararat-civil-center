"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { USER_ROLES } from "@/types/auth";
import { DialogueTopicItem, DialogueComment, TopicExpertOpinion } from "@/types/dialogue";
import { getAllCivilCenters, getAllThinkersOptions, ThinkerOption } from "@/lib/civilizationsData";
import {
  getTopicComments,
  addDialogueComment,
  deleteDialogueComment,
  updateDialogueTopic,
  deleteDialogueTopic,
  approveDialogueTopic,
  rejectDialogueTopic,
  getTopicExpertOpinions,
  addTopicExpertOpinion,
  updateTopicExpertOpinion,
  deleteTopicExpertOpinion,
} from "@/lib/dialogueService";
import PersonWithLoupeIcon from "@/components/icons/PersonWithLoupeIcon";
import TopicStatusIconBadge from "@/components/dialogue/TopicStatusIconBadge";

interface Props {
  initialTopic: DialogueTopicItem;
}

export default function DialogueTopicDetailView({ initialTopic }: Props) {
  const router = useRouter();
  const { user, profile, role, isAdmin } = useAuth();

  const civilCenters = useMemo(() => getAllCivilCenters(), []);
  const thinkerOptions = useMemo(() => getAllThinkersOptions(), []);

  const [topic, setTopic] = useState<DialogueTopicItem>(initialTopic);
  const [comments, setComments] = useState<DialogueComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // Expert Opinions State
  const [expertOpinions, setExpertOpinions] = useState<TopicExpertOpinion[]>([]);
  const [loadingExperts, setLoadingExperts] = useState(true);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [editingExpertOpinion, setEditingExpertOpinion] = useState<TopicExpertOpinion | null>(null);

  // Expert Opinion Form State
  const [expertFormThinkerId, setExpertFormThinkerId] = useState("");
  const [expertFormName, setExpertFormName] = useState("");
  const [expertFormCivilization, setExpertFormCivilization] = useState("");
  const [expertFormTitle, setExpertFormTitle] = useState("");
  const [expertFormQuote, setExpertFormQuote] = useState("");
  const [expertFormFullText, setExpertFormFullText] = useState("");
  const [expertFormSourceUrl, setExpertFormSourceUrl] = useState("");
  const [savingExpert, setSavingExpert] = useState(false);

  // Expandable full text state for opinions
  const [expandedOpinions, setExpandedOpinions] = useState<Record<string, boolean>>({});

  const toggleExpandOpinion = (opinionId: string) => {
    setExpandedOpinions((prev) => ({ ...prev, [opinionId]: !prev[opinionId] }));
  };

  // New Comment State
  const [newCommentText, setNewCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Inline Reply State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [guestReplyName, setGuestReplyName] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Edit Topic State (Admin)
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [topicFormNumber, setTopicFormNumber] = useState(topic.number);
  const [topicFormTitle, setTopicFormTitle] = useState(topic.title);
  const [topicFormDescription, setTopicFormDescription] = useState(topic.description);
  const [topicFormTag, setTopicFormTag] = useState(topic.civilizationTag || "Ընդհանուր");
  const [topicFormCenterId, setTopicFormCenterId] = useState(topic.centerId || "");
  const [topicFormDate, setTopicFormDate] = useState(topic.date);
  const [topicFormStatus, setTopicFormStatus] = useState<"active" | "archived" | "closed" | "pending" | "rejected">(topic.status);
  const [savingTopic, setSavingTopic] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);


  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch comments and expert opinions on mount
  useEffect(() => {
    let isMounted = true;
    setLoadingComments(true);
    getTopicComments(topic.id)
      .then((list) => {
        if (isMounted) setComments(list);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoadingComments(false);
      });

    setLoadingExperts(true);
    getTopicExpertOpinions(topic.id, topic.expertResponses)
      .then((list) => {
        if (isMounted) setExpertOpinions(list);
      })
      .catch((err) => console.error("Error loading expert opinions:", err))
      .finally(() => {
        if (isMounted) setLoadingExperts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [topic.id, topic.expertResponses]);


  // Handle post comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const authorName = user
      ? profile?.displayName || user.displayName || user.email?.split("@")[0] || "Անդամ"
      : guestName.trim() || "Հյուր";

    setSubmittingComment(true);
    try {
      const payload: any = {
        topicId: topic.id,
        parentId: null,
        authorName,
        authorRole: role || "guest",
        text: newCommentText.trim(),
      };
      if (user?.uid) payload.authorUid = user.uid;
      if (user?.email) payload.authorEmail = user.email;
      if (profile?.affiliationTitle) payload.authorAffiliation = profile.affiliationTitle;
      if (profile?.civilizationAffiliation) payload.civilizationAffiliation = profile.civilizationAffiliation;

      // Ensure topicAuthorUid resolves properly
      let topicAuthorUid = topic.authorUid;
      if (!topicAuthorUid && user?.uid && topic.authorName === (profile?.displayName || user.displayName)) {
        topicAuthorUid = user.uid;
      }

      const created = await addDialogueComment(payload, {
        topicTitle: topic.title,
        topicAuthorUid,
      });

      setComments((prev) => [...prev, created]);
      setNewCommentText("");
      setGuestName("");
      setTopic((prev) => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));

      showToast("success", "✓ Ձեր տեսակետը հաջողությամբ ավելացվեց:");
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ մեկնաբանելիս. ${err.message || err}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle post reply
  const handleAddReply = async (parentComment: DialogueComment) => {
    if (!replyText.trim()) return;

    const authorName = user
      ? profile?.displayName || user.displayName || user.email?.split("@")[0] || "Անդամ"
      : guestReplyName.trim() || "Հյուր";

    setSubmittingReply(true);
    try {
      const payload: any = {
        topicId: topic.id,
        parentId: parentComment.id,
        authorName,
        authorRole: role || "guest",
        text: replyText.trim(),
      };
      if (user?.uid) payload.authorUid = user.uid;
      if (user?.email) payload.authorEmail = user.email;
      if (profile?.affiliationTitle) payload.authorAffiliation = profile.affiliationTitle;
      if (profile?.civilizationAffiliation) payload.civilizationAffiliation = profile.civilizationAffiliation;

      // Resolve parent comment author UID
      let parentAuthorUid = parentComment.authorUid;
      if (!parentAuthorUid && user?.uid) {
        if (
          (parentComment.authorEmail && parentComment.authorEmail === user.email) ||
          parentComment.authorName === (profile?.displayName || user.displayName || user.email?.split("@")[0])
        ) {
          parentAuthorUid = user.uid;
        } else if (parentComment.id.startsWith("comm-")) {
          // If replying to a default/mock comment during testing, route notification to the active user
          parentAuthorUid = user.uid;
        }
      }

      const created = await addDialogueComment(payload, {
        topicTitle: topic.title,
        topicAuthorUid: topic.authorUid,
        parentAuthorUid,
      });

      setComments((prev) => [...prev, created]);
      setReplyText("");
      setGuestReplyName("");
      setReplyingToId(null);
      setTopic((prev) => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));

      showToast(
        "success",
        `✓ Պատասխանն ուղարկվեց: ${parentComment.authorName}-ը կստանա ծանուցում:`
      );
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ պատասխանելիս. ${err.message || err}`);
    } finally {
      setSubmittingReply(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Իսկապե՞ս ցանկանում եք հեռացնել այս մեկնաբանությունը:")) return;
    try {
      await deleteDialogueComment(commentId, topic.id);
      setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
      setTopic((prev) => ({ ...prev, commentsCount: Math.max(0, (prev.commentsCount || 1) - 1) }));
      showToast("success", "✓ Մեկնաբանությունը հեռացվեց:");
    } catch (err: any) {
      showToast("error", `Սխալ. ${err.message || err}`);
    }
  };

  // Edit topic submit
  const handleUpdateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicFormTitle.trim()) return;

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

      await updateDialogueTopic(topic.id, partial);
      setTopic((prev) => ({ ...prev, ...partial }));
      setIsEditingModalOpen(false);
      showToast("success", "✓ Հարցադրման տվյալները թարմացվեցին:");
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ թարմացնելիս. ${err.message || err}`);
    } finally {
      setSavingTopic(false);
    }
  };

  // Delete entire topic
  const handleDeleteTopic = async () => {
    if (!confirm("Իսկապե՞ս ցանկանում եք ջնջել այս ամբողջ հարցադրումը և նրա քննարկումները:")) return;
    try {
      await deleteDialogueTopic(topic.id);
      router.push("/dialogue");
    } catch (err: any) {
      showToast("error", `Սխալ. ${err.message || err}`);
    }
  };

  // Approve pending topic (Admin)
  const handleApproveTopic = async () => {
    try {
      const adminName = profile?.displayName || user?.displayName || "Ադմինիստրատոր";
      await approveDialogueTopic(topic.id, adminName);
      setTopic((prev) => ({ ...prev, status: "active" }));
      showToast("success", "✓ Հարցադրումը հաստատվեց և հրապարակվեց:");
    } catch (err: any) {
      showToast("error", `Սխալ հաստատելիս. ${err.message || err}`);
    }
  };

  // Reject pending topic (Admin)
  const handleRejectTopic = async () => {
    const reason = prompt("Նշեք մերժման պատճառը (կամ թողեք դատարկ).") || undefined;
    try {
      const adminName = profile?.displayName || user?.displayName || "Ադմինիստրատոր";
      await rejectDialogueTopic(topic.id, reason, adminName);
      setTopic((prev) => ({ ...prev, status: "rejected" }));
      showToast("success", "✓ Հարցադրումը մերժվեց:");
    } catch (err: any) {
      showToast("error", `Սխալ մերժելիս. ${err.message || err}`);
    }
  };

  // Expert Opinions Handlers
  const canManageExperts = isAdmin || role === "scholar";

  const handleOpenAddExpertModal = () => {
    setEditingExpertOpinion(null);
    setExpertFormThinkerId("");
    setExpertFormName("");
    setExpertFormCivilization(topic.civilizationTag || "");
    setExpertFormTitle("");
    setExpertFormQuote("");
    setExpertFormFullText("");
    setExpertFormSourceUrl("");
    setIsExpertModalOpen(true);
  };

  const handleOpenEditExpertModal = (op: TopicExpertOpinion) => {
    setEditingExpertOpinion(op);
    setExpertFormThinkerId("");
    setExpertFormName(op.name);
    setExpertFormCivilization(op.civilization);
    setExpertFormTitle(op.title || "");
    setExpertFormQuote(op.quote);
    setExpertFormFullText(op.fullText || "");
    setExpertFormSourceUrl(op.sourceUrl || "");
    setIsExpertModalOpen(true);
  };

  const handleSelectThinker = (thinkerId: string) => {
    setExpertFormThinkerId(thinkerId);
    if (!thinkerId) return;
    const found = thinkerOptions.find((t) => t.id === thinkerId);
    if (found) {
      setExpertFormName(found.name);
      setExpertFormCivilization(`${found.civSymbol} ${found.civName}`);
      if (found.title) setExpertFormTitle(found.title);
      if (found.quote && !expertFormQuote) setExpertFormQuote(found.quote);
    }
  };

  const handleSaveExpertOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertFormName.trim() || !expertFormQuote.trim() || !expertFormCivilization.trim()) {
      showToast("error", "Խնդրում ենք լրացնել անունը, քաղաքակրթությունը և հիմնական դիրքորոշումը:");
      return;
    }

    setSavingExpert(true);
    try {
      const authorName = profile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Ադմին";
      const payload: Omit<TopicExpertOpinion, "id" | "createdAt" | "topicId"> = {
        name: expertFormName.trim(),
        civilization: expertFormCivilization.trim(),
        quote: expertFormQuote.trim(),
      };
      if (expertFormTitle.trim()) payload.title = expertFormTitle.trim();
      if (expertFormFullText.trim()) payload.fullText = expertFormFullText.trim();
      if (expertFormSourceUrl.trim()) payload.sourceUrl = expertFormSourceUrl.trim();
      if (user?.uid) payload.authorUid = user.uid;
      if (authorName) payload.authorName = authorName;

      if (editingExpertOpinion) {
        await updateTopicExpertOpinion(topic.id, editingExpertOpinion.id, payload);
        setExpertOpinions((prev) =>
          prev.map((op) => (op.id === editingExpertOpinion.id ? { ...op, ...payload } : op))
        );
        showToast("success", "✓ Փորձագիտական կարծիքը թարմացվեց:");
      } else {
        const created = await addTopicExpertOpinion(topic.id, payload);
        setExpertOpinions((prev) => [...prev, created]);
        setTopic((prev) => ({
          ...prev,
          expertOpinionsCount: (prev.expertOpinionsCount || prev.expertResponses?.length || 0) + 1,
        }));
        showToast("success", "✓ Փորձագիտական կարծիքը հաջողությամբ ավելացվեց:");
      }

      setIsExpertModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showToast("error", `Սխալ պահպանելիս. ${err.message || err}`);
    } finally {
      setSavingExpert(false);
    }
  };

  const handleDeleteExpertOpinion = async (opinionId: string) => {
    if (!confirm("Իսկապե՞ս ցանկանում եք հեռացնել այս փորձագիտական կարծիքը:")) return;
    try {
      await deleteTopicExpertOpinion(topic.id, opinionId);
      setExpertOpinions((prev) => prev.filter((op) => op.id !== opinionId));
      setTopic((prev) => ({
        ...prev,
        expertOpinionsCount: Math.max(0, (prev.expertOpinionsCount || prev.expertResponses?.length || 1) - 1),
      }));
      showToast("success", "✓ Փորձագիտական կարծիքը հեռացվեց:");
    } catch (err: any) {
      showToast("error", `Սխալ. ${err.message || err}`);
    }
  };

  // Filter root comments vs nested replies
  const rootComments = comments.filter((c) => !c.parentId);

  const getRepliesForComment = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);

  // If topic is pending and current user is neither Admin nor the original Author, show review notice
  const isAuthor = user?.uid && topic.authorUid && user.uid === topic.authorUid;
  if (topic.status === "pending" && !isAdmin && !isAuthor) {
    return (
      <main className="container" style={{ paddingBottom: "6rem", maxWidth: "900px" }}>
        <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
          <Link
            href="/dialogue"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              color: "var(--gold-accent)",
              fontSize: "0.9rem",
              fontWeight: "600",
              textDecoration: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "0.4rem",
              background: "rgba(183, 121, 31, 0.08)",
              border: "1px solid var(--card-border)",
            }}
          >
            <span>←</span>
            <span>Վերադառնալ Բոլոր Հարցադրումներին</span>
          </Link>
        </div>

        <div
          className="glass-card"
          style={{
            textAlign: "center",
            padding: "4.5rem 2rem",
            borderRadius: "1rem",
            maxWidth: "600px",
            margin: "2rem auto",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.6rem",
              color: "var(--gold-accent)",
              marginBottom: "0.75rem",
            }}
          >
            Հարցադրումը գտնվում է հաստատման փուլում
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "0 auto 1.5rem auto",
              lineHeight: "1.7",
              fontSize: "0.95rem",
            }}
          >
            Այս հարցադրումն առաջարկվել է օգտատիրոջ կողմից և ներկայումս դիտարկվում է կազմկոմիտեի ու
            ադմինիստրատորների կողմից։ Հաստատվելուց հետո այն կհրապարակվի հարթակում բոլորի համար։
          </p>
          <Link
            href="/dialogue"
            className="btn-primary"
            style={{ padding: "0.65rem 1.6rem", borderRadius: "0.5rem", display: "inline-block" }}
          >
            Դիտել Հրապարակված Հարցադրումները
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ paddingBottom: "6rem", maxWidth: "1050px" }}>
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

      {/* Back Breadcrumb Navigation */}
      <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
        <Link
          href="/dialogue"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            color: "var(--gold-accent)",
            fontSize: "0.9rem",
            fontWeight: "600",
            textDecoration: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "0.4rem",
            background: "rgba(183, 121, 31, 0.08)",
            border: "1px solid var(--card-border)",
            transition: "all 0.2s ease",
          }}
        >
          <span>←</span>
          <span>Վերադառնալ Բոլոր Հարցադրումներին</span>
        </Link>
      </div>

      {/* Main Dialogue Topic Hero Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--gradient-overlay-1) 0%, var(--bg-color) 100%)",
          border: "1px solid var(--gold-accent)",
          borderRadius: "1rem",
          padding: "3.5rem 2.5rem",
          marginBottom: "3.5rem",
          position: "relative",
          boxShadow: "0 12px 35px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Pinned Top-Right Corner: Status Indicator & Admin Action Buttons */}
        <div
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            zIndex: 15,
          }}
        >
          {/* Admin Action Buttons */}
          {isAdmin && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {topic.status === "pending" && (
                <button
                  type="button"
                  onClick={handleApproveTopic}
                  style={{
                    background: "#10b981",
                    border: "1px solid #10b981",
                    color: "#ffffff",
                    borderRadius: "0.4rem",
                    padding: "0.35rem 0.85rem",
                    fontSize: "0.8rem",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                  }}
                  title="Հաստատել և հրապարակել հարթակում"
                >
                  <span>✓</span>
                  <span>Հաստատել</span>
                </button>
              )}

              {topic.status === "pending" && (
                <button
                  type="button"
                  onClick={handleRejectTopic}
                  style={{
                    background: "transparent",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    borderRadius: "0.4rem",
                    padding: "0.35rem 0.75rem",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  title="Մերժել հարցադրումը"
                >
                  ✕ Մերժել
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setTopicFormNumber(topic.number);
                  setTopicFormTitle(topic.title);
                  setTopicFormDescription(topic.description);
                  setTopicFormTag(topic.civilizationTag || "Ընդհանուր");
                  setTopicFormDate(topic.date);
                  setTopicFormStatus(topic.status);
                  setIsEditingModalOpen(true);
                }}
                style={{
                  background: "rgba(183, 121, 31, 0.15)",
                  border: "1px solid var(--gold-accent)",
                  color: "var(--gold-accent)",
                  borderRadius: "0.4rem",
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                title="Խմբագրել հարցադրումը"
              >
                ✎ Խմբագրել
              </button>

              <button
                type="button"
                onClick={handleDeleteTopic}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  borderRadius: "0.4rem",
                  padding: "0.35rem 0.8rem",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                title="Ջնջել հարցադրումը"
              >
                🗑 Ջնջել
              </button>
            </div>
          )}

          {/* Status Indicator Icon always on top right corner */}
          <TopicStatusIconBadge status={topic.status} size={30} />
        </div>

        {/* Pending Moderation Notice for Admin or Author */}
        {topic.status === "pending" && (
          <div
            style={{
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "var(--text-primary)",
              padding: "0.9rem 1.25rem",
              borderRadius: "0.6rem",
              marginBottom: "1.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.9rem",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>⏳</span>
            <div>
              <strong>
                {isAdmin
                  ? `Առաջարկված է անդամի կողմից (${topic.authorName}) — Սպասում է Ձեր հաստատմանը`
                  : "Ձեր առաջարկած հարցադրումը սպասում է ադմինիստրատորի հաստատմանը։"}
              </strong>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                {isAdmin
                  ? "Կարող եք հաստատել կամ խմբագրել այն՝ հանրությանը հասանելի դարձնելու համար։"
                  : "Հաստատվելուց հետո այն կհրապարակվի հարթակում բոլոր մասնակիցների համար։"}
              </div>
            </div>
          </div>
        )}

        {/* Eyebrow & Tags */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "var(--gold-accent)",
            letterSpacing: "0.1em",
            marginBottom: "1.2rem",
            fontSize: "0.92rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            flexWrap: "wrap",
            paddingRight: "3.5rem",
          }}
        >
          <span>{topic.date}</span>
          {topic.civilizationTag && (
            <>
              <span>•</span>
              <span
                style={{
                  background: "rgba(183, 121, 31, 0.15)",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                }}
              >
                🏷 {topic.civilizationTag}
              </span>
            </>
          )}
          {topic.centerName && (
            <>
              <span>•</span>
              <Link
                href={topic.centerId ? `/centers/${topic.centerId}` : "#"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "rgba(183, 121, 31, 0.2)",
                  color: "var(--gold-accent)",
                  padding: "0.15rem 0.65rem",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  textDecoration: "none",
                  border: "1px solid rgba(183, 121, 31, 0.35)",
                  fontWeight: "600",
                  textTransform: "none",
                }}
                title={`Ուղեղային Կենտրոն՝ ${topic.centerName}`}
              >
                <span>🏛️</span>
                <span>{topic.centerName}</span>
              </Link>
            </>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 3.8vw, 2.7rem)",
            margin: "0 0 1.5rem 0",
            lineHeight: "1.3",
            color: "var(--text-primary)",
          }}
        >
          {topic.title}
        </h1>

        {/* Full Problem Statement */}
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.18rem",
            lineHeight: "1.85",
            maxWidth: "900px",
            margin: "0 0 2rem",
            whiteSpace: "pre-line",
          }}
        >
          {topic.description}
        </p>

        {/* Creator & Comments Count Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            borderTop: "1px solid var(--card-border)",
            paddingTop: "1.25rem",
            flexWrap: "wrap",
          }}
        >
          <span>
            Առաջարկել է՝ <strong>{topic.authorName || "Արարատյան Կենտրոն"}</strong>
          </span>
          <span>•</span>
          <span>💬 {comments.length} մեկնաբանություն</span>
          {expertOpinions.length > 0 && (
            <>
              <span>•</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                  background: "var(--input-bg)",
                  color: "var(--gold-accent)",
                  fontWeight: "600",
                }}
              >
                <PersonWithLoupeIcon size={14} color="var(--gold-accent)" />
                <span>{expertOpinions.length} փորձագետ</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXPERT OPINIONS SECTION (SUBCOLLECTION) */}
      {/* ============================================================== */}
      <div id="expert-opinions" style={{ marginBottom: "4rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            borderBottom: "1px solid var(--card-border)",
            paddingBottom: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--gold-accent)",
                margin: 0,
                fontSize: "1.65rem",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
              }}
            >
              <PersonWithLoupeIcon size={26} color="var(--gold-accent)" />
              <span>Հրավիրյալ Մտածողների & Փորձագետների Կարծիքները</span>
            </h2>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                background: "rgba(183, 121, 31, 0.15)",
                color: "var(--gold-accent)",
                padding: "0.15rem 0.6rem",
                borderRadius: "999px",
                border: "1px solid rgba(183, 121, 31, 0.3)",
              }}
            >
              {expertOpinions.length}
            </span>
          </div>

          {canManageExperts && (
            <button
              type="button"
              onClick={handleOpenAddExpertModal}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 1.15rem",
                fontSize: "0.88rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(183, 121, 31, 0.2)",
              }}
            >
              <span>+</span>
              <span>Ավելացնել Փորձագիտական Կարծիք</span>
            </button>
          )}
        </div>

        {loadingExperts ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            Բեռնվում են փորձագիտական կարծիքները...
          </div>
        ) : expertOpinions.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: "2.5rem 2rem",
              textAlign: "center",
              borderRadius: "0.85rem",
              border: "1px dashed var(--card-border)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📜</div>
            <h3
              style={{
                margin: "0 0 0.5rem 0",
                fontFamily: "var(--font-serif)",
                color: "var(--text-primary)",
                fontSize: "1.2rem",
              }}
            >
              Այս հարցադրմանը դեռևս կցված չեն փորձագիտական դիրքորոշումներ
            </h3>
            <p
              style={{
                margin: "0 0 1.25rem 0",
                color: "var(--text-secondary)",
                fontSize: "0.92rem",
                maxWidth: "520px",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: "1.6",
              }}
            >
              Կազմկոմիտեն և հրավիրյալ մտածողները շուտով կհրապարակեն իրենց վերլուծությունները այս թեմայի շուրջ։
            </p>
            {canManageExperts && (
              <button
                type="button"
                onClick={handleOpenAddExpertModal}
                className="btn-primary"
                style={{
                  padding: "0.55rem 1.25rem",
                  fontSize: "0.88rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                + Ավելացնել Առաջին Փորձագիտական Կարծիքը
              </button>
            )}
          </div>
        ) : (
          <div className="cards-grid">
            {expertOpinions.map((exp, idx) => {
              const isExpanded = !!expandedOpinions[exp.id];
              return (
                <div
                  key={exp.id || idx}
                  className="glass-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <div>
                    {/* Expert Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, var(--gold-accent) 0%, transparent 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--gold-accent)",
                            flexShrink: 0,
                          }}
                        >
                          <PersonWithLoupeIcon size={24} color="var(--gold-accent)" />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.08rem", fontWeight: "700" }}>
                            {exp.name}
                          </h3>
                          {exp.title && (
                            <div
                              style={{
                                fontSize: "0.82rem",
                                color: "var(--text-secondary)",
                                marginTop: "0.15rem",
                              }}
                            >
                              {exp.title}
                            </div>
                          )}
                          <div
                            style={{
                              display: "inline-block",
                              marginTop: "0.3rem",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              color: "var(--gold-accent)",
                              background: "rgba(183, 121, 31, 0.1)",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "0.3rem",
                              border: "1px solid rgba(183, 121, 31, 0.25)",
                            }}
                          >
                            {exp.civilization}
                          </div>
                        </div>
                      </div>

                      {/* Admin / Scholar Edit & Delete Actions */}
                      {canManageExperts && (
                        <div style={{ display: "flex", gap: "0.35rem" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditExpertModal(exp)}
                            title="Խմբագրել կարծիքը"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid var(--card-border)",
                              color: "var(--text-secondary)",
                              padding: "0.3rem 0.55rem",
                              borderRadius: "0.35rem",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExpertOpinion(exp.id)}
                            title="Ջնջել կարծիքը"
                            style={{
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.25)",
                              color: "#ef4444",
                              padding: "0.3rem 0.55rem",
                              borderRadius: "0.35rem",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quote / Opinion text */}
                    <blockquote
                      style={{
                        margin: "0 0 1rem 0",
                        padding: "0.85rem 1rem",
                        background: "rgba(183, 121, 31, 0.04)",
                        borderLeft: "3px solid var(--gold-accent)",
                        borderRadius: "0 0.5rem 0.5rem 0",
                        fontStyle: "italic",
                        color: "var(--text-primary)",
                        lineHeight: "1.7",
                        fontSize: "0.98rem",
                      }}
                    >
                      {exp.quote}
                    </blockquote>

                    {/* Full text accordion (if provided) */}
                    {exp.fullText && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <button
                          type="button"
                          onClick={() => toggleExpandOpinion(exp.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--gold-accent)",
                            cursor: "pointer",
                            fontSize: "0.82rem",
                            fontWeight: "600",
                            padding: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          <span>{isExpanded ? "▲ Ծալել վերլուծությունը" : "▼ Կարդալ ամբողջական վերլուծությունը"}</span>
                        </button>
                        {isExpanded && (
                          <div
                            style={{
                              marginTop: "0.75rem",
                              padding: "1rem",
                              background: "var(--input-bg)",
                              borderRadius: "0.5rem",
                              border: "1px solid var(--card-border)",
                              fontSize: "0.9rem",
                              lineHeight: "1.7",
                              color: "var(--text-secondary)",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {exp.fullText}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Source link footer if present */}
                  {exp.sourceUrl && (
                    <div
                      style={{
                        marginTop: "1rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid var(--card-border)",
                        fontSize: "0.78rem",
                      }}
                    >
                      <a
                        href={exp.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--gold-accent)",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <span>🔗</span>
                        <span>Դիտել սկզբնաղբյուրը / հոդվածը</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* ============================================================== */}
      {/* DISCUSSION THREAD SECTION */}
      {/* ============================================================== */}
      <div id="discussion-thread" style={{ marginBottom: "4rem" }}>
        <div
          style={{
            borderBottom: "1px solid var(--card-border)",
            paddingBottom: "1rem",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--gold-accent)",
              margin: "0 0 0.35rem 0",
              fontSize: "1.65rem",
            }}
          >
            Հանրային Երկխոսություն & Կարծիքներ ({comments.length})
          </h2>
          <span style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Կիսվեք Ձեր տեսակետով այս հարցադրման շուրջ կամ պատասխանեք մյուս մասնակիցներին:
          </span>
        </div>

        {/* Comment Input Card */}
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            marginBottom: "3rem",
            border: "1px solid var(--card-border)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--gold-accent)",
              marginTop: 0,
              marginBottom: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Ներկայացնել Ձեր Տեսակետը
          </h3>

          <form
            onSubmit={handleAddComment}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {!user ? (
              <div>
                <input
                  type="text"
                  placeholder="Ձեր անունը, գիտական աստիճանը կամ կազմակերպությունը..."
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-primary)",
                    borderRadius: "0.5rem",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                  💡 Կամ կարող եք{" "}
                  <Link href="/auth" style={{ color: "var(--gold-accent)" }}>
                    Մուտք գործել
                  </Link>
                  ՝ Ձեր պաշտոնական պրոֆիլով գրառում կատարելու և պատասխանների ծանուցումներ ստանալու համար:
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span>Մեկնաբանում եք որպես՝</span>
                <strong style={{ color: "var(--text-primary)" }}>
                  {profile?.displayName || user.displayName || user.email}
                </strong>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                    background: USER_ROLES[role]?.badgeBg,
                    color: USER_ROLES[role]?.badgeColor,
                    border: `1px solid ${USER_ROLES[role]?.badgeBorder}`,
                  }}
                >
                  {USER_ROLES[role]?.labelHy}
                </span>
              </div>
            )}

            <textarea
              required
              rows={4}
              placeholder="Շարադրեք Ձեր հիմնավորումը և դիրքորոշումը այս հարցադրման շուրջ..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              style={{
                padding: "0.85rem",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-primary)",
                borderRadius: "0.5rem",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                lineHeight: "1.6",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              disabled={submittingComment}
              className="btn-primary"
              style={{
                alignSelf: "flex-start",
                padding: "0.7rem 1.8rem",
                fontSize: "0.92rem",
              }}
            >
              {submittingComment ? "Ուղարկվում է..." : "Ուղարկել Տեսակետը"}
            </button>
          </form>
        </div>

        {/* Comments & Replies List */}
        {loadingComments ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            Բեռնվում են կարծիքները...
          </div>
        ) : rootComments.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: "3.5rem", textAlign: "center", color: "var(--text-secondary)" }}
          >
            <div style={{ fontSize: "2.8rem", marginBottom: "0.8rem", opacity: 0.6 }}>💬</div>
            Դեռևս մեկնաբանություններ չկան այս հարցադրման համար: Եղե՛ք առաջինը:
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {rootComments.map((comment) => {
              const replies = getRepliesForComment(comment.id);
              const isReplying = replyingToId === comment.id;
              const canDelete = isAdmin || (user && user.uid === comment.authorUid);

              return (
                <div
                  key={comment.id}
                  id={comment.id}
                  style={{
                    background: "var(--card-bg)",
                    borderRadius: "0.85rem",
                    border: "1px solid var(--card-border)",
                    borderLeft: "4px solid var(--gold-accent)",
                    padding: "1.75rem",
                    position: "relative",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  {/* Delete button */}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "transparent",
                        color: "#ef4444",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        padding: "0.3rem",
                      }}
                      title="Հեռացնել մեկնաբանությունը"
                    >
                      🗑
                    </button>
                  )}

                  {/* Header Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.85rem",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        background: "rgba(183, 121, 31, 0.15)",
                        color: "var(--gold-accent)",
                        border: "1px solid var(--gold-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <strong style={{ color: "var(--text-primary)", fontSize: "0.98rem" }}>
                          {comment.authorName}
                        </strong>
                        {comment.authorRole && comment.authorRole !== "guest" && (
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: "700",
                              padding: "0.1rem 0.45rem",
                              borderRadius: "999px",
                              background:
                                USER_ROLES[comment.authorRole as keyof typeof USER_ROLES]
                                  ?.badgeBg || "rgba(183,121,31,0.15)",
                              color:
                                USER_ROLES[comment.authorRole as keyof typeof USER_ROLES]
                                  ?.badgeColor || "var(--gold-accent)",
                              border: `1px solid ${
                                USER_ROLES[comment.authorRole as keyof typeof USER_ROLES]
                                  ?.badgeBorder || "var(--card-border)"
                              }`,
                            }}
                          >
                            {USER_ROLES[comment.authorRole as keyof typeof USER_ROLES]
                              ?.labelHy || comment.authorRole}
                          </span>
                        )}
                      </div>
                      {comment.authorAffiliation && (
                        <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                          {comment.authorAffiliation}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body text */}
                  <p
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "0.98rem",
                      lineHeight: "1.7",
                      margin: "0 0 1rem",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {comment.text}
                  </p>

                  {/* Footer actions */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span>{new Date(comment.createdAt).toLocaleDateString("hy-AM")}</span>

                    <button
                      type="button"
                      onClick={() => {
                        setReplyingToId(isReplying ? null : comment.id);
                        setReplyText("");
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--gold-accent)",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.3rem",
                      }}
                    >
                      <span>↩</span>
                      <span>{isReplying ? "Փակել" : "Պատասխանել"}</span>
                    </button>
                  </div>

                  {/* Inline Reply Box */}
                  {isReplying && (
                    <div
                      style={{
                        marginTop: "1.25rem",
                        padding: "1.2rem",
                        background: "var(--bg-secondary)",
                        borderRadius: "0.6rem",
                        border: "1px dashed var(--gold-accent)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: "600",
                          color: "var(--gold-accent)",
                          marginBottom: "0.6rem",
                        }}
                      >
                        Պատասխանել «{comment.authorName}»-ին
                      </div>

                      {!user && (
                        <input
                          type="text"
                          placeholder="Ձեր անունը..."
                          value={guestReplyName}
                          onChange={(e) => setGuestReplyName(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.6rem 0.8rem",
                            background: "var(--input-bg)",
                            border: "1px solid var(--card-border)",
                            color: "var(--text-primary)",
                            borderRadius: "0.4rem",
                            fontSize: "0.9rem",
                            marginBottom: "0.6rem",
                            boxSizing: "border-box",
                          }}
                        />
                      )}

                      <textarea
                        rows={3}
                        placeholder="Գրեք Ձեր պատասխանը..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.7rem",
                          background: "var(--input-bg)",
                          border: "1px solid var(--card-border)",
                          color: "var(--text-primary)",
                          borderRadius: "0.4rem",
                          fontSize: "0.92rem",
                          fontFamily: "inherit",
                          lineHeight: "1.5",
                          boxSizing: "border-box",
                          marginBottom: "0.75rem",
                        }}
                      />

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                        <button
                          type="button"
                          onClick={() => setReplyingToId(null)}
                          style={{
                            padding: "0.4rem 0.85rem",
                            background: "transparent",
                            border: "1px solid var(--card-border)",
                            color: "var(--text-secondary)",
                            borderRadius: "0.4rem",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                          }}
                        >
                          Չեղարկել
                        </button>
                        <button
                          type="button"
                          disabled={submittingReply}
                          onClick={() => handleAddReply(comment)}
                          className="btn-primary"
                          style={{ padding: "0.4rem 1.1rem", fontSize: "0.85rem" }}
                        >
                          {submittingReply ? "Ուղարկվում է..." : "Ուղարկել Պատասխանը"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {replies.length > 0 && (
                    <div
                      style={{
                        marginTop: "1.5rem",
                        paddingLeft: "1.25rem",
                        borderLeft: "2px solid rgba(183, 121, 31, 0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.2rem",
                      }}
                    >
                      {replies.map((reply) => {
                        const canDeleteReply = isAdmin || (user && user.uid === reply.authorUid);

                        return (
                          <div
                            key={reply.id}
                            id={reply.id}
                            style={{
                              background: "var(--bg-secondary)",
                              padding: "1.2rem",
                              borderRadius: "0.6rem",
                              border: "1px solid var(--card-border)",
                              position: "relative",
                            }}
                          >
                            {canDeleteReply && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(reply.id)}
                                style={{
                                  position: "absolute",
                                  top: "0.6rem",
                                  right: "0.6rem",
                                  background: "transparent",
                                  color: "#ef4444",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "0.8rem",
                                }}
                                title="Հեռացնել պատասխանը"
                              >
                                🗑
                              </button>
                            )}

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginBottom: "0.4rem",
                              }}
                            >
                              <span style={{ fontSize: "0.85rem", color: "var(--gold-accent)" }}>
                                ↩
                              </span>
                              <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                                {reply.authorName}
                              </strong>
                              {reply.authorRole && reply.authorRole !== "guest" && (
                                <span
                                  style={{
                                    fontSize: "0.65rem",
                                    fontWeight: "700",
                                    padding: "0.1rem 0.4rem",
                                    borderRadius: "999px",
                                    background:
                                      USER_ROLES[reply.authorRole as keyof typeof USER_ROLES]
                                        ?.badgeBg || "rgba(183,121,31,0.15)",
                                    color:
                                      USER_ROLES[reply.authorRole as keyof typeof USER_ROLES]
                                        ?.badgeColor || "var(--gold-accent)",
                                  }}
                                >
                                  {USER_ROLES[reply.authorRole as keyof typeof USER_ROLES]
                                    ?.labelHy || reply.authorRole}
                                </span>
                              )}
                              <span
                                style={{
                                  marginLeft: "auto",
                                  fontSize: "0.72rem",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                {new Date(reply.createdAt).toLocaleDateString("hy-AM")}
                              </span>
                            </div>

                            <p
                              style={{
                                fontSize: "0.92rem",
                                color: "var(--text-primary)",
                                lineHeight: "1.6",
                                margin: 0,
                                whiteSpace: "pre-line",
                              }}
                            >
                              {reply.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Admin Edit Topic Modal */}
      {isEditingModalOpen && (
        <div
          className="civ-modal-overlay"
          onClick={() => setIsEditingModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="civ-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="civ-modal-close"
              onClick={() => setIsEditingModalOpen(false)}
              aria-label="Փակել"
            >
              ✕
            </button>

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.5rem",
                color: "var(--gold-accent)",
                margin: "0 0 1.5rem 0",
              }}
            >
              ✎ Խմբագրել Հարցադրումը
            </h2>

            <form
              onSubmit={handleUpdateTopic}
              style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
            >
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
                    Քաղաքակրթական Բևեռ / Թեգ
                  </label>
                  <input
                    type="text"
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
                    Ժամկետ / Տարեթիվ
                  </label>
                  <input
                    type="text"
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
                  <option value="rejected">✕ Մերժված</option>
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
                  onClick={() => setIsEditingModalOpen(false)}
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
                  {savingTopic ? "Պահպանվում է..." : "✓ Պահպանել"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Expert Opinion Modal */}
      {isExpertModalOpen && (
        <div
          className="civ-modal-overlay"
          onClick={() => setIsExpertModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="civ-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "620px" }}
          >
            <button
              type="button"
              className="civ-modal-close"
              onClick={() => setIsExpertModalOpen(false)}
              aria-label="Փակել"
            >
              ✕
            </button>

            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.5rem",
                color: "var(--gold-accent)",
                margin: "0 0 1.25rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{editingExpertOpinion ? "✎ Խմբագրել" : "✨ Ավելացնել"} Փորձագիտական Կարծիք</span>
            </h2>

            <form
              onSubmit={handleSaveExpertOpinion}
              style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
            >
              {/* Optional Quick Thinker Selector */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "0.35rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  💡 Ընտրել հայտնի մտածողների ցանկից (կամ լրացնել ինքնուրույն)
                </label>
                <select
                  value={expertFormThinkerId}
                  onChange={(e) => handleSelectThinker(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.7rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="">— Ընտրել հրավիրյալ մտածող (կամ մուտքագրել նորը) —</option>
                  {thinkerOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.civSymbol} {t.name} ({t.civName})
                    </option>
                  ))}
                </select>
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
                    Փորձագետի / Մտածողի Անուն *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Օր.՝ Ալեն դը Բենուա"
                    value={expertFormName}
                    onChange={(e) => setExpertFormName(e.target.value)}
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
                    Քաղաքակրթական Ավանդույթ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Օր.՝ Եվրոպական քաղաքակրթություն"
                    value={expertFormCivilization}
                    onChange={(e) => setExpertFormCivilization(e.target.value)}
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
                  Կոչում / Պաշտոն / Պատկանելություն
                </label>
                <input
                  type="text"
                  placeholder="Օր.՝ Փիլիսոփա, GRECE հետազոտական կենտրոնի հիմնադիր"
                  value={expertFormTitle}
                  onChange={(e) => setExpertFormTitle(e.target.value)}
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
                  Հիմնական Մեջբերում / Դիրքորոշում (Quote) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Մտածողի առանցքային թեզը կամ դիրքորոշումը տվյալ հարցադրման շուրջ..."
                  value={expertFormQuote}
                  onChange={(e) => setExpertFormQuote(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                    lineHeight: "1.6",
                    fontFamily: "inherit",
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
                  Ամբողջական Վերլուծություն / Շարադրանք (Կամընտրական)
                </label>
                <textarea
                  rows={4}
                  placeholder="Ավելի մանրամասն շարադրանք, պատմական կամ տեսական հիմնավորում (եթե առկա է)..."
                  value={expertFormFullText}
                  onChange={(e) => setExpertFormFullText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                    lineHeight: "1.6",
                    fontFamily: "inherit",
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
                  🔗 Սկզբնաղբյուրի Հղում / Հոդված (Կամընտրական)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={expertFormSourceUrl}
                  onChange={(e) => setExpertFormSourceUrl(e.target.value)}
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
                  onClick={() => setIsExpertModalOpen(false)}
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
                  disabled={savingExpert}
                  className="btn-primary"
                  style={{ padding: "0.6rem 1.5rem" }}
                >
                  {savingExpert ? "Պահպանվում է..." : "✓ Պահպանել Կարծիքը"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>

  );
}
