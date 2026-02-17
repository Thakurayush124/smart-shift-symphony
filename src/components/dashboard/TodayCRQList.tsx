import { useState } from 'react';
import { CRQSchedule, Engineer, TaskType, RequestorType } from '@/types/crq';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TodayCRQListProps {
  schedules: CRQSchedule[];
  engineers: Engineer[];
}

const requestorBg: Record<string, string> = {
  Deployment: 'bg-requestor-deployment/20 text-requestor-deployment border-requestor-deployment/30',
  NOC: 'bg-requestor-noc/20 text-requestor-noc border-requestor-noc/30',
  Circle: 'bg-requestor-circle/20 text-requestor-circle border-requestor-circle/30',
};

const slaBg: Record<string, string> = {
  'On Track': 'bg-status-free/15 text-status-free',
  'At Risk': 'bg-status-warning/15 text-status-warning',
  'Breached': 'bg-status-conflict/15 text-status-conflict',
};

const taskTypes: TaskType[] = ['MOP Creation', 'MOP Validation', 'Impact Analysis', 'Deployment', 'Rollback', 'Monitoring'];
const requestors: RequestorType[] = ['Deployment', 'NOC', 'Circle'];

const TodayCRQList = ({ schedules, engineers }: TodayCRQListProps) => {
  const [taskFilter, setTaskFilter] = useState<string>('all');
  const [requestorFilter, setRequestorFilter] = useState<string>('all');

  const engineerMap = Object.fromEntries(engineers.map(e => [e.id, e]));

  const filtered = schedules
    .filter(s => taskFilter === 'all' || s.taskType === taskFilter)
    .filter(s => requestorFilter === 'all' || s.requestor === requestorFilter);

  // Task type distribution
  const taskDist: Record<string, number> = {};
  filtered.forEach(s => {
    taskDist[s.taskType] = (taskDist[s.taskType] || 0) + 1;
  });

  return (
    <div className="rounded-lg bg-card border border-border glow-card animate-slide-in">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold">Today's Scheduled CRQs</h2>
        <div className="flex gap-2 mt-3 items-center flex-wrap">
          <Select value={taskFilter} onValueChange={setTaskFilter}>
            <SelectTrigger className="w-32 h-7 text-xs bg-secondary"><SelectValue placeholder="Task Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              {taskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={requestorFilter} onValueChange={setRequestorFilter}>
            <SelectTrigger className="w-28 h-7 text-xs bg-secondary"><SelectValue placeholder="Requestor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {requestors.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-1.5 ml-auto flex-wrap">
            {Object.entries(taskDist).map(([type, count]) => (
              <Badge key={type} variant="outline" className="text-[10px] font-mono">
                {type}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No CRQs match filters</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(s => {
              const eng = engineerMap[s.engineerId];
              return (
                <div key={s.id} className="p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-semibold text-sm">{s.crqNumber}</span>
                    <Badge className={`text-[10px] ${slaBg[s.slaStatus]} border-0`}>{s.slaStatus}</Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-[10px] border ${requestorBg[s.requestor]}`}>
                      {s.requestor}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{s.taskType}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {eng?.name} ({eng?.level}) · {s.startHour}:00–{s.endHour}:00
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayCRQList;
