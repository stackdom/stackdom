import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: 'vfxyxg6k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

// Shared projection fragments
const TOOL_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  name,
  short_description,
  tagline,
  category,
  website_url,
  go_slug,
  monthly_price,
  quick_summary,
  features,
  best_for,
  business_sizes,
  stack_fit,
  overview,
  pros,
  cons,
  pricing_summary,
  pricing_tiers[] {
    name,
    price,
    description
  },
  faqs[] {
    question,
    answer
  },
  why_it_works,
  who_is_this_for,
  when_to_use,
  when_not_to_use,
  use_cases,
  featured
`;

const STACK_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  name,
  description,
  business_type,
  tools,
  quick_summary,
  overview_problem,
  overview_solution,
  overview_how_it_works,
  overview_use_cases,
  overview_tradeoff,
  steps[] {
    title,
    description,
    tools
  },
  why_it_works,
  who_is_this_for,
  when_to_use,
  when_not_to_use,
  alternatives,
  estimated_monthly_cost,
  faqs[] {
    question,
    answer
  },
  featured
`;

const PLAYBOOK_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  title,
  category,
  problem,
  solution,
  tools,
  steps[] {
    title,
    description
  },
  content,
  featured
`;

const GOAL_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  title,
  description,
  icon,
  quick_summary,
  recommended_tools,
  why_this_works,
  who_is_this_for,
  when_to_use,
  when_not_to_use,
  alternatives,
  estimated_monthly_cost,
  steps[] {
    title,
    description,
    tools
  }
`;

// Tools
export async function getAllTools() {
  return client.fetch(
    `*[_type == "tool"] | order(_createdAt desc) [0...100] { ${TOOL_FIELDS} }`
  );
}

export async function getToolBySlug(slug: string) {
  return client.fetch(
    `*[_type == "tool" && (slug.current == $slug || slug == $slug)][0] { ${TOOL_FIELDS} }`,
    { slug }
  );
}

export async function getToolByGoSlug(slug: string) {
  return client.fetch(
    `*[_type == "tool" && go_slug == $slug][0]{ affiliateUrl, website_url }`,
    { slug }
  );
}

// Stacks
export async function getAllStacks() {
  return client.fetch(
    `*[_type == "stack"] | order(_createdAt desc) [0...100] { ${STACK_FIELDS} }`
  );
}

export async function getStackBySlug(slug: string) {
  return client.fetch(
    `*[_type == "stack" && (slug.current == $slug || slug == $slug)][0] { ${STACK_FIELDS} }`,
    { slug }
  );
}

// Playbooks
export async function getAllPlaybooks() {
  return client.fetch(
    `*[_type == "playbook"] | order(_createdAt desc) [0...100] { ${PLAYBOOK_FIELDS} }`
  );
}

export async function getPlaybookBySlug(slug: string) {
  return client.fetch(
    `*[_type == "playbook" && (slug.current == $slug || slug == $slug)][0] { ${PLAYBOOK_FIELDS} }`,
    { slug }
  );
}

// Comparisons
const COMPARISON_LIST_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  tool_a_slug,
  tool_b_slug,
  quick_summary,
  featured
`;

const COMPARISON_DETAIL_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  tool_a_slug,
  tool_b_slug,
  quick_summary,
  overview,
  "key_difference": {
    "a": key_difference_a,
    "b": key_difference_b
  },
  "side_by_side": {
    "a": side_by_side_a,
    "b": side_by_side_b
  },
  "how_they_differ": {
    "a": how_they_differ_a[] { label, text },
    "b": how_they_differ_b[] { label, text }
  },
  "choose_if": {
    "a": choose_if_a,
    "b": choose_if_b
  },
  "who_for": {
    "a": who_for_a,
    "b": who_for_b
  },
  final_verdict,
  "faqs": faqs[] { q, a },
  featured
`;

export async function getAllComparisons() {
  return client.fetch(
    `*[_type == "comparison"] | order(_createdAt desc) { ${COMPARISON_LIST_FIELDS} }`
  );
}

export async function getComparisonBySlug(slug: string) {
  return client.fetch(
    `*[_type == "comparison" && (slug.current == $slug || slug == $slug)][0] { ${COMPARISON_DETAIL_FIELDS} }`,
    { slug }
  );
}

// Switches (migration guides)
const SWITCH_LIST_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  from_tool_slug,
  to_tool_slug,
  category,
  headline,
  intro,
  "annual_saving": quick_summary.annual_saving,
  featured
`;

const SWITCH_DETAIL_FIELDS = `
  "id": _id,
  "slug": coalesce(slug.current, slug),
  from_tool_slug,
  to_tool_slug,
  category,
  headline,
  intro,
  quick_summary,
  why_switch,
  why_stay,
  cost_intro,
  cost_rows[] {
    label,
    from_value,
    to_value,
    total_saving
  },
  cost_footnote,
  what_you_keep,
  what_you_lose,
  what_you_gain,
  migration_time_intro,
  migration_time_items[] {
    label,
    duration
  },
  migration_time_total,
  migration_time_notes,
  steps[] {
    title,
    body
  },
  gotchas[] {
    title,
    body
  },
  definitely_switch,
  maybe_switch,
  dont_switch,
  final_verdict,
  before_you_switch_note,
  faqs[] {
    q,
    a
  },
  "related_switches": related_switches[]->{
    "id": _id,
    "slug": coalesce(slug.current, slug),
    from_tool_slug,
    to_tool_slug,
    category,
    headline,
    "annual_saving": quick_summary.annual_saving
  },
  "related_tools": related_tools[]->{
    "id": _id,
    "slug": coalesce(slug.current, slug),
    name,
    category,
    short_description,
    website_url,
    monthly_price
  },
  "related_stacks": related_stacks[]->{
    "id": _id,
    "slug": coalesce(slug.current, slug),
    name,
    business_type,
    description
  }
`;

export async function getAllSwitches() {
  return client.fetch(
    `*[_type == "switch"] | order(_createdAt desc) { ${SWITCH_LIST_FIELDS} }`
  );
}

export async function getSwitchBySlug(slug: string) {
  return client.fetch(
    `*[_type == "switch" && (slug.current == $slug || slug == $slug)][0] { ${SWITCH_DETAIL_FIELDS} }`,
    { slug }
  );
}

export async function getSwitchSlugs() {
  return client.fetch(
    `*[_type == "switch" && defined(slug.current)]{ "slug": slug.current }`
  );
}

// Site Settings
export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0] { tagline }`
  );
}

// Legal pages
export async function getAllLegalSlugs() {
  return client.fetch(
    `*[_type == "legalPage" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getLegalPage(slug: string) {
  return client.fetch(
    `*[_type == "legalPage" && (slug.current == $slug || slug == $slug)][0] {
      "id": _id,
      "slug": coalesce(slug.current, slug),
      title,
      content,
      lastUpdated
    }`,
    { slug }
  );
}

// Goals
export async function getAllGoals() {
  return client.fetch(
    `*[_type == "goal"] | order(_createdAt desc) { ${GOAL_FIELDS} }`
  );
}

export async function getGoalBySlug(slug: string) {
  return client.fetch(
    `*[_type == "goal" && (slug.current == $slug || slug == $slug)][0] { ${GOAL_FIELDS} }`,
    { slug }
  );
}
