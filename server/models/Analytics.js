const mongoose = require('mongoose');
const AnalyticsSchema = new mongoose.Schema({
  labId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab' },
  accessedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Analytics', AnalyticsSchema);