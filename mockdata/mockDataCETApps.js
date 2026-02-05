/**
 * Mock Data for CET Applications
 * 
 * Tracks CET application configurations including ports, SQL servers, and databases
 */

const mockCETAppsData = [
  {
    id: 1,
    iGateApp: 'ESR',
    cetApp: '1097 (ESR Primary)',
    sqlServer: 'C101',
    database: 'DESR0013_SRT',
    description: 'Main reporting data for ESR',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:15:00').toISOString()
  },
  {
    id: 2,
    iGateApp: 'ESR',
    cetApp: '1047 (ESR Secondary)',
    sqlServer: 'C102',
    database: 'DESR0023',
    description: 'Supplemental reporting data for ESR',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:15:00').toISOString()
  },
  {
    id: 3,
    iGateApp: 'ESR',
    cetApp: '761 (GSS)',
    sqlServer: 'C101',
    database: 'DGSS0013',
    description: 'GSS data for ESR',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:15:00').toISOString()
  },
  {
    id: 4,
    iGateApp: 'Billing',
    cetApp: '2045 (Claims Primary)',
    sqlServer: 'C201',
    database: 'DBILL0015_CLM',
    description: 'Primary claims processing data',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:10:00').toISOString()
  },
  {
    id: 5,
    iGateApp: 'Billing',
    cetApp: '2046 (Claims Secondary)',
    sqlServer: 'C202',
    database: 'DBILL0016_CLM',
    description: 'Secondary claims processing data',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:10:00').toISOString()
  },
  {
    id: 6,
    iGateApp: 'Billing',
    cetApp: '3012 (Payment Gateway)',
    sqlServer: 'C203',
    database: 'DPAY0012',
    description: 'Payment processing and gateway',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:10:00').toISOString()
  },
  {
    id: 7,
    iGateApp: 'Lab',
    cetApp: '4501 (Lab Results)',
    sqlServer: 'C301',
    database: 'DLAB0021_RES',
    description: 'Laboratory results processing',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:12:00').toISOString()
  },
  {
    id: 8,
    iGateApp: 'Lab',
    cetApp: '4502 (Pathology)',
    sqlServer: 'C302',
    database: 'DPATH0022',
    description: 'Pathology data processing',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:12:00').toISOString()
  },
  {
    id: 9,
    iGateApp: 'Lab',
    cetApp: '4510 (Microbiology)',
    sqlServer: 'C301',
    database: 'DMICRO0023',
    description: 'Microbiology lab data',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:12:00').toISOString()
  },
  {
    id: 10,
    iGateApp: 'Pharmacy',
    cetApp: '5201 (RX Primary)',
    sqlServer: 'C401',
    database: 'DRX0031_MAIN',
    description: 'Primary pharmacy prescription processing',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:08:00').toISOString()
  },
  {
    id: 11,
    iGateApp: 'Pharmacy',
    cetApp: '5202 (RX Secondary)',
    sqlServer: 'C402',
    database: 'DRX0032_MAIN',
    description: 'Secondary pharmacy prescription processing',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:08:00').toISOString()
  },
  {
    id: 12,
    iGateApp: 'Pharmacy',
    cetApp: '5210 (Inventory)',
    sqlServer: 'C403',
    database: 'DINV0033',
    description: 'Pharmacy inventory management',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:08:00').toISOString()
  },
  {
    id: 13,
    iGateApp: 'Radiology',
    cetApp: '6101 (PACS)',
    sqlServer: 'C501',
    database: 'DPACS0041',
    description: 'Picture archiving and communication system',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:14:00').toISOString()
  },
  {
    id: 14,
    iGateApp: 'Radiology',
    cetApp: '6102 (RIS)',
    sqlServer: 'C502',
    database: 'DRIS0042',
    description: 'Radiology information system',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:14:00').toISOString()
  },
  {
    id: 15,
    iGateApp: 'Radiology',
    cetApp: '6110 (Image Archive)',
    sqlServer: 'C503',
    database: 'DARCH0043',
    description: 'Long-term image archival storage',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:14:00').toISOString()
  },
  {
    id: 16,
    iGateApp: 'Emergency',
    cetApp: '7001 (ED Tracker)',
    sqlServer: 'C601',
    database: 'DED0051_TRK',
    description: 'Emergency department patient tracking',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:16:00').toISOString()
  },
  {
    id: 17,
    iGateApp: 'Emergency',
    cetApp: '7002 (Triage)',
    sqlServer: 'C602',
    database: 'DTRIAGE0052',
    description: 'Emergency triage system',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:16:00').toISOString()
  },
  {
    id: 18,
    iGateApp: 'Scheduling',
    cetApp: '8001 (Appointments)',
    sqlServer: 'C701',
    database: 'DAPPT0061',
    description: 'Patient appointment scheduling',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:13:00').toISOString()
  },
  {
    id: 19,
    iGateApp: 'Scheduling',
    cetApp: '8002 (Resources)',
    sqlServer: 'C702',
    database: 'DRES0062',
    description: 'Resource and room scheduling',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:13:00').toISOString()
  },
  {
    id: 20,
    iGateApp: 'Medical Records',
    cetApp: '9001 (EMR Primary)',
    sqlServer: 'C801',
    database: 'DEMR0071_MAIN',
    description: 'Primary electronic medical records',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:11:00').toISOString()
  },
  {
    id: 21,
    iGateApp: 'Medical Records',
    cetApp: '9002 (EMR Archive)',
    sqlServer: 'C802',
    database: 'DEMR0072_ARCH',
    description: 'Archived medical records',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:11:00').toISOString()
  },
  {
    id: 22,
    iGateApp: 'Analytics',
    cetApp: '9501 (Data Warehouse)',
    sqlServer: 'C901',
    database: 'DDW0081_MAIN',
    description: 'Central data warehouse for analytics',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:09:00').toISOString()
  },
  {
    id: 23,
    iGateApp: 'Analytics',
    cetApp: '9502 (Reporting)',
    sqlServer: 'C902',
    database: 'DRPT0082',
    description: 'Business intelligence and reporting',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:09:00').toISOString()
  },
  {
    id: 24,
    iGateApp: 'Integration',
    cetApp: '9901 (HL7 Router)',
    sqlServer: 'C1001',
    database: 'DHL7_0091',
    description: 'HL7 message routing and processing',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:07:00').toISOString()
  },
  {
    id: 25,
    iGateApp: 'Integration',
    cetApp: '9902 (API Gateway)',
    sqlServer: 'C1002',
    database: 'DAPI0092',
    description: 'RESTful API gateway and management',
    supportLink: 'Link to Wiki page',
    status: 'active',
    environment: 'production',
    lastUpdated: new Date('2024-12-09T10:07:00').toISOString()
  }
];

/**
 * Get all CET Apps
 */
const getAllCETApps = () => {
  return mockCETAppsData;
};

/**
 * Get a single CET App by ID
 */
const getCETAppById = (id) => {
  return mockCETAppsData.find(app => app.id === parseInt(id));
};

/**
 * Create a new CET App
 */
const createCETApp = (appData) => {
  // Generate new ID
  const newId = Math.max(...mockCETAppsData.map(app => app.id), 0) + 1;
  
  const newApp = {
    id: newId,
    iGateApp: appData.iGateApp,
    cetApp: appData.cetApp,
    sqlServer: appData.sqlServer,
    database: appData.database,
    description: appData.description || '',
    supportLink: appData.supportLink || '',
    status: appData.status || 'active',
    environment: appData.environment || 'production',
    lastUpdated: new Date().toISOString()
  };
  
  mockCETAppsData.push(newApp);
  return newApp;
};

/**
 * Update an existing CET App
 */
const updateCETApp = (id, appData) => {
  const index = mockCETAppsData.findIndex(app => app.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  // Update fields
  mockCETAppsData[index] = {
    ...mockCETAppsData[index],
    iGateApp: appData.iGateApp,
    cetApp: appData.cetApp,
    sqlServer: appData.sqlServer,
    database: appData.database,
    description: appData.description || '',
    supportLink: appData.supportLink || '',
    status: appData.status || 'active',
    environment: appData.environment || 'production',
    lastUpdated: new Date().toISOString()
  };
  
  return mockCETAppsData[index];
};

/**
 * Delete a CET App
 */
const deleteCETApp = (id) => {
  const index = mockCETAppsData.findIndex(app => app.id === parseInt(id));
  
  if (index === -1) {
    return false;
  }
  
  mockCETAppsData.splice(index, 1);
  return true;
};

/**
 * File: mockDataCETApps.js
 * Created: 2025-12-09 15:26:03
 * Last Modified: 2025-12-20 17:26:58
 */

module.exports = {
  mockCETAppsData,
  getAllCETApps,
  getCETAppById,
  createCETApp,
  updateCETApp,
  deleteCETApp
};
