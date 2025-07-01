const mongoose = require('mongoose');

const LabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // semesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  semester: {type: String, required: true},
  description: { type: String },
  dockerImage: { type: String }, // Optional: thumbnail/logo
  commands: {
    ubuntu: {
      pull: [{ type: String }], // AES encrypted
      run: [{ type: String }]
    },
    windows: {
      pull: [{ type: String }],
      run: [{ type: String }]
    }
  },
  analytics: {
    accessed: { type: Number, default: 0 }
  }
});
module.exports = mongoose.model('Lab', LabSchema);