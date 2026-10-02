import mongoose from 'mongoose';
import { ENV } from './env';

export async function connectDatabase(): Promise<string> {
  let uri = ENV.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`Connecting to MongoDB at configured URI...`);
      await mongoose.connect(uri);
      console.log(`[Database] Successfully connected to MongoDB Atlas / Remote database.`);
      return uri;
    } catch (err) {
      console.warn(`[Database] Failed to connect to configured URI (${err}). Falling back to in-memory MongoDB...`);
    }
  }

  // Fallback to MongoMemoryServer for immediate local development / test without external requirements
  console.log(`[Database] Initializing in-memory MongoDB server for development...`);
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 120000,
      },
    });
    uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`[Database] Successfully connected to in-memory MongoDB at: ${uri}`);
    return uri;
  } catch (memoryErr) {
    console.error(`[Database] Critical error initializing in-memory database:`, memoryErr);
    throw memoryErr;
  }
}
