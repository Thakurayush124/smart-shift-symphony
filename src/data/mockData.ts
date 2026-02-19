import { Engineer, CRQSchedule } from '@/types/crq';

export const engineers: Engineer[] = [
  // L4 Engineers
  { id: 'e1', name: 'Rajesh Kumar', level: 'L4', domain: 'Network', subdomain: 'Core Routing', shiftStart: 9, shiftEnd: 18, skills: ['Deployment', 'Impact Analysis', 'Rollback', 'Monitoring'] },
  { id: 'e2', name: 'Priya Sharma', level: 'L4', domain: 'Cloud', subdomain: 'AWS Infrastructure', shiftStart: 8, shiftEnd: 17, skills: ['Deployment', 'Impact Analysis', 'MOP Validation'] },
  // L3 Engineers
  { id: 'e3', name: 'Amit Patel', level: 'L3', domain: 'Network', subdomain: 'Firewall', shiftStart: 9, shiftEnd: 18, skills: ['MOP Creation', 'MOP Validation', 'Deployment', 'Monitoring'] },
  { id: 'e4', name: 'Sneha Reddy', level: 'L3', domain: 'Cloud', subdomain: 'Azure Services', shiftStart: 10, shiftEnd: 19, skills: ['Impact Analysis', 'Deployment', 'Rollback'] },
  { id: 'e5', name: 'Vikram Singh', level: 'L3', domain: 'Security', subdomain: 'IAM', shiftStart: 9, shiftEnd: 18, skills: ['MOP Validation', 'Impact Analysis', 'Monitoring'] },
  // L2 Engineers
  { id: 'e6', name: 'Ananya Das', level: 'L2', domain: 'Network', subdomain: 'LAN/WAN', shiftStart: 9, shiftEnd: 18, skills: ['MOP Creation', 'Monitoring', 'Deployment'] },
  { id: 'e7', name: 'Karthik Nair', level: 'L2', domain: 'Cloud', subdomain: 'GCP', shiftStart: 8, shiftEnd: 17, skills: ['MOP Creation', 'MOP Validation', 'Monitoring'] },
  { id: 'e8', name: 'Meera Joshi', level: 'L2', domain: 'Security', subdomain: 'SOC', shiftStart: 10, shiftEnd: 19, skills: ['Monitoring', 'Impact Analysis', 'Rollback'] },
  // L1 Engineers
  { id: 'e9', name: 'Rahul Verma', level: 'L1', domain: 'Network', subdomain: 'DNS', shiftStart: 9, shiftEnd: 18, skills: ['MOP Creation', 'Monitoring'] },
  { id: 'e10', name: 'Deepa Iyer', level: 'L1', domain: 'Cloud', subdomain: 'Storage', shiftStart: 9, shiftEnd: 18, skills: ['MOP Creation', 'Monitoring'] },
];

const today = new Date().toISOString().split('T')[0];

export const schedules: CRQSchedule[] = [
  { id: 's1', crqNumber: 'CRQ-2025-001', engineerId: 'e1', date: today, startHour: 10, endHour: 12, taskType: 'Deployment', requestor: 'Deployment', domain: 'Network', subdomain: 'Core Routing', levelRequired: 'L4', slaStatus: 'On Track', allocatedAt: '2025-02-16T08:00:00Z' },
  { id: 's2', crqNumber: 'CRQ-2025-002', engineerId: 'e1', date: today, startHour: 14, endHour: 16, taskType: 'Impact Analysis', requestor: 'NOC', domain: 'Network', subdomain: 'Core Routing', levelRequired: 'L4', slaStatus: 'On Track', allocatedAt: '2025-02-16T09:00:00Z' },
  { id: 's3', crqNumber: 'CRQ-2025-003', engineerId: 'e2', date: today, startHour: 9, endHour: 11, taskType: 'MOP Validation', requestor: 'Circle', domain: 'Cloud', subdomain: 'AWS Infrastructure', levelRequired: 'L4', slaStatus: 'At Risk', allocatedAt: '2025-02-16T07:30:00Z' },
  { id: 's4', crqNumber: 'CRQ-2025-004', engineerId: 'e2', date: today, startHour: 13, endHour: 15, taskType: 'Deployment', requestor: 'Deployment', domain: 'Cloud', subdomain: 'AWS Infrastructure', levelRequired: 'L4', slaStatus: 'On Track', allocatedAt: '2025-02-16T08:15:00Z' },
  { id: 's5', crqNumber: 'CRQ-2025-005', engineerId: 'e3', date: today, startHour: 9, endHour: 11, taskType: 'MOP Creation', requestor: 'Deployment', domain: 'Network', subdomain: 'Firewall', levelRequired: 'L3', slaStatus: 'On Track', allocatedAt: '2025-02-16T10:00:00Z' },
  { id: 's6', crqNumber: 'CRQ-2025-006', engineerId: 'e3', date: today, startHour: 13, endHour: 14, taskType: 'Monitoring', requestor: 'NOC', domain: 'Network', subdomain: 'Firewall', levelRequired: 'L3', slaStatus: 'On Track', allocatedAt: '2025-02-16T10:30:00Z' },
  { id: 's7', crqNumber: 'CRQ-2025-007', engineerId: 'e4', date: today, startHour: 11, endHour: 13, taskType: 'Impact Analysis', requestor: 'Circle', domain: 'Cloud', subdomain: 'Azure Services', levelRequired: 'L3', slaStatus: 'Breached', allocatedAt: '2025-02-16T09:45:00Z' },
  { id: 's8', crqNumber: 'CRQ-2025-008', engineerId: 'e5', date: today, startHour: 10, endHour: 12, taskType: 'MOP Validation', requestor: 'NOC', domain: 'Security', subdomain: 'IAM', levelRequired: 'L3', slaStatus: 'On Track', allocatedAt: '2025-02-16T08:45:00Z' },
  { id: 's9', crqNumber: 'CRQ-2025-009', engineerId: 'e6', date: today, startHour: 9, endHour: 10, taskType: 'Monitoring', requestor: 'NOC', domain: 'Network', subdomain: 'LAN/WAN', levelRequired: 'L2', slaStatus: 'On Track', allocatedAt: '2025-02-16T11:00:00Z' },
  { id: 's10', crqNumber: 'CRQ-2025-010', engineerId: 'e6', date: today, startHour: 11, endHour: 13, taskType: 'MOP Creation', requestor: 'Deployment', domain: 'Network', subdomain: 'LAN/WAN', levelRequired: 'L2', slaStatus: 'At Risk', allocatedAt: '2025-02-16T11:15:00Z' },
  { id: 's11', crqNumber: 'CRQ-2025-011', engineerId: 'e7', date: today, startHour: 8, endHour: 10, taskType: 'MOP Creation', requestor: 'Circle', domain: 'Cloud', subdomain: 'GCP', levelRequired: 'L2', slaStatus: 'On Track', allocatedAt: '2025-02-16T07:00:00Z' },
  { id: 's12', crqNumber: 'CRQ-2025-012', engineerId: 'e8', date: today, startHour: 14, endHour: 16, taskType: 'Rollback', requestor: 'Deployment', domain: 'Security', subdomain: 'SOC', levelRequired: 'L2', slaStatus: 'On Track', allocatedAt: '2025-02-16T12:00:00Z' },
  { id: 's13', crqNumber: 'CRQ-2025-013', engineerId: 'e9', date: today, startHour: 10, endHour: 12, taskType: 'Monitoring', requestor: 'NOC', domain: 'Network', subdomain: 'DNS', levelRequired: 'L1', slaStatus: 'On Track', allocatedAt: '2025-02-16T09:00:00Z' },
  { id: 's14', crqNumber: 'CRQ-2025-014', engineerId: 'e10', date: today, startHour: 13, endHour: 15, taskType: 'MOP Creation', requestor: 'Circle', domain: 'Cloud', subdomain: 'Storage', levelRequired: 'L1', slaStatus: 'On Track', allocatedAt: '2025-02-16T10:00:00Z' },
];
