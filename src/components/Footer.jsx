'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StackdomLogo from './StackdomLogo';
import { getAllStacks, getSiteSettings } from '@/lib/sanity';

export default function Footer() {
  const [featuredStacks, setFeaturedStacks] = useState([]);
  const [tagline, setTagline] = useState('Build the right stack for your business — without the guesswork.');

  useEffect(() => {
    getAllStacks().then(stacks => {
      setFeaturedStacks(stacks.filter(s => s.featured).slice(0, 4));
    });
    getSiteSettings().then(settings => {
      if (settings?.tagline) setTagline(settings.tagline);
    });
  }, []);

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <StackdomLogo className="h-7 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm opacity-60 leading-relaxed">
              {tagline}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 opacity-80">Product</h4>
            <div className="space-y-2.5">
              <Link href="/builder" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Stack Builder</Link>
              <Link href="/stacks" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Stacks</Link>
              <Link href="/tools" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Tools</Link>
              <Link href="/compare" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Compare</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 opacity-80">Resources</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">About</Link>
              <Link href="/contact" className="block text-sm opacity-60 hover:opacity-100 transition-opacity">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 opacity-80">Popular Stacks</h4>
            <div className="space-y-2.5">
              {featuredStacks.map(s => (
                <Link key={s.id} href={`/stacks/${s.slug}`} className="block text-sm opacity-60 hover:opacity-100 transition-opacity">{s.name}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-40">© 2026 Stackdom. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/legal/privacy-policy" className="text-sm opacity-40 hover:opacity-80 transition-opacity">Privacy</Link>
            <Link href="/legal/terms-of-service" className="text-sm opacity-40 hover:opacity-80 transition-opacity">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
