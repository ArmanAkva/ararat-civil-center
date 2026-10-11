"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { USER_ROLES } from "@/types/auth";
import { updateUserProfile } from "@/lib/authService";
import { civilizationsData } from "@/lib/civilizationsData";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, role, isAdmin, isSuperAdmin, signOutUser, refreshProfile, loading } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [affiliationTitle, setAffiliationTitle] = useState(profile?.affiliationTitle || "");
  const [civilizationAffiliation, setCivilizationAffiliation] = useState(
    profile?.civilizationAffiliation || civilizationsData[0].nameHy
  );
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (loading) {
    return (
      <main className="container" style={{ textAlign: "center", padding: "5rem 0" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Բեռնվում է...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container" style={{ textAlign: "center", padding: "5rem 1rem" }}>
        <div className="glass-card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--gold-accent)", margin: "0 0 1rem 0" }}>
            Անձնական Տիրույթ
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Ձեր պրոֆիլը տեսնելու համար անհրաժեշտ է մուտք գործել համակարգ:
          </p>
          <Link href="/auth" className="btn-primary">
            Մուտք Գործել →
          </Link>
        </div>
      </main>
    );
  }

  const roleConfig = USER_ROLES[role] || USER_ROLES.member;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      await updateUserProfile(user.uid, {
        displayName,
        affiliationTitle,
        civilizationAffiliation,
        bio,
      });
      await refreshProfile();
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Տեղի ունեցավ սխալ պրոֆիլը թարմացնելիս:");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    router.push("/");
  };

  return (
    <main className="container" style={{ padding: "3rem 1rem 6rem", maxWidth: "900px" }}>
      {/* Top Banner / User Header */}
      <div
        className="glass-card"
        style={{
          padding: "2.5rem",
          marginBottom: "2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
          border: "1px solid var(--card-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          {/* Avatar */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(183, 121, 31, 0.25) 0%, rgba(183, 121, 31, 0.08) 100%)",
              border: "2px solid var(--gold-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontFamily: "var(--font-serif)",
              color: "var(--gold-accent)",
              fontWeight: "bold",
            }}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={profile?.displayName || "Avatar"}
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              (profile?.displayName || user.email || "U").charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", margin: 0, color: "var(--text-primary)" }}>
                {profile?.displayName || user.displayName || "Անանուն Օգտատեր"}
              </h1>

              {/* Role Badge */}
              <span
                style={{
                  background: roleConfig.badgeBg,
                  border: `1px solid ${roleConfig.badgeBorder}`,
                  color: roleConfig.badgeColor,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  letterSpacing: "0.03em",
                }}
              >
                {roleConfig.labelHy}
              </span>
            </div>

            <p style={{ margin: "0 0 0.35rem 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
              {user.email}
            </p>

            <div style={{ fontSize: "0.85rem", color: "var(--gold-accent)" }}>
              🏛 {profile?.civilizationAffiliation || "Հայկական քաղաքակրթություն"} • {profile?.affiliationTitle || "Անդամ"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {isAdmin && (
            <Link
              href="/admin/users"
              className="btn-primary"
              style={{ fontSize: "0.9rem", padding: "0.6rem 1.25rem" }}
            >
              🛡 Օգտատերերի Կառավարում ({isSuperAdmin ? "Գերադմին" : "Ադմին"})
            </Link>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="credo-action-btn"
            style={{ color: "#ef4444" }}
          >
            Ելք (Sign Out)
          </button>
        </div>
      </div>

      {/* Role Info Callout */}
      <div
        style={{
          background: "var(--input-bg)",
          border: `1px solid ${roleConfig.badgeBorder}`,
          borderRadius: "0.75rem",
          padding: "1.25rem 1.5rem",
          marginBottom: "2.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>
          {isSuperAdmin ? "👑" : isAdmin ? "🛡" : role === "scholar" ? "🖋" : "👤"}
        </span>
        <div>
          <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
            Ձեր Դերը. {roleConfig.labelHy}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: "1.5" }}>
            {roleConfig.descriptionHy}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="glass-card" style={{ padding: "2.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", color: "var(--gold-accent)", margin: "0 0 1.5rem 0" }}>
          Խմբագրել Պրոֆիլը
        </h2>

        {successMsg && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              color: "#10b981",
              borderRadius: "0.5rem",
              padding: "0.8rem 1.2rem",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            ✓ Ձեր տվյալները հաջողությամբ պահպանվեցին:
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", marginBottom: "0.4rem" }}>
                Անուն Ազգանուն
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  background: "var(--input-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.5rem",
                  color: "var(--text-primary)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", marginBottom: "0.4rem" }}>
                Գիտական / Ինտելեկտուալ Կոչում կամ Դեր
              </label>
              <input
                type="text"
                value={affiliationTitle}
                onChange={(e) => setAffiliationTitle(e.target.value)}
                placeholder="օրինակ՝ Պատմաբան, Ավագ գիտաշխատող, Հետազոտող"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  background: "var(--input-bg)",
                  border: "1px solid var(--card-border)",
                  borderRadius: "0.5rem",
                  color: "var(--text-primary)",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", marginBottom: "0.4rem" }}>
              Քաղաքակրթական Հիմնական Ուղղություն
            </label>
            <select
              value={civilizationAffiliation}
              onChange={(e) => setCivilizationAffiliation(e.target.value)}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--card-border)",
                borderRadius: "0.5rem",
                color: "var(--text-primary)",
                boxSizing: "border-box",
              }}
            >
              {civilizationsData.map((c) => (
                <option key={c.id} value={c.nameHy}>
                  {c.symbol} {c.nameHy}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: "600", marginBottom: "0.4rem" }}>
              Համառոտ Կենսագրություն / Ասելիք (Bio)
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ներկայացրեք ձեր հետազոտական հետաքրքրությունները, գաղափարական հայացքները և կապը Արարատյան Ֆորումի հետ..."
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "0.5rem",
                color: "var(--text-primary)",
                boxSizing: "border-box",
                fontFamily: "inherit",
                lineHeight: "1.6",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Պահպանվում է..." : "Պահպանել Փոփոխությունները"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
