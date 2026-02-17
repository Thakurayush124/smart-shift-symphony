import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CalendarIcon, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DashboardHeader = ({ selectedDate, onDateChange }: DashboardHeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10 glow-primary">
          <LayoutDashboard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRQ Monitoring Dashboard</h1>
          <p className="text-sm text-muted-foreground">Department Head — Smart Scheduling & Allocation</p>
        </div>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 bg-secondary border-border">
            <CalendarIcon className="h-4 w-4 text-primary" />
            {format(selectedDate, 'EEE, MMM d, yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => { if (d) { onDateChange(d); setOpen(false); } }}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DashboardHeader;
