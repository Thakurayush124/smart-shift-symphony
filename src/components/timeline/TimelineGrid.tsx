import { Engineer, CRQSchedule, LEVEL_ORDER, WORK_HOURS } from '@/types/crq';
import CRQBlock from './CRQBlock';
import { Badge } from '@/components/ui/badge';

interface TimelineGridProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
}

const levelColors: Record<string, string> = {
  L4: 'bg-level-l4/20 text-level-l4 border-level-l4/30',
  L3: 'bg-level-l3/20 text-level-l3 border-level-l3/30',
  L2: 'bg-level-l2/20 text-level-l2 border-level-l2/30',
  L1: 'bg-level-l1/20 text-level-l1 border-level-l1/30',
};

const HOUR_WIDTH = 80;

const TimelineGrid = ({ engineers, schedules }: TimelineGridProps) => {
  const sorted = [...engineers].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  const engineerMap = Object.fromEntries(engineers.map(e => [e.id, e]));

  return (
    <div className="rounded-lg bg-card border border-border glow-card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <div style={{ minWidth: `${200 + WORK_HOURS.length * HOUR_WIDTH}px` }}>
          {/* Header */}
          <div className="flex border-b border-border bg-secondary/50 sticky top-0 z-10">
            <div className="w-[200px] flex-shrink-0 p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground border-r border-border">
              Engineer
            </div>
            {WORK_HOURS.map(h => (
              <div key={h} className="text-center text-[11px] font-mono text-muted-foreground border-r border-border/50 py-3" style={{ width: HOUR_WIDTH }}>
                {h}:00
              </div>
            ))}
          </div>
          {/* Rows */}
          {sorted.map(eng => {
            const engSchedules = schedules.filter(s => s.engineerId === eng.id);
            return (
              <div key={eng.id} className="flex border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <div className="w-[200px] flex-shrink-0 p-3 border-r border-border flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate">{eng.name}</span>
                    <Badge variant="outline" className={`text-[9px] border ${levelColors[eng.level]}`}>{eng.level}</Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{eng.domain}</span>
                </div>
                <div className="relative flex-1" style={{ height: 56 }}>
                  {/* Shift boundary */}
                  {WORK_HOURS.map(h => {
                    const inShift = h >= eng.shiftStart && h < eng.shiftEnd;
                    const isFree = inShift && !engSchedules.some(s => h >= s.startHour && h < s.endHour);
                    return (
                      <div
                        key={h}
                        className={`absolute top-0 bottom-0 border-r border-border/30 ${
                          !inShift ? 'bg-muted/30' : isFree ? 'bg-status-free/5' : ''
                        }`}
                        style={{ left: (h - WORK_HOURS[0]) * HOUR_WIDTH, width: HOUR_WIDTH }}
                      />
                    );
                  })}
                  {/* CRQ blocks */}
                  {engSchedules.map(s => (
                    <CRQBlock
                      key={s.id}
                      schedule={s}
                      engineerName={eng.name}
                      engineerLevel={eng.level}
                      hourWidth={HOUR_WIDTH}
                      startOffset={(s.startHour - WORK_HOURS[0]) * HOUR_WIDTH + 2}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineGrid;
