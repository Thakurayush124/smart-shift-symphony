import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Engineer, CRQSchedule, TaskType, EngineerLevel, RequestorType, LEVEL_ORDER } from '@/types/crq';
import { toast } from '@/hooks/use-toast';

interface ManualScheduleDialogProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
  onSchedule: (schedule: CRQSchedule) => void;
}

const taskTypes: TaskType[] = ['MOP Creation', 'MOP Validation', 'Impact Analysis', 'Deployment', 'Rollback', 'Monitoring'];
const requestorTypes: RequestorType[] = ['Deployment', 'NOC', 'Circle'];

const ManualScheduleDialog = ({ engineers, schedules, onSchedule }: ManualScheduleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [crqNumber, setCrqNumber] = useState('');
  const [engineerId, setEngineerId] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [taskType, setTaskType] = useState('');
  const [requestor, setRequestor] = useState<string>('');
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [conflict, setConflict] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  // Derive unique domains from engineers
  const domains = useMemo(() => [...new Set(engineers.map(e => e.domain))], [engineers]);

  // Filter engineers based on selected domain and level
  const filteredEngineers = useMemo(() => {
    let engs = [...engineers].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
    if (domain) engs = engs.filter(e => e.domain === domain);
    if (level) engs = engs.filter(e => e.level === level);
    if (taskType) engs = engs.filter(e => e.skills.includes(taskType as TaskType));
    return engs;
  }, [engineers, domain, level, taskType]);

  // When engineer is selected, auto-populate domain/level
  const selectedEngineer = engineers.find(e => e.id === engineerId);

  // Generate time options based on selected engineer's shift
  const timeOptions = useMemo(() => {
    if (!selectedEngineer) return Array.from({ length: 13 }, (_, i) => i + 7);
    return Array.from(
      { length: selectedEngineer.shiftEnd - selectedEngineer.shiftStart + 1 },
      (_, i) => i + selectedEngineer.shiftStart
    );
  }, [selectedEngineer]);

  const checkConflict = () => {
    const start = parseInt(startHour);
    const end = parseInt(endHour);
    if (!engineerId || isNaN(start) || isNaN(end)) return;

    const eng = engineers.find(e => e.id === engineerId);
    if (!eng) return;

    if (start < eng.shiftStart || end > eng.shiftEnd) {
      setConflict(`Shift violation: ${eng.name}'s shift is ${eng.shiftStart}:00–${eng.shiftEnd}:00`);
      setSuggestion(`Schedule within ${eng.shiftStart}:00–${eng.shiftEnd}:00`);
      return;
    }

    const overlapping = schedules.find(
      s => s.engineerId === engineerId && !(end <= s.startHour || start >= s.endHour)
    );
    if (overlapping) {
      setConflict(`Conflict: ${eng.name} already has ${overlapping.crqNumber} at ${overlapping.startHour}:00–${overlapping.endHour}:00`);
      const engSchedules = schedules.filter(s => s.engineerId === engineerId).sort((a, b) => a.startHour - b.startHour);
      const duration = end - start;
      for (let h = eng.shiftStart; h + duration <= eng.shiftEnd; h++) {
        const free = !engSchedules.some(s => !(h + duration <= s.startHour || h >= s.endHour));
        if (free) {
          setSuggestion(`Nearest free slot: ${h}:00–${h + duration}:00`);
          return;
        }
      }
      const alt = engineers.find(e =>
        e.id !== engineerId &&
        LEVEL_ORDER[e.level] <= LEVEL_ORDER[eng.level] &&
        !schedules.some(s => s.engineerId === e.id && !(end <= s.startHour || start >= s.endHour))
      );
      setSuggestion(alt ? `Alternate engineer: ${alt.name} (${alt.level})` : 'No alternatives available');
      return;
    }

    setConflict(null);
    setSuggestion(null);
  };

  const handleSubmit = () => {
    if (!crqNumber || !engineerId || !startHour || !endHour || !taskType) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    checkConflict();
    if (conflict) return;

    const eng = engineers.find(e => e.id === engineerId)!;
    const newSchedule: CRQSchedule = {
      id: `s-${Date.now()}`,
      crqNumber,
      engineerId,
      date: new Date().toISOString().split('T')[0],
      startHour: parseInt(startHour),
      endHour: parseInt(endHour),
      taskType: taskType as TaskType,
      requestor: (requestor || 'Deployment') as RequestorType,
      domain: domain || eng.domain,
      subdomain: eng.subdomain,
      levelRequired: (level || eng.level) as EngineerLevel,
      slaStatus: 'On Track',
      allocatedAt: new Date().toISOString(),
    };
    onSchedule(newSchedule);
    toast({ title: 'Scheduled', description: `${crqNumber} assigned to ${eng.name}` });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCrqNumber(''); setEngineerId(''); setStartHour(''); setEndHour('');
    setTaskType(''); setRequestor(''); setDomain(''); setLevel('');
    setConflict(null); setSuggestion(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Manual Slot Allocation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manual Slot Allocation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">CRQ Number</Label>
            <Input placeholder="CRQ-2025-XXX" value={crqNumber} onChange={e => setCrqNumber(e.target.value)} className="bg-secondary" />
          </div>

          {/* Filters that affect engineer dropdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Domain</Label>
              <Select value={domain} onValueChange={v => { setDomain(v); setEngineerId(''); setConflict(null); }}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Level Required</Label>
              <Select value={level} onValueChange={v => { setLevel(v); setEngineerId(''); setConflict(null); }}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="L4">L4</SelectItem>
                  <SelectItem value="L3">L3</SelectItem>
                  <SelectItem value="L2">L2</SelectItem>
                  <SelectItem value="L1">L1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Activity Type</Label>
              <Select value={taskType} onValueChange={v => { setTaskType(v); setEngineerId(''); setConflict(null); }}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {taskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Engineer <span className="text-muted-foreground">({filteredEngineers.length} available)</span></Label>
            <Select value={engineerId} onValueChange={v => { setEngineerId(v); setConflict(null); }}>
              <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select Engineer" /></SelectTrigger>
              <SelectContent>
                {filteredEngineers.map(e => {
                  const engSchedules = schedules.filter(s => s.engineerId === e.id);
                  const busyHrs = engSchedules.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
                  const shiftHrs = e.shiftEnd - e.shiftStart;
                  const freeHrs = shiftHrs - busyHrs;
                  return (
                    <SelectItem key={e.id} value={e.id}>
                      <div className="flex items-center gap-2">
                        <span>{e.name}</span>
                        <span className="text-muted-foreground text-[10px]">({e.level})</span>
                        <span className="text-[10px] text-status-free">{freeHrs}h free</span>
                        <span className="text-muted-foreground text-[10px]">{e.shiftStart}–{e.shiftEnd}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedEngineer && (
            <div className="rounded-md bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{selectedEngineer.name}</span> · {selectedEngineer.domain} / {selectedEngineer.subdomain} · Shift: {selectedEngineer.shiftStart}:00–{selectedEngineer.shiftEnd}:00 · Skills: {selectedEngineer.skills.join(', ')}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Start Hour</Label>
              <Select value={startHour} onValueChange={v => { setStartHour(v); setConflict(null); }}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Start" /></SelectTrigger>
                <SelectContent>
                  {timeOptions.slice(0, -1).map(h => (
                    <SelectItem key={h} value={String(h)}>{h}:00</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">End Hour</Label>
              <Select value={endHour} onValueChange={v => { setEndHour(v); setConflict(null); }}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="End" /></SelectTrigger>
                <SelectContent>
                  {timeOptions.filter(h => h > parseInt(startHour || '0')).map(h => (
                    <SelectItem key={h} value={String(h)}>{h}:00</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Requestor Type</Label>
            <Select value={requestor} onValueChange={setRequestor}>
              <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select Requestor" /></SelectTrigger>
              <SelectContent>
                {requestorTypes.map(r => (
                  <SelectItem key={r} value={r}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-sm ${r === 'Deployment' ? 'bg-requestor-deployment' : r === 'NOC' ? 'bg-requestor-noc' : 'bg-requestor-circle'}`} />
                      {r}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {conflict && (
            <Alert variant="destructive" className="border-status-conflict/50 bg-status-conflict/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <p className="font-medium">{conflict}</p>
                {suggestion && <p className="mt-1 text-muted-foreground">{suggestion}</p>}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { checkConflict(); }}>Validate</Button>
            <Button onClick={handleSubmit} disabled={!!conflict}>
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualScheduleDialog;
