import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { engineers, schedules as allSchedules } from '@/data/mockData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import TodayCRQList from '@/components/dashboard/TodayCRQList';
import EngineerUtilization from '@/components/dashboard/EngineerUtilization';
import TaskWiseSummaryCard from '@/components/dashboard/TaskWiseSummaryCard';
import CRQByRequestorCard from '@/components/dashboard/CRQByRequestorCard';
import { Button } from '@/components/ui/button';
import { CalendarClock } from 'lucide-react';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const daySchedules = useMemo(() =>
    allSchedules.filter(s => s.date === dateStr),
    [dateStr]
  );

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <StatsCards schedules={daySchedules} engineers={engineers} />

        <div className="flex justify-end mb-4">
          <Button onClick={() => navigate('/timeline')} className="gap-2">
            <CalendarClock className="h-4 w-4" />
            Schedule Timeline
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TodayCRQList schedules={daySchedules} engineers={engineers} />
          <EngineerUtilization engineers={engineers} schedules={daySchedules} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskWiseSummaryCard schedules={daySchedules} />
          <CRQByRequestorCard schedules={daySchedules} engineers={engineers} />
        </div>
      </div>
    </div>
  );
};

export default Index;
