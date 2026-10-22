"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultHomeContent } from "@/lib/defaultSiteContent";
import { HomePageContent } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import { Skeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

export default function Home() {
  const [content, setContent] = useState<HomePageContent>(defaultHomeContent);
  const [loading, setLoading] = useState(true);
  const { savePageField, isEditMode } = useEditMode();

  useEffect(() => {
    let isMounted = true;
    getPageContent<HomePageContent>("home", defaultHomeContent)
      .then((data) => {
        if (isMounted) {
          setContent(data || defaultHomeContent);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading home page content:", err);
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="container">
        <div className="hero" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "4rem 1rem" }}>
          <Skeleton width="min(90%, 540px)" height="3.2rem" borderRadius="0.6rem" />
          <Skeleton width="min(85%, 420px)" height="1.5rem" borderRadius="0.4rem" />
          <Skeleton width="min(80%, 480px)" height="1.1rem" borderRadius="0.4rem" style={{ marginTop: "1rem" }} />
        </div>
        <div className="dashboard-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card" style={{ padding: "2rem", minHeight: "220px" }}>
              <Skeleton width="60%" height="1.5rem" borderRadius="0.4rem" style={{ marginBottom: "1rem" }} />
              <Skeleton width="100%" height="0.9rem" borderRadius="0.25rem" style={{ marginBottom: "0.5rem" }} />
              <Skeleton width="85%" height="0.9rem" borderRadius="0.25rem" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="hero">
        <EditableText
          tag="h1"
          label="Գլխավոր Վերնագիր (Hero Title)"
          value={content.heroTitle}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, heroTitle: val }));
            await savePageField("home", "heroTitle", val);
          }}
        />

        <EditableText
          tag="h2"
          label="Ենթավերնագիր (Hero Subtitle)"
          value={content.heroSubtitle}
          onSave={async (val) => {
            setContent((prev) => ({ ...prev, heroSubtitle: val }));
            await savePageField("home", "heroSubtitle", val);
          }}
        />

        <div className="credo">
          <EditableText
            tag="span"
            multiline
            label="Գլխավոր Մեջբերում (Home Credo)"
            value={content.credo}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, credo: val }));
              await savePageField("home", "credo", val);
            }}
          />
        </div>

        <div className="cards-grid">
          {content.cards.map((card, idx) => (
            <div key={card.id || idx} style={{ position: "relative" }}>
              <Link href={card.link} className="glass-card">
                <EditableText
                  tag="h3"
                  label={`Քարտ #${idx + 1} Վերնագիր`}
                  value={card.title}
                  onSave={async (val) => {
                    const newCards = [...content.cards];
                    newCards[idx] = { ...newCards[idx], title: val };
                    setContent((prev) => ({ ...prev, cards: newCards }));
                    await savePageField("home", "cards", newCards);
                  }}
                />
                <EditableText
                  tag="p"
                  multiline
                  label={`Քարտ #${idx + 1} Նկարագրություն`}
                  value={card.description}
                  onSave={async (val) => {
                    const newCards = [...content.cards];
                    newCards[idx] = { ...newCards[idx], description: val };
                    setContent((prev) => ({ ...prev, cards: newCards }));
                    await savePageField("home", "cards", newCards);
                  }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
