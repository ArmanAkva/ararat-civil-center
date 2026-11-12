"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { defaultAboutContent } from "@/lib/defaultSiteContent";
import { AboutPageContent } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import { useLanguage } from "@/context/LanguageContext";
import EditableText from "@/components/cms/EditableText";
import { TranslationsMap } from "@/types/i18n";

export interface FooterData {
  quote: string;
  brandName: string;
  btnDialogueText: string;
  btnCivText: string;
  navTitle: string;
  valuesTitle: string;
  valueItem1: string;
  valueItem2: string;
  valueItem3: string;
  valueItem4: string;
  copyrightText: string;
  linkContactText: string;
  linkCharterText: string;
  translations?: TranslationsMap<Record<string, unknown>>;
}

const defaultFooterData: FooterData = {
  quote: "«Մենք չենք կանխատեսում ապագան, մենք այն համարարում ենք միասին․․․»",
  brandName: "ԱՐԱՐԱՏՅԱՆ ՖՈՐՈՒՄ",
  btnDialogueText: "💬 Միանալ Քննարկումներին",
  btnCivText: "🏛️ Դիտել Քաղաքակրթությունները",
  navTitle: "Հիմնական Բաժիններ",
  valuesTitle: "Արժեհամակարգ",
  valueItem1: "✦ Քաղաքակրթական Ինքնիշխանություն",
  valueItem2: "✦ Բազմաբևեռ Ներդաշնակություն",
  valueItem3: "✦ Հոգևոր-Գիտական Սինթեզ",
  valueItem4: "✦ Համարարչության Տեսլական",
  copyrightText: "© 2026 Արարատյան Ֆորում / Քաղաքակրթական Կենտրոն: Բոլոր իրավունքները պաշտպանված են:",
  linkContactText: "Կոնտակտներ",
  linkCharterText: "Կանոնադրություն",
  translations: {
    en: {
      quote: "\"We do not predict the future, we co-create it together...\"",
      brandName: "ARARAT FORUM",
      btnDialogueText: "💬 Join Discussions",
      btnCivText: "🏛️ View Civilizations",
      navTitle: "Main Sections",
      valuesTitle: "Core Values",
      valueItem1: "✦ Civilizational Sovereignty",
      valueItem2: "✦ Multipolar Harmony",
      valueItem3: "✦ Spiritual-Scientific Synthesis",
      valueItem4: "✦ Vision of Co-creation",
      copyrightText: "© 2026 Ararat Forum / Civilizational Center. All rights reserved.",
      linkContactText: "Contacts",
      linkCharterText: "Charter",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
    ru: {
      quote: "«Мы не предсказываем будущее, мы со-созидаем его вместе...»",
      brandName: "АРАРАТСКИЙ ФОРУМ",
      btnDialogueText: "💬 Присоединиться к дискуссиям",
      btnCivText: "🏛️ Исследовать цивилизации",
      navTitle: "Основные разделы",
      valuesTitle: "Система ценностей",
      valueItem1: "✦ Цивилизационный суверенитет",
      valueItem2: "✦ Многополярная гармония",
      valueItem3: "✦ Духовно-научный синтез",
      valueItem4: "✦ Видение со-созидания",
      copyrightText: "© 2026 Араратский Форум / Цивилизационный Центр. Все права защищены.",
      linkContactText: "Контакты",
      linkCharterText: "Устав",
      _isAiTranslated: true,
      _translatedAt: "2026-11-12T00:00:00.000Z",
    },
  },
};

export default function Footer() {
  const [content, setContent] = useState<FooterData>(defaultFooterData);
  const { savePageField } = useEditMode();
  const { applyLocale, t } = useLanguage();

  const displayContent = applyLocale(content);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getPageContent<FooterData>("footer", defaultFooterData),
      getPageContent<AboutPageContent>("about", defaultAboutContent),
    ])
      .then(([footerData, aboutData]) => {
        if (isMounted) {
          setContent({
            ...defaultFooterData,
            ...footerData,
            quote: footerData?.quote || aboutData?.callToActionQuote || defaultFooterData.quote,
          });
        }
      })
      .catch((err) => {
        console.error("Error loading footer content:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveField = async (field: keyof FooterData, val: string) => {
    setContent((prev) => ({ ...prev, [field]: val }));
    await savePageField("footer", field, val);
    if (field === "quote") {
      await savePageField("about", "callToActionQuote", val);
    }
  };

  return (
    <footer
      suppressHydrationWarning
      className="global-site-footer"
      style={{
        marginTop: "5rem",
        borderTop: "1px solid var(--card-border)",
        background: "linear-gradient(180deg, transparent 0%, var(--gradient-overlay-1) 100%)",
        position: "relative",
      }}
    >
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}>
        {/* Main Footer Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand & Quote & Action Links */}
          <div style={{ maxWidth: "480px" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.65rem",
                textDecoration: "none",
                marginBottom: "1.25rem",
              }}
            >
              <span
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(183, 121, 31, 0.25) 0%, rgba(183, 121, 31, 0.08) 100%)",
                  border: "1.5px solid var(--gold-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold-accent)",
                  boxShadow: "0 0 12px rgba(183, 121, 31, 0.2)",
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: "20px", height: "20px" }}
                >
                  <circle cx="7.5" cy="15.5" r="4.5" />
                  <path d="m21 3-9.5 9.5" />
                  <path d="m15.5 7.5 2.5 2.5" />
                  <path d="m18 5 2.5 2.5" />
                  <circle cx="7.5" cy="15.5" r="1.5" />
                </svg>
              </span>
              <EditableText
                tag="span"
                label="Բրենդի Անվանում"
                value={displayContent.brandName}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: "700",
                  fontSize: "1.25rem",
                  color: "var(--text-primary)",
                  letterSpacing: "0.04em",
                }}
                onSave={(val) => handleSaveField("brandName", val)}
              />
            </Link>

            {/* The Quote: «Մենք չենք կանխատեսում ապագան, մենք այն համարարում ենք միասին․․․» */}
            <div style={{ marginBottom: "1.35rem" }}>
              <EditableText
                tag="blockquote"
                multiline
                label="Ֆուտերի Գլխավոր Մեջբերում"
                value={displayContent.quote}
                style={{
                  margin: 0,
                  padding: "0.85rem 1.15rem",
                  borderLeft: "3px solid var(--gold-accent)",
                  background: "var(--input-bg)",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  fontSize: "0.96rem",
                  lineHeight: "1.75",
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  color: "var(--text-primary)",
                }}
                onSave={(val) => handleSaveField("quote", val)}
              />
            </div>

            {/* The Action Links: 💬 Միանալ Քննարկումներին & 🏛️ Դիտել Քաղաքակրթությունները */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
              <Link
                href="/dialogue"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#ffffff",
                  background: "var(--gold-accent)",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(183, 121, 31, 0.25)",
                }}
              >
                <EditableText
                  tag="span"
                  label="Երկխոսության Կոճակ"
                  value={displayContent.btnDialogueText}
                  onSave={(val) => handleSaveField("btnDialogueText", val)}
                />
              </Link>
              <Link
                href="/civilizations"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                  border: "1px solid var(--card-border)",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold-accent)";
                  e.currentTarget.style.color = "var(--gold-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--card-border)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
              >
                <EditableText
                  tag="span"
                  label="Քաղաքակրթությունների Կոճակ"
                  value={displayContent.btnCivText}
                  onSave={(val) => handleSaveField("btnCivText", val)}
                />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <EditableText
              tag="h4"
              label="Բաժինների Վերնագիր"
              value={displayContent.navTitle}
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--gold-accent)",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 1.25rem 0",
              }}
              onSave={(val) => handleSaveField("navTitle", val)}
            />
            <ul
              suppressHydrationWarning
              style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}
            >
              <li>
                <Link href="/" className="footer-link">{t("nav.home")}</Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">{t("nav.about")}</Link>
              </li>
              <li>
                <Link href="/civilizations" className="footer-link">{t("nav.civilizations")}</Link>
              </li>
              <li>
                <Link href="/publications" className="footer-link">{t("nav.library")}</Link>
              </li>
              <li>
                <Link href="/dialogue" className="footer-link">{t("nav.dialogue")}</Link>
              </li>
              <li>
                <Link href="/forum" className="footer-link">{t("nav.forum")}</Link>
              </li>
            </ul>
          </div>

          {/* Values / Principles */}
          <div>
            <EditableText
              tag="h4"
              label="Արժեհամակարգի Վերնագիր"
              value={displayContent.valuesTitle}
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--gold-accent)",
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 1.25rem 0",
              }}
              onSave={(val) => handleSaveField("valuesTitle", val)}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <EditableText
                tag="span"
                label="Արժեք 1"
                value={displayContent.valueItem1}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
                onSave={(val) => handleSaveField("valueItem1", val)}
              />
              <EditableText
                tag="span"
                label="Արժեք 2"
                value={displayContent.valueItem2}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
                onSave={(val) => handleSaveField("valueItem2", val)}
              />
              <EditableText
                tag="span"
                label="Արժեք 3"
                value={displayContent.valueItem3}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
                onSave={(val) => handleSaveField("valueItem3", val)}
              />
              <EditableText
                tag="span"
                label="Արժեք 4"
                value={displayContent.valueItem4}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
                onSave={(val) => handleSaveField("valueItem4", val)}
              />
            </div>
          </div>
        </div>

        {/* Copyright bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--card-border)",
            paddingTop: "1.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
          }}
        >
          <EditableText
            tag="div"
            label="Հեղինակային Իրավունք (Copyright)"
            value={displayContent.copyrightText}
            style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}
            onSave={(val) => handleSaveField("copyrightText", val)}
          />
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <Link href="/about" style={{ textDecoration: "none" }}>
              <EditableText
                tag="span"
                label="Կոնտակտներ Տեքստ"
                value={displayContent.linkContactText}
                style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}
                onSave={(val) => handleSaveField("linkContactText", val)}
              />
            </Link>
            <Link href="/dialogue" style={{ textDecoration: "none" }}>
              <EditableText
                tag="span"
                label="Կանոնադրություն Տեքստ"
                value={content.linkCharterText}
                style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}
                onSave={(val) => handleSaveField("linkCharterText", val)}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
