import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { config } from "dotenv";

export const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: process.env.ADMIN });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      
      const admin = new Admin({
        username: process.env.ADMIN,
        password: hashedPassword
      });
      
      await admin.save();
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};
