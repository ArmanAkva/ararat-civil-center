import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { ForumOrganizer, ForumSuggestion } from "@/types/content";
import { defaultForumContent } from "./defaultSiteContent";

const FORUM_SUGGESTIONS_COLLECTION = "forum_suggestions";
const LOCAL_SUGGESTIONS_KEY = "ararat_forum_suggestions";

/**
 * Local storage cache helper for suggestions
 */
function getLocalSuggestions(): ForumSuggestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_SUGGESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSuggestion(suggestion: ForumSuggestion): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalSuggestions().filter((s) => s.id !== suggestion.id);
    localStorage.setItem(LOCAL_SUGGESTIONS_KEY, JSON.stringify([suggestion, ...list]));
  } catch {
    // ignore
  }
}

function removeLocalSuggestion(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalSuggestions().filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_SUGGESTIONS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/**
 * Fetch all forum suggestions (Firestore with local fallback)
 */
export async function getForumSuggestions(): Promise<ForumSuggestion[]> {
  try {
    const collRef = collection(db, FORUM_SUGGESTIONS_COLLECTION);
    const q = query(collRef, orderBy("createdAt", "desc"), limit(50));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const items: ForumSuggestion[] = [];
      snap.forEach((d) => {
        items.push({ id: d.id, ...(d.data() as Omit<ForumSuggestion, "id">) });
      });
      return items;
    }
  } catch (err: any) {
    if (err?.code !== "permission-denied") {
      console.warn("Firestore forum suggestions fetch failed, checking local cache:", err?.message || err);
    }
  }

  // Fallback to local storage or defaults
  const local = getLocalSuggestions();
  if (local.length > 0) {
    return local;
  }

  return defaultForumContent.suggestions || [];
}

/**
 * Add a new forum suggestion
 */
export async function createForumSuggestion(
  data: Omit<ForumSuggestion, "id" | "createdAt" | "likesCount" | "likedBy" | "replies">
): Promise<ForumSuggestion> {
  const newId = `sugg-${Date.now()}`;
  const now = new Date().toISOString();

  const newSuggestion: ForumSuggestion = {
    ...data,
    id: newId,
    createdAt: now,
    likesCount: 0,
    likedBy: [],
    status: data.status || "pending",
    replies: [],
  };

  // Build clean payload without undefined
  const payload: Record<string, any> = {
    id: newId,
    type: newSuggestion.type,
    authorName: newSuggestion.authorName,
    content: newSuggestion.content,
    createdAt: now,
    likesCount: 0,
    likedBy: [],
    status: newSuggestion.status,
    replies: [],
  };

  if (newSuggestion.targetId !== undefined) payload.targetId = newSuggestion.targetId;
  if (newSuggestion.targetTitle) payload.targetTitle = newSuggestion.targetTitle;
  if (newSuggestion.title) payload.title = newSuggestion.title;
  if (newSuggestion.authorEmail) payload.authorEmail = newSuggestion.authorEmail;
  if (newSuggestion.authorRole) payload.authorRole = newSuggestion.authorRole;
  if (newSuggestion.authorAffiliation) payload.authorAffiliation = newSuggestion.authorAffiliation;
  if (newSuggestion.authorUid) payload.authorUid = newSuggestion.authorUid;
  if (newSuggestion.category) payload.category = newSuggestion.category;

  try {
    const docRef = doc(db, FORUM_SUGGESTIONS_COLLECTION, newId);
    await setDoc(docRef, payload);
  } catch (err: any) {
    if (err?.code !== "permission-denied") {
      console.warn("Could not save forum suggestion to Firestore, stored locally:", err?.message || err);
    }
  }

  saveLocalSuggestion(newSuggestion);
  return newSuggestion;
}

/**
 * Toggle like on a suggestion
 */
export async function toggleLikeSuggestion(
  suggestionId: string,
  userIdentifier: string
): Promise<{ likesCount: number; hasLiked: boolean }> {
  let updatedCount = 0;
  let hasLiked = false;

  // Update local first
  const localList = getLocalSuggestions();
  const index = localList.findIndex((s) => s.id === suggestionId);
  if (index !== -1) {
    const item = localList[index];
    const likedBy = item.likedBy || [];
    const isLiked = likedBy.includes(userIdentifier);
    hasLiked = !isLiked;

    const newLikedBy = isLiked
      ? likedBy.filter((id) => id !== userIdentifier)
      : [...likedBy, userIdentifier];
    updatedCount = Math.max(0, (item.likesCount || 0) + (isLiked ? -1 : 1));

    localList[index] = {
      ...item,
      likesCount: updatedCount,
      likedBy: newLikedBy,
    };
    try {
      localStorage.setItem(LOCAL_SUGGESTIONS_KEY, JSON.stringify(localList));
    } catch {}
  }

  try {
    const docRef = doc(db, FORUM_SUGGESTIONS_COLLECTION, suggestionId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ForumSuggestion;
      const likedBy = data.likedBy || [];
      const isLiked = likedBy.includes(userIdentifier);
      hasLiked = !isLiked;
      updatedCount = Math.max(0, (data.likesCount || 0) + (isLiked ? -1 : 1));

      await updateDoc(docRef, {
        likesCount: updatedCount,
        likedBy: isLiked ? likedBy.filter((id) => id !== userIdentifier) : [...likedBy, userIdentifier],
      });
    }
  } catch (err: any) {
    if (err?.code !== "permission-denied") {
      console.warn("Firestore like update failed:", err?.message || err);
    }
  }

  return { likesCount: updatedCount, hasLiked };
}

/**
 * Add reply to a suggestion
 */
export async function addSuggestionReply(
  suggestionId: string,
  reply: {
    authorName: string;
    authorRole?: string;
    content: string;
  }
): Promise<void> {
  const replyItem = {
    id: `rep-${Date.now()}`,
    ...reply,
    createdAt: new Date().toISOString(),
  };

  // Update local
  const localList = getLocalSuggestions();
  const index = localList.findIndex((s) => s.id === suggestionId);
  if (index !== -1) {
    const item = localList[index];
    localList[index] = {
      ...item,
      replies: [...(item.replies || []), replyItem],
    };
    try {
      localStorage.setItem(LOCAL_SUGGESTIONS_KEY, JSON.stringify(localList));
    } catch {}
  }

  try {
    const docRef = doc(db, FORUM_SUGGESTIONS_COLLECTION, suggestionId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as ForumSuggestion;
      const updatedReplies = [...(data.replies || []), replyItem];
      await updateDoc(docRef, { replies: updatedReplies });
    }
  } catch (err: any) {
    if (err?.code !== "permission-denied") {
      console.warn("Could not save reply to Firestore:", err?.message || err);
    }
  }
}

/**
 * Delete a suggestion
 */
export async function deleteForumSuggestion(suggestionId: string): Promise<void> {
  removeLocalSuggestion(suggestionId);
  try {
    const docRef = doc(db, FORUM_SUGGESTIONS_COLLECTION, suggestionId);
    await deleteDoc(docRef);
  } catch (err: any) {
    if (err?.code !== "permission-denied") {
      console.warn("Could not delete suggestion from Firestore:", err?.message || err);
    }
  }
}
