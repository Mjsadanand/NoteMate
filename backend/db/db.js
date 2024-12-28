import mongoose from 'mongoose';
import { initializeAdmin } from '../util/initAdmin.js';

const password = encodeURIComponent("Veda@718"); // Encodes special characters in the password
const MONGODB_URL = process.env.MONGO_URI || `mongodb+srv://sadanandjm:${password}@cluster0.y3hoa.mongodb.net/fileManager`;

// const MONGODB_URL = process.env.MONGO_URI || 'mongodb+srv://sadanandjm:Veda%40718@cluster0.y3hoa.mongodb.net/fileManager';

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
