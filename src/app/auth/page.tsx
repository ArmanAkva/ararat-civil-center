"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { civilizationsData } from "@/lib/civilizationsData";

export default function AuthPage() {
  const router = useRouter();
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [affiliation, setAffiliation] = useState(civilizationsData[0].nameHy);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // If already logged in, provide link or auto-redirect
  if (user) {
    return (
      <main className="container" style={{ textAlign: "center", padding: "5rem 1rem" }}>
        <div className="glass-card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>
          <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 1rem 0" }}>
            Դուք արդեն մուտք եք գործել
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Մուտք եք գործել որպես <strong>{user.email}</strong>
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/profile" className="btn-primary">
              Իմ Պրոֆիլը →
            </Link>
            <Link href="/" className="credo-action-btn">
              Գլխավոր Էջ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error("Խնդրում ենք լրացնել ձեր անունը:");
        }
        await signUpWithEmail(email, password, displayName, affiliation);
      }
      router.push("/profile");
    } catch (err: any) {
      const code = err?.code || "";
      let msg = "Մուտքագրված էլ. հասցեն կամ գաղտնաբառը սխալ է: Խնդրում ենք ստուգել մուտքագրված տվյալները:";

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        msg = "Մուտքագրված էլ. հասցեն կամ գաղտնաբառը սխալ է: Խնդրում ենք ստուգել մուտքագրված տվյալները կամ վերականգնել գաղտնաբառը:";
      } else if (code === "auth/email-already-in-use") {
        msg = "Այս էլ. հասցեով օգտատեր արդեն գոյություն ունի: Կարող եք մուտք գործել:";
      } else if (code === "auth/weak-password") {
        msg = "Գաղտնաբառը պետք է լինի առնվազն 6 նիշ:";
      } else if (code === "auth/invalid-email") {
        msg = "Խնդրում ենք մուտքագրել վավեր էլ. հասցե:";
      } else if (code === "auth/too-many-requests") {
        msg = "Չափազանց շատ անհաջող փորձեր: Խնդրում ենք փորձել մի փոքր ուշ կամ վերականգնել գաղտնաբառը:";
      } else if (code === "auth/user-disabled") {
        msg = "Այս հաշիվը կասեցված է: Խնդրում ենք կապ հաստատել ադմինիստրատորի հետ:";
      } else if (err?.message && !err?.message.includes("Firebase")) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMsg("Գաղտնաբառը վերականգնելու համար նախ մուտքագրեք Ձեր էլ. հասցեն վերևի դաշտում:");
      return;
    }
    setResettingPassword(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await resetPassword(email);
      setSuccessMsg(`Գաղտնաբառի վերականգնման հղումն ուղարկվեց ${email.trim()} հասցեին: Ստուգեք Ձեր էլ. փոստը:`);
    } catch (err: any) {
      if (err?.code === "auth/invalid-email") {
        setErrorMsg("Խնդրում ենք մուտքագրել վավեր էլ. հասցե:");
      } else if (err?.code === "auth/user-not-found") {
        setErrorMsg("Այս էլ. հասցեով գրանցված օգտատեր չի գտնվել:");
      } else {
        setErrorMsg("Գաղտնաբառը վերականգնել չհաջողվեց: Խնդրում ենք փորձել մի փոքր ուշ:");
      }
    } finally {
      setResettingPassword(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/profile");
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user") {
        // User closed popup, no error needed
      } else {
        setErrorMsg("Google-ով մուտք գործելը ձախողվեց: " + (err?.message || ""));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container" style={{ padding: "3rem 1rem 6rem", maxWidth: "600px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "2.5rem", color: "var(--gold-accent)", marginBottom: "0.5rem" }}>
          ⚜️
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2.2rem",
            color: "var(--text-primary)",
            margin: "0 0 0.5rem 0",
          }}
        >
          {mode === "signin" ? "Մուտք Համակարգ" : "Անդամագրում Կենտրոնին"}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
          Արարատյան Քաղաքակրթական Կենտրոնի Անձնական Տիրույթ
        </p>
      </div>

      <div
        className="glass-card"
        style={{
          padding: "2.5rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
          border: "1px solid var(--card-border)",
        }}
      >
        {/* Toggle Mode Tabs */}
        <div
          style={{
            display: "flex",
            background: "var(--input-bg)",
            borderRadius: "0.75rem",
            padding: "0.3rem",
            marginBottom: "2rem",
            border: "1px solid var(--card-border)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontWeight: mode === "signin" ? "700" : "500",
              fontSize: "0.95rem",
              color: mode === "signin" ? "#fff" : "var(--text-secondary)",
              background: mode === "signin" ? "var(--gold-accent)" : "transparent",
              transition: "all 0.25s ease",
            }}
          >
            Մուտք (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontWeight: mode === "signup" ? "700" : "500",
              fontSize: "0.95rem",
              color: mode === "signup" ? "#fff" : "var(--text-secondary)",
              background: mode === "signup" ? "var(--gold-accent)" : "transparent",
              transition: "all 0.25s ease",
            }}
          >
            Գրանցում (Sign Up)
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#ef4444",
              borderRadius: "0.6rem",
              padding: "0.9rem 1.2rem",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
            {mode === "signin" && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resettingPassword}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "0.82rem",
                  textDecoration: "underline",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontWeight: "600",
                }}
              >
                {resettingPassword ? "..." : "Վերականգնե՞լ"}
              </button>
            )}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              color: "#22c55e",
              borderRadius: "0.6rem",
              padding: "0.9rem 1.2rem",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {mode === "signup" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                Անուն Ազգանուն
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="օրինակ՝ Արմեն Ղազարյան"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  background: "var(--input-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.5rem",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.88rem",
                fontWeight: "600",
                color: "var(--text-primary)",
                marginBottom: "0.4rem",
              }}
            >
              Էլ. Փոստ (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "0.5rem",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.4rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Գաղտնաբառ (Password)
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resettingPassword}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--gold-accent)",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  {resettingPassword ? "Ուղարկվում է..." : "Մոռացե՞լ եք գաղտնաբառը"}
                </button>
              )}
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "0.5rem",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.88rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                Քաղաքակրթական Ոլորտ / Հետաքրքրություն
              </label>
              <select
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.5rem",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              >
                {civilizationsData.map((c) => (
                  <option key={c.id} value={c.nameHy}>
                    {c.symbol} {c.nameHy}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{
              padding: "0.9rem",
              fontSize: "1.05rem",
              marginTop: "0.5rem",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting
              ? "Մշակվում է..."
              : mode === "signin"
              ? "Մուտք Գործել"
              : "Գրանցվել որպես Անդամ"}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "2rem 0",
            color: "var(--text-secondary)",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--card-border)" }}></div>
          <span>Կամ</span>
          <div style={{ flex: 1, height: "1px", background: "var(--card-border)" }}></div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          style={{
            width: "100%",
            padding: "0.8rem 1.2rem",
            borderRadius: "0.5rem",
            background: "var(--input-bg)",
            border: "1px solid var(--card-border)",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold-accent)";
            e.currentTarget.style.background = "rgba(183, 121, 31, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--card-border)";
            e.currentTarget.style.background = "var(--input-bg)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Շարունակել Google-ով</span>
        </button>
      </div>
    </main>
  );
}
