'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import ToolIcon from '@/components/ToolIcon';
import { COMPARISONS } from '@/data/comparisons';
import { getAllTools } from '@/lib/sanity';

export default function Compare() {
  const [toolMap, setToolMap] = useState({});

  useEffect(() => {
    getAllTools().then(tools => {
      const map = {};
      tools.forEach(t => { map[t.slug] = t; });
      setToolMap(map);
    });
  }, []);

  const pairings = Object.keys(COMPARISONS).map(key => {
    const [slugA, slugB] = key.split('-vs-');
    const tA = toolMap[slugA];
    const tB = toolMap[slugB];
    return {
      key,
      slugA, slugB,
      nameA: tA?.name || slugA,
      nameB: tB?.name || slugB,
      category: tA?.category || '',
      blurb: COMPARISONS[key].quick_summary?.split('.')[0] || '',
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SectionHeading
        tag="Compare Tools"
        title="Choose the right tools, faster"
        description="Side-by-side breakdowns of the tools you're considering"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pairings.map(pair => (
          <Link
            key={pair.key}
            href={`/compare/${pair.key}`}
            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <ToolIcon slug={pair.slugA} name={pair.nameA} size="sm" />
              <span className="text-xs font-medium text-muted-foreground">vs</span>
              <ToolIcon slug={pair.slugB} name={pair.nameB} size="sm" />
            </div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{pair.category}</p>
            <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{pair.nameA} vs {pair.nameB}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{pair.blurb}</p>
            <span className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Compare <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-20 py-16 rounded-3xl bg-muted/50 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Still not sure which to choose?</h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Let our stack builder recommend the best tools based on your specific needs.
        </p>
        <Link href="/builder">
          <Button size="lg" className="rounded-full px-8 text-base h-12">
            Build your custom stack <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
