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

export interface ForumPageContent {
  datesTitle: string;
  locationTitle: string;
  countdown: string;
  manifestoTitle: string;
  manifestoWhat: string;
  messages: ForumMessageItem[];
  agenda: ForumAgendaItem[];
  consensusTitle: string;
  consensusSubtitle: string;
  consensusPercent: number;
}
