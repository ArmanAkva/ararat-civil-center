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
        const cData = d.data() as ThinkTank;
        fetchedCenters.push({
          ...cData,
          id: cData.id || d.id,
        });
      });
    }

    // Parse authors subcollection
    let fetchedAuthors: Thinker[] = [];
    if (authorsSnap && !authorsSnap.empty) {
      authorsSnap.forEach((d) => {
        const aData = d.data() as Thinker;
        fetchedAuthors.push({
          ...aData,
          id: aData.id || d.id,
        });
      });
    }

    // Parse publications subcollection
    let fetchedPublications: Publication[] = [];
    if (publicationsSnap && !publicationsSnap.empty) {
      publicationsSnap.forEach((d) => {
        const pData = d.data() as Publication;
        fetchedPublications.push({
          ...pData,
          id: pData.id || d.id,
        });
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
        translations: parentData.translations || localCiv?.translations,
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
      const remoteData = snap.data() as Record<string, unknown>;
      const def = (defaultData || {}) as Record<string, unknown>;
      const merged: Record<string, unknown> = { ...def, ...remoteData };

      // Preserve default root translations if not overridden by remote
      if (def.translations && typeof def.translations === "object") {
        const remoteTrans = (remoteData.translations || {}) as Record<string, unknown>;
        merged.translations = {
          ...(def.translations as Record<string, unknown>),
          ...remoteTrans,
        };
      }

      // Preserve default array item translations (such as cards, agenda, messages)
      for (const [key, val] of Object.entries(def)) {
        if (Array.isArray(val) && Array.isArray(remoteData[key])) {
          const defaultArr = val as Array<Record<string, unknown>>;
          const remoteArr = remoteData[key] as Array<Record<string, unknown>>;
          merged[key] = remoteArr.map((rItem, idx) => {
            if (typeof rItem !== "object" || rItem === null) return rItem;
            const defItem =
              defaultArr.find((d) => d && d.id && d.id === (rItem as Record<string, unknown>).id) ||
              defaultArr[idx];
            if (defItem && defItem.translations) {
              return {
                ...defItem,
                ...rItem,
                translations: {
                  ...(defItem.translations as Record<string, unknown>),
                  ...((rItem as Record<string, unknown>).translations as Record<string, unknown> || {}),
                },
              };
            }
            return rItem;
          });
        }
      }

      return merged as T;
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
 * Updates the translations map for a page in site_content/{pageKey}
 */
export async function updatePageTranslations(
  pageKey: "home" | "about" | "dialogue" | "forum" | "civilizations" | "footer",
  translations: Record<string, any>
): Promise<void> {
  const docRef = doc(db, "site_content", pageKey);
  await setDoc(
    docRef,
    cleanFirestoreData({
      translations,
      updatedAt: new Date().toISOString(),
    }),
    { merge: true }
  );
}

/**
 * Updates the translations map for a civilization in civilizations/{civId}
 */
export async function updateCivilizationTranslations(
  civId: string,
  translations: Record<string, any>
): Promise<void> {
  const docRef = doc(db, "civilizations", civId);
  await setDoc(
    docRef,
    cleanFirestoreData({
      translations,
      updatedAt: new Date().toISOString(),
    }),
    { merge: true }
  );
}

/**
 * Automatically translates a newly updated field using Gemini Flash in the background
 * and merges the EN & RU translations into the target Firestore document.
 */
export async function autoTranslateFieldInBackground(
  collectionName: "site_content" | "civilizations",
  docId: string,
  fieldName: string,
  armenianText: string,
  context?: string
): Promise<void> {
  if (!armenianText || typeof armenianText !== "string" || armenianText.trim().length === 0) {
    return;
  }

  try {
    const res = await fetch("/api/translate/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: { [fieldName]: armenianText },
        targetLangs: ["en", "ru"],
        context: context || `Field: ${fieldName} in ${collectionName}/${docId}`,
      }),
    });

    if (!res.ok) return;
    const data = await res.json();
    if (!data.success || !data.translations) return;

    const firestoreRef = doc(db, collectionName, docId);
    const snap = await getDoc(firestoreRef);
    const existingTranslations = (snap.exists() && snap.data().translations) || {};

    const updatedTranslations = {
      ...existingTranslations,
      en: {
        ...(existingTranslations.en || {}),
        ...(data.translations.en || {}),
      },
      ru: {
        ...(existingTranslations.ru || {}),
        ...(data.translations.ru || {}),
      },
    };

    await setDoc(
      firestoreRef,
      cleanFirestoreData({
        translations: updatedTranslations,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );
  } catch (error) {
    console.warn("Background auto-translation failed:", error);
  }
}

/**
 * Sends page texts to AI translation endpoint and persists results into Firestore.
 */
export async function translatePageWithAi(
  pageKey: "home" | "about" | "dialogue" | "forum" | "civilizations" | "footer",
  data: Record<string, any>,
  context?: string
): Promise<{ success: boolean; message: string; translations?: any }> {
  try {
    // 1. Collect translatable text strings
    const textsToTranslate: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string" && value.trim().length > 0 && !key.startsWith("_") && key !== "id" && key !== "slug" && key !== "link" && key !== "updatedAt" && key !== "targetDateTime") {
        textsToTranslate[key] = value;
      }
    }

    if (Object.keys(textsToTranslate).length === 0) {
      return { success: false, message: "No translatable text found on this page." };
    }

    // 2. Call AI translation API
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLangs: ["en", "ru"],
        sourceLang: "hy",
        context: context || `Page: ${pageKey} content of Ararat Civilizational Center`,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to translate with AI");
    }

    // 3. Merge and save into Firestore
    await updatePageTranslations(pageKey, result.translations);

    return {
      success: true,
      message: "✓ Page content successfully translated with AI and saved to Firestore!",
      translations: result.translations,
    };
  } catch (error: any) {
    console.error("translatePageWithAi error:", error);
    return {
      success: false,
      message: `Translation failed: ${error.message || String(error)}`,
    };
  }
}

/**
 * Translates a Civilization document (badge, credo, overview, tagline) as well as its
 * centers, authors, and publications with AI and saves all of them to Firestore.
 */
export async function translateCivilizationWithAi(
  civId: string,
  civData: Record<string, any>
): Promise<{ success: boolean; message: string; translations?: any }> {
  try {
    const textsToTranslate: Record<string, string> = {};
    const translatableKeys = ["nameHy", "badge", "tagline", "credo", "overview"];
    for (const key of translatableKeys) {
      if (typeof civData[key] === "string" && civData[key].trim().length > 0) {
        textsToTranslate[key] = civData[key];
      }
    }

    const centers: ThinkTank[] = Array.isArray(civData.centers) ? civData.centers : [];
    const authors: Thinker[] = Array.isArray(civData.authors) ? civData.authors : [];
    const publications: Publication[] = Array.isArray(civData.publications) ? civData.publications : [];

    centers.forEach((center, idx) => {
      const cKey = center.id || `c_${idx}`;
      if (center.name) textsToTranslate[`ctr_${cKey}_name`] = center.name;
      if (center.description) textsToTranslate[`ctr_${cKey}_desc`] = center.description;
      if (center.city) textsToTranslate[`ctr_${cKey}_city`] = center.city;
      if (center.country) textsToTranslate[`ctr_${cKey}_country`] = center.country;
    });

    authors.forEach((author, idx) => {
      const aKey = author.id || `a_${idx}`;
      if (author.name) textsToTranslate[`auth_${aKey}_name`] = author.name;
      if (author.title) textsToTranslate[`auth_${aKey}_title`] = author.title;
      if (author.bio) textsToTranslate[`auth_${aKey}_bio`] = author.bio;
      if (author.quote) textsToTranslate[`auth_${aKey}_quote`] = author.quote;
    });

    publications.forEach((pub, idx) => {
      const pKey = pub.id || `p_${idx}`;
      if (pub.title) textsToTranslate[`pub_${pKey}_title`] = pub.title;
      if (pub.description) textsToTranslate[`pub_${pKey}_desc`] = pub.description;
    });

    if (Object.keys(textsToTranslate).length === 0) {
      return { success: false, message: "Թարգմանության համար որևէ տեքստ չգտնվեց:" };
    }

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLangs: ["en", "ru"],
        sourceLang: "hy",
        context: `Civilization worldview, think tanks, thinkers and publications for ID: ${civId}`,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to translate civilization with AI");
    }

    // 1. Unpack civilization translations
    const civTranslations: Record<string, Record<string, string>> = { en: {}, ru: {} };
    for (const lang of ["en", "ru"] as const) {
      civTranslations[lang] = {
        _isAiTranslated: "true",
        _translatedAt: new Date().toISOString(),
      };
      for (const key of translatableKeys) {
        if (result.translations?.[lang]?.[key]) {
          civTranslations[lang][key] = result.translations[lang][key];
        }
      }
    }
    await updateCivilizationTranslations(civId, civTranslations);

    // 2. Unpack and save centers translations
    for (const center of centers) {
      if (!center.id) continue;
      const cKey = center.id;
      const centerTrans: Record<string, Record<string, string>> = { en: {}, ru: {} };
      for (const lang of ["en", "ru"] as const) {
        const langObj = result.translations?.[lang] || {};
        const fields: Record<string, string> = {};
        if (langObj[`ctr_${cKey}_name`]) fields.name = langObj[`ctr_${cKey}_name`];
        if (langObj[`ctr_${cKey}_desc`]) fields.description = langObj[`ctr_${cKey}_desc`];
        if (langObj[`ctr_${cKey}_city`]) fields.city = langObj[`ctr_${cKey}_city`];
        if (langObj[`ctr_${cKey}_country`]) fields.country = langObj[`ctr_${cKey}_country`];
        if (Object.keys(fields).length > 0) {
          centerTrans[lang] = {
            ...fields,
            _isAiTranslated: "true",
            _translatedAt: new Date().toISOString(),
          };
        }
      }
      if (Object.keys(centerTrans.en).length > 0 || Object.keys(centerTrans.ru).length > 0) {
        const centerRef = doc(db, "civilizations", civId, "centers", center.id);
        await setDoc(
          centerRef,
          cleanFirestoreData({
            ...center,
            id: center.id,
            translations: centerTrans,
            updatedAt: new Date().toISOString(),
          }),
          { merge: true }
        );
      }
    }

    // 3. Unpack and save authors translations
    for (const author of authors) {
      if (!author.id) continue;
      const aKey = author.id;
      const authorTrans: Record<string, Record<string, string>> = { en: {}, ru: {} };
      for (const lang of ["en", "ru"] as const) {
        const langObj = result.translations?.[lang] || {};
        const fields: Record<string, string> = {};
        if (langObj[`auth_${aKey}_name`]) fields.name = langObj[`auth_${aKey}_name`];
        if (langObj[`auth_${aKey}_title`]) fields.title = langObj[`auth_${aKey}_title`];
        if (langObj[`auth_${aKey}_bio`]) fields.bio = langObj[`auth_${aKey}_bio`];
        if (langObj[`auth_${aKey}_quote`]) fields.quote = langObj[`auth_${aKey}_quote`];
        if (Object.keys(fields).length > 0) {
          authorTrans[lang] = {
            ...fields,
            _isAiTranslated: "true",
            _translatedAt: new Date().toISOString(),
          };
        }
      }
      if (Object.keys(authorTrans.en).length > 0 || Object.keys(authorTrans.ru).length > 0) {
        const authorRef = doc(db, "civilizations", civId, "authors", author.id);
        await setDoc(
          authorRef,
          cleanFirestoreData({
            ...author,
            id: author.id,
            translations: authorTrans,
            updatedAt: new Date().toISOString(),
          }),
          { merge: true }
        );
      }
    }

    // 4. Unpack and save publications translations
    for (const pub of publications) {
      if (!pub.id) continue;
      const pKey = pub.id;
      const pubTrans: Record<string, Record<string, string>> = { en: {}, ru: {} };
      for (const lang of ["en", "ru"] as const) {
        const langObj = result.translations?.[lang] || {};
        const fields: Record<string, string> = {};
        if (langObj[`pub_${pKey}_title`]) fields.title = langObj[`pub_${pKey}_title`];
        if (langObj[`pub_${pKey}_desc`]) fields.description = langObj[`pub_${pKey}_desc`];
        if (Object.keys(fields).length > 0) {
          pubTrans[lang] = {
            ...fields,
            _isAiTranslated: "true",
            _translatedAt: new Date().toISOString(),
          };
        }
      }
      if (Object.keys(pubTrans.en).length > 0 || Object.keys(pubTrans.ru).length > 0) {
        const pubRef = doc(db, "civilizations", civId, "publications", pub.id);
        await setDoc(
          pubRef,
          cleanFirestoreData({
            ...pub,
            id: pub.id,
            translations: pubTrans,
            updatedAt: new Date().toISOString(),
          }),
          { merge: true }
        );
      }
    }

    return {
      success: true,
      message: "✓ Քաղաքակրթության հաբը (տվյալներ, կենտրոններ, հեղինակներ, աշխատություններ) թարգմանվեց EN & RU և պահպանվեց:",
      translations: civTranslations,
    };
  } catch (error: any) {
    console.error("translateCivilizationWithAi error:", error);
    return {
      success: false,
      message: `Translation failed: ${error.message || String(error)}`,
    };
  }
}

/**
 * Translates an Author / Thinker (name, title, bio, quote) with AI and saves to Firestore.
 */
export async function translateAuthorWithAi(
  civId: string,
  author: Thinker
): Promise<{ success: boolean; message: string; translations?: any }> {
  try {
    const textsToTranslate: Record<string, string> = {};
    if (author.name) textsToTranslate.name = author.name;
    if (author.title) textsToTranslate.title = author.title;
    if (author.bio) textsToTranslate.bio = author.bio;
    if (author.quote) textsToTranslate.quote = author.quote;

    if (Object.keys(textsToTranslate).length === 0) {
      return { success: false, message: "Թարգմանության համար որևէ տեքստ չգտնվեց:" };
    }

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLangs: ["en", "ru"],
        sourceLang: "hy",
        context: `Thinker / Philosopher profile: ${author.name}`,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to translate author");
    }

    const authorRef = doc(db, "civilizations", civId, "authors", author.id);
    await setDoc(
      authorRef,
      cleanFirestoreData({
        ...author,
        id: author.id,
        translations: result.translations,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );

    return {
      success: true,
      message: "✓ Հեղինակի տվյալները թարգմանվեցին և պահպանվեցին:",
      translations: result.translations,
    };
  } catch (error: any) {
    return { success: false, message: error.message || String(error) };
  }
}

/**
 * Translates a Center / Think Tank (name, description, city, country) with AI and saves to Firestore.
 */
export async function translateCenterWithAi(
  civId: string,
  center: ThinkTank
): Promise<{ success: boolean; message: string; translations?: any }> {
  try {
    const textsToTranslate: Record<string, string> = {};
    if (center.name) textsToTranslate.name = center.name;
    if (center.description) textsToTranslate.description = center.description;
    if (center.city) textsToTranslate.city = center.city;
    if (center.country) textsToTranslate.country = center.country;

    if (Object.keys(textsToTranslate).length === 0) {
      return { success: false, message: "Թարգմանության համար որևէ տեքստ չգտնվեց:" };
    }

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLangs: ["en", "ru"],
        sourceLang: "hy",
        context: `Think Tank / Research Center: ${center.name}`,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to translate center");
    }

    const centerRef = doc(db, "civilizations", civId, "centers", center.id);
    await setDoc(
      centerRef,
      cleanFirestoreData({
        ...center,
        id: center.id,
        translations: result.translations,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );

    return {
      success: true,
      message: "✓ Կենտրոնի տվյալները թարգմանվեցին և պահպանվեցին:",
      translations: result.translations,
    };
  } catch (error: any) {
    return { success: false, message: error.message || String(error) };
  }
}

/**
 * Translates a Publication (title, description) with AI and saves to Firestore.
 */
export async function translatePublicationWithAi(
  civId: string,
  pub: Publication
): Promise<{ success: boolean; message: string; translations?: any }> {
  try {
    const textsToTranslate: Record<string, string> = {};
    if (pub.title) textsToTranslate.title = pub.title;
    if (pub.description) textsToTranslate.description = pub.description;

    if (Object.keys(textsToTranslate).length === 0) {
      return { success: false, message: "No translatable text found for this publication." };
    }

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: textsToTranslate,
        targetLangs: ["en", "ru"],
        sourceLang: "hy",
        context: `Scholarly publication: ${pub.title}`,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to translate publication");
    }

    const pubId = pub.id || `pub-${Date.now()}`;
    const pubRef = doc(db, "civilizations", civId, "publications", pubId);
    await setDoc(
      pubRef,
      cleanFirestoreData({
        translations: result.translations,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );

    return {
      success: true,
      message: "✓ Publication translated and saved to Firestore!",
      translations: result.translations,
    };
  } catch (error: any) {
    return { success: false, message: error.message || String(error) };
  }
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
  centerId?: string
): Promise<{ center: ThinkTank; civ: Civilization } | undefined> {
  if (!centerId || typeof centerId !== "string") {
    return undefined;
  }
  const local = findCenterById(centerId);
  const civId = local?.civ.id;

  if (civId) {
    try {
      const docRef = doc(db, "civilizations", civId, "centers", centerId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const fullCiv = await getCivilizationContent(civId);
        const data = snap.data();
        const mergedCenter: ThinkTank = {
          ...(local?.center || {}),
          ...data,
          id: data.id || local?.center?.id || centerId,
          name: data.name || local?.center?.name || "",
        };
        return {
          center: mergedCenter,
          civ: fullCiv || local?.civ || civilizationsData[0],
        };
      }
    } catch (e) {
      console.warn(`Firestore center ${centerId} fetch failed, using fallback:`, e);
    }
  }

  // Check directly across all 8 civilizations' centers subcollections
  try {
    const civChecks = await Promise.all(
      civilizationsData.map(async (c) => {
        try {
          const docRef = doc(db, "civilizations", c.id, "centers", centerId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            return { snap, civId: c.id };
          }
        } catch {
          // ignore
        }
        return null;
      })
    );
    const foundDirect = civChecks.find((res) => res !== null);
    if (foundDirect) {
      const fullCiv = await getCivilizationContent(foundDirect.civId);
      const data = foundDirect.snap.data() as ThinkTank;
      return {
        center: {
          ...(local?.center || {}),
          ...data,
          id: data.id || foundDirect.snap.id || centerId,
          name: data.name || local?.center?.name || "",
        },
        civ: fullCiv || civilizationsData.find((c) => c.id === foundDirect.civId) || civilizationsData[0],
      };
    }
  } catch (e) {
    console.warn("Direct civs search for center failed:", e);
  }

  // Query collectionGroup to find center anywhere in Firestore
  try {
    const q = query(collectionGroup(db, "centers"), where("id", "==", centerId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      const firestoreCenter = docSnap.data() as ThinkTank;
      const parentCivId = docSnap.ref.parent.parent?.id || (firestoreCenter as any).civId || "arm";
      const fullCiv = await getCivilizationContent(parentCivId);
      const resolvedCiv = fullCiv || civilizationsData.find((c) => c.id === parentCivId) || civilizationsData[0];
      return {
        center: {
          ...(local?.center || {}),
          ...firestoreCenter,
          id: firestoreCenter.id || docSnap.id || centerId,
          name: firestoreCenter.name || local?.center?.name || "",
        },
        civ: resolvedCiv,
      };
    }
  } catch (e) {
    console.warn(`collectionGroup query for center ${centerId} failed:`, e);
  }

  // Search all civilizations if not found directly
  try {
    const allCivs = await getAllCivilizationsContent();
    for (const c of allCivs) {
      const found = c.centers?.find((ct) => ct.id && ct.id.toLowerCase() === centerId.toLowerCase());
      if (found) {
        return { center: { ...found, id: found.id || centerId }, civ: c };
      }
    }
  } catch (e) {
    console.warn("Global search for center failed:", e);
  }

  return local ? { ...local, center: { ...local.center, id: local.center.id || centerId } } : undefined;
}

/**
 * Reads a single author and their parent civilization
 */
export async function getAuthorContent(
  authorId?: string
): Promise<{ author: Thinker; civ: Civilization } | undefined> {
  if (!authorId || typeof authorId !== "string") {
    return undefined;
  }
  const local = findAuthorById(authorId);
  const civId = local?.civ.id;

  if (civId) {
    try {
      const docRef = doc(db, "civilizations", civId, "authors", authorId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const fullCiv = await getCivilizationContent(civId);
        const data = snap.data();
        const mergedAuthor: Thinker = {
          ...(local?.author || {}),
          ...data,
          id: data.id || local?.author?.id || authorId,
          name: data.name || local?.author?.name || "",
        };
        return {
          author: mergedAuthor,
          civ: fullCiv || local?.civ || civilizationsData[0],
        };
      }
    } catch (e) {
      console.warn(`Firestore author ${authorId} fetch failed, using fallback:`, e);
    }
  }

  // Check directly across all 8 civilizations' author subcollections
  try {
    const civChecks = await Promise.all(
      civilizationsData.map(async (c) => {
        try {
          const docRef = doc(db, "civilizations", c.id, "authors", authorId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            return { snap, civId: c.id };
          }
        } catch {
          // ignore
        }
        return null;
      })
    );
    const foundDirect = civChecks.find((res) => res !== null);
    if (foundDirect) {
      const fullCiv = await getCivilizationContent(foundDirect.civId);
      const data = foundDirect.snap.data() as Thinker;
      return {
        author: {
          ...(local?.author || {}),
          ...data,
          id: data.id || foundDirect.snap.id || authorId,
          name: data.name || local?.author?.name || "",
        },
        civ: fullCiv || civilizationsData.find((c) => c.id === foundDirect.civId) || civilizationsData[0],
      };
    }
  } catch (e) {
    console.warn("Direct civs search for author failed:", e);
  }

  // Query collectionGroup to find author anywhere in Firestore
  try {
    const q = query(collectionGroup(db, "authors"), where("id", "==", authorId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      const firestoreAuthor = docSnap.data() as Thinker;
      const parentCivId = docSnap.ref.parent.parent?.id || (firestoreAuthor as any).civId || "arm";
      const fullCiv = await getCivilizationContent(parentCivId);
      const resolvedCiv = fullCiv || civilizationsData.find((c) => c.id === parentCivId) || civilizationsData[0];
      return {
        author: {
          ...(local?.author || {}),
          ...firestoreAuthor,
          id: firestoreAuthor.id || docSnap.id || authorId,
          name: firestoreAuthor.name || local?.author?.name || "",
        },
        civ: resolvedCiv,
      };
    }
  } catch (e) {
    console.warn(`collectionGroup query for author ${authorId} failed:`, e);
  }

  // Search all civilizations if not found directly
  try {
    const allCivs = await getAllCivilizationsContent();
    for (const c of allCivs) {
      const found = c.authors?.find((a) => a.id && a.id.toLowerCase() === authorId.toLowerCase());
      if (found) {
        return { author: { ...found, id: found.id || authorId }, civ: c };
      }
      if (c.centers) {
        for (const center of c.centers) {
          const centerAuthor = center.authors?.find((a) => a.id && a.id.toLowerCase() === authorId.toLowerCase());
          if (centerAuthor) {
            return { author: { ...centerAuthor, id: centerAuthor.id || authorId }, civ: c };
          }
        }
      }
    }
  } catch (e) {
    console.warn("Global search for author failed:", e);
  }

  return local ? { ...local, author: { ...local.author, id: local.author.id || authorId } } : undefined;
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

