const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const { isAdmin } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ✅ Upload document (admin)
router.post("/", isAdmin, upload.single("file"), async (req, res) => {
  console.log(req)
  try {
    // Ensure file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, semesterId, labId } = req.body;
    const fileType = req.file.mimetype.includes("pdf") ? "pdf" : "image";

    const doc = await Document.create({
      title,
      fileUrl: "/uploads/" + req.file.filename,
      fileType,
      semesterId,
      labId,
    });

    res.json(doc);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Something went wrong while uploading" });
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
