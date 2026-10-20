"use client";

import React, { useState } from "react";
import { ForumOrganizer } from "@/types/content";

interface ForumOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOwner?: ForumOrganizer;
  onSave: (owner: ForumOrganizer) => Promise<void>;
}

export default function ForumOwnerModal({
  isOpen,
  onClose,
  currentOwner,
  onSave,
}: ForumOwnerModalProps) {
  const [formData, setFormData] = useState<ForumOrganizer>({
    id: currentOwner?.id || `org-owner-${Date.now()}`,
    name: currentOwner?.name || "",
    role: currentOwner?.role || "Ֆորումի Գլխավոր Համակարգող / Ղեկավար",
    affiliation: currentOwner?.affiliation || "Արարատյան Քաղաքակրթական Կենտրոն / ԵՊՀ",
    isOwner: true,
    email: currentOwner?.email || "organizer@ararat-forum.org",
    phone: currentOwner?.phone || "",
    photoURL: currentOwner?.photoURL || "",
    bio:
      currentOwner?.bio ||
      "Համակարգում է միջքաղաքակրթական երկխոսության նախաձեռնությունները, պատասխանատու է Արարատյան Ֆորումի ռազմավարական տեսլականի և կազմկոմիտեի գործունեության համար։",
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Խնդրում ենք լրացնել ղեկավարի անունը։");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        isOwner: true,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ ղեկավարի տվյալները պահպանելիս։");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="civ-modal-overlay"
      id="forum-owner-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="civ-modal-box"
        id="forum-owner-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
      >
        <button
          type="button"
          id="forum-owner-modal-close"
          className="civ-modal-close"
          onClick={onClose}
          aria-label="Փակել"
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem" }}>
          <span style={{ fontSize: "1.75rem" }}>👑</span>
          <div>
            <h2
              id="forum-owner-modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.45rem",
                color: "var(--gold-accent)",
                margin: 0,
              }}
            >
              Սահմանել Ֆորումի Ղեկավար / Գլխավոր Համակարգող
            </h2>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Այս անձը հանդիսանում է ֆորումի գլխավոր կազմակերպիչն ու պաշտոնական ներկայացուցիչը
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                htmlFor="owner-name"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Անուն, Ազգանուն (Գիտական կոչում) *
              </label>
              <input
                id="owner-name"
                type="text"
                required
                placeholder="Օր.՝ Դոկտ. Արման Հովհաննիսյան"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                htmlFor="owner-role"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Պաշտոն / Կոչում Ֆորումում *
              </label>
              <input
                id="owner-role"
                type="text"
                required
                placeholder="Օր.՝ Ֆորումի Գլխավոր Համակարգող"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1rem" }}>
            <div>
              <label
                htmlFor="owner-affiliation"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Հաստատություն / Կազմակերպություն *
              </label>
              <input
                id="owner-affiliation"
                type="text"
                required
                placeholder="Օր.՝ Արարատյան Քաղաքակրթական Կենտրոն"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
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
                htmlFor="owner-email"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Էլ. Փոստ
              </label>
              <input
                id="owner-email"
                type="email"
                placeholder="organizer@ararat-forum.org"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                htmlFor="owner-phone"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Հեռախոս / Կապ (ըստ ցանկության)
              </label>
              <input
                id="owner-phone"
                type="text"
                placeholder="+374 (10) 00-00-00"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                htmlFor="owner-photourl"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Լուսանկարի URL
              </label>
              <input
                id="owner-photourl"
                type="url"
                placeholder="https://... /avatar.jpg"
                value={formData.photoURL || ""}
                onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
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
              htmlFor="owner-bio"
              style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
            >
              Կենսագրություն / Պատասխանատվության Շրջանակ
            </label>
            <textarea
              id="owner-bio"
              rows={3}
              placeholder="Ներկայացրեք ղեկավարի դերը, գիտական ուղղվածությունը և ֆորումի կազմակերպման տեսլականը..."
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
              id="btn-cancel-owner-modal"
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
              id="btn-submit-owner-modal"
              disabled={saving}
              className="btn-primary"
              style={{ padding: "0.65rem 1.6rem" }}
            >
              {saving ? "Պահպանվում է..." : "Պահպանել Ղեկավարին"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
