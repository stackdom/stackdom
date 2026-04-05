'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X, ExternalLink, ArrowRight, ChevronDown, ChevronUp, Layers, Users, Lightbulb, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getToolBySlug, getAllTools, getAllStacks, getAllComparisons } from '@/lib/sanity';
import ToolCard from '@/components/ToolCard';
import ToolIcon from '@/components/ToolIcon';

function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-muted/40 transition-colors"
      >
        <span>{question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          <p className="pt-3">{answer}</p>
        </div>
      )}
    </div>
  );
}

function StackFitBlock({ text }) {
  return (
    <div className="rounded-2xl bg-secondary/60 border border-border px-8 py-7 relative overflow-hidden">
      <span className="absolute top-2 left-5 text-8xl font-serif text-primary/10 leading-none select-none">&ldquo;</span>
      <div className="relative">
        <p className="text-base italic text-foreground leading-relaxed mb-4 pl-2">{text}</p>
        <div className="flex items-center gap-2 pl-2">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How it fits your stack</span>
        </div>
      </div>
    </div>
  );
}

export default function ToolDetail() {
  const { slug } = useParams();
  const [tool, setTool] = useState(null);
  const [relatedTools, setRelatedTools] = useState([]);
  const [containingStacks, setContainingStacks] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getToolBySlug(slug),
      getAllTools(),
      getAllStacks(),
      getAllComparisons(),
    ]).then(([found, allTools, allStacks, allComparisons]) => {
      setTool(found || null);
      if (found) {
        const others = allTools.filter(t => t.category === found.category && t.id !== found.id);
        setRelatedTools(others);
        const toolMap = Object.fromEntries(allTools.map(t => [t.slug, t]));
        setComparisons(
          allComparisons
            .filter(c => c.tool_a_slug === found.slug || c.tool_b_slug === found.slug)
            .map(c => {
              const otherSlug = c.tool_a_slug === found.slug ? c.tool_b_slug : c.tool_a_slug;
              return { id: c.id, compSlug: c.slug, otherTool: toolMap[otherSlug] || { name: otherSlug } };
            })
        );
        setContainingStacks(allStacks.filter(s => (s.tools || []).includes(found.name)));
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link href="/tools"><Button variant="outline">Back to tools</Button></Link>
      </div>
    );
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    ...(tool.quick_summary || tool.short_description
      ? { description: tool.quick_summary || tool.short_description }
      : {}),
    ...(tool.website_url ? { url: tool.website_url } : {}),
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    ...(tool.monthly_price != null
      ? { offers: { '@type': 'Offer', price: tool.monthly_price, priceCurrency: 'USD' } }
      : {}),
  };

  const faqSchema = tool.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Link href="/tools" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All tools
      </Link>

      <div className="flex items-start gap-5 mb-4">
        <ToolIcon slug={tool.slug} name={tool.name} size="lg" websiteUrl={tool.website_url} />
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{tool.name}</h1>
            <Badge variant="secondary">{tool.category}</Badge>
          </div>
          {(tool.tagline || tool.short_description) && (
            <p className="text-base text-muted-foreground font-normal mt-1 leading-snug">{tool.tagline || tool.short_description}</p>
          )}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {tool.monthly_price != null && (
              <span className="text-sm font-semibold">
                {tool.monthly_price === 0 ? 'Free' : `From $${tool.monthly_price}/mo`}
              </span>
            )}
            {(tool.go_slug || tool.slug) && (
              <a href={`/go/${tool.go_slug || tool.slug}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary/90 transition-colors">
                Visit website <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        {tool.quick_summary && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Quick Summary</h2>
            <p className="text-muted-foreground leading-relaxed">{tool.quick_summary}</p>
          </div>
        )}

        {(tool.features?.length > 0 || tool.best_for || tool.business_sizes?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-5">
            {tool.features?.length > 0 && (
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-base font-bold mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {tool.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-5">
              {tool.best_for && (
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <h2 className="text-base font-bold mb-3">Best For</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tool.best_for}</p>
                </div>
              )}
              {tool.business_sizes?.length > 0 && (
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <h2 className="text-base font-bold mb-3">Team Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {tool.business_sizes.map(size => (
                      <span key={size} className="px-4 py-1.5 text-sm border border-border rounded-full text-foreground bg-background">{size}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tool.stack_fit && <StackFitBlock text={tool.stack_fit} />}

        {tool.overview && (() => {
          const paras = tool.overview.split('\n\n').map(p => p.trim()).filter(Boolean);
          return (
            <div className="rounded-2xl bg-muted/40 px-7 py-6">
              <h2 className="text-xl font-semibold mb-6">Overview</h2>
              <div className="relative">
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-6">
                  {paras.map((para, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="relative z-10 w-7 h-7 rounded-full bg-accent border-2 border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className={`text-sm leading-relaxed pb-1 ${i === 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{para}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {tool.use_cases?.length > 0 && (
          <div className="rounded-2xl bg-muted/40 px-7 py-6">
            <h2 className="text-xl font-semibold mb-4">Use Cases</h2>
            <ul className="space-y-2.5">
              {tool.use_cases.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 shrink-0">→</span>
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(tool.pros?.length > 0 || tool.cons?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            {tool.pros?.length > 0 && (
              <div className="p-6 rounded-2xl bg-accent/50 border border-primary/10">
                <h3 className="font-semibold mb-4 text-primary">Pros</h3>
                <ul className="space-y-2.5">
                  {tool.pros.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.cons?.length > 0 && (
              <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
                <h3 className="font-semibold mb-4 text-destructive">Cons</h3>
                <ul className="space-y-2.5">
                  {tool.cons.map(c => (
                    <li key={c} className="flex items-start gap-2 text-sm">
                      <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {(tool.pricing_summary || tool.monthly_price != null || tool.pricing_tiers?.length > 0) && (
          <div className="rounded-2xl bg-muted/40 px-7 py-6">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            {tool.pricing_tiers?.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {tool.pricing_tiers.map((tier, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-border bg-card">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{tier.name}</p>
                    <p className="text-3xl font-bold tracking-tight mb-2">
                      {tier.price === 0 ? 'Free' : `$${tier.price}`}
                      {tier.price > 0 && <span className="text-base font-normal text-muted-foreground">/mo</span>}
                    </p>
                    {tier.description && <p className="text-sm text-muted-foreground">{tier.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {tool.monthly_price != null && (
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Starting from</p>
                    <p className="text-3xl font-bold tracking-tight">{tool.monthly_price === 0 ? 'Free' : `$${tool.monthly_price}`}{tool.monthly_price > 0 && <span className="text-base font-normal text-muted-foreground">/mo</span>}</p>
                  </div>
                )}
                {tool.pricing_summary && (
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Plan details</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.pricing_summary}</p>
                  </div>
                )}
              </div>
            )}
            {(tool.go_slug || tool.slug) && (
              <p className="text-xs text-muted-foreground mt-3">
                Pricing may vary. <a href={`/go/${tool.go_slug || tool.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Check {tool.name} website</a> for current plans.
              </p>
            )}
          </div>
        )}

        {tool.why_it_works && (
          <div className="p-6 rounded-2xl bg-foreground text-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.25),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Why it works</span>
              </div>
              <p className="text-base leading-relaxed opacity-85">{tool.why_it_works}</p>
            </div>
          </div>
        )}

        {(tool.who_is_this_for?.length > 0 || tool.when_to_use?.length > 0 || tool.when_not_to_use?.length > 0) && (
          <div className="grid md:grid-cols-3 gap-5">
            {tool.who_is_this_for?.length > 0 && (
              <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-semibold text-sm">Who it's for</h2>
                </div>
                <ul className="space-y-2.5">
                  {tool.who_is_this_for.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.when_to_use?.length > 0 && (
              <div className="p-6 rounded-2xl bg-accent/50 border border-primary/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="font-semibold text-sm">When to use it</h2>
                </div>
                <ul className="space-y-2.5">
                  {tool.when_to_use.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.when_not_to_use?.length > 0 && (
              <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <h2 className="font-semibold text-sm">When NOT to use it</h2>
                </div>
                <ul className="space-y-2.5">
                  {tool.when_not_to_use.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {comparisons.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Compare {tool.name}</h2>
            <div className="flex flex-wrap gap-3">
              {comparisons.map(comp => (
                  <Link key={comp.id} href={`/compare/${comp.compSlug}`}>
                    <Button variant="outline" size="sm" className="rounded-full">
                      {tool.name} vs {comp.otherTool.name} <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {tool.faqs?.length > 0 && (
          <div className="rounded-2xl bg-muted/40 px-7 py-6">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {tool.faqs.map((faq, i) => (
                <FAQ key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        )}

        {containingStacks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Used in stacks</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {containingStacks.map(s => (
                <Link
                  key={s.id}
                  href={`/stacks/${s.slug}`}
                  className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                >
                  <div>
                    <p className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.business_type}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedTools.length > 0 && (
          <div className="rounded-2xl bg-muted/40 px-7 py-6">
            <h2 className="text-xl font-semibold mb-2">{tool.name} alternatives</h2>
            <p className="text-sm text-muted-foreground mb-5">Other tools in the {tool.category} category worth considering.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {relatedTools.slice(0, 6).map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4">
          <Link href="/compare">
            <Button variant="outline" className="rounded-full px-6">Compare tools</Button>
          </Link>
          <Link href="/builder">
            <Button className="rounded-full px-6">Build your stack <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
