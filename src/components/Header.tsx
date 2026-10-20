"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { USER_ROLES } from "@/types/auth";
import NotificationBell from "@/components/notifications/NotificationBell";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, role, isAdmin } = useAuth();

  useEffect(() => {
    let currentTheme = "light";
    try {
      const localTheme = localStorage.getItem("theme");
      currentTheme =
        localTheme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", currentTheme);
    } catch {
      currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    }
    setTheme(currentTheme);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled((prev) => {
            // Hysteresis threshold to eliminate any transition jitter/flicker
            if (!prev && scrollY > 40) return true;
            if (prev && scrollY < 12) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const roleConfig = USER_ROLES[role] || USER_ROLES.member;

  const getUserInitials = () => {
    const name = profile?.displayName?.trim();
    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      const prefix = user.email.split("@")[0];
      const parts = prefix.split(/[._-]/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return prefix.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className={`header ${isScrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="header-logo" aria-label="Արարատյան Կենտրոն" title="Արարատյան Կենտրոն">
        <span className="logo-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-key-svg"
          >
            <circle cx="7.5" cy="15.5" r="4.5" />
            <path d="m21 3-9.5 9.5" />
            <path d="m15.5 7.5 2.5 2.5" />
            <path d="m18 5 2.5 2.5" />
            <circle cx="7.5" cy="15.5" r="1.5" />
          </svg>
        </span>
      </Link>
      <nav className="header-nav-links">
        <Link href="/about" className="nav-link">Մեր մասին</Link>
        <Link href="/civilizations" className="nav-link">Քաղաքակրթական բևեռներ</Link>
        <Link href="/dialogue" className="nav-link">Երկխոսության հարթակ</Link>
        <Link href="/forum" className="nav-link">Ֆորում</Link>
      </nav>

      <div className="header-actions">
        {/* User Auth Section */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <NotificationBell />
            <Link
              href="/profile"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: roleConfig.badgeBg,
                color: roleConfig.badgeColor,
                border: `1.5px solid ${roleConfig.badgeBorder}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.82rem",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textDecoration: "none",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                flexShrink: 0,
              }}
              title={`Պրոֆիլ (${profile?.displayName || user.email})`}
              aria-label="Բացել Պրոֆիլը"
            >
              {getUserInitials()}
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
            marginLeft: "0.25rem",
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
