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
import { DialogueTopicItem, DialogueComment, SiteNotification } from "@/types/dialogue";
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

// ----------------------------------------------------
// 1. TOPICS API
// ----------------------------------------------------

/**
 * Fetches all topics from Firestore, merges with local cache and defaultTopics
 */
export async function getDialogueTopics(): Promise<DialogueTopicItem[]> {
  const localList = getLocalTopics();

  try {
    const topicsRef = collection(db, "dialogue_topics");
    const q = query(topicsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const firestoreList: DialogueTopicItem[] = [];
      snap.forEach((docSnap) => {
        firestoreList.push({ id: docSnap.id, ...(docSnap.data() as Omit<DialogueTopicItem, "id">) });
      });

      const mergedMap = new Map<string, DialogueTopicItem>();
      defaultTopics.forEach((t) => mergedMap.set(t.id, t));
      localList.forEach((t) => mergedMap.set(t.id, t));
      firestoreList.forEach((t) => mergedMap.set(t.id, t));

      const localComments = getAllLocalComments();
      return Array.from(mergedMap.values())
        .map((t) => {
          const topicLocalCount = localComments.filter((c) => c.topicId === t.id).length;
          const topicDefCount = defaultComments.filter((c) => c.topicId === t.id).length;
          return {
            ...t,
            commentsCount: Math.max(t.commentsCount || 0, topicLocalCount, topicDefCount),
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.warn("Could not fetch dialogue_topics from Firestore, using local/default:", err);
  }

  const mergedMap = new Map<string, DialogueTopicItem>();
  defaultTopics.forEach((t) => mergedMap.set(t.id, t));
  localList.forEach((t) => mergedMap.set(t.id, t));

  const localComments = getAllLocalComments();
  return Array.from(mergedMap.values())
    .map((t) => {
      const topicLocalCount = localComments.filter((c) => c.topicId === t.id).length;
      const topicDefCount = defaultComments.filter((c) => c.topicId === t.id).length;
      return {
        ...t,
        commentsCount: Math.max(t.commentsCount || 0, topicLocalCount, topicDefCount),
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Fetches a single topic by ID from Firestore, local storage, or defaults
 */
export async function getDialogueTopicById(
  topicId: string
): Promise<DialogueTopicItem | null> {
  let found: DialogueTopicItem | null = null;
  try {
    const docRef = doc(db, "dialogue_topics", topicId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      found = { id: snap.id, ...(snap.data() as Omit<DialogueTopicItem, "id">) };
    }
  } catch (err) {
    console.warn(`Could not fetch topic ${topicId} from Firestore:`, err);
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
    return {
      ...found,
      commentsCount: Math.max(found.commentsCount || 0, topicLocalCount, topicDefCount),
    };
  }

  return null;
}

/**
 * Creates a new topic (Admin only)
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
  if (newTopic.authorUid) firestoreData.authorUid = newTopic.authorUid;
  if (newTopic.authorRole) firestoreData.authorRole = newTopic.authorRole;
  if (newTopic.authorEmail) firestoreData.authorEmail = newTopic.authorEmail;

  try {
    const docRef = doc(db, "dialogue_topics", newId);
    await setDoc(docRef, firestoreData);
  } catch (err) {
    console.warn("Error creating topic in Firestore, cached locally:", err);
  }

  saveLocalTopic(newTopic);
  return newTopic;
}

/**
 * Updates an existing topic (Admin only)
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
    const docRef = doc(db, "dialogue_topics", topicId);
    await updateDoc(docRef, cleanData);
  } catch (err) {
    console.warn("Could not update topic in Firestore:", err);
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
 * Deletes a topic (Admin only)
 */
export async function deleteDialogueTopic(topicId: string): Promise<void> {
  try {
    const docRef = doc(db, "dialogue_topics", topicId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Could not delete topic from Firestore:", err);
  }

  removeLocalTopic(topicId);
}

// ----------------------------------------------------
// 2. COMMENTS & REPLIES API
// ----------------------------------------------------

/**
 * Fetches all comments for a specific topic (merging Firestore, local cache, and default)
 */
export async function getTopicComments(topicId: string): Promise<DialogueComment[]> {
  const localList = getLocalComments(topicId);
  const defaultList = defaultComments.filter((c) => c.topicId === topicId);

  try {
    const commRef = collection(db, "dialogue_comments");
    const q = query(commRef, where("topicId", "==", topicId));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const firestoreList: DialogueComment[] = [];
      snap.forEach((d) => {
        firestoreList.push({ id: d.id, ...(d.data() as Omit<DialogueComment, "id">) });
      });

      const mergedMap = new Map<string, DialogueComment>();
      defaultList.forEach((c) => mergedMap.set(c.id, c));
      localList.forEach((c) => mergedMap.set(c.id, c));
      firestoreList.forEach((c) => mergedMap.set(c.id, c));

      return Array.from(mergedMap.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }
  } catch (err) {
    console.warn(`Could not fetch comments from Firestore for ${topicId}, using fallback:`, err);
  }

  const mergedMap = new Map<string, DialogueComment>();
  defaultList.forEach((c) => mergedMap.set(c.id, c));
  localList.forEach((c) => mergedMap.set(c.id, c));

  return Array.from(mergedMap.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/**
 * Adds a new comment or reply to a topic
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
    const docRef = doc(db, "dialogue_comments", newId);
    await setDoc(docRef, firestoreData);

    // Update topic count in Firestore if topic exists
    try {
      const topicRef = doc(db, "dialogue_topics", commentData.topicId);
      const topicSnap = await getDoc(topicRef);
      if (topicSnap.exists()) {
        const cur = topicSnap.data().commentsCount || 0;
        await updateDoc(topicRef, { commentsCount: cur + 1 });
      }
    } catch (err) {
      console.warn("Could not update topic commentsCount in Firestore:", err);
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
 * Deletes a comment
 */
export async function deleteDialogueComment(
  commentId: string,
  topicId: string
): Promise<void> {
  try {
    const docRef = doc(db, "dialogue_comments", commentId);
    await deleteDoc(docRef);

    // Decrement commentsCount if topic exists in Firestore
    try {
      const topicRef = doc(db, "dialogue_topics", topicId);
      const snap = await getDoc(topicRef);
      if (snap.exists()) {
        const cur = snap.data().commentsCount || 1;
        await updateDoc(topicRef, { commentsCount: Math.max(0, cur - 1) });
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
// 3. NOTIFICATIONS API
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
 */
export async function seedDialogueTopicsToFirestore(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    for (const t of defaultTopics) {
      const topicRef = doc(db, "dialogue_topics", t.id);
      await setDoc(topicRef, t, { merge: true });
    }
    for (const c of defaultComments) {
      const commRef = doc(db, "dialogue_comments", c.id);
      await setDoc(commRef, c, { merge: true });
    }
    return {
      success: true,
      message: "✓ Երկխոսության նախնական հարցադրումներն ու մեկնաբանությունները գրանցվեցին Firestore-ում:",
    };
  } catch (err: any) {
    console.error("Seed dialogue error:", err);
    return {
      success: false,
      message: `Սխալ երկխոսությունները սերմացնելիս. ${err.message || err}`,
    };
  }
}
