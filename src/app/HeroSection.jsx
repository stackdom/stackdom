'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-secondary/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-28">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto text-center">
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
  );
}
