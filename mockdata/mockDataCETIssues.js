/**
 * Mock Data for CET Issues View
 * 
 * Contains 5 datasets:
 * 1. Summary table (aggregated view)
 * 2. Alert Detail Modal data
 * 3. Disabled Queue Detail Modal data
 * 4. Behind Detail Modal data
 * 5. Slow Detail Modal data
 */

// 1. Summary Table - Aggregated view of apps
const cetIssuesSummary = [
  {
    id: 1,
    appId: '1097',
    iGateApp: 'ESR',
    cetApp: 'ESR Primary',
    alerts: 3,
    disabledQueues: 0,
    behind: 2,
    slow: 1,
    lastUpdated: new Date('2024-11-17T12:03:00').toISOString()
  },
  {
    id: 2,
    appId: '761',
    iGateApp: 'ESR',
    cetApp: 'GSS',
    alerts: 2,
    disabledQueues: 1,
    behind: 0,
    slow: 3,
    lastUpdated: new Date('2024-11-17T12:03:00').toISOString()
  },
  {
    id: 3,
    appId: '2045',
    iGateApp: 'Billing',
    cetApp: 'Claims Primary',
    alerts: 2,
    disabledQueues: 2,
    behind: 3,
    slow: 4,
    lastUpdated: new Date('2024-11-17T12:01:00').toISOString()
  },
  {
    id: 4,
    appId: '3012',
    iGateApp: 'Billing',
    cetApp: 'Payment Gateway',
    alerts: 0,
    disabledQueues: 0,
    behind: 1,
    slow: 0,
    lastUpdated: new Date('2024-11-17T12:02:00').toISOString()
  },
  {
    id: 5,
    appId: '4501',
    iGateApp: 'Lab',
    cetApp: 'Lab Results',
    alerts: 2,
    disabledQueues: 1,
    behind: 2,
    slow: 2,
    lastUpdated: new Date('2024-11-17T12:00:00').toISOString()
  },
  {
    id: 6,
    appId: '5201',
    iGateApp: 'Pharmacy',
    cetApp: 'RX Processing',
    alerts: 1,
    disabledQueues: 3,
    behind: 3,
    slow: 5,
    lastUpdated: new Date('2024-11-17T11:58:00').toISOString()
  }
];

// 2. Alert Detail Modal - Detailed alert records
const cetAlertDetails = [
  {
    id: 1,
    application: '1097',
    step: 1,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: '[SVRP00118E37\\EUDS008].[DGIO0012].[cet].[spEngine_Instruction_756_1_2]: Line: 1112, Violation of PRIMARY'
  },
  {
    id: 2,
    application: '1097',
    step: 1,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: '[SVRP00118E37\\EUDS008].[DGIO0012].[cet].[spEngine_Instruction_756_1_2]: Line: 583, Violation of PRIMARY'
  },
  {
    id: 3,
    application: '1097',
    step: 1,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: '[SVRP00118E37\\EUDS008].[DGIO0012].[cet].[spEngine_Instruction_756_1_2]: Line: 583, Violation of PRIMARY'
  },
  {
    id: 4,
    application: '2045',
    step: 2,
    subStep: 1,
    criticalSection: 3,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: '[SVRP00120E45\\CLMS001].[DBILL0015_CLM].[cet].[spBilling_ClaimProcess_102_2_1]: Line: 892, NULL value error'
  },
  {
    id: 5,
    application: '2045',
    step: 2,
    subStep: 3,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: '[SVRP00120E45\\CLMS001].[DBILL0015_CLM].[cet].[spBilling_Validate_102_2_3]: Timeout exceeded'
  },
  {
    id: 6,
    application: '4501',
    step: 3,
    subStep: 1,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:00',
    alert: '[SVRP00125E50\\LABS001].[DLAB0021_RES].[cet].[spLab_ResultProcess_301_3_1]: Deadlock detected'
  },
  {
    id: 7,
    application: '4501',
    step: 3,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:00',
    alert: '[SVRP00125E50\\LABS001].[DLAB0021_RES].[cet].[spLab_Validation_301_3_2]: Constraint violation'
  },
  {
    id: 8,
    application: '761',
    step: 1,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: '[SVRP00118E37\\EUDS008].[DGSS0013].[cet].[spGSS_Import_761_1_1]: Foreign key constraint failed'
  },
  {
    id: 9,
    application: '761',
    step: 1,
    subStep: 3,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: '[SVRP00118E37\\EUDS008].[DGSS0013].[cet].[spGSS_Transform_761_1_3]: Data type mismatch'
  },
  {
    id: 10,
    application: '5201',
    step: 4,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: '[SVRP00130E60\\PHRM001].[DRX0031_MAIN].[cet].[spRX_Process_401_4_1]: Duplicate prescription detected'
  }
];

// 3. Disabled Queue Detail Modal - Queue status records
const cetDisabledQueueDetails = [
  {
    id: 1,
    application: '1097',
    step: 1,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Queue [ESR_PRIMARY_INBOUND] disabled due to repeated failures. Last error: Connection timeout'
  },
  {
    id: 2,
    application: '2045',
    step: 2,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Queue [CLAIMS_PROCESSING_Q1] disabled. Error: Maximum retry attempts exceeded'
  },
  {
    id: 3,
    application: '2045',
    step: 3,
    subStep: 2,
    criticalSection: 3,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Queue [CLAIMS_VALIDATION_Q] disabled. Error: Database connection lost'
  },
  {
    id: 4,
    application: '4501',
    step: 1,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:00',
    alert: 'Queue [LAB_RESULTS_INCOMING] disabled. Error: Disk space critical'
  },
  {
    id: 5,
    application: '5201',
    step: 2,
    subStep: 3,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Queue [RX_PROCESS_PRIMARY] disabled. Error: Service unavailable'
  },
  {
    id: 6,
    application: '5201',
    step: 4,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Queue [RX_VALIDATION_Q] disabled. Error: Authentication failed'
  },
  {
    id: 7,
    application: '5201',
    step: 1,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Queue [RX_INVENTORY_SYNC] disabled. Error: Network unreachable'
  },
  {
    id: 8,
    application: '761',
    step: 2,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Queue [GSS_DATA_IMPORT] disabled. Error: Invalid message format'
  }
];

// 4. Behind Detail Modal - Processing delay records
const cetBehindDetails = [
  {
    id: 1,
    application: '1097',
    step: 1,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Process behind schedule: [spEngine_Instruction_756_1_2] - 2 minutes behind. Backlog: 145 records'
  },
  {
    id: 2,
    application: '1097',
    step: 1,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Process behind schedule: [spEngine_Validation_756_1_2] - 1.5 minutes behind. Backlog: 98 records'
  },
  {
    id: 3,
    application: '2045',
    step: 2,
    subStep: 1,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Process behind schedule: [spBilling_ClaimProcess_102_2_1] - 8 minutes behind. Backlog: 1247 records'
  },
  {
    id: 4,
    application: '2045',
    step: 2,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Process behind schedule: [spBilling_Adjudication_102_2_2] - 6 minutes behind. Backlog: 892 records'
  },
  {
    id: 5,
    application: '2045',
    step: 3,
    subStep: 1,
    criticalSection: 3,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Process behind schedule: [spBilling_Payment_102_3_1] - 5 minutes behind. Backlog: 654 records'
  },
  {
    id: 6,
    application: '4501',
    step: 3,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:00',
    alert: 'Process behind schedule: [spLab_ResultProcess_301_3_1] - 3 minutes behind. Backlog: 423 records'
  },
  {
    id: 7,
    application: '4501',
    step: 3,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:00',
    alert: 'Process behind schedule: [spLab_Integration_301_3_2] - 2 minutes behind. Backlog: 267 records'
  },
  {
    id: 8,
    application: '5201',
    step: 1,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Process behind schedule: [spRX_Intake_401_1_1] - 12 minutes behind. Backlog: 2145 records'
  },
  {
    id: 9,
    application: '5201',
    step: 2,
    subStep: 1,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Process behind schedule: [spRX_Verification_401_2_1] - 9 minutes behind. Backlog: 1678 records'
  },
  {
    id: 10,
    application: '5201',
    step: 3,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Process behind schedule: [spRX_Dispensing_401_3_2] - 7 minutes behind. Backlog: 1123 records'
  },
  {
    id: 11,
    application: '3012',
    step: 1,
    subStep: 3,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:02',
    alert: 'Process behind schedule: [spPayment_Gateway_203_1_3] - 1 minute behind. Backlog: 87 records'
  }
];

// 5. Slow Detail Modal - Performance issue records
const cetSlowDetails = [
  {
    id: 1,
    application: '1097',
    step: 1,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Slow execution: [spEngine_Instruction_756_1_2] - Average: 8.5s (Expected: 2s). Query optimization needed'
  },
  {
    id: 2,
    application: '761',
    step: 1,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Slow execution: [spGSS_DataTransform_761_1_2] - Average: 12.3s (Expected: 3s). Index missing on lookup table'
  },
  {
    id: 3,
    application: '761',
    step: 2,
    subStep: 1,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Slow execution: [spGSS_Validation_761_2_1] - Average: 9.7s (Expected: 2.5s). Large dataset scan detected'
  },
  {
    id: 4,
    application: '761',
    step: 3,
    subStep: 2,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:03',
    alert: 'Slow execution: [spGSS_Export_761_3_2] - Average: 15.2s (Expected: 4s). Network latency detected'
  },
  {
    id: 5,
    application: '2045',
    step: 2,
    subStep: 3,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Slow execution: [spBilling_Validate_102_2_3] - Average: 18.9s (Expected: 5s). Blocking detected'
  },
  {
    id: 6,
    application: '2045',
    step: 3,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Slow execution: [spBilling_Payment_102_3_1] - Average: 11.2s (Expected: 3s). External API timeout'
  },
  {
    id: 7,
    application: '2045',
    step: 4,
    subStep: 2,
    criticalSection: 3,
    criticalSectionDate: '11/17/2025',
    time: '12:01',
    alert: 'Slow execution: [spBilling_Reconcile_102_4_2] - Average: 22.5s (Expected: 6s). Memory pressure'
  },
  {
    id: 8,
    application: '4501',
    step: 1,
    subStep: 3,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '12:00',
    alert: 'Slow execution: [spLab_Import_301_1_3] - Average: 13.8s (Expected: 4s). Disk I/O bottleneck'
  },
  {
    id: 9,
    application: '4501',
    step: 2,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '12:00',
    alert: 'Slow execution: [spLab_Parse_301_2_1] - Average: 10.4s (Expected: 3s). CPU contention'
  },
  {
    id: 10,
    application: '5201',
    step: 1,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Slow execution: [spRX_Lookup_401_1_2] - Average: 16.7s (Expected: 4s). Statistics out of date'
  },
  {
    id: 11,
    application: '5201',
    step: 2,
    subStep: 3,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Slow execution: [spRX_Interaction_401_2_3] - Average: 14.3s (Expected: 3.5s). Complex join operation'
  },
  {
    id: 12,
    application: '5201',
    step: 3,
    subStep: 1,
    criticalSection: 3,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Slow execution: [spRX_Dispense_401_3_1] - Average: 19.8s (Expected: 5s). Lock escalation'
  },
  {
    id: 13,
    application: '5201',
    step: 4,
    subStep: 2,
    criticalSection: 2,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Slow execution: [spRX_Billing_401_4_2] - Average: 21.2s (Expected: 6s). Tempdb contention'
  },
  {
    id: 14,
    application: '5201',
    step: 5,
    subStep: 1,
    criticalSection: 1,
    criticalSectionDate: '11/17/2025',
    time: '11:58',
    alert: 'Slow execution: [spRX_Notification_401_5_1] - Average: 9.9s (Expected: 2.5s). SMTP server slow'
  }
];

/**
 * File: mockDataCETIssues.js
 * Created: 2025-12-09 15:45:13
 * Last Modified: 2025-12-12 18:25:02
 */

module.exports = {
  cetIssuesSummary,
  cetAlertDetails,
  cetDisabledQueueDetails,
  cetBehindDetails,
  cetSlowDetails
};
