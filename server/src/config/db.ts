import mongoose from 'mongoose';
import { ENV } from './env.js';

mongoose.set('bufferCommands', false);

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host} (${conn.connection.name})`);
    return true;
  } catch (err: any) {
    console.warn(`[Database Warning] Could not connect to MongoDB at ${ENV.MONGODB_URI}: ${err.message}`);
    console.warn(`[Database Notice] Please ensure MongoDB is running or provide a valid MONGODB_URI in server/.env (e.g. MongoDB Atlas cluster).`);
    return false;
  }
};

export const getDBStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};
