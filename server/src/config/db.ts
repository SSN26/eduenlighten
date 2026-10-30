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
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected successfully to host: ${conn.connection.host} (${conn.connection.name})`);
    return true;
  } catch (err: any) {
    const safeUri = ENV.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
    console.warn(`[Database Warning] Could not connect to MongoDB at ${safeUri}: ${err.message}`);
    console.warn(`[Database Notice] Please ensure MongoDB is running or provide a valid MONGODB_URI (e.g. MongoDB Atlas cluster).`);
    console.warn(`[Database Notice] For MongoDB Atlas deployments on Render, ensure Network Access allows 0.0.0.0/0 (anywhere) since cloud hosting IPs are dynamic.`);
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
