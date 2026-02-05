/**
 * File: deployAllSprocs.js
 * Created: 2026-01-17
 * 
 * Script to deploy all stored procedures to the database
 * Run with: node deployAllSprocs.js
 */

const fs = require('fs');
const path = require('path');
const dbService = require('./services/dbService');

const deploySprocs = async () => {
  console.log('========================================');
  console.log('Deploying Stored Procedures');
  console.log('========================================\n');

  const sprocsDir = path.join(__dirname, 'database', 'sprocs');
  const files = fs.readdirSync(sprocsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const filePath = path.join(sprocsDir, file);
    const sprocName = file.replace('.sql', '').replace(/^\d+_/, '');
    
    try {
      console.log(`Creating ${sprocName}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await dbService.executeQuery(sql);
      
      // Grant permissions
      const grantSql = `GRANT EXECUTE ON dbo.${sprocName} TO nodejs_user;`;
      await dbService.executeQuery(grantSql);
      
      console.log(`  ✓ ${sprocName} created successfully`);
      successCount++;
    } catch (error) {
      console.log(`  ✗ ${sprocName} failed: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n========================================');
  console.log(`Summary: ${successCount} succeeded, ${failCount} failed`);
  console.log('========================================\n');

  // Test a few key procedures
  console.log('Testing stored procedures...\n');
  
  try {
    console.log('1. Testing usp_GetCETDashboard...');
    const dashResult = await dbService.executeQuery('EXEC dbo.usp_GetCETDashboard');
    console.log(`   ✓ Returned ${dashResult.data.length} records\n`);

    console.log('2. Testing usp_GetAllCETApps...');
    const appsResult = await dbService.executeQuery('EXEC dbo.usp_GetAllCETApps');
    console.log(`   ✓ Returned ${appsResult.data.length} records\n`);

    console.log('3. Testing usp_GetUniqueIGateApps...');
    const uniqueResult = await dbService.executeQuery('EXEC dbo.usp_GetUniqueIGateApps');
    console.log(`   ✓ Returned ${uniqueResult.data.length} unique iGateApps:`);
    uniqueResult.data.forEach(row => console.log(`      - ${row.iGateApp}`));
    console.log();

    console.log('4. Testing usp_GetCETAppById with ID=1...');
    const appByIdResult = await dbService.executeQuery('EXEC dbo.usp_GetCETAppById @AppId=1');
    console.log(`   ✓ Returned: ${appByIdResult.data[0]?.cetApp}\n`);

    console.log('✓ All tests passed!');
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  } finally {
    await dbService.closePool();
  }
};

deploySprocs();
