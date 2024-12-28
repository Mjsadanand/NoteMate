import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import multer from 'multer';
import Grid from 'gridfs-stream';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/db.js';
import subjectRoutes from './routes/subjects.js';
import Subject from './models/subjects.js';
import authRoutes from './routes/authRoutes.js';
import GridFsStorage from 'multer-gridfs-storage';


const app = express();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection for GridFS
const conn = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Multer-GridFS Storage Configuration
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    const allowedTypes = /jpeg|jpg|png|pdf|ppt|pptx|doc|docx/;
    const isValid = allowedTypes.test(file.mimetype);

    if (!isValid) {
      return new Error('Invalid file type. Allowed types are JPEG, PNG, PPT, PDF, DOC.');
    }

    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads', // Bucket name in GridFS
    };
  },
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/subjects', subjectRoutes);
app.use('/api/auth', authRoutes);

// Upload File Endpoint
app.post('/api/subjects/:subjectId/files', upload.single('file'), async (req, res) => {
  const { subjectId } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const { originalname, filename } = req.file;
  const fileLink = `${req.protocol}://${req.get('host')}/api/files/${filename}`;

  const subject = await Subject.findById(subjectId);
  if (!subject) {
    return res.status(404).json({ message: 'Subject not found.' });
  }

  const fileMetadata = { name: originalname, link: fileLink, fileId: filename };
  subject.files.push(fileMetadata);
  await subject.save();

  res.status(200).json(subject);
});

// Fetch File Endpoint
app.get('/api/files/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file.' });
  }
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
