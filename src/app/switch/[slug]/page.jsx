import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, X, AlertTriangle, Clock, DollarSign, Zap, Info, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import {
  getAllSwitches,
  getSwitchBySlug,
  getToolBySlug,
} from '@/lib/sanity';
import ToolIcon from '@/components/ToolIcon';
import FAQAccordion from './FAQAccordion';

export const revalidate = 3600;

export async function generateStaticParams() {
  const switches = await getAllSwitches();
  return switches.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const sw = await getSwitchBySlug(slug);
  if (!sw) return {};

  const [fromTool, toTool] = await Promise.all([
    getToolBySlug(sw.from_tool_slug),
    getToolBySlug(sw.to_tool_slug),
  ]);
  if (!fromTool || !toTool) return {};

  const title = `Switch from ${fromTool.name} to ${toTool.name} — Migration Guide and Real Costs | Stackdom`;
  const rawDesc =
    sw.intro ||
    `Step-by-step guide to migrate from ${fromTool.name} to ${toTool.name}. Time, cost, and what you'll keep, lose, or gain.`;
  const description = rawDesc.length > 160 ? rawDesc.slice(0, 157).trimEnd() + '…' : rawDesc;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://stackdom.com/switch/${slug}`,
      type: 'article',
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

// Compute the affiliate / outbound href for the to-tool CTA.
// Prefer the /go/[go_slug] redirect (affiliate-aware) when go_slug is present;
// otherwise link directly to the tool's website_url.
function ctaHref(tool) {
  if (!tool) return '#';
  if (tool.go_slug) return `/go/${tool.go_slug}`;
  if (tool.website_url) return tool.website_url;
  return `/tools/${tool.slug}`;
}

export default async function SwitchDetail({ params }) {
  const { slug } = await params;

  const sw = await getSwitchBySlug(slug);
  if (!sw) notFound();

  const [fromTool, toTool] = await Promise.all([
    getToolBySlug(sw.from_tool_slug),
    getToolBySlug(sw.to_tool_slug),
  ]);

  if (!fromTool || !toTool) notFound();

  const toCta = ctaHref(toTool);

  // === Structured data (server-rendered) ===
  const howToSchema = sw.steps?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: sw.headline || `Switch from ${fromTool.name} to ${toTool.name}`,
    description: sw.intro || undefined,
    totalTime: sw.migration_time_total || sw.quick_summary?.migration_time || undefined,
    step: sw.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  } : null;

  const faqSchema = sw.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sw.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://stackdom.com/' },
      { '@type': 'ListItem', position: 2, name: 'Switch', item: 'https://stackdom.com/switch' },
      { '@type': 'ListItem', position: 3, name: sw.headline || `${fromTool.name} to ${toTool.name}`, item: `https://stackdom.com/switch/${slug}` },
    ],
  };

  const sectionTag = (label) => (
    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-4">
      {label}
    </span>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {howToSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      )}
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* 1. Breadcrumb */}
      <Link href="/switch" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All switches
      </Link>

      {/* 2. Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <ToolIcon slug={fromTool.slug} name={fromTool.name} size="lg" websiteUrl={fromTool.website_url} />
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
          <ToolIcon slug={toTool.slug} name={toTool.name} size="lg" websiteUrl={toTool.website_url} />
        </div>
        {sw.category && <Badge variant="secondary" className="mb-3">{sw.category}</Badge>}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{sw.headline}</h1>
        {sw.intro && (
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">{sw.intro}</p>
        )}
        <div className="flex flex-wrap gap-3">
          <a href={toCta} target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button size="lg" className="rounded-full px-6">
              Try {toTool.name} <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </a>
          <Link href={`/tools/${toTool.slug}`}>
            <Button size="lg" variant="outline" className="rounded-full px-6">
              Read the {toTool.name} review
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. Quick Summary */}
      {sw.quick_summary && (
        <div className="mb-10 p-6 rounded-2xl border border-border bg-card">
          {sectionTag('Quick summary')}
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-3">
            {sw.quick_summary.annual_saving && (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0 w-36">Annual saving</dt>
                <dd className="font-semibold text-primary">{sw.quick_summary.annual_saving}</dd>
              </div>
            )}
            {sw.quick_summary.migration_time && (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0 w-36">Migration time</dt>
                <dd className="font-medium">{sw.quick_summary.migration_time}</dd>
              </div>
            )}
            {sw.quick_summary.difficulty && (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0 w-36">Difficulty</dt>
                <dd className="font-medium">{sw.quick_summary.difficulty}</dd>
              </div>
            )}
            {sw.quick_summary.who_should_switch && (
              <div className="flex gap-2 sm:col-span-2">
                <dt className="text-muted-foreground shrink-0 w-36">Who should switch</dt>
                <dd className="font-medium">{sw.quick_summary.who_should_switch}</dd>
              </div>
            )}
            {sw.quick_summary.who_should_stay && (
              <div className="flex gap-2 sm:col-span-2">
                <dt className="text-muted-foreground shrink-0 w-36">Who should stay</dt>
                <dd className="font-medium">{sw.quick_summary.who_should_stay}</dd>
              </div>
            )}
          </dl>
          {sw.quick_summary.verdict && (
            <p className="pt-3 mt-3 border-t border-border text-sm font-medium">{sw.quick_summary.verdict}</p>
          )}
        </div>
      )}

      {/* 4. Why switch / Why stay */}
      {(sw.why_switch?.length > 0 || sw.why_stay?.length > 0) && (
        <div className="mb-10 grid md:grid-cols-2 gap-6">
          {sw.why_switch?.length > 0 && (
            <div className="p-6 rounded-2xl bg-accent/50 border border-primary/10">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Why people switch</p>
              <ul className="space-y-2.5">
                {sw.why_switch.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sw.why_stay?.length > 0 && (
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Why people stay</p>
              <ul className="space-y-2.5">
                {sw.why_stay.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground font-bold shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 5. Cost comparison */}
      {(sw.cost_rows?.length > 0 || sw.cost_intro) && (
        <div className="mb-10">
          {sectionTag('The cost difference')}
          {sw.cost_intro && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sw.cost_intro}</p>
          )}
          {sw.cost_rows?.length > 0 && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold">Cost</th>
                  <th className="p-4 text-center text-sm font-semibold">{fromTool.name}</th>
                  <th className="p-4 text-center text-sm font-semibold">{toTool.name}</th>
                  <th className="p-4 text-center text-sm font-semibold">Saving</th>
                </tr>
              </thead>
              <tbody>
                {sw.cost_rows.map((row, i) => (
                  <tr key={i} className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="p-4 text-sm text-muted-foreground">{row.label}</td>
                    <td className="p-4 text-center text-sm font-medium">{row.from_value || '—'}</td>
                    <td className="p-4 text-center text-sm font-medium">{row.to_value || '—'}</td>
                    <td className="p-4 text-center text-sm font-semibold text-primary">{row.total_saving || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          {sw.cost_footnote && (
            <p className="text-xs text-muted-foreground mt-3">{sw.cost_footnote}</p>
          )}
        </div>
      )}

      {/* 6. Keep / Lose / Gain */}
      {(sw.what_you_keep?.length > 0 || sw.what_you_lose?.length > 0 || sw.what_you_gain?.length > 0) && (
        <div className="mb-10 grid md:grid-cols-3 gap-5">
          {sw.what_you_keep?.length > 0 && (
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-sm">What you keep</h2>
              </div>
              <ul className="space-y-2.5">
                {sw.what_you_keep.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sw.what_you_lose?.length > 0 && (
            <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <h2 className="font-semibold text-sm">What you lose</h2>
              </div>
              <ul className="space-y-2.5">
                {sw.what_you_lose.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sw.what_you_gain?.length > 0 && (
            <div className="p-6 rounded-2xl bg-accent/50 border border-primary/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-sm">What you gain</h2>
              </div>
              <ul className="space-y-2.5">
                {sw.what_you_gain.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 7. Migration time */}
      {(sw.migration_time_items?.length > 0 || sw.migration_time_intro) && (
        <div className="mb-10">
          {sectionTag('Migration time')}
          {sw.migration_time_intro && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sw.migration_time_intro}</p>
          )}
          {sw.migration_time_items?.length > 0 && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left p-4 text-sm font-semibold">Task</th>
                  <th className="p-4 text-right text-sm font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                {sw.migration_time_items.map((row, i) => (
                  <tr key={i} className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="p-4 text-sm text-muted-foreground">{row.label}</td>
                    <td className="p-4 text-right text-sm font-medium">{row.duration}</td>
                  </tr>
                ))}
                {sw.migration_time_total && (
                  <tr className="border-t-2 border-border bg-accent/30">
                    <td className="p-4 text-sm font-semibold">Total</td>
                    <td className="p-4 text-right text-sm font-bold text-primary">{sw.migration_time_total}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          )}
          {sw.migration_time_notes && (
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{sw.migration_time_notes}</p>
          )}
        </div>
      )}

      {/* 8. Step-by-step migration guide */}
      {sw.steps?.length > 0 && (
        <div className="mb-12">
          {sectionTag('Step by step')}
          <h2 className="text-2xl font-bold tracking-tight mb-8">Your migration guide</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {sw.steps.map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                    <span className="text-sm font-bold text-primary-foreground">{idx + 1}</span>
                  </div>
                  <div className="flex-1 p-6 rounded-2xl border border-border bg-card">
                    <h3 className="font-semibold text-base mb-3">{step.title}</h3>
                    {step.body && (
                      <div className="prose-sm">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0">{children}</p>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>,
                            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                            ul: ({ children }) => <ul className="space-y-2 mb-3 last:mb-0">{children}</ul>,
                            ol: ({ children }) => <ol className="space-y-2 mb-3 last:mb-0 list-decimal list-inside">{children}</ol>,
                            li: ({ children }) => (
                              <li className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                                <span className="text-primary font-bold shrink-0 mt-0.5">→</span>
                                <span>{children}</span>
                              </li>
                            ),
                            code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">{children}</code>,
                          }}
                        >{step.body}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. Gotchas */}
      {sw.gotchas?.length > 0 && (
        <div className="mb-10">
          {sectionTag('Watch out')}
          <h2 className="text-2xl font-bold tracking-tight mb-6">Gotchas nobody tells you</h2>
          <div className="space-y-3">
            {sw.gotchas.map((g, i) => (
              <div key={i} className="p-5 rounded-2xl border border-border bg-card">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{g.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{g.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Should you switch? */}
      {(sw.definitely_switch?.length > 0 || sw.maybe_switch?.length > 0 || sw.dont_switch?.length > 0) && (
        <div className="mb-10">
          {sectionTag('Decision')}
          <h2 className="text-2xl font-bold tracking-tight mb-6">Should you actually switch?</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {sw.definitely_switch?.length > 0 && (
              <div className="p-6 rounded-2xl bg-accent/50 border border-primary/10">
                <h3 className="font-semibold text-sm text-primary mb-4">Definitely switch if…</h3>
                <ul className="space-y-2.5">
                  {sw.definitely_switch.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sw.maybe_switch?.length > 0 && (
              <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
                <h3 className="font-semibold text-sm mb-4">Maybe switch if…</h3>
                <ul className="space-y-2.5">
                  {sw.maybe_switch.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-muted-foreground font-bold shrink-0 mt-0.5">?</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sw.dont_switch?.length > 0 && (
              <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
                <h3 className="font-semibold text-sm text-destructive mb-4">Don't switch if…</h3>
                <ul className="space-y-2.5">
                  {sw.dont_switch.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 11. Final verdict */}
      {sw.final_verdict && (
        <div className="mb-10 p-6 rounded-2xl bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.25),transparent_60%)]" />
          <div className="relative">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-primary/20 text-primary rounded-full mb-3">What we'd actually do</span>
            <p className="text-base leading-relaxed opacity-85">{sw.final_verdict}</p>
          </div>
        </div>
      )}

      {/* 12. Optional callout */}
      {sw.before_you_switch_note && (
        <div className="mb-10 p-5 rounded-2xl bg-muted/40 border border-border">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">A note before you switch</p>
              <p className="text-sm leading-relaxed text-foreground">{sw.before_you_switch_note}</p>
            </div>
          </div>
        </div>
      )}

      {/* 13. FAQs */}
      {sw.faqs?.length > 0 && (
        <div className="mb-10">
          {sectionTag('FAQs')}
          <FAQAccordion faqs={sw.faqs} />
        </div>
      )}

      {/* 14. Related switches */}
      {sw.related_switches?.length > 0 && (
        <div className="mb-10">
          {sectionTag('Related switches')}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sw.related_switches.slice(0, 3).map((r) => (
              <Link
                key={r.id}
                href={`/switch/${r.slug}`}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                {r.category && <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{r.category}</p>}
                <p className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">{r.headline}</p>
                {r.annual_saving && (
                  <p className="text-xs text-muted-foreground">Saves {r.annual_saving}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 15. Related tools + stacks */}
      {(sw.related_tools?.length > 0 || sw.related_stacks?.length > 0) && (
        <div className="mb-10 grid md:grid-cols-2 gap-6">
          {sw.related_tools?.length > 0 && (
            <div>
              {sectionTag('Related tools')}
              <div className="space-y-2">
                {sw.related_tools.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tools/${t.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ToolIcon slug={t.slug} name={t.name} size="sm" websiteUrl={t.website_url} />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{t.name}</p>
                        {t.category && <p className="text-xs text-muted-foreground">{t.category}</p>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          {sw.related_stacks?.length > 0 && (
            <div>
              {sectionTag('Related stacks')}
              <div className="space-y-2">
                {sw.related_stacks.map((s) => (
                  <Link
                    key={s.id}
                    href={`/stacks/${s.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group"
                  >
                    <div className="min-w-0">
                      {s.business_type && <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">{s.business_type}</p>}
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors truncate">{s.name}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 16. Final CTA */}
      <div className="flex flex-wrap gap-3 pt-4">
        <a href={toCta} target="_blank" rel="noopener noreferrer" className="inline-flex">
          <Button className="rounded-full px-6">
            Try {toTool.name} <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
        <Link href={`/tools/${toTool.slug}`}>
          <Button variant="outline" className="rounded-full px-6">View {toTool.name}</Button>
        </Link>
        <Link href="/switch">
          <Button variant="outline" className="rounded-full px-6">Browse more switches</Button>
        </Link>
      </div>
    </div>
  );
}
