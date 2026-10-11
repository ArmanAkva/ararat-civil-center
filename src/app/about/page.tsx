"use client";

import { useEffect, useState } from "react";
import { defaultAboutContent } from "@/lib/defaultSiteContent";
import { AboutPageContent } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";

export default function About() {
  const [content, setContent] = useState<AboutPageContent>(defaultAboutContent);
  const { savePageField } = useEditMode();

  useEffect(() => {
    let isMounted = true;
    getPageContent<AboutPageContent>("about", defaultAboutContent).then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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

      {/* Call to Action */}
      <div style={{ textAlign: "center", padding: "4rem 2rem", background: "linear-gradient(135deg, var(--gradient-overlay-1) 0%, var(--bg-color) 100%)", borderRadius: "1rem", border: "1px solid var(--card-border)", marginTop: "4rem" }}>
        <EditableText
          tag="h2"
          label="Կոչ Վերնագիր"
          value={content.callToActionTitle}
          style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 1rem 0" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, callToActionTitle: val }));
            await savePageField("about", "callToActionTitle", val);
          }}
        />
        <EditableText
          tag="p"
          multiline
          label="Կոչ Նկարագրություն"
          value={content.callToActionDesc}
          style={{ fontSize: "1.1rem", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto 3rem", color: "var(--text-secondary)" }}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, callToActionDesc: val }));
            await savePageField("about", "callToActionDesc", val);
          }}
        />
        <div style={{ margin: "0 auto", padding: "1.5rem 2rem", borderTop: "2px solid var(--gold-accent)", borderBottom: "2px solid var(--gold-accent)", display: "inline-block" }}>
          <EditableText
            tag="span"
            multiline
            label="Եզրափակիչ Մեջբերում"
            value={content.callToActionQuote}
            style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", fontStyle: "italic", color: "var(--text-primary)" }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, callToActionQuote: val }));
              await savePageField("about", "callToActionQuote", val);
            }}
          />
        </div>
      </div>
    </main>
  );
}
