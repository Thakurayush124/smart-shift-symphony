import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Engineer, CRQSchedule, TaskType, EngineerLevel, LEVEL_ORDER } from '@/types/crq';
import { toast } from '@/hooks/use-toast';

interface ManualScheduleDialogProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
  onSchedule: (schedule: CRQSchedule) => void;
}

const taskTypes: TaskType[] = ['MOP Creation', 'MOP Validation', 'Impact Analysis', 'Deployment', 'Rollback', 'Monitoring'];

const ManualScheduleDialog = ({ engineers, schedules, onSchedule }: ManualScheduleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [crqNumber, setCrqNumber] = useState('');
  const [engineerId, setEngineerId] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [taskType, setTaskType] = useState('');
  const [domain, setDomain] = useState('');
  const [level, setLevel] = useState('');
  const [conflict, setConflict] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const checkConflict = () => {
    const start = parseInt(startHour);
    const end = parseInt(endHour);
    if (!engineerId || isNaN(start) || isNaN(end)) return;

    const eng = engineers.find(e => e.id === engineerId);
    if (!eng) return;

    // Shift violation
    if (start < eng.shiftStart || end > eng.shiftEnd) {
      setConflict(`Shift violation: ${eng.name}'s shift is ${eng.shiftStart}:00–${eng.shiftEnd}:00`);
      setSuggestion(`Schedule within ${eng.shiftStart}:00–${eng.shiftEnd}:00`);
      return;
    }

    // Overlap
    const overlapping = schedules.find(
      s => s.engineerId === engineerId && !(end <= s.startHour || start >= s.endHour)
    );
    if (overlapping) {
      setConflict(`Conflict: ${eng.name} already has ${overlapping.crqNumber} at ${overlapping.startHour}:00–${overlapping.endHour}:00`);
      // Find nearest free slot
      const engSchedules = schedules.filter(s => s.engineerId === engineerId).sort((a, b) => a.startHour - b.startHour);
      const duration = end - start;
      for (let h = eng.shiftStart; h + duration <= eng.shiftEnd; h++) {
        const free = !engSchedules.some(s => !(h + duration <= s.startHour || h >= s.endHour));
        if (free) {
          setSuggestion(`Nearest free slot: ${h}:00–${h + duration}:00`);
          return;
        }
      }
      // Alternate engineer
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
      requestor: 'Deployment',
      domain: domain || eng.domain,
      subdomain: eng.subdomain,
      levelRequired: (level || eng.level) as EngineerLevel,
      slaStatus: 'On Track',
      allocatedAt: new Date().toISOString(),
    };
    onSchedule(newSchedule);
    toast({ title: 'Scheduled', description: `${crqNumber} assigned to ${eng.name}` });
    setOpen(false);
    setCrqNumber(''); setEngineerId(''); setStartHour(''); setEndHour(''); setTaskType(''); setConflict(null); setSuggestion(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Manual Slot Allocation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Manual Slot Allocation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">CRQ Number</Label>
            <Input placeholder="CRQ-2025-XXX" value={crqNumber} onChange={e => setCrqNumber(e.target.value)} className="bg-secondary" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Engineer</Label>
            <Select value={engineerId} onValueChange={v => { setEngineerId(v); setConflict(null); }}>
              <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select Engineer" /></SelectTrigger>
              <SelectContent>
                {engineers.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]).map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.name} ({e.level}) – {e.domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Start Hour</Label>
              <Input type="number" min={0} max={23} placeholder="10" value={startHour} onChange={e => { setStartHour(e.target.value); setConflict(null); }} className="bg-secondary" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">End Hour</Label>
              <Input type="number" min={0} max={23} placeholder="12" value={endHour} onChange={e => { setEndHour(e.target.value); setConflict(null); }} className="bg-secondary" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Activity Type</Label>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger className="bg-secondary"><SelectValue placeholder="Select Task" /></SelectTrigger>
              <SelectContent>
                {taskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Domain</Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Domain" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Network">Network</SelectItem>
                  <SelectItem value="Cloud">Cloud</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Level Required</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L4">L4</SelectItem>
                  <SelectItem value="L3">L3</SelectItem>
                  <SelectItem value="L2">L2</SelectItem>
                  <SelectItem value="L1">L1</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
