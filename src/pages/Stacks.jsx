import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Search, MousePointerClick, DollarSign, Users, Zap, Globe, Mail, BarChart2, CreditCard, Headphones, PenLine, Briefcase, Wrench, Rocket, Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import SectionHeading from '../components/SectionHeading';
import StackCard from '../components/StackCard';

export default function Stacks() {
  const [stacks, setStacks] = useState([]);
  const [goalStacks, setGoalStacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const GOAL_SLUGS = ['traffic', 'generate-leads', 'capture-leads', 'close-sales', 'customers', 'automate', 'website', 'email', 'analytics', 'payments', 'support', 'content'];

  useEffect(() => {
    base44.entities.Stack.list('-created_date', 50).then(data => {
      const goals = data.filter(s => GOAL_SLUGS.includes(s.slug));
      const main = data.filter(s => !GOAL_SLUGS.includes(s.slug));
      setStacks(main);
      setGoalStacks(goals);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <SectionHeading
        tag="Growth Stacks"
        title="Pre-built stacks for every business"
        description="Skip the research. Proven tool combinations, ready to go."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stacks.map(stack => {
          const businessTypeIcons = { Agency: Briefcase, Service: Wrench, B2B: Rocket, Creator: Sparkles, 'Solo Founder': Zap, Ecommerce: ShoppingCart };
          const Icon = businessTypeIcons[stack.business_type] || Zap;
          return (
            <Link
              key={stack.id}
              to={`/stacks/${stack.slug}`}
              className="group block p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{stack.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">{stack.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(stack.tools || []).slice(0, 5).map(t => (
                  <span key={t} className="px-3 py-1 text-xs border border-border rounded-full text-foreground bg-background">{t}</span>
                ))}
                {(stack.tools || []).length > 5 && (
                  <span className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground bg-background">+{stack.tools.length - 5}</span>
                )}
              </div>
              <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Estimated cost</p>
                  <p className="text-base font-bold">{stack.estimated_monthly_cost || '—'}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-primary mb-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Goal Stacks */}
      {goalStacks.length > 0 && (
        <section className="py-20 sm:py-28">
          <SectionHeading
            tag="Growth Goals"
            title="Stacks by business goal"
            description="Find the perfect stack tailored to what you want to accomplish."
            center={true}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {goalStacks.map(stack => {
              const iconMap = { traffic: TrendingUp, generateLeads: Search, captureLeads: MousePointerClick, closeSales: DollarSign, customers: Users, automate: Zap, website: Globe, email: Mail, analytics: BarChart2, payments: CreditCard, support: Headphones, content: PenLine };
              const Icon = iconMap[stack.slug?.replace(/-/g, '')] || Zap;
              return (
                <Link
                   key={stack.id}
                   to={`/stacks/${stack.slug}`}
                   className="group block p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col"
                 >
                   <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                     <Icon className="w-5 h-5 text-primary" />
                   </div>
                   <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{stack.name}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">{stack.description}</p>
                   <div className="flex flex-wrap gap-2 mb-6">
                     {(stack.tools || []).slice(0, 5).map(t => (
                       <span key={t} className="px-3 py-1 text-xs border border-border rounded-full text-foreground bg-background">{t}</span>
                     ))}
                     {(stack.tools || []).length > 5 && (
                       <span className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground bg-background">+{stack.tools.length - 5}</span>
                     )}
                   </div>
                   <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                     <div>
                       <p className="text-xs text-muted-foreground mb-0.5">Estimated cost</p>
                       <p className="text-base font-bold">{stack.estimated_monthly_cost || '—'}</p>
                     </div>
                     <ArrowRight className="w-5 h-5 text-primary mb-0.5" />
                   </div>
                 </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="mt-20 py-16 rounded-3xl bg-muted/50 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Need something more specific?</h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Use our stack builder to get personalized recommendations based on your exact needs.
        </p>
        <Link to="/builder">
          <Button size="lg" className="rounded-full px-8 text-base h-12">
            Build your custom stack <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}