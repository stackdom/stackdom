import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/go/'],
      },
    ],
    sitemap: 'https://stackdom.com/sitemap.xml',
    host: 'https://stackdom.com',
  };
}
