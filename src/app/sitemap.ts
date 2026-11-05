import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import {
  civilizationsData,
  getAllCenterIds,
  getAllAuthorIds,
  getAllPublicationIds,
} from "@/lib/civilizationsData";
import { defaultTopics } from "@/lib/dialogueService";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static high-value routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/civilizations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dialogue`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/publications`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/forum`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/forum/organizers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic civilization hub routes
  const civilizationRoutes: MetadataRoute.Sitemap = civilizationsData.map((c) => ({
    url: `${SITE_URL}/civilizations/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic center detail routes
  const centerRoutes: MetadataRoute.Sitemap = getAllCenterIds().map((id) => ({
    url: `${SITE_URL}/centers/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic author profile routes
  const authorRoutes: MetadataRoute.Sitemap = getAllAuthorIds().map((id) => ({
    url: `${SITE_URL}/authors/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic publications routes
  const publicationRoutes: MetadataRoute.Sitemap = getAllPublicationIds().map((id) => ({
    url: `${SITE_URL}/publications/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic dialogue topic routes
  const dialogueRoutes: MetadataRoute.Sitemap = defaultTopics.map((topic) => ({
    url: `${SITE_URL}/dialogue/${topic.id}`,
    lastModified: topic.createdAt ? new Date(topic.createdAt) : now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...civilizationRoutes,
    ...centerRoutes,
    ...authorRoutes,
    ...publicationRoutes,
    ...dialogueRoutes,
  ];
}

