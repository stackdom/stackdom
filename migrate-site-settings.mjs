/**
 * Migration script: creates the siteSettings singleton document in Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=your_token node migrate-site-settings.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'sk457y3GE0MOkGUDhN1sMeR4G91TMfmsYyICuJLLCGyvOoqgLPzdtayPR3SiK9k8TOr1H2iFtpQc0ynzI975ZQzwZFHuavv70s4SEp1BI99uiCblBsYT0t8FzsReKdwUSDpfFDt95FJsXS4A6hHMa09UM5bR3TYanF7NEuR4pSpX7cnV4oky',
});

async function run() {
  const doc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    tagline: 'Build a growth stack that actually works. No guesswork.',
  };

  try {
    const result = await client.createOrReplace(doc);
    console.log(`✓ Created/updated siteSettings (${result._id})`);
  } catch (err) {
    console.error(`✗ Failed — ${err.message}`);
  }

  console.log('Done.');
}

run();
