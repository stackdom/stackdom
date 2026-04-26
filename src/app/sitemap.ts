import type { MetadataRoute } from 'next';
import {
  getAllTools,
  getAllStacks,
  getAllComparisons,
  getAllPlaybooks,
  getAllSwitches,
} from '@/lib/sanity';

const BASE_URL = 'https://stackdom.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tools, stacks, comparisons, playbooks, switches] = await Promise.all([
    getAllTools(),
    getAllStacks(),
    getAllComparisons(),
    getAllPlaybooks(),
    getAllSwitches(),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/stacks`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/switch`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/playbooks`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/builder`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t: { slug?: string }) => t.slug)
    .map((t: { slug: string }) => ({
      url: `${BASE_URL}/tools/${t.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const stackRoutes: MetadataRoute.Sitemap = stacks
    .filter((s: { slug?: string }) => s.slug)
    .map((s: { slug: string }) => ({
      url: `${BASE_URL}/stacks/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const compareRoutes: MetadataRoute.Sitemap = comparisons
    .filter((c: { slug?: string }) => c.slug)
    .map((c: { slug: string }) => ({
      url: `${BASE_URL}/compare/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  const playbookRoutes: MetadataRoute.Sitemap = playbooks
    .filter((p: { slug?: string }) => p.slug)
    .map((p: { slug: string }) => ({
      url: `${BASE_URL}/playbooks/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const switchRoutes: MetadataRoute.Sitemap = switches
    .filter((s: { slug?: string }) => s.slug)
    .map((s: { slug: string }) => ({
      url: `${BASE_URL}/switch/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...toolRoutes, ...stackRoutes, ...compareRoutes, ...playbookRoutes, ...switchRoutes];
}
