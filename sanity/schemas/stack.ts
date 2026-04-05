import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'stack',
  title: 'Stack',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'business_type', title: 'Business Type', type: 'string' }),
    defineField({ name: 'tools', title: 'Tools', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'quick_summary', title: 'Quick Summary', type: 'text' }),
    defineField({ name: 'overview_problem', title: 'Overview: The Problem', type: 'text' }),
    defineField({ name: 'overview_solution', title: 'Overview: The Solution', type: 'text' }),
    defineField({ name: 'overview_how_it_works', title: 'Overview: How It Works', type: 'text' }),
    defineField({ name: 'overview_use_cases', title: 'Overview: Use Cases', type: 'text' }),
    defineField({ name: 'overview_tradeoff', title: 'Overview: The Trade-off', type: 'text' }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text' }),
          defineField({ name: 'tools', title: 'Tools', type: 'array', of: [{ type: 'string' }] }),
        ],
      }],
    }),
    defineField({ name: 'why_it_works', title: 'Why It Works', type: 'text' }),
    defineField({ name: 'who_is_this_for', title: 'Who It\'s For', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'when_to_use', title: 'When to Use It', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'when_not_to_use', title: 'When NOT to Use It', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'alternatives', title: 'Alternatives', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'estimated_monthly_cost', title: 'Estimated Monthly Cost', type: 'string' }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'question', title: 'Question', type: 'string' }),
          defineField({ name: 'answer', title: 'Answer', type: 'text' }),
        ],
      }],
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
  ],
});
