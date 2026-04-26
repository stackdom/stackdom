import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllTools } from '@/lib/sanity';
import SectionHeading from '@/components/SectionHeading';
import ToolsBrowser from './ToolsBrowser';

export const revalidate = 3600;

export const metadata = {
  title: 'All Tools — Curated Software Catalogue | Stackdom',
  description: 'Browse curated marketing, sales, and ops tools. Filter by category, compare side-by-side, and build your perfect stack.',
  openGraph: {
    title: 'All Tools — Curated Software Catalogue | Stackdom',
    description: 'Browse curated marketing, sales, and ops tools. Filter by category, compare side-by-side, and build your perfect stack.',
    url: 'https://stackdom.com/tools',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Stackdom Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Tools — Curated Software Catalogue | Stackdom',
    description: 'Browse curated marketing, sales, and ops tools. Filter by category, compare side-by-side, and build your perfect stack.',
  },
};

export default async function Tools() {
  const tools = await getAllTools();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SectionHeading
        tag="Tools"
        title="Build your stack with the right tools"
        description="Curated, organised and ready to work together for real business growth"
      />

      <ToolsBrowser tools={tools} />

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
