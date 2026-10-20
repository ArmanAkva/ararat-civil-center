import { ThinkTank, Thinker } from "@/lib/civilizationsData";

export interface HomePageContent {
  heroTitle: string;
  heroSubtitle: string;
  credo: string;
  cards: Array<{
    id: string;
    title: string;
    description: string;
    link: string;
  }>;
}

export interface CivilizationsPageContent {
  badge: string;
  title: string;
  description: string;
}

export interface AboutPageContent {
  headerTitle: string;
  headerSubtitle: string;
  missionTitle: string;
  missionP1: string;
  missionP2: string;
  civilizationsHeader: string;
  civilizationsIntro: string;
  whyAraratTitle: string;
  whyAraratP1: string;
  whyAraratP2: string;
  toolsHeader: string;
  toolsIntro: string;
  incubatorTitle: string;
  incubatorDesc: string;
  forumToolTitle: string;
  forumToolDesc: string;
  callToActionTitle: string;
  callToActionDesc: string;
  callToActionQuote: string;
}

export interface DialogueTopic {
  number: string;
  date: string;
  title: string;
  description: string;
}

export interface ExpertResponse {
  id: string;
  name: string;
  civilization: string;
  quote: string;
}

export interface DialoguePageContent {
  activeTopic: DialogueTopic;
  expertResponses: ExpertResponse[];
  publicFeed: Array<{
    author: string;
    text: string;
  }>;
  archiveTopics: string[];
}

export interface ForumAgendaItem {
  id: string;
  day: string;
  title: string;
  description: string;
}

export interface ForumMessageItem {
  id: number;
  title: string;
  content: string;
}

export interface ForumOrganizer {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  isOwner?: boolean;
  email?: string;
  phone?: string;
  photoURL?: string;
  bio?: string;
}

export interface ForumSuggestion {
  id: string;
  type: "date_location" | "manifesto" | "message" | "agenda" | "general";
  targetId?: string | number;
  targetTitle?: string;
  authorName: string;
  authorEmail?: string;
  authorRole?: string;
  authorAffiliation?: string;
  authorUid?: string;
  title?: string;
  content: string;
  category?: "suggestion" | "comment" | "amendment" | "attendance";
  status?: "pending" | "approved" | "reviewed" | "implemented";
  likesCount?: number;
  likedBy?: string[];
  createdAt: string;
  replies?: Array<{
    id: string;
    authorName: string;
    authorRole?: string;
    content: string;
    createdAt: string;
  }>;
}

export interface ForumPageContent {
  datesTitle: string;
  locationTitle: string;
  countdown: string;
  targetDateTime?: string;
  manifestoTitle: string;
  manifestoWhat: string;
  messages: ForumMessageItem[];
  agenda: ForumAgendaItem[];
  consensusTitle: string;
  consensusSubtitle: string;
  consensusPercent: number;
  organizerOwner?: ForumOrganizer;
  organizers?: ForumOrganizer[];
  suggestions?: ForumSuggestion[];
}


