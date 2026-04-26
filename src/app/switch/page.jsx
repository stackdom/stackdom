import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';
import ToolIcon from '@/components/ToolIcon';
import { getAllSwitches, getAllTools } from '@/lib/sanity';

export const revalidate = 3600;

export const metadata = {
  title: 'Switch Tools Without Losing Data | Stackdom',
  description: "Step-by-step migration guides with real cost savings. Switch tools without losing data, time, or your mind.",
  openGraph: {
    title: 'Switch Tools Without Losing Data | Stackdom',
    description: 'Step-by-step migration guides with real cost savings.',
    url: 'https://stackdom.com/switch',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Stackdom Switch' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Switch Tools Without Losing Data | Stackdom',
    description: 'Step-by-step migration guides with real cost savings.',
  },
};

const GRADIENTS = [
  'from-green-400 to-blue-500',
  'from-pink-400 to-purple-500',
  'from-purple-500 to-blue-500',
  'from-orange-400 to-pink-500',
  'from-blue-400 to-teal-500',
];

export default async function Switches() {
  const [switches, tools] = await Promise.all([getAllSwitches(), getAllTools()]);
  const toolMap = Object.fromEntries(tools.map((t) => [t.slug, t]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SectionHeading
        tag="Switch"
        title="Switch tools without losing data"
        description="Step-by-step migration guides with real cost savings"
      />

      {switches.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {switches.map((sw, idx) => {
            const fromTool = toolMap[sw.from_tool_slug];
            const toTool = toolMap[sw.to_tool_slug];
            return (
              <Link
                key={sw.id}
                href={`/switch/${sw.slug}`}
                className="group rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${GRADIENTS[idx % GRADIENTS.length]}`} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ToolIcon
                      slug={sw.from_tool_slug}
                      name={fromTool?.name || sw.from_tool_slug}
                      size="sm"
                      websiteUrl={fromTool?.website_url}
                    />
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <ToolIcon
                      slug={sw.to_tool_slug}
                      name={toTool?.name || sw.to_tool_slug}
                      size="sm"
                      websiteUrl={toTool?.website_url}
                    />
                  </div>
                  {sw.category && (
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{sw.category}</p>
                  )}
                  <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors leading-tight">
                    {sw.headline || `Switch from ${fromTool?.name || sw.from_tool_slug} to ${toTool?.name || sw.to_tool_slug}`}
                  </h3>
                  {sw.annual_saving && (
                    <span className="inline-flex items-center bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1 mb-3">
                      Save {sw.annual_saving}/yr
                    </span>
                  )}
                  {sw.intro && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{sw.intro}</p>
                  )}
                  <span className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read guide <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No migration guides yet. Check back soon.</p>
        </div>
      )}

      <div className="mt-20 py-16 rounded-3xl bg-muted/50 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Not sure if switching is right?</h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Compare tools side-by-side or let our builder recommend the best stack for your business.
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
