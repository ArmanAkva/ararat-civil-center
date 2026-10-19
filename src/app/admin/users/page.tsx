"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserProfile, UserRole, USER_ROLES } from "@/types/auth";
import { getAllUsers, updateUserRole, seedInitialUsers } from "@/lib/authService";

export default function AdminUsersPage() {
  const { user, role, isAdmin, isSuperAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUid, setUpdatingUid] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSeedUsers = async () => {
    if (!confirm("Ստեղծե՞լ նախնական օգտատերերի բազան Firestore-ի 'users' հավաքածուում:")) return;
    setSeeding(true);
    setStatusMessage(null);
    try {
      const res = await seedInitialUsers();
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message });
        await fetchUsers();
      } else {
        setStatusMessage({ type: "error", text: res.message });
      }
    } catch (e: any) {
      setStatusMessage({ type: "error", text: e.message || "Սխալ սերվերում:" });
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  if (authLoading) {
    return (
      <main className="container" style={{ textAlign: "center", padding: "5rem 0" }}>
        <p style={{ color: "var(--text-secondary)" }}>Ստուգվում են հասանելիության իրավունքները...</p>
      </main>
    );
  }

  // Access control
  if (!user || !isAdmin) {
    return (
      <main className="container" style={{ textAlign: "center", padding: "5rem 1rem" }}>
        <div className="glass-card" style={{ maxWidth: "550px", margin: "0 auto", padding: "3rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🚫</div>
          <h2 style={{ fontFamily: "var(--font-serif)", color: "#ef4444", margin: "0 0 1rem 0" }}>
            Մուտքն Արգելված է (Access Denied)
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: "1.6" }}>
            Այս էջը հասանելի է միայն <strong>Ադմինիստրատորներին</strong> և <strong>Գերադմինին</strong>:
            Ձեր ընթացիկ դերն է՝ <span style={{ color: "var(--gold-accent)", fontWeight: "bold" }}>{USER_ROLES[role]?.labelHy}</span>:
          </p>
          <Link href="/" className="btn-primary">
            Վերադառնալ Գլխավոր Էջ
          </Link>
        </div>
      </main>
    );
  }

  const handleRoleChange = async (targetUid: string, targetCurrentRole: UserRole, newRole: UserRole) => {
    if (targetCurrentRole === newRole) return;
    setStatusMessage(null);
    setUpdatingUid(targetUid);

    try {
      await updateUserRole(targetUid, newRole, role, targetCurrentRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
      );
      setStatusMessage({
        type: "success",
        text: `Օգտատիրոջ դերը հաջողությամբ փոխվեց՝ «${USER_ROLES[newRole].labelHy}»:`,
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err.message || "Տեղի ունեցավ սխալ դերը փոխելիս:",
      });
    } finally {
      setUpdatingUid(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.civilizationAffiliation && u.civilizationAffiliation.toLowerCase().includes(q))
    );
  });

  const superAdminsCount = users.filter((u) => u.role === "super-admin").length;
  const adminsCount = users.filter((u) => u.role === "admin").length;
  const scholarsCount = users.filter((u) => u.role === "scholar").length;
  const membersCount = users.filter((u) => u.role === "member").length;

  return (
    <main className="container" style={{ padding: "3rem 1rem 6rem", maxWidth: "1200px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
        <div>
          <div style={{ color: "var(--gold-accent)", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
            Արարատյան Կենտրոն • Կառավարման Համակարգ
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", margin: 0, color: "var(--text-primary)" }}>
            Օգտատերերի և Դերերի Կառավարում
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", margin: "0.4rem 0 0" }}>
            {isSuperAdmin
              ? "👑 Որպես Գերադմին՝ Դուք կարող եք շնորհել բոլոր դերերը (այդ թվում՝ Գերադմին):"
              : "🛡 Որպես Ադմինիստրատոր՝ Դուք կարող եք շնորհել Ադմին, Մտածող կամ Անդամ դերեր (Գերադմին շնորհել չի թույլատրվում):"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {isSuperAdmin && (
            <button
              type="button"
              onClick={handleSeedUsers}
              disabled={seeding}
              className="credo-action-btn"
              style={{ color: "var(--gold-accent)", borderColor: "var(--gold-accent)" }}
              title="Ստեղծել նախնական օգտատերերի բազա Firestore-ում"
            >
              {seeding ? "Ստեղծվում է..." : "⚡️ Ստեղծել Նախնական Բազան (Seed)"}
            </button>
          )}
          <button
            type="button"
            onClick={fetchUsers}
            className="credo-action-btn"
            title="Թարմացնել ցանկը"
          >
            🔄 Թարմացնել
          </button>
          <Link href="/profile" className="btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem" }}>
            Իմ Պրոֆիլը →
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Ընդհանուր Օգտատերեր</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "var(--text-primary)", fontFamily: "var(--font-serif)" }}>{users.length}</div>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "rgba(220, 38, 38, 0.3)" }}>
          <div style={{ fontSize: "0.85rem", color: "#ef4444", marginBottom: "0.5rem" }}>👑 Գերադմին (Super-Admin)</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#ef4444", fontFamily: "var(--font-serif)" }}>{superAdminsCount}</div>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center", borderColor: "var(--card-border)" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--gold-accent)", marginBottom: "0.5rem" }}>🛡 Ադմիններ (Admin)</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "var(--gold-accent)", fontFamily: "var(--font-serif)" }}>{adminsCount}</div>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.85rem", color: "#a855f7", marginBottom: "0.5rem" }}>🖋 Մտածողներ (Scholar)</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#a855f7", fontFamily: "var(--font-serif)" }}>{scholarsCount}</div>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.85rem", color: "#3b82f6", marginBottom: "0.5rem" }}>👤 Անդամներ (Member)</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#3b82f6", fontFamily: "var(--font-serif)" }}>{membersCount}</div>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div
          style={{
            background: statusMessage.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
            border: `1px solid ${statusMessage.type === "success" ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
            color: statusMessage.type === "success" ? "#10b981" : "#ef4444",
            padding: "1rem 1.5rem",
            borderRadius: "0.75rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <span>{statusMessage.type === "success" ? "✓" : "⚠️"}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="glass-card" style={{ padding: "2rem", overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: 0, color: "var(--gold-accent)" }}>
            Գրանցված Անդամների Ցուցակ ({filteredUsers.length})
          </h2>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Որոնել անունով, էլ. հասցեով, դերով..."
            style={{
              padding: "0.65rem 1rem",
              background: "var(--input-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "0.5rem",
              color: "var(--text-primary)",
              minWidth: "280px",
              outline: "none",
            }}
          />
        </div>

        {loadingUsers ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            Բեռնվում են օգտատերերի տվյալները...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            {users.length === 0
              ? "Դեռևս գրանցված օգտատերեր չկան:"
              : "Որոնմանը համապատասխանող օգտատեր չգտնվեց:"}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--card-border)", color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase" }}>
                <th style={{ padding: "0.85rem" }}>Օգտատեր</th>
                <th style={{ padding: "0.85rem" }}>Էլ. Փոստ</th>
                <th style={{ padding: "0.85rem" }}>Քաղաքակրթություն</th>
                <th style={{ padding: "0.85rem" }}>Ընթացիկ Դեր</th>
                <th style={{ padding: "0.85rem", textAlign: "right" }}>Դերի Փոփոխություն</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const uRoleConfig = USER_ROLES[u.role] || USER_ROLES.member;
                const isUpdating = updatingUid === u.uid;
                const isTargetSelf = u.uid === user.uid;

                return (
                  <tr
                    key={u.uid}
                    style={{
                      borderBottom: "1px solid var(--card-border)",
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* User display */}
                    <td style={{ padding: "1rem 0.85rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: uRoleConfig.badgeBg,
                            border: `1px solid ${uRoleConfig.badgeBorder}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: uRoleConfig.badgeColor,
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          {(u.displayName || u.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                            {u.displayName || "Անանուն"}
                            {isTargetSelf && (
                              <span style={{ fontSize: "0.75rem", color: "var(--gold-accent)", marginLeft: "0.5rem" }}>
                                (Դուք)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            {u.affiliationTitle || "Անդամ"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: "1rem 0.85rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                      {u.email}
                    </td>

                    {/* Civilization */}
                    <td style={{ padding: "1rem 0.85rem", color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                      {u.civilizationAffiliation || "—"}
                    </td>

                    {/* Current Role Badge */}
                    <td style={{ padding: "1rem 0.85rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          fontSize: "0.78rem",
                          fontWeight: "700",
                          background: uRoleConfig.badgeBg,
                          border: `1px solid ${uRoleConfig.badgeBorder}`,
                          color: uRoleConfig.badgeColor,
                        }}
                      >
                        {uRoleConfig.labelHy}
                      </span>
                    </td>

                    {/* Action Selector */}
                    <td style={{ padding: "1rem 0.85rem", textAlign: "right" }}>
                      <select
                        disabled={isUpdating || (!isSuperAdmin && u.role === "super-admin")}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.uid, u.role, e.target.value as UserRole)}
                        style={{
                          padding: "0.45rem 0.8rem",
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--card-border)",
                          borderRadius: "0.4rem",
                          color: "var(--text-primary)",
                          fontSize: "0.85rem",
                          cursor: (!isSuperAdmin && u.role === "super-admin") ? "not-allowed" : "pointer",
                          opacity: (!isSuperAdmin && u.role === "super-admin") ? 0.65 : 1,
                          outline: "none",
                        }}
                        title={(!isSuperAdmin && u.role === "super-admin") ? "Գերադմինի դերը կարող է փոխել միայն Գերադմինը" : undefined}
                      >
                        {isSuperAdmin && <option value="super-admin">👑 Գերադմին (Super-Admin)</option>}
                        <option value="admin">🛡 Ադմին (Admin)</option>
                        <option value="scholar">🖋 Մտածող (Scholar)</option>
                        <option value="member">👤 Անդամ (Member)</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
