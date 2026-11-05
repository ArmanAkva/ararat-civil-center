import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicationDetailView from "@/components/publications/PublicationDetailView";
import { getAllPublicationIds, findPublicationById } from "@/lib/civilizationsData";
import { getPublicationContent } from "@/lib/contentService";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const ids = getAllPublicationIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const local = findPublicationById(id);

  if (!local) {
    return {
      title: "Աշխատությունը չի գտնվել",
    };
  }

  const { pub, civ } = local;
  const author = civ.authors?.find(
    (a) =>
      a.id === pub.authorIds?.[0] ||
      a.publications?.some((p) => p.id === pub.id) ||
      a.publicationIds?.includes(pub.id || "")
  );
  const title = `${pub.title} (${civ.nameHy})`;
  const description =
    pub.description ||
    `${pub.title} - ${civ.nameHy} քաղաքակրթական գիտական աշխատություն (${pub.year || "Գիտական հրապարակում"})։`;
  const url = `${SITE_URL}/publications/${pub.id || id}`;

  return {
    title,
    description,
    keywords: [
      pub.title,
      author?.name || "",
      pub.type || "",
      civ.nameHy,
      "Գիտական աշխատություն",
      "Գրադարան",
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

export default async function PublicationPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getPublicationContent(id);

  if (!item) {
    notFound();
  }

  const { pub, author } = item;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    description: pub.description,
    url: `${SITE_URL}/publications/${pub.id || id}`,
    datePublished: pub.year ? `${pub.year}-01-01` : undefined,
    author: author?.name
      ? {
          "@type": "Person",
          name: author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    keywords: pub.type,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicationDetailView initialPublication={item} />
    </>
  );
}
