"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useEditMode } from "@/context/EditModeContext";

export default function FloatingAdminBar() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { isEditMode, toggleEditMode, seedAll, saving, statusMessage } = useEditMode();

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      {/* Toast Notification */}
      {statusMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "85px",
            right: "24px",
            zIndex: 9999,
            background: statusMessage.type === "success" ? "#10b981" : "#ef4444",
            color: "#ffffff",
            padding: "0.85rem 1.4rem",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
            fontSize: "0.92rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <span>{statusMessage.type === "success" ? "✓" : "⚠️"}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Floating Dock */}
      <aside
        aria-label="CMS Կառավարման վահանակ"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "rgba(15, 23, 42, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: isEditMode
            ? "2px solid var(--gold-accent)"
            : "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: isEditMode
            ? "0 12px 35px rgba(183, 121, 31, 0.35)"
            : "0 8px 24px rgba(0, 0, 0, 0.25)",
          padding: "0.45rem 0.65rem",
          borderRadius: "999px",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Admin Role Tag */}
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: "700",
            padding: "0.3rem 0.7rem",
            borderRadius: "999px",
            background: isSuperAdmin
              ? "rgba(220, 38, 38, 0.25)"
              : "rgba(183, 121, 31, 0.25)",
            color: isSuperAdmin ? "#f87171" : "var(--gold-accent)",
            border: isSuperAdmin
              ? "1px solid rgba(220, 38, 38, 0.4)"
              : "1px solid var(--card-border)",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <span>{isSuperAdmin ? "👑" : "🛡"}</span>
          <span>{isSuperAdmin ? "Գերադմին" : "Ադմին"}</span>
        </div>

        {/* Edit Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleEditMode}
          style={{
            background: isEditMode
              ? "var(--gold-accent)"
              : "rgba(255, 255, 255, 0.08)",
            color: isEditMode ? "#ffffff" : "#e2e8f0",
            border: "none",
            borderRadius: "999px",
            padding: "0.55rem 1.15rem",
            fontSize: "0.88rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.25s ease",
            boxShadow: isEditMode
              ? "0 4px 14px rgba(183, 121, 31, 0.4)"
              : "none",
          }}
        >
          <span>{isEditMode ? "✏️" : "👁"}</span>
          <span>{isEditMode ? "Խմբագրումը՝ ԱԿՏԻՎ" : "Խմբագրել Էջը"}</span>
        </button>

        {/* Seed Button for Admins */}
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            if (
              confirm(
                "Սկզբնականացնե՞լ բոլոր քաղաքակրթությունները և էջերի բովանդակությունը Firestore-ում (Seed All):"
              )
            ) {
              await seedAll();
            }
          }}
          style={{
            background: "transparent",
            color: "#94a3b8",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "999px",
            padding: "0.5rem 0.85rem",
            fontSize: "0.78rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            transition: "all 0.2s ease",
          }}
          title="Սկզբնականացնել Firestore-ի հավաքածուները"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "var(--gold-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
        >
          <span>⚡️</span>
          <span>{saving ? "..." : "Seed All"}</span>
        </button>
      </aside>
    </>
  );
}
