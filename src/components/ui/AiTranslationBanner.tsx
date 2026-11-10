"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AiTranslationBanner() {
  const { locale, isAiNoticeVisible, dismissAiNotice, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only display for non-Armenian versions and if not dismissed
  if (!mounted || locale === "hy" || !isAiNoticeVisible) {
    return null;
  }

  return (
    <aside
      aria-label="AI Translation Disclaimer"
      style={{
        background: "linear-gradient(90deg, rgba(183, 121, 31, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)",
        borderBottom: "1px solid rgba(183, 121, 31, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "0.45rem 1rem",
        fontSize: "0.82rem",
        color: "var(--text-secondary, #94a3b8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        zIndex: 90,
        position: "relative",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          maxWidth: "1200px",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              background: "rgba(183, 121, 31, 0.2)",
              color: "var(--gold-accent, #d4af37)",
              padding: "0.15rem 0.5rem",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "0.74rem",
              letterSpacing: "0.4px",
              border: "1px solid rgba(183, 121, 31, 0.35)",
            }}
          >
            ✦ AI
          </span>
          <span style={{ color: "var(--text-primary, #e2e8f0)", fontWeight: "500" }}>
            {t("ai.notice.short")}
          </span>
          <span
            className="ai-notice-detail"
            style={{
              opacity: 0.75,
              fontSize: "0.78rem",
              display: "none",
            }}
          >
            — {t("ai.notice.detailed")}
          </span>
        </div>

        <button
          onClick={dismissAiNotice}
          type="button"
          aria-label={t("btn.close")}
          title={t("btn.close")}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary, #94a3b8)",
            cursor: "pointer",
            fontSize: "0.95rem",
            padding: "0.2rem 0.5rem",
            borderRadius: "0.25rem",
            lineHeight: 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary, #ffffff)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary, #94a3b8)";
          }}
        >
          ✕
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .ai-notice-detail {
            display: inline !important;
          }
        }
      `}</style>
    </aside>
  );
}

