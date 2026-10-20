import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { getDBStatus } from './config/db.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRouter from './modules/auth/auth.routes.js';
import teacherApplicationsRouter from './modules/teacher-applications/teacher-applications.routes.js';
import programmesRouter from './modules/programmes/programmes.routes.js';
import coursesRouter from './modules/courses/courses.routes.js';
import enrolmentsRouter from './modules/enrolments/enrolments.routes.js';
import liveClassesRouter from './modules/live-classes/live-classes.routes.js';
import assessmentsRouter from './modules/assessments/assessments.routes.js';
import certificatesRouter from './modules/certificates/certificates.routes.js';
import paymentsRouter from './modules/payments/payments.routes.js';
import analyticsRouter from './modules/analytics/analytics.routes.js';
import supportRouter from './modules/support/support.routes.js';
import institutionsRouter from './modules/institutions/institutions.routes.js';
import teachersRouter from './modules/teachers/teachers.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows cross-origin API testing & Next.js preview
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Parsing & Logging
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Global Auth Extractor (populates req.user if cookie/header present)
  app.use(authenticate);

  // Healthcheck endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    const db = getDBStatus();
    res.status(200).json({
      status: 'ok',
      platform: 'EduEnlighten Digital School REST API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: db,
      features: {
        cambridgeAcademy: true,
        zimsecAcademy: true,
        digitalSkillsAcademy: true,
        highSchoolMultiTenancy: true,
        vocationalInstitutionsMultiTenancy: true,
        independentTeachersMarketplace: true,
        teacherRecruitment: true,
        liveClasses: true,
        certificates: true,
        payments: true,
      },
    });
  });

  // Mount API modules
  app.use('/api/auth', authRouter);
  app.use('/api/institutions', institutionsRouter);
  app.use('/api/teachers', teachersRouter);
  app.use('/api/teacher-applications', teacherApplicationsRouter);
  app.use('/api/programmes', programmesRouter);
  app.use('/api/courses', coursesRouter);
  app.use('/api/enrolments', enrolmentsRouter);
  app.use('/api/live-classes', liveClassesRouter);
  app.use('/api/assessments', assessmentsRouter);
  app.use('/api/certificates', certificatesRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/support', supportRouter);

  // 404 handler for API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
};
