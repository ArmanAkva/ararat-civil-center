"use client";

import React, { useState, useEffect } from "react";
import { useEditMode } from "@/context/EditModeContext";

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "span" | "div" | "small" | "strong";
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  label?: string;
  id?: string;
}

export default function EditableText({
  value,
  onSave,
  tag = "p",
  className = "",
  style = {},
  multiline = false,
  label,
  id,
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  // Guarantee client hydration matches server initial HTML to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync draft when incoming value changes
  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (draft === value) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onSave(draft);
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const Component = tag;
  const isInline = tag === "span" || tag === "small" || tag === "strong";
  const Wrapper = isInline ? "span" : "div";

  // 1. Not mounted or Not in Edit Mode: render pristine element
  // This guarantees SSR output matches client hydration 100%
  if (!mounted || !isEditMode) {
    return (
      <Component id={id} className={className} style={style}>
        {value}
      </Component>
    );
  }

  // 2. Currently actively editing this specific text
  if (isEditing) {
    return (
      <Wrapper
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          position: "relative",
          margin: isInline ? "0.2rem 0" : "0.5rem 0",
          background: "var(--bg-secondary)",
          border: "2px solid var(--gold-accent)",
          borderRadius: "0.75rem",
          padding: "1rem",
          boxShadow: "0 8px 30px rgba(183, 121, 31, 0.2)",
          zIndex: 50,
          display: isInline ? "inline-block" : "block",
        }}
      >
        {label && (
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: "700",
              color: "var(--gold-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.4rem",
            }}
          >
            Խմբագրում. {label}
          </div>
        )}

        {multiline ? (
          <textarea
            autoFocus
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "var(--input-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "0.5rem",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: "1rem",
              lineHeight: "1.6",
              boxSizing: "border-box",
              outline: "none",
              marginBottom: "0.75rem",
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
            }}
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "var(--input-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "0.5rem",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: "1rem",
              boxSizing: "border-box",
              outline: "none",
              marginBottom: "0.75rem",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
          />
        )}

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            disabled={saving}
            onClick={handleCancel}
            style={{
              padding: "0.4rem 0.85rem",
              fontSize: "0.85rem",
              borderRadius: "0.4rem",
              background: "transparent",
              border: "1px solid var(--card-border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            ✕ Չեղարկել
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            style={{
              padding: "0.4rem 1rem",
              fontSize: "0.85rem",
              fontWeight: "600",
              borderRadius: "0.4rem",
              background: "var(--gold-accent)",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            {saving ? "Պահպանվում է..." : "✓ Պահպանել"}
          </button>
        </div>
      </Wrapper>
    );
  }

  // 3. Edit Mode is ON, but not yet opened: show interactive hoverable container
  return (
    <Wrapper
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }
      }}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "0.4rem",
        border: "1px dashed rgba(183, 121, 31, 0.4)",
        padding: "0.2rem 0.4rem",
        margin: "-0.2rem -0.4rem",
        transition: "all 0.2s ease",
        display: isInline ? "inline-block" : "block",
      }}
      title="Սեղմեք՝ տեքստը խմբագրելու համար"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gold-accent)";
        e.currentTarget.style.background = "rgba(183, 121, 31, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(183, 121, 31, 0.4)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "-10px",
          right: "-8px",
          background: "var(--gold-accent)",
          color: "#ffffff",
          fontSize: "0.65rem",
          fontWeight: "bold",
          padding: "0.15rem 0.4rem",
          borderRadius: "999px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        ✏️ Խմբագրել
      </span>
      <Component id={id} className={className} style={style}>
        {value}
      </Component>
    </Wrapper>
  );
}
