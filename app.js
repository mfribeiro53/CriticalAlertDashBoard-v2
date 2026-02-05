/**
 * File: app.js
 * Created: 2025-11-20 20:32:59
 * Last Modified: 2025-12-22 21:15:23
 * 
 * CET Dashboard - Express Application
 * 
 * This file sets up the Express server with EJS templating for
 * CET (Central Engine Technology) application monitoring and health dashboards.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve node_modules for local package access
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Root Route - Redirect to CET Dashboard
 */
app.get('/', (req, res) => {
  res.redirect('/cet-dashboard');
});

// CET Routes - delegated to dedicated route files
app.use('/cet-dashboard', require('./routes/cetDashboardRoutes'));
app.use('/cet-apps', require('./routes/cetAppsRoutes'));
app.use('/cet-issues', require('./routes/cetIssuesRoutes'));
app.use('/cet-queues', require('./routes/cetQueuesRoutes'));
app.use('/cet-reports', require('./routes/cetReportsRoutes'));

// API Routes - delegated to routes/apiRoutes.js
app.use('/api', require('./routes/apiRoutes'));

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`CET Dashboard is running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/cet-dashboard to view CET application health monitoring`);
  console.log(`Visit http://localhost:${PORT}/cet-apps to view CET applications registry`);
  console.log(`Visit http://localhost:${PORT}/cet-apps/admin to manage CET applications`);
  console.log(`Visit http://localhost:${PORT}/cet-issues to view CET issues tracking`);
  console.log(`Visit http://localhost:${PORT}/cet-queues to view CET queue monitoring`);
  console.log(`Visit http://localhost:${PORT}/cet-reports to view CET segment execution reports`);
});
