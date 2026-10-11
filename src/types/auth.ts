export type UserRole = "super-admin" | "admin" | "scholar" | "member";

export interface RoleDefinition {
  id: UserRole;
  labelHy: string;
  labelEn: string;
  badgeBg: string;
  badgeBorder: string;
  badgeColor: string;
  descriptionHy: string;
  permissions: string[];
}

export const USER_ROLES: Record<UserRole, RoleDefinition> = {
  "super-admin": {
    id: "super-admin",
    labelHy: "Գերադմին (Super Admin)",
    labelEn: "Super Administrator",
    badgeBg: "rgba(220, 38, 38, 0.15)",
    badgeBorder: "rgba(220, 38, 38, 0.4)",
    badgeColor: "#ef4444",
    descriptionHy: "Համակարգի լիակատար կառավարում, դերերի նշանակում և փոփոխություն, բոլոր բաժինների հասանելիություն:",
    permissions: ["all_access", "manage_roles", "manage_admins", "manage_content", "delete_users"],
  },
  admin: {
    id: "admin",
    labelHy: "Ադմինիստրատոր (Admin)",
    labelEn: "Administrator",
    badgeBg: "rgba(183, 121, 31, 0.18)",
    badgeBorder: "rgba(183, 121, 31, 0.45)",
    badgeColor: "var(--gold-accent)",
    descriptionHy: "Քաղաքակրթությունների, ֆորումի, գիտական նյութերի և օգտատերերի բովանդակության կառավարում:",
    permissions: ["manage_content", "moderate_discussions", "view_users", "approve_contributions"],
  },
  scholar: {
    id: "scholar",
    labelHy: "Մտածող / Գիտնական",
    labelEn: "Scholar / Thinker",
    badgeBg: "rgba(147, 51, 234, 0.15)",
    badgeBorder: "rgba(147, 51, 234, 0.4)",
    badgeColor: "#a855f7",
    descriptionHy: "Գիտական աշխատությունների հրապարակում, հարցադրումների վերլուծություն և Մանիֆեստի համահեղինակություն:",
    permissions: ["publish_papers", "propose_manifesto", "lead_dialogues"],
  },
  member: {
    id: "member",
    labelHy: "Արարատյան Անդամ",
    labelEn: "Member",
    badgeBg: "rgba(59, 130, 246, 0.12)",
    badgeBorder: "rgba(59, 130, 246, 0.35)",
    badgeColor: "#3b82f6",
    descriptionHy: "Սովորական գրանցված օգտատեր, ով մասնակցում է հանրային երկխոսություններին, քվեարկում և պահպանում նյութեր:",
    permissions: ["comment", "vote", "bookmark", "view_content"],
  },
};

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: UserRole;
  bio?: string;
  civilizationAffiliation?: string;
  affiliationTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}
