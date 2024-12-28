import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeAdmin } from '../util/initAdmin.js';

dotenv.config();

const username = encodeURIComponent('sadanandjm');  // Use encodeURIComponent to encode special characters
const password = encodeURIComponent('Veda@718');  // Encode special characters in password
const MONGODB_URL =`mongodb+srv://${username}:${password}@cluster0.y3hoa.mongodb.net/fileManager`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await initializeAdmin();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
