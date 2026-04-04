'use client';

import { useState, useEffect } from 'react';
import ToolIcon from '@/components/ToolIcon';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllTools } from '@/lib/sanity';

const BASE_STEPS = [
  {
    id: 'business_type',
    title: 'What type of business do you run?',
    subtitle: 'This helps us recommend tools designed for your industry.',
    options: ['Ecommerce', 'Service', 'B2B', 'Agency', 'Creator', 'Other'],
  },
  {
    id: 'team_size',
    title: 'How big is your team?',
    subtitle: 'Team size affects which tools and plans make sense.',
    options: ['Solo', '2–10', '11–50'],
  },
  {
    id: 'budget',
    title: "What's your monthly software budget?",
    subtitle: "We'll match tools to your budget range.",
    options: ['Low ($0–50/mo)', 'Medium ($50–200/mo)', 'High ($200+/mo)'],
  },
  {
    id: 'goal',
    title: "What's your main goal right now?",
    subtitle: "We'll prioritize tools that help you achieve this.",
    options: ['Lead generation', 'Sales', 'Marketing', 'Operations', 'Growth'],
  },
  {
    id: 'complexity',
    title: 'How complex should your stack be?',
    subtitle: 'Simple means fewer tools. Advanced means more power.',
    options: ['Simple', 'Balanced', 'Advanced'],
  },
];

export default function StackBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [tools, setTools] = useState([]);
  const [steps, setSteps] = useState(BASE_STEPS);

  useEffect(() => {
    getAllTools().then(allTools => {
      setTools(allTools);
      const categories = [...new Set(allTools.map(t => t.category).filter(Boolean))].sort();
      setSteps([
        ...BASE_STEPS,
        {
          id: 'needs',
          title: 'What do you need most?',
          subtitle: 'Select all that apply.',
          options: categories,
          multi: true,
        },
      ]);
    });
  }, []);

  const step = steps[currentStep];

  const handleSelect = (option) => {
    if (step.multi) {
      const current = answers[step.id] || [];
      const updated = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option];
      setAnswers({ ...answers, [step.id]: updated });
    } else {
      setAnswers({ ...answers, [step.id]: option });
      if (currentStep < steps.length - 1) {
        setTimeout(() => setCurrentStep(prev => prev + 1), 300);
      }
    }
  };

  const isSelected = (option) => {
    if (step.multi) return (answers[step.id] || []).includes(option);
    return answers[step.id] === option;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getMaxBudgetPerTool = () => {
    const b = answers.budget || '';
    if (b.includes('Low')) return 50;
    if (b.includes('Medium')) return 200;
    return Infinity;
  };

  const getRecommendedTools = () => {
    const needs = answers.needs || tools.map(t => t.category).filter(Boolean).slice(0, 4);
    const maxPrice = getMaxBudgetPerTool();
    const complexity = answers.complexity || 'Balanced';

    return needs.map(need => {
      const candidates = tools
        .filter(t => t.category === need)
        .filter(t => t.monthly_price == null || t.monthly_price <= maxPrice);

      const sorted = candidates.sort((a, b) => {
        const pa = a.monthly_price ?? 0;
        const pb = b.monthly_price ?? 0;
        return complexity === 'Advanced' ? pb - pa : pa - pb;
      });

      const toolData = sorted[0];
      if (!toolData) return null;

      return {
        category: need,
        name: toolData.name,
        reason: toolData.tagline || toolData.short_description || '',
        slug: toolData.slug,
        description: toolData.short_description || '',
        monthly_price: toolData.monthly_price ?? null,
        website_url: toolData.website_url || null,
      };
    }).filter(Boolean);
  };

  const progress = showResults ? 100 : ((currentStep + 1) / steps.length) * 100;

  if (showResults) {
    const recommended = getRecommendedTools();
    const toolsWithPrice = recommended.filter(t => t.monthly_price != null);
    const totalCost = toolsWithPrice.reduce((sum, t) => sum + t.monthly_price, 0);
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/50 to-background">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
          <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to builder
          </button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your recommended stack</h1>
            </div>
            <p className="text-muted-foreground text-lg mb-10">Based on your answers, here's what we recommend.</p>

            <div className="space-y-4">
              {recommended.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="shrink-0 mt-1">
                        <ToolIcon slug={tool.slug} name={tool.name} size="sm" websiteUrl={tool.website_url} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{tool.category}</span>
                        <h3 className="text-lg font-semibold mt-1">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                      {tool.monthly_price != null && (
                        <span className="text-sm font-semibold text-foreground">From ${tool.monthly_price}/mo</span>
                      )}
                      <Link href={`/tools/${tool.slug}`}>
                        <Button variant="outline" size="sm" className="rounded-full text-xs px-4">
                          More info
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {toolsWithPrice.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: recommended.length * 0.1 }}
                className="mt-6 p-6 rounded-2xl bg-card border border-border"
              >
                <h3 className="text-base font-semibold mb-4">Estimated stack cost</h3>
                <div className="space-y-2 mb-4">
                  {toolsWithPrice.map(tool => (
                    <div key={tool.name} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <ToolIcon slug={tool.slug} name={tool.name} size="sm" websiteUrl={tool.website_url} />
                        {tool.website_url ? (
                          <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{tool.name}</a>
                        ) : (
                          <span className="text-muted-foreground">{tool.name}</span>
                        )}
                        {tool.website_url && (
                          <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="text-primary">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <span className="font-medium">${tool.monthly_price}/mo</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-semibold">Estimated monthly cost</span>
                  <span className="text-xl font-bold text-primary">${totalCost}/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Pricing shown is starting price. Actual cost may vary by plan.</p>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Link href="/tools">
                <Button variant="outline" className="rounded-full px-6 w-full sm:w-auto">
                  Explore more tools
                </Button>
              </Link>
              <Link href="/playbooks">
                <Button variant="outline" className="rounded-full px-6 w-full sm:w-auto">
                  Read playbooks
                </Button>
              </Link>
              <Link href="/stacks">
                <Button className="rounded-full px-6 w-full sm:w-auto">
                  View curated stacks <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/50 to-background">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{step.title}</h2>
            <p className="text-muted-foreground mb-8">{step.subtitle}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {step.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`relative p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 ${
                    isSelected(option)
                      ? 'border-primary bg-accent text-foreground shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-accent/50'
                  }`}
                >
                  {isSelected(option) && (
                    <Check className="absolute top-2 right-2 w-4 h-4 text-primary" />
                  )}
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-10">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <Button
            onClick={handleNext}
            disabled={!answers[step.id] || (step.multi && (answers[step.id] || []).length === 0)}
            className="rounded-full px-6"
          >
            {currentStep === steps.length - 1 ? 'Get my stack' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
