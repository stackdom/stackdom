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
