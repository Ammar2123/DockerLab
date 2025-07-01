const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }, // /uploads/...
  fileType: { type: String, enum: ['pdf', 'image'], required: true },
  semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  uploadedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Document', DocumentSchema);