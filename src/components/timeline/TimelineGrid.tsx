import { useState, useCallback } from 'react';
import { Engineer, CRQSchedule, LEVEL_ORDER, WORK_HOURS } from '@/types/crq';
import CRQBlock from './CRQBlock';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TimelineGridProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
  onReschedule?: (scheduleId: string, newEngineerId: string, newStartHour: number, newEndHour: number) => void;
}

const levelColors: Record<string, string> = {
  L4: 'bg-level-l4/20 text-level-l4 border-level-l4/30',
  L3: 'bg-level-l3/20 text-level-l3 border-level-l3/30',
  L2: 'bg-level-l2/20 text-level-l2 border-level-l2/30',
  L1: 'bg-level-l1/20 text-level-l1 border-level-l1/30',
};

const HOUR_WIDTH = 80;

interface DropTarget {
  engineerId: string;
  hour: number;
  schedule: CRQSchedule;
  conflict: string | null;
}

const TimelineGrid = ({ engineers, schedules, onReschedule }: TimelineGridProps) => {
  const sorted = [...engineers].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  const [dropConfirm, setDropConfirm] = useState<DropTarget | null>(null);
  const [dragOverCell, setDragOverCell] = useState<{ engId: string; hour: number } | null>(null);

  const checkDropConflict = useCallback((schedule: CRQSchedule, targetEngId: string, targetHour: number): string | null => {
    const duration = schedule.endHour - schedule.startHour;
    const newEnd = targetHour + duration;
    const eng = engineers.find(e => e.id === targetEngId);
    if (!eng) return 'Engineer not found';

    if (targetHour < eng.shiftStart || newEnd > eng.shiftEnd) {
      return `Shift violation: ${eng.name}'s shift is ${eng.shiftStart}:00–${eng.shiftEnd}:00`;
    }

    const overlap = schedules.find(
      s => s.id !== schedule.id && s.engineerId === targetEngId && !(newEnd <= s.startHour || targetHour >= s.endHour)
    );
    if (overlap) {
      return `Conflict: ${eng.name} has ${overlap.crqNumber} at ${overlap.startHour}:00–${overlap.endHour}:00`;
    }

    return null;
  }, [engineers, schedules]);

  const handleDrop = useCallback((e: React.DragEvent, engId: string, hour: number) => {
    e.preventDefault();
    setDragOverCell(null);
    try {
      const schedule: CRQSchedule = JSON.parse(e.dataTransfer.getData('application/json'));
      const conflict = checkDropConflict(schedule, engId, hour);
      setDropConfirm({ engineerId: engId, hour, schedule, conflict });
    } catch {}
  }, [checkDropConflict]);

  const handleDragOver = useCallback((e: React.DragEvent, engId: string, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ engId, hour });
  }, []);

  const confirmDrop = () => {
    if (!dropConfirm || dropConfirm.conflict) return;
    const { schedule, engineerId, hour } = dropConfirm;
    const duration = schedule.endHour - schedule.startHour;
    onReschedule?.(schedule.id, engineerId, hour, hour + duration);
    const eng = engineers.find(e => e.id === engineerId);
    toast({ title: 'Rescheduled', description: `${schedule.crqNumber} moved to ${eng?.name} at ${hour}:00–${hour + duration}:00` });
    setDropConfirm(null);
  };

  return (
    <>
      <div className="rounded-lg bg-card border border-border glow-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <div style={{ minWidth: `${200 + WORK_HOURS.length * HOUR_WIDTH}px` }}>
            {/* Header */}
            <div className="flex border-b border-border bg-secondary/50 sticky top-0 z-10">
              <div className="w-[200px] flex-shrink-0 p-3 text-xs font-medium uppercase tracking-wider text-muted-foreground border-r border-border">
                Engineer
              </div>
              {WORK_HOURS.map(h => (
                <div key={h} className="text-center text-[11px] font-mono text-muted-foreground border-r border-border/50 py-3" style={{ width: HOUR_WIDTH }}>
                  {h}:00
                </div>
              ))}
            </div>
            {/* Rows */}
            {sorted.map(eng => {
              const engSchedules = schedules.filter(s => s.engineerId === eng.id);
              return (
                <div key={eng.id} className="flex border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <div className="w-[200px] flex-shrink-0 p-3 border-r border-border flex flex-col justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{eng.name}</span>
                      <Badge variant="outline" className={`text-[9px] border ${levelColors[eng.level]}`}>{eng.level}</Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{eng.domain}</span>
                  </div>
                  <div className="relative flex-1" style={{ height: 56 }}>
                    {/* Shift boundary + drop zones */}
                    {WORK_HOURS.map(h => {
                      const inShift = h >= eng.shiftStart && h < eng.shiftEnd;
                      const isFree = inShift && !engSchedules.some(s => h >= s.startHour && h < s.endHour);
                      const isDragOver = dragOverCell?.engId === eng.id && dragOverCell?.hour === h;
                      return (
                        <div
                          key={h}
                          className={`absolute top-0 bottom-0 border-r transition-colors ${
                            !inShift
                              ? 'bg-off-shift/80 border-border/10'
                              : isFree
                                ? 'bg-status-free/10 border-status-free/20'
                                : 'border-border/30'
                          } ${isDragOver && inShift ? 'bg-primary/20 ring-1 ring-primary/40' : ''}`}
                          style={{ left: (h - WORK_HOURS[0]) * HOUR_WIDTH, width: HOUR_WIDTH }}
                          onDrop={inShift ? (e) => handleDrop(e, eng.id, h) : undefined}
                          onDragOver={inShift ? (e) => handleDragOver(e, eng.id, h) : undefined}
                          onDragLeave={() => setDragOverCell(null)}
                        >
                          {!inShift && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,hsl(var(--border)/0.3)_4px,hsl(var(--border)/0.3)_5px)]" />
                            </div>
                          )}
                          {isFree && (
                            <div className="absolute inset-x-1 top-1 bottom-1 rounded-sm border border-dashed border-status-free/30 flex items-center justify-center">
                              <span className="text-[8px] text-status-free/50 font-medium">FREE</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* CRQ blocks */}
                    {engSchedules.map(s => (
                      <CRQBlock
                        key={s.id}
                        schedule={s}
                        engineerName={eng.name}
                        engineerLevel={eng.level}
                        hourWidth={HOUR_WIDTH}
                        startOffset={(s.startHour - WORK_HOURS[0]) * HOUR_WIDTH + 2}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drop confirmation dialog */}
      <Dialog open={!!dropConfirm} onOpenChange={() => setDropConfirm(null)}>
        <DialogContent className="sm:max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle>Confirm Reschedule</DialogTitle>
          </DialogHeader>
          {dropConfirm && (
            <div className="space-y-3">
              <div className="text-sm">
                Move <span className="font-mono font-bold">{dropConfirm.schedule.crqNumber}</span> to{' '}
                <span className="font-medium">{engineers.find(e => e.id === dropConfirm.engineerId)?.name}</span> at{' '}
                <span className="font-mono">{dropConfirm.hour}:00–{dropConfirm.hour + (dropConfirm.schedule.endHour - dropConfirm.schedule.startHour)}:00</span>
              </div>
              {dropConfirm.conflict && (
                <Alert variant="destructive" className="border-status-conflict/50 bg-status-conflict/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{dropConfirm.conflict}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDropConfirm(null)}>Cancel</Button>
            <Button onClick={confirmDrop} disabled={!!dropConfirm?.conflict}>
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimelineGrid;
