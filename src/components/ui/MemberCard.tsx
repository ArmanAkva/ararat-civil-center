"use client";

import React from "react";
import Link from "next/link";

export interface MemberAvatarProps {
  name: string;
  photoURL?: string | null;
  size?: number;
  role?: string;
  glow?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Extracts 1-2 initials cleanly from Armenian, English, or Russian names
 */
export function getMemberInitials(name: string): string {
  if (!name || !name.trim()) return "Ա";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Maps raw roles to prestigious Armenian badges
 */
export function formatMemberRole(role?: string): { label: string; color: string; bg: string; border: string } {
  if (!role) {
    return {
      label: "Անդամ",
      color: "var(--text-secondary)",
      bg: "rgba(255, 255, 255, 0.05)",
      border: "rgba(255, 255, 255, 0.12)",
    };
  }

  const r = role.toLowerCase();
  if (r.includes("super-admin") || r.includes("գերադմին") || r.includes("ղեկավար") || r.includes("համակարգող")) {
    return {
      label: "👑 Ղեկավար / Գերադմին",
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.14)",
      border: "rgba(217, 119, 6, 0.35)",
    };
  }
  if (r.includes("admin") || r.includes("ադմին") || r.includes("կազմկոմիտե")) {
    return {
      label: "🛡️ Կազմկոմիտե / Ադմին",
      color: "var(--gold-accent)",
      bg: "rgba(183, 121, 31, 0.14)",
      border: "rgba(183, 121, 31, 0.35)",
    };
  }
  if (r.includes("scholar") || r.includes("մտածող") || r.includes("փորձագետ") || r.includes("գիտ")) {
    return {
      label: "🖋️ Մտածող / Փորձագետ",
      color: "#a855f7",
      bg: "rgba(168, 85, 247, 0.12)",
      border: "rgba(168, 85, 247, 0.3)",
    };
  }

  return {
    label: role,
    color: "var(--gold-accent)",
    bg: "rgba(183, 121, 31, 0.1)",
    border: "rgba(183, 121, 31, 0.2)",
  };
}

/**
 * Highly polished Member Avatar with gold gradient halo or high-res photo
 */
export function MemberAvatar({
  name,
  photoURL,
  size = 32,
  role,
  glow = false,
  style,
  className,
}: MemberAvatarProps) {
  const initials = getMemberInitials(name);
  const fontSize = Math.max(10, Math.floor(size * 0.4));

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: "50%",
        background: photoURL
          ? "transparent"
          : "linear-gradient(135deg, rgba(183, 121, 31, 0.35) 0%, rgba(183, 121, 31, 0.1) 100%)",
        border: "1.5px solid var(--gold-accent)",
        boxShadow: glow
          ? "0 0 14px rgba(183, 121, 31, 0.35)"
          : "0 2px 6px rgba(0, 0, 0, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--gold-accent)",
        fontWeight: 700,
        fontFamily: "var(--font-serif)",
        fontSize: `${fontSize}px`,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        userSelect: "none",
        ...style,
      }}
      title={name}
      aria-label={name}
    >
      {photoURL ? (
        <img
          src={photoURL}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            // Fallback to text initials if image fails
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export interface MemberChipProps {
  name: string;
  photoURL?: string | null;
  role?: string;
  affiliation?: string;
  href?: string;
  onClick?: () => void;
  size?: "sm" | "md";
  style?: React.CSSProperties;
}

/**
 * Compact, professional Member Chip used inside other cards (e.g. TopicCard, dialogue preview, list items)
 */
export function MemberChip({
  name,
  photoURL,
  role,
  affiliation,
  href,
  onClick,
  size = "md",
  style,
}: MemberChipProps) {
  const roleInfo = role ? formatMemberRole(role) : null;
  const avatarSize = size === "sm" ? 22 : 26;

  const content = (
    <div
      className="member-chip"
      onClick={onClick}
      style={{
        padding: size === "sm" ? "0.15rem 0.5rem 0.15rem 0.2rem" : "0.22rem 0.65rem 0.22rem 0.25rem",
        cursor: href || onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <MemberAvatar name={name} photoURL={photoURL} size={avatarSize} />
      <span
        className="member-chip-name"
        style={{ fontSize: size === "sm" ? "0.76rem" : "0.82rem" }}
      >
        {name}
      </span>
      {roleInfo && (
        <span
          className="member-chip-role"
          style={{
            color: roleInfo.color,
            background: roleInfo.bg,
            border: `1px solid ${roleInfo.border}`,
            fontSize: size === "sm" ? "0.62rem" : "0.68rem",
          }}
        >
          {roleInfo.label}
        </span>
      )}
      {affiliation && (
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
          · {affiliation}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
        {content}
      </Link>
    );
  }

  return content;
}

export interface MemberAvatarStackProps {
  members: Array<{
    id?: string;
    name: string;
    photoURL?: string | null;
    title?: string;
  }>;
  max?: number;
  size?: number;
  showLabel?: boolean;
  labelSingular?: string;
  labelPlural?: string;
  onMemberClick?: (id?: string) => void;
  style?: React.CSSProperties;
}

/**
 * Elegant overlapping circular avatar stack for showing multiple members / thinkers on cards (e.g. Center Cards)
 */
export function MemberAvatarStack({
  members = [],
  max = 3,
  size = 28,
  showLabel = true,
  labelSingular = "հեղինակ",
  labelPlural = "հեղինակներ",
  onMemberClick,
  style,
}: MemberAvatarStackProps) {
  if (!members || members.length === 0) return null;

  const displayed = members.slice(0, max);
  const remainingCount = members.length - max;

  return (
    <div className="member-avatar-stack" style={style}>
      <div className="member-avatar-stack-group">
        {displayed.map((m, idx) => (
          <div
            key={m.id || idx}
            className="member-avatar-stack-item"
            style={{ width: `${size}px`, height: `${size}px`, zIndex: displayed.length - idx }}
            title={`${m.name}${m.title ? ` — ${m.title}` : ""}`}
            onClick={(e) => {
              if (onMemberClick) {
                e.preventDefault();
                e.stopPropagation();
                onMemberClick(m.id);
              }
            }}
          >
            {m.photoURL ? (
              <img src={m.photoURL} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span>{getMemberInitials(m.name)[0]}</span>
            )}
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className="member-avatar-stack-count"
            style={{ width: `${size}px`, height: `${size}px`, zIndex: 0 }}
            title={`Եվս ${remainingCount} ${remainingCount === 1 ? labelSingular : labelPlural}`}
          >
            +{remainingCount}
          </div>
        )}
      </div>

      {showLabel && (
        <span className="member-avatar-stack-label">
          {members.length} {members.length === 1 ? labelSingular : labelPlural}
        </span>
      )}
    </div>
  );
}

export interface TopicAuthorSignatureProps {
  authorName: string;
  authorRole?: string;
  date?: string;
  centerName?: string;
  centerId?: string;
  commentsCount?: number;
  expertsCount?: number;
  style?: React.CSSProperties;
}

/**
 * Distinguished Author Signature Block used on Dialogue Topic detail view
 */
export function TopicAuthorSignature({
  authorName,
  authorRole,
  date,
  centerName,
  centerId,
  commentsCount,
  expertsCount,
  style,
}: TopicAuthorSignatureProps) {
  const roleInfo = formatMemberRole(authorRole);

  return (
    <div className="topic-author-signature-card" style={style}>
      <MemberAvatar name={authorName} size={48} glow />
      <div style={{ flex: 1, minWidth: "220px" }}>
        <div className="topic-signature-eyebrow">Հարցադրման Նախաձեռնող / Հեղինակ</div>
        <div className="topic-signature-name">{authorName || "Արարատյան Կենտրոն"}</div>
        <div className="topic-signature-meta">
          <span
            className="topic-signature-badge"
            style={{
              color: roleInfo.color,
              background: roleInfo.bg,
              borderColor: roleInfo.border,
            }}
          >
            {roleInfo.label}
          </span>

          {date && <span>📅 {date}</span>}

          {centerName && (
            <Link
              href={centerId ? `/centers/${centerId}` : "#"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "var(--gold-accent)",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              <span>🏛️</span>
              <span>{centerName}</span>
            </Link>
          )}

          {typeof commentsCount === "number" && (
            <span>💬 {commentsCount} մեկնաբանություն</span>
          )}

          {typeof expertsCount === "number" && expertsCount > 0 && (
            <span style={{ color: "var(--gold-accent)", fontWeight: "600" }}>
              👥 {expertsCount} փորձագետ
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
