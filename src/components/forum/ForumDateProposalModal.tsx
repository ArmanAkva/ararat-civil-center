"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ForumSuggestion } from "@/types/content";

interface ForumDateProposalModalProps {
  currentDates: string;
  currentLocation: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (suggestion: Omit<ForumSuggestion, "id" | "createdAt" | "likesCount" | "likedBy" | "replies">) => Promise<void>;
}

export default function ForumDateProposalModal({
  currentDates,
  currentLocation,
  isOpen,
  onClose,
  onSubmit,
}: ForumDateProposalModalProps) {
  const { user, profile } = useAuth();

  const [mode, setMode] = useState<"proposal" | "rsvp">("proposal");
  const [authorName, setAuthorName] = useState(profile?.displayName || user?.displayName || "");
  const [authorEmail, setAuthorEmail] = useState(user?.email || "");
  const [authorAffiliation, setAuthorAffiliation] = useState(profile?.civilizationAffiliation || "");
  const [proposedDates, setProposedDates] = useState("");
  const [proposedLocation, setProposedLocation] = useState("");
  const [attendanceFormat, setAttendanceFormat] = useState<"in-person" | "online">("in-person");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      alert("Խնդրում ենք լրացնել Ձեր անունը։");
      return;
    }

    setSubmitting(true);
    try {
      const isRsvp = mode === "rsvp";
      const title = isRsvp
        ? `Մասնակցության Հաստատում (${attendanceFormat === "in-person" ? "Առկա" : "Առցանց"})`
        : `Այլընտրանքային Ժամկետ/Վայր: ${proposedDates || currentDates}`;

      const content = isRsvp
        ? `Մասնակիցը հաստատել է մասնակցությունը ${attendanceFormat === "in-person" ? "առկա ձևաչափով (Հայաստան)" : "առցանց հեռարձակմամբ"}։ Նշումներ՝ ${notes || "առանց լրացուցիչ նշումների"}`
        : `Առաջարկվող ժամկետ՝ ${proposedDates || "Ընթացիկ"}։ Առաջարկվող վայր՝ ${proposedLocation || currentLocation}։ Հիմնավորում/Մանրամասներ՝ ${notes}`;

      await onSubmit({
        type: "date_location",
        targetTitle: isRsvp ? "Մասնակցության Հայտ" : "Ժամկետներ և Վայր",
        category: isRsvp ? "attendance" : "suggestion",
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        authorAffiliation: authorAffiliation.trim() || undefined,
        authorRole: profile?.role || "member",
        authorUid: user?.uid,
        title,
        content,
      });

      setSuccessMsg(
        isRsvp
          ? "Շնորհակալություն։ Ձեր մասնակցության հաստատումը հաջողությամբ գրանցվեց ֆորումի քարտուղարությունում։"
          : "Շնորհակալություն։ Ձեր առաջարկը գրանցվեց և փոխանցվեց կազմկոմիտեին։"
      );

      setTimeout(() => {
        setSuccessMsg("");
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
      id="forum-date-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="civ-modal-box"
        id="forum-date-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
      >
        <button
          type="button"
          id="forum-date-modal-close"
          className="civ-modal-close"
          onClick={onClose}
          aria-label="Փակել"
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "1.6rem" }}>🗓️</span>
          <div>
            <h2
              id="forum-date-modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.45rem",
                color: "var(--gold-accent)",
                margin: 0,
              }}
            >
              Ֆորումի Ժամկետներ և Մասնակցություն
            </h2>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Ընթացիկ՝ {currentDates} • {currentLocation}
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            background: "var(--input-bg)",
            padding: "0.3rem",
            borderRadius: "0.6rem",
            marginBottom: "1.5rem",
            border: "1px solid var(--card-border)",
          }}
        >
          <button
            type="button"
            id="tab-propose-date"
            onClick={() => setMode("proposal")}
            style={{
              padding: "0.65rem 0.5rem",
              borderRadius: "0.45rem",
              border: "none",
              fontSize: "0.88rem",
              fontWeight: mode === "proposal" ? "600" : "normal",
              background: mode === "proposal" ? "var(--gold-accent)" : "transparent",
              color: mode === "proposal" ? "#fff" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            💡 Առաջարկել Ժամկետ / Վայր
          </button>
          <button
            type="button"
            id="tab-rsvp-date"
            onClick={() => setMode("rsvp")}
            style={{
              padding: "0.65rem 0.5rem",
              borderRadius: "0.45rem",
              border: "none",
              fontSize: "0.88rem",
              fontWeight: mode === "rsvp" ? "600" : "normal",
              background: mode === "rsvp" ? "var(--gold-accent)" : "transparent",
              color: mode === "rsvp" ? "#fff" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            ✓ Հաստատել Մասնակցություն
          </button>
        </div>

        {successMsg ? (
          <div
            id="forum-date-success-alert"
            style={{
              padding: "1.5rem",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "0.75rem",
              textAlign: "center",
              color: "var(--text-primary)",
              fontWeight: "500",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label
                  htmlFor="date-author-name"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Ձեր Անունը *
                </label>
                <input
                  id="date-author-name"
                  type="text"
                  required
                  placeholder="Օր.՝ Արմեն Ղազարյան"
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
                  htmlFor="date-author-email"
                  style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                >
                  Էլ. Փոստ
                </label>
                <input
                  id="date-author-email"
                  type="email"
                  placeholder="name@institution.am"
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

            <div>
              <label
                htmlFor="date-author-affil"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Կազմակերպություն / Քաղաքակրթական Պատկանելություն
              </label>
              <input
                id="date-author-affil"
                type="text"
                placeholder="Օր.՝ Մատենադարան, ԵՊՀ, կամ անկախ հետազոտող"
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

            {mode === "proposal" ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label
                      htmlFor="date-proposed-dates"
                      style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                    >
                      Առաջարկվող Ժամկետներ
                    </label>
                    <input
                      id="date-proposed-dates"
                      type="text"
                      placeholder="Օր.՝ 2027թ. Փետրվարի 10-12"
                      value={proposedDates}
                      onChange={(e) => setProposedDates(e.target.value)}
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
                      htmlFor="date-proposed-loc"
                      style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                    >
                      Առաջարկվող Վայր
                    </label>
                    <input
                      id="date-proposed-loc"
                      type="text"
                      placeholder="Օր.՝ Դիլիջան - Երևան"
                      value={proposedLocation}
                      onChange={(e) => setProposedLocation(e.target.value)}
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

                <div>
                  <label
                    htmlFor="date-proposal-notes"
                    style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                  >
                    Առաջարկի Հիմնավորում / Մեկնաբանություն
                  </label>
                  <textarea
                    id="date-proposal-notes"
                    rows={3}
                    placeholder="Նշեք, թե ինչու եք նախընտրում այս ժամկետները կամ ինչպիսի լոգիստիկ առավելություններ կան..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
              </>
            ) : (
              <>
                <div>
                  <label
                    style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                  >
                    Մասնակցության Ձևաչափ
                  </label>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="attendanceFormat"
                        value="in-person"
                        checked={attendanceFormat === "in-person"}
                        onChange={() => setAttendanceFormat("in-person")}
                      />
                      <span>🏛️ Առկա (Գյումրի - Էջմիածին - Երևան)</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="attendanceFormat"
                        value="online"
                        checked={attendanceFormat === "online"}
                        onChange={() => setAttendanceFormat("online")}
                      />
                      <span>🌐 Առցանց (Հեռարձակում & Քննարկումներ)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="date-rsvp-notes"
                    style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
                  >
                    Լրացուցիչ Նշումներ / Ակնկալիքներ Ֆորումից
                  </label>
                  <textarea
                    id="date-rsvp-notes"
                    rows={3}
                    placeholder="Նշեք, եթե ունեք հատուկ կարիքներ, ելույթի առաջարկ կամ հարցեր կազմկոմիտեին..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
              </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                id="btn-cancel-date-proposal"
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
                id="btn-submit-date-proposal"
                disabled={submitting}
                className="btn-primary"
                style={{ padding: "0.65rem 1.6rem" }}
              >
                {submitting ? "Ուղարկվում է..." : mode === "proposal" ? "Ուղարկել Առաջարկը" : "Հաստատել Մասնակցությունը"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
