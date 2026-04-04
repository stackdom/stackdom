import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, DollarSign, Check, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import ToolIcon from '../components/ToolIcon';
import { GOALS } from '../components/GoalStackGrid';

const GOAL_MESSAGING = {
  'traffic': { headline: 'Best Stack for Driving Traffic', subhead: 'The tools to get more people to your site, fast.' },
  'generate-leads': { headline: 'Best Stack for Lead Generation', subhead: 'Find and reach new prospects with precision.' },
  'capture-leads': { headline: 'Best Stack for Capturing Leads', subhead: 'Turn visitors into prospects automatically.' },
  'close-sales': { headline: 'Best Stack for Closing Sales', subhead: 'Convert leads into customers, reliably.' },
  'customers': { headline: 'Best Stack for Customer Management', subhead: 'Track, manage, and grow customer relationships.' },
  'automate': { headline: 'Best Stack for Automation', subhead: 'Save time. Connect everything. Work smarter.' },
  'website': { headline: 'Best Stack for Your Website', subhead: 'Launch, manage, and optimize your online presence.' },
  'email': { headline: 'Best Stack for Email Marketing', subhead: 'Engage your audience with powerful email campaigns.' },
  'analytics': { headline: 'Best Stack for Analytics', subhead: 'Know what\'s working. Fix what\'s not.' },
  'payments': { headline: 'Best Stack for Payments', subhead: 'Get paid, simply and securely.' },
  'support': { headline: 'Best Stack for Customer Support', subhead: 'Help your customers faster and better.' },
  'content': { headline: 'Best Stack for Content Creation', subhead: 'Design, write, and publish at speed.' },
};

export default function GoalStackDetail() {
  const { slug } = useParams();
  const [goal, setGoal] = useState(null);
  const [tools, setTools] = useState([]);
  const [relatedStacks, setRelatedStacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundGoal = GOALS.find(g => g.slug === slug);
    setGoal(foundGoal || null);

    Promise.all([
      base44.entities.Tool.list('-created_date', 50),
      base44.entities.Stack.list('-created_date', 50),
    ]).then(([allTools, allStacks]) => {
      setTools(allTools);
      // Get related stacks that contain at least one tool from this goal
      const goalToolNames = foundGoal?.tools || [];
      const related = allStacks.filter(s => 
        (s.tools || []).some(t => goalToolNames.includes(t))
      ).slice(0, 3);
      setRelatedStacks(related);
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

  if (!goal) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Goal not found</h1>
        <Link to="/"><Button variant="outline">Back home</Button></Link>
      </div>
    );
  }

  const goalTools = goal.tools.map(name => tools.find(t => t.name === name)).filter(Boolean);
  const toolsWithPrice = goalTools.filter(t => t.monthly_price != null);
  const totalCost = toolsWithPrice.reduce((sum, t) => sum + t.monthly_price, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <Badge variant="secondary" className="mb-4">Growth Stack</Badge>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{GOAL_MESSAGING[goal.slug]?.headline || goal.title}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-6">{GOAL_MESSAGING[goal.slug]?.subhead || goal.description}</p>

      {toolsWithPrice.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
          <DollarSign className="w-4 h-4" />
          <span>Estimated cost: <strong className="text-foreground">${totalCost}/mo</strong></span>
        </div>
      )}

      {/* Tools in stack */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Recommended tools</h2>
        <div className="space-y-4">
          {goalTools.map(tool => (
            <div key={tool.id} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
              <ToolIcon slug={tool.slug} name={tool.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{tool.name}</h3>
                  <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{tool.short_description}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {tool.monthly_price != null && (
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {tool.monthly_price === 0 ? 'Free' : `$${tool.monthly_price}/mo`}
                  </span>
                )}
                <Link to={`/tools/${tool.slug}`}>
                  <Button size="sm" variant="outline" className="rounded-full">More info</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stack Cost Estimate */}
      {toolsWithPrice.length > 0 && (
        <div className="mb-12 p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">Stack cost estimate</h2>
          <div className="space-y-3 mb-4">
            {toolsWithPrice.map(tool => (
              <div key={tool.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                  {tool.website_url ? (
                    <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{tool.name}</a>
                  ) : (
                    <span className="text-muted-foreground">{tool.name}</span>
                  )}
                  {tool.website_url && (
                    <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
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

      {/* Related Stacks */}
      {relatedStacks.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Related stacks</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedStacks.map(s => (
              <Link
                key={s.id}
                to={`/stacks/${s.slug}`}
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

      <div className="flex gap-3">
        <Link to="/builder">
          <Button className="rounded-full px-6">Build a custom stack <ArrowRight className="w-4 h-4 ml-2" /></Button>
        </Link>
        <Link to="/stacks">
          <Button variant="outline" className="rounded-full px-6">View all stacks</Button>
        </Link>
      </div>
    </div>
  );
}