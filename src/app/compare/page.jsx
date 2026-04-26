import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import ToolIcon from '@/components/ToolIcon';
import { getAllComparisons, getAllTools } from '@/lib/sanity';

export const revalidate = 3600;

export const metadata = {
  title: 'Compare Tools Side-by-Side | Stackdom',
  description: 'Detailed head-to-head breakdowns of the tools you\'re considering. Make the right choice, faster.',
  openGraph: {
    title: 'Compare Tools Side-by-Side | Stackdom',
    description: 'Detailed head-to-head breakdowns of the tools you\'re considering. Make the right choice, faster.',
    url: 'https://stackdom.com/compare',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Stackdom Compare' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Tools Side-by-Side | Stackdom',
    description: 'Detailed head-to-head breakdowns of the tools you\'re considering. Make the right choice, faster.',
  },
};

const GRADIENTS = [
  'from-green-400 to-blue-500',
  'from-pink-400 to-purple-500',
  'from-purple-500 to-blue-500',
  'from-orange-400 to-pink-500',
  'from-blue-400 to-teal-500',
];

export default async function Compare() {
  const [comparisons, tools] = await Promise.all([getAllComparisons(), getAllTools()]);
  const toolMap = Object.fromEntries(tools.map((t) => [t.slug, t]));

  const pairings = comparisons.map((c) => {
    const tA = toolMap[c.tool_a_slug];
    const tB = toolMap[c.tool_b_slug];
    return {
      key: c.slug,
      slugA: c.tool_a_slug,
      slugB: c.tool_b_slug,
      nameA: tA?.name || c.tool_a_slug,
      nameB: tB?.name || c.tool_b_slug,
      category: tA?.category || '',
      blurb: c.quick_summary?.split('.')[0] || '',
      websiteA: tA?.website_url,
      websiteB: tB?.website_url,
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
        {pairings.map((pair, idx) => (
          <Link
            key={pair.key}
            href={`/compare/${pair.key}`}
            className="group rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div className={`h-1 bg-gradient-to-r ${GRADIENTS[idx % GRADIENTS.length]}`} />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ToolIcon slug={pair.slugA} name={pair.nameA} size="sm" websiteUrl={pair.websiteA} />
                <span className="text-xs font-medium text-muted-foreground">vs</span>
                <ToolIcon slug={pair.slugB} name={pair.nameB} size="sm" websiteUrl={pair.websiteB} />
              </div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{pair.category}</p>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{pair.nameA} vs {pair.nameB}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{pair.blurb}</p>
              <span className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Compare <ArrowRight className="w-3 h-3" />
              </span>
            </div>
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
