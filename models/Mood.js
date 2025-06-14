const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moodLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  emotions: [{
    type: String,
    enum: ['mutlu', 'üzgün', 'kaygılı', 'kızgın', 'heyecanlı', 'sakin', 'stresli', 'umutlu', 'yorgun', 'enerjik']
  }],
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  triggers: [{
    type: String,
    enum: ['iş', 'aile', 'ilişkiler', 'sağlık', 'para', 'sosyal', 'okul', 'diğer']
  }],
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
moodSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
moodSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema); 