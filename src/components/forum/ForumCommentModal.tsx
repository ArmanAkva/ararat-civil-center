"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ForumSuggestion, ForumMessageItem, ForumAgendaItem } from "@/types/content";

interface ForumCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ForumMessageItem[];
  agenda: ForumAgendaItem[];
  initialTarget?: {
    type: "message" | "agenda" | "manifesto" | "date_location" | "general";
    targetId?: string | number;
    targetTitle?: string;
  };
  onSubmit: (suggestion: Omit<ForumSuggestion, "id" | "createdAt" | "likesCount" | "likedBy" | "replies">) => Promise<void>;
}

export default function ForumCommentModal({
  isOpen,
  onClose,
  messages,
  agenda,
  initialTarget,
  onSubmit,
}: ForumCommentModalProps) {
  const { user, profile } = useAuth();

  const [authorName, setAuthorName] = useState(profile?.displayName || user?.displayName || "");
  const [authorEmail, setAuthorEmail] = useState(user?.email || "");
  const [authorAffiliation, setAuthorAffiliation] = useState(profile?.civilizationAffiliation || "");
  const [targetType, setTargetType] = useState<"message" | "agenda" | "manifesto" | "date_location" | "general">(
    initialTarget?.type || "message"
  );
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    initialTarget?.targetId ? String(initialTarget.targetId) : (messages[0]?.id ? String(messages[0].id) : "1")
  );
  const [category, setCategory] = useState<"suggestion" | "comment" | "amendment">("suggestion");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialTarget) {
      setTargetType(initialTarget.type);
      if (initialTarget.targetId !== undefined) {
        setSelectedTargetId(String(initialTarget.targetId));
      }
    }
  }, [initialTarget]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      alert("Խնդրում ենք լրացնել Ձեր անունը և առաջարկի/մեկնաբանության տեքստը։");
      return;
    }

    setSubmitting(true);
    try {
      let targetTitle = "Ֆորումի Ընդհանուր Հարցեր";
      let finalTargetId: string | number | undefined = undefined;

      if (targetType === "message") {
        const msg = messages.find((m) => String(m.id) === selectedTargetId);
        targetTitle = msg ? `${msg.title}: ${msg.content.slice(0, 45)}...` : `Ուղերձ #${selectedTargetId}`;
        finalTargetId = parseInt(selectedTargetId, 10) || selectedTargetId;
      } else if (targetType === "agenda") {
        const day = agenda.find((a) => a.id === selectedTargetId);
        targetTitle = day ? `${day.day} (${day.title})` : `Օրակարգ #${selectedTargetId}`;
        finalTargetId = selectedTargetId;
      } else if (targetType === "manifesto") {
        targetTitle = "Արարատյան Մանիֆեստ";
      } else if (targetType === "date_location") {
        targetTitle = "Ժամկետներ և Անցկացման Վայր";
      }

      await onSubmit({
        type: targetType,
        targetId: finalTargetId,
        targetTitle,
        category,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        authorAffiliation: authorAffiliation.trim() || undefined,
        authorRole: profile?.role || "member",
        authorUid: user?.uid,
        title: title.trim() || undefined,
        content: content.trim(),
        status: "approved",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setContent("");
        setTitle("");
        onClose();
      }, 1300);
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ հաղորդագրությունն ուղարկելիս։");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="civ-modal-overlay"
      id="forum-comment-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="civ-modal-box"
        id="forum-comment-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "640px" }}
      >
        <button
          type="button"
          id="forum-comment-modal-close"
          className="civ-modal-close"
          onClick={onClose}
          aria-label="Փակել"
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem" }}>
          <span style={{ fontSize: "1.75rem" }}>💬</span>
          <div>
            <h2
              id="forum-comment-modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.45rem",
                color: "var(--gold-accent)",
                margin: 0,
              }}
            >
              Ավելացնել Առաջարկ կամ Դիտարկում
            </h2>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Ձեր մեկնաբանությունը կհրապարակվի ֆորումի քննարկումների բաժնում
            </p>
          </div>
        </div>

        {success ? (
          <div
            id="forum-comment-success-alert"
            style={{
              padding: "2rem",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "0.75rem",
              textAlign: "center",
              color: "var(--text-primary)",
              fontWeight: "500",
            }}
          >
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>✅</div>
            Ձեր առաջարկը / մեկնաբանությունը հաջողությամբ ավելացվեց։
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label
                  htmlFor="comment-author-name"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Ձեր Անունը *
                </label>
                <input
                  id="comment-author-name"
                  type="text"
                  required
                  placeholder="Օր.՝ Վահագն Մելիքյան"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="comment-author-affil"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Կազմակերպություն / Գիտական Կենտրոն
                </label>
                <input
                  id="comment-author-affil"
                  type="text"
                  placeholder="Օր.՝ Մատենադարան, ԵՊՀ"
                  value={authorAffiliation}
                  onChange={(e) => setAuthorAffiliation(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Target & Category Selection */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
              <div>
                <label
                  htmlFor="comment-target-type"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Թեմատիկ Բաժին
                </label>
                <select
                  id="comment-target-type"
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="message">Օրակարգային Ուղերձներ</option>
                  <option value="agenda">3-Օրյա Օրակարգ</option>
                  <option value="manifesto">Արարատյան Մանիֆեստ</option>
                  <option value="date_location">Ժամկետներ և Վայր</option>
                  <option value="general">Ընդհանուր Ֆորումի Հարցեր</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="comment-category"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Տեսակ
                </label>
                <select
                  id="comment-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="suggestion">💡 Առաջարկ</option>
                  <option value="comment">💬 Դիտարկում</option>
                  <option value="amendment">✍️ Փոփոխություն</option>
                </select>
              </div>
            </div>

            {/* Sub-target selector if message or agenda */}
            {targetType === "message" && (
              <div>
                <label
                  htmlFor="comment-subtarget-msg"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Ընտրեք Ուղերձը
                </label>
                <select
                  id="comment-subtarget-msg"
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                >
                  {messages.map((m) => (
                    <option key={m.id} value={String(m.id)}>
                      {m.title} — {m.content.slice(0, 60)}...
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetType === "agenda" && (
              <div>
                <label
                  htmlFor="comment-subtarget-agenda"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Ընտրեք Օրակարգի Օրը
                </label>
                <select
                  id="comment-subtarget-agenda"
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--card-border)",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                    boxSizing: "border-box",
                  }}
                >
                  {agenda.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.day} — {a.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label
                htmlFor="comment-title"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Առաջարկի / Մեկնաբանության Վերնագիր (ըստ ցանկության)
              </label>
              <input
                id="comment-title"
                type="text"
                placeholder="Օր.՝ Միջքաղաքակրթական կապերի ընդլայնում"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--card-border)",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="comment-content"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Բովանդակություն *
              </label>
              <textarea
                id="comment-content"
                required
                rows={4}
                placeholder="Մուտքագրեք Ձեր առաջարկը, դիտարկումը կամ փոփոխության տեքստը..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--card-border)",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                id="btn-cancel-comment"
                onClick={onClose}
                style={{
                  padding: "0.65rem 1.25rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--card-border)",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                Չեղարկել
              </button>
              <button
                type="submit"
                id="btn-submit-comment"
                disabled={submitting}
                className="btn-primary"
                style={{ padding: "0.65rem 1.6rem" }}
              >
                {submitting ? "Հրապարակվում է..." : "Հրապարակել"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
