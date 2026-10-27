import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  collectionGroup,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Civilization,
  ThinkTank,
  Thinker,
  Publication,
  PublicationWithDetails,
  civilizationsData,
  getCivilizationBySlug,
  findCenterById,
  findAuthorById,
  findPublicationById,
  getAllLocalPublicationsWithDetails,
} from "./civilizationsData";
import {
  defaultCivilizationsContent,
  defaultHomeContent,
  defaultAboutContent,
  defaultDialogueContent,
  defaultForumContent,
} from "./defaultSiteContent";
import { seedDialogueTopicsToFirestore } from "./dialogueService";

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
    const publicationsRef = collection(db, "civilizations", civId, "publications");

    const [centersSnap, authorsSnap, publicationsSnap] = await Promise.all([
      getDocs(centersRef).catch(() => null),
      getDocs(authorsRef).catch(() => null),
      getDocs(publicationsRef).catch(() => null),
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

    // Parse publications subcollection
    let fetchedPublications: Publication[] = [];
    if (publicationsSnap && !publicationsSnap.empty) {
      publicationsSnap.forEach((d) => {
        fetchedPublications.push(d.data() as Publication);
      });
    }

    // Merge centers by ID
    const baseCenters = (parentSnap && parentSnap.exists() && Array.isArray(parentSnap.data().centers) && parentSnap.data().centers.length > 0)
      ? parentSnap.data().centers
      : localCiv?.centers || [];
    const centerMap = new Map<string, ThinkTank>();
    for (const c of baseCenters) {
      if (c && c.id) centerMap.set(c.id.toLowerCase(), c);
    }
    for (const c of fetchedCenters) {
      if (c && c.id) {
        centerMap.set(c.id.toLowerCase(), { ...(centerMap.get(c.id.toLowerCase()) || {}), ...c });
      }
    }
    const mergedCenters = Array.from(centerMap.values());

    // Merge authors by ID
    const baseAuthors = (parentSnap && parentSnap.exists() && Array.isArray(parentSnap.data().authors) && parentSnap.data().authors.length > 0)
      ? parentSnap.data().authors
      : localCiv?.authors || [];
    const authorMap = new Map<string, Thinker>();
    for (const a of baseAuthors) {
      if (a && a.id) authorMap.set(a.id.toLowerCase(), a);
    }
    for (const a of fetchedAuthors) {
      if (a && a.id) {
        authorMap.set(a.id.toLowerCase(), { ...(authorMap.get(a.id.toLowerCase()) || {}), ...a });
      }
    }
    const mergedAuthors = Array.from(authorMap.values());

    // Merge publications by ID
    const basePubs = (parentSnap && parentSnap.exists() && Array.isArray(parentSnap.data().publications) && parentSnap.data().publications.length > 0)
      ? parentSnap.data().publications
      : localCiv?.publications || [];
    const pubMap = new Map<string, Publication>();
    for (const p of basePubs) {
      if (p && p.id) pubMap.set(p.id.toLowerCase(), p);
    }
    for (const p of fetchedPublications) {
      if (p && p.id) {
        pubMap.set(p.id.toLowerCase(), { ...(pubMap.get(p.id.toLowerCase()) || {}), ...p });
      }
    }
    const mergedPublications = Array.from(pubMap.values());

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
        centers: mergedCenters,
        authors: mergedAuthors,
        publications: mergedPublications,
      };
    } else if (fetchedCenters.length > 0 || fetchedAuthors.length > 0 || fetchedPublications.length > 0) {
      return {
        ...(localCiv || civilizationsData[0]),
        centers: mergedCenters,
        authors: mergedAuthors,
        publications: mergedPublications,
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
 * Recursively strips keys with undefined values from objects/arrays
 * to prevent Firestore "Unsupported field value: undefined" errors.
 */
export function cleanFirestoreData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  try {
    return JSON.parse(
      JSON.stringify(data, (_key, value) => {
        return value === undefined ? undefined : value;
      })
    ) as T;
  } catch {
    if (Array.isArray(data)) {
      return data
        .filter((item) => item !== undefined)
        .map((item) => (typeof item === "object" && item !== null ? cleanFirestoreData(item) : item)) as unknown as T;
    }
    if (typeof data === "object") {
      const clean: Record<string, any> = {};
      for (const [key, val] of Object.entries(data)) {
        if (val !== undefined) {
          clean[key] = typeof val === "object" && val !== null ? cleanFirestoreData(val) : val;
        }
      }
      return clean as T;
    }
    return data;
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
    cleanFirestoreData({
      ...metaFields,
      updatedAt: new Date().toISOString(),
    }),
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
    cleanFirestoreData({
      ...center,
      civId,
      updatedAt: new Date().toISOString(),
    }),
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
    cleanFirestoreData({
      ...author,
      civId,
      updatedAt: new Date().toISOString(),
    }),
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
 * Subcollection: Saves or updates a Publication document
 * Path: /civilizations/{civId}/publications/{pub.id}
 */
export async function savePublicationDoc(
  civId: string,
  pub: Publication
): Promise<void> {
  const pubId = pub.id || `pub-${Date.now()}`;
  const docRef = doc(db, "civilizations", civId, "publications", pubId);
  await setDoc(
    docRef,
    cleanFirestoreData({
      ...pub,
      id: pubId,
      civId,
      updatedAt: new Date().toISOString(),
    }),
    { merge: true }
  );
}

/**
 * Subcollection: Deletes a Publication document
 * Path: /civilizations/{civId}/publications/{pubId}
 */
export async function deletePublicationDoc(
  civId: string,
  pubId: string
): Promise<void> {
  const docRef = doc(db, "civilizations", civId, "publications", pubId);
  await deleteDoc(docRef);
}

/**
 * Reads page content from site_content/{pageKey}
 */
export async function getPageContent<T>(
  pageKey: "home" | "about" | "dialogue" | "forum" | "civilizations" | "footer",
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
  pageKey: "home" | "about" | "dialogue" | "forum" | "civilizations" | "footer",
  partialData: Partial<T>
): Promise<void> {
  const docRef = doc(db, "site_content", pageKey);
  await setDoc(
    docRef,
    cleanFirestoreData({
      ...partialData,
      updatedAt: new Date().toISOString(),
    }),
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
        cleanFirestoreData({
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
        }),
        { merge: true }
      );

      // 1.2 Subcollection: centers
      for (const center of civ.centers) {
        const centerRef = doc(db, "civilizations", civ.id, "centers", center.id);
        await setDoc(
          centerRef,
          cleanFirestoreData({
            ...center,
            civId: civ.id,
            updatedAt: new Date().toISOString(),
          }),
          { merge: true }
        );
      }

      // 1.3 Subcollection: authors
      for (const author of civ.authors) {
        const authorRef = doc(db, "civilizations", civ.id, "authors", author.id);
        await setDoc(
          authorRef,
          cleanFirestoreData({
            ...author,
            civId: civ.id,
            updatedAt: new Date().toISOString(),
          }),
          { merge: true }
        );
      }

      // 1.4 Subcollection: publications
      if (civ.publications && Array.isArray(civ.publications)) {
        for (const pub of civ.publications) {
          const pubId = pub.id || `pub-${Date.now()}`;
          const pubRef = doc(db, "civilizations", civ.id, "publications", pubId);
          await setDoc(
            pubRef,
            cleanFirestoreData({
              ...pub,
              id: pubId,
              civId: civ.id,
              updatedAt: new Date().toISOString(),
            }),
            { merge: true }
          );
        }
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
    await setDoc(
      doc(db, "site_content", "civilizations"),
      { ...defaultCivilizationsContent, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    // 3. Seed dialogues collection & comments subcollections
    try {
      await seedDialogueTopicsToFirestore();
    } catch (e) {
      console.warn("Could not seed dialogue topics during seedAll:", e);
    }

    return {
      success: true,
      message:
        "✓ Բոլոր 8 քաղաքակրթությունները, նրանց կենտրոններն ու հեղինակները, 5 հիմնական էջերը և երկխոսությունները (ենթահավաքածուներով) հաջողությամբ գրանցվեցին Firestore-ում:",
    };
  } catch (error: any) {
    console.error("Seed error:", error);
    return {
      success: false,
      message: `Չհաջողվեց ստեղծել բովանդակությունը. ${error.message || error}`,
    };
  }
}

/**
 * Reads a single center and its parent civilization
 */
export async function getCenterContent(
  centerId: string
): Promise<{ center: ThinkTank; civ: Civilization } | undefined> {
  const local = findCenterById(centerId);
  const civId = local?.civ.id;

  if (civId) {
    try {
      const docRef = doc(db, "civilizations", civId, "centers", centerId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const fullCiv = await getCivilizationContent(civId);
        return {
          center: snap.data() as ThinkTank,
          civ: fullCiv || local.civ,
        };
      }
    } catch (e) {
      console.warn(`Firestore center ${centerId} fetch failed, using fallback:`, e);
    }
  }

  // Search all civilizations if not found directly
  try {
    const allCivs = await getAllCivilizationsContent();
    for (const c of allCivs) {
      const found = c.centers?.find((ct) => ct.id.toLowerCase() === centerId.toLowerCase());
      if (found) {
        return { center: found, civ: c };
      }
    }
  } catch (e) {
    console.warn("Global search for center failed:", e);
  }

  return local;
}

/**
 * Reads a single author and their parent civilization
 */
export async function getAuthorContent(
  authorId: string
): Promise<{ author: Thinker; civ: Civilization } | undefined> {
  const local = findAuthorById(authorId);
  const civId = local?.civ.id;

  if (civId) {
    try {
      const docRef = doc(db, "civilizations", civId, "authors", authorId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const fullCiv = await getCivilizationContent(civId);
        return {
          author: snap.data() as Thinker,
          civ: fullCiv || local.civ,
        };
      }
    } catch (e) {
      console.warn(`Firestore author ${authorId} fetch failed, using fallback:`, e);
    }
  }

  // Search all civilizations if not found directly
  try {
    const allCivs = await getAllCivilizationsContent();
    for (const c of allCivs) {
      const found = c.authors?.find((a) => a.id.toLowerCase() === authorId.toLowerCase());
      if (found) {
        return { author: found, civ: c };
      }
    }
  } catch (e) {
    console.warn("Global search for author failed:", e);
  }

  return local;
}

/**
 * Reads a single publication and its associated civilization, author, and center.
 */
export async function getPublicationContent(
  pubId: string
): Promise<PublicationWithDetails | undefined> {
  const local = findPublicationById(pubId);
  const civId = local?.civ.id;

  // 1. If civId is known from local defaults, try direct fetch first
  if (civId) {
    try {
      const docRef = doc(db, "civilizations", civId, "publications", pubId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const firestorePub = snap.data() as Publication;
        const mergedPub: Publication = {
          ...(local?.pub || {}),
          ...firestorePub,
        };
        const fullCiv = await getCivilizationContent(civId);
        const resolvedCiv = fullCiv || local.civ;
        const author = mergedPub.authorIds?.[0]
          ? (resolvedCiv.authors || []).find((a) => a.id.toLowerCase() === mergedPub.authorIds![0].toLowerCase())
          : undefined;
        const center = mergedPub.centerIds?.[0]
          ? (resolvedCiv.centers || []).find((c) => c.id.toLowerCase() === mergedPub.centerIds![0].toLowerCase())
          : undefined;
        return { pub: mergedPub, civ: resolvedCiv, author, center };
      }
    } catch (e) {
      console.warn(`Firestore publication direct fetch ${pubId} failed:`, e);
    }
  }

  // 2. Query collectionGroup to find by ID anywhere in Firestore
  try {
    const q = query(collectionGroup(db, "publications"), where("id", "==", pubId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const foundDoc = snap.docs[0];
      const firestorePub = foundDoc.data() as Publication;
      const parentCivId = foundDoc.ref.parent.parent?.id || firestorePub.civId || civId || "arm";
      const fullCiv = await getCivilizationContent(parentCivId);
      const resolvedCiv = fullCiv || local?.civ || civilizationsData.find((c) => c.id === parentCivId) || civilizationsData[0];
      const mergedPub: Publication = {
        ...(local?.pub || {}),
        ...firestorePub,
      };
      const author = mergedPub.authorIds?.[0]
        ? (resolvedCiv.authors || []).find((a) => a.id.toLowerCase() === mergedPub.authorIds![0].toLowerCase())
        : undefined;
      const center = mergedPub.centerIds?.[0]
        ? (resolvedCiv.centers || []).find((c) => c.id.toLowerCase() === mergedPub.centerIds![0].toLowerCase())
        : undefined;
      return { pub: mergedPub, civ: resolvedCiv, author, center };
    }
  } catch (e) {
    console.warn(`collectionGroup query for ${pubId} failed:`, e);
  }

  // 3. Fallback to scanning all civilizations
  try {
    const allCivs = await getAllCivilizationsContent();
    for (const c of allCivs) {
      const found = (c.publications || []).find(
        (p) => p.id?.toLowerCase() === pubId.toLowerCase()
      );
      if (found) {
        const mergedPub: Publication = { ...(local?.pub || {}), ...found };
        const author = mergedPub.authorIds?.[0]
          ? (c.authors || []).find((a) => a.id.toLowerCase() === mergedPub.authorIds![0].toLowerCase())
          : undefined;
        const center = mergedPub.centerIds?.[0]
          ? (c.centers || []).find((ct) => ct.id.toLowerCase() === mergedPub.centerIds![0].toLowerCase())
          : undefined;
        return { pub: mergedPub, civ: c, author, center };
      }
    }
  } catch (e) {
    console.warn("Global search for publication failed:", e);
  }

  if (local) {
    const author = local.pub.authorIds?.[0]
      ? (local.civ.authors || []).find((a) => a.id.toLowerCase() === local.pub.authorIds![0].toLowerCase())
      : undefined;
    const center = local.pub.centerIds?.[0]
      ? (local.civ.centers || []).find((c) => c.id.toLowerCase() === local.pub.centerIds![0].toLowerCase())
      : undefined;
    return { pub: local.pub, civ: local.civ, author, center };
  }

  return undefined;
}

/**
 * Reads all publications across all civilizations with resolved civilization, author, and center.
 */
export async function getAllPublicationsWithDetails(): Promise<PublicationWithDetails[]> {
  try {
    const allCivs = await getAllCivilizationsContent();
    const map = new Map<string, PublicationWithDetails>();

    for (const civ of allCivs) {
      if (civ.publications && Array.isArray(civ.publications)) {
        for (const pub of civ.publications) {
          if (!pub.id) continue;
          const author = pub.authorIds?.[0]
            ? (civ.authors || []).find((a) => a.id.toLowerCase() === pub.authorIds![0].toLowerCase())
            : undefined;
          const center = pub.centerIds?.[0]
            ? (civ.centers || []).find((c) => c.id.toLowerCase() === pub.centerIds![0].toLowerCase())
            : undefined;
          map.set(pub.id.toLowerCase(), { pub, civ, author, center });
        }
      }

      // Also gather publications directly nested on authors or centers
      if (civ.authors && Array.isArray(civ.authors)) {
        for (const a of civ.authors) {
          if (a.publications && Array.isArray(a.publications)) {
            for (const pub of a.publications) {
              if (!pub.id) continue;
              if (!map.has(pub.id.toLowerCase())) {
                const center = pub.centerIds?.[0]
                  ? (civ.centers || []).find((c) => c.id.toLowerCase() === pub.centerIds![0].toLowerCase())
                  : undefined;
                map.set(pub.id.toLowerCase(), { pub, civ, author: a, center });
              }
            }
          }
        }
      }

      if (civ.centers && Array.isArray(civ.centers)) {
        for (const c of civ.centers) {
          if (c.publications && Array.isArray(c.publications)) {
            for (const pub of c.publications) {
              if (!pub.id) continue;
              if (!map.has(pub.id.toLowerCase())) {
                const author = pub.authorIds?.[0]
                  ? (civ.authors || []).find((a) => a.id.toLowerCase() === pub.authorIds![0].toLowerCase())
                  : undefined;
                map.set(pub.id.toLowerCase(), { pub, civ, author, center: c });
              }
            }
          }
        }
      }
    }

    // Also include any publications from collectionGroup across Firestore
    try {
      const snap = await getDocs(collectionGroup(db, "publications"));
      snap.forEach((docSnap) => {
        const pub = docSnap.data() as Publication;
        if (!pub || !pub.id) return;
        const key = pub.id.toLowerCase();
        const parentCivId = docSnap.ref.parent.parent?.id || pub.civId || "arm";
        const civ = allCivs.find((c) => c.id.toLowerCase() === parentCivId.toLowerCase()) || civilizationsData[0];
        const existing = map.get(key);
        if (existing) {
          existing.pub = { ...existing.pub, ...pub };
        } else {
          const author = pub.authorIds?.[0]
            ? (civ.authors || []).find((a) => a.id.toLowerCase() === pub.authorIds![0].toLowerCase())
            : undefined;
          const center = pub.centerIds?.[0]
            ? (civ.centers || []).find((c) => c.id.toLowerCase() === pub.centerIds![0].toLowerCase())
            : undefined;
          map.set(key, { pub, civ, author, center });
        }
      });
    } catch (e) {
      console.warn("collectionGroup publications query error:", e);
    }

    if (map.size > 0) {
      return Array.from(map.values());
    }
  } catch (err) {
    console.warn("Failed fetching all publications from Firestore, using local fallback:", err);
  }

  return getAllLocalPublicationsWithDetails();
}

