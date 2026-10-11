import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Civilization,
  civilizationsData,
  getCivilizationBySlug,
} from "./civilizationsData";
import {
  defaultHomeContent,
  defaultAboutContent,
  defaultDialogueContent,
  defaultForumContent,
} from "./defaultSiteContent";
import {
  HomePageContent,
  AboutPageContent,
  DialoguePageContent,
  ForumPageContent,
} from "@/types/content";

/**
 * Reads a single civilization from Firestore or falls back to local data
 */
export async function getCivilizationContent(
  slugOrId: string
): Promise<Civilization | undefined> {
  const localCiv = getCivilizationBySlug(slugOrId);
  const civId = localCiv?.id || slugOrId.toLowerCase();

  try {
    const docRef = doc(db, "civilizations", civId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as Civilization;
    }
  } catch (error) {
    console.warn(`Firestore read failed for civilization ${civId}, using fallback:`, error);
  }

  return localCiv;
}

/**
 * Reads all civilizations from Firestore or falls back to local data
 */
export async function getAllCivilizationsContent(): Promise<Civilization[]> {
  try {
    const collRef = collection(db, "civilizations");
    const snap = await getDocs(collRef);

    if (!snap.empty) {
      const list: Civilization[] = [];
      snap.forEach((d) => list.push(d.data() as Civilization));
      // Sort by order matching default list
      const order = civilizationsData.map((c) => c.id);
      return list.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    }
  } catch (error) {
    console.warn("Firestore civilizations read failed, using fallback:", error);
  }

  return civilizationsData;
}

/**
 * Updates a civilization document in Firestore
 */
export async function updateCivilizationContent(
  id: string,
  partialData: Partial<Civilization>
): Promise<void> {
  const docRef = doc(db, "civilizations", id);
  await setDoc(
    docRef,
    {
      ...partialData,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Reads page content from site_content/{pageKey}
 */
export async function getPageContent<T>(
  pageKey: "home" | "about" | "dialogue" | "forum",
  defaultData: T
): Promise<T> {
  try {
    const docRef = doc(db, "site_content", pageKey);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { ...defaultData, ...snap.data() } as T;
    }
  } catch (error) {
    console.warn(`Firestore read failed for page ${pageKey}, using fallback:`, error);
  }

  return defaultData;
}

/**
 * Updates page content in site_content/{pageKey}
 */
export async function updatePageContent<T>(
  pageKey: "home" | "about" | "dialogue" | "forum",
  partialData: Partial<T>
): Promise<void> {
  const docRef = doc(db, "site_content", pageKey);
  await setDoc(
    docRef,
    {
      ...partialData,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Seeds all site content and 8 civilizations into Firestore
 */
export async function seedAllContentToFirestore(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // 1. Seed 8 Civilizations
    for (const civ of civilizationsData) {
      const docRef = doc(db, "civilizations", civ.id);
      await setDoc(
        docRef,
        {
          ...civ,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    // 2. Seed Pages in site_content
    await setDoc(
      doc(db, "site_content", "home"),
      { ...defaultHomeContent, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    await setDoc(
      doc(db, "site_content", "about"),
      { ...defaultAboutContent, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    await setDoc(
      doc(db, "site_content", "dialogue"),
      { ...defaultDialogueContent, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    await setDoc(
      doc(db, "site_content", "forum"),
      { ...defaultForumContent, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    return {
      success: true,
      message:
        "Հաջողությամբ Firestore տեղափոխվեցին 8 քաղաքակրթությունները և 4 հիմնական էջերի բովանդակությունը:",
    };
  } catch (error: any) {
    console.error("Seed error:", error);
    return {
      success: false,
      message: `Չհաջողվեց ստեղծել բովանդակությունը. ${error.message || error}`,
    };
  }
}
