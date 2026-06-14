const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'gawa-admin-jwt-secret-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000',
  bcryptSaltRounds: 10,
};

module.exports = config;
