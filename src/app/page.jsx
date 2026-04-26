import Link from 'next/link';
import { ArrowRight, Target, Shield, Layers, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllTools, getAllStacks } from '@/lib/sanity';
import SectionHeading from '@/components/SectionHeading';
import GoalStackGrid, { GOAL_SLUGS } from '@/components/GoalStackGrid';
import ToolCard from '@/components/ToolCard';
import StackCard from '@/components/StackCard';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';

export const revalidate = 3600;

export const metadata = {
  title: 'Stackdom — Build a Growth Stack That Actually Works',
  description: 'Curated tools. Proven stacks. No guesswork. Just go. Build the right software stack for your business in minutes.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Stackdom — Build a Growth Stack That Actually Works',
    description: 'Curated tools. Proven stacks. No guesswork. Just go. Build the right software stack for your business in minutes.',
    url: 'https://stackdom.com/',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Stackdom' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stackdom — Build a Growth Stack That Actually Works',
    description: 'Curated tools. Proven stacks. No guesswork. Just go.',
  },
};

const WHY_ITEMS = [
  { icon: Target, title: 'No more guesswork', desc: 'Data-driven recommendations based on your actual business needs.' },
  { icon: Shield, title: 'Curated picks', desc: 'Every tool is vetted. No pay-to-play listings or sponsored results.' },
  { icon: Layers, title: 'Built for real businesses', desc: 'Stacks designed by operators who have been in your shoes.' },
  { icon: Clock, title: 'Save time and money', desc: "Stop paying for tools you don't need. Get the right stack from day one." },
];

export default async function Home() {
  const [allTools, allStacks] = await Promise.all([getAllTools(), getAllStacks()]);

  const tools = allTools.slice(0, 8);
  const featuredStacks = allStacks.filter((s) => s.featured).slice(0, 3);
  const goalStacks = allStacks.filter((s) => GOAL_SLUGS.includes(s.slug));

  return (
    <div>
      <HeroSection />
      <HowItWorksSection />

      <GoalStackGrid goals={goalStacks} />

      {/* Featured Stacks */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading tag="Featured stacks" title="Curated stacks that just work" description="Pre-built combinations of tools tailored for specific business types. Skip the research." />
          <div className="grid md:grid-cols-3 gap-6">
            {featuredStacks.map((stack, idx) => (
              <StackCard key={stack.id} stack={stack} index={idx} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/stacks">
              <Button variant="outline" className="rounded-full px-6">
                View all stacks <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading tag="Explore tools" title="The tools that power great businesses" description="Curated, vetted, and categorized. Every tool in our directory is one we'd actually recommend." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/tools">
              <Button variant="outline" className="rounded-full px-6">
                Browse all tools <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Stackdom */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading tag="Why Stackdom" title="Built for real businesses" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 sm:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.3),transparent_60%)]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Build your stack in minutes</h2>
              <p className="text-lg opacity-70 mb-8 max-w-lg mx-auto">
                Join thousands of businesses using Stackdom to find the right tools — fast.
              </p>
              <Link href="/builder">
                <Button size="lg" className="rounded-full px-8 text-base h-12 bg-primary hover:bg-primary/90">
                  Get started free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
