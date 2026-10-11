"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultHomeContent } from "@/lib/defaultSiteContent";
import { HomePageContent } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";

export default function Home() {
  const [content, setContent] = useState<HomePageContent>(defaultHomeContent);
  const { savePageField, isEditMode } = useEditMode();

  useEffect(() => {
    let isMounted = true;
    getPageContent<HomePageContent>("home", defaultHomeContent).then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
