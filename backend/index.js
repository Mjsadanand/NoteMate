import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // For file system operations
import connectDB from './db/db.js';
import subjectRoutes from './routes/subjects.js';
import Subject from './models/subjects.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
connectDB();

// Ensure uploads directory exists
const UPLOADS_DIR = './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); 
  }, 
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(`Uploading file with MIME type: ${file.mimetype}`);
  const allowedTypes = /jpeg|jpg|png|pdf|vnd.ms-powerpoint|vnd.openxmlformats-officedocument.presentationml.presentation|pptx|doc|docx/;
  const isValid = allowedTypes.test(file.mimetype);
  if (isValid) {
    cb(null, true); 
  } else {
    cb(new Error('Invalid file type. Allowed types are JPEG, PNG, PPT, PDF, DOC, DOCX.'));
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 * 1024 }, // Limit file size to 5 MB
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/subjects', subjectRoutes);
app.use('/api/auth', authRoutes);

// File Upload Route
app.post('/api/subjects/:subjectId/files', upload.single('file'), async (req, res) => {
  const { subjectId } = req.params;

  try {
    console.log('Request received:', { subjectId, file: req.file, body: req.body });

    if (!req.file) {
      console.log('No file uploaded.');
      return res.status(400).json({ message: 'No file uploaded.' }); 
    }

    const { originalname, filename } = req.file;
    const fileLink = `http://localhost:5000/uploads/${filename}`;

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      console.log(`Subject not found for ID: ${subjectId}`);
      return res.status(404).json({ message: 'Subject not found.' });
    }

    const fileMetadata = { name: originalname, link: fileLink, fileId: filename };
    subject.files.push(fileMetadata);
    await subject.save();

    console.log('File uploaded successfully:', fileMetadata);
    res.status(201).json({
      message: 'File uploaded successfully.',
      file: fileMetadata,
      subject,
    });
  } catch (error) {
    console.error('Error processing file upload:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});



// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  if (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
  next();
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
