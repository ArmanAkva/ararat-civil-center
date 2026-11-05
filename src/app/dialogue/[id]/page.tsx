import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DialogueTopicDetailView from "@/components/DialogueTopicDetailView";
import { getDialogueTopicById, defaultTopics } from "@/lib/dialogueService";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

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
      title: "Հարցադրում չի գտնվել",
    };
  }

  const title = `${topic.number ? topic.number + " · " : ""}${topic.title}`;
  const description = topic.description;
  const url = `${SITE_URL}/dialogue/${topic.id}`;

  return {
    title,
    description,
    keywords: [
      topic.title,
      topic.civilizationTag || "",
      topic.centerName || "",
      "Հարցադրում",
      "Քաղաքակրթական Երկխոսություն",
      "Արարատյան Ֆորում",
    ].filter(Boolean),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function DialogueTopicPage({ params }: PageProps) {
  const { id } = await params;
  const topic = await getDialogueTopicById(id);

  if (!topic) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    headline: topic.title,
    articleBody: topic.description,
    url: `${SITE_URL}/dialogue/${topic.id}`,
    datePublished: topic.createdAt,
    author: {
      "@type": "Organization",
      name: topic.authorName || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: topic.commentsCount || 0,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DialogueTopicDetailView initialTopic={topic} />
    </>
  );
}
