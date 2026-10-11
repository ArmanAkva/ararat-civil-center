"use client";

import { useEffect, useState } from "react";
import { defaultDialogueContent } from "@/lib/defaultSiteContent";
import { DialoguePageContent, ExpertResponse } from "@/types/content";
import { getPageContent } from "@/lib/contentService";
import { useEditMode } from "@/context/EditModeContext";
import EditableText from "@/components/cms/EditableText";
import EditCardModal from "@/components/cms/EditCardModal";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Dialogue() {
  const [content, setContent] = useState<DialoguePageContent>(defaultDialogueContent);
  const { isEditMode, savePageField } = useEditMode();

  // Modal state for adding/editing expert responses
  const [editingExpert, setEditingExpert] = useState<{
    index: number;
    data: ExpertResponse;
  } | null>(null);
  const [isAddingExpert, setIsAddingExpert] = useState(false);

  // User comment form state
  const [newAuthor, setNewAuthor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getPageContent<DialoguePageContent>("dialogue", defaultDialogueContent).then((data) => {
      if (isMounted && data) {
        setContent(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle submitting public comment
  const handleAddPublicComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const authorName = newAuthor.trim() || "Անանուն մասնակից";
    setSubmittingComment(true);
    try {
      if (isEditMode) {
        const updatedFeed = [
          ...content.publicFeed,
          { author: authorName, text: newComment.trim() },
        ];
        setContent((prev) => ({ ...prev, publicFeed: updatedFeed }));
        await savePageField("dialogue", "publicFeed", updatedFeed);
      } else {
        await addDoc(collection(db, "dialogue_comments"), {
          author: authorName,
          text: newComment.trim(),
          createdAt: new Date().toISOString(),
          status: "pending",
        });
      }
      setNewAuthor("");
      setNewComment("");
      alert("Շնորհակալություն։ Ձեր տեսակետը հաջողությամբ գրանցվեց։");
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ տեսակետն ուղարկելիս։");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Archive topic add
  const handleAddArchiveTopic = async () => {
    const title = prompt("Մուտքագրեք արխիվային հարցադրման անվանումը:");
    if (!title) return;
    const updated = [...content.archiveTopics, title.trim()];
    setContent((prev) => ({ ...prev, archiveTopics: updated }));
    await savePageField("dialogue", "archiveTopics", updated);
  };

  return (
    <main className="container" style={{ paddingBottom: "5rem" }}>
      {/* Block 1. Active Topic Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--gradient-overlay-1) 0%, var(--bg-color) 100%)",
          border: "1px solid var(--gold-accent)",
          borderRadius: "1rem",
          padding: "3.5rem 2rem",
          textAlign: "center",
          marginBottom: "4rem",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--gold-accent)",
            letterSpacing: "0.1em",
            marginBottom: "1.2rem",
            fontSize: "0.95rem",
            fontWeight: "bold",
          }}
        >
          <EditableText
            tag="span"
            label="Հարցադրման համար"
            value={content.activeTopic.number}
            onSave={async (val) => {
              const updated = { ...content.activeTopic, number: val };
              setContent((prev) => ({ ...prev, activeTopic: updated }));
              await savePageField("dialogue", "activeTopic", updated);
            }}
          />
          <span>|</span>
          <EditableText
            tag="span"
            label="Հարցադրման ժամկետ"
            value={content.activeTopic.date}
            onSave={async (val) => {
              const updated = { ...content.activeTopic, date: val };
              setContent((prev) => ({ ...prev, activeTopic: updated }));
              await savePageField("dialogue", "activeTopic", updated);
            }}
          />
        </div>

        <EditableText
          tag="h1"
          multiline
          label="Ակտիվ Հարցադրման Վերնագիր"
          value={content.activeTopic.title}
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2.4rem",
            margin: "0 0 1.5rem 0",
            lineHeight: "1.3",
          }}
          onSave={async (val) => {
            const updated = { ...content.activeTopic, title: val };
            setContent((prev) => ({ ...prev, activeTopic: updated }));
            await savePageField("dialogue", "activeTopic", updated);
          }}
        />

        <EditableText
          tag="p"
          multiline
          label="Ակտիվ Հարցադրման Նկարագրություն"
          value={content.activeTopic.description}
          style={{
            color: "var(--text-secondary)",
            maxWidth: "800px",
            margin: "0 auto 2.5rem",
            lineHeight: "1.8",
            fontSize: "1.1rem",
          }}
          onSave={async (val) => {
            const updated = { ...content.activeTopic, description: val };
            setContent((prev) => ({ ...prev, activeTopic: updated }));
            await savePageField("dialogue", "activeTopic", updated);
          }}
        />

        <a
          href="#comment-form"
          className="btn-primary"
          style={{
            textDecoration: "none",
            display: "inline-block",
            padding: "0.8rem 2rem",
            fontSize: "1rem",
          }}
        >
          Ներկայացնել Տեսակետ ↓
        </a>
      </div>

      {/* Block 2. Expert Insights */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: 0, fontSize: "1.8rem" }}>
          Հրավիրյալ Մտածողների Պատասխանները
        </h2>
        {isEditMode && (
          <button
            type="button"
            onClick={() => setIsAddingExpert(true)}
            className="btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }}
          >
            + Ավելացնել Փորձագետ
          </button>
        )}
      </div>

      <div className="cards-grid" style={{ marginBottom: "4rem" }}>
        {content.expertResponses.map((item, idx) => (
          <div key={item.id || idx} className="glass-card" style={{ position: "relative" }}>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setEditingExpert({ index: idx, data: item })}
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

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  background: "linear-gradient(135deg, var(--gold-accent) 0%, transparent 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  border: "1px solid var(--gold-accent)",
                }}
              >
                🏛
              </div>
              <div>
                <EditableText
                  tag="h4"
                  label="Մտածողի Անուն"
                  value={item.name}
                  style={{ margin: 0, fontSize: "1.1rem" }}
                  onSave={async (val) => {
                    const updated = [...content.expertResponses];
                    updated[idx] = { ...updated[idx], name: val };
                    setContent((prev) => ({ ...prev, expertResponses: updated }));
                    await savePageField("dialogue", "expertResponses", updated);
                  }}
                />
                <EditableText
                  tag="small"
                  label="Քաղաքակրթություն"
                  value={item.civilization}
                  style={{ color: "var(--text-secondary)", display: "block" }}
                  onSave={async (val) => {
                    const updated = [...content.expertResponses];
                    updated[idx] = { ...updated[idx], civilization: val };
                    setContent((prev) => ({ ...prev, expertResponses: updated }));
                    await savePageField("dialogue", "expertResponses", updated);
                  }}
                />
              </div>
            </div>

            <EditableText
              tag="p"
              multiline
              label="Մեջբերում"
              value={item.quote}
              style={{
                fontStyle: "italic",
                color: "var(--text-secondary)",
                lineHeight: "1.6",
                margin: 0,
              }}
              onSave={async (val) => {
                const updated = [...content.expertResponses];
                updated[idx] = { ...updated[idx], quote: val };
                setContent((prev) => ({ ...prev, expertResponses: updated }));
                await savePageField("dialogue", "expertResponses", updated);
              }}
            />
          </div>
        ))}
      </div>

      {/* Block 3. Community Feed */}
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
        Հանրային Երկխոսություն
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "3rem" }}>
        {content.publicFeed.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--card-bg)",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              borderLeft: "3px solid var(--gold-accent)",
              border: "1px solid var(--card-border)",
              position: "relative",
            }}
          >
            {isEditMode && (
              <button
                type="button"
                onClick={async () => {
                  if (confirm("Ջնջե՞լ այս գրառումը:")) {
                    const updated = content.publicFeed.filter((_, i) => i !== idx);
                    setContent((prev) => ({ ...prev, publicFeed: updated }));
                    await savePageField("dialogue", "publicFeed", updated);
                  }
                }}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  background: "transparent",
                  color: "#ef4444",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                🗑
              </button>
            )}

            <EditableText
              tag="strong"
              label="Հեղինակ"
              value={item.author}
              style={{ display: "block", marginBottom: "0.5rem", color: "var(--gold-accent)" }}
              onSave={async (val) => {
                const updated = [...content.publicFeed];
                updated[idx] = { ...updated[idx], author: val };
                setContent((prev) => ({ ...prev, publicFeed: updated }));
                await savePageField("dialogue", "publicFeed", updated);
              }}
            />
            <EditableText
              tag="p"
              multiline
              label="Կարծիք"
              value={item.text}
              style={{ margin: 0, color: "var(--text-secondary)", lineHeight: "1.6" }}
              onSave={async (val) => {
                const updated = [...content.publicFeed];
                updated[idx] = { ...updated[idx], text: val };
                setContent((prev) => ({ ...prev, publicFeed: updated }));
                await savePageField("dialogue", "publicFeed", updated);
              }}
            />
          </div>
        ))}
      </div>

      {/* Add Viewpoint Form */}
      <div
        id="comment-form"
        className="glass-card"
        style={{ padding: "2rem", marginBottom: "4rem" }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--gold-accent)",
            marginTop: 0,
            marginBottom: "1rem",
          }}
        >
          Ներկայացնել Ձեր Տեսակետը
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
          Կիսվեք Ձեր մոտեցմամբ այս հարցադրման շուրջ։ Որակյալ կարծիքները կներառվեն ընդհանուր քննարկման մեջ։
        </p>
        <form onSubmit={handleAddPublicComment} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Ձեր անունը, գիտական աստիճանը կամ կազմակերպությունը..."
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            style={{
              padding: "0.8rem",
              background: "var(--input-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-primary)",
              borderRadius: "0.5rem",
              fontSize: "0.95rem",
            }}
          />
          <textarea
            required
            rows={4}
            placeholder="Ձեր դիրքորոշումը և հիմնավորումը..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              padding: "0.8rem",
              background: "var(--input-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-primary)",
              borderRadius: "0.5rem",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={submittingComment}
            className="btn-primary"
            style={{ alignSelf: "flex-start", padding: "0.7rem 1.8rem" }}
          >
            {submittingComment ? "Ուղարկվում է..." : "Ուղարկել Տեսակետը"}
          </button>
        </form>
      </div>

      {/* Block 4. Archive */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ color: "var(--text-secondary)", margin: 0 }}>Հարցադրումների Արխիվ</h3>
        {isEditMode && (
          <button
            type="button"
            onClick={handleAddArchiveTopic}
            style={{
              background: "transparent",
              color: "var(--gold-accent)",
              border: "1px dashed var(--gold-accent)",
              borderRadius: "0.4rem",
              padding: "0.3rem 0.75rem",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            + Ավելացնել Արխիվային Հարցադրում
          </button>
        )}
      </div>

      <ul style={{ color: "var(--text-secondary)", lineHeight: "2.2", paddingLeft: "1.5rem" }}>
        {content.archiveTopics.map((topic, idx) => (
          <li key={idx}>
            <EditableText
              tag="span"
              label={`Արխիվ #${idx + 1}`}
              value={topic}
              onSave={async (val) => {
                const updated = [...content.archiveTopics];
                updated[idx] = val;
                setContent((prev) => ({ ...prev, archiveTopics: updated }));
                await savePageField("dialogue", "archiveTopics", updated);
              }}
            />
            {isEditMode && (
              <button
                type="button"
                onClick={async () => {
                  const updated = content.archiveTopics.filter((_, i) => i !== idx);
                  setContent((prev) => ({ ...prev, archiveTopics: updated }));
                  await savePageField("dialogue", "archiveTopics", updated);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  marginLeft: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Edit Modal for Expert */}
      {editingExpert && (
        <EditCardModal
          title="Խմբագրել Փորձագետի Պատասխանը"
          initialData={editingExpert.data}
          fields={[
            { key: "name", label: "Մտածողի Անուն" },
            { key: "civilization", label: "Քաղաքակրթություն" },
            { key: "quote", label: "Մեջբերում", type: "textarea" },
          ]}
          onSave={async (updated) => {
            const list = [...content.expertResponses];
            list[editingExpert.index] = updated;
            setContent((prev) => ({ ...prev, expertResponses: list }));
            await savePageField("dialogue", "expertResponses", list);
          }}
          onDelete={async () => {
            const list = content.expertResponses.filter((_, i) => i !== editingExpert.index);
            setContent((prev) => ({ ...prev, expertResponses: list }));
            await savePageField("dialogue", "expertResponses", list);
          }}
          onClose={() => setEditingExpert(null)}
        />
      )}

      {/* Add Modal for Expert */}
      {isAddingExpert && (
        <EditCardModal
          title="Ավելացնել Նոր Փորձագետի Պատասխան"
          initialData={{
            id: `resp-${Date.now()}`,
            name: "",
            civilization: "",
            quote: "",
          }}
          fields={[
            { key: "name", label: "Մտածողի Անուն", placeholder: "Օր.՝ Ալեն դը Բենուա" },
            { key: "civilization", label: "Քաղաքակրթություն", placeholder: "Օր.՝ Եվրոպական քաղաքակրթություն" },
            { key: "quote", label: "Մեջբերում / Տեսակետ", type: "textarea" },
          ]}
          onSave={async (newExp) => {
            const list = [...content.expertResponses, newExp];
            setContent((prev) => ({ ...prev, expertResponses: list }));
            await savePageField("dialogue", "expertResponses", list);
          }}
          onClose={() => setIsAddingExpert(false)}
        />
      )}
    </main>
  );
}
