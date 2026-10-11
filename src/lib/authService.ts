import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "./firebase";
import { UserProfile, UserRole } from "@/types/auth";

// Super Admin initial bootstrap list
const SUPER_ADMIN_EMAILS = [
  "akvadevlead@gmail.com",
];

/**
 * Creates or fetches user profile document in Firestore
 */
export async function syncUserProfile(
  user: User,
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> {
  const userDocRef = doc(db, "users", user.uid);
  
  try {
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data() as UserProfile;
      // If user's email is in super-admin list but role is not yet super-admin, upgrade
      if (
        user.email &&
        SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase()) &&
        data.role !== "super-admin"
      ) {
        await updateDoc(userDocRef, {
          role: "super-admin",
          updatedAt: new Date().toISOString(),
        });
        return { ...data, role: "super-admin" };
      }
      return data;
    }

    // Determine initial role
    let initialRole: UserRole = "member";
    if (user.email && SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      initialRole = "super-admin";
    }

    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || additionalData?.displayName || (user.email ? user.email.split("@")[0] : "Օգտատեր"),
      photoURL: user.photoURL || null,
      role: additionalData?.role || initialRole,
      bio: additionalData?.bio || "Արարատյան Քաղաքակրթական Կենտրոնի անդամ",
      civilizationAffiliation: additionalData?.civilizationAffiliation || "Հայկական քաղաքակրթություն",
      affiliationTitle: additionalData?.affiliationTitle || (initialRole === "super-admin" ? "Համակարգող" : "Հետազոտող"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(userDocRef, {
      ...newProfile,
      serverCreatedAt: serverTimestamp(),
    });

    return newProfile;
  } catch (error) {
    console.warn("Firestore sync warning (using fallback profile):", error);
    // Graceful fallback if Firestore is not yet initialized in Console
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0] || "Օգտատեր",
      photoURL: user.photoURL,
      role: user.email && SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase()) ? "super-admin" : "member",
      bio: "Արարատյան Քաղաքակրթական Կենտրոնի անդամ",
      civilizationAffiliation: "Հայկական քաղաքակրթություն",
      affiliationTitle: "Անդամ",
    };
  }
}

/**
 * Updates an existing user's profile details
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "email" | "role">>
): Promise<void> {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Super Admin or Admin role update
 */
export async function updateUserRole(
  targetUid: string,
  newRole: UserRole,
  currentAdminRole: UserRole
): Promise<void> {
  // Only super-admin can assign or demote super-admin or admin roles
  if (currentAdminRole !== "super-admin" && (newRole === "super-admin" || newRole === "admin")) {
    throw new Error("Միայն Գերադմինը կարող է շնորհել Ադմինիստրատորի կամ Գերադմինի դեր:");
  }

  const userDocRef = doc(db, "users", targetUid);
  await updateDoc(userDocRef, {
    role: newRole,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Fetches all registered users for Admin panel
 */
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const users: UserProfile[] = [];
    querySnapshot.forEach((docSnap) => {
      users.push(docSnap.data() as UserProfile);
    });

    return users;
  } catch (error) {
    console.error("Error fetching users list:", error);
    return [];
  }
}
