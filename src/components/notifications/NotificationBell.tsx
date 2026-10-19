"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SiteNotification } from "@/types/dialogue";
import {
  listenToUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/dialogueService";

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<SiteNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time notifications for the logged-in user
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const unsubscribe = listenToUserNotifications(user.uid, (list) => {
      setNotifications(list);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const unreadList = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadList.length;

  const handleNotificationClick = async (notif: SiteNotification) => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id);
    }
    setIsOpen(false);
    const hash = notif.commentId ? `#${notif.commentId}` : "";
    router.push(`/dialogue/${notif.topicId}${hash}`);
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    const ids = unreadList.map((n) => n.id);
    await markAllNotificationsAsRead(user.uid, ids);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "քիչ առաջ";
      if (diffMin < 60) return `${diffMin}ր առաջ`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}ժ առաջ`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}օր առաջ`;
    } catch {
      return "";
    }
  };

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          background: "transparent",
          border: "1px solid var(--card-border)",
          color: unreadCount > 0 ? "var(--gold-accent)" : "var(--text-secondary)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontSize: "1.05rem",
          transition: "all 0.2s ease",
        }}
        title="Ծանուցումներ"
        aria-label="Ծանուցումներ"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "0.68rem",
              fontWeight: "700",
              minWidth: "18px",
              height: "18px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: "360px",
            maxWidth: "90vw",
            background: "var(--card-bg)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--card-border)",
            borderRadius: "0.85rem",
            boxShadow: "0 14px 40px rgba(0, 0, 0, 0.35)",
            zIndex: 9999,
            overflow: "hidden",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "0.85rem 1rem",
              borderBottom: "1px solid var(--card-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(183, 121, 31, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ fontSize: "1.1rem" }}>🔔</span>
              <span
                style={{
                  fontWeight: "700",
                  fontSize: "0.92rem",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                Ծանուցումներ
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#ef4444",
                    fontSize: "0.72rem",
                    fontWeight: "700",
                    padding: "0.15rem 0.45rem",
                    borderRadius: "999px",
                  }}
                >
                  {unreadCount} նոր
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--gold-accent)",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "0.2rem 0.4rem",
                }}
              >
                ✓ Կարդացված
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: "380px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "2.5rem 1rem",
                  textAlign: "center",
                  color: "var(--text-secondary)",
                  fontSize: "0.88rem",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem", opacity: 0.6 }}>📭</div>
                Դեռևս ծանուցումներ չունեք:
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: "0.85rem 1rem",
                    borderBottom: "1px solid var(--card-border)",
                    cursor: "pointer",
                    background: notif.isRead ? "transparent" : "rgba(183, 121, 31, 0.07)",
                    transition: "background 0.2s ease",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(183, 121, 31, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notif.isRead
                      ? "transparent"
                      : "rgba(183, 121, 31, 0.07)";
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        notif.type === "topic_approved"
                          ? "rgba(16, 185, 129, 0.15)"
                          : notif.type === "topic_rejected"
                          ? "rgba(239, 68, 68, 0.15)"
                          : notif.type === "comment_reply"
                          ? "rgba(59, 130, 246, 0.15)"
                          : "rgba(183, 121, 31, 0.15)",
                      color:
                        notif.type === "topic_approved"
                          ? "#10b981"
                          : notif.type === "topic_rejected"
                          ? "#ef4444"
                          : notif.type === "comment_reply"
                          ? "#3b82f6"
                          : "var(--gold-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                      flexShrink: 0,
                    }}
                  >
                    {notif.type === "topic_approved"
                      ? "🎉"
                      : notif.type === "topic_rejected"
                      ? "⚠️"
                      : notif.type === "comment_reply"
                      ? "↩️"
                      : "💬"}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--text-primary)",
                        lineHeight: "1.4",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {notif.textSnippet}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.72rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "180px",
                          color: "var(--gold-accent)",
                        }}
                      >
                        {notif.topicTitle}
                      </span>
                      <span>{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--gold-accent)",
                        flexShrink: 0,
                        marginTop: "6px",
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
