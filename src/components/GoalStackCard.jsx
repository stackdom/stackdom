import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function GoalStackCard({ goal }) {
  const Icon = goal.icon;
  const [tools, setTools] = useState([]);
  const [costRange, setCostRange] = useState(null);

  useEffect(() => {
    base44.entities.Tool.list('-created_date', 100).then(allTools => {
      const goalTools = (goal.tools || []).map(name => allTools.find(t => t.name === name)).filter(Boolean);
      setTools(goalTools);
      
      const toolsWithPrice = goalTools.filter(t => t.monthly_price != null);
      if (toolsWithPrice.length > 0) {
        const minCost = Math.min(...toolsWithPrice.map(t => t.monthly_price || 0));
        const maxCost = toolsWithPrice.reduce((sum, t) => sum + (t.monthly_price || 0), 0);
        setCostRange({ min: minCost, max: maxCost });
      }
    });
  }, [goal]);
  
  return (
    <Link
      to={`/goal/${goal.slug}`}
      className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col"
    >
      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{goal.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2">{goal.description}</p>
      
      {tools.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tools.slice(0, 3).map(t => (
            <span key={t.id} className="px-3 py-1 text-xs font-medium border border-border rounded-full text-foreground bg-background">{t.name}</span>
          ))}
          {tools.length > 3 && (
            <span className="px-3 py-1 text-xs font-medium border border-border rounded-full text-foreground bg-background">+{tools.length - 3}</span>
          )}
        </div>
      )}
      
      <div className="border-t border-border pt-3 flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-0.5">Estimated cost</p>
          {costRange ? (
            <p className="font-bold text-sm">${costRange.min} – ${costRange.max}/mo</p>
          ) : (
            <p className="font-bold text-sm">Call for pricing</p>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-primary" />
      </div>
    </Link>
  );
}