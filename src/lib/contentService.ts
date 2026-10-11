import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Civilization,
  ThinkTank,
  Thinker,
  civilizationsData,
  getCivilizationBySlug,
} from "./civilizationsData";
import {
  defaultHomeContent,
  defaultAboutContent,
  defaultDialogueContent,
  defaultForumContent,
} from "./defaultSiteContent";

/**
 * Reads a single civilization and its subcollections (centers & authors)
 * Falls back gracefully to local default data if Firestore is empty.
 */
export async function getCivilizationContent(
  slugOrId: string
): Promise<Civilization | undefined> {
  const localCiv = getCivilizationBySlug(slugOrId);
  const civId = localCiv?.id || slugOrId.toLowerCase();

  try {
    const parentRef = doc(db, "civilizations", civId);
    const parentSnap = await getDoc(parentRef);

    // Fetch subcollections in parallel
    const centersRef = collection(db, "civilizations", civId, "centers");
    const authorsRef = collection(db, "civilizations", civId, "authors");

    const [centersSnap, authorsSnap] = await Promise.all([
      getDocs(centersRef).catch(() => null),
      getDocs(authorsRef).catch(() => null),
    ]);

    // Parse centers subcollection
    let fetchedCenters: ThinkTank[] = [];
    if (centersSnap && !centersSnap.empty) {
      centersSnap.forEach((d) => {
        fetchedCenters.push(d.data() as ThinkTank);
      });
    }

    // Parse authors subcollection
    let fetchedAuthors: Thinker[] = [];
    if (authorsSnap && !authorsSnap.empty) {
      authorsSnap.forEach((d) => {
        fetchedAuthors.push(d.data() as Thinker);
      });
    }

    if (parentSnap.exists()) {
      const parentData = parentSnap.data();
      return {
        id: parentData.id || civId,
        slug: parentData.slug || localCiv?.slug || civId,
        nameHy: parentData.nameHy || localCiv?.nameHy || "",
        nameEn: parentData.nameEn || localCiv?.nameEn || "",
        symbol: parentData.symbol || localCiv?.symbol || "",
        badge: parentData.badge || localCiv?.badge || "",
        tagline: parentData.tagline || localCiv?.tagline || "",
        credo: parentData.credo || localCiv?.credo || "",
        overview: parentData.overview || localCiv?.overview || "",
        centers:
          fetchedCenters.length > 0
            ? fetchedCenters
            : (Array.isArray(parentData.centers) && parentData.centers.length > 0)
            ? parentData.centers
            : localCiv?.centers || [],
        authors:
          fetchedAuthors.length > 0
            ? fetchedAuthors
            : (Array.isArray(parentData.authors) && parentData.authors.length > 0)
            ? parentData.authors
            : localCiv?.authors || [],
      };
    } else if (fetchedCenters.length > 0 || fetchedAuthors.length > 0) {
      // Subcollections exist even if parent doc wasn't fetched
      return {
        ...(localCiv || civilizationsData[0]),
        centers: fetchedCenters.length > 0 ? fetchedCenters : localCiv?.centers || [],
        authors: fetchedAuthors.length > 0 ? fetchedAuthors : localCiv?.authors || [],
      };
    }
  } catch (error) {
    console.warn(`Firestore read failed for civilization ${civId}, using fallback:`, error);
  }

  return localCiv;
}

/**
 * Reads all 8 civilizations with their respective subcollections
 */
export async function getAllCivilizationsContent(): Promise<Civilization[]> {
  try {
    const list = await Promise.all(
      civilizationsData.map(async (defaultCiv) => {
        const civ = await getCivilizationContent(defaultCiv.id);
        return civ || defaultCiv;
      })
    );
    return list;
  } catch (error) {
    console.warn("Firestore civilizations read failed, using fallback:", error);
    return civilizationsData;
  }
}

/**
 * Updates the parent civilization document (meta and core credo)
 */
export async function updateCivilizationContent(
  civId: string,
  partialData: Partial<Civilization>
): Promise<void> {
  const docRef = doc(db, "civilizations", civId);
  // Separate centers and authors so they don't bloat the parent document
  const { centers, authors, ...metaFields } = partialData;
  await setDoc(
    docRef,
    {
      ...metaFields,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Subcollection: Saves or updates a Center / Think Tank document
 * Path: /civilizations/{civId}/centers/{center.id}
 */
export async function saveCenterDoc(
  civId: string,
  center: ThinkTank
): Promise<void> {
  const docRef = doc(db, "civilizations", civId, "centers", center.id);
  await setDoc(
    docRef,
    {
      ...center,
      civId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Subcollection: Deletes a Center document
 * Path: /civilizations/{civId}/centers/{centerId}
 */
export async function deleteCenterDoc(
  civId: string,
  centerId: string
): Promise<void> {
  const docRef = doc(db, "civilizations", civId, "centers", centerId);
  await deleteDoc(docRef);
}

/**
 * Subcollection: Saves or updates an Author / Thinker document
 * Path: /civilizations/{civId}/authors/{author.id}
 */
export async function saveAuthorDoc(
  civId: string,
  author: Thinker
): Promise<void> {
  const docRef = doc(db, "civilizations", civId, "authors", author.id);
  await setDoc(
    docRef,
    {
      ...author,
      civId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Subcollection: Deletes an Author document
 * Path: /civilizations/{civId}/authors/{authorId}
 */
export async function deleteAuthorDoc(
  civId: string,
  authorId: string
): Promise<void> {
  const docRef = doc(db, "civilizations", civId, "authors", authorId);
  await deleteDoc(docRef);
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
 * Seeds all site content and 8 civilizations with SUBCOLLECTIONS into Firestore
 */
export async function seedAllContentToFirestore(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // 1. Seed 8 Civilizations with their respective subcollections
    for (const civ of civilizationsData) {
      // 1.1 Parent document (meta & credo)
      const parentRef = doc(db, "civilizations", civ.id);
      await setDoc(
        parentRef,
        {
          id: civ.id,
          slug: civ.slug,
          nameHy: civ.nameHy,
          nameEn: civ.nameEn,
          symbol: civ.symbol,
          badge: civ.badge,
          tagline: civ.tagline,
          credo: civ.credo,
          overview: civ.overview,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 1.2 Subcollection: centers
      for (const center of civ.centers) {
        const centerRef = doc(db, "civilizations", civ.id, "centers", center.id);
        await setDoc(
          centerRef,
          {
            ...center,
            civId: civ.id,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }

      // 1.3 Subcollection: authors
      for (const author of civ.authors) {
        const authorRef = doc(db, "civilizations", civ.id, "authors", author.id);
        await setDoc(
          authorRef,
          {
            ...author,
            civId: civ.id,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
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
        "✓ Բոլոր 8 քաղաքակրթությունները, նրանց կենտրոններն ու հեղինակները (ենթահավաքածուներում) և 4 հիմնական էջերը հաջողությամբ գրանցվեցին Firestore-ում:",
    };
  } catch (error: any) {
    console.error("Seed error:", error);
    return {
      success: false,
      message: `Չհաջողվեց ստեղծել բովանդակությունը. ${error.message || error}`,
    };
  }
}
