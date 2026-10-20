import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  const app = createApp();

  // Connect to Database
  await connectDB();

  const server = app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`🎓 EduEnlighten Digital School Backend running!`);
    console.log(`🌐 Port: ${ENV.PORT}`);
    console.log(`🔗 API Base: http://localhost:${ENV.PORT}/api`);
    console.log(`🩺 Health: http://localhost:${ENV.PORT}/api/health`);
    console.log(`💻 Client URL: ${ENV.CLIENT_URL}`);
    console.log(`⚡ Environment: ${ENV.NODE_ENV}`);
    console.log(`====================================================`);
  });

  const shutdown = () => {
    console.log('\n[Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[Server] Closed remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('[Server Fatal] Failed to launch backend:', err);
  process.exit(1);
});
