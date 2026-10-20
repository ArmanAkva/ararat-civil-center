"use client";

import React, { useState } from "react";
import { ForumOrganizer } from "@/types/content";

interface ForumOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizer?: ForumOrganizer | null;
  onSave: (member: ForumOrganizer) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function ForumOrganizerModal({
  isOpen,
  onClose,
  organizer,
  onSave,
  onDelete,
}: ForumOrganizerModalProps) {
  const isEditing = !!organizer;

  const [formData, setFormData] = useState<ForumOrganizer>({
    id: organizer?.id || `org-${Date.now()}`,
    name: organizer?.name || "",
    role: organizer?.role || "Կազմկոմիտեի Անդամ",
    affiliation: organizer?.affiliation || "Արարատյան Կենտրոն",
    isOwner: organizer?.isOwner || false,
    email: organizer?.email || "",
    phone: organizer?.phone || "",
    photoURL: organizer?.photoURL || "",
    bio: organizer?.bio || "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Խնդրում ենք լրացնել անդամի անունը և պաշտոնը։");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...formData,
        name: formData.name.trim(),
        role: formData.role.trim(),
        affiliation: formData.affiliation.trim(),
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ տվյալները պահպանելիս։");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!organizer || !onDelete) return;
    if (!confirm(`Իսկապե՞ս ցանկանում եք հեռացնել «${organizer.name}»-ին կազմկոմիտեից:`)) return;

    setDeleting(true);
    try {
      await onDelete(organizer.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ անդամին հեռացնելիս։");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="civ-modal-overlay"
      id="forum-organizer-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="civ-modal-box"
        id="forum-organizer-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px" }}
      >
        <button
          type="button"
          id="forum-organizer-modal-close"
          className="civ-modal-close"
          onClick={onClose}
          aria-label="Փակել"
        >
          ✕
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.2rem" }}>
          <span style={{ fontSize: "1.75rem" }}>👥</span>
          <div>
            <h2
              id="forum-organizer-modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.45rem",
                color: "var(--gold-accent)",
                margin: 0,
              }}
            >
              {isEditing ? "Խմբագրել Կազմկոմիտեի Անդամին" : "Ավելացնել Նոր Կազմակերպիչ"}
            </h2>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Ֆորումի կազմկոմիտեի անդամների տվյալների և դերակատարման կառավարում
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                htmlFor="organizer-name"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Անուն, Ազգանուն *
              </label>
              <input
                id="organizer-name"
                type="text"
                required
                placeholder="Օր.՝ Դոկտ. Աննա Սարգսյան"
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
                htmlFor="organizer-role"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Դեր / Պաշտոն Կազմկոմիտեում *
              </label>
              <input
                id="organizer-role"
                type="text"
                required
                placeholder="Օր.՝ Գիտական Քարտուղար"
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
                htmlFor="organizer-affiliation"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Հաստատություն / Կենտրոն *
              </label>
              <input
                id="organizer-affiliation"
                type="text"
                required
                placeholder="Օր.՝ Մատենադարան կամ CASS"
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
                htmlFor="organizer-email"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Էլ. Փոստ
              </label>
              <input
                id="organizer-email"
                type="email"
                placeholder="member@organization.am"
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
                htmlFor="organizer-photourl"
                style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
              >
                Լուսանկարի URL
              </label>
              <input
                id="organizer-photourl"
                type="url"
                placeholder="https://... /photo.jpg"
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

            <div style={{ display: "flex", alignItems: "center", paddingTop: "1.6rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  id="organizer-is-owner"
                  checked={formData.isOwner}
                  onChange={(e) => setFormData({ ...formData, isOwner: e.target.checked })}
                />
                <span style={{ fontWeight: "600", color: "var(--gold-accent)" }}>
                  👑 Սահմանել որպես Ֆորումի Ղեկավար
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="organizer-bio"
              style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.3rem" }}
            >
              Պարտականություններ / Կենսագրություն
            </label>
            <textarea
              id="organizer-bio"
              rows={3}
              placeholder="Նշեք անդամի պատասխանատվությունը կազմկոմիտեում..."
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
            {isEditing && onDelete ? (
              <button
                type="button"
                id="btn-delete-organizer"
                disabled={deleting}
                onClick={handleDelete}
                style={{
                  padding: "0.65rem 1.1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "0.88rem",
                }}
              >
                {deleting ? "Ջնջվում է..." : "🗑️ Հեռացնել Թիմից"}
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                id="btn-cancel-organizer"
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
                id="btn-submit-organizer"
                disabled={saving}
                className="btn-primary"
                style={{ padding: "0.65rem 1.6rem" }}
              >
                {saving ? "Պահպանվում է..." : isEditing ? "Պահպանել Փոփոխությունները" : "Ավելացնել Թիմին"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
