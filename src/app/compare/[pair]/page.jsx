'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, Target, Users, Zap, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getToolBySlug, getAllStacks, getComparisonBySlug } from '@/lib/sanity';
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
        <span className="text-muted-foreground shrink-0 ml-2">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-muted/20">
          <p className="pt-3">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function CompareDetail() {
  const { pair } = useParams();
  const [toolA, setToolA] = useState(null);
  const [toolB, setToolB] = useState(null);
  const [content, setContent] = useState(null);
  const [relatedStacks, setRelatedStacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pair) { setLoading(false); return; }
    getComparisonBySlug(pair).then(comparison => {
      if (!comparison) { setLoading(false); return; }
      setContent(comparison);
      Promise.all([
        getToolBySlug(comparison.tool_a_slug),
        getToolBySlug(comparison.tool_b_slug),
        getAllStacks(),
      ]).then(([tA, tB, stacks]) => {
        setToolA(tA || null);
        setToolB(tB || null);
        if (tA && tB) {
          setRelatedStacks(stacks.filter(s => (s.tools || []).includes(tA.name) || (s.tools || []).includes(tB.name)).slice(0, 4));
        }
        setLoading(false);
      });
    });
  }, [pair]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!toolA || !toolB) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Comparison not found</h1>
        <Link href="/compare"><Button variant="outline">Back to comparisons</Button></Link>
      </div>
    );
  }

  const allFeatures = [...new Set([...(toolA.features || []), ...(toolB.features || [])])];
  const sb = content?.side_by_side;

  const faqSchema = content?.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Link href="/compare" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All comparisons
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <ToolIcon slug={toolA.slug} name={toolA.name} size="lg" />
          <span className="text-2xl font-bold text-muted-foreground">vs</span>
          <ToolIcon slug={toolB.slug} name={toolB.name} size="lg" />
        </div>
        <Badge variant="secondary" className="mb-3">{toolA.category}</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{toolA.name} vs {toolB.name}</h1>
        {content?.quick_summary && (
          <p className="text-lg text-muted-foreground leading-relaxed">{content.quick_summary}</p>
        )}
      </div>

      {content?.overview && (
        <div className="mb-10 p-6 rounded-2xl bg-muted/40 border border-border">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-3">Overview</span>
          <p className="text-sm leading-relaxed text-foreground">{content.overview}</p>
        </div>
      )}

      {content?.key_difference && (
        <div className="mb-10 grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-accent/50 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <ToolIcon slug={toolA.slug} name={toolA.name} size="sm" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Best for</span>
            </div>
            <p className="text-sm leading-relaxed">{content.key_difference.a}</p>
          </div>
          <div className="p-5 rounded-2xl bg-secondary/40 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <ToolIcon slug={toolB.slug} name={toolB.name} size="sm" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Best for</span>
            </div>
            <p className="text-sm leading-relaxed">{content.key_difference.b}</p>
          </div>
        </div>
      )}

      {sb && (
        <div className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">At a glance</span>
          <div className="grid md:grid-cols-2 gap-6">
            {[{ tool: toolA, data: sb.a }, { tool: toolB, data: sb.b }].map(({ tool, data }) => (
              <div key={tool.id} className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                  <h3 className="font-semibold">{tool.name}</h3>
                </div>
                <dl className="space-y-2 text-sm mb-5">
                  {[
                    ['Best for', data.best_for],
                    ['Standout', data.standout],
                    ['Trade-off', data.weakness],
                    ['Starting price', data.price],
                    ['Team size', data.team_size],
                    ['Ease of use', data.ease],
                  ].map(([label, val]) => (
                    <div key={label} className="flex gap-2">
                      <dt className="text-muted-foreground shrink-0 w-28">{label}</dt>
                      <dd className="font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={`/tools/${tool.slug}`}>
                  <Button className="rounded-full px-5">More info</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {allFeatures.length > 0 && (
        <div className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">Features</span>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold">Feature</th>
                  <th className="p-4 text-center text-sm font-semibold">{toolA.name}</th>
                  <th className="p-4 text-center text-sm font-semibold">{toolB.name}</th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, i) => (
                  <tr key={feature} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="p-4 text-sm text-muted-foreground">{feature}</td>
                    <td className="p-4 text-center">
                      {(toolA.features || []).includes(feature)
                        ? <Check className="w-5 h-5 text-primary mx-auto" />
                        : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                    </td>
                    <td className="p-4 text-center">
                      {(toolB.features || []).includes(feature)
                        ? <Check className="w-5 h-5 text-primary mx-auto" />
                        : <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {content?.how_they_differ && (() => {
        const CHUNK_ICONS = { 'The problem it solves': Target, 'Who gets the most value': Users, 'AI & standout features': Zap, 'The trade-off': AlertTriangle };
        const CHUNK_COLORS = { 'The problem it solves': 'text-primary', 'Who gets the most value': 'text-primary', 'AI & standout features': 'text-primary', 'The trade-off': 'text-destructive' };
        return (
          <div className="mb-10">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">In practice</span>
            <h2 className="text-2xl font-bold tracking-tight mb-6">How they differ in the real world</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[{ tool: toolA, chunks: content.how_they_differ.a }, { tool: toolB, chunks: content.how_they_differ.b }].map(({ tool, chunks }) => (
                <div key={tool.id} className="p-6 rounded-2xl border border-border bg-card">
                  <div className="flex items-center gap-3 mb-5">
                    <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                    <h3 className="font-semibold">{tool.name}</h3>
                  </div>
                  <div className="space-y-4">
                    {chunks.map((chunk, i) => {
                      const Icon = CHUNK_ICONS[chunk.label] || Zap;
                      const iconColor = CHUNK_COLORS[chunk.label] || 'text-primary';
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="mt-0.5 shrink-0">
                            <Icon className={`w-4 h-4 ${iconColor}`} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{chunk.label}</p>
                            <p className="text-sm leading-relaxed text-foreground">{chunk.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="mb-10">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">Pros & cons</span>
        <div className="grid md:grid-cols-2 gap-6">
          {[toolA, toolB].map(tool => (
            <div key={tool.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              {tool.pros?.length > 0 && (
                <div className="p-5 rounded-2xl bg-accent/50 border border-primary/10">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Pros</p>
                  <ul className="space-y-2">
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
                <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10">
                  <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-3">Cons</p>
                  <ul className="space-y-2">
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
          ))}
        </div>
      </div>

      <div className="mb-10">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">Pricing</span>
        <div className="grid md:grid-cols-2 gap-6">
          {[toolA, toolB].map(tool => (
            <div key={tool.id} className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                <h3 className="font-semibold">{tool.name}</h3>
              </div>
              {tool.monthly_price != null && (
                <p className="text-2xl font-bold mb-1">
                  {tool.monthly_price === 0 ? 'Free' : `$${tool.monthly_price}/mo`}
                  {tool.monthly_price > 0 && <span className="text-sm font-normal text-muted-foreground"> starting</span>}
                </p>
              )}
              <p className="text-sm text-muted-foreground">{tool.pricing_summary || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {content?.choose_if && (
        <div className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">Which is right for you?</span>
          <div className="grid md:grid-cols-2 gap-6">
            {[{ tool: toolA, items: content.choose_if.a }, { tool: toolB, items: content.choose_if.b }].map(({ tool, items }) => (
              <div key={tool.id} className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                  <h3 className="font-semibold text-sm">Choose {tool.name} if…</h3>
                </div>
                <ul className="space-y-2.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {content?.who_for && (
        <div className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">Who it's for</span>
          <div className="grid md:grid-cols-2 gap-6">
            {[{ tool: toolA, items: content.who_for.a }, { tool: toolB, items: content.who_for.b }].map(({ tool, items }) => (
              <div key={tool.id} className="p-6 rounded-2xl bg-secondary/30 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                  <h3 className="font-semibold text-sm">{tool.name}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {content?.final_verdict && (
        <div className="mb-10 p-6 rounded-2xl bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.25),transparent_60%)]" />
          <div className="relative">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-primary/20 text-primary rounded-full mb-3">Final verdict</span>
            <p className="text-base leading-relaxed opacity-85">{content.final_verdict}</p>
          </div>
        </div>
      )}

      {relatedStacks.length > 0 && (
        <div className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">Related stacks</span>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedStacks.map(s => (
              <Link
                key={s.id}
                href={`/stacks/${s.slug}`}
                className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">{s.business_type}</p>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {content?.faqs?.length > 0 && (
        <div className="mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">FAQs</span>
          <div className="space-y-2">
            {content.faqs.map((faq, i) => (
              <FAQ key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href={`/tools/${toolA.slug}`}>
          <Button variant="outline" className="rounded-full px-6">View {toolA.name}</Button>
        </Link>
        <Link href={`/tools/${toolB.slug}`}>
          <Button variant="outline" className="rounded-full px-6">View {toolB.name}</Button>
        </Link>
        <Link href="/compare">
          <Button variant="outline" className="rounded-full px-6">Compare more tools</Button>
        </Link>
        <Link href="/builder">
          <Button className="rounded-full px-6">Build your stack <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </Link>
      </div>
    </div>
  );
}
