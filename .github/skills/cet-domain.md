# CET Domain Knowledge

## Overview

**CET (Central Engine Technology)** is a monitoring and alerting system for enterprise applications. This dashboard tracks health metrics, alerts, queues, and issues across CET-managed applications.

---

## Domain Concepts

### Applications (iGate Apps)

**What:** Individual enterprise applications monitored by CET
**Example:** SAP, Oracle, Salesforce integrations

**Key Attributes:**
- `iGateApp` - Application identifier (primary key for filtering)
- `environment` - Dev, Test, Prod
- `owner` - Team or person responsible
- `status` - Enabled/Disabled

---

### Alert Types

#### 1. Threshold Alerts
**Definition:** Alerts triggered when metrics exceed predefined thresholds
**Severity Levels:**
- **0 issues** → Green (bg-success) - All systems normal
- **1-4 issues** → Blue (bg-info) - Low severity, monitoring
- **5-8 issues** → Yellow (bg-warning) - Medium severity, attention needed
- **9+ issues** → Red (bg-danger) - High severity, immediate action required

**Common Thresholds:**
- Response time > 5 seconds
- Error rate > 5%
- Memory usage > 80%

**Render Function:** `renderCETThresholdAlerts()` or `renderClickableCETThresholdAlerts()`

---

#### 2. General Alerts
**Definition:** System-generated alerts for anomalies
**Severity Levels:**
- **0 alerts** → Green (bg-success)
- **1-2 alerts** → Blue (bg-info)
- **3-4 alerts** → Yellow (bg-warning)
- **5+ alerts** → Red (bg-danger)

**Render Function:** `renderCETAlerts()`

---

### Queues

**What:** Message queues for asynchronous processing in CET applications

**Queue Status:**
- **Enabled** → Green badge with check icon - Actively processing messages
- **Disabled** → Red badge with X icon - Not processing (critical issue)

**Key Metrics:**
- **Message Count** - Number of messages waiting in queue
- **Processing Rate** - Messages per minute
- **Oldest Message Age** - Time since oldest unprocessed message

**Message Count Severity:**
- **0 messages** → Green (bg-success)
- **1-9 messages** → Blue (bg-info)
- **10-29 messages** → Yellow (bg-warning)
- **30+ messages** → Red (bg-danger)

**Disabled Queue:** Any disabled queue is critical (red badge), regardless of message count

**Render Functions:**
- `renderQueueStatus()` - Shows enabled/disabled status
- `renderMessageCount()` - Shows message count with color coding
- `renderCETDisabledQueues()` - Count of disabled queues (binary: 0=green, 1+=red)

---

### Processes

#### Process Status Types

**1. Processes Behind**
**Definition:** Scheduled processes that haven't completed on time

**Severity Levels:**
- **0 behind** → Green (bg-success)
- **1-2 behind** → Blue (bg-info)
- **3-5 behind** → Yellow (bg-warning)
- **6+ behind** → Red (bg-danger)

**Common Causes:**
- High system load
- Resource contention
- Deadlocks

**Render Function:** `renderCETProcessesBehind()`

---

**2. Slow Processes**
**Definition:** Processes running slower than expected thresholds

**Severity Levels:**
- **0 slow** → Green (bg-success)
- **1 slow** → Blue (bg-info)
- **2-3 slow** → Yellow (bg-warning)
- **4+ slow** → Red (bg-danger)

**Performance Benchmarks:**
- Normal: < 2x expected duration
- Slow: 2-5x expected duration
- Critical: > 5x expected duration

**Render Function:** `renderCETSlow()`

---

### Issues

**What:** Tracked problems requiring investigation or resolution

**Issue Count Severity:**
- **0 issues** → Green (bg-success)
- **1-2 issues** → Blue (bg-info)
- **3-4 issues** → Yellow (bg-warning)
- **5+ issues** → Red (bg-danger)

**Issue Types:**
- Configuration errors
- Integration failures
- Performance degradation
- Data validation problems

**Render Function:** `renderCETIssueCount()`

---

### Reports

**What:** Scheduled and on-demand reports for CET metrics

**Report Types:**
- Daily summary reports
- Alert history reports
- Performance trend reports
- SLA compliance reports

---

## Color Coding Standards

### Standard Severity Scale

```javascript
// Green (bg-success) - No issues, healthy
if (count === 0) return 'bg-success';

// Blue (bg-info) - Low severity, informational
if (count <= lowThreshold) return 'bg-info';

// Yellow (bg-warning) - Medium severity, attention needed
if (count <= mediumThreshold) return 'bg-warning';

// Red (bg-danger) - High severity, critical
return 'bg-danger';
```

### Threshold Reference Table

| Metric Type           | Green | Blue | Yellow | Red |
|-----------------------|-------|------|--------|-----|
| Threshold Alerts      | 0     | 1-4  | 5-8    | 9+  |
| General Alerts        | 0     | 1-2  | 3-4    | 5+  |
| Disabled Queues       | 0     | -    | -      | 1+  |
| Processes Behind      | 0     | 1-2  | 3-5    | 6+  |
| Slow Processes        | 0     | 1    | 2-3    | 4+  |
| Issue Count           | 0     | 1-2  | 3-4    | 5+  |
| Message Count         | 0     | 1-9  | 10-29  | 30+ |

### Special Cases

**Binary Critical Metrics:**
Some metrics are binary (OK or Critical):
- **Disabled Queues:** 0 = green, 1+ = red
- **Queue Status:** Enabled = green, Disabled = red

**Percentage-Based Thresholds:**
- **< 70%** → Green
- **70-85%** → Yellow
- **> 85%** → Red

---

## Clickable Badges & Navigation

### URL Templates

**Pattern:** `{placeholder}` syntax for dynamic URL generation

**Example:**
```yaml
columns:
  - data: thresholdAlerts
    title: Threshold Alerts
    render: renderClickableCETThresholdAlerts
    urlTemplate: /cet-issues?app={iGateApp}
```

**How It Works:**
1. Template: `/cet-issues?app={iGateApp}`
2. Row data: `{ iGateApp: 'SAP_PROD' }`
3. Result: `/cet-issues?app=SAP_PROD`

**Nested Property Support:**
```yaml
urlTemplate: /details?id={source.applicationId}
# Accesses: row.source.applicationId
```

**Clickability Rules:**
- ✅ Clickable if: `data > 0` AND `urlTemplate` provided
- ❌ Non-clickable if: `data === 0` OR no `urlTemplate`
- ❌ Non-clickable if: placeholder cannot be resolved

**Render Function:** `renderClickableCETThresholdAlerts(data, type, row, urlTemplate)`

---

## Data Model

### Dashboard View (CET Apps Summary)

```javascript
{
  iGateApp: "SAP_PROD",              // Application identifier
  environment: "Production",          // Environment name
  thresholdAlerts: 5,                 // Threshold alert count
  alerts: 2,                          // General alert count
  disabledQueues: 0,                  // Disabled queue count
  processesBehind: 3,                 // Behind schedule count
  slow: 1,                            // Slow process count
  supportLink: "https://wiki..."      // Documentation URL
}
```

### Issues View

```javascript
{
  iGateApp: "SAP_PROD",
  issueType: "Configuration Error",
  severity: "High",
  description: "Connection timeout...",
  timestamp: "2026-01-10T14:30:00Z",
  status: "Open",                     // Open, In Progress, Resolved
  assignedTo: "DevOps Team"
}
```

### Queues View

```javascript
{
  iGateApp: "SAP_PROD",
  queueName: "OrderProcessing",
  status: "Enabled",                  // Enabled/Disabled
  messageCount: 12,                   // Messages in queue
  processingRate: 45,                 // Messages/minute
  oldestMessageAge: "5 minutes"
}
```

### Reports View

```javascript
{
  reportName: "Daily Summary",
  iGateApp: "SAP_PROD",
  reportType: "Scheduled",
  frequency: "Daily",
  lastRun: "2026-01-11T02:00:00Z",
  status: "Success",
  downloadUrl: "/reports/daily-summary.pdf"
}
```

---

## Business Rules

### Alert Escalation

**Level 1 (Blue):** Monitor, no action required
**Level 2 (Yellow):** Notify on-call team, investigate within 2 hours
**Level 3 (Red):** Immediate notification, investigate within 15 minutes

### Queue Management

**Disabled Queue SOP:**
1. Immediately flag as critical (red badge)
2. Alert operations team
3. Check for manual disable (maintenance) vs. failure
4. Re-enable after issue resolution

**High Message Count SOP:**
1. 30+ messages → Investigate processing rate
2. Check for downstream bottlenecks
3. Scale processing capacity if needed
4. Monitor for message age > 1 hour

### Process Performance

**Behind Schedule:**
- 1-2 processes → Normal variance, monitor
- 3-5 processes → Check resource utilization
- 6+ processes → Incident response required

**Slow Processes:**
- 1 slow → Document for trending
- 2-3 slow → Performance review
- 4+ slow → System performance issue

---

## Common Operations

### Filtering by Application

All views support filtering by `iGateApp`:
```
/cet-dashboard?app=SAP_PROD
/cet-issues?app=SAP_PROD
/cet-queues?app=SAP_PROD
```

### Drill-Down Navigation

**Dashboard → Issues:**
Click threshold alerts badge → Filter issues view by application

**Dashboard → Queues:**
Click disabled queues badge → Filter queues view by application

**Issues → Details:**
Click issue description → Open issue detail modal

---

## Integration Points

### Future API Endpoints

Currently using mock data. Ready for integration with:

```
GET /api/cet/applications          # List all CET apps
GET /api/cet/applications/:id      # App details
GET /api/cet/alerts                # All alerts
GET /api/cet/alerts/:id            # Alert details
GET /api/cet/queues                # All queues
GET /api/cet/queues/:id            # Queue details
GET /api/cet/issues                # All issues
GET /api/cet/issues/:id            # Issue details
GET /api/cet/reports               # Available reports
```

### Mock Data Location

- `mockdata/mockDataCET.js` - Dashboard data
- `mockdata/mockDataCETApps.js` - Application details
- `mockdata/mockDataCETIssues.js` - Issues list
- `mockdata/mockDataCETQueues.js` - Queues list
- `mockdata/mockDataCETReports.js` - Reports list

---

## Glossary

**CET** - Central Engine Technology (monitoring platform)
**iGate App** - Application managed by CET system
**Threshold Alert** - Alert triggered when metric exceeds threshold
**Disabled Queue** - Queue that has stopped processing messages
**Process Behind** - Scheduled process that didn't complete on time
**Slow Process** - Process running slower than expected
**Badge** - Color-coded indicator showing metric severity
**Clickable Badge** - Badge that links to filtered detail view

---

## Support Resources

**Documentation:** Update `renderSupportLink()` in production:
```javascript
// Current: placeholder link
const linkUrl = '#';

// Production: actual Wiki URL
const linkUrl = row.wikiUrl || `https://wiki.company.com/cet/${row.iGateApp}`;
```

**Icons:** Uses Bootstrap Icons
- `bi-check-circle-fill` - Enabled status
- `bi-x-circle-fill` - Disabled status
- `bi-exclamation-triangle` - Warning
- `bi-box-arrow-up-right` - External link

---

## References

See also:
- [CET Render Helpers](../../public/js/helpers/cet-render-helpers.js) - Implementation
- [Architecture Guide](./architecture.md) - System architecture
- [CET Views Documentation](../../docs/CET_VIEWS.md) - View specifications
