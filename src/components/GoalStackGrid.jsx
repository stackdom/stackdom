'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Search, MousePointerClick, DollarSign, Users, Zap, Globe, Mail, BarChart2, CreditCard, Headphones, PenLine, ArrowRight } from 'lucide-react';
import { getAllStacks } from '@/lib/sanity';

export const GOALS = [
  { slug: 'traffic', title: 'Drive traffic', description: 'Get more people to your site', icon: TrendingUp, tools: ['WordPress', 'Google Analytics', 'Mailchimp'] },
  { slug: 'generate-leads', title: 'Generate leads', description: 'Find and reach new prospects', icon: Search, tools: ['HubSpot', 'Pipedrive', 'Mailchimp'] },
  { slug: 'capture-leads', title: 'Capture leads', description: 'Turn visitors into prospects', icon: MousePointerClick, tools: ['HubSpot', 'Mailchimp', 'Zapier'] },
  { slug: 'close-sales', title: 'Close more sales', description: 'Convert leads into customers', icon: DollarSign, tools: ['Pipedrive', 'HubSpot', 'Stripe'] },
  { slug: 'customers', title: 'Manage customers', description: 'Track and grow relationships', icon: Users, tools: ['HubSpot', 'Pipedrive', 'Zapier'] },
  { slug: 'automate', title: 'Automate your work', description: 'Save time. Connect everything.', icon: Zap, tools: ['Zapier', 'Make', 'HubSpot'] },
  { slug: 'website', title: 'Build your website', description: 'Launch your online presence', icon: Globe, tools: ['WordPress', 'Webflow', 'Google Analytics'] },
  { slug: 'email', title: 'Send better emails', description: 'Engage and retain your audience', icon: Mail, tools: ['Mailchimp', 'Klaviyo', 'HubSpot'] },
  { slug: 'analytics', title: 'Track performance', description: "Know what's working (and fix what's not)", icon: BarChart2, tools: ['Google Analytics', 'Mixpanel'] },
  { slug: 'payments', title: 'Accept payments', description: 'Get paid, simply', icon: CreditCard, tools: ['Stripe'] },
  { slug: 'support', title: 'Support customers', description: 'Help customers, faster', icon: Headphones, tools: ['Slack', 'Notion', 'Zapier'] },
  { slug: 'content', title: 'Create content', description: 'Design, write, and publish faster', icon: PenLine, tools: ['Canva', 'Notion', 'WordPress'] },
];

const GOAL_SLUGS = GOALS.map(g => g.slug);

const iconMap = {
  traffic: TrendingUp, generateleads: Search, captureleads: MousePointerClick,
  closesales: DollarSign, customers: Users, automate: Zap,
  website: Globe, email: Mail, analytics: BarChart2,
  payments: CreditCard, support: Headphones, content: PenLine,
};

export default function GoalStackGrid() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStacks().then(data => {
      const goalStacks = data.filter(s => GOAL_SLUGS.includes(s.slug));
      setGoals(goalStacks);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-2">What do you want to grow?</h2>
          <p className="text-muted-foreground text-base sm:text-lg">Choose your goal and we'll build the right growth stack.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => {
            const Icon = iconMap[goal.slug?.replace(/-/g, '')] || Zap;
            return (
              <Link
                key={goal.slug}
                href={`/stacks/${goal.slug}`}
                className="group block p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col"
              >
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{goal.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">{goal.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(goal.tools || []).slice(0, 5).map(t => (
                    <span key={t} className="px-3 py-1 text-xs border border-border rounded-full text-foreground bg-background">{t}</span>
                  ))}
                  {(goal.tools || []).length > 5 && (
                    <span className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground bg-background">+{goal.tools.length - 5}</span>
                  )}
                </div>
                <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Estimated cost</p>
                    <p className="text-base font-bold">{goal.estimated_monthly_cost || '—'}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary mb-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
