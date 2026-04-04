/**
 * Migration script: creates Privacy Policy and Terms of Service documents in Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=your_token node migrate-legal.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: 'sk457y3GE0MOkGUDhN1sMeR4G91TMfmsYyICuJLLCGyvOoqgLPzdtayPR3SiK9k8TOr1H2iFtpQc0ynzI975ZQzwZFHuavv70s4SEp1BI99uiCblBsYT0t8FzsReKdwUSDpfFDt95FJsXS4A6hHMa09UM5bR3TYanF7NEuR4pSpX7cnV4oky',
});

const LAST_UPDATED = '2026-04-04';

const privacyPolicy = {
  _type: 'legalPage',
  slug: { _type: 'slug', current: 'privacy-policy' },
  title: 'Privacy Policy',
  lastUpdated: LAST_UPDATED,
  content: `## Introduction

Stackdom ("we", "us", or "our") operates the website Stackdom.com. This Privacy Policy explains how we collect, use, and protect information when you visit our site.

By using Stackdom, you agree to the collection and use of information in accordance with this policy.

## Information We Collect

We collect the following types of information:

- Usage data (pages visited, time spent on pages, referring URLs, browser type, device type)
- Contact form submissions (your name, email address, and message when you reach out to us)
- Cookies and similar tracking technologies used by analytics tools

We do not collect payment information. We do not require you to create an account to use Stackdom.

## How We Use Your Information

We use the information we collect to:

- Understand how visitors use the site so we can improve it
- Respond to enquiries submitted via the contact form
- Monitor site performance and fix technical issues
- Analyse usage trends to inform content decisions

## Cookies and Analytics

Stackdom uses Google Analytics to understand how visitors interact with our site. Google Analytics collects anonymised usage data via cookies. This data is processed by Google in accordance with their privacy policy.

You can opt out of Google Analytics tracking by using the Google Analytics Opt-out Browser Add-on, or by adjusting your browser's cookie settings.

We do not use cookies for advertising or sell any data collected via cookies.

## Third-Party Links

Stackdom is a tool directory. We link to third-party websites and products as part of our core service. These external sites have their own privacy policies, and we are not responsible for their content, practices, or how they handle your data.

We encourage you to review the privacy policy of any third-party site you visit via a link on Stackdom.

## Data Sharing and Selling

We do not sell, trade, or rent your personal information to third parties. We do not share your data with advertisers.

We may share anonymised, aggregated usage data (not personally identifiable) for research or analysis purposes.

## Data Retention

Contact form submissions are retained only as long as necessary to respond to your enquiry. Analytics data is retained in accordance with Google Analytics' default retention settings.

## Your Rights

Depending on your location, you may have rights to access, correct, or delete personal data we hold about you. To make a request, contact us at hello@stackdom.com.

## Changes to This Policy

We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page reflects when the most recent changes were made. Continued use of Stackdom after any changes constitutes acceptance of the updated policy.

## Contact

If you have any questions about this Privacy Policy, please contact us at hello@stackdom.com.`,
};

const termsOfService = {
  _type: 'legalPage',
  slug: { _type: 'slug', current: 'terms-of-service' },
  title: 'Terms of Service',
  lastUpdated: LAST_UPDATED,
  content: `## About Stackdom

Stackdom is a tool directory and recommendation service for small businesses. We curate information about software tools, compare them, and help businesses find the right stack for their needs.

By accessing or using Stackdom.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.

## Content Accuracy

We work hard to keep information about tools — including features, pricing, and descriptions — accurate and up to date. However, software products change frequently. Pricing, plans, and features may have changed since we last updated a listing.

We recommend verifying all information directly with the tool provider before making purchasing decisions. Stackdom is not responsible for decisions made based on information published on this site.

## Affiliate Links

Some links on Stackdom may be affiliate links. This means we may earn a commission if you click through and make a purchase or sign up for a product, at no additional cost to you.

Affiliate relationships do not influence how we recommend or rank tools. We only list tools we believe are genuinely useful for small businesses.

## Intellectual Property

All content on Stackdom — including text, tool descriptions, comparisons, stack recommendations, and site design — is the intellectual property of Stackdom unless otherwise noted.

You may not reproduce, republish, or redistribute our content without prior written permission. Brief quotations with attribution and a link back to the original page are permitted.

## Limitation of Liability

Stackdom is provided "as is" without warranties of any kind. We do not guarantee that the site will be available at all times or that information will be error-free.

To the fullest extent permitted by law, Stackdom and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site or reliance on its content. This includes but is not limited to loss of revenue, data, or business opportunities.

## Third-Party Websites

Stackdom links to third-party websites as part of its service. We are not responsible for the content, availability, or practices of any linked site. Visiting a third-party site from Stackdom is at your own risk.

## Changes to These Terms

We may update these Terms of Service at any time. The "Last updated" date at the top of this page indicates when changes were last made. Your continued use of Stackdom after changes are posted constitutes your acceptance of the updated terms.

## Governing Law

These Terms of Service are governed by the laws of New South Wales, Australia. Any disputes arising from use of this site will be subject to the exclusive jurisdiction of the courts of New South Wales.

## Contact

If you have any questions about these Terms of Service, please contact us at hello@stackdom.com.`,
};

async function run() {
  const docs = [privacyPolicy, termsOfService];
  console.log(`Creating ${docs.length} legal pages…`);

  for (const doc of docs) {
    try {
      const created = await client.create(doc);
      console.log(`✓ Created: ${doc.slug.current} (${created._id})`);
    } catch (err) {
      console.error(`✗ Failed: ${doc.slug.current} — ${err.message}`);
    }
  }

  console.log('Done.');
}

run();
