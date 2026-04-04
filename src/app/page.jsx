'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, Target, Layers, BarChart3, Mail, Globe, Bot, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllTools, getAllStacks, getAllPlaybooks } from '@/lib/sanity';
import SectionHeading from '@/components/SectionHeading';
import GoalStackGrid from '@/components/GoalStackGrid';
import ToolCard from '@/components/ToolCard';
import StackCard from '@/components/StackCard';
import PlaybookCard from '@/components/PlaybookCard';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const [tools, setTools] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);

  useEffect(() => {
    getAllTools().then(data => setTools(data.slice(0, 8)));
    getAllStacks().then(data => setStacks(data.filter(s => s.featured).slice(0, 3)));
    getAllPlaybooks().then(data => setPlaybooks(data.filter(p => p.featured).slice(0, 4)));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-secondary/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-primary bg-accent border border-primary/10 rounded-full mb-6">
                <Zap className="w-3 h-3" /> Smart stack recommendations
              </span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Build a growth stack<br />
              <span className="text-primary">that actually works</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              Curated tools. Proven stacks. No guesswork. Just go.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/builder">
                <Button size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto">
                  Build your stack <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/stacks">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto">
                  Explore stacks
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading tag="How it works" title="Three steps to your ideal stack" description="No more Googling 'best CRM for small business' at 2am. We've done the research so you don't have to." />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { num: '01', title: 'Answer a few questions', desc: 'Tell us about your business type, size, budget, and goals. Takes 60 seconds.' },
              { num: '02', title: 'Get a tailored stack', desc: 'We match you with the best tools based on real-world performance and fit.' },
              { num: '03', title: 'Put it into action', desc: 'Follow our playbooks to set up and connect your tools for maximum impact.' },
            ].map(step => (
              <motion.div key={step.num} variants={fadeUp} className="relative p-8 rounded-2xl bg-card border border-border">
                <span className="text-5xl font-black text-primary/10 absolute top-4 right-6">{step.num}</span>
                <h3 className="font-semibold text-lg mb-2 mt-6">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link href="/builder">
              <Button size="lg" className="rounded-full px-8 text-base h-12">
                Build your stack <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GoalStackGrid />

      {/* Featured Stacks */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading tag="Featured stacks" title="Curated stacks that just work" description="Pre-built combinations of tools tailored for specific business types. Skip the research." />
          <div className="grid md:grid-cols-3 gap-6">
            {stacks.map((stack, idx) => (
              <StackCard key={stack.id} stack={stack} index={idx} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/stacks">
              <Button variant="outline" className="rounded-full px-6">
                View all stacks <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading tag="Explore tools" title="The tools that power great businesses" description="Curated, vetted, and categorized. Every tool in our directory is one we'd actually recommend." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.slice(0, 8).map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/tools">
              <Button variant="outline" className="rounded-full px-6">
                Browse all tools <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Stackdom */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading tag="Why Stackdom" title="Built for real businesses" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: 'No more guesswork', desc: 'Data-driven recommendations based on your actual business needs.' },
              { icon: Shield, title: 'Curated picks', desc: 'Every tool is vetted. No pay-to-play listings or sponsored results.' },
              { icon: Layers, title: 'Built for real businesses', desc: 'Stacks designed by operators who have been in your shoes.' },
              { icon: Clock, title: 'Save time and money', desc: "Stop paying for tools you don't need. Get the right stack from day one." },
            ].map(item => (
              <div key={item.title} className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 sm:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.3),transparent_60%)]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Build your stack in minutes</h2>
              <p className="text-lg opacity-70 mb-8 max-w-lg mx-auto">
                Join thousands of businesses using Stackdom to find the right tools — fast.
              </p>
              <Link href="/builder">
                <Button size="lg" className="rounded-full px-8 text-base h-12 bg-primary hover:bg-primary/90">
                  Get started free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
