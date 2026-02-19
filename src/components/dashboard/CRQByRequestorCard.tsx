import { CRQSchedule, Engineer, RequestorType } from '@/types/crq';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface CRQByRequestorCardProps {
  schedules: CRQSchedule[];
  engineers: Engineer[];
}

const requestorBg: Record<string, { card: string; badge: string; dot: string }> = {
  Deployment: {
    card: 'border-requestor-deployment/30 bg-requestor-deployment/5',
    badge: 'bg-requestor-deployment/20 text-requestor-deployment border-requestor-deployment/30',
    dot: 'bg-requestor-deployment',
  },
  NOC: {
    card: 'border-requestor-noc/30 bg-requestor-noc/5',
    badge: 'bg-requestor-noc/20 text-requestor-noc border-requestor-noc/30',
    dot: 'bg-requestor-noc',
  },
  Circle: {
    card: 'border-requestor-circle/30 bg-requestor-circle/5',
    badge: 'bg-requestor-circle/20 text-requestor-circle border-requestor-circle/30',
    dot: 'bg-requestor-circle',
  },
};

const requestors: RequestorType[] = ['Deployment', 'NOC', 'Circle'];

const CRQByRequestorCard = ({ schedules, engineers }: CRQByRequestorCardProps) => {
  const [drilldown, setDrilldown] = useState<RequestorType | null>(null);
  const engineerMap = Object.fromEntries(engineers.map(e => [e.id, e]));

  const requestorStats = requestors.map(r => ({
    requestor: r,
    count: schedules.filter(s => s.requestor === r).length,
    hours: schedules.filter(s => s.requestor === r).reduce((sum, s) => sum + (s.endHour - s.startHour), 0),
    schedules: schedules.filter(s => s.requestor === r),
  }));

  const drilldownSchedules = drilldown ? schedules.filter(s => s.requestor === drilldown) : [];

  return (
    <div className="rounded-lg bg-card border border-border glow-card animate-slide-in">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold">CRQ by Requestor</h2>
        <p className="text-xs text-muted-foreground mt-1">Click a requestor to drilldown</p>
      </div>

      {!drilldown ? (
        <div className="p-4 space-y-3">
          {requestorStats.map(({ requestor, count, hours }) => {
            const style = requestorBg[requestor];
            return (
              <button
                key={requestor}
                onClick={() => setDrilldown(requestor)}
                className={`w-full rounded-lg border p-4 text-left transition-all hover:scale-[1.01] hover:shadow-md ${style.card}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${style.dot}`} />
                    <span className="font-semibold text-sm">{requestor}</span>
                  </div>
                  <Badge variant="outline" className={`font-mono text-sm ${style.badge}`}>
                    {count} CRQs
                  </Badge>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{hours}h scheduled today</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${requestorBg[drilldown].dot}`} />
              <span className="font-semibold">{drilldown} — {drilldownSchedules.length} CRQs</span>
            </div>
            <button onClick={() => setDrilldown(null)} className="text-xs text-muted-foreground hover:text-foreground underline">← Back</button>
          </div>
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin divide-y divide-border">
            {drilldownSchedules.map(s => {
              const eng = engineerMap[s.engineerId];
              return (
                <div key={s.id} className="p-3 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-sm">{s.crqNumber}</span>
                    <Badge variant="outline" className={`text-[10px] border-0 ${s.team === 'CCB' ? 'bg-level-l4/20 text-level-l4' : 'bg-requestor-circle/20 text-requestor-circle'}`}>{s.team}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.taskType} · {s.domain} / {s.subdomain}</div>
                  <div className="text-xs text-muted-foreground">{eng?.name} ({eng?.level}) · {s.startHour}:00–{s.endHour}:00</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CRQByRequestorCard;
