import { Engineer, CRQSchedule, EngineerLevel, LEVEL_ORDER } from '@/types/crq';
import { Badge } from '@/components/ui/badge';

interface HierarchyViewCardProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
}

const levelColors: Record<EngineerLevel, string> = {
  L4: 'bg-level-l4/20 text-level-l4 border-level-l4/30',
  L3: 'bg-level-l3/20 text-level-l3 border-level-l3/30',
  L2: 'bg-level-l2/20 text-level-l2 border-level-l2/30',
  L1: 'bg-level-l1/20 text-level-l1 border-level-l1/30',
};

const levels: EngineerLevel[] = ['L4', 'L3', 'L2', 'L1'];

const HierarchyViewCard = ({ engineers, schedules }: HierarchyViewCardProps) => {
  const grouped = levels.map(level => ({
    level,
    engineers: engineers.filter(e => e.level === level),
    totalHours: schedules
      .filter(s => engineers.find(e => e.id === s.engineerId && e.level === level))
      .reduce((sum, s) => sum + (s.endHour - s.startHour), 0),
    crqCount: schedules
      .filter(s => engineers.find(e => e.id === s.engineerId && e.level === level))
      .length,
  }));

  return (
    <div className="rounded-lg bg-card border border-border glow-card animate-slide-in">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold">Hierarchy View</h2>
        <p className="text-xs text-muted-foreground mt-1">L4 → L1 workload distribution</p>
      </div>
      <div className="divide-y divide-border">
        {grouped.map((g, i) => (
          <div key={g.level} className="p-4 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`border ${levelColors[g.level]} font-bold`}>{g.level}</Badge>
                <span className="text-sm text-muted-foreground">{g.engineers.length} engineer{g.engineers.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex gap-3 text-xs font-mono">
                <span>{g.crqCount} CRQs</span>
                <span className="font-bold">{g.totalHours}h</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.engineers.map(e => (
                <span key={e.id} className="text-[11px] px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                  {e.name}
                </span>
              ))}
            </div>
            {i < grouped.length - 1 && (
              <div className="flex justify-center mt-2 text-muted-foreground text-xs">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HierarchyViewCard;
