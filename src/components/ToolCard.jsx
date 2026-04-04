import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ToolIcon from './ToolIcon';

export default function ToolCard({ tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block p-5 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <ToolIcon slug={tool.slug} name={tool.name} />
        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{tool.short_description}</p>
      <Badge variant="secondary" className="text-xs font-medium">{tool.category}</Badge>
    </Link>
  );
}
