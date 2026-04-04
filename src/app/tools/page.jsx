'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllTools } from '@/lib/sanity';
import SectionHeading from '@/components/SectionHeading';
import ToolCard from '@/components/ToolCard';

const categories = ['All', 'CRM', 'Email', 'Website', 'Automation', 'Analytics', 'Payments', 'Forms', 'Landing Pages', 'Outreach', 'Data', 'Chat', 'Support', 'SEO', 'Content', 'Design', 'Video', 'Ads', 'Testing', 'Scheduling', 'Integrations'];

export default function Tools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getAllTools().then(data => {
      setTools(data);
      setLoading(false);
    });
  }, []);

  const filtered = activeCategory === 'All'
    ? tools
    : tools.filter(t => t.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SectionHeading
        tag="Tools"
        title="Build your stack with the right tools"
        description="Curated, organised and ready to work together for real business growth"
      />

      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map(cat => (
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
        {filtered.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No tools found in this category yet.</p>
        </div>
      )}

      <div className="mt-20 py-16 rounded-3xl bg-muted/50 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Need help choosing?</h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Use our compare tool to see tools side by side, or let our builder recommend the best stack for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/compare">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12">
              Compare tools
            </Button>
          </Link>
          <Link href="/builder">
            <Button size="lg" className="rounded-full px-8 text-base h-12">
              Build your stack <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
