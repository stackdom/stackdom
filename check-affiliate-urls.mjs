import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const tools = await client.fetch('*[_type == "tool"]{name, go_slug, affiliateUrl, website_url}');
tools.forEach(t => {
  console.log(`${t.name}: go_slug=${t.go_slug} | affiliate=${t.affiliateUrl || 'EMPTY'}`);
});