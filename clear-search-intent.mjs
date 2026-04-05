import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

const docs = await client.fetch('*[_type == "comparison"]{_id, slug}');
console.log(`Found ${docs.length} comparisons to clean up.`);

for (const doc of docs) {
  try {
    await client.patch(doc._id).unset(['search_intent']).commit();
    console.log(`✓ Cleared: ${doc.slug?.current || doc._id}`);
  } catch (e) {
    console.error(`✗ Failed: ${doc._id} — ${e.message}`);
  }
}

console.log('\nDone.');