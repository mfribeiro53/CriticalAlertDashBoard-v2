/**
 * File: testDbConnection.js
 * Created: 2026-01-17
 * 
 * Test script for database connection
 * Run with: node testDbConnection.js
 */

const dbService = require('./services/dbService');

const runTest = async () => {
  console.log('========================================');
  console.log('Testing Database Connection');
  console.log('========================================\n');

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const testResult = await dbService.testConnection();
    
    if (testResult.success) {
      console.log('   ✓ Connection successful!');
      console.log('   Database:', testResult.data.DatabaseName);
      console.log('   User:', testResult.data.UserName);
      console.log('   SQL Server Version:', testResult.data.Version.split('\n')[0]);
    } else {
      console.log('   ✗ Connection failed:', testResult.message);
      console.log('   Error:', testResult.error);
      process.exit(1);
    }

    console.log('\n2. Testing table access...');
    const tableQuery = `
      SELECT 
        t.name AS TableName,
        (SELECT COUNT(*) FROM sys.columns WHERE object_id = t.object_id) AS ColumnCount,
        p.rows AS RecordCount
      FROM sys.tables t
      INNER JOIN sys.partitions p ON t.object_id = p.object_id
      WHERE t.name LIKE 'CET%' AND p.index_id IN (0,1)
      ORDER BY t.name
    `;
    
    const tablesResult = await dbService.executeQuery(tableQuery);
    
    if (tablesResult.success) {
      console.log('   ✓ Tables accessed successfully!');
      console.log('\n   Available CET Tables:');
      console.log('   ┌─────────────────────────────┬─────────┬─────────────┐');
      console.log('   │ Table Name                  │ Columns │ Records     │');
      console.log('   ├─────────────────────────────┼─────────┼─────────────┤');
      tablesResult.data.forEach(table => {
        console.log(`   │ ${table.TableName.padEnd(27)} │ ${String(table.ColumnCount).padStart(7)} │ ${String(table.RecordCount).padStart(11)} │`);
      });
      console.log('   └─────────────────────────────┴─────────┴─────────────┘');
    } else {
      console.log('   ✗ Table access failed:', tablesResult.error);
    }

    console.log('\n3. Testing data query (CETDashboard sample)...');
    const dataQuery = `
      SELECT TOP 3 
        iGateApp,
        cetApp,
        messages,
        alerts,
        status
      FROM CETDashboard
      ORDER BY messages DESC
    `;
    
    const dataResult = await dbService.executeQuery(dataQuery);
    
    if (dataResult.success) {
      console.log('   ✓ Data query successful!');
      console.log('\n   Sample Records:');
      dataResult.data.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.iGateApp} - ${row.cetApp}`);
        console.log(`      Messages: ${row.messages}, Alerts: ${row.alerts}, Status: ${row.status}`);
      });
    } else {
      console.log('   ✗ Data query failed:', dataResult.error);
    }

    console.log('\n========================================');
    console.log('✓ All tests completed successfully!');
    console.log('========================================');

  } catch (error) {
    console.error('\n✗ Test failed with error:', error.message);
    process.exit(1);
  } finally {
    // Close the connection
    await dbService.closePool();
  }
};

// Run the test
runTest();
