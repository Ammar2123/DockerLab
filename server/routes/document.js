const express = require("express");
const router = express.Router();
const multer = require("multer");
const Document = require("../models/Document");
const { isAdmin } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');

// Update this storage configuration to ensure proper directory exists
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Updated document upload route to match Document schema
router.post("/", isAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract fields that match the Document schema
    const { title, semesterId, labId, fileType } = req.body;
    
    // Only validate title as required
    if (!title) {
      // Delete the file if metadata is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Document title is required" });
    }

    // Only validate labId format if it's provided
    if (labId && !mongoose.Types.ObjectId.isValid(labId)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid labId format" });
    }

    // Generate fileUrl from the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Determine fileType if not provided
    let documentFileType = fileType;
    if (!documentFileType) {
      const extension = path.extname(req.file.originalname).toLowerCase();
      documentFileType = ['.jpg', '.jpeg', '.png', '.gif'].includes(extension) ? 'image' : 'pdf';
    }

    // Create document object with only the required fields
    const documentData = {
      title,
      fileUrl,
      fileType: documentFileType,
    };

    // Only add optional fields if they're provided
    if (labId) {
      documentData.labId = labId;
    }
    
    if (semesterId) {
      // Handle hardcoded semesters
      documentData.semesterId = semesterId.startsWith("Sem ") ? 
        (labId || semesterId) : semesterId;
    }

    // Create the document with correct schema fields
    const document = new Document(documentData);

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error("Document upload error:", error);
    // Clean up file if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ List documents (optionally filtered)
router.get("/", async (req, res) => {
  try {
    const { semesterId, labId } = req.query;
    const query = {};
    if (semesterId) query.semesterId = semesterId;
    if (labId) query.labId = labId;

    const docs = await Document.find(query).sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// ✅ Delete document (admin)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (doc && doc.fileUrl) {
      const filePath = path.join(
        __dirname,
        "..",
        doc.fileUrl.replace(/^\/+/, "")
      );

      fs.unlink(filePath, (err) => {
        if (err) console.warn("Failed to delete file:", err.message);
      });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

module.exports = router;
