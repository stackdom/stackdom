'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLegalPage } from '@/lib/sanity';

function renderMarkdown(text) {
  const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  return paragraphs.map((para, i) => {
    if (para.startsWith('## ')) {
      return (
        <h2 key={i} className="text-xl font-semibold mt-8 mb-3">
          {para.replace(/^## /, '')}
        </h2>
      );
    }
    if (para.startsWith('# ')) {
      return (
        <h2 key={i} className="text-2xl font-bold mt-10 mb-4">
          {para.replace(/^# /, '')}
        </h2>
      );
    }
    const lines = para.split('\n');
    if (lines.every(l => l.trimStart().startsWith('- '))) {
      return (
        <ul key={i} className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm leading-relaxed mb-1">
          {lines.map((l, j) => (
            <li key={j}>{l.trimStart().replace(/^- /, '')}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="text-muted-foreground leading-relaxed">
        {lines.map((line, j) => (
          <span key={j}>
            {line}
            {j < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export default function LegalPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLegalPage(slug).then(result => {
      setPage(result || null);
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

  if (!page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <Link href="/"><Button variant="outline">Back to home</Button></Link>
      </div>
    );
  }

  const formattedDate = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{page.title}</h1>
      {formattedDate && (
        <p className="text-sm text-muted-foreground mb-10">Last updated: {formattedDate}</p>
      )}
      <div className="space-y-4">
        {page.content ? renderMarkdown(page.content) : null}
      </div>
    </div>
  );
}
