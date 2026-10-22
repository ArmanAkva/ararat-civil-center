"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultAboutContent } from "@/lib/defaultSiteContent";
import { AboutPageContent } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import AboutLoading from "./loading";

export const dynamic = "force-dynamic";

export default function About() {
  const [content, setContent] = useState<AboutPageContent>(defaultAboutContent);
  const [loading, setLoading] = useState(true);
  const { savePageField } = useEditMode();

  useEffect(() => {
    let isMounted = true;
    getPageContent<AboutPageContent>("about", defaultAboutContent)
      .then((data) => {
        if (isMounted) {
          setContent(data || defaultAboutContent);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading about page content:", err);
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <AboutLoading />;
  }

  return (
    <main className="container" style={{ paddingBottom: "5rem" }}>
      {/* Page Title */}
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <EditableText
          tag="h1"
          label="Էջի Գլխավոր Վերնագիր"
          value={content.headerTitle}
          style={{ fontSize: "2.5rem", color: "var(--gold-accent)", fontFamily: "var(--font-serif)" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, headerTitle: val }));
            await savePageField("about", "headerTitle", val);
          }}
        />
        <EditableText
          tag="p"
          label="Ենթավերնագիր"
          value={content.headerSubtitle}
          style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "700px", margin: "0 auto" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, headerSubtitle: val }));
            await savePageField("about", "headerSubtitle", val);
          }}
        />
      </div>

      {/* Mission */}
      <div className="glass-card" style={{ marginBottom: "3rem" }}>
        <EditableText
          tag="h2"
          label="Առաքելության Բաժնի Վերնագիր"
          value={content.missionTitle}
          style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", marginBottom: "1.5rem" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, missionTitle: val }));
            await savePageField("about", "missionTitle", val);
          }}
        />
        <EditableText
          tag="p"
          multiline
          label="Առաքելություն Պարբերություն 1"
          value={content.missionP1}
          style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "1rem" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, missionP1: val }));
            await savePageField("about", "missionP1", val);
          }}
        />
        <EditableText
          tag="p"
          multiline
          label="Առաքելություն Պարբերություն 2"
          value={content.missionP2}
          style={{ fontSize: "1.1rem", lineHeight: "1.8", fontStyle: "italic", color: "var(--text-secondary)" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, missionP2: val }));
            await savePageField("about", "missionP2", val);
          }}
        />
      </div>

      {/* 8 Civilizations Pilgrimage */}
      <div style={{ marginBottom: "3rem" }}>
        <EditableText
          tag="h2"
          label="8 Քաղաքակրթությունների Բաժնի Վերնագիր"
          value={content.civilizationsHeader}
          style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", marginBottom: "1.5rem" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, civilizationsHeader: val }));
            await savePageField("about", "civilizationsHeader", val);
          }}
        />
        <EditableText
          tag="p"
          multiline
          label="Ներածական Տեքստ"
          value={content.civilizationsIntro}
          style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "2rem" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, civilizationsIntro: val }));
            await savePageField("about", "civilizationsIntro", val);
          }}
        />
        <ul style={{ fontSize: "1.1rem", lineHeight: "2.2", color: "var(--text-primary)", listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "0.5rem" }}>🇦🇲 <strong>Հայկական քաղաքակրթություն</strong> (Որպես սրբազան հանգույց՝ Հոգևոր Էակի և Արդար պետության կենսահայեցակարգ)</li>
          <li style={{ marginBottom: "0.5rem" }}>🇷🇺 <strong>Ռուսական քաղաքակրթություն</strong> (Հարության քաղաքակրթական կենսիմաստ)</li>
          <li style={{ marginBottom: "0.5rem" }}>🇪🇺 <strong>Եվրոպական քաղաքակրթություն</strong> (Ավանդական Եվրոպայի պահպանողական միտք)</li>
          <li style={{ marginBottom: "0.5rem" }}>🇮🇷 <strong>Իրանական քաղաքակրթություն</strong> (Իսլամական արդիականության և ակադեմիական մտքի կենտրոններ)</li>
          <li style={{ marginBottom: "0.5rem" }}>🇦🇪 <strong>Արաբական քաղաքակրթություն</strong> (Բեյրութի, Կահիրեի և Աբու Դաբիի ինտելեկտուալ օրրաններ)</li>
          <li style={{ marginBottom: "0.5rem" }}>🇨🇳 <strong>Չինական քաղաքակրթություն</strong> («Տյանսյա» համակարգ)</li>
          <li style={{ marginBottom: "0.5rem" }}>🇬🇷 <strong>Հունական քաղաքակրթություն</strong> (Անտիկ ժառանգություն, Բյուզանդական կոդ և Աթոսի հոգևոր միտք)</li>
          <li style={{ marginBottom: "0.5rem" }}>🇮🇳 <strong>Հնդկական քաղաքակրթություն</strong> (Վեդայական ավանդույթ և «Վասուդհայվա Կուտումբակամ» տեսլական)</li>
        </ul>
      </div>

      {/* Why Armenia */}
      <div className="glass-card" style={{ marginBottom: "3rem" }}>
        <EditableText
          tag="h2"
          label="Ինչու՞ Հայաստանում Վերնագիր"
          value={content.whyAraratTitle}
          style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem", marginBottom: "1.5rem" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, whyAraratTitle: val }));
            await savePageField("about", "whyAraratTitle", val);
          }}
        />
        <EditableText
          tag="p"
          multiline
          label="Ինչու՞ Հայաստանում Պարբերություն 1"
          value={content.whyAraratP1}
          style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "1rem" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, whyAraratP1: val }));
            await savePageField("about", "whyAraratP1", val);
          }}
        />
        <EditableText
          tag="p"
          multiline
          label="Ինչու՞ Հայաստանում Պարբերություն 2"
          value={content.whyAraratP2}
          style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, whyAraratP2: val }));
            await savePageField("about", "whyAraratP2", val);
          }}
        />
      </div>

      {/* Tools */}
      <div style={{ marginBottom: "3rem" }}>
        <EditableText
          tag="h2"
          label="Գործիքների Բաժնի Վերնագիր"
          value={content.toolsHeader}
          style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", marginBottom: "1.5rem" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, toolsHeader: val }));
            await savePageField("about", "toolsHeader", val);
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
          <div style={{ background: "var(--input-bg)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
            <EditableText
              tag="h3"
              label="Գործիք 1 Վերնագիր"
              value={content.incubatorTitle}
              style={{ color: "var(--gold-accent)", marginTop: 0, fontSize: "1.3rem" }}
              onSave={async (val) => {
                setContent((prev) => ({ ...prev, incubatorTitle: val }));
                await savePageField("about", "incubatorTitle", val);
              }}
            />
            <EditableText
              tag="p"
              multiline
              label="Գործիք 1 Նկարագրություն"
              value={content.incubatorDesc}
              style={{ margin: 0, lineHeight: "1.6", color: "var(--text-secondary)", fontSize: "1.05rem" }}
              onSave={async (val) => {
                setContent((prev) => ({ ...prev, incubatorDesc: val }));
                await savePageField("about", "incubatorDesc", val);
              }}
            />
          </div>

          <div style={{ background: "var(--input-bg)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
            <EditableText
              tag="h3"
              label="Գործիք 2 Վերնագիր"
              value={content.forumToolTitle}
              style={{ color: "var(--gold-accent)", marginTop: 0, fontSize: "1.3rem" }}
              onSave={async (val) => {
                setContent((prev) => ({ ...prev, forumToolTitle: val }));
                await savePageField("about", "forumToolTitle", val);
              }}
            />
            <EditableText
              tag="p"
              multiline
              label="Գործիք 2 Նկարագրություն"
              value={content.forumToolDesc}
              style={{ margin: 0, lineHeight: "1.6", color: "var(--text-secondary)", fontSize: "1.05rem" }}
              onSave={async (val) => {
                setContent((prev) => ({ ...prev, forumToolDesc: val }));
                await savePageField("about", "forumToolDesc", val);
              }}
            />
          </div>
        </div>
      </div>

      {/* Call to Action: «Միացե՛ք Համարարչությանը» */}
      <div
        style={{
          textAlign: "center",
          padding: "4.5rem 2.5rem 4rem",
          background: "linear-gradient(145deg, var(--gradient-overlay-1) 0%, var(--card-bg) 60%, var(--gradient-overlay-2) 100%)",
          borderRadius: "1.5rem",
          border: "1px solid var(--card-border)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.08)",
          position: "relative",
          overflow: "hidden",
          marginTop: "4.5rem",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Subtle decorative glow watermark */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "360px",
            height: "180px",
            background: "radial-gradient(circle, rgba(183, 121, 31, 0.22) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.78rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--gold-accent)",
              padding: "0.3rem 0.9rem",
              borderRadius: "999px",
              background: "rgba(183, 121, 31, 0.1)",
              border: "1px solid rgba(183, 121, 31, 0.25)",
              marginBottom: "1.5rem",
            }}
          >
            <span>✧</span>
            <span>ՀԱՄԱՐԱՐՉԱԿԱՆ ԿՈՉ</span>
            <span>✧</span>
          </div>

          <EditableText
            tag="h2"
            label="Կոչ Վերնագիր"
            value={content.callToActionTitle || defaultAboutContent.callToActionTitle}
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--gold-accent)",
              fontSize: "clamp(1.85rem, 3.5vw, 2.5rem)",
              fontWeight: "700",
              margin: "0 0 1.25rem 0",
              lineHeight: "1.3",
            }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, callToActionTitle: val }));
              await savePageField("about", "callToActionTitle", val);
            }}
          />

          <EditableText
            tag="p"
            multiline
            label="Կոչ Նկարագրություն"
            value={content.callToActionDesc || defaultAboutContent.callToActionDesc}
            style={{
              fontSize: "1.08rem",
              lineHeight: "1.85",
              maxWidth: "820px",
              margin: "0 auto 2.5rem",
              color: "var(--text-secondary)",
            }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, callToActionDesc: val }));
              await savePageField("about", "callToActionDesc", val);
            }}
          />

          <div
            style={{
              margin: "0 auto 2.5rem",
              padding: "1.5rem 2.5rem",
              borderTop: "2px solid var(--gold-accent)",
              borderBottom: "2px solid var(--gold-accent)",
              background: "rgba(183, 121, 31, 0.04)",
              borderRadius: "0.4rem",
              display: "inline-block",
              maxWidth: "780px",
            }}
          >
            <EditableText
              tag="span"
              multiline
              label="Եզրափակիչ Մեջբերում"
              value={content.callToActionQuote || defaultAboutContent.callToActionQuote}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
                fontStyle: "italic",
                color: "var(--text-primary)",
                lineHeight: "1.75",
                display: "block",
              }}
              onSave={async (val) => {
                setContent((prev) => ({ ...prev, callToActionQuote: val }));
                await savePageField("about", "callToActionQuote", val);
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Link
              href="/dialogue"
              className="btn-primary"
              style={{
                padding: "0.75rem 1.6rem",
                fontSize: "0.95rem",
                textDecoration: "none",
                fontWeight: "600",
                borderRadius: "0.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span>💬 Միանալ Քննարկումներին</span>
            </Link>
            <Link
              href="/civilizations"
              style={{
                padding: "0.75rem 1.6rem",
                fontSize: "0.95rem",
                textDecoration: "none",
                fontWeight: "600",
                borderRadius: "0.5rem",
                color: "var(--text-primary)",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
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
              <span>🏛️ Դիտել Քաղաքակրթությունները</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
