"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useEditMode } from "@/context/EditModeContext";

export default function FloatingAdminBar() {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const {
    isEditMode,
    toggleEditMode,
    isAdminBarVisible,
    toggleAdminBarVisible,
    statusMessage,
  } = useEditMode();

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

      {/* When Minimized / Collapsed: Compact Unobtrusive Floating Pill */}
      {!isAdminBarVisible ? (
        <button
          type="button"
          onClick={toggleAdminBarVisible}
          title="Բացել Կառավարման Վահանակը (CMS Admin Dock)"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9998,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            background: isEditMode ? "var(--gold-accent)" : "rgba(15, 23, 42, 0.88)",
            color: "#ffffff",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: isEditMode
              ? "1.5px solid #ffffff"
              : "1px solid rgba(255, 255, 255, 0.18)",
            padding: "0.45rem 0.85rem",
            borderRadius: "999px",
            boxShadow: isEditMode
              ? "0 8px 25px rgba(183, 121, 31, 0.5)"
              : "0 6px 20px rgba(0, 0, 0, 0.25)",
            cursor: "pointer",
            fontSize: "0.78rem",
            fontWeight: "700",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span>{isEditMode ? "✏️" : "🛡️"}</span>
          <span>{isEditMode ? "Խմբագրում (Ակտիվ)" : "Վահանակ"}</span>
          <span style={{ opacity: 0.65, fontSize: "0.7rem", marginLeft: "2px" }}>▲</span>
        </button>
      ) : (
        /* Full Expanded Floating Dock */
        <aside
          aria-label="CMS Կառավարման վահանակ"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            background: "rgba(15, 23, 42, 0.92)",
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
              padding: "0.52rem 1.15rem",
              fontSize: "0.85rem",
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

          {/* Minimize / Hide Button */}
          <button
            type="button"
            onClick={toggleAdminBarVisible}
            title="Ծալել / Թաքցնել վահանակը"
            aria-label="Ծալել վահանակը"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#94a3b8",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: "700",
              transition: "all 0.2s ease",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
          >
            ✕
          </button>
        </aside>
      )}
    </>
  );
}
