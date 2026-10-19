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
  currentAdminRole: UserRole,
  targetCurrentRole?: UserRole
): Promise<void> {
  // Only admins and super-admins can modify roles
  if (currentAdminRole !== "super-admin" && currentAdminRole !== "admin") {
    throw new Error("Միայն Ադմինիստրատորները կարող են փոխել օգտատերերի դերերը:");
  }

  // Only super-admin can assign the super-admin role
  if (currentAdminRole !== "super-admin" && newRole === "super-admin") {
    throw new Error("Միայն Գերադմինը (Super-Admin) կարող է շնորհել Գերադմինի դեր:");
  }

  // Only super-admin can modify a super-admin user's role
  if (currentAdminRole !== "super-admin" && targetCurrentRole === "super-admin") {
    throw new Error("Միայն Գերադմինը (Super-Admin) կարող է փոփոխել Գերադմինի դերը:");
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

/**
 * Initial seed for Firestore `users` collection
 */
export async function seedInitialUsers(): Promise<{ success: boolean; count: number; message: string }> {
  const seedProfiles: UserProfile[] = [
    {
      uid: "super_admin_arman",
      email: "akvadevlead@gmail.com",
      displayName: "Arman Hovhannisyan",
      role: "super-admin",
      civilizationAffiliation: "Հայկական քաղաքակրթություն",
      affiliationTitle: "Գերադմին / Ֆորումի Հիմնադիր",
      bio: "Արարատյան Քաղաքակրթական Կենտրոնի տեխնիկական և հայեցակարգային ղեկավար:",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: "admin_ararat_center",
      email: "admin@ararat-forum.org",
      displayName: "Արարատյան Կոորդինատոր",
      role: "admin",
      civilizationAffiliation: "Հայկական քաղաքակրթություն",
      affiliationTitle: "Գործադիր Ադմինիստրատոր",
      bio: "Քաղաքակրթական երկխոսությունների և 2027թ. Ֆորումի համակարգող:",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: "scholar_zhao",
      email: "zhao.tingyang@cass.cn",
      displayName: "Ժաո Տինյան (Zhao Tingyang)",
      role: "scholar",
      civilizationAffiliation: "Չինական քաղաքակրթություն",
      affiliationTitle: "Առաջատար Փիլիսոփա, CASS",
      bio: "«Տյանսյա» համակարգի գլխավոր տեսաբան և քաղաքակրթական օնտոլոգիայի հետազոտող:",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: "scholar_vartan",
      email: "vartan.gregorian@carnegie.org",
      displayName: "Վարդան Գրիգորյան (Vartan Gregorian)",
      role: "scholar",
      civilizationAffiliation: "Հայկական քաղաքակրթություն",
      affiliationTitle: "Պատմաբան, Փիլիսոփա",
      bio: "Համաշխարհային հումանիտար մտքի ներկայացուցիչ, մշակութային երկխոսությունների տեսաբան:",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: "scholar_alain",
      email: "alain.benoist@nouvelledroite.fr",
      displayName: "Ալեն դը Բենուա (Alain de Benoist)",
      role: "scholar",
      civilizationAffiliation: "Եվրոպական քաղաքակրթություն",
      affiliationTitle: "Փիլիսոփա, Էսսեիստ",
      bio: "Ավանդական Եվրոպայի մշակութային ինքնության և բազմաբևեռ աշխարհակարգի պաշտպան:",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: "member_sample_1",
      email: "researcher.eva@gmail.com",
      displayName: "Եվա Սարգսյան",
      role: "member",
      civilizationAffiliation: "Հունական քաղաքակրթություն",
      affiliationTitle: "Երիտասարդ Հետազոտող",
      bio: "Բյուզանդական ժառանգության և անտիկ փիլիսոփայության ասպիրանտ ԵՊՀ-ում:",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    for (const profile of seedProfiles) {
      const docRef = doc(db, "users", profile.uid);
      await setDoc(docRef, profile, { merge: true });
    }
    return {
      success: true,
      count: seedProfiles.length,
      message: `Հաջողությամբ ստեղծվեց ${seedProfiles.length} օգտատիրոջ պրոֆիլ Firestore-ի "users" հավաքածուում:`,
    };
  } catch (error: any) {
    console.error("Seed error:", error);
    return {
      success: false,
      count: 0,
      message: `Չհաջողվեց ստեղծել պրոֆիլները. ${error.message || error}`,
    };
  }
}
