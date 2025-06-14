const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['psychologist', 'patient', 'admin'],
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    required: function() {
      return this.role === 'psychologist';
    }
  },
  experience: {
    type: Number,
    required: function() {
      return this.role === 'psychologist';
    }
  },
  license: {
    type: String,
    required: function() {
      return this.role === 'psychologist';
    }
  },
  bio: {
    type: String,
    maxlength: 500
  },
  profileImage: {
    type: String,
    default: null
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'patient';
    }
  },
  shareNameWithPsychologist: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 