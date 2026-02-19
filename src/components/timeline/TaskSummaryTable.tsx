import { Engineer, CRQSchedule, TaskType, LEVEL_ORDER } from '@/types/crq';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TaskSummaryTableProps {
  engineers: Engineer[];
  schedules: CRQSchedule[];
}

const TASK_TYPES: TaskType[] = ['CRQ Review', 'Impact Analysis', 'MOP Creation', 'MOP Validation', 'Scheduling of Activity', 'Scheduling Communication', 'Activity NW Exec'];

const TaskSummaryTable = ({ engineers, schedules }: TaskSummaryTableProps) => {
  const sorted = [...engineers]
    .filter(e => schedules.some(s => s.engineerId === e.id))
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);

  const getHours = (engId: string, taskType: TaskType) => {
    return schedules
      .filter(s => s.engineerId === engId && s.taskType === taskType)
      .reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
  };

  // Only show task columns that have any data
  const activeTasks = TASK_TYPES.filter(t => schedules.some(s => s.taskType === t));

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
              <TableHead className="text-xs">Team</TableHead>
              {activeTasks.map(t => (
                <TableHead key={t} className="text-xs text-center whitespace-nowrap">{t}</TableHead>
              ))}
              <TableHead className="text-xs text-center font-bold">Total hrs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(eng => {
              const total = activeTasks.reduce((sum, t) => sum + getHours(eng.id, t), 0);
              return (
                <TableRow key={eng.id}>
                  <TableCell className="text-xs font-medium">{eng.name} <span className="text-muted-foreground">({eng.level})</span></TableCell>
                  <TableCell className="text-xs">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${eng.team === 'CCB' ? 'bg-level-l4/20 text-level-l4' : 'bg-requestor-circle/20 text-requestor-circle'}`}>
                      {eng.team}
                    </span>
                  </TableCell>
                  {activeTasks.map(t => {
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
