import { defineType, defineField } from 'sanity';

const sideBySideFields = [
  defineField({ name: 'best_for', title: 'Best For', type: 'string' }),
  defineField({ name: 'standout', title: 'Standout', type: 'string' }),
  defineField({ name: 'weakness', title: 'Weakness', type: 'string' }),
  defineField({ name: 'price', title: 'Price', type: 'string' }),
  defineField({ name: 'team_size', title: 'Team Size', type: 'string' }),
  defineField({ name: 'ease', title: 'Ease of Use', type: 'string' }),
];

const chunkFields = [
  defineField({ name: 'label', title: 'Label', type: 'string' }),
  defineField({ name: 'text', title: 'Text', type: 'text' }),
];

export default defineType({
  name: 'comparison',
  title: 'Comparison',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'tool_a_slug' },
      validation: Rule => Rule.required(),
    }),
    defineField({ name: 'tool_a_slug', title: 'Tool A Slug', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'tool_b_slug', title: 'Tool B Slug', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'quick_summary', title: 'Quick Summary', type: 'text' }),
    defineField({ name: 'overview', title: 'Overview', type: 'text' }),
    defineField({ name: 'key_difference_a', title: 'Key Difference (Tool A)', type: 'text' }),
    defineField({ name: 'key_difference_b', title: 'Key Difference (Tool B)', type: 'text' }),
    defineField({
      name: 'side_by_side_a',
      title: 'Side by Side (Tool A)',
      type: 'object',
      fields: sideBySideFields,
    }),
    defineField({
      name: 'side_by_side_b',
      title: 'Side by Side (Tool B)',
      type: 'object',
      fields: sideBySideFields,
    }),
    defineField({
      name: 'how_they_differ_a',
      title: 'How They Differ (Tool A)',
      type: 'array',
      of: [{ type: 'object', fields: chunkFields }],
    }),
    defineField({
      name: 'how_they_differ_b',
      title: 'How They Differ (Tool B)',
      type: 'array',
      of: [{ type: 'object', fields: chunkFields }],
    }),
    defineField({
      name: 'choose_if_a',
      title: 'Choose If (Tool A)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'choose_if_b',
      title: 'Choose If (Tool B)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'who_for_a',
      title: 'Who It\'s For (Tool A)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'who_for_b',
      title: 'Who It\'s For (Tool B)',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'final_verdict', title: 'Final Verdict', type: 'text' }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'q', title: 'Question', type: 'string' }),
          defineField({ name: 'a', title: 'Answer', type: 'text' }),
        ],
      }],
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'slug.current', subtitle: 'quick_summary' },
    prepare({ title, subtitle }) {
      return { title: title || 'Untitled comparison', subtitle };
    },
  },
});
