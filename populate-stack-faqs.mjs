/**
 * Populates faqs for all stack documents in Sanity using the Claude API.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... SANITY_TOKEN=sk-... node populate-stack-faqs.mjs
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
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: SANITY_TOKEN,
});

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateFaqs(stack) {
  const context = [
    stack.name && `Stack name: ${stack.name}`,
    stack.business_type && `Business type: ${stack.business_type}`,
    stack.description && `Description: ${stack.description}`,
    stack.tools?.length && `Tools included: ${stack.tools.join(', ')}`,
    stack.overview_problem && `Problem it solves: ${stack.overview_problem}`,
    stack.overview_solution && `Solution: ${stack.overview_solution}`,
    stack.estimated_monthly_cost && `Estimated monthly cost: ${stack.estimated_monthly_cost}`,
  ].filter(Boolean).join('\n');

  const prompt = `You are writing FAQ content for Stackdom, a tool directory and stack recommendation site for small businesses. The tone is clear, plain English, second person ("you"/"your"), no hype, no exclamation marks, direct and specific answers.

Based on this stack:
${context}

Generate exactly 4 FAQs that match real questions someone would ask an AI assistant about this stack — for example: what tools are needed, how much it costs, whether it suits a certain business type or team size, how it compares, or how hard it is to set up.

Return ONLY a valid JSON object (no markdown, no code fences, no explanation):

{
  "faqs": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ]
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
  const stacks = await sanity.fetch(
    `*[_type == "stack"] | order(name asc) {
      _id,
      name,
      business_type,
      description,
      tools,
      overview_problem,
      overview_solution,
      estimated_monthly_cost
    }`
  );

  console.log(`Found ${stacks.length} stacks to process.\n`);

  for (let i = 0; i < stacks.length; i++) {
    const stack = stacks[i];
    console.log(`[${i + 1}/${stacks.length}] ${stack.name} …`);

    try {
      const { faqs } = await generateFaqs(stack);

      await sanity
        .patch(stack._id)
        .set({ faqs })
        .commit();

      console.log(`  ✓ Done (${faqs.length} FAQs)`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }

    if (i < stacks.length - 1) {
      await sleep(3000);
    }
  }

  console.log('\nAll done.');
}

run();
