import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DialogueTopicDetailView from "@/components/DialogueTopicDetailView";
import { getDialogueTopicById, defaultTopics } from "@/lib/dialogueService";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return defaultTopics.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const topic = await getDialogueTopicById(id);

  if (!topic) {
    return {
      title: "Հարցադրում չի գտնվել | Քաղաքակրթական Երկխոսություն",
    };
  }

  return {
    title: `${topic.number ? topic.number + " · " : ""}${topic.title} | Քաղաքակրթական Երկխոսություն`,
    description: topic.description,
  };
}

export default async function DialogueTopicPage({ params }: PageProps) {
  const { id } = await params;
  const topic = await getDialogueTopicById(id);

  if (!topic) {
    notFound();
  }

  return <DialogueTopicDetailView initialTopic={topic} />;
}
