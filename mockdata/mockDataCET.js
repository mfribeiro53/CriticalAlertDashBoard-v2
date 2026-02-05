/**
 * File: mockDataCET.js
 * Created: 2025-12-09 13:40:44
 * Last Modified: 2025-12-09 13:42:13
 * 
 * Mock Data for CET Dashboard
 * 
 * Tracks application health metrics across different apps and systems
 */

const mockCETData = [
  {
    id: 1,
    iGateApp: 'ESR',
    cetApp: 'ESR Primary',
    messages: 13,
    issues: 6,
    alerts: 3,
    disabledQueues: 0,
    processesBehind: 2,
    slow: 1,
    status: 'warning', // Based on having issues and alerts
    lastUpdated: new Date('2024-12-09T10:30:00').toISOString()
  },
  {
    id: 2,
    iGateApp: 'ESR',
    cetApp: 'GSS',
    messages: 12,
    issues: 6,
    alerts: 2,
    disabledQueues: 1,
    processesBehind: 0,
    slow: 3,
    status: 'critical', // Based on disabled queue and multiple slow processes
    lastUpdated: new Date('2024-12-09T10:30:00').toISOString()
  },
  {
    id: 3,
    iGateApp: 'ESR',
    cetApp: 'Medical Records',
    messages: 8,
    issues: 2,
    alerts: 1,
    disabledQueues: 0,
    processesBehind: 0,
    slow: 0,
    status: 'healthy',
    lastUpdated: new Date('2024-12-09T10:28:00').toISOString()
  },
  {
    id: 4,
    iGateApp: 'Billing',
    cetApp: 'Claims Processing',
    messages: 45,
    issues: 12,
    alerts: 5,
    disabledQueues: 2,
    processesBehind: 8,
    slow: 4,
    status: 'critical',
    lastUpdated: new Date('2024-12-09T10:25:00').toISOString()
  },
  {
    id: 5,
    iGateApp: 'Billing',
    cetApp: 'Payment Gateway',
    messages: 23,
    issues: 3,
    alerts: 1,
    disabledQueues: 0,
    processesBehind: 1,
    slow: 0,
    status: 'warning',
    lastUpdated: new Date('2024-12-09T10:29:00').toISOString()
  },
  {
    id: 6,
    iGateApp: 'Lab',
    cetApp: 'Lab Results',
    messages: 34,
    issues: 8,
    alerts: 4,
    disabledQueues: 1,
    processesBehind: 3,
    slow: 2,
    status: 'critical',
    lastUpdated: new Date('2024-12-09T10:27:00').toISOString()
  },
  {
    id: 7,
    iGateApp: 'Lab',
    cetApp: 'Pathology',
    messages: 15,
    issues: 4,
    alerts: 2,
    disabledQueues: 0,
    processesBehind: 1,
    slow: 1,
    status: 'warning',
    lastUpdated: new Date('2024-12-09T10:28:00').toISOString()
  },
  {
    id: 8,
    iGateApp: 'Pharmacy',
    cetApp: 'RX Processing',
    messages: 56,
    issues: 15,
    alerts: 6,
    disabledQueues: 3,
    processesBehind: 12,
    slow: 5,
    status: 'critical',
    lastUpdated: new Date('2024-12-09T10:26:00').toISOString()
  },
  {
    id: 9,
    iGateApp: 'Pharmacy',
    cetApp: 'Inventory',
    messages: 19,
    issues: 5,
    alerts: 2,
    disabledQueues: 0,
    processesBehind: 2,
    slow: 1,
    status: 'warning',
    lastUpdated: new Date('2024-12-09T10:29:00').toISOString()
  },
  {
    id: 10,
    iGateApp: 'Radiology',
    cetApp: 'PACS',
    messages: 28,
    issues: 1,
    alerts: 0,
    disabledQueues: 0,
    processesBehind: 0,
    slow: 0,
    status: 'healthy',
    lastUpdated: new Date('2024-12-09T10:30:00').toISOString()
  },
  {
    id: 11,
    iGateApp: 'Radiology',
    cetApp: 'Image Archive',
    messages: 22,
    issues: 2,
    alerts: 1,
    disabledQueues: 0,
    processesBehind: 1,
    slow: 0,
    status: 'warning',
    lastUpdated: new Date('2024-12-09T10:28:00').toISOString()
  },
  {
    id: 12,
    iGateApp: 'Emergency',
    cetApp: 'ED Tracker',
    messages: 67,
    issues: 3,
    alerts: 1,
    disabledQueues: 0,
    processesBehind: 0,
    slow: 1,
    status: 'healthy',
    lastUpdated: new Date('2024-12-09T10:30:00').toISOString()
  },
  {
    id: 13,
    iGateApp: 'Emergency',
    cetApp: 'Triage System',
    messages: 41,
    issues: 7,
    alerts: 3,
    disabledQueues: 1,
    processesBehind: 4,
    slow: 2,
    status: 'critical',
    lastUpdated: new Date('2024-12-09T10:27:00').toISOString()
  },
  {
    id: 14,
    iGateApp: 'Scheduling',
    cetApp: 'Appointments',
    messages: 38,
    issues: 4,
    alerts: 2,
    disabledQueues: 0,
    processesBehind: 1,
    slow: 1,
    status: 'warning',
    lastUpdated: new Date('2024-12-09T10:29:00').toISOString()
  },
  {
    id: 15,
    iGateApp: 'Scheduling',
    cetApp: 'Resource Manager',
    messages: 16,
    issues: 1,
    alerts: 0,
    disabledQueues: 0,
    processesBehind: 0,
    slow: 0,
    status: 'healthy',
    lastUpdated: new Date('2024-12-09T10:30:00').toISOString()
  }
];

module.exports = mockCETData;
