import { CRQSchedule, Engineer } from '@/types/crq';
import { Activity, Clock, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface StatsCardsProps {
  schedules: CRQSchedule[];
  engineers: Engineer[];
}

const StatsCards = ({ schedules, engineers }: StatsCardsProps) => {
  const totalCRQs = schedules.length;
  const totalHours = schedules.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
  const activeEngineers = new Set(schedules.map(s => s.engineerId)).size;
  const onTrack = schedules.filter(s => s.slaStatus === 'On Track').length;
  const atRisk = schedules.filter(s => s.slaStatus === 'At Risk').length;
  const breached = schedules.filter(s => s.slaStatus === 'Breached').length;
  const ccbCount = schedules.filter(s => s.team === 'CCB').length;
  const seCount = schedules.filter(s => s.team === 'SE').length;

  const cards = [
    { label: "Today's CRQs", value: totalCRQs, icon: Activity, accent: 'text-primary', sub: `CCB: ${ccbCount} · SE: ${seCount}` },
    { label: 'Total Work Hours', value: `${totalHours}h`, icon: Clock, accent: 'text-status-free', sub: `Across ${activeEngineers} engineers` },
    { label: 'Active Engineers', value: `${activeEngineers}/${engineers.length}`, icon: Users, accent: 'text-requestor-circle', sub: 'On shift today' },
    { label: 'On Track', value: onTrack, icon: CheckCircle, accent: 'text-status-ontrack', sub: 'SLA compliant' },
    { label: 'At Risk', value: atRisk, icon: AlertTriangle, accent: 'text-status-warning', sub: 'Needs attention' },
    { label: 'Breached', value: breached, icon: XCircle, accent: 'text-status-breached', sub: 'SLA violated' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg bg-card border border-border p-4 glow-card animate-slide-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
            <card.icon className={`h-3.5 w-3.5 ${card.accent}`} />
          </div>
          <div className="text-2xl font-bold font-mono mb-1">{card.value}</div>
          <div className="text-[10px] text-muted-foreground">{card.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
