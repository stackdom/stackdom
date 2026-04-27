import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 3600;

export const metadata = {
  title: 'How We Choose — The Stackdom Methodology | Stackdom',
  description:
    'How Stackdom tests tools, prices software honestly and picks recommendations across Lean, Core and Premium tiers. No pay-for-placement. Real opinions only.',
  openGraph: {
    title: 'How We Choose — The Stackdom Methodology | Stackdom',
    description:
      'How Stackdom tests tools, prices software honestly and picks recommendations across Lean, Core and Premium tiers. No pay-for-placement. Real opinions only.',
    url: 'https://stackdom.com/how-we-choose',
    type: 'article',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'How We Choose — Stackdom Methodology' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How We Choose — The Stackdom Methodology | Stackdom',
    description:
      'How Stackdom tests tools, prices software honestly and picks recommendations across Lean, Core and Premium tiers. No pay-for-placement. Real opinions only.',
  },
};

const sectionTag = (label) => (
  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">
    {label}
  </span>
);

// ── Data ────────────────────────────────────────────────────────────────────

const FOUR_PART_TEST = [
  {
    number: '01',
    title: 'Does it actually do the job?',
    body: 'We use the tool ourselves on real projects before we write about it. No spec-sheet reviews. No "based on G2 ratings" round-ups. If we haven\'t logged in, set it up and used it for at least a week it doesn\'t get on the site.',
  },
  {
    number: '02',
    title: 'Is it priced honestly?',
    body: 'We calculate the real cost at small, medium and growing scale. That includes overage fees, integration costs and the upgrades you\'ll hit at month six. The advertised entry price is rarely the price you\'ll actually pay. We say so when it isn\'t.',
  },
  {
    number: '03',
    title: 'Does it lock you in?',
    body: 'Tools that hold your data hostage, hide export options or make migration painful get marked down. Tools with clean APIs, open standards and easy off-ramps get a bonus. Your stack should serve you not trap you.',
  },
  {
    number: '04',
    title: 'Will it still be here in three years?',
    body: "We look at funding stage, product velocity, leadership stability and unit economics. A cheap tool that disappears costs more than an expensive one that lasts. We won't recommend something we'd be embarrassed about in 18 months.",
  },
];

const TIERS = [
  {
    name: 'Lean',
    subtitle: 'Under $15 a month at small scale',
    body: 'Free, freemium, open-source or genuinely cheap. The right answer when you\'re starting out, side-hustling or solving the problem with the smallest viable spend.',
    accent: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900',
    labelColor: 'text-green-700 dark:text-green-400',
  },
  {
    name: 'Core',
    subtitle: '$15 to $100 a month per workspace',
    body: 'The workhorse tier. Real features. Fair pricing. No enterprise tax. Where most growing teams should sit.',
    accent: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900',
    labelColor: 'text-blue-700 dark:text-blue-400',
  },
  {
    name: 'Premium',
    subtitle: '$100+ a month or seat-heavy',
    body: "Justified when you have scale, compliance or integration requirements the Core tier can't meet. Picked carefully.",
    accent: 'border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-900',
    labelColor: 'text-purple-700 dark:text-purple-400',
  },
];

const WONT_DO = [
  {
    title: 'Sponsored placements that aren\'t labelled.',
    body: 'If a tool pays for visibility it\'s marked. Always.',
  },
  {
    title: '"Best 47 tools for X" lists.',
    body: 'Nobody needs 47 options. We give you three picks at most. Lean, Core, Premium.',
  },
  {
    title: 'Reviews of tools we haven\'t used.',
    body: "If we haven't shipped something with it we don't have an opinion worth your time.",
  },
  {
    title: 'Hide our affiliate relationships.',
    body: 'We make money when you click through and sign up for tools we recommend. We disclose it on this page and in our footer.',
  },
];

const WILL_DO = [
  {
    title: 'Recommend free tools when free is the right answer.',
    body: 'Even when we make $0 from it.',
  },
  {
    title: 'Tell you to keep what you\'ve got.',
    body: 'Switching costs are real. Sometimes the right move is no move.',
  },
  {
    title: 'Update tier tags when products change.',
    body: 'Pricing changes. Products get worse. Products get better. We re-test on a rolling basis.',
  },
  {
    title: 'Show our maths.',
    body: 'Every cost comparison includes the assumptions and the workings. You can disagree with our conclusions but you can see how we got there.',
  },
];

const AFFILIATE_POINTS = [
  "We'll never tier-tag a tool based on its commission rate. The verdict drives the link not the other way around.",
  'We disclose affiliate relationships on this page and in the site footer.',
  'The Lean option always gets equal billing even when we make less from it. Often we make nothing.',
];

// ── Page ────────────────────────────────────────────────────────────────────

export default async function HowWeChoose() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">

      {/* 1. Hero */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('Our Methodology')}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          How we choose.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Most SaaS comparison sites make money by recommending whichever tool pays them the most.
          We don't. Stackdom only recommends tools we'd put in our own stack. That means we say no
          to a lot of paid placements. We recommend free tools when free is the right answer. We
          give equal weight to the cheapest option and the most expensive one because the right tool
          depends on your stage not on what we earn. Here's exactly how we evaluate every tool on
          the site.
        </p>
      </div>

      {/* 2. The four-part test */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('The Four-Part Test')}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Every tool gets scored on four dimensions, weighted equally.
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-8">
          {FOUR_PART_TEST.map((item) => (
            <div key={item.number} className="p-6 rounded-2xl border border-border bg-card flex gap-4">
              <span className="text-3xl font-bold text-primary/20 shrink-0 leading-none pt-1">
                {item.number}
              </span>
              <div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Lean / Core / Premium */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('Priced Honestly')}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          The framework: Lean, Core, Premium.
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
          Every tool on Stackdom is tagged as Lean, Core or Premium. Where relevant we tell you
          what your best options are at the tiers above and below. We don't tell you which tier you
          should be in. That depends on your stage and your constraints. We tell you which tier each
          tool sits in and what to consider at the tiers above and below.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <div key={tier.name} className={`p-6 rounded-2xl border ${tier.accent}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${tier.labelColor}`}>
                {tier.name}
              </p>
              <p className="text-sm font-semibold mb-3">{tier.subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{tier.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. When the right answer is no tool */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('Sometimes The Best Tool Is No Tool')}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          When the right answer is no tool at all.
        </h2>
        <div className="p-6 sm:p-8 rounded-2xl bg-accent/50 border border-primary/10">
          <p className="text-base leading-relaxed">
            Sometimes our recommendation is "you don't need a tool for this yet." A spreadsheet
            works. A Notion page works. A weekly manual review works. We'll say so when we mean it.
            You'll find that recommendation on Job pages where it applies. This is the part of
            Stackdom that costs us the most and earns us nothing. We think it's the most useful
            part.
          </p>
        </div>
      </div>

      {/* 5. What we won't do */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('Our Editorial Lines')}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          What we won't do.
        </h2>
        <ul className="space-y-5">
          {WONT_DO.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{item.title}</span>
                <span className="text-muted-foreground"> {item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 6. What we will do */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('Our Editorial Promises')}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
          What we will do.
        </h2>
        <ul className="space-y-5">
          {WILL_DO.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{item.title}</span>
                <span className="text-muted-foreground"> {item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. Who's behind this */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('About The Editor')}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Who's behind this.
        </h2>
        <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
          <p className="text-base leading-relaxed mb-6">
            Stackdom is built and edited by Jason. A B2B marketer with years running paid media, SEO
            and creative for one of Australia's largest telcos. After years of recommending tools to
            teammates based on what was popular instead of what was honest Stackdom is the
            publication I wish existed. If you spot something we got wrong or a tool that should be
            on the site let us know. We update tier tags based on real reader feedback not just our
            own use.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="rounded-full px-6">
              Get in touch <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 8. A note on affiliate links */}
      <div className="mb-16 sm:mb-20">
        {sectionTag('Commercial Transparency')}
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          A note on affiliate links.
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Stackdom uses affiliate links on most tool recommendations. If you click through and sign
          up for a paid plan we may receive a commission at no additional cost to you. Three things
          we promise.
        </p>
        <ol className="space-y-4 mb-6">
          {AFFILIATE_POINTS.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-sm font-bold text-primary shrink-0 w-5 pt-0.5">{i + 1}.</span>
              <p className="text-sm leading-relaxed">{point}</p>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground leading-relaxed">
          If a tool we recommend doesn't have an affiliate program we still recommend it. That's the
          only way this is honest.
        </p>
      </div>

      {/* Final CTA strip */}
      <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 sm:p-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.3),transparent_60%)]" />
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            Ready to find your stack?
          </h2>
          <p className="opacity-70 mb-8 max-w-md mx-auto">
            Start with the Stack Builder or browse curated stacks for your stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/builder">
              <Button size="lg" className="rounded-full px-8 text-base h-12 bg-primary hover:bg-primary/90">
                Build your stack <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/stacks">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base h-12 bg-transparent border-background/40 text-background hover:bg-background/10 hover:text-background">
                Browse stacks
              </Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
