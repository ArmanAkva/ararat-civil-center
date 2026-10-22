import { ExpertResponse } from "./content";

export interface TopicExpertOpinion {
  id: string;
  topicId: string;
  name: string;
  civilization: string;
  title?: string;
  quote: string;
  fullText?: string;
  avatarUrl?: string;
  sourceUrl?: string;
  authorUid?: string;
  authorName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DialogueTopicItem {
  id: string;
  number: string;
  date: string;
  title: string;
  description: string;
  civilizationTag?: string;
  centerId?: string;
  centerName?: string;
  status: "active" | "archived" | "closed" | "pending" | "rejected";
  createdAt: string;
  authorUid?: string;
  authorName: string;
  authorRole?: string;
  authorEmail?: string;
  commentsCount?: number;
  expertResponses?: ExpertResponse[];
  expertOpinionsCount?: number;
}


export interface DialogueComment {
  id: string;
  topicId: string;
  parentId?: string | null;
  authorUid?: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  authorAffiliation?: string;
  civilizationAffiliation?: string;
  text: string;
  createdAt: string;
}

export interface SiteNotification {
  id: string;
  userId: string;
  type: "topic_comment" | "comment_reply" | "topic_approved" | "topic_rejected";
  topicId: string;
  topicTitle: string;
  commentId: string;
  senderName: string;
  senderRole?: string;
  textSnippet: string;
  isRead: boolean;
  createdAt: string;
}
