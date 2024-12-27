import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // For file system operations
import { fileURLToPath } from 'url';
import connectDB from './db/db.js';
import subjectRoutes from './routes/subjects.js';
import Subject from './models/subjects.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Uploads directory created at ${UPLOADS_DIR}`);
} else {
  console.log(`Uploads directory exists at ${UPLOADS_DIR}`);
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
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
  limits: { fileSize: 300 * 1024 * 1024 }, // Limit file size to 300 MB
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/subjects', subjectRoutes);
app.use('/api/auth', authRoutes);

app.post('/api/subjects/:subjectId/files', upload.single('file'), async (req, res) => {
  const { subjectId } = req.params;

  if (!req.file) {
    console.log('No file uploaded.');
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { originalname, filename } = req.file;
  const fileLink = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

  const subject = await Subject.findById(subjectId);
  if (!subject) {
    console.log(`Subject not found for ID: ${subjectId}`);
    return res.status(404).json({ message: 'Subject not found.' });
  }

  const fileMetadata = { name: originalname, link: fileLink, fileId: filename };
  subject.files.push(fileMetadata);
  await subject.save();

  res.status(200).json(subject);
});

// Serve React app
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath));
app.get('*', (_, res) => {
  res.sendFile(path.resolve(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});