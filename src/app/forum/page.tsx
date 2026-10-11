"use client";

import { useState, useEffect } from "react";
import { defaultForumContent } from "@/lib/defaultSiteContent";
import { ForumPageContent, ForumAgendaItem, ForumMessageItem } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import EditCardModal from "@/components/cms/EditCardModal";

export default function Forum() {
  const [content, setContent] = useState<ForumPageContent>(defaultForumContent);
  const { isEditMode, savePageField } = useEditMode();

  const [activeTab, setActiveTab] = useState(1);
  const [likeCount, setLikeCount] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);
  const [suggestionText, setSuggestionText] = useState("");
  const [sendingSuggestion, setSendingSuggestion] = useState(false);

  // Agenda modals
  const [editingAgenda, setEditingAgenda] = useState<{
    index: number;
    data: ForumAgendaItem;
  } | null>(null);
  const [isAddingAgenda, setIsAddingAgenda] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getPageContent<ForumPageContent>("forum", defaultForumContent).then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleSendSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    setSendingSuggestion(true);
    setTimeout(() => {
      alert("Շնորհակալություն։ Ձեր առաջարկը գրանցվեց ֆորումի քարտուղարությունում։");
      setSuggestionText("");
      setSendingSuggestion(false);
    }, 400);
  };

  const activeMessageIndex = content.messages.findIndex((m) => m.id === activeTab);
  const currentMessage = activeMessageIndex !== -1 ? content.messages[activeMessageIndex] : content.messages[0];

  return (
    <main className="container" style={{ paddingBottom: "5rem" }}>
      {/* Block 1. Countdown & Dates */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "5rem",
          padding: "4.5rem 2rem",
          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(10, 14, 26, 0.85) 100%)",
          borderRadius: "1rem",
          border: "1px solid var(--gold-accent)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <EditableText
            tag="h1"
            label="Ֆորումի Ժամկետներ"
            value={content.datesTitle}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "3rem",
              color: "var(--gold-accent)",
              margin: "0 0 1rem 0",
            }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, datesTitle: val }));
              await savePageField("forum", "datesTitle", val);
            }}
          />

          <EditableText
            tag="h2"
            label="Անցկացման Վայրեր"
            value={content.locationTitle}
            style={{ fontSize: "1.4rem", fontWeight: "400", marginBottom: "2rem", color: "var(--text-secondary)" }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, locationTitle: val }));
              await savePageField("forum", "locationTitle", val);
            }}
          />

          <EditableText
            tag="div"
            label="Հետհաշվարկ (Countdown)"
            value={content.countdown}
            style={{
              fontSize: "2.5rem",
              fontFamily: "var(--font-mono)",
              marginBottom: "2rem",
              letterSpacing: "0.2em",
              color: "var(--text-primary)",
            }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, countdown: val }));
              await savePageField("forum", "countdown", val);
            }}
          />

          <button
            onClick={() => {
              const res = prompt("Մուտքագրեք Ձեր առաջարկած այլընտրանքային ժամկետը կամ հաստատեք մասնակցությունը:");
              if (res) alert("Ձեր նշումն ընդունված է:");
            }}
            className="btn-primary"
            style={{
              background: "transparent",
              border: "1px solid var(--gold-accent)",
              color: "var(--gold-accent)",
              padding: "0.75rem 1.8rem",
            }}
          >
            Առաջարկել այլընտրանքային ժամկետ / Հաստատել համաձայնությունը
          </button>
        </div>
      </div>

      {/* Block 2. Interactive Manifesto */}
      <EditableText
        tag="h2"
        label="Մանիֆեստի Բաժնի Վերնագիր"
        value={content.manifestoTitle}
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--gold-accent)",
          borderBottom: "1px solid var(--card-border)",
          paddingBottom: "1rem",
          marginBottom: "2rem",
          fontSize: "1.8rem",
        }}
        onSave={async (val) => {
          setContent((prev) => ({ ...prev, manifestoTitle: val }));
          await savePageField("forum", "manifestoTitle", val);
        }}
      />

      <div
        style={{
          background: "var(--card-bg)",
          padding: "2.5rem",
          borderRadius: "1rem",
          border: "1px solid var(--card-border)",
          marginBottom: "4rem",
        }}
      >
        <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "280px" }}>
            <span style={{ fontWeight: "bold", color: "var(--gold-accent)", marginRight: "0.5rem", fontSize: "1.15rem" }}>
              Ի՞նչ.
            </span>
            <EditableText
              tag="span"
              multiline
              label="Մանիֆեստի Նկարագրություն"
              value={content.manifestoWhat}
              style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "var(--text-secondary)" }}
              onSave={async (val) => {
                setContent((prev) => ({ ...prev, manifestoWhat: val }));
                await savePageField("forum", "manifestoWhat", val);
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={handleLike}
              style={{
                background: hasLiked ? "rgba(212, 175, 55, 0.2)" : "var(--input-bg)",
                border: "1px solid var(--gold-accent)",
                color: "var(--gold-accent)",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              <span>👍</span> {likeCount}
            </button>
            <button
              onClick={() => {
                const sugg = prompt("Մուտքագրեք Ձեր առաջարկը Մանիֆեստի տեքստի վերաբերյալ:");
                if (sugg) alert("Ձեր առաջարկն ուղարկվեց խմբագրական խորհրդին:");
              }}
              style={{
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-secondary)",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              <span>📝</span> Առաջարկ
            </button>
          </div>
        </div>
      </div>

      {/* Block 3. Core Messages */}
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--gold-accent)",
          borderBottom: "1px solid var(--card-border)",
          paddingBottom: "1rem",
          marginBottom: "2rem",
          fontSize: "1.8rem",
        }}
      >
        Օրակարգային 3 Ուղերձներ
      </h2>

      <div style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {content.messages.map((msg, idx) => (
            <button
              key={msg.id || idx}
              onClick={() => setActiveTab(msg.id)}
              style={{
                background: activeTab === msg.id ? "var(--gold-accent)" : "var(--card-bg)",
                color: activeTab === msg.id ? "#000" : "var(--text-primary)",
                border: "1px solid var(--card-border)",
                padding: "0.8rem 1.6rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: activeTab === msg.id ? "bold" : "normal",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
              }}
            >
              <EditableText
                tag="span"
                label={`Ուղերձ ${idx + 1} Կոճակ`}
                value={msg.title}
                onSave={async (val) => {
                  const updated = [...content.messages];
                  updated[idx] = { ...updated[idx], title: val };
                  setContent((prev) => ({ ...prev, messages: updated }));
                  await savePageField("forum", "messages", updated);
                }}
              />
            </button>
          ))}
        </div>

        <div style={{ background: "var(--card-bg)", padding: "2.5rem", borderRadius: "1rem", border: "1px solid var(--card-border)" }}>
          {currentMessage && (
            <div style={{ marginBottom: "2rem" }}>
              <EditableText
                tag="p"
                multiline
                label={`Ուղերձ #${currentMessage.id} Բովանդակություն`}
                value={currentMessage.content}
                style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "var(--text-secondary)", margin: 0 }}
                onSave={async (val) => {
                  const updated = [...content.messages];
                  const index = updated.findIndex((m) => m.id === currentMessage.id);
                  if (index !== -1) {
                    updated[index] = { ...updated[index], content: val };
                    setContent((prev) => ({ ...prev, messages: updated }));
                    await savePageField("forum", "messages", updated);
                  }
                }}
              />
            </div>
          )}

          <form onSubmit={handleSendSuggestion}>
            <textarea
              placeholder={`Ավելացնել առաջարկ «Ուղերձ ${activeTab}»-ի շուրջ...`}
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--text-primary)",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                boxSizing: "border-box",
                fontSize: "0.95rem",
                fontFamily: "inherit",
              }}
              rows={3}
            />
            <button
              type="submit"
              disabled={sendingSuggestion}
              className="btn-primary"
              style={{ padding: "0.6rem 1.8rem", fontSize: "0.9rem" }}
            >
              {sendingSuggestion ? "Ուղարկվում է..." : "Ուղարկել"}
            </button>
          </form>
        </div>
      </div>

      {/* Block 4. 3-Day Agenda */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: 0, fontSize: "1.8rem" }}>
          3-Օրյա Օրակարգ (Նախնական)
        </h2>
        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsAddingAgenda(true)}
            className="btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }}
          >
            + Ավելացնել Օրակարգ
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: "1.5rem", marginBottom: "4rem" }}>
        {content.agenda.map((item, idx) => (
          <div key={item.id || idx} className="glass-card" style={{ padding: "1.8rem", position: "relative" }}>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setEditingAgenda({ index: idx, data: item })}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  background: "rgba(212, 175, 55, 0.2)",
                  color: "var(--gold-accent)",
                  border: "1px solid var(--gold-accent)",
                  borderRadius: "0.4rem",
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                }}
              >
                ✎ Խմբագրել
              </button>
            )}

            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <EditableText
                tag="span"
                label="Օրվա Անվանում"
                value={item.day}
                style={{ fontWeight: "bold", color: "var(--gold-accent)", fontSize: "1.1rem" }}
                onSave={async (val) => {
                  const updated = [...content.agenda];
                  updated[idx] = { ...updated[idx], day: val };
                  setContent((prev) => ({ ...prev, agenda: updated }));
                  await savePageField("forum", "agenda", updated);
                }}
              />
              <span style={{ color: "var(--text-secondary)" }}>|</span>
              <EditableText
                tag="h3"
                label="Օրվա Վայր / Վերնագիր"
                value={item.title}
                style={{ margin: 0, fontSize: "1.1rem" }}
                onSave={async (val) => {
                  const updated = [...content.agenda];
                  updated[idx] = { ...updated[idx], title: val };
                  setContent((prev) => ({ ...prev, agenda: updated }));
                  await savePageField("forum", "agenda", updated);
                }}
              />
            </div>

            <EditableText
              tag="p"
              multiline
              label="Օրվա Ծրագրի Նկարագրություն"
              value={item.description}
              style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0, lineHeight: "1.6" }}
              onSave={async (val) => {
                const updated = [...content.agenda];
                updated[idx] = { ...updated[idx], description: val };
                setContent((prev) => ({ ...prev, agenda: updated }));
                await savePageField("forum", "agenda", updated);
              }}
            />
          </div>
        ))}
      </div>

      {/* Block 5. Consensus Dashboard */}
      <div
        style={{
          background: "linear-gradient(90deg, var(--bg-color) 0%, var(--gradient-overlay-1) 100%)",
          padding: "2.5rem",
          borderRadius: "1rem",
          border: "1px solid var(--card-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div>
          <EditableText
            tag="h3"
            label="Ցուցիչի Վերնագիր"
            value={content.consensusTitle}
            style={{ margin: "0 0 0.5rem 0", fontFamily: "var(--font-serif)", fontSize: "1.4rem" }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, consensusTitle: val }));
              await savePageField("forum", "consensusTitle", val);
            }}
          />
          <EditableText
            tag="p"
            label="Ցուցիչի Ենթավերնագիր"
            value={content.consensusSubtitle}
            style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}
            onSave={async (val) => {
              setContent((prev) => ({ ...prev, consensusSubtitle: val }));
              await savePageField("forum", "consensusSubtitle", val);
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "3.2rem", color: "var(--gold-accent)", fontWeight: "bold" }}>
            {content.consensusPercent}%
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={async () => {
                const input = prompt("Մուտքագրեք կոնսենսուսի տոկոսը (0-100):", String(content.consensusPercent));
                if (input !== null) {
                  const num = parseInt(input, 10);
                  if (!isNaN(num) && num >= 0 && num <= 100) {
                    setContent((prev) => ({ ...prev, consensusPercent: num }));
                    await savePageField("forum", "consensusPercent", num);
                  }
                }
              }}
              style={{
                background: "rgba(212, 175, 55, 0.15)",
                color: "var(--gold-accent)",
                border: "1px solid var(--gold-accent)",
                borderRadius: "0.4rem",
                padding: "0.3rem 0.6rem",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Փոխել %
            </button>
          )}
        </div>
      </div>

      {/* Edit Agenda Modal */}
      {editingAgenda && (
        <EditCardModal
          title="Խմբագրել Օրակարգի Կետը"
          initialData={editingAgenda.data}
          fields={[
            { key: "day", label: "Օր / Վայր (Օր.՝ ՕՐ 1. ԳՅՈՒՄՐԻ)" },
            { key: "title", label: "Վայր / Շենք (Օր.՝ «Black Fortress»)" },
            { key: "description", label: "Նկարագրություն", type: "textarea" },
          ]}
          onSave={async (updated) => {
            const list = [...content.agenda];
            list[editingAgenda.index] = updated;
            setContent((prev) => ({ ...prev, agenda: list }));
            await savePageField("forum", "agenda", list);
          }}
          onDelete={async () => {
            const list = content.agenda.filter((_, i) => i !== editingAgenda.index);
            setContent((prev) => ({ ...prev, agenda: list }));
            await savePageField("forum", "agenda", list);
          }}
          onClose={() => setEditingAgenda(null)}
        />
      )}

      {/* Add Agenda Modal */}
      {isAddingAgenda && (
        <EditCardModal
          title="Ավելացնել Օրակարգի Կետ"
          initialData={{
            id: `day-${Date.now()}`,
            day: "ՕՐ 4",
            title: "",
            description: "",
          }}
          fields={[
            { key: "day", label: "Օր / Քաղաք", placeholder: "Օր.՝ ՕՐ 4. ԴԻԼԻՋԱՆ" },
            { key: "title", label: "Վայր / Կենտրոն", placeholder: "Օր.՝ Ուսումնական Կենտրոն" },
            { key: "description", label: "Ծրագրի Նկարագրություն", type: "textarea" },
          ]}
          onSave={async (newDay) => {
            const list = [...content.agenda, newDay];
            setContent((prev) => ({ ...prev, agenda: list }));
            await savePageField("forum", "agenda", list);
          }}
          onClose={() => setIsAddingAgenda(false)}
        />
      )}
    </main>
  );
}
