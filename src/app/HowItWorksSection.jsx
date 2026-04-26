'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/SectionHeading';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const STEPS = [
  { num: '01', title: 'Answer a few questions', desc: 'Tell us about your business type, size, budget, and goals. Takes 60 seconds.' },
  { num: '02', title: 'Get a tailored stack', desc: 'We match you with the best tools based on real-world performance and fit.' },
  { num: '03', title: 'Put it into action', desc: 'Set up and connect your tools for maximum impact. Your stack is ready to go.' },
];

export default function HowItWorksSection() {
  return (
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
          {STEPS.map((step) => (
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
  );
}
