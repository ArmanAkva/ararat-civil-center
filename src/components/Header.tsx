"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Read theme from element that the script setup
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

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
            marginLeft: "1.5rem",
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
