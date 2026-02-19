import { useState, useMemo } from 'react';
import { DOMAIN_SUBDOMAIN_MAP, ALL_DOMAINS, TeamType, TaskType, RequestorType, TEAM_TASKS } from '@/types/crq';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterBarProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  domain: string;
  subdomain: string;
  team: string;
  taskType: string;
  level: string;
  requestor: string;
}

const requestors: RequestorType[] = ['Deployment', 'NOC', 'Circle'];

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    domain: 'all', subdomain: 'all', team: 'all', taskType: 'all', level: 'all', requestor: 'all',
  });

  const update = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    if (key === 'domain') next.subdomain = 'all';
    if (key === 'team') next.taskType = 'all';
    setFilters(next);
    onFiltersChange(next);
  };

  const subdomains = useMemo(() => {
    if (filters.domain === 'all') return [];
    return DOMAIN_SUBDOMAIN_MAP[filters.domain] || [];
  }, [filters.domain]);

  const taskTypes: TaskType[] = useMemo(() => {
    if (filters.team === 'all') return [...TEAM_TASKS['CCB'], ...TEAM_TASKS['SE']];
    return TEAM_TASKS[filters.team as TeamType];
  }, [filters.team]);

  return (
    <div className="flex items-center gap-2 flex-wrap p-4 rounded-lg bg-card border border-border mb-4">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-1">Filters</span>

      <Select value={filters.domain} onValueChange={v => update('domain', v)}>
        <SelectTrigger className="w-36 h-8 text-xs bg-secondary"><SelectValue placeholder="Domain" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Domains</SelectItem>
          {ALL_DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.subdomain} onValueChange={v => update('subdomain', v)} disabled={filters.domain === 'all'}>
        <SelectTrigger className="w-40 h-8 text-xs bg-secondary"><SelectValue placeholder={filters.domain === 'all' ? 'Select Domain first' : 'All Subdomains'} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subdomains</SelectItem>
          {subdomains.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.team} onValueChange={v => update('team', v)}>
        <SelectTrigger className="w-24 h-8 text-xs bg-secondary"><SelectValue placeholder="Team" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teams</SelectItem>
          <SelectItem value="CCB">CCB</SelectItem>
          <SelectItem value="SE">SE</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.taskType} onValueChange={v => update('taskType', v)}>
        <SelectTrigger className="w-44 h-8 text-xs bg-secondary"><SelectValue placeholder="Task Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          {taskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.level} onValueChange={v => update('level', v)}>
        <SelectTrigger className="w-24 h-8 text-xs bg-secondary"><SelectValue placeholder="Level" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="L4">L4</SelectItem>
          <SelectItem value="L3">L3</SelectItem>
          <SelectItem value="L2">L2</SelectItem>
          <SelectItem value="L1">L1</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.requestor} onValueChange={v => update('requestor', v)}>
        <SelectTrigger className="w-28 h-8 text-xs bg-secondary"><SelectValue placeholder="Requestor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {requestors.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;
