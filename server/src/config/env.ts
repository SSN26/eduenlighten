import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eduenlighten',
  JWT_SECRET: process.env.JWT_SECRET || 'eduenlighten_jwt_secret_key_development_min_32_chars_ok!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_NAME: process.env.COOKIE_NAME || 'eduenlighten_token',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'console',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '2525', 10),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '"EduEnlighten Academy" <noreply@eduenlighten.ac>',
  LIVE_CLASS_PROVIDER: process.env.LIVE_CLASS_PROVIDER || 'jitsi',
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || 'mock_paynow',
  PAYNOW_INTEGRATION_ID: process.env.PAYNOW_INTEGRATION_ID || 'demo_paynow_id',
  PAYNOW_INTEGRATION_KEY: process.env.PAYNOW_INTEGRATION_KEY || 'demo_paynow_key',
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'),
};
