export type EngineerLevel = 'L4' | 'L3' | 'L2' | 'L1';

export type TeamType = 'CCB' | 'SE';

export type CCBTaskType = 'CRQ Review' | 'Impact Analysis' | 'MOP Creation' | 'MOP Validation';
export type SETaskType = 'Scheduling of Activity' | 'Scheduling Communication' | 'Activity NW Exec';
export type TaskType = CCBTaskType | SETaskType;

export type RequestorType = 'Deployment' | 'NOC' | 'Circle';

export type SLAStatus = 'On Track' | 'At Risk' | 'Breached';

export type ShiftType = 'General Shift' | 'Night Shift' | 'Week Off' | 'On Leave';

// Master Domain → Subdomain mapping (strictly as per requirement)
export const DOMAIN_SUBDOMAIN_MAP: Record<string, string[]> = {
  'IP Access': ['OLT Access', 'CEN Access', 'MPLS Access', 'Optics'],
  'Network Expansion': ['OTN / LCD', 'NNI', 'Project'],
  'Packet': ['Packet Change', 'Packet NI'],
  'IP Core': ['MPLS Core', 'CEN Core', 'BRAS Core'],
  'Service Optimization': ['Service Optimization'],
  'Embedded Support': ['Site shifting', 'Upgradation-Home', 'Upgradation-Optics', 'Upgradation-IP MPLS'],
};

export const ALL_DOMAINS = Object.keys(DOMAIN_SUBDOMAIN_MAP);

export const CCB_TASKS: CCBTaskType[] = ['CRQ Review', 'Impact Analysis', 'MOP Creation', 'MOP Validation'];
export const SE_TASKS: SETaskType[] = ['Scheduling of Activity', 'Scheduling Communication', 'Activity NW Exec'];

export const TEAM_TASKS: Record<TeamType, TaskType[]> = {
  CCB: CCB_TASKS,
  SE: SE_TASKS,
};

export interface Engineer {
  id: string;
  name: string;
  level: EngineerLevel;
  domain: string;
  subdomain: string;
  shiftStart: number; // hour 0-23
  shiftEnd: number;
  shiftType: ShiftType;
  skills: TaskType[];
  team: TeamType;
}

export interface CRQSchedule {
  id: string;
  crqNumber: string;
  engineerId: string;
  date: string; // YYYY-MM-DD
  startHour: number;
  endHour: number;
  taskType: TaskType;
  team: TeamType;
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
export const WORK_HOURS = Array.from({ length: 24 }, (_, i) => i); // Full 24h view
