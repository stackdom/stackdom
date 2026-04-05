import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const tools = await client.fetch('*[_type == "tool"]{_id, name}');
console.log(`Removing tags from ${tools.length} tools...`);

for (const tool of tools) {
  try {
    await client.patch(tool._id).unset(['tags']).commit();
    console.log(`✓ ${tool.name}`);
  } catch (e) {
    console.error(`✗ ${tool.name} — ${e.message}`);
  }
}

console.log('\nDone.');