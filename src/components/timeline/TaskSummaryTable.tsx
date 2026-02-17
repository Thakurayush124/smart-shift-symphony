import { Engineer, CRQSchedule, TaskType, LEVEL_ORDER } from '@/types/crq';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TaskSummaryTableProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
}

const TASK_TYPES: TaskType[] = ['Deployment', 'MOP Creation', 'MOP Validation', 'Impact Analysis', 'Rollback', 'Monitoring'];

const TaskSummaryTable = ({ engineers, schedules }: TaskSummaryTableProps) => {
  const sorted = [...engineers]
    .filter(e => schedules.some(s => s.engineerId === e.id))
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);

  const getHours = (engId: string, taskType: TaskType) => {
    return schedules
      .filter(s => s.engineerId === engId && s.taskType === taskType)
      .reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
  };

  return (
    <div className="rounded-lg bg-card border border-border glow-card mt-4 overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Engineer Task Summary</h3>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-xs">Engineer</TableHead>
              {TASK_TYPES.map(t => (
                <TableHead key={t} className="text-xs text-center">{t} (hrs)</TableHead>
              ))}
              <TableHead className="text-xs text-center font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(eng => {
              const total = TASK_TYPES.reduce((sum, t) => sum + getHours(eng.id, t), 0);
              return (
                <TableRow key={eng.id}>
                  <TableCell className="text-xs font-medium">{eng.name} <span className="text-muted-foreground">({eng.level})</span></TableCell>
                  {TASK_TYPES.map(t => {
                    const hrs = getHours(eng.id, t);
                    return <TableCell key={t} className="text-center font-mono text-xs">{hrs || '–'}</TableCell>;
                  })}
                  <TableCell className="text-center font-mono text-xs font-bold">{total}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TaskSummaryTable;
