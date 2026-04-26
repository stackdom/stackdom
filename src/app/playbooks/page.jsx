import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllPlaybooks } from '@/lib/sanity';
import SectionHeading from '@/components/SectionHeading';
import PlaybookCard from '@/components/PlaybookCard';

export const revalidate = 3600;

export const metadata = {
  title: 'Playbooks — Step-by-Step Growth Guides | Stackdom',
  description: 'Actionable playbooks that connect tools into real business outcomes. No fluff, just practical advice you can implement today.',
  openGraph: {
    title: 'Playbooks — Step-by-Step Growth Guides | Stackdom',
    description: 'Actionable playbooks that connect tools into real business outcomes. No fluff, just practical advice.',
    url: 'https://stackdom.com/playbooks',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Stackdom Playbooks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playbooks — Step-by-Step Growth Guides | Stackdom',
    description: 'Actionable playbooks that connect tools into real business outcomes.',
  },
};

export default async function Playbooks() {
  const playbooks = await getAllPlaybooks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SectionHeading
        tag="Playbooks"
        title="Actionable guides for real results"
        description="Step-by-step playbooks that connect tools into real business outcomes. No fluff, just practical advice."
      />
      <div className="grid md:grid-cols-2 gap-6">
        {playbooks.map((p) => (
          <PlaybookCard key={p.id} playbook={p} />
        ))}
      </div>
      {playbooks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No playbooks yet. Check back soon.</p>
        </div>
      )}

      <div className="mt-20 py-16 rounded-3xl bg-muted/50 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Ready to build your stack?</h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Get personalized recommendations and start implementing with our playbooks.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/builder">
            <Button size="lg" className="rounded-full px-8 text-base h-12">
              Build your stack <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/tools">
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12">
              Explore tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
