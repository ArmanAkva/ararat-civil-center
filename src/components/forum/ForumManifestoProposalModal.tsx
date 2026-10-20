"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ForumSuggestion } from "@/types/content";

interface ForumManifestoProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  manifestoTitle: string;
  manifestoCurrentText: string;
  onSubmit: (suggestion: Omit<ForumSuggestion, "id" | "createdAt" | "likesCount" | "likedBy" | "replies">) => Promise<void>;
}

export default function ForumManifestoProposalModal({
  isOpen,
  onClose,
  manifestoTitle,
  manifestoCurrentText,
  onSubmit,
}: ForumManifestoProposalModalProps) {
  const { user, profile } = useAuth();

  const [authorName, setAuthorName] = useState(profile?.displayName || user?.displayName || "");
  const [authorEmail, setAuthorEmail] = useState(user?.email || "");
  const [authorAffiliation, setAuthorAffiliation] = useState(profile?.civilizationAffiliation || "");
  const [proposalType, setProposalType] = useState<"amendment" | "addition" | "editorial">("amendment");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [rationale, setRationale] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !proposalText.trim()) {
      alert("Խնդրում ենք լրացնել Ձեր անունը և առաջարկի բովանդակությունը։");
      return;
    }

    setSubmitting(true);
    try {
      const typeLabel =
        proposalType === "amendment"
          ? "Փոփոխություն/Վերաձևակերպում"
          : proposalType === "addition"
          ? "Լրացուցիչ Դրույթ"
          : "Խմբագրական Ճշգրտում";

      const combinedContent = `${proposalText.trim()}\n\n[Հիմնավորում]: ${
        rationale.trim() || "Լրացուցիչ հիմնավորում չի նշվել"
      }`;

      await onSubmit({
        type: "manifesto",
        targetTitle: manifestoTitle || "Արարատյան Մանիֆեստ",
        category: "amendment",
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        authorAffiliation: authorAffiliation.trim() || undefined,
        authorRole: profile?.role || "scholar",
        authorUid: user?.uid,
        title: proposalTitle.trim() || `Առաջարկ Մանիֆեստին (${typeLabel})`,
        content: combinedContent,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ առաջարկն ուղարկելիս։");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="civ-modal-overlay"
      id="forum-manifesto-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="civ-modal-box"
        id="forum-manifesto-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "660px" }}
      >
        <button
          type="button"
          id="forum-manifesto-modal-close"
          className="civ-modal-close"
          onClick={onClose}
          aria-label="Փակել"
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem" }}>
          <span style={{ fontSize: "1.75rem" }}>📜</span>
          <div>
            <h2
              id="forum-manifesto-modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.45rem",
                color: "var(--gold-accent)",
                margin: 0,
              }}
            >
              Առաջարկ «{manifestoTitle}»-ի Վերաբերյալ
            </h2>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Ներկայացրեք Ձեր խմբագրական կամ հայեցակարգային առաջարկը Խմբագրական Խորհրդին
            </p>
          </div>
        </div>

        {/* Current excerpt preview */}
        <div
          style={{
            background: "rgba(212, 175, 55, 0.06)",
            border: "1px solid var(--card-border)",
            borderRadius: "0.6rem",
            padding: "0.85rem 1.1rem",
            marginBottom: "1.2rem",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            fontStyle: "italic",
          }}
        >
          <strong style={{ fontStyle: "normal", color: "var(--gold-accent)" }}>Գործող ձևակերպում. </strong>
          «{manifestoCurrentText}»
        </div>

        {success ? (
          <div
            id="forum-manifesto-success-alert"
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
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>✍️</div>
            Շնորհակալություն։ Ձեր առաջարկը գրանցվեց և փոխանցվեց Արարատյան Մանիֆեստի խմբագրական խորհրդին։
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label
                  htmlFor="manifesto-author-name"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Հեղինակի Անունը *
                </label>
                <input
                  id="manifesto-author-name"
                  type="text"
                  required
                  placeholder="Օր.՝ Դոկտ. Սուրեն Աբրահամյան"
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
                  htmlFor="manifesto-author-email"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Էլ. Փոստ
                </label>
                <input
                  id="manifesto-author-email"
                  type="email"
                  placeholder="author@thinktank.am"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
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

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1rem" }}>
              <div>
                <label
                  htmlFor="manifesto-author-affil"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Գիտական Կենտրոն / Հաստատություն
                </label>
                <input
                  id="manifesto-author-affil"
                  type="text"
                  placeholder="Օր.՝ ՀՀ ԳԱԱ Փիլիսոփայության ինստիտուտ"
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

              <div>
                <label
                  htmlFor="manifesto-proposal-type"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Առաջարկի Տեսակը
                </label>
                <select
                  id="manifesto-proposal-type"
                  value={proposalType}
                  onChange={(e) => setProposalType(e.target.value as any)}
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
                  <option value="amendment">Վերաձևակերպում</option>
                  <option value="addition">Լրացուցիչ Դրույթ</option>
                  <option value="editorial">Խմբագրական Շտկում</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="manifesto-proposal-title"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Առաջարկի Վերնագիր / Թեմա
              </label>
              <input
                id="manifesto-proposal-title"
                type="text"
                placeholder="Օր.՝ Քաղաքակրթական ինքնիշխանության սահմանումը"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
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
                htmlFor="manifesto-proposal-content"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Առաջարկվող Տեքստ / Դրույթ *
              </label>
              <textarea
                id="manifesto-proposal-content"
                required
                rows={4}
                placeholder="Մուտքագրեք Մանիֆեստում ներառվելիք նոր կամ վերախմբագրված տեքստը..."
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
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

            <div>
              <label
                htmlFor="manifesto-proposal-rationale"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Գիտական / Փիլիսոփայական Հիմնավորում
              </label>
              <textarea
                id="manifesto-proposal-rationale"
                rows={2}
                placeholder="Նշեք, թե ինչ պատմական, արժեքային կամ աշխարհաքաղաքական հիմքեր ունի այս առաջարկը..."
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
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
                id="btn-cancel-manifesto-proposal"
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
                id="btn-submit-manifesto-proposal"
                disabled={submitting}
                className="btn-primary"
                style={{ padding: "0.65rem 1.6rem" }}
              >
                {submitting ? "Ուղարկվում է..." : "Ուղարկել Խորհրդին"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
