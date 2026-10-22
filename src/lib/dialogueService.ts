import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { DialogueTopicItem, DialogueComment, SiteNotification, TopicExpertOpinion } from "@/types/dialogue";
import { ExpertResponse } from "@/types/content";
import { defaultDialogueContent } from "./defaultSiteContent";

export const defaultTopics: DialogueTopicItem[] = [

  {
    id: "topic-12",
    number: "ՀԱՐՑԱԴՐՈՒՄ #12",
    date: "2026թ. ԱՇՈՒՆ",
    title: "Թվային անթրոպոցիդ. Ինչպե՞ս պաշտպանել ավանդական արժեքները AI դարաշրջանում",
    description:
      "Արհեստական բանականության սրընթաց զարգացումը ստեղծում է մարդակենտրոն արժեքների ոչնչացման վտանգ։ Կազմկոմիտեն հրավիրում է մտածողներին գտնել հավասարակշռության նոր բանաձևեր և քաղաքակրթական զսպաշապիկներ։",
    civilizationTag: "Համաշխարհային Էթիկա & AI",
    centerId: "matenadaran",
    centerName: "Մատենադարան",
    status: "active",
    createdAt: "2026-09-01T12:00:00.000Z",
    authorName: "Արարատյան Կենտրոն",
    authorRole: "super-admin",
    commentsCount: 3,
    expertResponses: defaultDialogueContent.expertResponses,
  },
  {
    id: "topic-11",
    number: "ՀԱՐՑԱԴՐՈՒՄ #11",
    date: "2026թ. ԳԱՐՈՒՆ",
    title: "Բազմաբևեռ աշխարհի ճարտարապետությունը և Արդար Աշխարհակարգը",
    description:
      "Գլոբալիզացիայի ճգնաժամը և ինքնիշխան քաղաքակրթությունների վերելքը. ինչպիսի՞ն պետք է լինի ուժերի, արժեքների և հոգևոր կոդերի նոր հավասարակշռությունը։",
    civilizationTag: "Քաղաքական Փիլիսոփայություն",
    centerId: "cass",
    centerName: "ՉՀԳԱ (CASS)",
    status: "active",
    createdAt: "2026-04-10T10:00:00.000Z",
    authorName: "Արարատյան Կենտրոն",
    authorRole: "admin",
    commentsCount: 1,
    expertResponses: [
      {
        id: "exp-11-1",
        name: "Ալեքսանդր Դուգին",
        civilization: "Ռուսական Ուղղափառ քաղաքակրթություն",
        quote: "«Բազմաբևեռ աշխարհը պահանջում է քաղաքակրթությունների գոյաբանական ինքնիշխանություն և սրբազան ավանդույթների հարգում։»",
      },
    ],
  },
  {
    id: "topic-10",
    number: "ՀԱՐՑԱԴՐՈՒՄ #10",
    date: "2025թ. ՁՄԵՌ",
    title: "Ավանդույթ և Մոդեռնիզմ. Սրբազանի վերադարձը հետաշխարհիկ հասարակություններում",
    description:
      "Արդյո՞ք արդիականությունը սպառել է ապասրբացնող իր ներուժը, և որտե՞ղ է սահմանը հոգևոր ժառանգության պահպանման և տեխնոլոգիական առաջընթացի միջև։",
    civilizationTag: "Հոգևոր Ժառանգություն",
    status: "archived",
    createdAt: "2025-12-05T09:00:00.000Z",
    authorName: "Արարատյան Կենտրոն",
    authorRole: "admin",
    commentsCount: 0,
  },
];

export const defaultComments: DialogueComment[] = [
  {
    id: "comm-1",
    topicId: "topic-12",
    parentId: null,
    authorName: "Դոկտոր Ա. Գրիգորյան (ԵՊՀ)",
    authorRole: "scholar",
    authorAffiliation: "ԵՊՀ Փիլիսոփայության ֆակուլտետ",
    text: "Կարևոր է ձևավորել ազգային AI էթիկայի չափորոշիչներ, որոնք հիմնված կլինեն մեր քաղաքակրթական ակունքների վրա։",
    createdAt: "2026-09-15T10:30:00.000Z",
  },
  {
    id: "comm-2",
    topicId: "topic-12",
    parentId: "comm-1",
    authorName: "Վարդան Մկրտչյան",
    authorRole: "member",
    text: "Համաձայն եմ Ձեզ հետ, դոկտոր։ Առանց հոգևոր զսպիչների, տեխնոկրատիան կարող է վերածվել անկառավարելի մենաշնորհի։",
    createdAt: "2026-09-15T14:20:00.000Z",
  },
  {
    id: "comm-3",
    topicId: "topic-12",
    parentId: null,
    authorName: "Արմեն Շահնազարյան",
    authorRole: "scholar",
    text: "Եվրոպական և արևելյան մոտեցումների համադրումը կարող է տալ այն ոսկե միջինը, որը կպաշտպանի անձի արժանապատվությունը։",
    createdAt: "2026-09-16T09:10:00.000Z",
  },
  {
    id: "comm-4",
    topicId: "topic-11",
    parentId: null,
    authorName: "Գարեգին Պետրոսյան",
    authorRole: "scholar",
    text: "Հայկական լեռնաշխարհը պատմականորեն եղել է հենց այդ բազմաբևեռության կապող օղակը։",
    createdAt: "2026-04-12T16:40:00.000Z",
  },
];

// ----------------------------------------------------
// LOCAL STORAGE CACHE HELPERS (Offline & Mock Support)
// ----------------------------------------------------

const LOCAL_TOPICS_KEY = "ararat_dialogue_topics";
const LOCAL_COMMENTS_KEY = "ararat_dialogue_comments";

function getLocalTopics(): DialogueTopicItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalTopic(topic: DialogueTopicItem): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalTopics().filter((t) => t.id !== topic.id);
    localStorage.setItem(LOCAL_TOPICS_KEY, JSON.stringify([topic, ...list]));
  } catch {
    // ignore
  }
}

function removeLocalTopic(topicId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalTopics().filter((t) => t.id !== topicId);
    localStorage.setItem(LOCAL_TOPICS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

function getAllLocalComments(): DialogueComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getLocalComments(topicId: string): DialogueComment[] {
  return getAllLocalComments().filter((c) => c.topicId === topicId);
}

function saveLocalComment(comment: DialogueComment): void {
  if (typeof window === "undefined") return;
  try {
    const list = getAllLocalComments().filter((c) => c.id !== comment.id);
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify([...list, comment]));
  } catch {
    // ignore
  }
}

function removeLocalComment(commentId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getAllLocalComments().filter(
      (c) => c.id !== commentId && c.parentId !== commentId
    );
    localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

const LOCAL_NOTIFICATIONS_KEY = "ararat_site_notifications";

export function getAllLocalNotifications(): SiteNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getUserLocalNotifications(userId: string): SiteNotification[] {
  return getAllLocalNotifications().filter((n) => n.userId === userId);
}

export function saveLocalNotification(notif: SiteNotification): void {
  if (typeof window === "undefined") return;
  try {
    const list = getAllLocalNotifications().filter((n) => n.id !== notif.id);
    localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify([notif, ...list]));
  } catch {
    // ignore
  }
}

export function updateLocalNotification(
  notifId: string,
  partial: Partial<SiteNotification>
): void {
  if (typeof window === "undefined") return;
  try {
    const list = getAllLocalNotifications().map((n) =>
      n.id === notifId ? { ...n, ...partial } : n
    );
    localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function markAllLocalNotificationsAsRead(
  userId: string,
  notifIds: string[]
): void {
  if (typeof window === "undefined") return;
  try {
    const idSet = new Set(notifIds);
    const list = getAllLocalNotifications().map((n) =>
      n.userId === userId && idSet.has(n.id) ? { ...n, isRead: true } : n
    );
    localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

const LOCAL_EXPERT_OPINIONS_KEY = "ararat_dialogue_expert_opinions";

export function getAllLocalExpertOpinions(): TopicExpertOpinion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_EXPERT_OPINIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getLocalExpertOpinions(topicId: string): TopicExpertOpinion[] {
  return getAllLocalExpertOpinions().filter((op) => op.topicId === topicId);
}

export function saveLocalExpertOpinion(op: TopicExpertOpinion): void {
  if (typeof window === "undefined") return;
  try {
    const list = getAllLocalExpertOpinions().filter((o) => o.id !== op.id);
    localStorage.setItem(LOCAL_EXPERT_OPINIONS_KEY, JSON.stringify([...list, op]));
  } catch {
    // ignore
  }
}

export function removeLocalExpertOpinion(opinionId: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getAllLocalExpertOpinions().filter((o) => o.id !== opinionId);
    localStorage.setItem(LOCAL_EXPERT_OPINIONS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

// ----------------------------------------------------
// FIRESTORE COLLECTIONS & SUBCOLLECTIONS
// ----------------------------------------------------
export const DIALOGUES_COLLECTION = "dialogues";
export const COMMENTS_SUBCOLLECTION = "comments";
export const EXPERT_OPINIONS_SUBCOLLECTION = "expert_opinions";
export const LEGACY_TOPICS_COLLECTION = "dialogue_topics";
export const LEGACY_COMMENTS_COLLECTION = "dialogue_comments";


// ----------------------------------------------------
// 1. TOPICS & DIALOGUES API
// ----------------------------------------------------

/**
 * Fetches all topics/dialogues from Firestore (dialogues collection), merges with local cache and defaultTopics
 */
export async function getDialogueTopics(): Promise<DialogueTopicItem[]> {
  const localList = getLocalTopics();

  try {
    const topicsRef = collection(db, DIALOGUES_COLLECTION);
    const q = query(topicsRef, orderBy("createdAt", "desc"));
    let snap = await getDocs(q);

    // If 'dialogues' collection is empty, check legacy 'dialogue_topics'
    if (snap.empty) {
      try {
        const legacyRef = collection(db, LEGACY_TOPICS_COLLECTION);
        const legacyQ = query(legacyRef, orderBy("createdAt", "desc"));
        const legacySnap = await getDocs(legacyQ);
        if (!legacySnap.empty) {
          snap = legacySnap;
        }
      } catch {
        // ignore legacy error
      }
    }

    if (!snap.empty) {
      const firestoreList: DialogueTopicItem[] = [];
      snap.forEach((docSnap) => {
        firestoreList.push({ id: docSnap.id, ...(docSnap.data() as Omit<DialogueTopicItem, "id">) });
      });

      const localComments = getAllLocalComments();
      const localExperts = getAllLocalExpertOpinions();
      return firestoreList
        .map((t) => {
          const topicLocalCount = localComments.filter((c) => c.topicId === t.id).length;
          const topicDefCount = defaultComments.filter((c) => c.topicId === t.id).length;
          const topicLocalExperts = localExperts.filter((e) => e.topicId === t.id).length;
          const topicDefExperts = t.expertResponses?.length || 0;
          return {
            ...t,
            commentsCount: Math.max(t.commentsCount || 0, topicLocalCount, topicDefCount),
            expertOpinionsCount: Math.max(t.expertOpinionsCount || 0, topicLocalExperts, topicDefExperts),
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.warn("Could not fetch dialogues from Firestore, using local/default:", err);
  }

  const mergedMap = new Map<string, DialogueTopicItem>();
  defaultTopics.forEach((t) => mergedMap.set(t.id, t));
  localList.forEach((t) => mergedMap.set(t.id, t));

  const localComments = getAllLocalComments();
  const localExperts = getAllLocalExpertOpinions();
  return Array.from(mergedMap.values())
    .map((t) => {
      const topicLocalCount = localComments.filter((c) => c.topicId === t.id).length;
      const topicDefCount = defaultComments.filter((c) => c.topicId === t.id).length;
      const topicLocalExperts = localExperts.filter((e) => e.topicId === t.id).length;
      const topicDefExperts = t.expertResponses?.length || 0;
      return {
        ...t,
        commentsCount: Math.max(t.commentsCount || 0, topicLocalCount, topicDefCount),
        expertOpinionsCount: Math.max(t.expertOpinionsCount || 0, topicLocalExperts, topicDefExperts),
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Fetches a single topic/dialogue by ID from Firestore (dialogues or legacy dialogue_topics), local storage, or defaults
 */
export async function getDialogueTopicById(
  topicId: string
): Promise<DialogueTopicItem | null> {
  let found: DialogueTopicItem | null = null;
  try {
    const docRef = doc(db, DIALOGUES_COLLECTION, topicId);
    let snap = await getDoc(docRef);
    if (!snap.exists()) {
      // Fallback check in legacy 'dialogue_topics'
      const legacyRef = doc(db, LEGACY_TOPICS_COLLECTION, topicId);
      const legacySnap = await getDoc(legacyRef);
      if (legacySnap.exists()) {
        snap = legacySnap;
      }
    }
    if (snap.exists()) {
      found = { id: snap.id, ...(snap.data() as Omit<DialogueTopicItem, "id">) };
    }
  } catch (err) {
    console.warn(`Could not fetch dialogue ${topicId} from Firestore:`, err);
  }

  // Fallback to local storage cache
  if (!found) {
    const localList = getLocalTopics();
    const foundLocal = localList.find((t) => t.id === topicId);
    if (foundLocal) found = foundLocal;
  }

  // Fallback to default topics
  if (!found) {
    const foundDefault = defaultTopics.find((t) => t.id === topicId);
    if (foundDefault) found = foundDefault;
  }

  if (found) {
    const localComments = getAllLocalComments();
    const topicLocalCount = localComments.filter((c) => c.topicId === found.id).length;
    const topicDefCount = defaultComments.filter((c) => c.topicId === found.id).length;
    const localExperts = getLocalExpertOpinions(found.id);
    const defExpertsCount = found.expertResponses?.length || 0;
    return {
      ...found,
      commentsCount: Math.max(found.commentsCount || 0, topicLocalCount, topicDefCount),
      expertOpinionsCount: Math.max(found.expertOpinionsCount || 0, localExperts.length, defExpertsCount),
    };
  }

  return null;
}

/**
 * Creates a new dialogue topic in 'dialogues' collection (Admin only)
 */
export async function createDialogueTopic(
  topicData: Omit<DialogueTopicItem, "id" | "createdAt" | "commentsCount">
): Promise<DialogueTopicItem> {
  const newId = `topic-${Date.now()}`;
  const now = new Date().toISOString();

  const newTopic: DialogueTopicItem = {
    ...topicData,
    id: newId,
    createdAt: now,
    commentsCount: 0,
  };

  // Build clean payload without any undefined values
  const firestoreData: Record<string, any> = {
    id: newId,
    number: newTopic.number || `ՀԱՐՑԱԴՐՈՒՄ #${Date.now()}`,
    title: newTopic.title,
    description: newTopic.description,
    date: newTopic.date || new Date().toLocaleDateString("hy-AM"),
    status: newTopic.status || "active",
    createdAt: now,
    commentsCount: 0,
    authorName: newTopic.authorName || "Ադմին",
  };
  if (newTopic.civilizationTag) firestoreData.civilizationTag = newTopic.civilizationTag;
  if (newTopic.centerId) firestoreData.centerId = newTopic.centerId;
  if (newTopic.centerName) firestoreData.centerName = newTopic.centerName;
  if (newTopic.authorUid) firestoreData.authorUid = newTopic.authorUid;
  if (newTopic.authorRole) firestoreData.authorRole = newTopic.authorRole;
  if (newTopic.authorEmail) firestoreData.authorEmail = newTopic.authorEmail;

  try {
    const docRef = doc(db, DIALOGUES_COLLECTION, newId);
    await setDoc(docRef, firestoreData);
  } catch (err) {
    console.warn("Error creating dialogue in Firestore, cached locally:", err);
  }

  saveLocalTopic(newTopic);
  return newTopic;
}

/**
 * Updates an existing dialogue topic (Admin only)
 */
export async function updateDialogueTopic(
  topicId: string,
  partialData: Partial<DialogueTopicItem>
): Promise<void> {
  const cleanData: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };
  for (const [key, val] of Object.entries(partialData)) {
    if (val !== undefined) cleanData[key] = val;
  }

  try {
    const docRef = doc(db, DIALOGUES_COLLECTION, topicId);
    await updateDoc(docRef, cleanData);
  } catch (err) {
    // If updating in dialogues fails, attempt legacy dialogue_topics update
    try {
      const legacyRef = doc(db, LEGACY_TOPICS_COLLECTION, topicId);
      await updateDoc(legacyRef, cleanData);
    } catch {
      console.warn("Could not update dialogue in Firestore:", err);
    }
  }

  // Update local cache
  const localList = getLocalTopics();
  const existing = localList.find((t) => t.id === topicId) || defaultTopics.find((t) => t.id === topicId);
  if (existing) {
    saveLocalTopic({ ...existing, ...partialData });
  }
}

/**
 * Approves a pending topic (Admin only)
 * Sets status to "active" and notifies the author
 */
export async function approveDialogueTopic(
  topicId: string,
  adminName?: string
): Promise<void> {
  const topic = await getDialogueTopicById(topicId);
  await updateDialogueTopic(topicId, { status: "active" });

  if (topic?.authorUid) {
    try {
      await createNotification({
        userId: topic.authorUid,
        type: "topic_approved",
        topicId: topic.id,
        topicTitle: topic.title,
        commentId: "",
        senderName: adminName || "Ադմինիստրատոր",
        senderRole: "admin",
        textSnippet: `Ձեր առաջարկած «${topic.title}» հարցադրումը հաստատվել է և հրապարակվել հարթակում։`,
      });
    } catch (e) {
      console.warn("Could not send approval notification:", e);
    }
  }
}

/**
 * Rejects a pending topic (Admin only)
 * Sets status to "rejected" and notifies the author
 */
export async function rejectDialogueTopic(
  topicId: string,
  reason?: string,
  adminName?: string
): Promise<void> {
  const topic = await getDialogueTopicById(topicId);
  await updateDialogueTopic(topicId, { status: "rejected" });

  if (topic?.authorUid) {
    try {
      await createNotification({
        userId: topic.authorUid,
        type: "topic_rejected",
        topicId: topic.id,
        topicTitle: topic.title,
        commentId: "",
        senderName: adminName || "Ադմինիստրատոր",
        senderRole: "admin",
        textSnippet: `Ձեր առաջարկած «${topic.title}» հարցադրումը չի հաստատվել${reason ? ` (${reason})` : ""}։`,
      });
    } catch (e) {
      console.warn("Could not send rejection notification:", e);
    }
  }
}

/**
 * Deletes a topic and its comments subcollection (Admin only)
 */
export async function deleteDialogueTopic(topicId: string): Promise<void> {
  try {
    // 1. Delete all comments in subcollection: dialogues/{topicId}/comments
    try {
      const commentsRef = collection(db, DIALOGUES_COLLECTION, topicId, COMMENTS_SUBCOLLECTION);
      const commentsSnap = await getDocs(commentsRef);
      const deletePromises = commentsSnap.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
    } catch (subErr) {
      console.warn("Could not delete comments subcollection:", subErr);
    }

    // 1b. Delete all expert opinions in subcollection: dialogues/{topicId}/expert_opinions
    try {
      const expRef = collection(db, DIALOGUES_COLLECTION, topicId, EXPERT_OPINIONS_SUBCOLLECTION);
      const expSnap = await getDocs(expRef);
      const deleteExpPromises = expSnap.docs.map((docSnap) => deleteDoc(docSnap.ref));
      await Promise.all(deleteExpPromises);
    } catch (subErr) {
      console.warn("Could not delete expert_opinions subcollection:", subErr);
    }

    // 2. Also delete from legacy dialogue_comments if any exist

    try {
      const legacyCommRef = collection(db, LEGACY_COMMENTS_COLLECTION);
      const legacyQ = query(legacyCommRef, where("topicId", "==", topicId));
      const legacySnap = await getDocs(legacyQ);
      await Promise.all(legacySnap.docs.map((d) => deleteDoc(d.ref)));
    } catch {
      // ignore
    }

    // 3. Delete the dialogue document itself from 'dialogues'
    const docRef = doc(db, DIALOGUES_COLLECTION, topicId);
    await deleteDoc(docRef);

    // Also clean up legacy dialogue_topics if existed
    try {
      await deleteDoc(doc(db, LEGACY_TOPICS_COLLECTION, topicId));
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn("Could not delete dialogue from Firestore:", err);
  }

  removeLocalTopic(topicId);
}

// ----------------------------------------------------
// 2. COMMENTS & REPLIES API (SUBCOLLECTION)
// ----------------------------------------------------

/**
 * Fetches all comments for a specific dialogue topic from its subcollection dialogues/{topicId}/comments
 * (merging Firestore, local cache, and default)
 */
export async function getTopicComments(topicId: string): Promise<DialogueComment[]> {
  const localList = getLocalComments(topicId);
  const defaultList = defaultComments.filter((c) => c.topicId === topicId);

  try {
    // 1. Check subcollection: dialogues/{topicId}/comments
    const commRef = collection(db, DIALOGUES_COLLECTION, topicId, COMMENTS_SUBCOLLECTION);
    let snap: any;
    try {
      const q = query(commRef, orderBy("createdAt", "asc"));
      snap = await getDocs(q);
    } catch {
      // fallback without orderBy in case composite index isn't needed
      snap = await getDocs(commRef);
    }

    let firestoreList: DialogueComment[] = [];
    if (!snap.empty) {
      snap.forEach((d: any) => {
        firestoreList.push({ id: d.id, ...(d.data() as Omit<DialogueComment, "id">) });
      });
    } else {
      // 2. Check legacy root collection 'dialogue_comments' for backward compatibility
      try {
        const legacyRef = collection(db, LEGACY_COMMENTS_COLLECTION);
        const legacyQ = query(legacyRef, where("topicId", "==", topicId));
        const legacySnap = await getDocs(legacyQ);
        legacySnap.forEach((d) => {
          firestoreList.push({ id: d.id, ...(d.data() as Omit<DialogueComment, "id">) });
        });
      } catch {
        // ignore legacy error
      }
    }

    if (firestoreList.length > 0) {
      const mergedMap = new Map<string, DialogueComment>();
      defaultList.forEach((c) => mergedMap.set(c.id, c));
      localList.forEach((c) => mergedMap.set(c.id, c));
      firestoreList.forEach((c) => mergedMap.set(c.id, c));

      return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
  } catch (err) {
    console.warn(`Could not fetch comments from Firestore for dialogue ${topicId}, using fallback:`, err);
  }

  const mergedMap = new Map<string, DialogueComment>();
  defaultList.forEach((c) => mergedMap.set(c.id, c));
  localList.forEach((c) => mergedMap.set(c.id, c));

  return Array.from(mergedMap.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/**
 * Adds a new comment or reply into the subcollection: dialogues/{topicId}/comments/{commentId}
 * Completely sanitized of undefined values so Firestore never throws!
 */
export async function addDialogueComment(
  commentData: Omit<DialogueComment, "id" | "createdAt">,
  meta?: {
    topicTitle?: string;
    topicAuthorUid?: string;
    parentAuthorUid?: string;
  }
): Promise<DialogueComment> {
  const newId = `comm-${Date.now()}`;
  const now = new Date().toISOString();

  // Build clean payload for Firestore with ZERO undefined properties
  const firestoreData: Record<string, any> = {
    id: newId,
    topicId: commentData.topicId,
    parentId: commentData.parentId || null,
    authorName: commentData.authorName || "Անդամ",
    authorRole: commentData.authorRole || "guest",
    text: commentData.text,
    createdAt: now,
  };
  if (commentData.authorUid) firestoreData.authorUid = commentData.authorUid;
  if (commentData.authorEmail) firestoreData.authorEmail = commentData.authorEmail;
  if (commentData.authorAffiliation) firestoreData.authorAffiliation = commentData.authorAffiliation;
  if (commentData.civilizationAffiliation)
    firestoreData.civilizationAffiliation = commentData.civilizationAffiliation;

  const newComment: DialogueComment = {
    id: newId,
    topicId: commentData.topicId,
    parentId: commentData.parentId || null,
    authorName: commentData.authorName || "Անդամ",
    authorRole: commentData.authorRole || "guest",
    text: commentData.text,
    createdAt: now,
  };
  if (commentData.authorUid) newComment.authorUid = commentData.authorUid;
  if (commentData.authorEmail) newComment.authorEmail = commentData.authorEmail;
  if (commentData.authorAffiliation) newComment.authorAffiliation = commentData.authorAffiliation;
  if (commentData.civilizationAffiliation)
    newComment.civilizationAffiliation = commentData.civilizationAffiliation;

  try {
    // 1. Save to subcollection dialogues/{topicId}/comments/{newId}
    const docRef = doc(db, DIALOGUES_COLLECTION, commentData.topicId, COMMENTS_SUBCOLLECTION, newId);
    await setDoc(docRef, firestoreData);

    // 2. Update dialogue commentsCount in Firestore if dialogue exists
    try {
      const topicRef = doc(db, DIALOGUES_COLLECTION, commentData.topicId);
      const topicSnap = await getDoc(topicRef);
      if (topicSnap.exists()) {
        const cur = topicSnap.data().commentsCount || 0;
        await updateDoc(topicRef, { commentsCount: cur + 1 });
      } else {
        // Fallback for legacy dialogue_topics document
        const legacyTopicRef = doc(db, LEGACY_TOPICS_COLLECTION, commentData.topicId);
        const legSnap = await getDoc(legacyTopicRef);
        if (legSnap.exists()) {
          const cur = legSnap.data().commentsCount || 0;
          await updateDoc(legacyTopicRef, { commentsCount: cur + 1 });
        }
      }
    } catch (err) {
      console.warn("Could not update dialogue commentsCount in Firestore:", err);
    }
  } catch (err) {
    console.warn("Firestore setDoc failed, saving to local cache:", err);
  }

  // Always save to local cache as well to ensure instant availability
  saveLocalComment(newComment);

  // Dispatch notifications reliably (works for both Firestore & local mode)
  try {
    const senderName = newComment.authorName;
    const topicTitle = meta?.topicTitle || "Հարցադրում";
    const textSnippet =
      newComment.text.length > 90
        ? newComment.text.substring(0, 90) + "..."
        : newComment.text;

    // Case 1: Reply to a comment -> notify parent comment author
    if (newComment.parentId && meta?.parentAuthorUid) {
      await createNotification({
        userId: meta.parentAuthorUid,
        type: "comment_reply",
        topicId: newComment.topicId,
        topicTitle,
        commentId: newId,
        senderName,
        senderRole: newComment.authorRole,
        textSnippet: `«${senderName}» պատասխանեց Ձեր մեկնաբանությանը՝ «${textSnippet}»`,
      });
    }
    // Case 2: New root comment -> notify topic author
    else if (!newComment.parentId && meta?.topicAuthorUid) {
      await createNotification({
        userId: meta.topicAuthorUid,
        type: "topic_comment",
        topicId: newComment.topicId,
        topicTitle,
        commentId: newId,
        senderName,
        senderRole: newComment.authorRole,
        textSnippet: `«${senderName}» թողեց նոր մեկնաբանություն՝ «${textSnippet}»`,
      });
    }
  } catch (notifErr) {
    console.warn("Could not dispatch notification:", notifErr);
  }

  return newComment;
}

/**
 * Deletes a comment from subcollection dialogues/{topicId}/comments/{commentId}
 */
export async function deleteDialogueComment(
  commentId: string,
  topicId: string
): Promise<void> {
  try {
    // 1. Delete from subcollection dialogues/{topicId}/comments/{commentId}
    const docRef = doc(db, DIALOGUES_COLLECTION, topicId, COMMENTS_SUBCOLLECTION, commentId);
    await deleteDoc(docRef);

    // 2. Also try deleting from legacy dialogue_comments collection if present
    try {
      await deleteDoc(doc(db, LEGACY_COMMENTS_COLLECTION, commentId));
    } catch {
      // ignore
    }

    // 3. Decrement commentsCount if dialogue exists in Firestore
    try {
      const topicRef = doc(db, DIALOGUES_COLLECTION, topicId);
      const snap = await getDoc(topicRef);
      if (snap.exists()) {
        const cur = snap.data().commentsCount || 1;
        await updateDoc(topicRef, { commentsCount: Math.max(0, cur - 1) });
      } else {
        const legacyTopicRef = doc(db, LEGACY_TOPICS_COLLECTION, topicId);
        const legSnap = await getDoc(legacyTopicRef);
        if (legSnap.exists()) {
          const cur = legSnap.data().commentsCount || 1;
          await updateDoc(legacyTopicRef, { commentsCount: Math.max(0, cur - 1) });
        }
      }
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn("Could not delete comment from Firestore:", err);
  }

  removeLocalComment(commentId);
}

// ----------------------------------------------------
// 3. EXPERT OPINIONS API (SUBCOLLECTION: dialogues/{topicId}/expert_opinions)
// ----------------------------------------------------

/**
 * Fetches all expert opinions for a dialogue topic from its subcollection dialogues/{topicId}/expert_opinions
 * Merges Firestore, local cache, and fallback topic.expertResponses
 */
export async function getTopicExpertOpinions(
  topicId: string,
  fallbackExpertResponses?: ExpertResponse[]
): Promise<TopicExpertOpinion[]> {
  const localList = getLocalExpertOpinions(topicId);

  try {
    const expRef = collection(db, DIALOGUES_COLLECTION, topicId, EXPERT_OPINIONS_SUBCOLLECTION);
    let snap: any;
    try {
      const q = query(expRef, orderBy("createdAt", "asc"));
      snap = await getDocs(q);
    } catch {
      snap = await getDocs(expRef);
    }

    const firestoreList: TopicExpertOpinion[] = [];
    if (!snap.empty) {
      snap.forEach((d: any) => {
        firestoreList.push({ id: d.id, ...(d.data() as Omit<TopicExpertOpinion, "id">) });
      });
    }

    if (firestoreList.length > 0 || localList.length > 0) {
      const mergedMap = new Map<string, TopicExpertOpinion>();
      localList.forEach((op) => mergedMap.set(op.id, op));
      firestoreList.forEach((op) => mergedMap.set(op.id, op));

      return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
  } catch (err) {
    console.warn(`Could not fetch expert opinions from Firestore for topic ${topicId}:`, err);
  }

  // If local list exists, return it
  if (localList.length > 0) {
    return localList.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  // Fallback to topic.expertResponses if provided or from defaultTopics
  const defaultTopic = defaultTopics.find((t) => t.id === topicId);
  const fallbacks = fallbackExpertResponses || defaultTopic?.expertResponses || [];
  if (fallbacks.length > 0) {
    return fallbacks.map((exp, idx) => ({
      id: exp.id || `fallback-exp-${topicId}-${idx}`,
      topicId,
      name: exp.name,
      civilization: exp.civilization,
      quote: exp.quote,
      createdAt: defaultTopic?.createdAt || new Date().toISOString(),
    }));
  }

  return [];
}

/**
 * Adds an expert opinion to subcollection dialogues/{topicId}/expert_opinions/{opinionId}
 * Sanitizes payload so Firestore never throws for undefined fields
 */
export async function addTopicExpertOpinion(
  topicId: string,
  data: Omit<TopicExpertOpinion, "id" | "createdAt" | "topicId">
): Promise<TopicExpertOpinion> {
  const newId = `exp-${Date.now()}`;
  const now = new Date().toISOString();

  const firestoreData: Record<string, any> = {
    id: newId,
    topicId,
    name: data.name,
    civilization: data.civilization,
    quote: data.quote,
    createdAt: now,
  };
  if (data.title) firestoreData.title = data.title;
  if (data.fullText) firestoreData.fullText = data.fullText;
  if (data.avatarUrl) firestoreData.avatarUrl = data.avatarUrl;
  if (data.sourceUrl) firestoreData.sourceUrl = data.sourceUrl;
  if (data.authorUid) firestoreData.authorUid = data.authorUid;
  if (data.authorName) firestoreData.authorName = data.authorName;

  const newOpinion: TopicExpertOpinion = {
    id: newId,
    topicId,
    name: data.name,
    civilization: data.civilization,
    quote: data.quote,
    createdAt: now,
  };
  if (data.title) newOpinion.title = data.title;
  if (data.fullText) newOpinion.fullText = data.fullText;
  if (data.avatarUrl) newOpinion.avatarUrl = data.avatarUrl;
  if (data.sourceUrl) newOpinion.sourceUrl = data.sourceUrl;
  if (data.authorUid) newOpinion.authorUid = data.authorUid;
  if (data.authorName) newOpinion.authorName = data.authorName;

  try {
    // 1. Save to subcollection dialogues/{topicId}/expert_opinions/{newId}
    const docRef = doc(db, DIALOGUES_COLLECTION, topicId, EXPERT_OPINIONS_SUBCOLLECTION, newId);
    await setDoc(docRef, firestoreData);

    // 2. Increment expertOpinionsCount on topic doc
    try {
      const topicRef = doc(db, DIALOGUES_COLLECTION, topicId);
      const snap = await getDoc(topicRef);
      if (snap.exists()) {
        const cur = snap.data().expertOpinionsCount || 0;
        await updateDoc(topicRef, { expertOpinionsCount: cur + 1 });
      }
    } catch (e) {
      console.warn("Could not increment topic expertOpinionsCount:", e);
    }
  } catch (err) {
    console.warn("Firestore error adding expert opinion, caching locally:", err);
  }

  saveLocalExpertOpinion(newOpinion);
  return newOpinion;
}

/**
 * Updates an expert opinion in subcollection dialogues/{topicId}/expert_opinions/{opinionId}
 */
export async function updateTopicExpertOpinion(
  topicId: string,
  opinionId: string,
  partialData: Partial<TopicExpertOpinion>
): Promise<void> {
  const cleanData: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };
  for (const [key, val] of Object.entries(partialData)) {
    if (val !== undefined && key !== "id" && key !== "topicId") {
      cleanData[key] = val;
    }
  }

  try {
    const docRef = doc(db, DIALOGUES_COLLECTION, topicId, EXPERT_OPINIONS_SUBCOLLECTION, opinionId);
    await updateDoc(docRef, cleanData);
  } catch (err) {
    console.warn("Could not update expert opinion in Firestore:", err);
  }

  const localList = getLocalExpertOpinions(topicId);
  const existing = localList.find((op) => op.id === opinionId);
  if (existing) {
    saveLocalExpertOpinion({ ...existing, ...partialData, updatedAt: cleanData.updatedAt });
  }
}

/**
 * Deletes an expert opinion from subcollection dialogues/{topicId}/expert_opinions/{opinionId}
 */
export async function deleteTopicExpertOpinion(
  topicId: string,
  opinionId: string
): Promise<void> {
  try {
    const docRef = doc(db, DIALOGUES_COLLECTION, topicId, EXPERT_OPINIONS_SUBCOLLECTION, opinionId);
    await deleteDoc(docRef);

    try {
      const topicRef = doc(db, DIALOGUES_COLLECTION, topicId);
      const snap = await getDoc(topicRef);
      if (snap.exists()) {
        const cur = snap.data().expertOpinionsCount || 1;
        await updateDoc(topicRef, { expertOpinionsCount: Math.max(0, cur - 1) });
      }
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn("Could not delete expert opinion from Firestore:", err);
  }

  removeLocalExpertOpinion(opinionId);
}

// ----------------------------------------------------
// 4. NOTIFICATIONS API
// ----------------------------------------------------


/**
 * Creates a notification in Firestore and local cache
 */
export async function createNotification(
  data: Omit<SiteNotification, "id" | "isRead" | "createdAt">
): Promise<SiteNotification | null> {
  if (!data.userId) return null; // Cannot notify undefined user

  const newId = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const notifItem: SiteNotification = {
    id: newId,
    userId: data.userId,
    type: data.type,
    topicId: data.topicId,
    topicTitle: data.topicTitle || "Հարցադրում",
    commentId: data.commentId || "",
    senderName: data.senderName || "Անդամ",
    textSnippet: data.textSnippet,
    isRead: false,
    createdAt: now,
  };
  if (data.senderRole) notifItem.senderRole = data.senderRole;

  // 1. Always save to local cache for instant zero-latency availability
  saveLocalNotification(notifItem);

  // 2. Dispatch event in current window so active components update immediately
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("ararat_notifications_updated", { detail: notifItem })
    );
  }

  // 3. Persist to Firestore with explicit setDoc and sanitized payload
  try {
    const docRef = doc(db, "notifications", newId);
    const cleanData: Record<string, any> = {
      id: newId,
      userId: notifItem.userId,
      type: notifItem.type,
      topicId: notifItem.topicId,
      topicTitle: notifItem.topicTitle,
      commentId: notifItem.commentId,
      senderName: notifItem.senderName,
      textSnippet: notifItem.textSnippet,
      isRead: false,
      createdAt: now,
    };
    if (notifItem.senderRole) cleanData.senderRole = notifItem.senderRole;
    await setDoc(docRef, cleanData);
  } catch (err) {
    console.warn("Failed to create notification in Firestore, preserved in local cache:", err);
  }

  return notifItem;
}

/**
 * Reads user notifications (merges Firestore and local storage, avoids composite index requirement)
 */
export async function getUserNotifications(
  userId: string
): Promise<SiteNotification[]> {
  const localList = getUserLocalNotifications(userId);
  const mergedMap = new Map<string, SiteNotification>();
  localList.forEach((n) => mergedMap.set(n.id, n));

  try {
    const notifRef = collection(db, "notifications");
    // Simple equality query avoids Firestore composite index requirements
    const q = query(notifRef, where("userId", "==", userId));
    const snap = await getDocs(q);

    snap.forEach((d) => {
      mergedMap.set(d.id, { id: d.id, ...(d.data() as Omit<SiteNotification, "id">) });
    });
  } catch (err) {
    console.warn("Could not fetch user notifications from Firestore, using local cache:", err);
  }

  return Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Real-time listener for user notifications (Local Storage + Event Listener + Firestore Snapshot)
 */
export function listenToUserNotifications(
  userId: string,
  callback: (notifications: SiteNotification[]) => void
): () => void {
  let isListening = true;

  const emitMerged = (firestoreList: SiteNotification[] = []) => {
    if (!isListening) return;
    const localList = getUserLocalNotifications(userId);
    const mergedMap = new Map<string, SiteNotification>();
    localList.forEach((n) => mergedMap.set(n.id, n));
    firestoreList.forEach((n) => mergedMap.set(n.id, n));

    const sorted = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    callback(sorted);
  };

  // 1. Immediately emit from local cache so the UI updates without delay
  emitMerged();

  // 2. Cross-component & cross-tab listeners
  const handleCustomEvent = () => {
    emitMerged();
  };
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_NOTIFICATIONS_KEY) {
      emitMerged();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("ararat_notifications_updated", handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);
  }

  // 3. Firestore listener without composite index requirement
  let unsubscribeFirestore = () => {};
  try {
    const notifRef = collection(db, "notifications");
    // Omitting orderBy inside Firestore query prevents composite index errors!
    const q = query(notifRef, where("userId", "==", userId));

    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        const fsList: SiteNotification[] = [];
        snapshot.forEach((d) => {
          fsList.push({ id: d.id, ...(d.data() as Omit<SiteNotification, "id">) });
        });
        emitMerged(fsList);
      },
      (err) => {
        console.warn("Firestore notifications onSnapshot fallback to local:", err);
        emitMerged();
      }
    );
  } catch (err) {
    console.warn("Failed to attach notifications listener, running with local events:", err);
  }

  return () => {
    isListening = false;
    if (typeof window !== "undefined") {
      window.removeEventListener("ararat_notifications_updated", handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    }
    unsubscribeFirestore();
  };
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notifId: string): Promise<void> {
  updateLocalNotification(notifId, { isRead: true });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ararat_notifications_updated"));
  }

  try {
    const notifRef = doc(db, "notifications", notifId);
    await updateDoc(notifRef, { isRead: true });
  } catch (err) {
    console.warn("Failed to mark notification as read in Firestore:", err);
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(
  userId: string,
  notifIds: string[]
): Promise<void> {
  markAllLocalNotificationsAsRead(userId, notifIds);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ararat_notifications_updated"));
  }

  try {
    await Promise.all(
      notifIds.map((id) => {
        const notifRef = doc(db, "notifications", id);
        return updateDoc(notifRef, { isRead: true });
      })
    );
  } catch (err) {
    console.warn("Failed to mark all notifications as read in Firestore:", err);
  }
}

/**
 * Seeds default dialogue topics & comments into Firestore
 * (dialogues collection and nested comments subcollection)
 */
export async function seedDialogueTopicsToFirestore(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    let topicsSeeded = 0;
    let commentsSeeded = 0;
    let expertOpinionsSeeded = 0;

    for (const t of defaultTopics) {
      const topicComments = defaultComments.filter((c) => c.topicId === t.id);
      const topicExperts = t.expertResponses || [];

      // 1. Build clean, sanitized payload for the dialogue topic (no undefined values)
      const topicData: Record<string, any> = {
        id: t.id,
        number: t.number || `ՀԱՐՑԱԴՐՈՒՄ #${t.id}`,
        title: t.title,
        description: t.description,
        date: t.date || new Date().toLocaleDateString("hy-AM"),
        status: t.status || "active",
        createdAt: t.createdAt || new Date().toISOString(),
        authorName: t.authorName || "Արարատյան Կենտրոն",
        authorRole: t.authorRole || "super-admin",
        commentsCount: topicComments.length,
        expertOpinionsCount: topicExperts.length,
      };
      if (t.civilizationTag) topicData.civilizationTag = t.civilizationTag;
      if (t.centerId) topicData.centerId = t.centerId;
      if (t.centerName) topicData.centerName = t.centerName;
      if (t.authorUid) topicData.authorUid = t.authorUid;
      if (t.authorEmail) topicData.authorEmail = t.authorEmail;
      if (t.expertResponses && t.expertResponses.length > 0) {
        topicData.expertResponses = t.expertResponses;
      }

      // Seed topic document in 'dialogues' collection
      const topicRef = doc(db, DIALOGUES_COLLECTION, t.id);
      await setDoc(topicRef, topicData, { merge: true });
      topicsSeeded++;

      // 2. Seed comments directly as subcollections: dialogues/{topicId}/comments/{commentId}
      for (const c of topicComments) {
        const commData: Record<string, any> = {
          id: c.id,
          topicId: c.topicId,
          parentId: c.parentId || null,
          authorName: c.authorName || "Անդամ",
          authorRole: c.authorRole || "scholar",
          text: c.text,
          createdAt: c.createdAt || new Date().toISOString(),
        };
        if (c.authorUid) commData.authorUid = c.authorUid;
        if (c.authorEmail) commData.authorEmail = c.authorEmail;
        if (c.authorAffiliation) commData.authorAffiliation = c.authorAffiliation;
        if (c.civilizationAffiliation) commData.civilizationAffiliation = c.civilizationAffiliation;

        const commRef = doc(db, DIALOGUES_COLLECTION, t.id, COMMENTS_SUBCOLLECTION, c.id);
        await setDoc(commRef, commData, { merge: true });
        saveLocalComment(c);
        commentsSeeded++;
      }

      // 3. Seed expert opinions directly as subcollections: dialogues/{topicId}/expert_opinions/{expId}
      for (const exp of topicExperts) {
        const expData: Record<string, any> = {
          id: exp.id,
          topicId: t.id,
          name: exp.name,
          civilization: exp.civilization,
          quote: exp.quote,
          createdAt: t.createdAt || new Date().toISOString(),
        };
        const expRef = doc(db, DIALOGUES_COLLECTION, t.id, EXPERT_OPINIONS_SUBCOLLECTION, exp.id);
        await setDoc(expRef, expData, { merge: true });
        saveLocalExpertOpinion(expData as TopicExpertOpinion);
        expertOpinionsSeeded++;
      }

      // Sync local cache
      saveLocalTopic({
        ...t,
        commentsCount: topicComments.length,
        expertOpinionsCount: topicExperts.length,
      });
    }

    return {
      success: true,
      message: `✓ ${topicsSeeded} հարցադրում, ${commentsSeeded} մեկնաբանություն և ${expertOpinionsSeeded} փորձագիտական կարծիք հաջողությամբ գրանցվեցին Firestore-ում:`,
    };

  } catch (err: any) {
    console.error("Seed dialogue error:", err);
    return {
      success: false,
      message: `Սխալ երկխոսությունները սերմացնելիս. ${err.message || err}`,
    };
  }
}
