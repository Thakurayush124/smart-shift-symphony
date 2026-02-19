import { Engineer, CRQSchedule } from '@/types/crq';

export const engineers: Engineer[] = [
  // L4 - CCB Team
  { id: 'e1', name: 'Rajesh Kumar', level: 'L4', domain: 'IP Core', subdomain: 'MPLS Core', shiftStart: 9, shiftEnd: 18, shiftType: 'General Shift', team: 'CCB', skills: ['CRQ Review', 'Impact Analysis', 'MOP Validation'] },
  { id: 'e2', name: 'Priya Sharma', level: 'L4', domain: 'IP Access', subdomain: 'OLT Access', shiftStart: 8, shiftEnd: 17, shiftType: 'General Shift', team: 'CCB', skills: ['CRQ Review', 'Impact Analysis', 'MOP Creation', 'MOP Validation'] },
  // L3 - CCB Team
  { id: 'e3', name: 'Amit Patel', level: 'L3', domain: 'IP Access', subdomain: 'MPLS Access', shiftStart: 9, shiftEnd: 18, shiftType: 'General Shift', team: 'CCB', skills: ['MOP Creation', 'MOP Validation', 'Impact Analysis'] },
  { id: 'e4', name: 'Sneha Reddy', level: 'L3', domain: 'Packet', subdomain: 'Packet Change', shiftStart: 22, shiftEnd: 6, shiftType: 'Night Shift', team: 'SE', skills: ['Scheduling of Activity', 'Scheduling Communication'] },
  { id: 'e5', name: 'Vikram Singh', level: 'L3', domain: 'IP Core', subdomain: 'CEN Core', shiftStart: 9, shiftEnd: 18, shiftType: 'General Shift', team: 'SE', skills: ['Scheduling of Activity', 'Activity NW Exec'] },
  // L2 - SE Team
  { id: 'e6', name: 'Ananya Das', level: 'L2', domain: 'Network Expansion', subdomain: 'OTN / LCD', shiftStart: 9, shiftEnd: 18, shiftType: 'General Shift', team: 'SE', skills: ['Scheduling Communication', 'Activity NW Exec'] },
  { id: 'e7', name: 'Karthik Nair', level: 'L2', domain: 'Embedded Support', subdomain: 'Upgradation-Optics', shiftStart: 8, shiftEnd: 17, shiftType: 'General Shift', team: 'CCB', skills: ['MOP Creation', 'MOP Validation'] },
  { id: 'e8', name: 'Meera Joshi', level: 'L2', domain: 'Service Optimization', subdomain: 'Service Optimization', shiftStart: 10, shiftEnd: 19, shiftType: 'General Shift', team: 'SE', skills: ['Scheduling of Activity', 'Activity NW Exec'] },
  // L1
  { id: 'e9', name: 'Rahul Verma', level: 'L1', domain: 'IP Access', subdomain: 'CEN Access', shiftStart: 9, shiftEnd: 18, shiftType: 'General Shift', team: 'CCB', skills: ['MOP Creation', 'CRQ Review'] },
  { id: 'e10', name: 'Deepa Iyer', level: 'L1', domain: 'Network Expansion', subdomain: 'Project', shiftStart: 9, shiftEnd: 18, shiftType: 'General Shift', team: 'SE', skills: ['Scheduling Communication', 'Scheduling of Activity'] },
];

const today = new Date().toISOString().split('T')[0];

export const schedules: CRQSchedule[] = [
  { id: 's1', crqNumber: 'CRQ-2025-001', engineerId: 'e1', date: today, startHour: 10, endHour: 12, taskType: 'CRQ Review', team: 'CCB', requestor: 'Deployment', domain: 'IP Core', subdomain: 'MPLS Core', levelRequired: 'L4', slaStatus: 'On Track', allocatedAt: '2025-02-16T08:00:00Z' },
  { id: 's2', crqNumber: 'CRQ-2025-002', engineerId: 'e1', date: today, startHour: 14, endHour: 16, taskType: 'Impact Analysis', team: 'CCB', requestor: 'NOC', domain: 'IP Core', subdomain: 'MPLS Core', levelRequired: 'L4', slaStatus: 'On Track', allocatedAt: '2025-02-16T09:00:00Z' },
  { id: 's3', crqNumber: 'CRQ-2025-003', engineerId: 'e2', date: today, startHour: 9, endHour: 11, taskType: 'MOP Validation', team: 'CCB', requestor: 'Circle', domain: 'IP Access', subdomain: 'OLT Access', levelRequired: 'L4', slaStatus: 'At Risk', allocatedAt: '2025-02-16T07:30:00Z' },
  { id: 's4', crqNumber: 'CRQ-2025-004', engineerId: 'e2', date: today, startHour: 13, endHour: 15, taskType: 'CRQ Review', team: 'CCB', requestor: 'Deployment', domain: 'IP Access', subdomain: 'OLT Access', levelRequired: 'L4', slaStatus: 'On Track', allocatedAt: '2025-02-16T08:15:00Z' },
  { id: 's5', crqNumber: 'CRQ-2025-005', engineerId: 'e3', date: today, startHour: 9, endHour: 11, taskType: 'MOP Creation', team: 'CCB', requestor: 'Deployment', domain: 'IP Access', subdomain: 'MPLS Access', levelRequired: 'L3', slaStatus: 'On Track', allocatedAt: '2025-02-16T10:00:00Z' },
  { id: 's6', crqNumber: 'CRQ-2025-006', engineerId: 'e3', date: today, startHour: 13, endHour: 14, taskType: 'Impact Analysis', team: 'CCB', requestor: 'NOC', domain: 'IP Access', subdomain: 'MPLS Access', levelRequired: 'L3', slaStatus: 'On Track', allocatedAt: '2025-02-16T10:30:00Z' },
  { id: 's7', crqNumber: 'CRQ-2025-007', engineerId: 'e5', date: today, startHour: 11, endHour: 13, taskType: 'Scheduling of Activity', team: 'SE', requestor: 'Circle', domain: 'IP Core', subdomain: 'CEN Core', levelRequired: 'L3', slaStatus: 'Breached', allocatedAt: '2025-02-16T09:45:00Z' },
  { id: 's8', crqNumber: 'CRQ-2025-008', engineerId: 'e5', date: today, startHour: 14, endHour: 16, taskType: 'Activity NW Exec', team: 'SE', requestor: 'NOC', domain: 'IP Core', subdomain: 'CEN Core', levelRequired: 'L3', slaStatus: 'On Track', allocatedAt: '2025-02-16T08:45:00Z' },
  { id: 's9', crqNumber: 'CRQ-2025-009', engineerId: 'e6', date: today, startHour: 9, endHour: 10, taskType: 'Scheduling Communication', team: 'SE', requestor: 'NOC', domain: 'Network Expansion', subdomain: 'OTN / LCD', levelRequired: 'L2', slaStatus: 'On Track', allocatedAt: '2025-02-16T11:00:00Z' },
  { id: 's10', crqNumber: 'CRQ-2025-010', engineerId: 'e6', date: today, startHour: 11, endHour: 13, taskType: 'Activity NW Exec', team: 'SE', requestor: 'Deployment', domain: 'Network Expansion', subdomain: 'OTN / LCD', levelRequired: 'L2', slaStatus: 'At Risk', allocatedAt: '2025-02-16T11:15:00Z' },
  { id: 's11', crqNumber: 'CRQ-2025-011', engineerId: 'e7', date: today, startHour: 8, endHour: 10, taskType: 'MOP Creation', team: 'CCB', requestor: 'Circle', domain: 'Embedded Support', subdomain: 'Upgradation-Optics', levelRequired: 'L2', slaStatus: 'On Track', allocatedAt: '2025-02-16T07:00:00Z' },
  { id: 's12', crqNumber: 'CRQ-2025-012', engineerId: 'e8', date: today, startHour: 14, endHour: 16, taskType: 'Scheduling of Activity', team: 'SE', requestor: 'Deployment', domain: 'Service Optimization', subdomain: 'Service Optimization', levelRequired: 'L2', slaStatus: 'On Track', allocatedAt: '2025-02-16T12:00:00Z' },
  { id: 's13', crqNumber: 'CRQ-2025-013', engineerId: 'e9', date: today, startHour: 10, endHour: 12, taskType: 'CRQ Review', team: 'CCB', requestor: 'NOC', domain: 'IP Access', subdomain: 'CEN Access', levelRequired: 'L1', slaStatus: 'On Track', allocatedAt: '2025-02-16T09:00:00Z' },
  { id: 's14', crqNumber: 'CRQ-2025-014', engineerId: 'e10', date: today, startHour: 13, endHour: 15, taskType: 'Scheduling Communication', team: 'SE', requestor: 'Circle', domain: 'Network Expansion', subdomain: 'Project', levelRequired: 'L1', slaStatus: 'On Track', allocatedAt: '2025-02-16T10:00:00Z' },
];
