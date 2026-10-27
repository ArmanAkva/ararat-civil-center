"use client";

import React, { useEffect } from "react";
import { formatFileSize } from "@/lib/storageService";

interface PdfViewerModalProps {
  url: string;
  title: string;
  authorName?: string;
  year?: string;
  pages?: number;
  fileName?: string;
  fileSizeBytes?: number;
  onClose: () => void;
}

export default function PdfViewerModal({
  url,
  title,
  authorName,
  year,
  pages,
  fileName,
  fileSizeBytes,
  onClose,
}: PdfViewerModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleDownload = () => {
    // Open download link or trigger download
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = fileName || `${title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="civ-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        zIndex: 9999,
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="civ-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "95vw",
          maxWidth: "1150px",
          height: "90vh",
          maxHeight: "920px",
          display: "flex",
          flexDirection: "column",
          padding: 0,
          overflow: "hidden",
          borderRadius: "1rem",
          background: "var(--bg-secondary, #12151c)",
          border: "1px solid var(--gold-accent, #cda45e)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.75)",
        }}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: "0.85rem 1.4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
            background: "rgba(0, 0, 0, 0.35)",
            borderBottom: "1px solid var(--card-border, rgba(205, 164, 94, 0.2))",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.78rem",
                color: "var(--gold-accent)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.2rem",
                fontWeight: 600,
              }}
            >
              <span>📄 Թվային Փաստաթուղթ</span>
              {year && <span>• {year}թ.</span>}
              {pages && <span>• {pages} էջ</span>}
              {fileSizeBytes && <span>• {formatFileSize(fileSizeBytes)}</span>}
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.1rem",
                color: "var(--text-primary, #ffffff)",
                fontFamily: "var(--font-serif, Georgia, serif)",
                lineHeight: "1.3",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "600px",
              }}
              title={title}
            >
              {title}
            </h3>
            {authorName && (
              <span
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-secondary, #9ca3af)",
                }}
              >
                Հեղինակ՝ {authorName}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={handleDownload}
              className="btn-primary"
              style={{
                padding: "0.45rem 1rem",
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
              title="Ներբեռնել PDF ֆայլը"
            >
              <span>⬇️</span>
              <span>Ներբեռնել PDF</span>
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "0.4rem",
                fontSize: "0.85rem",
                background: "rgba(205, 164, 94, 0.12)",
                color: "var(--gold-accent)",
                border: "1px solid var(--gold-accent)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontWeight: 600,
              }}
              title="Բացել նոր ներդիրում"
            >
              <span>↗</span>
              <span>Նոր ներդիրում</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "1px solid var(--card-border, rgba(255, 255, 255, 0.15))",
                color: "var(--text-secondary, #9ca3af)",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
              aria-label="Փակել"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal PDF Viewer Body */}
        <div
          style={{
            flex: 1,
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#1e222d",
          }}
        >
          <iframe
            src={`${url}#toolbar=1&navpanes=0`}
            title={title}
            width="100%"
            height="100%"
            style={{
              border: "none",
              display: "block",
              width: "100%",
              height: "100%",
            }}
          />

          {/* Fallback bar at bottom in case iframe is not rendered */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "0.5rem 1rem",
              background: "rgba(18, 21, 28, 0.95)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              zIndex: 10,
            }}
          >
            <span>
              Եթե PDF-ը չի ցուցադրվում, կարող եք ներբեռնել կամ բացել այն անմիջապես:
            </span>
            <button
              type="button"
              onClick={handleDownload}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--gold-accent)",
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              ⬇️ Ներբեռնել հիմա
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
