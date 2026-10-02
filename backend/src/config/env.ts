import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'ethiotransit_jwt_secret_production_2026_modern',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'ethiotransit_refresh_secret_production_2026',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || 'mock',
  PAYMENT_PROVIDER_KEY: process.env.PAYMENT_PROVIDER_KEY || '',
  PAYMENT_PROVIDER_SECRET: process.env.PAYMENT_PROVIDER_SECRET || '',
  PAYMENT_CALLBACK_URL: process.env.PAYMENT_CALLBACK_URL || 'http://localhost:5000/api/payments/verify',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
