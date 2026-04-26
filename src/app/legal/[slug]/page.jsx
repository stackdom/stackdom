import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getLegalPage, getAllLegalSlugs } from '@/lib/sanity';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllLegalSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  if (!page) return {};

  const title = `${page.title} | Stackdom`;
  const description = `${page.title} for Stackdom.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://stackdom.com/legal/${slug}`,
      type: 'article',
    },
    robots: { index: true, follow: true },
  };
}

function renderMarkdown(text) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
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
    if (lines.every((l) => l.trimStart().startsWith('- '))) {
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

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const page = await getLegalPage(slug);

  if (!page) notFound();

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
