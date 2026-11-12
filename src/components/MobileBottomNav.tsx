"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user } = useAuth();

  const isCivilizationsActive =
    pathname.startsWith("/civilizations") ||
    pathname.startsWith("/hubs") ||
    pathname.startsWith("/centers") ||
    pathname.startsWith("/authors");

  const isLibraryActive = pathname.startsWith("/publications");
  const isDialogueActive = pathname.startsWith("/dialogue");
  const isForumActive = pathname.startsWith("/forum");
  const isProfileActive = pathname.startsWith("/profile") || pathname.startsWith("/auth");
  const isHomeActive = pathname === "/";

  const navItems = [
    {
      href: "/",
      label: t("nav.home"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      active: isHomeActive,
    },
    {
      href: "/civilizations",
      label: t("nav.civilizations"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="21" x2="21" y2="21" />
          <line x1="6" y1="21" x2="6" y2="10" />
          <line x1="18" y1="21" x2="18" y2="10" />
          <line x1="12" y1="21" x2="12" y2="10" />
          <polygon points="12 3 2 10 22 10 12 3" />
        </svg>
      ),
      active: isCivilizationsActive,
    },
    {
      href: "/publications",
      label: t("nav.library"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      ),
      active: isLibraryActive,
    },
    {
      href: "/dialogue",
      label: t("nav.dialogue"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      active: isDialogueActive,
    },
    {
      href: "/forum",
      label: t("nav.forum"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      active: isForumActive,
    },
    {
      href: user ? "/profile" : "/auth",
      label: user ? t("nav.profile") : t("nav.login"),
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      active: isProfileActive,
    },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-tab ${item.active ? "active" : ""}`}
              aria-current={item.active ? "page" : undefined}
            >
              <span className="mobile-nav-icon-wrapper">
                {item.icon}
                {item.active && <span className="mobile-nav-active-dot" />}
              </span>
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

