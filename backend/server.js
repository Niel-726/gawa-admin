const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const { auditMiddleware } = require('./middleware/auditLogger');

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigins.split(','), credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Audit logging middleware for non-GET requests
app.use(auditMiddleware);

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack || err.message);
  res.status(500).json({ error: 'Internal server error', message: config.nodeEnv === 'development' ? err.message : 'Something went wrong' });
});

// Start server
app.listen(config.port, () => {
  console.log(`\n  GAWA Admin API Server`);
  console.log(`  ${'='.repeat(30)}`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`  Port:        ${config.port}`);
  console.log(`  API Base:    http://localhost:${config.port}/api`);
  console.log(`  ${'='.repeat(30)}\n`);
});

module.exports = app;
