import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { engineers as allEngineers, schedules as mockSchedules } from '@/data/mockData';
import { CRQSchedule, LEVEL_ORDER } from '@/types/crq';
import FilterBar, { FilterState } from '@/components/timeline/FilterBar';
import TimelineGrid from '@/components/timeline/TimelineGrid';
import TaskSummaryTable from '@/components/timeline/TaskSummaryTable';
import TimelineAnalytics from '@/components/timeline/TimelineAnalytics';
import ManualScheduleDialog from '@/components/scheduling/ManualScheduleDialog';

const ScheduleTimeline = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calOpen, setCalOpen] = useState(false);
  const [extraSchedules, setExtraSchedules] = useState<CRQSchedule[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    domain: 'all', subdomain: '', taskType: 'all', level: 'all', requestor: 'all',
  });

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const allSchedules = useMemo(() => [...mockSchedules, ...extraSchedules], [extraSchedules]);

  const daySchedules = useMemo(() => {
    return allSchedules
      .filter(s => s.date === dateStr)
      .filter(s => filters.domain === 'all' || s.domain === filters.domain)
      .filter(s => !filters.subdomain || s.subdomain.toLowerCase().includes(filters.subdomain.toLowerCase()))
      .filter(s => filters.taskType === 'all' || s.taskType === filters.taskType)
      .filter(s => filters.requestor === 'all' || s.requestor === filters.requestor);
  }, [dateStr, allSchedules, filters]);

  const filteredEngineers = useMemo(() => {
    let engs = allEngineers;
    if (filters.level !== 'all') engs = engs.filter(e => e.level === filters.level);
    if (filters.domain !== 'all') engs = engs.filter(e => e.domain === filters.domain);
    return engs.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  }, [filters]);

  const handleNewSchedule = (s: CRQSchedule) => {
    setExtraSchedules(prev => [...prev, { ...s, date: dateStr }]);
  };

  const handleReschedule = useCallback((scheduleId: string, newEngineerId: string, newStartHour: number, newEndHour: number) => {
    // Check if it's a mock schedule or extra
    const isMock = mockSchedules.some(s => s.id === scheduleId);
    if (isMock) {
      // Move mock to extra with updated values
      const original = mockSchedules.find(s => s.id === scheduleId)!;
      setExtraSchedules(prev => [
        ...prev,
        { ...original, id: `${scheduleId}-moved`, engineerId: newEngineerId, startHour: newStartHour, endHour: newEndHour },
        // Mark original as "removed" by adding a placeholder
      ]);
      // We can't mutate mockSchedules, so we track moved IDs
    } else {
      setExtraSchedules(prev =>
        prev.map(s => s.id === scheduleId
          ? { ...s, engineerId: newEngineerId, startHour: newStartHour, endHour: newEndHour }
          : s
        )
      );
    }
  }, []);

  // Filter out mock schedules that were "moved"
  const movedIds = extraSchedules.filter(s => s.id.endsWith('-moved')).map(s => s.id.replace('-moved', ''));
  const effectiveSchedules = daySchedules.filter(s => !movedIds.includes(s.id));

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Schedule Timeline</h1>
              <p className="text-sm text-muted-foreground">L4 → L1 hierarchy view · Drag CRQs to reschedule</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ManualScheduleDialog engineers={allEngineers} schedules={effectiveSchedules} onSchedule={handleNewSchedule} />
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 bg-secondary border-border">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  {format(selectedDate, 'EEE, MMM d')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={d => { if (d) { setSelectedDate(d); setCalOpen(false); } }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs flex-wrap">
          <span className="text-muted-foreground">Requestor:</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-requestor-deployment" /> Deployment</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-requestor-noc" /> NOC</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-requestor-circle" /> Circle</span>
          <span className="text-muted-foreground ml-4">Slots:</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-status-free/20 border border-dashed border-status-free/40" /> Free</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-off-shift/80 border border-border/30" style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 2px,hsl(220 15% 20% / 0.4) 2px,hsl(220 15% 20% / 0.4) 3px)' }} /> Off Shift</span>
          <span className="text-muted-foreground ml-4">SLA:</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-status-ontrack" /> On Track</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-status-warning" /> At Risk</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-status-breached" /> Breached</span>
        </div>

        <FilterBar onFiltersChange={setFilters} />
        <TimelineGrid engineers={filteredEngineers} schedules={effectiveSchedules} onReschedule={handleReschedule} />
        <TaskSummaryTable engineers={filteredEngineers} schedules={effectiveSchedules} />
        <TimelineAnalytics engineers={filteredEngineers} schedules={effectiveSchedules} />
      </div>
    </div>
  );
};

export default ScheduleTimeline;
