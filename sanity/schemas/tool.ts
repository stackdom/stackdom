import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'tool',
  title: 'Tool',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'short_description', title: 'Short Description', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'category', title: 'Category', type: 'string' }),
    defineField({ name: 'website_url', title: 'Website URL', type: 'url' }),
    defineField({ name: 'affiliateUrl', title: 'Affiliate URL', type: 'url' }),
    defineField({ name: 'go_slug', title: 'Go Slug (redirect vanity)', type: 'string' }),
    defineField({ name: 'monthly_price', title: 'Monthly Price (USD)', type: 'number' }),
    defineField({ name: 'quick_summary', title: 'Quick Summary', type: 'text' }),
    defineField({ name: 'features', title: 'Features', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'best_for', title: 'Best For', type: 'string' }),
    defineField({ name: 'business_sizes', title: 'Business Sizes', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'stack_fit', title: 'Stack Fit', type: 'text' }),
    defineField({ name: 'overview', title: 'Overview', type: 'text' }),
    defineField({ name: 'pros', title: 'Pros', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'cons', title: 'Cons', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'pricing_summary', title: 'Pricing Summary', type: 'text' }),
    defineField({
      name: 'pricing_tiers',
      title: 'Pricing Tiers',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string' }),
          defineField({ name: 'price', title: 'Price', type: 'number' }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
        ],
      }],
    }),
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
    defineField({ name: 'why_it_works', title: 'Why It Works', type: 'text' }),
    defineField({ name: 'who_is_this_for', title: 'Who It\'s For', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'when_to_use', title: 'When to Use It', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'when_not_to_use', title: 'When NOT to Use It', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean' }),
    defineField({ name: 'use_cases', title: 'Use Cases', type: 'array', of: [{ type: 'string' }] }),
  ],
});
