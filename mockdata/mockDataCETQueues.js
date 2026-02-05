/**
 * Mock Data for CET Queues View
 * 
 * Contains 2 datasets:
 * 1. Queue Summary - Aggregated message counts per queue
 * 2. Message Details - Detailed message records with timestamps
 */

// 1. Queue Summary - Top table showing queue status and message counts
const cetQueuesSummary = [
  {
    id: 1,
    app: '1097',
    appName: 'ESR Primary',
    queue: 'CET/Instruction/1097/0/0/Queue',
    status: 'Enabled',
    messages: 0
  },
  {
    id: 2,
    app: '1097',
    appName: 'ESR Primary',
    queue: 'CET/Instruction/1097/1/0/Queue',
    status: 'Enabled',
    messages: 1
  },
  {
    id: 3,
    app: '1097',
    appName: 'ESR Primary',
    queue: 'CET/Instruction/1097/2/0/Queue',
    status: 'Enabled',
    messages: 20
  },
  {
    id: 4,
    app: '1097',
    appName: 'ESR Primary',
    queue: 'CET/Instruction/1097/3/0/Queue',
    status: 'Disabled',
    messages: 2
  },
  {
    id: 5,
    app: '1097',
    appName: 'ESR Primary',
    queue: 'CET/Instruction/1097/4/0/Queue',
    status: 'Enabled',
    messages: 1
  },
  {
    id: 6,
    app: '1097',
    appName: 'ESR Primary',
    queue: 'CET/Instruction/1097/5/0/Queue',
    status: 'Enabled',
    messages: 1
  },
  {
    id: 7,
    app: '761',
    appName: 'GSS',
    queue: 'CET/GSS/761/0/0/Queue',
    status: 'Enabled',
    messages: 3
  },
  {
    id: 8,
    app: '761',
    appName: 'GSS',
    queue: 'CET/GSS/761/1/0/Queue',
    status: 'Disabled',
    messages: 5
  },
  {
    id: 9,
    app: '761',
    appName: 'GSS',
    queue: 'CET/GSS/761/2/0/Queue',
    status: 'Enabled',
    messages: 0
  },
  {
    id: 10,
    app: '2045',
    appName: 'Claims Primary',
    queue: 'CET/Billing/2045/0/0/Queue',
    status: 'Enabled',
    messages: 45
  },
  {
    id: 11,
    app: '2045',
    appName: 'Claims Primary',
    queue: 'CET/Billing/2045/1/0/Queue',
    status: 'Enabled',
    messages: 12
  },
  {
    id: 12,
    app: '2045',
    appName: 'Claims Primary',
    queue: 'CET/Billing/2045/2/0/Queue',
    status: 'Disabled',
    messages: 8
  },
  {
    id: 13,
    app: '2045',
    appName: 'Claims Primary',
    queue: 'CET/Billing/2045/3/0/Queue',
    status: 'Disabled',
    messages: 15
  },
  {
    id: 14,
    app: '3012',
    appName: 'Payment Gateway',
    queue: 'CET/Payment/3012/0/0/Queue',
    status: 'Enabled',
    messages: 2
  },
  {
    id: 15,
    app: '3012',
    appName: 'Payment Gateway',
    queue: 'CET/Payment/3012/1/0/Queue',
    status: 'Enabled',
    messages: 0
  },
  {
    id: 16,
    app: '4501',
    appName: 'Lab Results',
    queue: 'CET/Lab/4501/0/0/Queue',
    status: 'Enabled',
    messages: 18
  },
  {
    id: 17,
    app: '4501',
    appName: 'Lab Results',
    queue: 'CET/Lab/4501/1/0/Queue',
    status: 'Enabled',
    messages: 7
  },
  {
    id: 18,
    app: '4501',
    appName: 'Lab Results',
    queue: 'CET/Lab/4501/2/0/Queue',
    status: 'Disabled',
    messages: 3
  },
  {
    id: 19,
    app: '5201',
    appName: 'RX Processing',
    queue: 'CET/Pharmacy/5201/0/0/Queue',
    status: 'Enabled',
    messages: 67
  },
  {
    id: 20,
    app: '5201',
    appName: 'RX Processing',
    queue: 'CET/Pharmacy/5201/1/0/Queue',
    status: 'Disabled',
    messages: 34
  },
  {
    id: 21,
    app: '5201',
    appName: 'RX Processing',
    queue: 'CET/Pharmacy/5201/2/0/Queue',
    status: 'Disabled',
    messages: 28
  },
  {
    id: 22,
    app: '5201',
    appName: 'RX Processing',
    queue: 'CET/Pharmacy/5201/3/0/Queue',
    status: 'Disabled',
    messages: 19
  }
];

// 2. Message Details - Bottom table showing individual message records
// Helper function to generate messages with incrementing IDs
const generateMessages = (startId, queueId, queue, count, baseHour, baseMinute) => {
  const messages = [];
  for (let i = 0; i < count; i++) {
    const minute = baseMinute + Math.floor(i * 1.5);
    const hour = baseHour + Math.floor(minute / 60);
    const adjustedMinute = minute % 60;
    const second = (i * 17) % 60;
    messages.push({
      id: startId + i,
      queueId: queueId,
      queue: queue,
      messageEnqueueTime: `12/2/2025 ${hour.toString().padStart(2, '0')}:${adjustedMinute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`,
      criticalSection: (i % 6) + 1
    });
  }
  return messages;
}

let messageId = 1;
const cetMessageDetails = [
  // Queue 1: CET/Instruction/1097/0/0/Queue - 0 messages (no entries)
  
  // Queue 2: CET/Instruction/1097/1/0/Queue - 1 message
  ...generateMessages(messageId, 2, 'CET/Instruction/1097/1/0/Queue', 1, 12, 24),
  
  // Queue 3: CET/Instruction/1097/2/0/Queue - 20 messages
  ...generateMessages(messageId + 1, 3, 'CET/Instruction/1097/2/0/Queue', 20, 12, 26),
  
  // Queue 4: CET/Instruction/1097/3/0/Queue - 2 messages
  ...generateMessages(messageId + 21, 4, 'CET/Instruction/1097/3/0/Queue', 2, 12, 25),
  
  // Queue 5: CET/Instruction/1097/4/0/Queue - 1 message
  ...generateMessages(messageId + 23, 5, 'CET/Instruction/1097/4/0/Queue', 1, 12, 30),
  
  // Queue 6: CET/Instruction/1097/5/0/Queue - 1 message
  ...generateMessages(messageId + 24, 6, 'CET/Instruction/1097/5/0/Queue', 1, 12, 30),
  
  // Queue 7: CET/GSS/761/0/0/Queue - 3 messages
  ...generateMessages(messageId + 25, 7, 'CET/GSS/761/0/0/Queue', 3, 12, 22),
  
  // Queue 8: CET/GSS/761/1/0/Queue - 5 messages
  ...generateMessages(messageId + 28, 8, 'CET/GSS/761/1/0/Queue', 5, 12, 20),
  
  // Queue 9: CET/GSS/761/2/0/Queue - 0 messages (no entries)
  
  // Queue 10: CET/Billing/2045/0/0/Queue - 45 messages
  ...generateMessages(messageId + 33, 10, 'CET/Billing/2045/0/0/Queue', 45, 11, 45),
  
  // Queue 11: CET/Billing/2045/1/0/Queue - 12 messages
  ...generateMessages(messageId + 78, 11, 'CET/Billing/2045/1/0/Queue', 12, 11, 50),
  
  // Queue 12: CET/Billing/2045/2/0/Queue - 8 messages
  ...generateMessages(messageId + 90, 12, 'CET/Billing/2045/2/0/Queue', 8, 11, 52),
  
  // Queue 13: CET/Billing/2045/3/0/Queue - 15 messages
  ...generateMessages(messageId + 98, 13, 'CET/Billing/2045/3/0/Queue', 15, 11, 55),
  
  // Queue 14: CET/Payment/3012/0/0/Queue - 2 messages
  ...generateMessages(messageId + 113, 14, 'CET/Payment/3012/0/0/Queue', 2, 11, 30),
  
  // Queue 15: CET/Payment/3012/1/0/Queue - 0 messages (no entries)
  
  // Queue 16: CET/Lab/4501/0/0/Queue - 18 messages
  ...generateMessages(messageId + 115, 16, 'CET/Lab/4501/0/0/Queue', 18, 10, 45),
  
  // Queue 17: CET/Lab/4501/1/0/Queue - 7 messages
  ...generateMessages(messageId + 133, 17, 'CET/Lab/4501/1/0/Queue', 7, 10, 52),
  
  // Queue 18: CET/Lab/4501/2/0/Queue - 3 messages
  ...generateMessages(messageId + 140, 18, 'CET/Lab/4501/2/0/Queue', 3, 10, 58),
  
  // Queue 19: CET/Pharmacy/5201/0/0/Queue - 67 messages
  ...generateMessages(messageId + 143, 19, 'CET/Pharmacy/5201/0/0/Queue', 67, 10, 15),
  
  // Queue 20: CET/Pharmacy/5201/1/0/Queue - 34 messages
  ...generateMessages(messageId + 210, 20, 'CET/Pharmacy/5201/1/0/Queue', 34, 10, 25),
  
  // Queue 21: CET/Pharmacy/5201/2/0/Queue - 28 messages
  ...generateMessages(messageId + 244, 21, 'CET/Pharmacy/5201/2/0/Queue', 28, 10, 35),
  
  // Queue 22: CET/Pharmacy/5201/3/0/Queue - 19 messages
  ...generateMessages(messageId + 272, 22, 'CET/Pharmacy/5201/3/0/Queue', 19, 10, 42)
];

/**
 * File: mockDataCETQueues.js
 * Created: 2025-12-09 16:20:02
 * Last Modified: 2025-12-09 16:34:21
 */

module.exports = {
  cetQueuesSummary,
  cetMessageDetails
};
