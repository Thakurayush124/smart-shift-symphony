import { useState, useMemo } from 'react';
import { EngineerLevel, TaskType, RequestorType } from '@/types/crq';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { engineers as allEngineers } from '@/data/mockData';

interface FilterBarProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  domain: string;
  subdomain: string;
  taskType: string;
  level: string;
  requestor: string;
}

const FilterBar = ({ onFiltersChange }: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    domain: 'all', subdomain: 'all', taskType: 'all', level: 'all', requestor: 'all',
  });

  const update = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value };
    // Reset subdomain when domain changes
    if (key === 'domain') next.subdomain = 'all';
    setFilters(next);
    onFiltersChange(next);
  };

  // Derive subdomains based on selected domain
  const subdomains = useMemo(() => {
    let engs = allEngineers;
    if (filters.domain !== 'all') engs = engs.filter(e => e.domain === filters.domain);
    return [...new Set(engs.map(e => e.subdomain))];
  }, [filters.domain]);

  const taskTypes: TaskType[] = ['MOP Creation', 'MOP Validation', 'Impact Analysis', 'Deployment', 'Rollback', 'Monitoring'];
  const requestors: RequestorType[] = ['Deployment', 'NOC', 'Circle'];

  return (
    <div className="flex items-center gap-3 flex-wrap p-4 rounded-lg bg-card border border-border mb-4">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-2">Filters</span>
      <Select value={filters.domain} onValueChange={v => update('domain', v)}>
        <SelectTrigger className="w-28 h-8 text-xs bg-secondary"><SelectValue placeholder="Domain" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Domains</SelectItem>
          <SelectItem value="Network">Network</SelectItem>
          <SelectItem value="Cloud">Cloud</SelectItem>
          <SelectItem value="Security">Security</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.subdomain} onValueChange={v => update('subdomain', v)}>
        <SelectTrigger className="w-36 h-8 text-xs bg-secondary"><SelectValue placeholder="Subdomain" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subdomains</SelectItem>
          {subdomains.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filters.taskType} onValueChange={v => update('taskType', v)}>
        <SelectTrigger className="w-32 h-8 text-xs bg-secondary"><SelectValue placeholder="Task Type" /></SelectTrigger>
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
