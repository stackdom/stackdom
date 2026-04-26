import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'switch',
  title: 'Switch (Migration Guide)',
  type: 'document',
  fields: [
    // === Core identifiers ===
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Format: from-slug-to-to-slug, e.g. hubspot-to-pipedrive',
      options: {
        source: (doc: any) =>
          doc.from_tool_slug && doc.to_tool_slug
            ? `${doc.from_tool_slug}-to-${doc.to_tool_slug}`
            : '',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'from_tool_slug',
      title: 'From Tool Slug',
      type: 'string',
      description: 'Slug of an existing tool document (e.g. hubspot)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'to_tool_slug',
      title: 'To Tool Slug',
      type: 'string',
      description: 'Slug of an existing tool document (e.g. pipedrive)',
      validation: (Rule) => Rule.required(),
    }),

    // === Hero ===
    defineField({ name: 'category', title: 'Category Tag', type: 'string' }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'intro', title: 'Intro Paragraph', type: 'text' }),

    // === Quick Summary card ===
    defineField({
      name: 'quick_summary',
      title: 'Quick Summary',
      type: 'object',
      fields: [
        defineField({ name: 'annual_saving', title: 'Annual Saving', type: 'string' }),
        defineField({ name: 'migration_time', title: 'Migration Time', type: 'string' }),
        defineField({ name: 'difficulty', title: 'Difficulty', type: 'string' }),
        defineField({ name: 'who_should_switch', title: 'Who Should Switch', type: 'text' }),
        defineField({ name: 'who_should_stay', title: 'Who Should Stay', type: 'text' }),
        defineField({ name: 'verdict', title: 'Verdict (one line)', type: 'string' }),
      ],
    }),

    // === Why switch / Why stay ===
    defineField({
      name: 'why_switch',
      title: 'Why People Switch (3 bullets)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'why_stay',
      title: 'Why People Stay (3 bullets)',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(3),
    }),

    // === Cost comparison table ===
    defineField({
      name: 'cost_intro',
      title: 'Cost Comparison Intro',
      type: 'text',
      description: 'Optional paragraph above the cost table',
    }),
    defineField({
      name: 'cost_rows',
      title: 'Cost Comparison Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'from_value', title: 'From-tool value', type: 'string' }),
            defineField({ name: 'to_value', title: 'To-tool value', type: 'string' }),
            defineField({ name: 'total_saving', title: 'Total Saving (optional)', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({ name: 'cost_footnote', title: 'Cost Footnote', type: 'string' }),

    // === Keep / Lose / Gain ===
    defineField({
      name: 'what_you_keep',
      title: 'What You Keep',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'what_you_lose',
      title: 'What You Lose',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'what_you_gain',
      title: 'What You Gain',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // === Migration time block ===
    defineField({
      name: 'migration_time_intro',
      title: 'Migration Time Intro',
      type: 'text',
      description: 'Optional paragraph above the migration time table',
    }),
    defineField({
      name: 'migration_time_items',
      title: 'Migration Time Line Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Task', type: 'string' }),
            defineField({ name: 'duration', title: 'Duration', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({ name: 'migration_time_total', title: 'Migration Time Total', type: 'string' }),
    defineField({
      name: 'migration_time_notes',
      title: 'Migration Time Notes',
      type: 'text',
      description: 'Optional paragraph below the migration time total',
    }),

    // === Step-by-step guide (markdown bodies, rendered via react-markdown) ===
    defineField({
      name: 'steps',
      title: 'Migration Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Step Body (markdown)',
              type: 'text',
              description: 'Markdown supported: **bold**, [links](url), bullet lists, etc.',
            }),
          ],
        },
      ],
    }),

    // === Gotchas ===
    defineField({
      name: 'gotchas',
      title: 'Gotchas Nobody Tells You',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Explanation', type: 'text' }),
          ],
        },
      ],
    }),

    // === Should you switch? ===
    defineField({
      name: 'definitely_switch',
      title: 'Definitely Switch If…',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'maybe_switch',
      title: 'Maybe Switch If…',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'dont_switch',
      title: "Don't Switch If…",
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // === Final blocks ===
    defineField({
      name: 'final_verdict',
      title: "What We'd Actually Do",
      type: 'text',
    }),
    defineField({
      name: 'before_you_switch_note',
      title: 'A Note Before You Switch (optional)',
      type: 'text',
    }),

    // === FAQ (same shape as comparison) ===
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'q', title: 'Question', type: 'string' }),
            defineField({ name: 'a', title: 'Answer', type: 'text' }),
          ],
        },
      ],
    }),

    // === Related content ===
    defineField({
      name: 'related_switches',
      title: 'Related Switches',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'switch' }] }],
    }),
    defineField({
      name: 'related_tools',
      title: 'Related Tools',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tool' }] }],
    }),
    defineField({
      name: 'related_stacks',
      title: 'Related Stacks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'stack' }] }],
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'headline', from: 'from_tool_slug', to: 'to_tool_slug' },
    prepare({ title, from, to }) {
      return {
        title: title || `${from} → ${to}`,
        subtitle: `${from} → ${to}`,
      };
    },
  },
});
