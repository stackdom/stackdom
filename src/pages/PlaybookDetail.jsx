import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import ToolIcon from '../components/ToolIcon';

export default function PlaybookDetail() {
  const { slug } = useParams();
  const [playbook, setPlaybook] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Playbook.filter({ slug }, '-created_date', 1),
      base44.entities.Tool.list('-created_date', 50),
    ]).then(([playbooks, allTools]) => {
      setPlaybook(playbooks[0] || null);
      setTools(allTools);
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

  if (!playbook) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Playbook not found</h1>
        <Link to="/playbooks"><Button variant="outline">Back to playbooks</Button></Link>
      </div>
    );
  }

  const relatedTools = (playbook.tools || []).map(name => tools.find(t => t.name === name)).filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link to="/playbooks" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All playbooks
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-accent-foreground" />
        </div>
        {playbook.category && <Badge variant="secondary">{playbook.category}</Badge>}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{playbook.title}</h1>

      {/* Problem / Solution */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-destructive/5 border border-destructive/10">
          <h3 className="text-sm font-semibold text-destructive mb-2">The Problem</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{playbook.problem}</p>
        </div>
        <div className="p-5 rounded-2xl bg-accent/50 border border-primary/10">
          <h3 className="text-sm font-semibold text-primary mb-2">The Solution</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{playbook.solution}</p>
        </div>
      </div>

      {/* Recommended Stack */}
      {relatedTools.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Recommended stack</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map(tool => (
              <div key={tool.id} className="p-5 rounded-2xl border border-border bg-card flex flex-col gap-3">
               <ToolIcon slug={tool.slug} name={tool.name} size="md" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{tool.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.category}</p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{tool.short_description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  {tool.monthly_price != null && (
                    <span className="text-sm font-semibold">
                      {tool.monthly_price === 0 ? 'Free' : `$${tool.monthly_price}/mo`}
                    </span>
                  )}
                  <Link to={`/tools/${tool.slug}`} className="ml-auto">
                    <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5">
                      More info <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Implementation Steps */}
      {playbook.steps?.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Implementation steps</h2>
          <div className="space-y-4">
            {playbook.steps.map((step, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {playbook.content && (
        <div className="mb-10">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h2 className="text-2xl font-bold tracking-tight mb-6">{children}</h2>,
              h2: ({ children }) => <h3 className="text-xl font-semibold tracking-tight mb-5 mt-8 first:mt-0">{children}</h3>,
              h3: ({ children }) => <h4 className="text-base font-semibold mb-3 mt-6 first:mt-0">{children}</h4>,
              p: ({ children }) => <p className="text-sm text-muted-foreground leading-relaxed mb-4">{children}</p>,
              ul: ({ children }) => <ul className="space-y-3 mb-6">{children}</ul>,
              li: ({ children, ...props }) => {
                if (props.ordered) {
                  return (
                    <div className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                        {props.index + 1}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed pt-0.5">{children}</div>
                    </div>
                  );
                }
                return (
                  <li className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-bold shrink-0 mt-0.5">→</span>
                    <span>{children}</span>
                  </li>
                );
              },
              ol: ({ children }) => <ol className="space-y-3 mb-6 list-none pl-0">{children}</ol>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">{children}</blockquote>
              ),
            }}
          >{playbook.content}</ReactMarkdown>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/builder">
          <Button className="rounded-full px-6">Build your stack <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </Link>
        <Link to="/stacks">
          <Button variant="outline" className="rounded-full px-6">View curated stacks</Button>
        </Link>
      </div>
    </div>
  );
}