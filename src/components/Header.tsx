"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { USER_ROLES } from "@/types/auth";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const { user, profile, role, isAdmin } = useAuth();

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const roleConfig = USER_ROLES[role] || USER_ROLES.member;

  return (
    <header className="header">
      <Link href="/" className="header-logo">
        Քաղաքակրթական համագործակցության<br />Արարատյան կենտրոն
      </Link>
      <div className="header-nav">
        <Link href="/about" className="nav-link">Մեր մասին</Link>
        <Link href="/civilizations" className="nav-link">Քաղաքակրթական բևեռներ</Link>
        <Link href="/dialogue" className="nav-link">Երկխոսության հարթակ</Link>
        <Link href="/forum" className="nav-link">Ֆորում</Link>

        {/* User Auth Section */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <NotificationBell />
            <Link
              href="/profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "999px",
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                transition: "all 0.2s ease",
              }}
              title="Բացել Պրոֆիլը"
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: roleConfig.badgeBg,
                  color: roleConfig.badgeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {(profile?.displayName || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                {profile?.displayName || user.email?.split("@")[0]}
              </span>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  padding: "0.15rem 0.45rem",
                  borderRadius: "999px",
                  background: roleConfig.badgeBg,
                  color: roleConfig.badgeColor,
                  border: `1px solid ${roleConfig.badgeBorder}`,
                }}
              >
                {role === "super-admin" ? "Գերադմին" : role === "admin" ? "Ադմին" : role === "scholar" ? "Մտածող" : "Անդամ"}
              </span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/users"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "var(--gold-accent)",
                  padding: "0.35rem 0.65rem",
                  borderRadius: "0.4rem",
                  border: "1px solid var(--card-border)",
                  background: "rgba(183, 121, 31, 0.08)",
                }}
                title="Ադմինիստրատիվ Վահանակ"
              >
                🛡 Ադմին
              </Link>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            style={{
              fontSize: "0.88rem",
              fontWeight: "600",
              color: "var(--gold-accent)",
              border: "1px solid var(--gold-accent)",
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              transition: "all 0.25s ease",
            }}
          >
            Մուտք
          </Link>
        )}

        <div className="lang-selector">
          <span className="active">AM</span> | <span>EN</span> | <span>RU</span>
        </div>

        <button 
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "1px solid var(--card-border)",
            color: "var(--text-primary)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            marginLeft: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease"
          }}
          title={theme === "light" ? "Անցնել Մուգ Թեմային" : "Անցնել Լուսավոր Թեմային"}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
