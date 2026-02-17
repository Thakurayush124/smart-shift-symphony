export type EngineerLevel = 'L4' | 'L3' | 'L2' | 'L1';

export type TaskType = 'MOP Creation' | 'MOP Validation' | 'Impact Analysis' | 'Deployment' | 'Rollback' | 'Monitoring';

export type RequestorType = 'Deployment' | 'NOC' | 'Circle';

export type SLAStatus = 'On Track' | 'At Risk' | 'Breached';

export interface Engineer {
  id: string;
  name: string;
  level: EngineerLevel;
  domain: string;
  subdomain: string;
  shiftStart: number; // hour 0-23
  shiftEnd: number;
  skills: TaskType[];
}

export interface CRQSchedule {
  id: string;
  crqNumber: string;
  engineerId: string;
  date: string; // YYYY-MM-DD
  startHour: number;
  endHour: number;
  taskType: TaskType;
  requestor: RequestorType;
  domain: string;
  subdomain: string;
  levelRequired: EngineerLevel;
  slaStatus: SLAStatus;
  allocatedAt: string;
}

export interface TimeSlot {
  startHour: number;
  endHour: number;
  isFree: boolean;
  crq?: CRQSchedule;
}

export const LEVEL_ORDER: Record<EngineerLevel, number> = {
  L4: 0,
  L3: 1,
  L2: 2,
  L1: 3,
};

export const REQUESTOR_COLORS: Record<RequestorType, string> = {
  Deployment: 'requestor-deployment',
  NOC: 'requestor-noc',
  Circle: 'requestor-circle',
};

export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const WORK_HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 7 PM
