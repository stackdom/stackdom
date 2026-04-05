import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

async function main() {
  console.log('Fetching tool documents from Sanity...');

  const tools = await sanity.fetch(
    `*[_type == "tool" && defined(slug.current)]{ _id, name, "slug": slug.current }`
  );

  console.log(`Found ${tools.length} tools with a slug.\n`);

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    console.log(`[${i + 1}/${tools.length}] Setting go_slug="${tool.slug}" for: ${tool.name}`);

    try {
      await sanity
        .patch(tool._id)
        .set({ go_slug: tool.slug })
        .commit();
      console.log(`  ✓ Done`);
    } catch (err) {
      console.error(`  ✗ Error:`, err.message);
    }
  }

  console.log('\nDone!');
}

main();
