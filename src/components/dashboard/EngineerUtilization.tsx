import { useState } from 'react';
import { Engineer, CRQSchedule, EngineerLevel, TaskType, LEVEL_ORDER } from '@/types/crq';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EngineerUtilizationProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
}

const levelColors: Record<EngineerLevel, string> = {
  L4: 'bg-level-l4/20 text-level-l4 border-level-l4/30',
  L3: 'bg-level-l3/20 text-level-l3 border-level-l3/30',
  L2: 'bg-level-l2/20 text-level-l2 border-level-l2/30',
  L1: 'bg-level-l1/20 text-level-l1 border-level-l1/30',
};

const EngineerUtilization = ({ engineers, schedules }: EngineerUtilizationProps) => {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [taskFilter, setTaskFilter] = useState<string>('all');

  const filteredEngineers = engineers
    .filter(e => levelFilter === 'all' || e.level === levelFilter)
    .filter(e => {
      if (taskFilter === 'all') return true;
      return schedules.some(s => s.engineerId === e.id && s.taskType === taskFilter);
    })
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);

  const getEngineerStats = (eng: Engineer) => {
    const engSchedules = schedules.filter(s => s.engineerId === eng.id);
    const scheduledHours = engSchedules.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
    const shiftHours = eng.shiftEnd - eng.shiftStart;
    const utilization = shiftHours > 0 ? Math.round((scheduledHours / shiftHours) * 100) : 0;
    const freeHours = shiftHours - scheduledHours;
    return { scheduledHours, shiftHours, utilization, freeHours, taskCount: engSchedules.length };
  };

  const taskTypes: TaskType[] = ['MOP Creation', 'MOP Validation', 'Impact Analysis', 'Deployment', 'Rollback', 'Monitoring'];

  return (
    <div className="rounded-lg bg-card border border-border glow-card animate-slide-in">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Engineer Utilization</h2>
        <div className="flex gap-3">
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-28 h-8 text-xs bg-secondary">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="L4">L4</SelectItem>
              <SelectItem value="L3">L3</SelectItem>
              <SelectItem value="L2">L2</SelectItem>
              <SelectItem value="L1">L1</SelectItem>
            </SelectContent>
          </Select>
          <Select value={taskFilter} onValueChange={setTaskFilter}>
            <SelectTrigger className="w-36 h-8 text-xs bg-secondary">
              <SelectValue placeholder="Task Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              {taskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin divide-y divide-border">
        {filteredEngineers.map(eng => {
          const stats = getEngineerStats(eng);
          return (
            <div key={eng.id} className="p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{eng.name}</span>
                  <Badge variant="outline" className={`text-[10px] border ${levelColors[eng.level]}`}>{eng.level}</Badge>
                </div>
                <span className="font-mono text-sm font-bold" style={{
                  color: stats.utilization > 80 ? 'hsl(var(--status-conflict))' : stats.utilization > 50 ? 'hsl(var(--status-warning))' : 'hsl(var(--status-free))'
                }}>
                  {stats.utilization}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{eng.domain} · {eng.subdomain}</span>
                <span>{eng.shiftStart}:00–{eng.shiftEnd}:00</span>
              </div>
              {/* Utilization bar */}
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.utilization}%`,
                    backgroundColor: stats.utilization > 80 ? 'hsl(var(--status-conflict))' : stats.utilization > 50 ? 'hsl(var(--status-warning))' : 'hsl(var(--status-free))'
                  }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground font-mono">
                <span>Scheduled: {stats.scheduledHours}h</span>
                <span>Free: {stats.freeHours}h</span>
                <span>Tasks: {stats.taskCount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EngineerUtilization;
