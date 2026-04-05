'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, DollarSign, Check, RefreshCw, ExternalLink, X, Users, Lightbulb, AlertTriangle, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getStackBySlug, getAllTools, getAllStacks } from '@/lib/sanity';
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

export default function StackDetail() {
  const { slug } = useParams();
  const [stack, setStack] = useState(null);
  const [tools, setTools] = useState([]);
  const [relatedStacks, setRelatedStacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStackBySlug(slug),
      getAllTools(),
    ]).then(([found, allTools]) => {
      setStack(found || null);
      setTools(allTools);
      if (found) {
        getAllStacks().then(allStacks => {
          setRelatedStacks(allStacks.filter(s => s.business_type === found.business_type && s.slug !== found.slug));
        });
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

  if (!stack) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Stack not found</h1>
        <Link href="/stacks"><Button variant="outline">Back to stacks</Button></Link>
      </div>
    );
  }

  const stackTools = (stack.tools || []).map(name => tools.find(t => t.name === name)).filter(Boolean);
  const toolsWithPrice = stackTools.filter(t => t.monthly_price != null);
  const totalCost = toolsWithPrice.reduce((sum, t) => sum + t.monthly_price, 0);

  const faqSchema = stack.faqs?.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: stack.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Link href="/stacks" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All stacks
      </Link>

      <Badge variant="secondary" className="mb-4">{stack.business_type}</Badge>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">{stack.name}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">{stack.description}</p>

      {stack.quick_summary && (
        <div className="mb-12 p-6 rounded-2xl bg-accent/50 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Quick Summary</span>
          </div>
          <p className="text-base leading-relaxed">{stack.quick_summary}</p>
        </div>
      )}

      {(stack.overview_problem || stack.overview_solution || stack.overview_how_it_works || stack.overview_use_cases || stack.overview_tradeoff) && (
        <div className="mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-3">Overview</span>
          <h2 className="text-2xl font-bold tracking-tight mb-8">What you need to know</h2>
          <div className="rounded-2xl bg-muted/40 px-4 sm:px-7 py-5 sm:py-6">
            <div className="relative">
              <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border" />
              <div className="space-y-6">
                {[{ label: 'The Problem', content: stack.overview_problem }, { label: 'The Solution', content: stack.overview_solution }, { label: 'How It Works', content: stack.overview_how_it_works }, { label: 'Use Cases', content: stack.overview_use_cases }, { label: 'The Trade-off', content: stack.overview_tradeoff }].filter(i => i.content).map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="relative z-10 w-7 h-7 rounded-full bg-accent border-2 border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <div className="pb-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-sm leading-relaxed text-foreground">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Visually hidden definition list for AI crawlers */}
          <dl style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
            {stack.overview_problem && <><dt>What problem does this stack solve?</dt><dd>{stack.overview_problem}</dd></>}
            {stack.overview_solution && <><dt>What is the solution?</dt><dd>{stack.overview_solution}</dd></>}
            {stack.overview_how_it_works && <><dt>How does this stack work?</dt><dd>{stack.overview_how_it_works}</dd></>}
            {stack.overview_use_cases && <><dt>What are the use cases?</dt><dd>{stack.overview_use_cases}</dd></>}
            {stack.overview_tradeoff && <><dt>What is the trade-off?</dt><dd>{stack.overview_tradeoff}</dd></>}
          </dl>
        </div>
      )}

      {stack.steps && stack.steps.length > 0 && (
        <div className="mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-3">Step by step</span>
          <h2 className="text-2xl font-bold tracking-tight mb-8">How this stack works</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {stack.steps.map((step, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                    <span className="text-sm font-bold text-primary-foreground">{idx + 1}</span>
                  </div>
                  <div className="flex-1 p-6 rounded-2xl border border-border bg-card mb-0">
                    <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                    {step.tools && step.tools.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {step.tools.map(toolName => {
                          const tool = stackTools.find(t => t.name === toolName);
                          return tool ? (
                            <Link key={toolName} href={`/tools/${tool.slug}`}>
                              <Badge variant="outline" className="cursor-pointer hover:bg-accent transition-colors">{toolName}</Badge>
                            </Link>
                          ) : (
                            <Badge key={toolName} variant="outline">{toolName}</Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm">Together, this creates a system where {stack.business_type?.toLowerCase()}s can operate efficiently.</p>
        </div>
      )}

      <div className="mb-12">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary bg-accent rounded-full mb-3">The stack</span>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Tools included</h2>
        <div className="space-y-4">
          {stackTools.map(tool => (
            <div key={tool.id} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
              <ToolIcon slug={tool.slug} name={tool.name} size="md" websiteUrl={tool.website_url} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold">{tool.name}</h3>
                  <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{tool.short_description}</p>
                <div className="flex items-center gap-3 mt-3 sm:hidden">
                  {tool.monthly_price != null && (
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {tool.monthly_price === 0 ? 'Free' : `$${tool.monthly_price}/mo`}
                    </span>
                  )}
                  <Link href={`/tools/${tool.slug}`}>
                    <Button size="sm" variant="outline" className="rounded-full">More info</Button>
                  </Link>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                {tool.monthly_price != null && (
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {tool.monthly_price === 0 ? 'Free' : `$${tool.monthly_price}/mo`}
                  </span>
                )}
                <Link href={`/tools/${tool.slug}`}>
                  <Button size="sm" variant="outline" className="rounded-full">More info</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toolsWithPrice.length > 0 && (
        <div className="mb-12 p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Stack cost estimate</h2>
          <div className="space-y-3 mb-4">
            {toolsWithPrice.map(tool => (
              <div key={tool.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <ToolIcon slug={tool.slug} name={tool.name} size="sm" websiteUrl={tool.website_url} />
                  {(tool.go_slug || tool.slug) ? (
                    <a href={`/go/${tool.go_slug || tool.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{tool.name}</a>
                  ) : (
                    <span className="text-muted-foreground">{tool.name}</span>
                  )}
                  {(tool.go_slug || tool.slug) && (
                    <a href={`/go/${tool.go_slug || tool.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <span className="font-medium">{tool.monthly_price === 0 ? 'Free' : `$${tool.monthly_price}/mo`}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="font-semibold">Estimated monthly total</span>
            <span className="text-xl font-bold text-primary">${totalCost}/mo</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Based on starting prices. Actual cost may vary by plan and usage.</p>
        </div>
      )}

      {stack.why_it_works && (
        <div className="mb-12 p-6 rounded-2xl bg-foreground text-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.25),transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Why it works</span>
            </div>
            <p className="text-base leading-relaxed opacity-85">{stack.why_it_works}</p>
          </div>
        </div>
      )}

      {(stack.who_is_this_for?.length > 0 || stack.when_to_use?.length > 0 || stack.when_not_to_use?.length > 0) && (
        <div className="mb-12 grid md:grid-cols-3 gap-5">
          {stack.who_is_this_for?.length > 0 && (
            <div className="p-6 rounded-2xl bg-secondary/40 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-sm">Who it's for</h2>
              </div>
              <ul className="space-y-2.5">
                {stack.who_is_this_for.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stack.when_to_use?.length > 0 && (
            <div className="p-6 rounded-2xl bg-accent/50 border border-primary/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-sm">When to use it</h2>
              </div>
              <ul className="space-y-2.5">
                {stack.when_to_use.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stack.when_not_to_use?.length > 0 && (
            <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <h2 className="font-semibold text-sm">When NOT to use it</h2>
              </div>
              <ul className="space-y-2.5">
                {stack.when_not_to_use.map((item, idx) => (
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

      {stack.faqs?.length > 0 && (
        <div className="mb-12 rounded-2xl bg-muted/40 px-7 py-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {stack.faqs.map((faq, i) => (
              <FAQ key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      )}

      {stack.alternatives?.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Alternatives & upgrades</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {stack.alternatives.map(alt => {
              const altTool = tools.find(t => t.name === alt);
              return altTool ? (
                <Link key={alt} href={`/tools/${altTool.slug}`}>
                  <Badge variant="outline" className="px-3 py-1.5 hover:bg-accent transition-colors cursor-pointer">{alt}</Badge>
                </Link>
              ) : (
                <Badge key={alt} variant="outline" className="px-3 py-1.5">{alt}</Badge>
              );
            })}
          </div>
        </div>
      )}

      {relatedStacks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Related stacks</h2>
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

      <div className="flex flex-wrap gap-3">
        <Link href="/builder">
          <Button className="rounded-full px-6">Build a custom stack <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </Link>
      </div>
    </div>
  );
}
