/**
 * Populates why_it_works, who_is_this_for, when_to_use and when_not_to_use
 * for all tool documents in Sanity using the Claude API.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... SANITY_TOKEN=sk-... node populate-tool-modules.mjs
 *
 * Optional env vars (defaults shown):
 *   SANITY_PROJECT_ID   vfxyxg6k
 *   SANITY_DATASET      production
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@sanity/client';

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'vfxyxg6k';
const DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_TOKEN = process.env.SANITY_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SANITY_TOKEN) { console.error('Missing SANITY_TOKEN'); process.exit(1); }
if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const sanity = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'skfBeya54FNxAIacLwp9rTjhqkXxlFaFSEtJmzE8tEGrucBFzHCKNy1brMJR5fHhHtllAWI6BzrkxgSENZQwxKU21w71UR4hFdKJNTOTHVfuJZLJKERYYfqVorIyRqwsxSXIodaLyRnI2mbDEKhYrw8Cpf9aQyV4GS65G6ppFphyYjzBGXMv',
});

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateModules(tool) {
  const context = [
    tool.name && `Tool name: ${tool.name}`,
    tool.category && `Category: ${tool.category}`,
    tool.best_for && `Best for: ${tool.best_for}`,
    tool.overview && `Overview: ${tool.overview}`,
    tool.pros?.length && `Pros: ${tool.pros.join('; ')}`,
    tool.cons?.length && `Cons: ${tool.cons.join('; ')}`,
    tool.use_cases?.length && `Use cases: ${tool.use_cases.join('; ')}`,
  ].filter(Boolean).join('\n');

  const prompt = `You are writing content for Stackdom, a tool directory for small businesses. The tone is clear, plain English, second person ("you"/"your"), no hype, no exclamation marks, short punchy sentences.

Based on this tool information:
${context}

Return ONLY a valid JSON object (no markdown, no code fences, no explanation) with exactly these fields:

{
  "why_it_works": "2-3 sentences explaining why this tool delivers real results for small businesses",
  "who_is_this_for": ["type of user 1", "type of user 2", "type of user 3"],
  "when_to_use": ["situation 1", "situation 2", "situation 3", "situation 4"],
  "when_not_to_use": ["situation 1", "situation 2", "situation 3"]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text.trim();
  return JSON.parse(text);
}

async function run() {
  const tools = await sanity.fetch(
    `*[_type == "tool"] | order(name asc) {
      _id,
      name,
      category,
      best_for,
      overview,
      pros,
      cons,
      use_cases
    }`
  );

  console.log(`Found ${tools.length} tools to process.\n`);

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    console.log(`[${i + 1}/${tools.length}] ${tool.name} …`);

    try {
      const modules = await generateModules(tool);

      await sanity
        .patch(tool._id)
        .set({
          why_it_works: modules.why_it_works,
          who_is_this_for: modules.who_is_this_for,
          when_to_use: modules.when_to_use,
          when_not_to_use: modules.when_not_to_use,
        })
        .commit();

      console.log(`  ✓ Done`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }

    if (i < tools.length - 1) {
      await sleep(3000);
    }
  }

  console.log('\nAll done.');
}

run();
