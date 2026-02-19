import { useState } from 'react';
import { CRQSchedule, Engineer, TaskType, RequestorType, CCB_TASKS, SE_TASKS } from '@/types/crq';
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

const allTaskTypes: TaskType[] = [...CCB_TASKS, ...SE_TASKS];
const requestors: RequestorType[] = ['Deployment', 'NOC', 'Circle'];

const TodayCRQList = ({ schedules, engineers }: TodayCRQListProps) => {
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [taskFilter, setTaskFilter] = useState<string>('all');
  const [requestorFilter, setRequestorFilter] = useState<string>('all');

  const engineerMap = Object.fromEntries(engineers.map(e => [e.id, e]));

  const filtered = schedules
    .filter(s => teamFilter === 'all' || s.team === teamFilter)
    .filter(s => taskFilter === 'all' || s.taskType === taskFilter)
    .filter(s => requestorFilter === 'all' || s.requestor === requestorFilter);

  const taskDist: Record<string, number> = {};
  filtered.forEach(s => { taskDist[s.taskType] = (taskDist[s.taskType] || 0) + 1; });

  return (
    <div className="rounded-lg bg-card border border-border glow-card animate-slide-in">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold">Today's Scheduled CRQs</h2>
        <div className="flex gap-2 mt-3 items-center flex-wrap">
          <Select value={teamFilter} onValueChange={v => { setTeamFilter(v); setTaskFilter('all'); }}>
            <SelectTrigger className="w-24 h-7 text-xs bg-secondary"><SelectValue placeholder="Team" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="CCB">CCB</SelectItem>
              <SelectItem value="SE">SE</SelectItem>
            </SelectContent>
          </Select>
          <Select value={taskFilter} onValueChange={setTaskFilter}>
            <SelectTrigger className="w-44 h-7 text-xs bg-secondary"><SelectValue placeholder="Task Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              {allTaskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
              <Badge key={type} variant="outline" className="text-[10px] font-mono">{type}: {count}</Badge>
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
                    <div className="flex items-center gap-1.5">
                      <Badge className={`text-[10px] px-1.5 ${s.team === 'CCB' ? 'bg-level-l4/20 text-level-l4' : 'bg-requestor-circle/20 text-requestor-circle'} border-0`}>{s.team}</Badge>
                      <Badge className={`text-[10px] ${slaBg[s.slaStatus]} border-0`}>{s.slaStatus}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-[10px] border ${requestorBg[s.requestor]}`}>{s.requestor}</Badge>
                    <Badge variant="outline" className="text-[10px]">{s.taskType}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {eng?.name} ({eng?.level}) · {s.startHour}:00–{s.endHour}:00
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{s.domain} / {s.subdomain}</div>
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
