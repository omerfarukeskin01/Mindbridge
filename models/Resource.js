const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'anksiyete',
      'depresyon', 
      'stres-yonetimi',
      'iliskiler',
      'ozguven',
      'uyku-problemleri',
      'ozbakım',
      'mindfulness',
      'genel-saglik',
      'diger'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  readingTime: {
    type: Number, // dakika cinsinden
    default: 5
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
resourceSchema.index({ title: 'text', content: 'text', tags: 'text' });
resourceSchema.index({ category: 1, isPublished: 1 });
resourceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema); 