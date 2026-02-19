import { useMemo } from 'react';
import { Engineer, CRQSchedule, TaskType, RequestorType, SLAStatus } from '@/types/crq';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TimelineAnalyticsProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
}

const TASK_COLORS: Record<string, string> = {
  'MOP Creation': 'hsl(210, 100%, 55%)',
  'MOP Validation': 'hsl(270, 60%, 60%)',
  'Impact Analysis': 'hsl(45, 90%, 55%)',
  'Deployment': 'hsl(150, 50%, 40%)',
  'Rollback': 'hsl(0, 72%, 51%)',
  'Monitoring': 'hsl(185, 80%, 50%)',
};

const REQUESTOR_COLORS: Record<string, string> = {
  Deployment: 'hsl(270, 60%, 60%)',
  NOC: 'hsl(45, 90%, 55%)',
  Circle: 'hsl(185, 80%, 50%)',
};

const SLA_COLORS: Record<string, string> = {
  'On Track': 'hsl(150, 60%, 45%)',
  'At Risk': 'hsl(38, 92%, 50%)',
  'Breached': 'hsl(0, 80%, 55%)',
};

const TimelineAnalytics = ({ engineers, schedules }: TimelineAnalyticsProps) => {
  const totalCRQs = schedules.length;

  const slaData = useMemo(() => {
    const counts: Record<SLAStatus, number> = { 'On Track': 0, 'At Risk': 0, 'Breached': 0 };
    schedules.forEach(s => counts[s.slaStatus]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: SLA_COLORS[name] }));
  }, [schedules]);

  const taskData = useMemo(() => {
    const map: Record<string, number> = {};
    schedules.forEach(s => {
      map[s.taskType] = (map[s.taskType] || 0) + (s.endHour - s.startHour);
    });
    return Object.entries(map).map(([name, hours]) => ({ name, hours, fill: TASK_COLORS[name] || 'hsl(210, 100%, 55%)' }));
  }, [schedules]);

  const requestorData = useMemo(() => {
    const map: Record<string, number> = {};
    schedules.forEach(s => { map[s.requestor] = (map[s.requestor] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value, color: REQUESTOR_COLORS[name] || '#888' }));
  }, [schedules]);

  const onTrack = slaData.find(d => d.name === 'On Track')?.value || 0;
  const atRisk = slaData.find(d => d.name === 'At Risk')?.value || 0;
  const breached = slaData.find(d => d.name === 'Breached')?.value || 0;

  const totalHours = schedules.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
  const activeEngineers = new Set(schedules.map(s => s.engineerId)).size;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" /> Today's CRQ Overview & Analytics
      </h3>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total CRQs', value: totalCRQs, icon: Activity, color: 'text-primary' },
          { label: 'Total Hours', value: `${totalHours}h`, icon: Clock, color: 'text-status-free' },
          { label: 'Active Engineers', value: `${activeEngineers}/${engineers.length}`, icon: CheckCircle, color: 'text-requestor-circle' },
          { label: 'On Track', value: onTrack, icon: CheckCircle, color: 'text-status-ontrack' },
          { label: 'At Risk', value: atRisk, icon: AlertTriangle, color: 'text-status-warning' },
          { label: 'Breached', value: breached, icon: XCircle, color: 'text-status-breached' },
        ].map(card => (
          <div key={card.label} className="rounded-lg bg-card border border-border p-3 glow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{card.label}</span>
              <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold font-mono">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SLA Status Pie */}
        <div className="rounded-lg bg-card border border-border p-4 glow-card">
          <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">SLA Status Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slaData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                  {slaData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(220, 25%, 12%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(210, 20%, 92%)' }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: 'hsl(210, 20%, 92%)', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Hours Bar */}
        <div className="rounded-lg bg-card border border-border p-4 glow-card">
          <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Hours by Task Type</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(215, 12%, 55%)' }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 9, fill: 'hsl(215, 12%, 55%)' }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(220, 25%, 12%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(210, 20%, 92%)' }}
                  formatter={(value: number) => [`${value}h`, 'Hours']}
                />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={14}>
                  {taskData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requestor Pie */}
        <div className="rounded-lg bg-card border border-border p-4 glow-card">
          <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">CRQs by Requestor</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={requestorData} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                  {requestorData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(220, 25%, 12%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: 'hsl(210, 20%, 92%)' }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: 'hsl(210, 20%, 92%)', fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineAnalytics;
