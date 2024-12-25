import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new Admin({
        username: 'admin',
        password: hashedPassword
      });
      
      await admin.save();
      console.log('Default admin account created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};
