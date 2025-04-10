const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  profileImageUrl: {
    type: String
  },
  preferences: {
    theme: {
      type: String,
      default: 'light'
    },
    notificationSettings: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  integrations: {
    notion: {
      connected: { type: Boolean, default: false },
      accessToken: { type: String }
    },
    gmail: {
      connected: { type: Boolean, default: false },
      accessToken: { type: String },
      refreshToken: { type: String }
    },
    linkedin: {
      connected: { type: Boolean, default: false },
      accessToken: { type: String }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 