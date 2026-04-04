import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const GRADIENTS = [
  'from-green-400 to-blue-500',
  'from-pink-400 to-purple-500',
  'from-purple-500 to-blue-500',
  'from-orange-400 to-pink-500',
  'from-blue-400 to-teal-500',
];

export default function StackCard({ stack, index = 0 }) {
  return (
    <Link
      href={`/stacks/${stack.slug}`}
      className="group block rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col overflow-hidden"
    >
      <div className={`h-1 bg-gradient-to-r ${GRADIENTS[index % GRADIENTS.length]}`} />
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{stack.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">{stack.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {(stack.tools || []).slice(0, 5).map(t => (
            <span key={t} className="px-3 py-1 text-xs border border-border rounded-full text-foreground bg-background">{t}</span>
          ))}
          {(stack.tools || []).length > 5 && (
            <span className="px-3 py-1 text-xs border border-border rounded-full text-muted-foreground bg-background">+{stack.tools.length - 5}</span>
          )}
        </div>
        <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Estimated cost</p>
            <p className="text-base font-bold">{stack.estimated_monthly_cost || '—'}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary mb-0.5" />
        </div>
      </div>
    </Link>
  );
}
