import { CRQSchedule, Engineer } from '@/types/crq';
import { Activity, Clock, Users, AlertTriangle } from 'lucide-react';

interface StatsCardsProps {
  schedules: CRQSchedule[];
  engineers: Engineer[];
}

const StatsCards = ({ schedules, engineers }: StatsCardsProps) => {
  const totalCRQs = schedules.length;
  const totalHours = schedules.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
  const activeEngineers = new Set(schedules.map(s => s.engineerId)).size;
  const atRisk = schedules.filter(s => s.slaStatus === 'At Risk' || s.slaStatus === 'Breached').length;

  const cards = [
    { label: "Today's CRQs", value: totalCRQs, icon: Activity, accent: 'text-primary' },
    { label: 'Total Work Hours', value: `${totalHours}h`, icon: Clock, accent: 'text-status-free' },
    { label: 'Active Engineers', value: `${activeEngineers}/${engineers.length}`, icon: Users, accent: 'text-requestor-circle' },
    { label: 'SLA At Risk', value: atRisk, icon: AlertTriangle, accent: 'text-status-warning' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg bg-card border border-border p-5 glow-card animate-slide-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
            <card.icon className={`h-4 w-4 ${card.accent}`} />
          </div>
          <div className="text-3xl font-bold font-mono">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
