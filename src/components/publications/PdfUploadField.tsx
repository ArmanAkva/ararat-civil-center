"use client";

import React, { useState, useRef } from "react";
import { uploadPublicationPdf, formatFileSize } from "@/lib/storageService";

interface PdfUploadFieldProps {
  civId?: string;
  downloadUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  onChange: (data: {
    downloadUrl: string;
    fileName?: string;
    fileSizeBytes?: number;
  }) => void;
  label?: string;
}

export default function PdfUploadField({
  civId = "general",
  downloadUrl = "",
  fileName = "",
  fileSizeBytes,
  onChange,
  label = "PDF Փաստաթուղթ / Առցանց Հղում",
}: PdfUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"file" | "url">(downloadUrl && !fileName ? "url" : "file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadPublicationPdf(file, civId, (p) => {
        setProgress(p);
      });
      onChange({
        downloadUrl: res.downloadUrl,
        fileName: res.fileName,
        fileSizeBytes: res.fileSizeBytes,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ֆայլի վերբեռնումը ձախողվեց:");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange({
      downloadUrl: "",
      fileName: "",
      fileSizeBytes: undefined,
    });
    setError(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "var(--text-primary)",
          }}
        >
          {label}
        </label>
        <div style={{ display: "flex", gap: "0.3rem" }}>
          <button
            type="button"
            onClick={() => setMode("file")}
            style={{
              background: mode === "file" ? "var(--gold-accent)" : "rgba(255, 255, 255, 0.06)",
              color: mode === "file" ? "#ffffff" : "var(--text-secondary)",
              border: "none",
              padding: "0.2rem 0.55rem",
              borderRadius: "0.3rem",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            📎 Վերբեռնել PDF
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            style={{
              background: mode === "url" ? "var(--gold-accent)" : "rgba(255, 255, 255, 0.06)",
              color: mode === "url" ? "#ffffff" : "var(--text-secondary)",
              border: "none",
              padding: "0.2rem 0.55rem",
              borderRadius: "0.3rem",
              fontSize: "0.75rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            🔗 Արտաքին URL
          </button>
        </div>
      </div>

      {mode === "file" ? (
        <div
          style={{
            border: "1px dashed var(--card-border)",
            borderRadius: "0.5rem",
            padding: "0.85rem",
            background: "var(--input-bg)",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          {downloadUrl ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
                background: "rgba(183, 121, 31, 0.1)",
                padding: "0.55rem 0.8rem",
                borderRadius: "0.4rem",
                border: "1px solid rgba(183, 121, 31, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
                <span style={{ fontSize: "1.2rem" }}>📄</span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "280px",
                    }}
                    title={fileName || "PDF փաստաթուղթ"}
                  >
                    {fileName || "PDF փաստաթուղթ (կցված է)"}
                  </div>
                  {fileSizeBytes && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {formatFileSize(fileSizeBytes)}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--gold-accent)",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: "0.2rem 0.4rem",
                  }}
                >
                  👁 Դիտել
                </a>
                <button
                  type="button"
                  onClick={handleRemove}
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    borderRadius: "0.3rem",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  title="Հեռացնել ֆայլը"
                >
                  ✕ Հեռացնել
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileSelect}
                disabled={uploading}
                style={{ display: "none" }}
                id="pdf-upload-input"
              />
              <label
                htmlFor="pdf-upload-input"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "0.4rem",
                  background: "rgba(183, 121, 31, 0.15)",
                  border: "1px solid var(--gold-accent)",
                  color: "var(--gold-accent)",
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                <span>{uploading ? "⏳" : "📤"}</span>
                <span>
                  {uploading
                    ? `Վերբեռնվում է Storage... (${progress}%)`
                    : "Ընտրել PDF Ֆայլ համակարգչից"}
                </span>
              </label>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                Ֆայլը կպահպանվի Firebase Storage-ում (առավելագույնը 50 ՄԲ)
              </div>
            </div>
          )}

          {uploading && (
            <div
              style={{
                width: "100%",
                height: "6px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "3px",
                overflow: "hidden",
                marginTop: "0.3rem",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "var(--gold-accent)",
                  transition: "width 0.2s ease",
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="url"
            placeholder="https://example.com/document.pdf"
            value={downloadUrl}
            onChange={(e) =>
              onChange({
                downloadUrl: e.target.value.trim(),
                fileName: fileName || (e.target.value ? "Առցանց PDF" : ""),
                fileSizeBytes,
              })
            }
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: "0.5rem",
              background: "var(--input-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-primary)",
              boxSizing: "border-box",
              fontSize: "0.9rem",
            }}
          />
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Նշեք արտաքին հղումը կամ առցանց փաստաթղթի հասցեն
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.2rem" }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
