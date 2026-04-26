#!/usr/bin/env node
/**
 * Stackdom content seed
 *
 * Idempotent script that:
 *   1. Pre-flight: checks SANITY_WRITE_TOKEN and verifies referenced tools exist
 *   2. Seeds 3 Tool documents (Loops, Cal.com, Calendly) via createOrReplace
 *   3. Seeds 3 Switch documents (HubSpot→Pipedrive, Mailchimp→Loops, Calendly→Cal.com)
 *      with reference resolution for related_switches / related_tools / related_stacks
 *   4. Syncs sanity/schemas/switch.ts to the studio (schemaTypes/switch.ts)
 *   5. Patches studio's schemaTypes/index.ts to register switchType
 *   6. Runs `npx sanity deploy` from the studio directory (interactive)
 *
 * Run: npm run seed
 *
 * Re-runnable: createOrReplace overwrites by _id (pattern: tool.{slug}, switch.{slug}).
 *
 * If sanity deploy at step 6 hangs or fails, the content seed is already committed.
 * Just rerun it manually: cd /Users/jasonelk/Downloads/stackdom-studio && npx sanity deploy
 */

import { createClient } from '@sanity/client';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const STUDIO_DIR = '/Users/jasonelk/Downloads/stackdom-studio';

// === Pre-flight ===
const TOKEN = process.env.SANITY_WRITE_TOKEN;
if (!TOKEN) {
  console.error('❌ SANITY_WRITE_TOKEN not set. Add it to .env.local and run via `npm run seed`.');
  process.exit(1);
}
if (!existsSync(STUDIO_DIR)) {
  console.error(`❌ Studio directory not found at ${STUDIO_DIR}`);
  process.exit(1);
}

const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
});

// =============================================================================
// TOOL DATA
// =============================================================================

const LOOPS = {
  slug: { _type: 'slug', current: 'loops' },
  name: 'Loops',
  short_description: 'Modern email for SaaS with transactional and marketing in one place',
  category: 'Email',
  tagline: 'The email platform built for SaaS',
  website_url: 'https://loops.so',
  // No affiliateUrl, no go_slug — Loops has no affiliate program
  monthly_price: 0,
  pricing_summary:
    'Free up to 1,000 contacts and 4,000 sends per month. Paid plans scale with subscribed contact count and start around $49 per month for 5,000 contacts. Transactional email is included in every plan. No charge for additional team seats.',
  quick_summary:
    'Loops is a modern email platform built for SaaS founders and creators who want clean UX, honest pricing and transactional plus marketing email in one place.',
  features: [
    'Notion-style block editor for fast email creation',
    'Transactional and marketing email in one platform',
    'Subscriber-based pricing with no charges for sends or seats',
    'Event-based triggers built for SaaS workflows',
    'Modern API with strong developer documentation',
    'Real-time deliverability and analytics',
    'Audience segmentation and contact properties',
    'Free plan up to 1,000 contacts and 4,000 sends per month',
  ],
  best_for:
    'SaaS founders who want one tool for product emails and newsletters. Technical founders who value a clean API. Indie creators who write content people actually want to read.',
  business_sizes: ['Solo', '2-10', '11-50'],
  stack_fit:
    "Loops is what email looks like when it's built by people who actually use email tools every day. It's fast. It's beautifully designed. It's priced honestly. For SaaS teams it's hard to beat.",
  overview: [
    'Loops is an email platform purpose-built for SaaS companies and modern content creators. It combines marketing email, product email and transactional email in a single tool. That means you stop juggling three different platforms for three different jobs.',
    "The interface feels like Notion. The dashboard feels like Linear. If you've used either you'll be productive in Loops in minutes. The block-based email editor is faster than the drag-and-drop builders in older tools. It produces emails that look great in every inbox without fiddling.",
    "The pricing model is the other reason teams switch. Loops charges based on subscribed contacts only. No per-seat fees. No per-send fees. No surprise tier jumps. The free plan covers genuine early-stage use up to 1,000 contacts and 4,000 sends per month. That's enough for most newsletters and side projects to test the tool properly before paying.",
  ].join('\n\n'),
  use_cases: [
    'Sending product onboarding emails for a SaaS app',
    'Running a newsletter alongside your software business',
    'Triggering behavioural emails when users hit specific milestones in your product',
    'Sending transactional email like password resets, receipts and notifications',
    'Running A/B tests on subject lines and send times',
    'Building automation flows for trial conversion and re-engagement',
  ],
  pros: [
    'Beautiful modern interface',
    'Honest subscriber-based pricing',
    'Transactional and marketing email in one',
    'Strong API and developer experience',
    'Generous free tier for early-stage products',
    'Direct support from real humans including the founders',
  ],
  cons: [
    'Built for SaaS. Less suited to ecommerce',
    'Automation is simpler than enterprise tools like Customer.io',
    'Smaller integration ecosystem than Mailchimp or Klaviyo',
    'No native landing pages or signup forms',
    'Less mature analytics than Klaviyo for revenue attribution',
  ],
  why_it_works:
    'Loops solves a real problem for SaaS teams. Most email tools were built for ecommerce or for committee marketing teams running campaigns. SaaS teams need something different. Product emails, marketing emails and transactional sends all need to come from the same domain with the same brand. Loops handles all three without making you stitch together Mandrill and Mailchimp and Customer.io.',
  who_is_this_for: [
    'SaaS founders sending product and marketing email',
    'Indie hackers and solo creators building in public',
    'Newsletter writers who want a modern editor',
    'Technical founders who value clean APIs',
    'Teams that want one email platform instead of three',
  ],
  when_to_use: [
    "You're building a SaaS product and need user lifecycle emails",
    'You write a newsletter alongside your business',
    'You want transactional email and marketing in one tool',
    'Your team values UI quality and honest pricing',
    "You're under 50,000 subscribers and want to keep your stack lean",
  ],
  when_not_to_use: [
    'You run an ecommerce store on Shopify (use Klaviyo)',
    'You need landing pages, signup forms or postcards in the same tool',
    'You have complex multi-step automation built in another platform',
    'You need deep enterprise features like role-based permissions',
    "You're sending more than 200,000 emails a month at consistent volume",
  ],
  faqs: [
    {
      question: 'Is Loops actually free?',
      answer: 'Yes. The free plan covers up to 1,000 subscribers and 4,000 sends per month. No credit card required to start.',
    },
    {
      question: 'Can I send transactional email from Loops?',
      answer: "Yes. Loops includes transactional email in every plan including the free tier. You don't need a separate tool for password resets and receipts.",
    },
    {
      question: 'How does Loops compare to Mailchimp?',
      answer: 'Loops is purpose-built for SaaS. Mailchimp is broader and older. Loops is cheaper above 5,000 contacts and has a better editor. Mailchimp has more integrations and templates.',
    },
    {
      question: 'Does Loops have an affiliate program?',
      answer: 'Not currently. The link from Stackdom goes directly to Loops with no affiliate tracking.',
    },
    {
      question: 'Can I use Loops for ecommerce?',
      answer: 'Technically yes. Practically no. Klaviyo is purpose-built for Shopify and WooCommerce and will serve ecommerce stores better.',
    },
    {
      question: 'What kind of automation does Loops support?',
      answer: 'Linear automations triggered by events, contact properties or list joins. Less complex than Customer.io but enough for most SaaS lifecycle emails.',
    },
    {
      question: 'Is Loops good for newsletters?',
      answer: 'Yes. The editor is one of the best in the category for content creators. Many newsletter writers have switched from Mailchimp and ConvertKit specifically for the editor.',
    },
  ],
};

const CAL_COM = {
  slug: { _type: 'slug', current: 'cal-com' },
  name: 'Cal.com',
  short_description: 'Open-source scheduling with unlimited bookings on the free tier',
  category: 'Scheduling',
  tagline: 'Open-source scheduling for individuals and teams',
  website_url: 'https://cal.com',
  monthly_price: 0,
  pricing_summary:
    'Free for individuals with unlimited bookings and event types. Teams plan starts at $15 per seat per month for shared scheduling and round-robin. Organisations plan at $30 per seat per month adds SSO, advanced routing and HIPAA compliance. Self-hosting is free aside from your own server costs.',
  quick_summary:
    'Cal.com is the open-source scheduling tool that gives individuals a generous free tier and teams a transparent paid plan. Self-host if you want full data ownership or use the cloud version.',
  features: [
    'Free plan with unlimited bookings and event types',
    'Open-source codebase you can self-host',
    'Calendar sync with Google, Outlook and iCloud',
    'Round-robin and collective team event types',
    'Custom booking pages with white-label branding on paid plans',
    'Webhooks and API for custom integrations',
    'Native Cal Video for built-in meeting links',
    'Workflows for custom email and SMS reminders',
  ],
  best_for:
    "Solo operators who don't want to pay $12 a month for basic scheduling. Small teams that need flexible booking pages. Developer-friendly teams that value open-source software.",
  business_sizes: ['Solo', '2-10', '11-50'],
  stack_fit:
    "Cal.com is what Calendly should have stayed. A simple booking tool that respects your data and doesn't punish you for growing. The free tier alone makes most paid Calendly plans hard to justify.",
  overview: [
    'Cal.com is an open-source scheduling platform that does what Calendly does without locking you into a closed ecosystem. You can use the cloud version or self-host the entire codebase on your own infrastructure. Both options give you the same core scheduling features.',
    'The free plan covers most solo and small team use cases. Unlimited bookings. Unlimited event types. Calendar sync with all the major calendar tools. Custom booking pages. That alone makes Cal.com worth considering before you commit to a paid Calendly plan.',
    "Where Cal.com really shines is for teams that want control. Custom domains, white-label branding, webhooks and API access mean you can build scheduling into your product or website without it feeling bolted on. The open-source option means if you ever need a feature that isn't there you can build it yourself or hire someone to.",
  ].join('\n\n'),
  use_cases: [
    'Letting prospects book sales calls without back-and-forth emails',
    'Embedding scheduling in your product or marketing site',
    'Running team round-robin scheduling for inbound demos',
    'Setting up paid bookings for consulting or coaching',
    'Creating branded booking pages with your own domain',
    'Self-hosting scheduling for data sovereignty or compliance reasons',
  ],
  pros: [
    'Genuinely free for individual use with no booking limits',
    'Open-source with self-hosting option',
    'Modern UI that feels built in this decade',
    'Custom domains and white-label branding on paid plans',
    'Strong developer experience with webhooks and API',
    'Native video meetings via Cal Video',
  ],
  cons: [
    'Self-hosting requires real DevOps effort',
    "Mobile app less polished than Calendly's",
    "Round-robin UX rougher than Calendly's",
    'Smaller library of CRM integrations',
    'Documentation can have gaps for edge cases',
  ],
  why_it_works:
    'Calendly built the category. Cal.com modernised it. The free tier is genuinely useful for solo operators and small teams. The paid tiers are priced honestly. The self-hosting option gives technical teams a path to full control. Cal.com is the rare scheduling tool that respects both your time and your data.',
  who_is_this_for: [
    'Solo founders and freelancers who need basic scheduling for free',
    'Small teams that want round-robin without paying $20 a seat',
    'Developer-led companies embedding scheduling in their product',
    'Privacy-conscious teams that want self-hosting',
    "Anyone tired of Calendly's pricing creep",
  ],
  when_to_use: [
    "You're paying Calendly for features you don't really use",
    'You want custom branding without an Enterprise plan',
    'You need to embed scheduling in your own product',
    'You value open-source tools you can extend or audit',
    'Your team is technical enough to self-host if needed',
  ],
  when_not_to_use: [
    "You rely heavily on Calendly's deep Salesforce integration",
    "Your sales team's workflow is built entirely around Calendly's CRM round-robin",
    'You need a polished mobile booking experience above all else',
    "You're at 100+ users with complex routing rules where the saving disappears",
    'Your prospects are non-technical and might be confused by a non-Calendly link',
  ],
  faqs: [
    {
      question: 'Is Cal.com really free?',
      answer: 'Yes. The free plan covers unlimited bookings, event types and calendar sync for individual users. Paid plans start when you need team features.',
    },
    {
      question: 'Can I self-host Cal.com?',
      answer: "Yes. The codebase is open-source on GitHub. You'll need to manage your own infrastructure but there are no licensing costs.",
    },
    {
      question: 'How does Cal.com compare to Calendly?',
      answer: 'Cal.com is open-source and more generous on the free tier. Calendly has more polished CRM integrations and a better mobile app. For most solo and small team use cases Cal.com is the better choice.',
    },
    {
      question: 'Does Cal.com integrate with HubSpot or Salesforce?',
      answer: "Yes but the integrations are less mature than Calendly's. If your sales process depends on deep CRM sync test carefully before switching.",
    },
    {
      question: "What's the difference between Teams and Organisations?",
      answer: 'Teams covers shared scheduling and round-robin for one team. Organisations adds SSO, HIPAA compliance, custom subdomains and advanced routing for larger orgs.',
    },
    {
      question: 'Can I use Cal.com for paid bookings?',
      answer: 'Yes. Stripe integration lets you charge for bookings directly. Useful for consultants, coaches and paid consultations.',
    },
    {
      question: 'Is the free plan really unlimited?',
      answer: 'For individual use yes. Unlimited bookings and unlimited event types. Team features and workflows require a paid plan.',
    },
  ],
};

const CALENDLY = {
  slug: { _type: 'slug', current: 'calendly' },
  name: 'Calendly',
  short_description: 'Scheduling for sales teams with deep CRM integrations',
  category: 'Scheduling',
  tagline: 'The default scheduling tool for sales teams',
  website_url: 'https://calendly.com',
  // No affiliateUrl set per OQ #4 — add later via Studio if affiliate program is signed
  monthly_price: 0,
  pricing_summary:
    'Free tier covers one event type and basic features. Standard plan at $12 per seat per month adds unlimited event types and integrations. Teams plan at $20 per seat per month adds round-robin and shared event types. Enterprise pricing is custom.',
  quick_summary:
    "Calendly is the category-defining scheduling tool. Reliable, well-integrated with major CRMs and built for sales teams that need round-robin and shared booking pages. Pricing scales fast as your team grows.",
  features: [
    'Calendar sync with Google, Outlook and iCloud',
    'Round-robin and collective team scheduling',
    'Native HubSpot, Salesforce and Microsoft Dynamics integrations',
    'Custom branding and embedded booking widgets',
    'Workflows for SMS and email reminders',
    'Polished mobile app',
    'Routing forms for qualifying bookers',
    'Stripe and PayPal integration for paid bookings',
  ],
  best_for:
    "Sales teams that need deep CRM integration. Customer-facing teams who value Calendly's mobile app. Anyone whose prospects already know how Calendly works.",
  business_sizes: ['Solo', '2-10', '11-50', '50+'],
  stack_fit:
    'Calendly is the default for a reason. It works. It integrates with everything sales teams use. It looks the same as it did five years ago, which is either reliable or stale depending on your perspective.',
  overview: [
    'Calendly defined the modern scheduling category. Founded in 2013, it grew from a solo founder side project into a category-defining tool used by millions. For sales teams the brand recognition alone is worth something. Your prospect sees a calendly.com link and knows what to do.',
    "Where Calendly is hardest to beat is its integration depth. The HubSpot, Salesforce and Microsoft Dynamics integrations are more mature than any alternative. Round-robin assignment, lead routing, automatic activity logging and CRM-aware booking flows all work out of the box. For sales-led teams whose entire workflow runs through a major CRM, that integration depth is worth paying for.",
    "Where Calendly struggles is pricing. The free tier is restrictive (one event type only). Standard at $12 per seat per month is fine for solo users but climbs fast for teams. Teams at $20 per seat per month adds round-robin but pushes a 10-person team to $2,400 a year for what newer alternatives offer cheaper or free. The UI hasn't changed much in years, which feels reliable to some users and stale to others.",
  ].join('\n\n'),
  use_cases: [
    'Sales discovery and demo calls',
    'Customer onboarding sessions',
    'Recruiting and candidate interviews',
    'Internal team meeting scheduling',
    'Embedded scheduling on your marketing site',
    'Paid consultations via Stripe',
  ],
  pros: [
    'Best-in-class CRM integrations especially HubSpot and Salesforce',
    'Polished mobile app',
    'Reliable and battle-tested at scale',
    'Recognised brand. Bookers know what to do',
    'Strong round-robin and team scheduling features',
    'Routing forms for qualifying inbound bookings',
  ],
  cons: [
    'Pricing climbs fast as your team grows',
    'Free tier is restrictive (1 event type only)',
    'UI feels dated compared to newer alternatives like Cal.com',
    'Most "advanced" features locked behind Teams or Enterprise',
    "Open-source alternatives offer comparable features for free",
  ],
  why_it_works:
    'Calendly defined the scheduling category. Their CRM integrations are deeper than any alternative. For sales teams whose entire workflow runs through HubSpot or Salesforce, the lock-in is real and worth paying for. For everyone else, alternatives are catching up fast and Cal.com in particular offers a more generous free tier.',
  who_is_this_for: [
    'Sales teams using HubSpot or Salesforce as their CRM',
    'Recruiters and customer success teams that need polished mobile booking',
    'Larger teams that need enterprise features like SSO and HIPAA compliance',
    'Anyone whose prospects expect a calendly.com link',
  ],
  when_to_use: [
    'Your sales process is built around HubSpot or Salesforce',
    'You need round-robin assignment for an inbound sales team',
    "Mobile booking experience is critical to your team's workflow",
    'You value brand recognition and predictability over cost',
  ],
  when_not_to_use: [
    "You're a solo operator paying for features you don't use",
    'You want custom branding without an Enterprise plan',
    'You value open-source software you can self-host',
    "Your team is small enough that Cal.com's free tier covers your needs",
  ],
  faqs: [
    {
      question: 'How much does Calendly cost?',
      answer: 'Free for one event type. Standard at $12 per seat per month. Teams at $20 per seat per month. Enterprise is custom.',
    },
    {
      question: 'How does Calendly compare to Cal.com?',
      answer: "Calendly has deeper CRM integrations and a more polished mobile app. Cal.com is open-source and has a more generous free tier. For sales-led teams Calendly is hard to beat. For most solo users and small teams Cal.com is the better deal.",
    },
    {
      question: 'Does Calendly integrate with HubSpot?',
      answer: 'Yes. The integration is one of the most polished in the category. Round-robin assignment, automatic activity logging and CRM-aware routing all work out of the box.',
    },
    {
      question: 'Is the free tier worth using?',
      answer: 'For occasional use yes. For anything more than one event type you\'ll need to upgrade to Standard.',
    },
    {
      question: 'Can I customise the booking page branding?',
      answer: 'Some customisation on Standard. Full white-labelling and custom domains require Enterprise.',
    },
  ],
};

// =============================================================================
// SWITCH DATA
// =============================================================================

const SWITCH_HUBSPOT_TO_PIPEDRIVE = {
  slug: { _type: 'slug', current: 'hubspot-to-pipedrive' },
  from_tool_slug: 'hubspot',
  to_tool_slug: 'pipedrive',
  category: 'Sales · CRM · Migration',
  headline: 'Switch from HubSpot to Pipedrive',
  intro:
    "Most teams using HubSpot Sales Hub Pro are paying for features they never touch. If your team lives in the pipeline and not the marketing automation, switching to Pipedrive saves around US$4,260 a year for a team of five. This guide covers the real cost difference, what you keep, what you lose and whether you should actually switch.",
  quick_summary: {
    annual_saving: 'US$4,260 for a 5-person team',
    migration_time: '4 to 8 hours',
    difficulty: 'Moderate. Mostly data prep',
    who_should_switch: 'Sales-led teams of 3 to 25',
    who_should_stay: "Teams using HubSpot's marketing tools",
    verdict: 'Yes if sales is your main motion',
  },
  why_switch: [
    'Cost. HubSpot Sales Hub Pro starts at US$100 per seat per month. Pipedrive Advanced is US$29. Same job. Different price tag.',
    'Bloat. HubSpot ships hundreds of features most sales teams never open. Pipedrive does fewer things. It does them faster.',
    'Speed. Setup takes an hour in Pipedrive. HubSpot takes a day. Mobile app actually works on the road.',
  ],
  why_stay: [
    "Marketing tools. If you use HubSpot's email sequences, forms, landing pages or workflows, Pipedrive doesn't have direct replacements.",
    'Shared contact database. If sales and marketing both work from the same HubSpot contacts, splitting into two tools creates sync overhead.',
    'Reporting habits. If your leadership reads HubSpot dashboards every Monday, switching means rebuilding those reports somewhere else.',
  ],
  cost_intro: 'For a 5-person sales team, switching saves US$4,260 a year.',
  cost_rows: [
    { label: 'Per user per month', from_value: '$100', to_value: '$29', total_saving: '' },
    { label: '5 users monthly', from_value: '$500', to_value: '$145', total_saving: '' },
    { label: '5 users annual', from_value: '$6,000', to_value: '$1,740', total_saving: '' },
    { label: 'Annual saving', from_value: '', to_value: '', total_saving: '$4,260' },
  ],
  cost_footnote:
    "For a 10-person team it's US$8,520. For 25 people it's US$21,300. The dollar saving is real. The opportunity cost matters too. Most teams find Pipedrive faster to use day to day, which is harder to put a number on but worth more than the subscription saving over a year.",
  what_you_keep: [
    "Pipeline visibility. Pipedrive's pipeline view is sharper not weaker.",
    'Contact and company management. Both tools handle this well.',
    'Activity tracking. Logging calls, emails and notes works the same.',
    'Email integration. Both sync with Gmail and Outlook.',
    "Mobile app. Pipedrive's is genuinely better.",
    'API access. Both have mature APIs.',
    'Basic reporting. Pipeline reports, conversion rates and forecasts are all there.',
  ],
  what_you_lose: [
    'Marketing automation. No native equivalent. Replace with Loops or Customer.io.',
    'Shared sales-marketing database. Plan for a sync tool like Zapier or Make.',
    'Forms and landing pages. Use Tally for forms. Use your CMS for landing pages.',
    "Custom dashboards. HubSpot's are deeper. Most teams don't actually need that depth.",
  ],
  what_you_gain: [
    'Speed. Setup, daily use and onboarding new hires are all faster.',
    'Honest pricing. Plans are transparent. No upsell pressure on every screen.',
    'Less feature noise. Tool feels designed for one job.',
    'Pipeline-first design. If sales is your main motion, the tool matches it.',
  ],
  migration_time_intro:
    'Realistic estimate for a 5-person team with 500 contacts and 100 active deals.',
  migration_time_items: [
    { label: 'Data export from HubSpot', duration: '30 minutes' },
    { label: 'Data preparation', duration: '1 to 2 hours' },
    { label: 'Pipedrive import and field mapping', duration: '1 hour' },
    { label: 'Pipeline setup and customisation', duration: '1 to 2 hours' },
    { label: 'Email and integration reconnection', duration: '1 hour' },
    { label: 'Team training', duration: '1 to 2 hours' },
  ],
  migration_time_total: '4 to 8 hours',
  migration_time_notes:
    'Most of the time is data prep and team training. The technical migration itself is simple. What extends the timeline: custom HubSpot objects or properties (add 2 to 4 hours), heavy automation in HubSpot Workflows (add a day to rebuild equivalents), connected marketing tools that need reconfiguring, teams over 10 people (add training time).',
  steps: [
    {
      title: 'Audit before you export',
      body: "Before you touch any data list out all custom properties you actually use, active deals and their stages, any automation you'll need to rebuild and integrations connected to HubSpot. This audit is the most important part. Most failed migrations skip it.",
    },
    {
      title: 'Export from HubSpot',
      body: 'In HubSpot navigate to Settings then Data Management then Export. Export Contacts, Companies, Deals and Activities as separate CSVs. Choose "All properties" since it\'s easier to filter on import than to re-export later. Download all four files.',
    },
    {
      title: 'Clean the CSVs',
      body: "Open each CSV in Google Sheets. Common issues to fix: date formats (HubSpot uses ISO, Pipedrive accepts it but check timezones), duplicate contacts (HubSpot accumulates these), empty custom property columns (delete them, they'll clutter Pipedrive), pipeline stage names (write down the mapping you'll use).",
    },
    {
      title: 'Set up Pipedrive',
      body: "Sign up for the Advanced plan. Create your pipeline matching the stages you used in HubSpot or improve them while you have the chance. Add custom fields for each HubSpot custom property you're keeping. Invite team members with appropriate permissions.",
    },
    {
      title: 'Import the data',
      body: 'Pipedrive has a built-in CSV import at Settings then Tools and apps then Import data. Import in this order: Companies, Contacts, Deals, Activities. Map each CSV column to the corresponding Pipedrive field. Run the import on a small sample first (ten rows) to check the mapping.',
    },
    {
      title: 'Reconnect integrations',
      body: "Connect Gmail or Outlook for email sync. Reconnect Slack if you use it. Set up Zapier or Make to replace HubSpot's native integrations. If you're keeping HubSpot Free for marketing set up the contact sync now.",
    },
    {
      title: 'Run parallel for one week',
      body: "Don't kill HubSpot the day you switch. Keep it active in read-only mode for a week. New deals go into Pipedrive. Existing deals stay where they are until closed. Team can reference HubSpot for historical context. After a week downgrade HubSpot to the free tier or cancel entirely.",
    },
    {
      title: 'Train the team',
      body: "Pipedrive's UI is simpler than HubSpot's but old habits stick. A 30-minute team session covers the daily pipeline view, adding a new deal, logging an activity, the mobile app and where to find what you used to find in HubSpot. That's enough for most teams to be operational.",
    },
  ],
  gotchas: [
    {
      title: "The HubSpot timeline doesn't fully transfer",
      body: 'Activity history imports but the rich formatting and linking is partial. Screenshot your most important contacts before migrating.',
    },
    {
      title: 'Email tracking is per-tool',
      body: "Emails sent from HubSpot tracked in HubSpot. Emails sent from Pipedrive will track in Pipedrive. There's no merge. Accept the gap.",
    },
    {
      title: 'HubSpot Free is still an option',
      body: "You can downgrade rather than cancel. Useful if marketing wants to keep using HubSpot's forms or email tools while sales moves to Pipedrive. Most teams don't realise this.",
    },
    {
      title: "Pipedrive's automation is weaker than HubSpot Workflows",
      body: "For complex multi-step automations you'll need Zapier or Make. Budget US$20 to $50 a month.",
    },
    {
      title: 'Custom report builders work differently',
      body: "HubSpot's is more powerful. If your leadership relies on bespoke dashboards screenshot them before switching and consider rebuilding the key ones in Looker Studio.",
    },
    {
      title: 'The "are you sure?" moment',
      body: "Around hour three every team has doubts. The HubSpot UI is familiar. Pipedrive feels different. Push through. By day three the speed advantage becomes obvious. By week two you'll wonder why you waited.",
    },
  ],
  definitely_switch: [
    "You're paying for HubSpot Sales Hub Pro and using less than half of it",
    'Your team is sales-led not marketing-led',
    'Your sales process has clear stages',
    "You're under 25 people",
  ],
  maybe_switch: [
    'You use some HubSpot marketing features but could replace them with cheaper standalone tools',
    'You have 25 to 50 people. The saving is bigger but the migration is harder',
    "You like HubSpot's reporting but don't need it",
  ],
  dont_switch: [
    "You're heavily using HubSpot Marketing Hub or Service Hub",
    'Your sales and marketing teams operate from one shared contact database',
    'You have complex custom objects or workflows that took months to build',
    "You're at 50+ people with multiple HubSpot admins. Change management costs more than the saving",
  ],
  final_verdict:
    "If you're a 5 to 15 person sales-led team paying for HubSpot Sales Hub Pro switch to Pipedrive. The annual saving funds your entire sales tool stack with money left over. If you're marketing-led or a small team paying for HubSpot Starter stay where you are or downgrade to HubSpot Free. The Pipedrive saving doesn't justify the migration in either case. If you're not sure run the maths in the cost table above with your real headcount. The saving is the deciding factor and at most team sizes it's significant.",
  before_you_switch_note:
    "HubSpot will discount Sales Hub Pro by 20 to 30% if you ask at renewal. Most teams don't ask. Try the negotiation before you commit to the migration. If the discount lands you under US$70 per seat per month staying might be the right call. If they won't budge that's your sign.",
  faqs: [
    {
      q: 'Is Pipedrive actually cheaper than HubSpot?',
      a: 'Yes. Pipedrive Advanced is US$29 per user per month. HubSpot Sales Hub Pro is US$100. For a 5-person team the saving is US$4,260 a year.',
    },
    {
      q: 'How long does the migration take?',
      a: '4 to 8 hours for a team of 5. Mostly data preparation and team training. The technical migration itself is straightforward.',
    },
    {
      q: 'Will I lose my data?',
      a: 'No. HubSpot exports cleanly to CSV. Pipedrive imports CSV directly. Activity history transfers with some formatting loss.',
    },
    {
      q: 'Can I keep HubSpot for marketing and use Pipedrive for sales?',
      a: "Yes. HubSpot's free tier covers basic marketing. Sync contacts between the two with Zapier or Make. Many teams run this hybrid setup.",
    },
    {
      q: 'What if I need automation features?',
      a: "Pipedrive's built-in automation is weaker than HubSpot's. Use Zapier or Make for anything complex. Budget US$20 to $50 a month extra.",
    },
    {
      q: "Should I switch if I'm using HubSpot Starter?",
      a: "Probably not. Starter is US$15 to $20 per seat. The saving versus Pipedrive is small and the migration time isn't worth it.",
    },
    {
      q: 'Does Pipedrive have email marketing?',
      a: 'Bolted on not native. If you need real email marketing pair Pipedrive with Loops, Customer.io or HubSpot Free.',
    },
  ],
  featured: true,
  // These are slug arrays — script resolves to references at write time
  _related_switches: ['salesforce-to-pipedrive', 'pipedrive-to-hubspot', 'spreadsheet-to-pipedrive'],
  _related_tools: ['pipedrive', 'hubspot'],
  _related_stacks: ['service-business', 'b2b-growth'],
};

const SWITCH_MAILCHIMP_TO_LOOPS = {
  slug: { _type: 'slug', current: 'mailchimp-to-loops' },
  from_tool_slug: 'mailchimp',
  to_tool_slug: 'loops',
  category: 'Email · Marketing · Migration',
  headline: 'Switch from Mailchimp to Loops',
  intro:
    "Mailchimp's pricing climbs fast as your list grows. Loops is the modern email tool that founders and creators are switching to. Cleaner UI. Honest pricing. Better deliverability. This guide covers the real cost difference, what you keep, what you lose and whether you should switch.",
  quick_summary: {
    annual_saving: 'US$1,200 for a 5,000-list newsletter',
    migration_time: '2 to 4 hours',
    difficulty: 'Easy. CSV import handles most of it',
    who_should_switch: 'Newsletter writers, SaaS founders, creators',
    who_should_stay: 'Heavy automation users, ecommerce on Mailchimp',
    verdict: 'Yes if you write content people actually want to read',
  },
  why_switch: [
    "Pricing. Mailchimp's per-contact pricing punishes growth. Hit 5,000 contacts and you're paying US$100+ per month for what used to cost $35.",
    "UI. Mailchimp's editor feels old. Loops feels like a tool built in this decade.",
    "Deliverability. Loops is purpose-built for transactional and marketing email together. Mailchimp's deliverability has slipped.",
  ],
  why_stay: [
    "Heavy automation history. If you've spent two years building Mailchimp Customer Journeys you're rebuilding from scratch in Loops.",
    'Ecommerce integrations. Mailchimp has deep Shopify and WooCommerce integration. Loops focuses on SaaS use cases.',
    "Brand templates. If your team has a library of branded Mailchimp templates the rebuild is real work.",
  ],
  cost_intro: 'For a 5,000-contact newsletter sender, switching saves around US$1,200 a year.',
  cost_rows: [
    { label: '1,000 contacts', from_value: '$20/mo', to_value: 'Free', total_saving: '' },
    { label: '5,000 contacts', from_value: '$100/mo', to_value: '$49/mo', total_saving: '' },
    { label: '10,000 contacts', from_value: '$135/mo', to_value: '$89/mo', total_saving: '' },
    { label: '25,000 contacts', from_value: '$230/mo', to_value: '$179/mo', total_saving: '' },
    { label: '50,000 contacts', from_value: '$385/mo', to_value: '$349/mo', total_saving: '' },
  ],
  cost_footnote:
    'Loops also includes transactional email in the same price. Mailchimp charges separately for that through Mandrill. For most newsletter operators between 5,000 and 25,000 subscribers Loops costs roughly half of Mailchimp.',
  what_you_keep: [
    'Email sending. Both tools handle the basics well.',
    'Audience segmentation. Loops segmentation is cleaner.',
    'Templates. Loops has fewer but better-designed templates.',
    'Subscriber data. Imports cleanly via CSV.',
    'Analytics. Open rates, click rates and unsubscribes all there.',
    'Deliverability tools. SPF, DKIM and DMARC setup is the same.',
  ],
  what_you_lose: [
    "Customer Journey automation. Loops has automations but they're less complex.",
    'Mailchimp landing pages. Use Tally, Carrd or your CMS instead.',
    'Mailchimp signup forms with embedded pop-ups. Use Tally or your existing site forms.',
    'Deep ecommerce integrations. If you sell on Shopify Klaviyo is a better Mailchimp replacement than Loops.',
    "Postcards and physical mail. Mailchimp does this. Loops doesn't.",
  ],
  what_you_gain: [
    'Modern UI. The editor feels like Notion. The dashboard feels like Linear.',
    'Honest pricing. No "your contact tier just bumped you up $80" surprises.',
    'Better deliverability. Newer infrastructure. Less spam folder.',
    'Transactional and marketing in one. API for transactional emails ships with the same plan.',
    'Code blocks and rich content. Built for content people not committee marketing teams.',
  ],
  migration_time_intro: 'Realistic estimate for a 5,000-contact newsletter.',
  migration_time_items: [
    { label: 'Export contacts from Mailchimp', duration: '15 minutes' },
    { label: 'Set up Loops account and verify domain', duration: '30 minutes' },
    { label: 'Import contacts and audiences', duration: '30 minutes' },
    { label: 'Rebuild your main template', duration: '1 hour' },
    { label: 'Test sends and final review', duration: '30 minutes' },
    { label: 'Update signup forms on your site', duration: '30 minutes' },
  ],
  migration_time_total: '2 to 4 hours',
  migration_time_notes:
    "Most of the time is the template rebuild. If you don't have a fancy template you're done in 90 minutes.",
  steps: [
    {
      title: 'Set up Loops first',
      body: "Don't export anything yet. Get Loops working first. Sign up for Loops. Add your sending domain. Verify SPF, DKIM and DMARC (Loops walks you through this). Wait for domain verification. Usually under an hour.",
    },
    {
      title: 'Export from Mailchimp',
      body: 'In Mailchimp navigate to Audience then All contacts then Export Audience. Choose CSV. Wait for the email with the download link. Usually under 10 minutes.',
    },
    {
      title: 'Clean the CSV',
      body: "Open in Google Sheets. Check the email column has clean addresses, first name and last name are separated, subscriber status is clear (you only want subscribed contacts) and custom fields you actually use are labelled. Delete rows for unsubscribed and cleaned contacts. Don't import them.",
    },
    {
      title: 'Import to Loops',
      body: 'In Loops go to Audience then Import. Upload your CSV. Map columns (email is required, everything else is optional). Choose which audience or list to import into. Run the import.',
    },
    {
      title: 'Rebuild your main template',
      body: "Loops uses a block editor similar to Notion. Most teams find this faster than Mailchimp's drag-and-drop. Recreate your header, footer and main body styles. Add your logo. Set your default sender name and reply-to address. Save as a template.",
    },
    {
      title: 'Send a test campaign',
      body: 'Send to yourself and 2 or 3 colleagues first. Check rendering in Gmail, Outlook and Apple Mail. Check mobile rendering. Verify all links work. Confirm the unsubscribe link is present and styled.',
    },
    {
      title: 'Update your signup forms',
      body: 'This is the step most people forget. Update the form on your website to point at Loops. If you use Tally, ConvertKit forms or any other lead-capture tool reconnect the integration. Update any Zapier or Make automations that pushed contacts into Mailchimp.',
    },
    {
      title: 'Cancel Mailchimp',
      body: "Don't cancel immediately. Run parallel for two weeks. Send your next campaign from Loops. Confirm deliverability is fine. Then cancel.",
    },
  ],
  gotchas: [
    {
      title: 'Mailchimp will try to keep you',
      body: 'Their retention team offers steep discounts when you cancel. Sometimes 50% off for six months. If the discount lands you under what Loops costs the maths might flip.',
    },
    {
      title: 'Email warming matters',
      body: 'New sending domains need a warm-up period. Loops handles this automatically but expect slightly lower open rates for the first two weeks. This is normal.',
    },
    {
      title: "Customer Journey automation doesn't transfer",
      body: "If you have multi-step welcome sequences in Mailchimp you're rebuilding them in Loops from scratch. Budget extra time.",
    },
    {
      title: 'Audience tags work differently',
      body: 'Mailchimp uses tags. Loops uses contact properties. The mental model is similar but the implementation differs. Plan to clean up your tagging during migration.',
    },
    {
      title: 'Your deliverability score follows your domain not the tool',
      body: "If your Mailchimp deliverability was bad because of list hygiene Loops won't magically fix it. Clean your list before you import.",
    },
  ],
  definitely_switch: [
    "You're a newsletter writer or content creator with under 50,000 subscribers",
    "You're paying Mailchimp $100+ a month and feel the pricing is unfair",
    "You want a modern editor that doesn't feel like 2015",
    'You also send transactional email and want both in one place',
  ],
  maybe_switch: [
    'You have heavy Mailchimp automation but think you could simplify',
    "You're between 50,000 and 200,000 subscribers. The saving is real but rebuild is bigger",
    "You've considered ConvertKit, Beehiiv or Buttondown but want something more polished",
  ],
  dont_switch: [
    "You're an ecommerce store on Shopify or WooCommerce. Look at Klaviyo instead",
    "You rely on Mailchimp's landing pages, postcards or physical mail features",
    'You have a complex Customer Journey setup that would take weeks to rebuild',
    'You have over 200,000 subscribers. At that scale negotiate Mailchimp pricing or look at Customer.io',
  ],
  final_verdict:
    "If you're a newsletter writer, indie SaaS founder or content creator switch to Loops. The pricing alone justifies it. The UI is a bonus. If you're an ecommerce store don't switch to Loops. Switch to Klaviyo. Different tool for a different job. If you're a marketing team running complex automation evaluate Customer.io alongside Loops. Loops is cleaner. Customer.io is more powerful.",
  // No before_you_switch_note for this one
  faqs: [
    {
      q: 'Is Loops actually cheaper than Mailchimp?',
      a: "Yes. At 5,000 contacts Loops is US$49 a month versus Mailchimp's $100. The gap widens as your list grows.",
    },
    {
      q: 'How long does the migration take?',
      a: '2 to 4 hours for most teams. Most of that is rebuilding your main email template.',
    },
    {
      q: 'Will my deliverability suffer?',
      a: 'Slightly for the first two weeks while your domain warms up on Loops. After that deliverability is typically better than Mailchimp.',
    },
    {
      q: 'Can I import my automations?',
      a: 'No. You rebuild automations in Loops. The good news is Loops automations are simpler to build than Mailchimp Customer Journeys.',
    },
    {
      q: 'Does Loops have a free plan?',
      a: 'Yes. Up to 1,000 contacts. Good for testing before you migrate.',
    },
    {
      q: 'What about transactional email?',
      a: 'Loops includes transactional email in the same plan. Mailchimp charges separately through Mandrill.',
    },
    {
      q: 'Should I switch if I run a Shopify store?',
      a: "No. Switch to Klaviyo. It's purpose-built for ecommerce and has deeper Shopify integration than Loops.",
    },
  ],
  featured: true,
  _related_switches: ['mailchimp-to-klaviyo', 'mailchimp-to-convertkit', 'mailchimp-to-buttondown'],
  _related_tools: ['loops', 'mailchimp', 'klaviyo'],
  _related_stacks: ['solo-founders', 'service-business'],
};

const SWITCH_CALENDLY_TO_CAL_COM = {
  slug: { _type: 'slug', current: 'calendly-to-cal-com' },
  from_tool_slug: 'calendly',
  to_tool_slug: 'cal-com',
  category: 'Scheduling · Productivity · Migration',
  headline: 'Switch from Calendly to Cal.com',
  intro:
    "Calendly's free tier is restrictive. Their paid tiers scale up fast as your team grows. Cal.com is the open-source alternative with a more generous free plan and modern UI. This guide covers the real cost difference, what you keep, what you lose and whether you should switch.",
  quick_summary: {
    annual_saving: 'US$720 for a 5-person team',
    migration_time: '1 to 2 hours',
    difficulty: 'Easy. Manual rebuild but simple',
    who_should_switch: 'Solo operators, indie founders, dev-friendly teams',
    who_should_stay: "Sales teams using Calendly's CRM integrations heavily",
    verdict: 'Yes for most use cases. Free tier covers a lot',
  },
  why_switch: [
    "Pricing. Calendly Standard is US$12 per user per month. For a 5-person team that's US$720 a year. Cal.com Free covers most of what you need.",
    "Open source. Cal.com is open source. You can self-host if you want full data ownership. Most people don't but the option matters.",
    'UI and customisation. Cal.com feels modern. Calendly feels stale. Cal.com supports custom domains, white-labelling and richer booking pages.',
  ],
  why_stay: [
    "Calendly is the default. Your prospects know how it works. There's a small unfamiliarity tax with Cal.com.",
    "Salesforce and HubSpot integrations. Calendly's enterprise integrations are deeper.",
    "Round-robin and team scheduling. Calendly's team features are slightly more polished.",
  ],
  cost_intro: 'For a solo user the saving is small. For teams the saving compounds.',
  cost_rows: [
    { label: '1 user', from_value: '$12/mo', to_value: 'Free', total_saving: '' },
    { label: '5 users', from_value: '$60/mo', to_value: '$0 to $75/mo', total_saving: '' },
    { label: '10 users', from_value: '$120/mo', to_value: '$0 to $150/mo', total_saving: '' },
    { label: '25 users', from_value: '$300/mo', to_value: '$375/mo', total_saving: '' },
  ],
  cost_footnote:
    'For most teams under 10 people Cal.com\'s free tier covers what they need. The saving is real. At larger team sizes Cal.com\'s Teams plan is comparable to Calendly so the saving disappears. This isn\'t a "save thousands" switch for most teams. It\'s a "stop paying for something you don\'t need" switch.',
  what_you_keep: [
    'Calendar sync. Both tools sync with Google, Outlook and iCloud calendars.',
    'Booking links. Personal and team booking pages.',
    'Buffer time and notice periods. All standard scheduling controls.',
    'Email reminders. Both tools handle confirmation and reminder emails.',
    'Time zone handling. Both do this well.',
    'Embedded scheduling. Both can embed in your website.',
  ],
  what_you_lose: [
    "Calendly's brand recognition. Your prospects might pause briefly at a Cal.com link.",
    'Some enterprise integrations. Salesforce and HubSpot integrations are less mature.',
    'Polished round-robin. Cal.com supports it but the UX is rougher.',
    "Calendly's mobile app. Cal.com's app exists but is less polished.",
  ],
  what_you_gain: [
    'Free tier. Most use cases work on the free plan forever.',
    'Open source. You can self-host if data sovereignty matters.',
    'Custom domains and branding. White-labelled scheduling.',
    'Webhooks and API. More developer-friendly.',
    'Better booking page design. More layouts. Better customisation.',
    'Workflows. Custom email and SMS reminders without paying enterprise pricing.',
  ],
  migration_time_intro: 'Realistic estimate for a 5-person team.',
  migration_time_items: [
    { label: 'Set up Cal.com accounts', duration: '15 minutes' },
    { label: 'Connect calendars and verify availability', duration: '30 minutes' },
    { label: 'Recreate event types and booking pages', duration: '30 minutes' },
    { label: 'Update booking links everywhere they appear', duration: '30 minutes' },
  ],
  migration_time_total: '1 to 2 hours',
  migration_time_notes:
    "There's no data export or import. You manually rebuild your event types in Cal.com. For most users this takes minutes because Cal.com's setup is fast.",
  steps: [
    {
      title: 'Set up Cal.com',
      body: 'Sign up at [cal.com](https://cal.com). Choose your username. This becomes your booking URL. Connect your primary calendar (Google, Outlook or iCloud). Set your working hours and time zone.',
    },
    {
      title: 'Recreate your event types',
      body: "Look at Calendly. Copy each event type into Cal.com. For each one set the name and slug, duration, buffer time before and after, minimum notice period, any custom questions you ask bookers and confirmation and reminder email templates if customised. This is the bulk of the work. For most users it's 5 to 10 minutes per event type.",
    },
    {
      title: 'Set up your team if relevant',
      body: 'If you have team scheduling create a Team in Cal.com. Invite team members. Set up round-robin or collective event types. Test the team booking flow before going live.',
    },
    {
      title: 'Connect integrations',
      body: 'Common ones: Zoom or Google Meet for video calls, Stripe for paid bookings if relevant, Zapier for syncing to your CRM, HubSpot, Salesforce or Pipedrive native integrations.',
    },
    {
      title: 'Update your booking links everywhere',
      body: "This is the step most people miss. Update your email signature, your website's \"book a call\" buttons, your social media bio links, any signup forms or onboarding flows, your CRM if it has stored Calendly URLs and your team's email signatures.",
    },
    {
      title: 'Forward Calendly traffic',
      body: "If you have a high-traffic Calendly link consider setting up a redirect from your old Calendly URL to your Cal.com URL using Calendly's link redirect. Send an email to recent bookers letting them know your scheduling has moved.",
    },
    {
      title: 'Cancel Calendly',
      body: 'Wait two weeks. Confirm Cal.com is working for everyone on the team. Then cancel Calendly.',
    },
  ],
  gotchas: [
    {
      title: "Custom URL slugs aren't always available",
      body: 'If your Calendly URL was `calendly.com/yourname` you might find your preferred slug taken on Cal.com. Pick something close before someone else grabs it.',
    },
    {
      title: 'Calendar sync needs verification',
      body: "Cal.com's setup walks you through this but if you skip steps you'll double-book yourself. Test with a real booking before going live.",
    },
    {
      title: 'Embedded widgets need updating',
      body: 'If you embed Calendly on your website the embed code is different in Cal.com. Plan to update those embeds during the switch.',
    },
    {
      title: 'Notification emails come from Cal.com',
      body: 'Some bookers will see "you have a meeting via cal.com" and pause. Most don\'t notice. Worth knowing.',
    },
    {
      title: 'The free tier is generous but watch the limits',
      body: 'Multiple event types, group events and unlimited bookings are free. Workflows, advanced routing and team features cost. Check what you actually use before assuming free is enough.',
    },
  ],
  definitely_switch: [
    "You're a solo operator paying $12 a month for Calendly",
    "You're a small team where most users only need basic scheduling",
    'You want custom branding, custom domains or white-labelling',
    'You value open source software',
  ],
  maybe_switch: [
    "You're a sales team that uses Calendly's HubSpot or Salesforce integration heavily",
    'You have 20+ users where the team plan saving disappears',
    'Your prospects are non-technical and might find a non-Calendly link confusing',
  ],
  dont_switch: [
    "You rely heavily on Calendly's enterprise features and have a custom contract",
    "Your sales team's workflow is built deeply around Calendly's CRM round-robin",
    "You're at 100+ users with complex routing rules",
  ],
  final_verdict:
    "If you're solo or running a team under 10 people switch to Cal.com. The free tier covers most use cases and the saving is real over a year. If you're a sales-led team using Calendly's enterprise integrations stay on Calendly unless you have a specific reason to leave. If you're picking a scheduling tool for the first time start with Cal.com Free. There's no reason to start on a paid Calendly plan in 2026.",
  // No before_you_switch_note for this one
  faqs: [
    {
      q: 'Is Cal.com actually free?',
      a: 'Yes. The free plan covers unlimited 1-on-1 bookings, multiple event types and calendar sync. Paid plans add team features, workflows and routing.',
    },
    {
      q: 'How long does the migration take?',
      a: "1 to 2 hours for most teams. There's no data import. You rebuild event types manually but it's quick.",
    },
    {
      q: 'Will my prospects notice?',
      a: "Some will see the cal.com URL instead of calendly.com but most won't. The booking experience is similar.",
    },
    {
      q: 'Can I self-host Cal.com?',
      a: "Yes. Cal.com is open source. You can self-host on your own infrastructure. Most users don't but the option exists.",
    },
    {
      q: 'Does Cal.com have a Salesforce integration?',
      a: "Yes but it's less polished than Calendly's. If your sales process depends on deep Salesforce sync test carefully before switching.",
    },
    {
      q: 'What about team scheduling?',
      a: "Cal.com supports round-robin and collective event types. The UX is rougher than Calendly's but functional.",
    },
    {
      q: 'Is the mobile app any good?',
      a: "It exists. It's not as polished as Calendly's. If mobile booking is critical this is a real consideration.",
    },
  ],
  featured: true,
  _related_switches: ['calendly-to-savvycal', 'calendly-to-google-calendar', 'acuity-to-cal-com'],
  _related_tools: ['cal-com', 'calendly'],
  _related_stacks: ['solo-founders', 'service-business'],
};

// =============================================================================
// HELPERS
// =============================================================================

async function resolveRef(type, slug) {
  const id = await client.fetch(
    `*[_type == $type && (slug.current == $slug || slug == $slug)][0]._id`,
    { type, slug }
  );
  return id ? { _type: 'reference', _ref: id, _key: slug } : null;
}

async function resolveAllRefs(type, slugs) {
  if (!slugs?.length) return { resolved: [], skipped: [] };
  const resolved = [];
  const skipped = [];
  for (const slug of slugs) {
    const ref = await resolveRef(type, slug);
    if (ref) resolved.push(ref);
    else skipped.push(slug);
  }
  return { resolved, skipped };
}

async function toolExists(slug) {
  const count = await client.fetch(
    `count(*[_type == "tool" && (slug.current == $slug || slug == $slug)])`,
    { slug }
  );
  return count > 0;
}

async function seedTool(toolData) {
  const _id = `tool-${toolData.slug.current}`;
  await client.createOrReplace({ _id, _type: 'tool', ...toolData });
  console.log(`  ✓ ${_id}`);
}

async function seedSwitch(swData) {
  const _id = `switch-${swData.slug.current}`;

  // Pre-flight: verify referenced tools exist
  if (!(await toolExists(swData.from_tool_slug))) {
    throw new Error(`Tool not found: ${swData.from_tool_slug} (referenced as from_tool_slug in ${_id})`);
  }
  if (!(await toolExists(swData.to_tool_slug))) {
    throw new Error(`Tool not found: ${swData.to_tool_slug} (referenced as to_tool_slug in ${_id})`);
  }

  // Resolve related references (skipping any that don't exist)
  const switches = await resolveAllRefs('switch', swData._related_switches);
  const tools = await resolveAllRefs('tool', swData._related_tools);
  const stacks = await resolveAllRefs('stack', swData._related_stacks);

  // Strip the underscore-prefixed staging fields before write
  const { _related_switches, _related_tools, _related_stacks, ...payload } = swData;

  await client.createOrReplace({
    _id,
    _type: 'switch',
    ...payload,
    related_switches: switches.resolved,
    related_tools: tools.resolved,
    related_stacks: stacks.resolved,
  });

  console.log(`  ✓ ${_id}`);
  console.log(`     related_switches: ${switches.resolved.length} resolved, ${switches.skipped.length} skipped${switches.skipped.length ? ` (${switches.skipped.join(', ')})` : ''}`);
  console.log(`     related_tools:    ${tools.resolved.length} resolved, ${tools.skipped.length} skipped${tools.skipped.length ? ` (${tools.skipped.join(', ')})` : ''}`);
  console.log(`     related_stacks:   ${stacks.resolved.length} resolved, ${stacks.skipped.length} skipped${stacks.skipped.length ? ` (${stacks.skipped.join(', ')})` : ''}`);
}

function patchStudioIndex() {
  const indexPath = resolve(STUDIO_DIR, 'schemaTypes/index.ts');
  let content = readFileSync(indexPath, 'utf8');

  if (content.includes("from './switch'")) {
    console.log('  • switchType already registered');
    return false;
  }

  // Insert import line before the `export const schemaTypes` line
  const importLine = "import switchType from './switch';";
  content = content.replace(
    /(\nexport const schemaTypes\s*=\s*\[)/,
    `\n${importLine}\n$1`
  );

  // Add switchType to the array
  content = content.replace(
    /(export const schemaTypes\s*=\s*\[)([^\]]+)(\])/,
    (_, prefix, types, suffix) => `${prefix}${types.trimEnd()}, switchType${suffix}`
  );

  writeFileSync(indexPath, content);
  console.log('  ✓ patched studio schemaTypes/index.ts');
  return true;
}

function runSanityDeploy() {
  return new Promise((resolveProm, rejectProm) => {
    const proc = spawn('npx', ['sanity', 'deploy'], {
      cwd: STUDIO_DIR,
      stdio: 'inherit',
    });
    proc.on('exit', (code) => {
      if (code === 0) resolveProm();
      else rejectProm(new Error(`sanity deploy exited with code ${code}`));
    });
    proc.on('error', rejectProm);
  });
}

// =============================================================================
// RUN
// =============================================================================

async function main() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║  Stackdom content seed                ║');
  console.log('╚══════════════════════════════════════╝\n');

  // Step 1: Seed Tools (must come first — Switches reference them)
  console.log('Step 1/5  Seeding 3 Tool documents');
  await seedTool(LOOPS);
  await seedTool(CAL_COM);
  await seedTool(CALENDLY);

  // Step 2: Seed Switches (references resolved at write time)
  console.log('\nStep 2/5  Seeding 3 Switch documents');
  await seedSwitch(SWITCH_HUBSPOT_TO_PIPEDRIVE);
  await seedSwitch(SWITCH_MAILCHIMP_TO_LOOPS);
  await seedSwitch(SWITCH_CALENDLY_TO_CAL_COM);

  // Step 3: Sync schema file to studio
  console.log('\nStep 3/5  Syncing switch schema to studio');
  copyFileSync(
    resolve(REPO_ROOT, 'sanity/schemas/switch.ts'),
    resolve(STUDIO_DIR, 'schemaTypes/switch.ts')
  );
  console.log(`  ✓ copied switch.ts → ${STUDIO_DIR}/schemaTypes/switch.ts`);

  // Step 4: Patch studio index
  console.log('\nStep 4/5  Patching studio schemaTypes/index.ts');
  patchStudioIndex();

  // Step 5: Deploy studio
  console.log('\nStep 5/5  Deploying studio (interactive)');
  console.log(`         If this hangs, Ctrl+C — content is already seeded.`);
  console.log(`         Manual fallback: cd ${STUDIO_DIR} && npx sanity deploy\n`);
  await runSanityDeploy();

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║  ✓ Done                               ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('\nContent seeded. Studio schema deployed.');
  console.log('Next: push to git → Vercel rebuilds → new pages go live.\n');
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
