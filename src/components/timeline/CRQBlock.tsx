import { CRQSchedule, RequestorType } from '@/types/crq';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface CRQBlockProps {
  schedule: CRQSchedule;
  engineerName: string;
  engineerLevel: string;
  hourWidth: number;
  startOffset: number;
}

const requestorStyles: Record<RequestorType, { bg: string; border: string; text: string }> = {
  Deployment: { bg: 'bg-requestor-deployment/25', border: 'border-requestor-deployment/50', text: 'text-requestor-deployment' },
  NOC: { bg: 'bg-requestor-noc/25', border: 'border-requestor-noc/50', text: 'text-requestor-noc' },
  Circle: { bg: 'bg-requestor-circle/25', border: 'border-requestor-circle/50', text: 'text-requestor-circle' },
};

const slaDot: Record<string, string> = {
  'On Track': 'bg-status-free',
  'At Risk': 'bg-status-warning',
  'Breached': 'bg-status-conflict animate-pulse-glow',
};

const CRQBlock = ({ schedule, engineerName, engineerLevel, hourWidth, startOffset }: CRQBlockProps) => {
  const duration = schedule.endHour - schedule.startHour;
  const width = duration * hourWidth - 4;
  const left = startOffset;
  const style = requestorStyles[schedule.requestor];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`absolute top-1 rounded-md border cursor-pointer transition-all hover:scale-[1.02] hover:z-10 ${style.bg} ${style.border} overflow-hidden`}
          style={{ left: `${left}px`, width: `${width}px`, height: 'calc(100% - 8px)' }}
        >
          <div className="p-1.5 h-full flex flex-col justify-between">
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] font-bold truncate">{schedule.crqNumber}</span>
              <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${slaDot[schedule.slaStatus]}`} />
            </div>
            {width > 80 && (
              <div className="flex gap-1 flex-wrap">
                <Badge variant="outline" className={`text-[8px] px-1 py-0 h-3.5 border-0 ${style.bg} ${style.text}`}>
                  {schedule.requestor}
                </Badge>
                {width > 130 && (
                  <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">
                    {schedule.taskType}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs bg-popover border-border">
        <div className="space-y-1.5 text-xs">
          <div className="font-mono font-bold text-sm">{schedule.crqNumber}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
            <span>Engineer</span><span className="text-foreground">{engineerName}</span>
            <span>Level</span><span className="text-foreground">{engineerLevel}</span>
            <span>Domain</span><span className="text-foreground">{schedule.domain}</span>
            <span>Subdomain</span><span className="text-foreground">{schedule.subdomain}</span>
            <span>Task Type</span><span className="text-foreground">{schedule.taskType}</span>
            <span>Requestor</span><span className={requestorStyles[schedule.requestor].text}>{schedule.requestor}</span>
            <span>Time</span><span className="text-foreground">{schedule.startHour}:00 – {schedule.endHour}:00</span>
            <span>SLA</span><span className="text-foreground">{schedule.slaStatus}</span>
            <span>Allocated</span><span className="text-foreground">{new Date(schedule.allocatedAt).toLocaleString()}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default CRQBlock;
