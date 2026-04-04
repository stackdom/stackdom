/**
 * Migration script: imports all comparison pairs from src/data/comparisons.js into Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=your_token node migrate-comparisons.mjs
 *
 * Requires @sanity/client to be installed (it ships with next-sanity).
 */

import { createClient } from '@sanity/client';
import { COMPARISONS } from './src/data/comparisons.js';

const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'sk457y3GE0MOkGUDhN1sMeR4G91TMfmsYyICuJLLCGyvOoqgLPzdtayPR3SiK9k8TOr1H2iFtpQc0ynzI975ZQzwZFHuavv70s4SEp1BI99uiCblBsYT0t8FzsReKdwUSDpfFDt95FJsXS4A6hHMa09UM5bR3TYanF7NEuR4pSpX7cnV4oky',
});

async function run() {
  const entries = Object.entries(COMPARISONS);
  console.log(`Migrating ${entries.length} comparisons…`);

  for (const [key, data] of entries) {
    const [tool_a_slug, , tool_b_slug] = key.split('-vs-');
    // key format: "toolA-vs-toolB" — split on '-vs-' to get both slugs
    const parts = key.split('-vs-');
    const slugA = parts[0];
    const slugB = parts[1];

    const doc = {
      _type: 'comparison',
      slug: { _type: 'slug', current: key },
      tool_a_slug: slugA,
      tool_b_slug: slugB,
      quick_summary: data.quick_summary || null,
      overview: data.overview || null,
      key_difference_a: data.key_difference?.a || null,
      key_difference_b: data.key_difference?.b || null,
      side_by_side_a: data.side_by_side?.a || null,
      side_by_side_b: data.side_by_side?.b || null,
      how_they_differ_a: data.how_they_differ?.a || [],
      how_they_differ_b: data.how_they_differ?.b || [],
      choose_if_a: data.choose_if?.a || [],
      choose_if_b: data.choose_if?.b || [],
      who_for_a: data.who_for?.a || [],
      who_for_b: data.who_for?.b || [],
      final_verdict: data.final_verdict || null,
      faqs: (data.faqs || []).map(f => ({ q: f.q, a: f.a })),
      featured: false,
    };

    try {
      const created = await client.create(doc);
      console.log(`✓ Created: ${key} (${created._id})`);
    } catch (err) {
      console.error(`✗ Failed: ${key} — ${err.message}`);
    }
  }

  console.log('Done.');
}

run();
