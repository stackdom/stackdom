'use client';

import { useState } from 'react';
import ToolCard from '@/components/ToolCard';

const categories = ['All', 'CRM', 'Email', 'Website', 'Automation', 'Analytics', 'Payments', 'Forms', 'Landing Pages', 'Outreach', 'Data', 'Chat', 'Support', 'SEO', 'Content', 'Design', 'Video', 'Ads', 'Testing', 'Scheduling', 'Integrations'];

export default function ToolsBrowser({ tools }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No tools found in this category yet.</p>
        </div>
      )}
    </>
  );
}
