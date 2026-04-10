import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const USE_CASES = [
  "Replacing email for internal team chat organised by topic and project",
  "Getting real-time notifications from your CRM, support and sales tools in one place",
  "Running client projects in dedicated channels with all files and decisions in one thread",
  "Coordinating remote teams across time zones with async updates and scheduled messages",
  "Onboarding new hires with structured channels, pinned resources and welcome automations",
  "Setting up automated alerts so your team responds instantly to new leads or support tickets",
];

async function main() {
  console.log('Fetching Slack tool document...');

  const tool = await sanity.fetch(
    `*[_type == "tool" && slug.current == "slack"][0]{ _id, name }`
  );

  if (!tool) {
    console.error('Slack tool document not found.');
    process.exit(1);
  }

  console.log(`Found: ${tool.name} (${tool._id})`);
  console.log(`Patching with ${USE_CASES.length} use cases...`);

  await sanity
    .patch(tool._id)
    .set({ use_cases: USE_CASES })
    .commit();

  console.log('✓ Done.');
}

main();
