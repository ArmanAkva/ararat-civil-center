"use client";

import React, { useState } from "react";

interface FieldConfig {
  key: string;
  label: string;
  type?: "text" | "textarea" | "tags";
  placeholder?: string;
}

interface EditCardModalProps<T> {
  title: string;
  initialData: T;
  fields: FieldConfig[];
  onSave: (data: T) => Promise<void>;
  onClose: () => void;
  onDelete?: () => Promise<void>;
}

export default function EditCardModal<T extends Record<string, any>>({
  title,
  initialData,
  fields,
  onSave,
  onClose,
  onDelete,
}: EditCardModalProps<T>) {
  const [formData, setFormData] = useState<T>({ ...initialData });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ պահպանելիս:");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="civ-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="civ-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="civ-modal-close"
          onClick={onClose}
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
          {title}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {fields.map((f) => (
            <div key={f.key}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginBottom: "0.35rem",
                  color: "var(--text-primary)",
                }}
              >
                {f.label}
              </label>

              {f.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={formData[f.key] || ""}
                  onChange={(e) => handleFieldChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              ) : f.type === "tags" ? (
                <input
                  type="text"
                  value={Array.isArray(formData[f.key]) ? formData[f.key].join(", ") : formData[f.key] || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      f.key,
                      e.target.value
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="բաժանեք ստորակետով՝ Փիլիսոփայություն, Էթիկա..."
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={formData[f.key] || ""}
                  onChange={(e) => handleFieldChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "var(--input-bg)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "0.5rem",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid var(--card-border)",
              position: "sticky",
              bottom: "-2.5rem",
              background: "var(--bg-secondary)",
              paddingBottom: "0.5rem",
              zIndex: 10,
            }}
          >
            {onDelete ? (
              <button
                type="button"
                onClick={async () => {
                  if (confirm("Իսկապե՞ս ցանկանում եք հեռացնել այս տարրը:")) {
                    await onDelete();
                    onClose();
                  }
                }}
                style={{
                  background: "transparent",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  borderRadius: "0.4rem",
                  padding: "0.5rem 0.9rem",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                🗑 Հեռացնել
              </button>
            ) : (
              <div></div>
            )}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={onClose}
                className="credo-action-btn"
              >
                Չեղարկել
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}
              >
                {saving ? "Պահպանվում է..." : "✓ Պահպանել"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
