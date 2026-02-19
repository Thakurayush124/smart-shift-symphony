import { CRQSchedule, TaskType } from '@/types/crq';

interface TaskWiseSummaryCardProps {
  schedules: CRQSchedule[];
}

const TASK_TYPES: TaskType[] = ['MOP Creation', 'MOP Validation', 'Impact Analysis', 'Deployment', 'Rollback', 'Monitoring'];

const TaskWiseSummaryCard = ({ schedules }: TaskWiseSummaryCardProps) => {
  const taskData = TASK_TYPES.map(t => {
    const hours = schedules
      .filter(s => s.taskType === t)
      .reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
    return { type: t, hours };
  }).filter(d => d.hours > 0);

  const maxHours = Math.max(...taskData.map(d => d.hours), 1);

  return (
    <div className="rounded-lg bg-card border border-border glow-card animate-slide-in">
      <div className="p-5 border-b border-border">
        <h2 className="text-lg font-semibold">Task-Wise Summary</h2>
        <p className="text-xs text-muted-foreground mt-1">Hours per task type today</p>
      </div>
      <div className="p-4 space-y-3">
        {taskData.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-4">No tasks scheduled</div>
        ) : (
          taskData.map(d => (
            <div key={d.type}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{d.type}</span>
                <span className="text-xs font-mono font-bold">{d.hours}h</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(d.hours / maxHours) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskWiseSummaryCard;
