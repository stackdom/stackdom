import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PlaybookCard({ playbook }) {
  return (
    <Link
      to={`/playbooks/${playbook.slug}`}
      className="group block p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center mb-4">
        <BookOpen className="w-5 h-5 text-accent-foreground" />
      </div>
      {playbook.category && <Badge variant="secondary" className="mb-3 text-xs">{playbook.category}</Badge>}
      <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">{playbook.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{playbook.problem}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(playbook.tools || []).slice(0, 3).map(t => (
          <span key={t} className="px-2 py-0.5 text-xs bg-muted rounded-full text-muted-foreground">{t}</span>
        ))}
      </div>
      <span className="text-xs font-medium text-primary flex items-center gap-1">
        Read playbook <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
  );
}