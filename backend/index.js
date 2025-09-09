import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import connectDB from "./db/db.js";
import subjectRoutes from "./routes/subjects.js";
import authRoutes from "./routes/authRoutes.js";
import Subject from "./models/subjects.js";
import path from "path";

config();

const app = express();
connectDB();

const _dirname = path.resolve();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/subjects", subjectRoutes);
app.use("/api/auth", authRoutes);

// Serve React frontend build
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Function to upload file to Cloudinary
const uploadFileToCloudinary = (buffer, mimetype, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          public_id: filename,
          format: "pdf",
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          folder: "Notemate",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
};

// File Upload Route (Cloudinary + MongoDB)
app.post("/api/subjects/:subjectId/files", upload.single("file"), async (req, res) => {
  const { subjectId } = req.params;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    if (!req.file.mimetype.includes("pdf")) {
      return res.status(400).json({ message: "Only PDF files are allowed." });
    }

    const uploadResult = await uploadFileToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname.split(".")[0]
    );

    const fileMetadata = {
      name: req.file.originalname,
      link: uploadResult.secure_url,
      fileId: uploadResult.public_id,
    };

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    subject.files.push(fileMetadata);
    await subject.save();

    res.status(201).json({
      message: "File uploaded successfully.",
      file: fileMetadata,
      subject,
    });
  } catch (error) {
    console.error("Error processing file upload:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fetch file and serve as a PDF
app.get("/api/files/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const subject = await Subject.findOne({ "files.fileId": fileId });

    if (!subject) {
      return res.status(404).json({ message: "File not found." });
    }

    const fileData = subject.files.find((f) => f.fileId === fileId);
    if (!fileData) {
      return res.status(404).json({ message: "File metadata not found." });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileData.name}"`);
    res.redirect(fileData.link);
  } catch (error) {
    console.error("Error fetching file:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Important: Do NOT use app.listen() on Vercel
export default app;
