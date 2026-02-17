import { Engineer, CRQSchedule, LEVEL_ORDER, EngineerLevel } from '@/types/crq';
import { Badge } from '@/components/ui/badge';

interface FreeEngineersCardProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
}

const levelColors: Record<EngineerLevel, string> = {
  L4: 'bg-level-l4/20 text-level-l4 border-level-l4/30',
  L3: 'bg-level-l3/20 text-level-l3 border-level-l3/30',
  L2: 'bg-level-l2/20 text-level-l2 border-level-l2/30',
  L1: 'bg-level-l1/20 text-level-l1 border-level-l1/30',
};

const FreeEngineersCard = ({ engineers, schedules }: FreeEngineersCardProps) => {
  const getFreeHours = (eng: Engineer) => {
    const engSchedules = schedules.filter(s => s.engineerId === eng.id);
    const scheduledHours = engSchedules.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
    return eng.shiftEnd - eng.shiftStart - scheduledHours;
  };

  const freeEngineers = engineers
    .filter(e => getFreeHours(e) > 0)
    .sort((a, b) => {
      const levelDiff = LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level];
      if (levelDiff !== 0) return levelDiff;
      return getFreeHours(b) - getFreeHours(a);
    });

  return (
    <div className="rounded-lg bg-card border border-border glow-card animate-slide-in">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold">Free Engineers Today</h2>
        <p className="text-xs text-muted-foreground mt-1">{freeEngineers.length} engineers with availability</p>
      </div>
      <div className="max-h-[300px] overflow-y-auto scrollbar-thin divide-y divide-border">
        {freeEngineers.map(eng => {
          const freeHrs = getFreeHours(eng);
          return (
            <div key={eng.id} className="p-3 hover:bg-secondary/50 transition-colors flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{eng.name}</span>
                  <Badge variant="outline" className={`text-[10px] border ${levelColors[eng.level]}`}>{eng.level}</Badge>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {eng.domain} · {eng.shiftStart}:00–{eng.shiftEnd}:00
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-status-free">{freeHrs}h</span>
                <div className="text-[10px] text-muted-foreground">free</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FreeEngineersCard;
