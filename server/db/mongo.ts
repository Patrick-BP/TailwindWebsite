import mongoose from 'mongoose';
import { log } from '../vite';

// MongoDB connection
const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(connectionString);
    
    log('MongoDB connected successfully', 'mongodb');
    return mongoose.connection;
  } catch (error) {
    log(`MongoDB connection error: ${error}`, 'mongodb');
    process.exit(1);
  }
};

export default connectDB;